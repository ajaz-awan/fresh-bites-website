import type { ReactElement } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function Footer(): ReactElement {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "var(--color-text)" }} className="mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: "var(--color-accent)", fontFamily: "var(--font-fraunces)" }}
              >
                {siteConfig.brand.logoInitial}
              </span>
              <span
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {siteConfig.brand.shortName}
              </span>
            </div>
            <p className="mt-3 text-sm text-white/60">{siteConfig.brand.tagline}</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Quick Links
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Get in Touch
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {siteConfig.contact.instagramHandle}
                </a>
              </li>
              <li className="text-sm text-white/70">
                Delivering to {siteConfig.delivery.areas.join(", ")}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          &copy; {currentYear} {siteConfig.brand.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
