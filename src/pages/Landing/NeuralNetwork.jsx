import React, { useEffect, useRef } from "react";

export default function NeuralNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // High-DPI Retina Screen scaling function
    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    // Responsive configuration based on screen width
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const nodeCount = isMobile ? 40 : isTablet ? 70 : 110;
    const maxConnectionDistance = isMobile ? 95 : 145;
    const maxSignals = isMobile ? 6 : 14;

    // Window level cursor tracking (Zero scroll blocking)
    const mouse = {
      x: null,
      y: null,
      radius: isMobile ? 100 : 165,
      active: false,
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("touchend", handleMouseLeave, { passive: true });

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    // Clinical Neon Accent Colors
    const nodeColors = [
      { r: 56, g: 189, b: 248 }, // Cyan 400
      { r: 45, g: 212, b: 191 }, // Teal 400
      { r: 99, g: 102, b: 241 }, // Indigo 500
      { r: 52, g: 211, b: 153 }, // Emerald 400
    ];

    // Neural Node Class
    class NeuralNode {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = init ? Math.random() * width : Math.random() < 0.5 ? 0 : width;
        this.y = init ? Math.random() * height : Math.random() * height;
        this.vx = (Math.random() - 0.5) * (isMobile ? 0.35 : 0.52);
        this.vy = (Math.random() - 0.5) * (isMobile ? 0.35 : 0.52);
        this.radius = Math.random() * 1.6 + 1.2;
        this.baseRadius = this.radius;
        this.color = nodeColors[Math.floor(Math.random() * nodeColors.length)];
        this.baseAlpha = Math.random() * 0.35 + 0.22;
        this.alpha = this.baseAlpha;
        this.pulseSpeed = Math.random() * 0.03 + 0.015;
        this.pulseAngle = Math.random() * Math.PI * 2;
        this.isHub = Math.random() > 0.84;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        this.pulseAngle += this.pulseSpeed;
        const pulse = Math.sin(this.pulseAngle) * 0.5 + 0.5;
        this.radius = this.baseRadius + pulse * (this.isHub ? 1.5 : 0.7);

        // Magnetic Attraction
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 1) {
            const force = (mouse.radius - dist) / mouse.radius;
            const pull = force * 0.9;
            this.x += (dx / dist) * pull;
            this.y += (dy / dist) * pull;
            this.alpha = Math.min(0.9, this.baseAlpha + force * 0.5);
          } else {
            this.alpha = this.baseAlpha;
          }
        } else {
          this.alpha = this.baseAlpha;
        }
      }

      draw() {
        const { r, g, b } = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
        ctx.fill();

        if (this.isHub) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha * 0.15})`;
          ctx.fill();
        }
      }
    }

    // Synaptic Data Signals Class
    class SynapticSignal {
      constructor(nodeA, nodeB) {
        this.from = nodeA;
        this.to = nodeB;
        this.progress = 0;
        this.speed = Math.random() * 0.012 + 0.007;
        this.size = Math.random() * 1.5 + 1.2;
        this.color = Math.random() > 0.5 ? "rgba(45, 212, 191, 0.95)" : "rgba(56, 189, 248, 0.95)";
      }

      update() {
        this.progress += this.speed;
      }

      draw() {
        const curX = this.from.x + (this.to.x - this.from.x) * this.progress;
        const curY = this.from.y + (this.to.y - this.from.y) * this.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#38bdf8";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Sonar Wave Scanner Class
    class SonarWave {
      constructor() {
        this.x = width * 0.5 + (Math.random() - 0.5) * (width * 0.4);
        this.y = height * 0.4 + (Math.random() - 0.5) * (height * 0.3);
        this.radius = 5;
        this.maxRadius = Math.random() * 160 + 120;
        this.alpha = 0.22;
        this.speed = 0.75;
      }

      update() {
        this.radius += this.speed;
        this.alpha = 0.22 * (1 - this.radius / this.maxRadius);
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${this.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    const nodes = Array.from({ length: nodeCount }, () => new NeuralNode());
    const signals = [];
    const sonarWaves = [];

    const waveInterval = setInterval(() => {
      if (sonarWaves.length < 2 && Math.random() > 0.3) {
        sonarWaves.push(new SonarWave());
      }
    }, 4500);

    const signalInterval = setInterval(() => {
      if (signals.length < maxSignals && nodes.length > 2) {
        const idxA = Math.floor(Math.random() * nodes.length);
        const idxB = Math.floor(Math.random() * nodes.length);

        if (idxA !== idxB) {
          const dx = nodes[idxA].x - nodes[idxB].x;
          const dy = nodes[idxA].y - nodes[idxB].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDistance) {
            signals.push(new SynapticSignal(nodes[idxA], nodes[idxB]));
          }
        }
      }
    }, 800);

    // Architectural Telemetry Grid
    const drawTelemetryGrid = () => {
      const gridSize = 64;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(15, 23, 42, 0.45)";
      ctx.lineWidth = 0.5;

      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      drawTelemetryGrid();

      // Draw Sonar Waves
      for (let i = sonarWaves.length - 1; i >= 0; i--) {
        const wave = sonarWaves[i];
        wave.update();
        wave.draw();
        if (wave.alpha <= 0 || wave.radius >= wave.maxRadius) {
          sonarWaves.splice(i, 1);
        }
      }

      // Draw Synaptic Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDistance) {
            const normalizedDist = 1 - dist / maxConnectionDistance;
            const alpha = normalizedDist * 0.18;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            const grad = ctx.createLinearGradient(
              nodes[i].x,
              nodes[i].y,
              nodes[j].x,
              nodes[j].y
            );
            grad.addColorStop(0, `rgba(${nodes[i].color.r}, ${nodes[i].color.g}, ${nodes[i].color.b}, ${alpha})`);
            grad.addColorStop(1, `rgba(${nodes[j].color.r}, ${nodes[j].color.g}, ${nodes[j].color.b}, ${alpha})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = normalizedDist * 1.05;
            ctx.stroke();
          }
        }
      }

      // Connect nodes to mouse pointer
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < nodes.length; i++) {
          const dx = mouse.x - nodes[i].x;
          const dy = mouse.y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update and Draw Nodes
      nodes.forEach((node) => {
        node.update();
        node.draw();
      });

      // Update and Draw Active Signal Pulses
      for (let i = signals.length - 1; i >= 0; i--) {
        const sig = signals[i];
        sig.update();
        sig.draw();
        if (sig.progress >= 1) {
          signals.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(signalInterval);
      clearInterval(waveInterval);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleMouseLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Deep Navy/Black Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#020617",
          pointerEvents: "none",
        }}
      />

      {/* Atmospheric Glow Highlights */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "850px",
          height: "450px",
          background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(2,6,23,0) 70%)",
          filter: "blur(110px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "-120px",
          width: "550px",
          height: "350px",
          background: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, rgba(2,6,23,0) 70%)",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      {/* High-Performance Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Radial Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 0%, rgba(2,6,23,0.65) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}