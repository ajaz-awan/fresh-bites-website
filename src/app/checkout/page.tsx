"use client";

import { useState, type ReactElement, type FormEvent } from "react";
import Link from "next/link";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/lib/siteConfig";
import { supabase } from "@/lib/supabaseClient";
import type { OrderLineItem } from "@/types";

// Validates the checkout form before we build the WhatsApp message.
// This is client-side only (easy to bypass), so it's about catching
// honest mistakes — not a security or fraud-prevention layer.
const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(3, "Please enter your full name (at least 3 characters)."),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number."),
  deliveryArea: z
    .string()
    .refine(
      (value) => (siteConfig.delivery.areas as readonly string[]).includes(value),
      "Please select one of our delivery areas."
    ),
  streetAddress: z
    .string()
    .trim()
    .min(5, "Please enter your house/street address."),
  notes: z.string().trim().optional(),
});

type CheckoutFormErrors = Partial<Record<keyof z.infer<typeof checkoutSchema>, string>>;

export default function CheckoutPage(): ReactElement {
  const { items, increaseQuantity, decreaseQuantity, removeItem, totalPrice, clearCart } = useCart();

  const [customerName, setCustomerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [deliveryArea, setDeliveryArea] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<CheckoutFormErrors>({});

  const buildWhatsAppMessage = (): string => {
    const lines: string[] = [];
    lines.push(`Hi ${siteConfig.brand.shortName}! I'd like to place an order:`);
    lines.push("");

    items.forEach((item) => {
      lines.push(`- ${item.name} x${item.quantity} — Rs. ${(item.price * item.quantity).toLocaleString()}`);
    });

    lines.push("");
    lines.push(`Total: Rs. ${totalPrice.toLocaleString()}`);
    lines.push("");
    lines.push(`Name: ${customerName}`);
    lines.push(`Phone: ${phone}`);
    lines.push(`Delivery Area: ${deliveryArea}`);
    lines.push(`Address: ${streetAddress}`);
    if (notes.trim()) {
      lines.push(`Notes: ${notes}`);
    }

    return lines.join("\n");
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const result = checkoutSchema.safeParse({
      customerName,
      phone,
      deliveryArea,
      streetAddress,
      notes,
    });

    if (!result.success) {
      const fieldErrors: CheckoutFormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof z.infer<typeof checkoutSchema>;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const orderItems: OrderLineItem[] = items.map((item) => ({
      name: item.name,
      price: item.price,
      cost_price: item.cost_price,
      quantity: item.quantity,
    }));

    const totalRevenue: number = totalPrice;
    const totalCost: number = items.reduce(
      (sum, item) => sum + item.cost_price * item.quantity,
      0
    );
    const totalProfit: number = totalRevenue - totalCost;

    // Save the order for sales/profit tracking. If this fails (e.g. no
    // internet), we still let the customer complete their order via
    // WhatsApp rather than blocking them — losing a record is better than
    // losing a sale.
    const { error } = await supabase.from("orders").insert({
      business_id: siteConfig.businessId,
      customer_name: customerName,
      phone,
      delivery_area: deliveryArea,
      address: streetAddress,
      notes: notes.trim() || null,
      items: orderItems,
      total_revenue: totalRevenue,
      total_cost: totalCost,
      total_profit: totalProfit,
    });

    if (error) {
      console.error("Could not save order record:", error.message);
    }

    setIsSubmitting(false);
    const message = buildWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodedMessage}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: "var(--color-base)" }} className="min-h-screen">
        <div className="px-3 pt-3 md:px-6 md:pt-6">
          <Navbar />
        </div>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1
            className="text-3xl font-medium"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
          >
            Your cart is empty
          </h1>
          <p className="mt-3 text-black/60">Add something delicious from the menu first.</p>
          <Link
            href="/menu"
            className="mt-8 inline-block rounded-full px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--color-base)" }} className="min-h-screen pb-16">
      <div className="px-3 pt-3 md:px-6 md:pt-6">
        <Navbar />
      </div>

      <section className="mx-auto max-w-3xl px-6 pt-6 md:px-10">
        <h1
          className="text-4xl font-medium tracking-tight"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
        >
          Your Order
        </h1>
        <p className="mt-2 text-black/60">
          Review your items, add your details, then confirm on WhatsApp.
        </p>

        {/* Cart items */}
        <div className="mt-8 divide-y" style={{ borderColor: "rgba(43,35,32,0.08)" }}>
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-semibold" style={{ color: "var(--color-text)" }}>
                  {item.name}
                </p>
                <p className="text-sm text-black/50">Rs. {item.price.toLocaleString()} each</p>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-3 rounded-full px-2 py-1"
                  style={{ backgroundColor: "rgba(107,30,35,0.08)" }}
                >
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.id)}
                    aria-label="Decrease quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    −
                  </button>
                  <span className="min-w-[1rem] text-center text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                    aria-label="Increase quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="text-sm text-black/40 transition-colors hover:text-black/70"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 flex items-center justify-between border-t pt-6" style={{ borderColor: "rgba(43,35,32,0.08)" }}>
          <span className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
            Total
          </span>
          <span className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>
            Rs. {totalPrice.toLocaleString()}
          </span>
        </div>

        {/* Customer details form */}
        <form onSubmit={handleSubmit} noValidate className="mt-10 flex flex-col gap-5">
          <FormField
            id="name"
            label="Your Name"
            value={customerName}
            onChange={setCustomerName}
            placeholder="e.g. Ayesha Khan"
            error={errors.customerName}
          />

          <FormField
            id="phone"
            label="Phone Number"
            value={phone}
            onChange={setPhone}
            placeholder="03XXXXXXXXX"
            error={errors.phone}
            type="tel"
          />

          <div>
            <label htmlFor="deliveryArea" className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              Delivery Area
            </label>
            <select
              id="deliveryArea"
              value={deliveryArea}
              onChange={(e) => setDeliveryArea(e.target.value)}
              className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none"
              style={{ borderColor: errors.deliveryArea ? "#b91c1c" : "rgba(43,35,32,0.15)" }}
            >
              <option value="">Select your area</option>
              {siteConfig.delivery.areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            {errors.deliveryArea && (
              <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>
                {errors.deliveryArea}
              </p>
            )}
            <p className="mt-1 text-xs text-black/40">
              We currently only deliver within {siteConfig.delivery.city}, to the areas listed above.
            </p>
          </div>

          <div>
            <label htmlFor="streetAddress" className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              House / Street Address
            </label>
            <textarea
              id="streetAddress"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="House #, street, nearby landmark"
              rows={3}
              className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none"
              style={{ borderColor: errors.streetAddress ? "#b91c1c" : "rgba(43,35,32,0.15)" }}
            />
            {errors.streetAddress && (
              <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>
                {errors.streetAddress}
              </p>
            )}
          </div>

          <FormField
            id="notes"
            label="Notes (optional)"
            value={notes}
            onChange={setNotes}
            placeholder="e.g. less spicy, ring the bell"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-full px-8 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {isSubmitting ? "Placing Order..." : "Confirm Order on WhatsApp"}
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-black/40 transition-colors hover:text-black/70"
          >
            Clear cart
          </button>
        </form>
      </section>
    </div>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
}

function FormField({ id, label, value, onChange, placeholder, error, type = "text" }: FormFieldProps): ReactElement {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--color-text)" }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
        style={{ borderColor: error ? "#b91c1c" : "rgba(43,35,32,0.15)" }}
      />
      {error && (
        <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}
    </div>
  );
}
