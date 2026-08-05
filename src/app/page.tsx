import type { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/lib/siteConfig";

export default function HomePage(): ReactElement {
  return (
    <main
      className="min-h-screen px-3 py-3 md:px-6 md:py-6"
      style={{
        background:
          "linear-gradient(160deg, rgba(232,169,58,0.25) 0%, rgba(250,246,238,1) 55%)",
      }}
    >
      <div
        className="relative overflow-hidden rounded-[2.5rem]"
        style={{ backgroundColor: "var(--color-base)" }}
      >
        <Navbar  />

        {/* Hero */}
        <section className="relative px-6 pb-14 pt-4 md:px-10 md:pb-20">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-8">
            {/* Left: copy */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8" style={{ backgroundColor: "var(--color-text)" }} />
                <span className="text-xs font-semibold uppercase tracking-widest text-black/60">
                  Welcome to {siteConfig.brand.shortName}
                </span>
              </div>

              <h1
                className="text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
              >
                Real home-cooked
                <br />
                food, delivered fresh.
              </h1>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/menu"
                  className="rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  Order Now
                </Link>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-black/5"
                  style={{ borderColor: "var(--color-text)", color: "var(--color-text)" }}
                >
                  WhatsApp Us
                </a>
              </div>

              <div className="mt-10 text-sm">
                <p className="font-semibold uppercase tracking-wide text-black/50">
                  We deliver to
                </p>
                <p className="mt-1 font-medium" style={{ color: "var(--color-text)" }}>
                  {siteConfig.delivery.areas.join(" · ")}
                </p>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t pt-6" style={{ borderColor: "rgba(43,35,32,0.08)" }}>
                <Stat value="100%" label="Homemade" />
                <Stat value={`${siteConfig.delivery.areas.length}`} label="Areas covered" />
                <Stat value="Same-day" label="Fresh cooking" />
              </div>
            </div>

            {/* Right: image + floating badge + social icons inside */}
            <div className="relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] md:aspect-square">
                {/* Temporary stock photo (free Unsplash License) — replace with the
                    business's own food photography once available:
                    <Image src="/hero-food.jpg" alt="Fresh biryani" fill className="object-cover" /> */}
                <Image
                  src="https://images.unsplash.com/photo-1782541370275-6761522e39d1?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                  alt="Freshly served chicken biryani"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.25) 100%)" }} />

                {/* Social icons overlay - inside the image, top-right corner */}
                <div className="absolute right-4 top-4 flex gap-2">
                  <a
                    href={siteConfig.contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-transform hover:scale-110"
                    style={{ backgroundColor: "rgba(250,246,238,0.85)" }}
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-transform hover:scale-110"
                    style={{ backgroundColor: "rgba(250,246,238,0.85)" }}
                  >
                    <WhatsAppIcon />
                  </a>
                </div>
              </div>

              {/* Floating rating badge */}
              <div
                className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg md:left-8"
                style={{ backgroundColor: "var(--color-base)" }}
              >
                <div className="flex -space-x-2">
                  <span className="h-8 w-8 rounded-full border-2 border-white" style={{ backgroundColor: "var(--color-accent)" }} />
                  <span className="h-8 w-8 rounded-full border-2 border-white" style={{ backgroundColor: "var(--color-primary)" }} />
                  <span className="h-8 w-8 rounded-full border-2 border-white" style={{ backgroundColor: "var(--color-fresh)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                    Loved locally
                  </p>
                  <p className="text-xs text-black/50">Home-cooked, made to order</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Menu teaser (below the card) */}
      <section className="px-4 py-16 text-center md:px-6 md:py-24">
        <h2
          className="text-3xl font-medium tracking-tight md:text-4xl"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
        >
          Hungry already?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-black/70">
          From biryani to birthday cakes — see everything we make, with prices.
        </p>
        <Link
          href="/menu"
          className="mt-8 inline-block rounded-full px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Explore Full Menu
        </Link>
      </section>
    </main>
  );
}

interface StatProps {
  value: string;
  label: string;
}

function Stat({ value, label }: StatProps): ReactElement {
  return (
    <div>
      <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}>
        {value}
      </p>
      <p className="text-xs text-black/50">{label}</p>
    </div>
  );
}

function InstagramIcon(): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="var(--color-primary)" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon(): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-primary)">
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.1 0-.3 0-.4-.1-.1-.5-1.3-.7-1.8-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.4 3.9 3.4.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3z" />
    </svg>
  );
}