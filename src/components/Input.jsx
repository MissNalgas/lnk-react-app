import styles from "./Input.module.css";

import { useState } from "react";

export function TextInput(props) {

    const {label, id, value, onChange, type, onKeyPress} = props;
    const [ active, setActive ] = useState(false);

    const onFocus = (e) => {
        setActive(true);
    }

    const onBlur = (e) => {
        if (value !== "") return;
        setActive(false);
    }


    return  <div className={active ? `${styles.container} ${styles.containerActive}` : styles.container }>
                {label !== undefined && <label className={styles.label} htmlFor={id}>{label}</label>}
                <input onKeyPress={onKeyPress} onChange={onChange} value={value} onFocus={onFocus} onBlur={onBlur} id={id} className={styles.input} type={type}/>
            </div>
}

export function PassInput(props) {
    const {label, id, value, onChange} = props;
    const [ active, setActive ] = useState(false);

    const onFocus = (e) => {
        setActive(true);
    }

    const onBlur = (e) => {
        if (value !== "") return;
        setActive(false);
    }

    return  <div className={active ? `${styles.container} ${styles.containerActive}` : styles.container }>
                <label className={styles.label} htmlFor={id}>{label}</label>
                <input onChange={onChange} value={value} onFocus={onFocus} onBlur={onBlur} id={id} className={styles.input} type="password"/>
            </div>
}

export function SubmitInput(props) {

    const {value} = props;

    return  <div>
                <button type="submit">{value}</button>
            </div>
}