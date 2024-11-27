import {
  createCookie,
  createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";

// In this example the Cookie is created separately.
export const sessionCookie = createCookie("__session", {
  secrets: ["r3m1xr0ck5"],
  sameSite: true,
});

export function sessionWraper(kv: KVNamespace) {
  return createWorkersKVSessionStorage({
    // The KV Namespace where you want to store sessions
    kv: kv,
    cookie: sessionCookie,
  });
}
