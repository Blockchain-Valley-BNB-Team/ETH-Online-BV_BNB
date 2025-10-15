"use client";

import { useEffect, useRef } from "react";

export function DnaVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 200;

    let offset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw DNA double helix
      const centerY = canvas.height / 2;
      const amplitude = 40;
      const frequency = 0.02;
      const spacing = 10;

      for (let x = 0; x < canvas.width; x += 2) {
        const y1 = centerY + Math.sin((x + offset) * frequency) * amplitude;
        const y2 = centerY - Math.sin((x + offset) * frequency) * amplitude;

        // Top strand
        ctx.fillStyle = "#00F5D4";
        ctx.beginPath();
        ctx.arc(x, y1, 2, 0, Math.PI * 2);
        ctx.fill();

        // Bottom strand
        ctx.fillStyle = "#0052FF";
        ctx.beginPath();
        ctx.arc(x, y2, 2, 0, Math.PI * 2);
        ctx.fill();

        // Connecting lines
        if (x % spacing === 0) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + Math.abs(Math.sin((x + offset) * frequency)) * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.stroke();
        }
      }

      offset += 2;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} className="mx-auto" />;
}
