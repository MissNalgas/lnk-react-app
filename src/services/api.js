import axios from "axios";

export function logIn(email, pass) {
    return axios.post("/lnk/api/login", {email, pass});
}

export async function getUser() {
    const res = await axios.get("/lnk/api/getuser");
    if (res.data.code !== 200) {
        throw new Error(res);
    }
    return res.data.data.decodedClaims.email;
}

export async function logOut() {
    const res = await axios.get("/lnk/api/logout");
    return res;
}