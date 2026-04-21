/**
 * Central source of truth for company, contact, and platform-identity
 * information that appears on public marketing pages.
 */

export const COMPANY = {
  brand:        "Chainviax",
  legalName:    "Chainviax Markets Ltd",
  jurisdiction: "England & Wales, United Kingdom",
  address:      "27 Old Gloucester Street, London, WC1N 3AX, United Kingdom",
  registration: "Company No. 15248372",
  launchYear:   2026,
} as const;

export const CONTACT = {
  supportEmail:    "support@chainviax.com",
  securityEmail:   "security@chainviax.com",
  complianceEmail: "compliance@chainviax.com",
  privacyEmail:    "privacy@chainviax.com",

  businessHours:   "Monday – Friday, 09:00 – 18:00 UTC",
  generalResponseWindow:  "within one business day",
  securityResponseWindow: "within one business day",
} as const;

export const PLATFORM = {
  listedAssets: 15,
  quoteCurrency: "USD",
  orderTypes: ["Market", "Limit", "Stop"] as const,
  dataFreshnessMinutes: 1,
} as const;

export type CompanyInfo = typeof COMPANY;
export type ContactInfo = typeof CONTACT;
export type PlatformInfo = typeof PLATFORM;
