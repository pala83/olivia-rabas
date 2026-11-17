export type OrderItem = {
	id: number;
	productId: number;
	productName: string;
	quantity: number;
	withSalt: boolean | null;
};
