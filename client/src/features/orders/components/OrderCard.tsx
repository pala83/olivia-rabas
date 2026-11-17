import {
	ArrowRight,
	CupSoda,
	GripVertical,
	MessageSquare,
	Utensils,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { STATUS_VIEW, timerLevel } from "../order-status";
import type { Order, OrderItem } from "../orders.types";
import { OrderTimer } from "./OrderTimer";

type OrderCardProps = {
	order: Order;
	/** Current time in ms (shared ticker). */
	now: number;
	/** When this client saw the order delivered, if it did. */
	deliveredAt: number | undefined;
	/** Card button handler; not used by the compact variant. */
	onAdvance?: (order: Order) => void;
	/** Design's "Comanda compacta": header only (status, number, customer, clock). */
	compact?: boolean;
};

const elapsedSeconds = (
	order: Order,
	now: number,
	deliveredAt: number | undefined,
): number | null => {
	const start = Date.parse(order.createdAt);
	if (order.status === "FINISHED") {
		return deliveredAt === undefined
			? null
			: Math.max(0, Math.floor((deliveredAt - start) / 1000));
	}
	return Math.max(0, Math.floor((now - start) / 1000));
};

/** "Comanda" from the design: status band, clock, food and drinks apart, note and one action. */
export function OrderCard({
	order,
	now,
	deliveredAt,
	onAdvance,
	compact = false,
}: OrderCardProps) {
	const view = STATUS_VIEW[order.status];
	const finished = order.status === "FINISHED";
	const seconds = elapsedSeconds(order, now, deliveredAt);
	const food = order.items.filter((item) => item.withSalt !== null);
	const drinks = order.items.filter((item) => item.withSalt === null);
	const StatusIcon = view.icon;

	return (
		<Card
			aria-label={`Comanda #${order.id}, ${order.customerName}, ${view.label}`}
			className="animate-kds-in gap-0 rounded-lg border-3 border-ink py-0 text-left text-ink ring-0"
		>
			<header className="flex items-stretch">
				<div
					className={cn(
						"flex min-w-0 flex-1 flex-col gap-1 p-2.5 transition-colors duration-300",
						view.band,
					)}
				>
					<div className="flex items-center justify-between gap-2">
						<span className="inline-flex min-w-0 items-center gap-1.5 text-lg leading-6 font-bold whitespace-nowrap">
							<StatusIcon
								aria-hidden="true"
								strokeWidth={2.4}
								className="size-5 flex-none"
							/>
							{view.label}
						</span>
						{!compact && (
							<GripVertical
								role="img"
								aria-label="Se puede arrastrar"
								strokeWidth={3}
								className="size-4.5 flex-none"
							/>
						)}
					</div>
					<div className="flex items-baseline gap-2 whitespace-nowrap">
						<span className="text-[28px] leading-[34px] font-bold">
							#{order.id}
						</span>
						<span className="min-w-0 truncate text-xl leading-[26px]">
							{order.customerName}
						</span>
					</div>
				</div>
				<OrderTimer
					level={timerLevel(seconds ?? 0, finished)}
					seconds={seconds}
				/>
			</header>

			{order.status === "DELAYED" && (
				<div
					aria-hidden="true"
					className="h-2 border-t-3 border-ink bg-[repeating-linear-gradient(135deg,var(--kds-status-urgent)_0_12px,#fff_12px_24px)]"
				/>
			)}

			{!compact && (
				<div className="flex flex-col border-t-3 border-ink">
					{food.length > 0 && (
						<ItemSection
							title="Comida"
							icon={
								<Utensils
									aria-hidden="true"
									strokeWidth={2.4}
									className="size-4.5"
								/>
							}
						>
							{food.map((item) => (
								<ItemLine key={item.id} item={item} finished={finished} />
							))}
						</ItemSection>
					)}
					{drinks.length > 0 && (
						<ItemSection
							title="Bebida"
							icon={
								<CupSoda
									aria-hidden="true"
									strokeWidth={2.4}
									className="size-4.5"
								/>
							}
							className={
								food.length > 0 ? "border-t-2 border-divider" : undefined
							}
						>
							{drinks.map((item) => (
								<ItemLine key={item.id} item={item} finished={finished} />
							))}
						</ItemSection>
					)}
					{order.notes && (
						<div className="mx-3 mb-2.5 flex flex-col gap-0.5 rounded-md border-3 border-dashed border-ink-2 bg-ground px-3 py-2">
							<span className="inline-flex items-center gap-1.5 text-base leading-5 font-bold text-ink-2">
								<MessageSquare
									aria-hidden="true"
									strokeWidth={2.4}
									className="size-4"
								/>
								Nota
							</span>
							<span className="text-xl leading-[26px] font-bold">
								{order.notes}
							</span>
						</div>
					)}
					<div className="px-3 pt-0.5 pb-3">
						<Button
							variant={finished ? "outline" : "bar"}
							size="md"
							className="w-full"
							onClick={() => onAdvance?.(order)}
						>
							{view.action}
							<ArrowRight aria-hidden="true" strokeWidth={2.6} />
						</Button>
					</div>
				</div>
			)}
		</Card>
	);
}

type ItemSectionProps = {
	title: string;
	icon: ReactNode;
	className?: string;
	children: ReactNode;
};

function ItemSection({ title, icon, className, children }: ItemSectionProps) {
	return (
		<section className={cn("flex flex-col gap-1.5 px-3 py-2.5", className)}>
			<h3 className="m-0 inline-flex items-center gap-2 text-base leading-5 font-bold text-ink-2">
				{icon}
				{title}
			</h3>
			<ul className="m-0 flex list-none flex-col gap-1.5 p-0">{children}</ul>
		</section>
	);
}

function ItemLine({ item, finished }: { item: OrderItem; finished: boolean }) {
	return (
		<li
			className={cn(
				"flex items-center gap-2.5",
				finished ? "text-ink-2 line-through" : "text-ink",
			)}
		>
			<span className="min-w-10 flex-none text-2xl leading-[30px] font-bold">
				{item.quantity} ×
			</span>
			<span className="text-[22px] leading-[30px] font-bold">
				{item.productName}
			</span>
			{item.withSalt === false && (
				<span className="flex-none rounded-md bg-ink px-2.5 py-0.5 text-base leading-[22px] font-bold text-white">
					Sin sal
				</span>
			)}
			{item.withSalt === true && (
				<span className="text-lg leading-6 text-ink-2">con sal</span>
			)}
		</li>
	);
}
