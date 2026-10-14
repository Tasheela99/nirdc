import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

interface VantaNetBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  color?: number | string;
  backgroundColor?: number | string;
  points?: number;
  maxDistance?: number;
  spacing?: number;
  showDots?: boolean;
}

const VantaNetBackground: React.FC<VantaNetBackgroundProps> = ({
  className = "",
  style = {},
  color = 0x8C2963,
  backgroundColor = 0x000000,
  points = 20.0,
  maxDistance = 45.0,
  spacing = 32.0,
  showDots = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).THREE = THREE;
    }

    const initVanta = () => {
      if (!containerRef.current) return;
      if (effectRef.current) return;

      try {
        const vantaFn = (NET as any)?.default || NET;
        // Normalize 32-bit hex (e.g. 0xFF8C2963) to 24-bit 0x8C2963 for Three.js
        const resolvedColor =
          typeof color === "number" && color > 0xffffff ? color & 0xffffff : color;
        const resolvedBg =
          typeof backgroundColor === "number" && backgroundColor > 0xffffff
            ? backgroundColor & 0xffffff
            : backgroundColor;

        effectRef.current = vantaFn({
          el: containerRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: resolvedColor,
          backgroundColor: resolvedBg,
          points: points,
          maxDistance: maxDistance,
          spacing: spacing,
          showDots: showDots,
        });

        // Center camera to evenly spread the net across ultra-wide headers
        if (effectRef.current?.camera) {
          effectRef.current.camera.position.set(0, 80, 160);
          effectRef.current.camera.lookAt(0, 0, 0);
        }
      } catch (err) {
        console.error("Error initializing Vanta.NET background:", err);
      }
    };

    initVanta();

    // Resize observer to ensure the canvas matches dynamic container dimensions
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        if (effectRef.current && typeof effectRef.current.resize === "function") {
          effectRef.current.resize();
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (effectRef.current) {
        try {
          effectRef.current.destroy();
        } catch (e) {
          console.error("Error destroying Vanta.NET effect:", e);
        }
        effectRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none ${className}`}
      style={{
        zIndex: 0,
        backgroundColor: "#000000",
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

export default VantaNetBackground;
