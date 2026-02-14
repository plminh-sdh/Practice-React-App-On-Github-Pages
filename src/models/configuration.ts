export interface Configuration {
  startText: string;
  startTextFontSize: number;
  text: string;
  messages: string[];
  font: string;
  fontSize: number;
  fontWeight: number;
  maxTextWidth: number;
  pixelSize?: number;
  pixelPadding?: number;
  phase1Duration?: number;
  phase2Duration?: number;
  phase3Duration?: number;
  outwardMin?: number;
  outwardMax?: number;
  inwardMin?: number;
  inwardMax?: number;

  sideOutwardMin?: number;
  sideOutwardMax?: number;
  sideInwardMin?: number;
  sideInwardMax?: number;

  transitionDuration?: number;
  transitionRadius?: number;

  rainMessages?: string[];
  rainDensity?: number;
  rainMinSpeed?: number;
  rainMaxSpeed?: number;
  rainMinFontSize?: number;
  rainMaxFontSize?: number;
  rainHueSpeed?: number;
}
