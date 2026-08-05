"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps): ReactElement | null {
  const { items, increaseQuantity, decreaseQuantity, removeItem, totalItems, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col shadow-2xl"
        style={{ backgroundColor: "var(--color-base)" }}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-5"
          style={{ borderColor: "rgba(43,35,32,0.08)" }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
          >
            Your Cart {totalItems > 0 && `(${totalItems})`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-black/50">Your cart is empty.</p>
              <Link
                href="/menu"
                onClick={onClose}
                className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="flex flex-col divide-y" style={{ borderColor: "rgba(43,35,32,0.06)" }}>
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium" style={{ color: "var(--color-text)" }}>
                      {item.name}
                    </p>
                    <p className="text-xs text-black/50">Rs. {item.price.toLocaleString()} each</p>
                  </div>

                  <div
                    className="flex items-center gap-2.5 rounded-full px-1.5 py-1"
                    style={{ backgroundColor: "rgba(107,30,35,0.08)" }}
                  >
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label={`Decrease ${item.name} quantity`}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      −
                    </button>
                    <span className="min-w-[0.75rem] text-center text-xs font-semibold" style={{ color: "var(--color-text)" }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      aria-label={`Increase ${item.name} quantity`}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="text-black/30 transition-colors hover:text-black/60"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-5" style={{ borderColor: "rgba(43,35,32,0.08)" }}>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-black/60">Total</span>
              <span className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>
                Rs. {totalPrice.toLocaleString()}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block rounded-full py-3.5 text-center text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Go to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

function CloseIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function TrashIcon(): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z" />
    </svg>
  );
}
