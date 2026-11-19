import type { ReactNode } from "react";

type MenuSectionProps = {
	id: string;
	title: string;
	description: string;
	children: ReactNode;
};

/** Section title in Lilita One with its helper line. */
export function MenuSection({
	id,
	title,
	description,
	children,
}: MenuSectionProps) {
	return (
		<section aria-labelledby={id} className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<h2
					id={id}
					className="m-0 font-serif text-[34px] leading-9.5 tracking-[0.01em]"
				>
					{title}
				</h2>
				<p className="m-0 text-sm text-muted-foreground">{description}</p>
			</div>
			{children}
		</section>
	);
}
