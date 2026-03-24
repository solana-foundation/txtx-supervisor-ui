import React from "react";

export enum CheckMarkColor {
  White,
  Emerald,
}
export default function CheckMark({ color }: { color?: CheckMarkColor }) {
  let colorStr = "white";
  if (color === CheckMarkColor.Emerald) {
    colorStr = "#22c55e";
  }

  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Icon/Action/check">
        <path
          id="Vector"
          d="M9.57776 15.642L19.2198 6L20.5 7.28025L9.57776 18.2025L4.49951 13.1257L5.77976 11.8455L9.57776 15.642Z"
          fill={colorStr}
        />
      </g>
    </svg>
  );
}
