import type { SVGProps } from "react";

/** Fries cone from the design (not in lucide); stroke icon like lucide's. */
export function FriesIcon(props: SVGProps<SVGSVGElement>) {
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
			<path d="M5 11h14l-2 10H7z" />
			<path d="M8 11 7 4" />
			<path d="M11 11V3" />
			<path d="m14 11 1-7" />
			<path d="m17 11 1.5-5" />
		</svg>
	);
}
