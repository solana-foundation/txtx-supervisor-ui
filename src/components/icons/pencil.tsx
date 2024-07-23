import React from "react";

export default function Pencil({ className, size = 12 }) {
  return (
    <svg
      width={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10.5332 2.71012L9.29035 1.46723C9.06215 1.239 8.69002 1.23885 8.46201 1.46688L2.125 7.80389L4.19658 9.87549L10.5336 3.53848C10.7616 3.31045 10.7615 2.93834 10.5332 2.71012Z"
        stroke="currentColor"
        stroke-miterlimit="22.926"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1.29688 10.7041L2.12553 7.80387L4.19711 9.87545L1.29688 10.7041Z"
        stroke="currentColor"
        stroke-miterlimit="22.926"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.70441 4.36743L7.63281 2.29583"
        stroke="currentColor"
        stroke-miterlimit="22.926"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
