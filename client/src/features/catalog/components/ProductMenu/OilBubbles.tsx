/** Six bubbles rising from the oil (positions and timings from the design). */
const BUBBLES = [
	{ left: "8%", size: 9, delay: "0s", duration: "3.4s" },
	{ left: "20%", size: 6, delay: "1.1s", duration: "2.8s" },
	{ left: "30%", size: 11, delay: "2.2s", duration: "3.9s" },
	{ left: "68%", size: 12, delay: "0.6s", duration: "3.8s" },
	{ left: "80%", size: 7, delay: "1.8s", duration: "3s" },
	{ left: "90%", size: 9, delay: "2.6s", duration: "3.5s" },
];

export function OilBubbles() {
	return (
		<span aria-hidden="true">
			{BUBBLES.map((bubble) => (
				<span
					key={bubble.left}
					className="absolute -bottom-3.5 animate-[kds-burbuja_3.2s_ease-in_infinite] rounded-full border-2 border-[rgb(255_248_230/0.85)] bg-[rgb(255_248_230/0.25)]"
					style={{
						left: bubble.left,
						width: bubble.size,
						height: bubble.size,
						animationDelay: bubble.delay,
						animationDuration: bubble.duration,
					}}
				/>
			))}
		</span>
	);
}
