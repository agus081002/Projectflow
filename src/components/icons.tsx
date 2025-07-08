import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 7.55C2 5.58 3.58 4 5.55 4h12.9C20.42 4 22 5.58 22 7.55v8.9c0 1.97-1.58 3.55-3.55 3.55H5.55C3.58 20 2 18.42 2 16.45V7.55z" />
      <path d="M12 16.5a4.5 4.5 0 0 0 0-9" />
      <path d="M12 12h.01" />
    </svg>
  ),
};
