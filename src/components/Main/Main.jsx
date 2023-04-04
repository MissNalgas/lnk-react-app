import { useState, useEffect } from "react";
import {getUser, uploadFile as uploadFileApi} from "../../services/api";
import useId from '../../hooks/useId';
import { useHistory } from "react-router-dom";

import styles from "./Main.module.css";
import {TextInput} from "../Input";
import Links from "./Links";

import ContextMenu from "./contextMenu/ContextMenu";
import { getAuth, signOut } from "firebase/auth";

const WS_URL = (process.env.NODE_ENV === "development") ? "ws://localhost:8081" : "wss://lnk.mssnapps.com/ws";

export default function Main() {

	const clientId = useId();
    const [user, setUser] = useState({email: "", firstname: "", id: 0, key: "", lastname: "", username: ""});
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [wsIsOpen, setWsIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const history = useHistory();

    const [isNotification, setIsNotification] = useState(false);
    const [isOpenLnk, setIsOpenLnk] = useState(false);

    const [uploadingImage, setUploadingImage] = useState(false);

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
 

    const sendMessage = (eMsg) => {
        let msg = '';
        if (eMsg) {
            msg = JSON.stringify({code: "message", id: user.key, message: eMsg, sender: clientId});
        } else {
            if (input === '') return;            
            msg = JSON.stringify({code: "message", id: user.key, message: input, sender: clientId});
            setInput("");
        }
        ws.send(msg);
    }

    useEffect(() => {

        getUser().then((res) => {
            setUser(res);
            setWs(new WebSocket(WS_URL));

            if(window.electron) {
                window.electron.sendId(res);
            }
        }).catch((err) => {
			console.error(err);
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
            const msg = JSON.stringify({code: "init", id: user.key, message: "", sender: clientId});
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
		const auth = getAuth();
		signOut(auth).then(() => {
			window.location.href = '/login';
		}).catch(console.error);
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

	const clearMessages = () => {
		if (!user.key) return;

		const confirmation = confirm('Are you sure you want to delete the messages?');
		if (!confirmation) return;
		ws?.send(JSON.stringify({
			code: 'clear',
			message: 'clear',
			id: user.key,
			sender: clientId
		}));
		setIsMenuOpen(false);
	}

    const uploadFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);

		uploadFileApi(file).then(({url}) => {
			sendMessage(url);
		}).finally(() => {
			setUploadingImage(false);
			e.target.value = null;
		});
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
						<li onClick={() => clearMessages()} className={styles.menuItem}>Clear messages</li>
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
                            <div className={styles.uploadImageContainer}>
                                <label className={styles.uploadImage} htmlFor='image-upload'>
                                    {uploadingImage ?
                                        <svg className={styles.loadingSvg} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.665 3 16"/><path d="M2 12C2 6 6.39 2 11.806 2 16.209 2 19.76 4.335 21 8"/><path d="M7 17l-4-1-1 4"/><path d="M17 7l4 1 1-4"/></svg>
                                    :
                                        <svg className={styles.uploadImageSvg} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#dddbdb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6z"/><circle cx="8.5" cy="8.5" r="2.5"/><path d="M14.526 12.621L6 22h12.133A3.867 3.867 0 0 0 22 18.133V18c0-.466-.175-.645-.49-.99l-4.03-4.395a2 2 0 0 0-2.954.006z"/></svg>
                                    }
                                </label>
                                <input disabled={uploadingImage} onChange={uploadFile} style={{display: 'none'}} type='file' id='image-upload' name='image' accept='*/*'/> 
                            </div>
                        </div>

                    </div>
                    <div className={styles.flexBottom}>
                        <Links openContextMenu={openContextMenu} links={messages}/>
                    </div>
                </div>


                <ContextMenu context={contextPos}/>

                
                
            </div>

}
