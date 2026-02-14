import type { Configuration } from "../models/configuration";

export function configurationToQueryParams(cfg: Configuration): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(cfg)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      // e.g. messages=hello&messages=world
      for (const item of value) {
        if (item === undefined || item === null) continue;
        params.append(key, String(item));
      }
      continue;
    }

    if (typeof value === "object") {
      // If you ever add nested objects, encode as JSON
      params.set(key, JSON.stringify(value));
      continue;
    }

    params.set(key, String(value));
  }

  return params.toString();
}
