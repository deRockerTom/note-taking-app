import { createClient } from "@hey-api/client-fetch";

export const backendFetchClient = createClient({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
});
