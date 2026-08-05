import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { siteConfig } from "@/lib/siteConfig";

const orderRequestSchema = z.object({
  customerName: z.string().trim().min(3),
  phone: z.string().trim().min(10),
  deliveryArea: z.string().min(1),
  streetAddress: z.string().trim().min(5),
  notes: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1),
});

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  const parsed = orderRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order data." }, { status: 400 });
  }

  const { customerName, phone, deliveryArea, streetAddress, notes, items } = parsed.data;

  // Re-fetch real prices from the database — we never trust price/cost figures
  // sent from the browser, since those could be tampered with before the
  // request reaches the server.
  const itemIds = items.map((item) => item.id);
  const { data: menuItems, error: menuError } = await supabaseAdmin
    .from("menu_items")
    .select("id, name, price, cost_price")
    .in("id", itemIds)
    .eq("business_id", siteConfig.businessId);

  if (menuError || !menuItems || menuItems.length === 0) {
    return NextResponse.json({ error: "Could not verify order items." }, { status: 400 });
  }

  const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));

  let totalRevenue = 0;
  let totalCost = 0;
  const orderLineItems = [];

  for (const requestedItem of items) {
    const realItem = menuItemMap.get(requestedItem.id);
    if (!realItem) {
      return NextResponse.json({ error: "One or more items are no longer available." }, { status: 400 });
    }

    const lineRevenue = realItem.price * requestedItem.quantity;
    const lineCost = realItem.cost_price * requestedItem.quantity;
    totalRevenue += lineRevenue;
    totalCost += lineCost;

    orderLineItems.push({
      id: realItem.id,
      name: realItem.name,
      price: realItem.price,
      cost_price: realItem.cost_price,
      quantity: requestedItem.quantity,
    });
  }

  const totalProfit = totalRevenue - totalCost;

  const { error: insertError } = await supabaseAdmin.from("orders").insert({
    business_id: siteConfig.businessId,
    customer_name: customerName,
    phone,
    delivery_area: deliveryArea,
    address: streetAddress,
    notes: notes && notes.length > 0 ? notes : null,
    items: orderLineItems,
    total_revenue: totalRevenue,
    total_cost: totalCost,
    total_profit: totalProfit,
  });

  if (insertError) {
    return NextResponse.json({ error: "Could not save order." }, { status: 500 });
  }

  return NextResponse.json({ success: true, totalRevenue });
}