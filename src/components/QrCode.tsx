'use client';

import { useMemo } from "react";
import { createQrMatrix } from "@/lib/qr";

const QUIET_ZONE = 2;

export default function QrCode({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const { size, path } = useMemo(() => {
    const matrix = createQrMatrix(value);
    const parts: string[] = [];

    matrix.forEach((row, y) => {
      row.forEach((dark, x) => {
        if (dark) {
          parts.push(`M${x + QUIET_ZONE} ${y + QUIET_ZONE}h1v1h-1z`);
        }
      });
    });

    return {
      size: matrix.length + QUIET_ZONE * 2,
      path: parts.join(""),
    };
  }, [value]);

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      className={className}
    >
      <rect width={size} height={size} fill="#ffffff" />
      <path d={path} fill="#000000" />
    </svg>
  );
}
