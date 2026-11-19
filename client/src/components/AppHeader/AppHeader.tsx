import type { ReactNode } from "react";
import { BrandMark } from "./BrandMark";
import { GinghamStrip } from "./GinghamStrip";

type AppHeaderProps = {
	/** Right side of the bar (each screen puts its own controls). */
	actions?: ReactNode;
};

/** "Freidora" header shared by both screens; it stays still during the screen transition. */
export function AppHeader({ actions }: AppHeaderProps) {
	return (
		<header className="tx-freidora text-[#FFF8EE] [view-transition-name:app-header]">
			<div className="flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
				<BrandMark />
				<div className="flex items-center gap-2">{actions}</div>
			</div>
			<GinghamStrip />
		</header>
	);
}
