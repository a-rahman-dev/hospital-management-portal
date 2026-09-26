import { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ============================================================
   📊 SPARKLINE COMPONENT — Mini Chart (Rule 5)
   ─────────────────────────────────────────────
   Palette: Indigo brand (#4f46e5)
   
   Features:
   - Smooth curve (Catmull-Rom) option
   - Gradient fill
   - Animated draw
   - Hover dot
   - Last value indicator
   - Responsive width
   - Reduced motion support
   - Full a11y
   ============================================================ */

/**
 * Generate a smooth path using Catmull-Rom to Bezier conversion
 */
function getSmoothPath(points, smoothing = 0.2) {
  if (points.length < 2) return "";

  const line = (pointA, pointB) => {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX),
    };
  };

  const controlPoint = (current, previous, next, reverse) => {
    const p = previous || current;
    const n = next || current;
    const o = line(p, n);
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y];
  };

  const bezierCommand = (point, i, a) => {
    const cps = controlPoint(a[i - 1], a[i - 2], point, false);
    const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
    return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
  };

  const d = points.reduce(
    (acc, point, i, a) => {
      if (i === 0) return `M ${point[0]},${point[1]}`;
      return `${acc} ${bezierCommand(point, i, a)}`;
    },
    ""
  );

  return d;
}

/**
 * Generate a straight-line path
 */
function getLinePath(points) {
  return points
    .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
    .join(" ");
}

export default function Sparkline({
  data = [],
  width = 80,
  height = 28,
  color = "#4f46e5", // Indigo (brand)
  fill = true,
  strokeWidth = 2,
  smooth = false,
  showDot = false,
  showLastValue = false,
  animate = true,
  min: minOverride,
  max: maxOverride,
  className,
}) {
  const prefersReduced = useReducedMotion();
  const reactId = useId();
  const gradientId = `sparkline-gradient-${reactId.replace(/:/g, "")}`;
  const shouldAnimate = animate && !prefersReduced;

  /* ============================================================
     🎯 CALCULATE POINTS (memoized)
     ============================================================ */
  const points = useMemo(() => {
    if (!data.length || data.length < 2) return [];

    const min = minOverride ?? Math.min(...data);
    const max = maxOverride ?? Math.max(...data);
    const range = max - min || 1;
    const padding = strokeWidth;

    return data.map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y =
        height - ((value - min) / range) * (height - padding * 2) - padding;
      return [x, y];
    });
  }, [data, width, height, strokeWidth, minOverride, maxOverride]);

  /* ============================================================
     🎯 PATHS
     ============================================================ */
  const linePath = useMemo(() => {
    if (points.length < 2) return "";
    return smooth ? getSmoothPath(points) : getLinePath(points);
  }, [points, smooth]);

  const areaPath = useMemo(() => {
    if (!linePath || points.length < 2) return "";
    return `${linePath} L${width},${height} L0,${height} Z`;
  }, [linePath, width, height]);

  const lastPoint = points[points.length - 1];

  /* ============================================================
     🎯 EMPTY STATE
     ============================================================ */
  if (!data.length || data.length < 2) {
    return (
      <div
        className={className}
        style={{ width, height }}
        aria-hidden="true"
      >
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray="2 2"
            className="text-slate-300 dark:text-slate-700"
            opacity="0.5"
          />
        </svg>
      </div>
    );
  }

  /* ============================================================
     🎯 RENDER
     ============================================================ */
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Sparkline chart showing ${data.length} data points`}
    >
      {fill && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}

      {/* Area fill */}
      {fill &&
        (shouldAnimate ? (
          <motion.path
            d={areaPath}
            fill={`url(#${gradientId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        ) : (
          <path d={areaPath} fill={`url(#${gradientId})`} />
        ))}

      {/* Line stroke */}
      {shouldAnimate ? (
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ) : (
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Last value dot */}
      {showDot && lastPoint && (
        <motion.circle
          cx={lastPoint[0]}
          cy={lastPoint[1]}
          r={strokeWidth + 1}
          fill={color}
          stroke="white"
          strokeWidth={1.5}
          initial={shouldAnimate ? { scale: 0 } : false}
          animate={shouldAnimate ? { scale: 1 } : false}
          transition={{ delay: 0.6, type: "spring", stiffness: 400 }}
          style={{ transformOrigin: `${lastPoint[0]}px ${lastPoint[1]}px` }}
        />
      )}

      {/* Last value label */}
      {showLastValue && lastPoint && (
        <motion.text
          x={lastPoint[0] - 2}
          y={lastPoint[1] - 6}
          textAnchor="end"
          fontSize="9"
          fontWeight="700"
          fill={color}
          initial={shouldAnimate ? { opacity: 0, y: lastPoint[1] - 2 } : false}
          animate={shouldAnimate ? { opacity: 1, y: lastPoint[1] - 6 } : false}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          {data[data.length - 1]}
        </motion.text>
      )}
    </svg>
  );
}