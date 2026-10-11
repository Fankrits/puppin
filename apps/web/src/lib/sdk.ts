import Medusa from "@medusajs/js-sdk";

let MEDUSA_BACKEND_URL = "http://localhost:9000";

if (typeof import.meta !== "undefined" && import.meta.env?.VITE_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL;
}

const isBrowser = typeof window !== "undefined";

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: Boolean(typeof import.meta !== "undefined" && import.meta.env?.DEV),
  publishableKey:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_MEDUSA_PUBLISHABLE_KEY) ||
    (typeof process !== "undefined" && process.env?.VITE_MEDUSA_PUBLISHABLE_KEY) ||
    "pk_b376629daa89966aeef3688d96456353ea4709d17f55d126da2e2a3978297c36",
  auth: {
    type: "jwt",
    jwtTokenStorageKey: "medusa_auth_token",
    jwtTokenStorageMethod: isBrowser ? "local" : "memory",
  },
});
