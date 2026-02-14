import { useEffect, useRef } from "react";

export function useBackgroundMusic(src: string, enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Re-create audio whenever src changes
  useEffect(() => {
    // cleanup old audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ""; // release resource
      audioRef.current.load();
      audioRef.current = null;
    }

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;

    audioRef.current = audio;

    // if currently enabled, try to play the new track
    if (enabled) {
      audio.play().catch(() => {
        // autoplay blocked until user gesture
      });
    }

    return () => {
      audio.pause();
      audio.src = "";
      audio.load();
    };
  }, [src]);

  // React to enabled changes without recreating audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [enabled]);
}
