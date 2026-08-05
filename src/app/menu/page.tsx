import type { ReactElement } from "react";
import Navbar from "@/components/Navbar";
import MenuCard from "@/components/MenuCard";
import CartSummaryBar from "@/components/CartSummaryBar";
import { supabase } from "@/lib/supabaseClient";
import { siteConfig } from "@/lib/siteConfig";
import type { MenuItem } from "@/types";

// Cache this page's data for 5 minutes. Menu items rarely change minute to
// minute, so re-fetching from Supabase on every single visit isn't worth it —
// this makes the page load instantly for most visitors while still staying
// fresh enough for day-to-day menu updates.
export const revalidate = 300;

export default async function MenuPage(): Promise<ReactElement> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("business_id", siteConfig.businessId)
    .order("category", { ascending: true });

  const menuItems: MenuItem[] = error ? [] : ((data as MenuItem[]) ?? []);
  const hasError: boolean = Boolean(error);

  // Group items by category so the page renders section by section
  const groupedItems: Record<string, MenuItem[]> = menuItems.reduce(
    (groups, item) => {
      const category = item.category ?? "Other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    },
    {} as Record<string, MenuItem[]>
  );

  const categories: string[] = Object.keys(groupedItems);

  return (
    <div style={{ backgroundColor: "var(--color-base)" }} className="min-h-screen pb-28">
      <div className="px-3 pt-3 md:px-6 md:pt-6">
        <Navbar />
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-10 pt-6 md:px-10">
        <h1
          className="text-4xl font-medium tracking-tight md:text-5xl"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
        >
          Our Menu
        </h1>
        <p className="mt-2 text-black/60">
          Everything is made fresh, same day. Add what you like, then confirm on WhatsApp.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 md:px-10">
        {hasError && (
          <p className="py-16 text-center text-sm text-black/50">
            Couldn't load the menu right now. Please try again shortly.
          </p>
        )}

        {!hasError && menuItems.length === 0 && (
          <p className="py-16 text-center text-sm text-black/50">
            No menu items yet — check back soon.
          </p>
        )}

        {!hasError &&
          categories.map((category) => (
            <div key={category} className="mb-12">
              <h2
                className="mb-5 text-xl font-semibold"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-primary)" }}
              >
                {category}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {groupedItems[category].map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
      </section>

      <CartSummaryBar />
    </div>
  );
}
