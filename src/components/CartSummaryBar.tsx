"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartSummaryBar(): ReactElement | null {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:px-6 md:pb-6">
      <Link
        href="/checkout"
        className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-6 py-4 text-white shadow-xl transition-transform hover:scale-[1.01]"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <span className="text-sm font-semibold">
          {totalItems} item{totalItems > 1 ? "s" : ""} in cart
        </span>
        <span className="text-sm font-semibold">
          Rs. {totalPrice.toLocaleString()} &rarr; View Cart
        </span>
      </Link>
    </div>
  );
}
