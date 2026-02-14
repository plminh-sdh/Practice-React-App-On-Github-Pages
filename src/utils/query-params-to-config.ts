import type { Configuration } from "../models/configuration";

export function queryParamsToConfiguration(
  search: string,
  defaults: Configuration,
): Configuration {
  const params = new URLSearchParams(search);

  const cfg: Configuration = { ...defaults };

  const readNumber = (key: keyof Configuration) => {
    const v = params.get(String(key));
    if (v == null) return;
    const n = Number(v);
    if (!Number.isNaN(n)) {
      cfg[key] = n as any;
    }
  };

  // Helper to read string field
  const readString = (key: keyof Configuration) => {
    const v = params.get(String(key));
    if (v != null) {
      cfg[key] = v as any;
    }
  };

  // Helper to read string[] (messages)
  const readStringArray = (key: keyof Configuration) => {
    const values = params.getAll(String(key));
    if (values.length > 0) {
      // @ts-expect-error – dynamic assignment
      cfg[key] = values as any;
    }
  };

  // ---- map fields explicitly (recommended) ----

  readString("startText");
  readNumber("startTextFontSize");

  readString("text");
  readStringArray("messages");

  readString("font");
  readNumber("fontSize");
  readNumber("fontWeight");
  readNumber("maxTextWidth");

  readNumber("pixelSize");
  readNumber("pixelPadding");

  readNumber("phase1Duration");
  readNumber("phase2Duration");
  readNumber("phase3Duration");

  readNumber("outwardMin");
  readNumber("outwardMax");
  readNumber("inwardMin");
  readNumber("inwardMax");

  readNumber("sideOutwardMin");
  readNumber("sideOutwardMax");
  readNumber("sideInwardMin");
  readNumber("sideInwardMax");

  readNumber("transitionDuration");
  readNumber("transitionRadius");

  readStringArray("rainMessages");
  readNumber("rainDensity");
  readNumber("rainMinSpeed");
  readNumber("rainMaxSpeed");
  readNumber("rainMinFontSize");
  readNumber("rainMaxFontSize");
  readNumber("rainHueSpeed");

  return cfg;
}
