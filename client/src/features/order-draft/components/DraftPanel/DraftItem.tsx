import { SaltTag } from "@/components/SaltTag";
import {
	productArt,
	productArtBackground,
} from "@/features/catalog/product-art";
import { cn } from "@/lib/utils";
import type { DraftLine } from "../../use-order-draft";
import { QuantityStepper } from "./QuantityStepper";

/** One loaded product: thumbnail, name, salt or alcohol, and − / + . */
export function DraftItem({ line }: { line: DraftLine }) {
	const isDrink = line.withSalt === null;
	const art = productArt(line.name);
	const label = isDrink
		? line.name
		: `${line.name} ${line.withSalt ? "con sal" : "sin sal"}`;

	return (
		<li className="tx-ticket flex animate-[kds-in_0.24s_ease-out_both] items-center gap-2.5 rounded-lg border border-border py-2 pr-3 pl-2 shadow-xs">
			<span
				aria-hidden="true"
				className={cn(
					"flex size-10 flex-none items-center justify-center overflow-hidden rounded-md",
					productArtBackground(isDrink, line.containsAlcohol),
				)}
			>
				{art && (
					<img
						src={art}
						alt=""
						width={34}
						height={34}
						className="block size-[34px]"
					/>
				)}
			</span>
			<span className="flex min-w-0 flex-auto flex-col items-start gap-1">
				<span className="text-sm leading-[18px] font-medium">{line.name}</span>
				{isDrink ? (
					<span className="text-xs text-muted-foreground">
						{line.containsAlcohol ? "Con alcohol" : "Sin alcohol"}
					</span>
				) : (
					<SaltTag withSalt={line.withSalt === true} />
				)}
			</span>
			<QuantityStepper
				lineKey={line.key}
				quantity={line.quantity}
				label={label}
			/>
		</li>
	);
}
