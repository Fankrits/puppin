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
    typeof import.meta !== "undefined" ? import.meta.env?.VITE_MEDUSA_PUBLISHABLE_KEY : undefined,
  auth: {
    type: "jwt",
    jwtTokenStorageKey: "medusa_auth_token",
    jwtTokenStorageMethod: isBrowser ? "local" : "memory",
  },
});
