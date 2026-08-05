"use client";

import { useState, type ReactElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function Navbar(): ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { totalItems } = useCart();
  const pathname = usePathname();

  const toggleMenu = (): void => setIsOpen((prev) => !prev);
  const closeMenu = (): void => setIsOpen(false);
  const openCart = (): void => setIsCartOpen(true);
  const closeCart = (): void => setIsCartOpen(false);

  return (
    <header className="relative z-50">
      <nav className="flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--color-primary)", fontFamily: "var(--font-fraunces)" }}
          >
            {siteConfig.brand.logoInitial}
          </span>
          <span
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
          >
            {siteConfig.brand.shortName}
          </span>
        </Link>

        {/* Centered desktop nav */}
        <ul className="hidden items-center gap-2 md:flex">
          {siteConfig.nav.map((item) => {
            const isActive: boolean = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    color: isActive ? "white" : "var(--color-text)",
                    backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "rgba(107,30,35,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: cart + mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-white transition-all hover:scale-105 hover:brightness-110"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            <CartIcon />
            {totalItems > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {totalItems}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5 md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <MenuIcon isOpen={isOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="px-6 pb-5 md:hidden">
          <ul className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => {
              const isActive: boolean = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block rounded-xl px-4 py-2.5 text-base font-medium transition-colors"
                    style={{
                      color: isActive ? "white" : "var(--color-text)",
                      backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </header>
  );
}

function CartIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

interface MenuIconProps {
  isOpen: boolean;
}

function MenuIcon({ isOpen }: MenuIconProps): ReactElement {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
    </svg>
  );
}
