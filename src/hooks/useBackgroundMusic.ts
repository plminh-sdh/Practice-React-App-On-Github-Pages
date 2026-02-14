import { useEffect, useRef } from "react";

export function useBackgroundMusic(src: string, enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      console.log(audioRef.current);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5; // tweak volume
    }

    const audio = audioRef.current;

    if (enabled) {
      audio.play().catch(() => {
        // autoplay blocked until user gesture
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.pause();
    };
  }, [src, enabled]);
}
