import { TextInput, PassInput } from "../Input";

import styles from "./Login.module.css";

import {useEffect, useState} from "react";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getUser } from "../../services/api";

export default function LogIn() {

    const [form, setForm] = useState({username: "", password: ""});
    const [noti, setNoti] = useState(false);

    const handlePasswordChange = (e) => {
        setForm((form) => ({username: form.username, password: e.target.value}));
    }

    const handleUserChange = (e) => {
        setForm((form) => ({username: e.target.value, password: form.password}));
    }

    const showErrorNotification = () => {
        setNoti(true);
        setTimeout(() => {
            setNoti(false);
        }, 4000);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
		const {username, password} = form;

		const auth = getAuth();
		signInWithEmailAndPassword(auth, username, password).then(() => {
			window.location.href = '/';
		}).catch(err => {
			console.error(err);
			showErrorNotification();
		});

        setForm({username: "", password: ""});
    }

	useEffect(() => {
		getUser().then(() => {
			window.location.href = '/';
		}).catch(() => undefined);
	})

    return  <div className={styles.logIn}>
                <div className={styles.topBar}>
                    <h1>Lnk</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <TextInput onChange={handleUserChange} id="username" value={form.username} label="Email" type="email"/>
                    <PassInput onChange={handlePasswordChange} id="password" value={form.password} label="Password"/>
                    <div className={styles.buttonContainer}>
                        <button type="submit">Log in</button>
                    </div>
                </form>
     
                {noti && <div className={noti ? styles.errorContainer : ""}>
                    Wrong email or password :(
                </div>}
            </div>
}
