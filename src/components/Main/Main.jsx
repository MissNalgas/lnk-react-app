import { useState, useEffect } from "react";
import {getUser, logOut} from "../../services/api";
import { useHistory } from "react-router-dom";

import styles from "./Main.module.css";
import {TextInput} from "../Input";
import Links from "./Links";

import ContextMenu from "./contextMenu/ContextMenu";

const WS_URL = (process.env.NODE_ENV === "development") ? "ws://localhost:8081" : "wss://lnk.mssnapps.com/ws";

export default function Main() {

    const [user, setUser] = useState({email: "", firstname: "", id: 0, key: "", lastname: "", username: ""});
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [wsIsOpen, setWsIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const history = useHistory();

    const [isNotification, setIsNotification] = useState(false);
    const [isOpenLnk, setIsOpenLnk] = useState(false);

    //Context menu
    let mainRef = null;

    const [contextPos, setContextPos] = useState({x: 0, y: 0, visible: false, items: []});

    const openContextMenu = (x, y, items) => {
        const rect = mainRef?.getBoundingClientRect();

        const xp = x - rect.x;
        const yp = y - rect.y;
        setContextPos({x: xp, y: yp, visible: true, items});

    }

    const closeContextMenu = () => {
        setContextPos((s) => ({...s, visible: false}));
    }

    //End Context Menu

    useEffect(() => {
        if (window.electron) {
            window.electron.getIsNotificationActive().then((res) => {
                setIsNotification(res);
            });
            window.electron.getIsOpenLnk().then((res) => {
                setIsOpenLnk(res);
            });
        }
    }, [])

    const [isMenuOpen, setIsMenuOpen] = useState(false);
 

    const sendMessage = () => {
        if (input === "") return;
        const msg = JSON.stringify({code: "message", id: user.key, message: input});
        ws.send(msg);
        setInput("");
    }

    useEffect(() => {

        getUser().then((res) => {
            setUser(res);
            setWs(new WebSocket(WS_URL));

            if(window.electron) {
                window.electron.sendId(res);
            }
        }).catch(() => {
            history.push("/login");
        });

    }, [history]);

    useEffect(() => {
        if (user.key === "" || ws === null) return;

        ws.addEventListener("message", (data) => {
            let msg = JSON.parse(data.data);
            if (msg.code === "message") {
                //let endMessage = JSON.parse(msg.endMessage);
                setMessages(msg.content);
            }
            if (msg.code === 'success') {
                setMessages(msg.content);
            }
        });
        ws.addEventListener("open", () => {
            setWsIsOpen(true);
            const msg = JSON.stringify({code: "init", id: user.key, message: ""});
            ws.send(msg);
        });

        ws.addEventListener("close" , () => {
            setWs(new WebSocket(WS_URL));
        });

        ws.addEventListener("error", () => {
            setWsIsOpen(false);
            setWs(null);
        })

        
    }, [ws, user]);

    const inputHandleChange = (e) => {
        setInput(e.target.value);
    }

    const handleKeyPressed = (e) => {
        if (e.code === "Enter") {
            sendMessage();
        }
    }

    const handleLogOut = () => {
        logOut().then(() => {
            history.push("/login");
        }).catch(() => {
            alert("There was some problem logging out! :(");
        });
    }

    const handleNotificationChange = (e) => {
        
        if (window.electron) {
            window.electron.setIsNotificationActive(e.target.checked).then((res) => {
                setIsNotification(res)
            }).catch((err) => {
                console.error("Error communicating with Electron", err);
            })
        }
    }

    const handleOpenLnk = (e) => {
        if (window.electron) {
            window.electron.setIsOpenLnk(e.target.checked).then((res) => {
                setIsOpenLnk(res);
            }).catch((err) => {
                console.error("Error communicating with electron", err);
            })
        }
    }

    return  <div onClick={closeContextMenu} ref={(r) => mainRef = r} className={styles.main}>
                {!wsIsOpen && <div className={styles.loading}><div className={styles.h1Container}><h1>Lnk</h1></div></div>}

                <div className={isMenuOpen ? `${styles.menuContainer} ${styles.menuContainerOpen}` : styles.menuContainer}>
                    <button className={ styles.menuCloseButton }onClick={() => setIsMenuOpen(false)}>
                        <svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12"><polygon fill="currentColor" fillRule="evenodd" points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"></polygon></svg>
                    </button>
                    <ul className={styles.menuList}>
                        { window.electron &&    <li className={styles.menuItem}>
                                                    <label htmlFor="isNotCheck">Notifications</label> 
                                                    <input id="isNotCheck" onChange={handleNotificationChange} checked={isNotification} type="checkbox"/>
                                                </li>}
                        { window.electron &&    <li className={styles.menuItem}>
                                                    <label htmlFor="openLnk">Open </label>
                                                    <input id="openLnk" onChange={handleOpenLnk} checked={isOpenLnk} type="checkbox"/>
                                                </li>}
                        <li onClick={() => handleLogOut()} className={styles.menuItem}>Log out</li>
                    </ul>
                </div>
                <div className={styles.flexContainer}>
                    <div className={styles.flexTop}>
                        <div className={styles.topBar}>
                        <h1>Lnk</h1>
                        <button className={styles.logOut} onClick={() => setIsMenuOpen(true)}>
                            Menu
                        </button>
                        </div>
                        <div className={styles.welcomeContainer}>
                            <span>Welcome {user.username}!</span>
                        </div>

                        <div className={styles.inputContainer}>
                            <div className={styles.inputContainerText}>
                                <TextInput onKeyPress={handleKeyPressed} onChange={inputHandleChange} value={input} type="text"/>
                            </div>
                            <button disabled={input === ""} className={styles.inputButton} onClick={() => sendMessage()}>Send</button>
                        </div>

                    </div>
                    <div className={styles.flexBottom}>
                        <Links openContextMenu={openContextMenu} links={messages}/>
                    </div>
                </div>


                <ContextMenu context={contextPos}/>

                
                
            </div>

}