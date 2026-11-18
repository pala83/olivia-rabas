import papas from "@/assets/products/papas.svg";

/** Logo, "Fritería" and the tagline. */
export function BrandMark() {
	return (
		<div className="flex items-center gap-3">
			<img
				src={papas}
				alt=""
				width={44}
				height={44}
				className="block size-11"
			/>
			<h1 className="m-0 font-serif text-[28px] leading-8 tracking-[0.01em] text-sidebar-primary">
				Fritería
			</h1>
			<span aria-hidden="true" className="h-6 w-px bg-[#FFF8EE]/30" />
			<span className="text-sm text-[#E9D9BF]">
				Amo y señor de las fritangas
			</span>
		</div>
	);
}
