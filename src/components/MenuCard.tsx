"use client";

import type { ReactElement } from "react";
import type { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps): ReactElement {
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();

  const cartItem = items.find((cartItem) => cartItem.id === item.id);
  const quantity: number = cartItem?.quantity ?? 0;

  return (
    <div
      className="flex flex-col overflow-hidden rounded-3xl border"
      style={{ borderColor: "rgba(43,35,32,0.08)", backgroundColor: "var(--color-base)" }}
    >
      {/* Image area */}
      <div
        className="flex aspect-[4/3] w-full items-center justify-center"
        style={{ backgroundColor: "rgba(107,30,35,0.06)" }}
      >
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs" style={{ color: "var(--color-primary)" }}>
            Photo coming soon
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
        >
          {item.name}
        </h3>

        {item.description && (
          <p className="mt-1 text-sm text-black/60">{item.description}</p>
        )}

        <div className="mt-4 flex flex-1 items-end justify-between">
          <span className="text-base font-semibold" style={{ color: "var(--color-primary)" }}>
            Rs. {item.price.toLocaleString()}
          </span>

          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => addItem(item)}
              className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Add
            </button>
          ) : (
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
                {quantity}
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
          )}
        </div>
      </div>
    </div>
  );
}
