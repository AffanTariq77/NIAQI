// Stripe Configuration
export const STRIPE_CONFIG = {
  // Your Stripe publishable key from Stripe Dashboard
  PUBLISHABLE_KEY:
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51Sc3o43f4cU2mk6c9EpJ2omzaRPowDjk6SN1kcpSxuZ9T2B7zszomdzxaUlcS512C58s8BhKQ0pr9UAdDLII6lmNj00Je1GHiH",

  // Merchant display name
  MERCHANT_NAME: "NIAQI",

  // Return URL for payment completion
  RETURN_URL: "niaqi://stripe-redirect",
};
