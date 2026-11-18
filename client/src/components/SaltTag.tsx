import { cn } from "@/lib/utils";
import { NoSaltIcon } from "./icons/NoSaltIcon";
import { SaltIcon } from "./icons/SaltIcon";

type SaltTagProps = {
	withSalt: boolean;
	className?: string;
};

/** "Sin sal" is dark so it can't be missed; "Con sal" is an outline tag. */
export function SaltTag({ withSalt, className }: SaltTagProps) {
	const Icon = withSalt ? SaltIcon : NoSaltIcon;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-md border px-1.5 text-xs leading-[18px] font-medium",
				withSalt
					? "border-border text-foreground"
					: "border-foreground bg-foreground text-[#FFF8EE]",
				className,
			)}
		>
			<Icon width={12} height={12} strokeWidth={2.2} />
			{withSalt ? "Con sal" : "Sin sal"}
		</span>
	);
}
