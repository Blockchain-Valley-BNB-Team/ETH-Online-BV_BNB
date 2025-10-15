"use client";

import { useEffect, useRef } from "react";

interface DrugNetworkGraphProps {
  selectedIds: string[];
}

export function DrugNetworkGraph({ selectedIds }: DrugNetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    updateSize();

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Create nodes for selected compounds
    const nodes = selectedIds.map((id, i) => ({
      id,
      x: w / 2 + Math.cos((i / selectedIds.length) * Math.PI * 2) * 100,
      y: h / 2 + Math.sin((i / selectedIds.length) * Math.PI * 2) * 100,
      radius: 20,
    }));

    // Draw
    ctx.clearRect(0, 0, w, h);

    // Draw connections
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i < j) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(0, 245, 212, 0.3)";
          ctx.lineWidth = 2;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(otherNode.x, otherNode.y);
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    nodes.forEach(node => {
      // Glow
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 2);
      gradient.addColorStop(0, "rgba(0, 245, 212, 0.3)");
      gradient.addColorStop(1, "rgba(0, 245, 212, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Node
      ctx.fillStyle = "#00F5D4";
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [selectedIds]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
