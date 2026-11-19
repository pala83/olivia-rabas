import { cn } from "@/lib/utils";

type EmptyStateProps = {
	title: string;
	description: string;
	className?: string;
};

/** Dashed empty box ("Empty: lista vacía, sin ilustración"). */
export function EmptyState({ title, description, className }: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center gap-1 rounded-lg border border-dashed border-[#B89B72] p-4 text-center text-sm",
				className,
			)}
		>
			<span className="font-medium">{title}</span>
			<span className="text-muted-foreground">{description}</span>
		</div>
	);
}
