import { useMemo } from "react";
const WS_ID = 'wsid';

function idGenerator(size = 32) {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	return [...Array(size)].map(() => Math.floor(Math.random() * chars.length)).map(i => chars.charAt(i)).join('');
}

export default function useId() {
	return useMemo(() => {
		if (typeof window === 'undefined') return '';
		const storedId = window.localStorage.getItem(WS_ID);
		if (storedId) {
			return storedId;
		}
		const generatedId = idGenerator();
		window.localStorage.setItem(WS_ID, generatedId);
		return generatedId;
	}, []);
}
