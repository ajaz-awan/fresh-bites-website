import type { ReactElement } from "react";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/lib/siteConfig";

export default function AboutPage(): ReactElement {
  return (
    <div style={{ backgroundColor: "var(--color-base)" }} className="min-h-screen pb-16">
      <div className="px-3 pt-3 md:px-6 md:pt-6">
        <Navbar />
      </div>

      {/* Header */}
      <section className="mx-auto max-w-4xl px-6 pt-8 text-center md:px-10">
        <h1
          className="text-4xl font-medium tracking-tight md:text-5xl"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
        >
          About {siteConfig.brand.shortName}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-black/70">
          We're a home kitchen in {siteConfig.delivery.city}, cooking the same food we'd
          serve our own family — nothing frozen, nothing rushed.
        </p>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-2xl px-6 py-12 md:px-10">
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{ backgroundColor: "rgba(107,30,35,0.05)" }}
        >
          <h2
            className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-primary)" }}
          >
            Our Story
          </h2>
          <p className="mt-4 leading-relaxed text-black/70">
            {siteConfig.brand.name} started in a home kitchen with a simple idea: food should
            taste like someone actually cooked it. Every order is made fresh the same day it's
            delivered — biryani, karahi, fast food, and cakes for celebrations — using the same
            spices and care as a home-cooked meal.
          </p>
        </div>
      </section>

      {/* Info grid */}
      <section className="mx-auto max-w-4xl px-6 pb-16 md:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <InfoCard title="Delivery Areas">
            <ul className="space-y-1 text-sm text-black/70">
              {siteConfig.delivery.areas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Order Hours">
            <p className="text-sm text-black/70">Mon–Sat: 11:00 AM – 9:00 PM</p>
            <p className="text-sm text-black/70">Sunday: 2:00 PM – 8:00 PM</p>
          </InfoCard>

          <InfoCard title="Get in Touch">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "var(--color-primary)" }}
            >
              WhatsApp us
            </a>
            <a
              href={siteConfig.contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "var(--color-primary)" }}
            >
              {siteConfig.contact.instagramHandle}
            </a>
          </InfoCard>
        </div>
      </section>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  children: ReactElement | ReactElement[];
}

function InfoCard({ title, children }: InfoCardProps): ReactElement {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{ borderColor: "rgba(43,35,32,0.08)" }}
    >
      <h3
        className="mb-3 text-sm font-semibold uppercase tracking-wide"
        style={{ color: "var(--color-primary)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
