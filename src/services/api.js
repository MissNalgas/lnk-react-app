import axios from "axios";
import { getAuth, onIdTokenChanged } from "firebase/auth";

function getAxios() {

	return new Promise((resolve, reject) => {

		const auth = getAuth();

		const subscriber = onIdTokenChanged(auth, async (user) => {
			subscriber();

			if (user) {
				const token = await user.getIdToken(true);
				const instance = axios.create({
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});
				resolve(instance);
			} else {
				reject();
			}

		}, []);

	});

}

export async function getUser() {
	const a = await getAxios();
    const res = await a.get("/api/getuser");
    return res.data.user;
}

export async function uploadFile(file) {
	const a = await getAxios();
	const form = new FormData();
	form.append('file', file);
	const res = await a.post('/api/upload-file', form);
	return res.data;
}
