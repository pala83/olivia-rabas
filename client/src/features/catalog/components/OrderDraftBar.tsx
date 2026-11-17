import { ArrowRight, CupSoda, Minus, Utensils } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	type DraftLine,
	MAX_CUSTOMER,
	MAX_NOTE,
	type OrderDraft,
} from "../use-order-draft";

type OrderDraftBarProps = {
	draft: OrderDraft;
};

const inputClass =
	"h-16 rounded-lg border-3 border-ink bg-card px-3.5 text-[22px] font-bold text-ink md:text-[22px] focus-visible:ring-0";

/** Bottom strip of the reception view: what is loaded, customer, note and "Enviar a cocina". */
export function OrderDraftBar({ draft }: OrderDraftBarProps) {
	const foodLines = draft.lines.filter((line) => line.withSalt !== null);
	const drinkLines = draft.lines.filter((line) => line.withSalt === null);
	const off = draft.total === 0;

	return (
		<form
			onSubmit={draft.send}
			aria-label="Comanda para enviar a cocina"
			className="flex flex-col gap-3 border-t-3 border-ink bg-card p-4"
		>
			<div className="flex flex-wrap items-center gap-x-4 gap-y-1">
				<h2 className="m-0 text-2xl leading-[30px] font-bold">Nueva comanda</h2>
				<p className="m-0 text-lg leading-6 text-ink-2">
					Tocá un producto cargado para quitar uno.
				</p>
			</div>

			<div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
				<LoadedBox
					title="Comida"
					icon={
						<Utensils
							aria-hidden="true"
							strokeWidth={2.4}
							className="size-5.5"
						/>
					}
					lines={foodLines}
					empty="Todavía sin comida."
					onRemove={draft.removeOne}
				/>
				<LoadedBox
					title="Bebida"
					icon={
						<CupSoda
							aria-hidden="true"
							strokeWidth={2.4}
							className="size-5.5"
						/>
					}
					lines={drinkLines}
					empty="Todavía sin bebida."
					onRemove={draft.removeOne}
				/>
			</div>

			<div className="flex flex-wrap items-end gap-x-4 gap-y-3">
				<div className="flex min-w-0 flex-[1_1_200px] flex-col gap-1.5">
					<Label htmlFor="kds-mesa" className="text-lg leading-6 font-bold">
						Mesa o cliente
					</Label>
					<Input
						id="kds-mesa"
						ref={draft.customerRef}
						value={draft.customer}
						maxLength={MAX_CUSTOMER}
						autoComplete="off"
						onChange={(event) => draft.setCustomer(event.target.value)}
						className={inputClass}
					/>
				</div>
				<div className="flex min-w-0 flex-[2_1_300px] flex-col gap-1.5">
					<Label htmlFor="kds-nota" className="text-lg leading-6 font-bold">
						Nota para cocina (opcional)
					</Label>
					<Input
						id="kds-nota"
						value={draft.note}
						maxLength={MAX_NOTE}
						autoComplete="off"
						onChange={(event) => draft.setNote(event.target.value)}
						className={inputClass}
					/>
				</div>
				<div className="flex min-w-0 flex-[1_1_280px] flex-col gap-1.5">
					<span
						role="status"
						aria-live="polite"
						className="text-lg leading-6 font-bold"
					>
						{draft.status}
					</span>
					<Button
						type="submit"
						aria-disabled={off || draft.sending}
						className="w-full"
					>
						{draft.sending ? "Enviando…" : "Enviar a cocina"}
						<ArrowRight
							aria-hidden="true"
							strokeWidth={2.6}
							className="size-6"
						/>
					</Button>
				</div>
			</div>
		</form>
	);
}

type LoadedBoxProps = {
	title: string;
	icon: ReactNode;
	lines: DraftLine[];
	empty: string;
	onRemove: (key: string) => void;
};

function LoadedBox({ title, icon, lines, empty, onRemove }: LoadedBoxProps) {
	return (
		<div className="flex min-h-[118px] min-w-0 flex-col gap-2 rounded-lg border-3 border-ink bg-ground p-3">
			<h3 className="m-0 flex items-center gap-2 text-xl leading-[26px] font-bold">
				{icon}
				{title}
			</h3>
			{lines.length === 0 ? (
				<p className="m-0 text-xl leading-7 text-ink-2">{empty}</p>
			) : (
				<ul className="m-0 flex list-none flex-wrap gap-2 p-0">
					{lines.map((line) => (
						<li key={line.key} className="animate-kds-in">
							<Button
								type="button"
								variant="outline"
								size="chip"
								aria-label={`Quitar uno: ${line.label}`}
								onClick={() => onRemove(line.key)}
							>
								<span
									aria-hidden="true"
									className="inline-flex size-7 flex-none items-center justify-center rounded-full bg-ink text-white"
								>
									<Minus strokeWidth={3.4} className="size-4" />
								</span>
								<span
									key={line.quantity}
									className="inline-block animate-kds-pop"
								>
									{line.quantity} ×
								</span>
								<span>{line.label}</span>
							</Button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
