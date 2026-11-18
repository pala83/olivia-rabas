import agua from "@/assets/products/agua.svg";
import cerveza from "@/assets/products/cerveza.svg";
import fernet from "@/assets/products/fernet.svg";
import gaseosa from "@/assets/products/gaseosa.svg";
import limonada from "@/assets/products/limonada.svg";
import papas from "@/assets/products/papas.svg";
import rabas from "@/assets/products/rabas.svg";
import vino from "@/assets/products/vino.svg";

/** Sticker illustrations from the design, keyed by the API product name (lowercase). */
const ART: Record<string, string> = {
	papas,
	rabas,
	agua,
	gaseosa,
	limonada,
	cerveza,
	vino,
	fernet,
	"fernet con cola": fernet,
};

const normalize = (name: string) =>
	name.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Illustration for a product, or undefined when the design has none for it. */
export const productArt = (name: string): string | undefined =>
	ART[normalize(name)];

/** Background behind a product thumbnail, by kind (design: fried, drink without/with alcohol). */
export const productArtBackground = (
	isDrink: boolean,
	containsAlcohol: boolean | null,
): string => {
	if (!isDrink)
		return "bg-[radial-gradient(circle_at_50%_85%,#FFE7A8,#F2A51A_75%)]";
	return containsAlcohol ? "bg-[#FBE7C6]" : "bg-[#E3F1F7]";
};
