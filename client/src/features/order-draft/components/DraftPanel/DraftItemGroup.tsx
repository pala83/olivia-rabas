import type { ReactNode } from "react";
import { EmptyState } from "@/components/EmptyState";
import type { DraftLine } from "../../use-order-draft";
import { DraftItem } from "./DraftItem";

type DraftItemGroupProps = {
	id: string;
	title: string;
	icon: ReactNode;
	lines: DraftLine[];
	emptyTitle: string;
	emptyDescription: string;
};

/** "Comida" or "Bebida" with its total and the loaded items. */
export function DraftItemGroup({
	id,
	title,
	icon,
	lines,
	emptyTitle,
	emptyDescription,
}: DraftItemGroupProps) {
	const total = lines.reduce((sum, line) => sum + line.quantity, 0);

	return (
		<section aria-labelledby={id} className="flex flex-col gap-1 p-2">
			<h3
				id={id}
				className="m-0 flex h-8 items-center justify-between px-2 text-xs font-medium text-foreground/75"
			>
				<span className="inline-flex items-center gap-1.5 [&_svg]:size-4">
					{icon}
					{title}
				</span>
				<span className="font-mono">{total}</span>
			</h3>
			{lines.length > 0 ? (
				<ul className="m-0 flex list-none flex-col gap-2 p-0">
					{lines.map((line) => (
						<DraftItem key={line.key} line={line} />
					))}
				</ul>
			) : (
				<EmptyState title={emptyTitle} description={emptyDescription} />
			)}
		</section>
	);
}
