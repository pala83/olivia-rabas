import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

// Adapted to "KDS · Sistema de diseño": 3px ink border, 12px radius, bold type,
// 64px touch targets and a dashed look for aria-disabled (still focusable, so it can explain why).
const buttonVariants = cva(
	"group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-lg border-3 border-ink font-bold text-center transition-[transform,background-color,border-color,color] duration-200 ease-out outline-none select-none active:scale-96 disabled:pointer-events-none disabled:opacity-50 aria-disabled:border-dashed aria-disabled:border-disabled aria-disabled:bg-card aria-disabled:text-ink-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5.5",
	{
		variants: {
			variant: {
				default:
					"border-action bg-primary text-primary-foreground hover:bg-[color-mix(in_oklch,var(--primary),black_12%)]",
				outline: "bg-card text-ink hover:bg-muted",
				bar: "bg-bar text-white hover:bg-[color-mix(in_oklch,var(--kds-bar),white_10%)]",
				inverse: "border-white bg-card text-bar hover:bg-muted",
				loaded:
					"bg-loaded text-ink hover:bg-[color-mix(in_oklch,var(--kds-loaded),black_6%)]",
			},
			size: {
				default: "min-h-16 px-5 text-[22px] leading-7",
				md: "min-h-16 px-4 text-xl leading-6",
				chip: "min-h-14 gap-2 pr-3.5 pl-2.5 text-xl leading-[26px]",
				tile: "relative min-h-22 px-3 py-2 text-[22px] leading-7 whitespace-normal",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	return (
		<ButtonPrimitive
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
