import { useEffect, useState } from "react";

/** Current time in ms, refreshed every second (drives every order timer). */
export const useNow = (): number => {
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(timer);
	}, []);

	return now;
};
