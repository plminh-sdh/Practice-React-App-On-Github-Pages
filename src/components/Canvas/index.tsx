import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Configuration } from "../../models/configuration";
import type { Particle } from "../../models/particle";
import { popRandom } from "../../utils/pop-random";
import { CanvasWrapper, CustomCanvas } from "./styles";
import {
  clamp01,
  easeInOutCubic,
  easeOutBack,
  lerp,
  rand,
} from "../../utils/animation-utils";
import type { Rain } from "../../models/rain";
import { useBackgroundMusic } from "../../hooks/useBackgroundMusic";

type Props = {
  configuration: Configuration;
  isPlaying: boolean;
};

export default function Canvas({ configuration, isPlaying }: Readonly<Props>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const dprRef = useRef(1);
  const particlesRef = useRef<Particle[]>([]);
  const originalParticlesRef = useRef<Particle[]>([]);
  const rainRef = useRef<Rain[]>([]);
  const rainHueRef = useRef(0);

  const rafIdRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const morphRef = useRef({
    startTime: 0,
    running: false,
    phase0Committed: false,
  });
  const morphEndedRef = useRef(false);
  const lastTickTimeRef = useRef<number | null>(null);

  const [messageIndex, setMessageIndex] = useState<number | null>(null);

  const messages = useMemo(() => configuration.messages ?? [], [configuration]);

  const isStartScreen = isPlaying && messageIndex === null;
  const isShowingMessages = isPlaying && messageIndex !== null;

  const bgMusicUrl = `${import.meta.env.BASE_URL}background-music.mp3`;
  console.log("Base url", import.meta.env.BASE_URL);
  useBackgroundMusic(bgMusicUrl, isShowingMessages);

  const displayText = useMemo(() => {
    if (isStartScreen) return messages[0];
    if (isShowingMessages) return messages[messageIndex!] ?? "";
    return configuration.text ?? "";
  }, [
    isStartScreen,
    isShowingMessages,
    messages,
    messageIndex,
    configuration.text,
  ]);

  const pixelSize = useMemo(() => {
    if (!configuration.pixelSize || configuration.pixelSize < 2) return 2;
    return configuration.pixelSize;
  }, [configuration]);

  const pixelPadding = useMemo(() => {
    if (
      Number.isNaN(configuration.pixelPadding) ||
      configuration.pixelPadding! < 0
    )
      return 0;
    return configuration.pixelPadding!;
  }, [configuration]);

  const d0 = useMemo(
    () => configuration.transitionDuration ?? 500,
    [configuration],
  );

  const wanderRadius = useMemo(
    () => configuration.transitionRadius ?? 5,
    [configuration],
  );

  const d1 = useMemo(
    () => configuration.phase1Duration ?? 100,
    [configuration],
  );
  const d2 = useMemo(
    () => configuration.phase2Duration ?? 100,
    [configuration],
  );
  const d3 = useMemo(
    () => configuration.phase3Duration ?? 100,
    [configuration],
  );

  const outwardMin = useMemo(() => {
    if (
      configuration.outwardMin === null ||
      configuration.outwardMin === undefined
    ) {
      return 0;
    }
    return configuration.outwardMin;
  }, [configuration]);
  const outwardMax = useMemo(
    () => configuration.outwardMax ?? 5,
    [configuration],
  );
  const inwardMin = useMemo(() => {
    if (
      configuration.inwardMin === null ||
      configuration.inwardMin === undefined
    ) {
      return 0;
    }
    return configuration.inwardMin;
  }, [configuration]);
  const inwardMax = useMemo(
    () => configuration.inwardMax ?? 5,
    [configuration],
  );

  const sideOutwardMin = useMemo(() => {
    if (
      configuration.sideOutwardMin === null ||
      configuration.sideOutwardMin === undefined
    ) {
      return 0;
    }
    return configuration.sideOutwardMin;
  }, [configuration]);
  const sideOutwardMax = useMemo(
    () => configuration.sideOutwardMax ?? 5,
    [configuration],
  );
  const sideInwardMin = useMemo(() => {
    if (
      configuration.sideInwardMin === null ||
      configuration.sideInwardMin === undefined
    ) {
      return 0;
    }
    return configuration.sideInwardMin;
  }, [configuration]);
  const sideInwardMax = useMemo(
    () => configuration.sideInwardMax ?? 5,
    [configuration],
  );

  const rainMessages = useMemo(
    () =>
      configuration.rainMessages?.length
        ? configuration.rainMessages
        : ["HELLO"],
    [configuration],
  );

  const rainDensity = useMemo(
    () => configuration.rainDensity ?? 3,
    [configuration],
  );

  const rainMinSpeed = useMemo(
    () => configuration.rainMinSpeed ?? 1,
    [configuration],
  );
  const rainMaxSpeed = useMemo(
    () => configuration.rainMinSpeed ?? 1,
    [configuration],
  );
  const rainMinFontSize = useMemo(
    () => configuration.rainMinFontSize ?? 12,
    [configuration],
  );
  const rainMaxFontSize = useMemo(
    () => configuration.rainMaxFontSize ?? 24,
    [configuration],
  );

  const rainHueSpeed = useMemo(
    () => configuration.rainHueSpeed ?? 20,
    [configuration],
  );

  // small unique jitter to avoid exact overlaps
  const EPS = 0.35; // <= sub-pixel jitter is enough

  const clearRect = useCallback(() => {
    const context = contextRef.current;
    if (!context) return;

    const { w, h } = sizeRef.current;

    context.clearRect(0, 0, w, h);
  }, []);

  // Wrap and paint text
  const paintText = useCallback(() => {
    const context = contextRef.current;
    if (!context) return;

    const { w, h } = sizeRef.current;

    context.fillStyle = "#fff";
    context.font = `${configuration.fontWeight} ${configuration.fontSize}px ${configuration.font}`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    const maxTextWidth = (w * configuration.maxTextWidth) / 100;
    const text = displayText;
    const words = text.split(" ");
    const lines: string[] = [];

    let line = "";
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      if (context.measureText(testLine).width > maxTextWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);

    const lineHeight = configuration.fontSize * 1.2;
    const startY = h / 2 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
      context.fillText(line, w / 2, startY + index * lineHeight);
    });
  }, [configuration, displayText]);

  const convertToParticles = useCallback(() => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;

    const dpr = dprRef.current;
    const imgW = canvas.width;
    const imgH = canvas.height;

    const { data } = context.getImageData(0, 0, imgW, imgH);
    const step = Math.max(1, Math.floor(pixelSize * dpr));
    const pixels: Array<{ x: number; y: number }> = [];
    for (let y = 0; y < imgH; y += step) {
      for (let x = 0; x < imgW; x += step) {
        const i = (y * imgW + x) * 4;
        const a = data[i + 3];
        if (a > 0) {
          pixels.push({ x: x / dpr, y: y / dpr });
        }
      }
    }

    const { w, h } = sizeRef.current;
    const cx = w / 2;
    const cy = h / 2;

    const prev = particlesRef.current;
    originalParticlesRef.current = prev.map((p) => ({ ...p }));
    const original = originalParticlesRef.current;
    const available = original.slice();
    const next: Particle[] = [];

    // 2) Loop through scanned pixels and assign destinations
    for (const { x, y } of pixels) {
      // If particlesRef is not empty: randomly take out without replacement
      let p = popRandom(available);

      if (!p) {
        // If all taken out but more pixels: randomly select from original set
        if (original.length > 0) {
          const base = original[Math.floor(Math.random() * original.length)];
          p = { ...base }; // clone so we can assign a new destination
        } else {
          // If original set is empty: create new particle at pixel position
          p = { x, y, destinationX: x, destinationY: y };
        }
      }

      p.wanderOX ??= 0;
      p.wanderOY ??= 0;
      p.wanderVX ??= (Math.random() - 0.5) * 0.4;
      p.wanderVY ??= (Math.random() - 0.5) * 0.4;

      // Assign destination from pixel coords
      p.destinationX = x;
      p.destinationY = y;

      const jitterX = (Math.random() - 0.5) * EPS;
      const jitterY = (Math.random() - 0.5) * EPS;

      // Ensure start positions (current pos)
      p.startX = p.x;
      p.startY = p.y;

      // Vector from center to final destination
      const vx = x - cx;
      const vy = y - cy;
      const len = Math.hypot(vx, vy) || 1;
      const nx = vx / len;
      const ny = vy / len;

      // Quadrant signs for side offsets
      const signX = x < cx ? -1 : 1;
      const signY = y < cy ? -1 : 1;

      // ----------------------
      // Phase 1: OUTWARD (zoom out)
      // radial outward
      const out = rand(outwardMin, outwardMax);

      // side outward (axis-based)
      const sideOutX = rand(sideOutwardMin, sideOutwardMax) * signX;
      const sideOutY = rand(sideOutwardMin, sideOutwardMax) * signY;

      // combine
      p.p1x = x + nx * out + sideOutX + jitterX;
      p.p1y = y + ny * out + sideOutY + jitterY;

      // ----------------------
      // Phase 2: INWARD (zoom in)
      // radial inward (toward center)
      const inn = rand(inwardMin, inwardMax);

      // side inward: still "towards center" on each axis (so opposite sign)
      const sideInX = rand(sideInwardMin, sideInwardMax) * -signX;
      const sideInY = rand(sideInwardMin, sideInwardMax) * -signY;

      // combine
      p.p2x = x - nx * inn + sideInX - jitterX;
      p.p2y = y - ny * inn + sideInY - jitterY;

      next.push(p);
    }

    particlesRef.current = next;

    if (isStartScreen) {
      clearRect();
      context.fillStyle = "#fff";
      context.shadowColor = "#fff";
      context.shadowBlur = 5;

      for (const p of particlesRef.current) {
        context.fillRect(
          p.x,
          p.y,
          (pixelSize - pixelPadding) * dprRef.current,
          (pixelSize - pixelPadding) * dprRef.current,
        );
      }
      return;
    }

    // Message mode OR normal mode: restart morph
    morphRef.current.startTime = performance.now();
    morphRef.current.running = true;
    morphRef.current.phase0Committed = false;
    morphEndedRef.current = false;
  }, [
    pixelSize,
    outwardMax,
    outwardMin,
    inwardMax,
    inwardMin,
    sideOutwardMax,
    sideOutwardMin,
    sideInwardMax,
    sideInwardMin,
    isStartScreen,
    clearRect,
    pixelPadding,
  ]);

  // Repaint the canvas and the text
  const repaint = useCallback(() => {
    clearRect();

    paintText();

    convertToParticles();
  }, [clearRect, paintText, convertToParticles]);

  const spawnRain = useCallback(() => {
    const { w } = sizeRef.current;

    if (Math.random() * 100 > rainDensity) return;

    const msg = rainMessages[Math.floor(Math.random() * rainMessages.length)];
    const fontSize =
      rainMinFontSize + Math.random() * (rainMaxFontSize - rainMinFontSize);
    const speed = rainMinSpeed + Math.random() * (rainMaxSpeed - rainMinSpeed);

    rainRef.current.push({
      x: Math.random() * w,
      y: 0,
      message: msg,
      fontSize,
      speed,
    });
  }, [
    rainDensity,
    rainMessages,
    rainMinFontSize,
    rainMaxFontSize,
    rainMinSpeed,
    rainMaxSpeed,
  ]);

  const drawRain = useCallback(
    (dt: number) => {
      const ctx = contextRef.current;
      if (!ctx) return;

      const { h } = sizeRef.current;

      ctx.shadowBlur = 0;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";

      const next: Rain[] = [];
      clearRect();
      const hue = rainHueRef.current;

      for (const drop of rainRef.current) {
        drop.y += drop.speed * dt;

        ctx.font = `${drop.fontSize}px ${configuration.font}`;

        const chars = drop.message.split("");
        const charSpacing = drop.fontSize * 0.2;
        const stepY = drop.fontSize + charSpacing;

        // bottom char is at drop.y
        const topCharY = drop.y - (chars.length - 1) * stepY;

        // width of the fading column
        const padX = drop.fontSize * 0.7;

        // LOOP TOP -> BOTTOM (important for stacking)
        for (let i = 0; i < chars.length; i++) {
          const y = topCharY + i * stepY;

          // 1) draw the character
          const lightness = 50 + (i / chars.length) * 30;
          ctx.fillStyle = `hsl(${hue} 100% ${lightness}%)`;
          ctx.fillText(chars[i], drop.x, y);

          // 2) apply fade from THIS character up to the top character
          // lower letters will apply this rect again, darkening top more times
          ctx.fillStyle = "rgba(0,0,0,0.12)";
          ctx.fillRect(
            drop.x - padX,
            topCharY - drop.fontSize, // a bit above the top char
            padX * 2,
            y - (topCharY - drop.fontSize) + drop.fontSize * 0.2,
          );
        }

        // keep if still visible
        const totalHeight = (chars.length - 1) * stepY + drop.fontSize;
        if (topCharY < h + totalHeight) next.push(drop);
      }

      rainRef.current = next;
    },
    [configuration.font, clearRect],
  );

  const updateFrame = useCallback(
    (now: number) => {
      const m = morphRef.current;
      if (!m.running) return;

      const t = now - m.startTime;

      const t0 = d0;
      const t1 = d0 + d1;
      const t2 = d0 + d1 + d2;
      const t3 = d0 + d1 + d2 + d3;

      let phase: 0 | 1 | 2 | 3;
      if (t < t0) phase = 0;
      else if (t < t1) phase = 1;
      else if (t < t2) phase = 2;
      else if (t < t3) phase = 3;
      else {
        m.running = false;
        for (const p of particlesRef.current) {
          p.x = p.destinationX;
          p.y = p.destinationY;
        }

        if (!morphEndedRef.current) {
          morphEndedRef.current = true;

          // advance message (only if we are in message mode)
          if (isShowingMessages) {
            setMessageIndex((idx) => {
              if (idx === null) return idx;
              const nextIdx = idx + 1;
              return nextIdx < messages.length ? nextIdx : idx;
            });
          }
        }

        return;
      }

      if (phase === 1 && !m.phase0Committed) {
        m.phase0Committed = true;
        for (const p of particlesRef.current) {
          p.startX = p.x;
          p.startY = p.y;
        }
      }

      for (const p of particlesRef.current) {
        const sx = p.startX ?? p.x;
        const sy = p.startY ?? p.y;
        const p1x = p.p1x ?? p.destinationX;
        const p1y = p.p1y ?? p.destinationY;
        const p2x = p.p2x ?? p.destinationX;
        const p2y = p.p2y ?? p.destinationY;
        const dx = p.destinationX;
        const dy = p.destinationY;

        if (phase === 0) {
          const u = clamp01(t / d0);
          const ease = easeInOutCubic(u);

          const maxR = wanderRadius * ease;

          const accel = 0.5;
          const friction = 0.98;
          const maxSpeed = 10;

          p.wanderOX ??= 0;
          p.wanderOY ??= 0;
          p.wanderVX ??= (Math.random() - 0.5) * 0.4;
          p.wanderVY ??= (Math.random() - 0.5) * 0.4;

          p.wanderVX += (Math.random() - 0.5) * accel;
          p.wanderVY += (Math.random() - 0.5) * accel;

          p.wanderVX *= friction;
          p.wanderVY *= friction;

          const sp = Math.hypot(p.wanderVX, p.wanderVY);
          if (sp > maxSpeed) {
            const s = maxSpeed / (sp || 1);
            p.wanderVX *= s;
            p.wanderVY *= s;
          }

          let ox = p.wanderOX + p.wanderVX;
          let oy = p.wanderOY + p.wanderVY;

          const d = Math.hypot(ox, oy);
          if (d > maxR) {
            const s = maxR / (d || 1);
            ox *= s;
            oy *= s;

            p.wanderVX *= -0.4;
            p.wanderVY *= -0.4;
          }

          p.wanderOX = ox;
          p.wanderOY = oy;

          p.x = sx + ox;
          p.y = sy + oy;
        } else if (phase === 1) {
          const u = easeInOutCubic(clamp01((t - d0) / d1));
          p.x = lerp(sx, p1x, u);
          p.y = lerp(sy, p1y, u);
        } else if (phase === 2) {
          const u = easeInOutCubic(clamp01((t - (d0 + d1)) / d2));
          p.x = lerp(p1x, p2x, u);
          p.y = lerp(p1y, p2y, u);
        } else {
          const u = easeOutBack(clamp01((t - (d0 + d1 + d2)) / d3));
          p.x = lerp(p2x, dx, u);
          p.y = lerp(p2y, dy, u);
        }
      }
    },
    [d0, d1, d2, d3, wanderRadius, isShowingMessages, messages.length],
  );

  const drawFrame = useCallback(() => {
    const context = contextRef.current;
    if (!context) return;
    context.fillStyle = "#fff";
    context.shadowColor = "#fff";
    context.shadowBlur = 5;

    for (const p of particlesRef.current) {
      context.fillRect(
        p.x,
        p.y,
        (pixelSize - pixelPadding) * dprRef.current,
        (pixelSize - pixelPadding) * dprRef.current,
      );
    }
  }, [clearRect, pixelSize, pixelPadding]);

  const startAnimation = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const tick = (now: number) => {
      if (!isRunningRef.current) return;

      const last = lastTickTimeRef.current ?? now;
      const dt = (now - last) / 1000; // seconds
      lastTickTimeRef.current = now;
      rainHueRef.current = (rainHueRef.current + rainHueSpeed * dt) % 360;

      spawnRain();
      drawRain(dt);

      updateFrame(now);
      drawFrame();

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
  }, [updateFrame, drawFrame, spawnRain, drawRain, rainHueSpeed]);

  const stopAnimation = useCallback(() => {
    isRunningRef.current = false;
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const paintStartText = useCallback(() => {
    const context = contextRef.current;
    if (!context) return;

    const { w, h } = sizeRef.current;

    const text = configuration.startText ?? "";
    if (!text) return;

    context.fillStyle = "#fff";
    context.shadowColor = "#fff";
    context.shadowBlur = 0;
    context.font = `${configuration.fontWeight} ${configuration.startTextFontSize}px ${configuration.font}`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    const maxTextWidth = (w * configuration.maxTextWidth) / 100;
    const words = text.split(" ");
    const lines: string[] = [];

    let line = "";
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      if (context.measureText(testLine).width > maxTextWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);

    const lineHeight = configuration.startTextFontSize * 1.2;

    const centerY = h * 0.75;
    const startY = centerY - ((lines.length - 1) * lineHeight) / 2;

    const centerX = w / 2;

    lines.forEach((ln, i) => {
      context.fillText(ln, centerX, startY + i * lineHeight);
    });
  }, [configuration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    contextRef.current = context;

    const resize = () => {
      const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
      dprRef.current = dpr;
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h };

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      repaint();
    };

    const onPointerDown = (e: PointerEvent) => {
      // Only start when on the start screen
      if (!isStartScreen) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      const r = Math.max(pixelSize, 14);
      const x1 = pt.x - r;
      const y1 = pt.y - r;
      const x2 = pt.x + r;
      const y2 = pt.y + r;

      let hit = false;
      for (const p of particlesRef.current) {
        if (p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2) {
          hit = true;
          break;
        }
      }

      if (!hit) return;

      // Start sequence
      if (messages.length > 1) {
        setMessageIndex(1);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
    startAnimation();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      stopAnimation();
    };
  }, [repaint]);

  // Repaint the canvas when configuration changes
  useEffect(() => {
    repaint();
  }, [configuration]);

  useEffect(() => {
    if (isStartScreen) {
      stopAnimation();
      clearRect();
      particlesRef.current = [];
      rainRef.current = [];
      repaint();
      paintStartText();
      return;
    }

    if (isShowingMessages) {
      // ensure animation is running and show current message
      startAnimation();
      repaint();
    }

    if (!isPlaying) {
      setMessageIndex(null);
    }
  }, [
    isPlaying,
    isStartScreen,
    isShowingMessages,
    messageIndex,
    repaint,
    startAnimation,
    stopAnimation,
    clearRect,
    paintStartText,
  ]);

  return (
    <CanvasWrapper>
      <CustomCanvas ref={canvasRef} />
    </CanvasWrapper>
  );
}
