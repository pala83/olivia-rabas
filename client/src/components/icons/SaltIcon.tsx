import type { SVGProps } from "react";

/** Salt shaker with grains ("Con sal"), from the design. */
export function SaltIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M8 10h8l1 10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z" />
			<path d="M8 10c0-3 1.8-5 4-5s4 2 4 5" />
			<path d="M11 7.5h.01" />
			<path d="M13 7.5h.01" />
		</svg>
	);
}
