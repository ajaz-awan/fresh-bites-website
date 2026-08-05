// lib/siteConfig.ts
// Central config — future client ke liye sirf yeh file change karni hai, code nahi.

export const siteConfig = {
  businessId: "fresh-bites", // matches business_id column in Supabase

  brand: {
    name: "KHK Fresh Bites",
    shortName: "Fresh Bites",
    tagline: "Homemade meals, delivered fresh across KHK",
    logoInitial: "FB", // used in navbar badge if no logo image
  },

  contact: {
    whatsappNumber: "03011503567", // country code, no + or spaces
    instagramHandle: "@faisalabadfreshbites",
    instagramUrl: "https://instagram.com/faisalabadfreshbites",
  },

  delivery: {
    areas: ["KHK ", "KASOKI", "HNJ"],
    city: "KOT HASSAN KHAN",
  },

  theme: {
    base: "#FAF6EE",
    primary: "#6B1E23", // deep maroon
    accent: "#E8A93A", // marigold/saffron
    text: "#2B2320",
    fresh: "#4C7A5E", // used for veg/fresh tags
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "About", href: "/about" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;