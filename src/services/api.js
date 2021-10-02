import axios from "axios";

export function logIn(email, pass) {
    return axios.post("/api/login", {email, pass});
}

export async function getUser() {
    const res = await axios.get("/api/getuser");
    if (res.data.code !== 200) {
        throw new Error(res);
    }
    console.log(res);
    return res.data.user;
}

export async function logOut() {
    const res = await axios.get("/api/logout");
    return res;
}