import { proxy } from "../../utils/image";
import styles from "./Links.module.css";
import PropTypes from "prop-types";

function ImgMessage(props) {
    const { content, openContextMenu } = props;

    const copyImgUrl = () => {
        navigator.clipboard.writeText(content);
    }

    const openInNewTab = () => {
        window.open(content);
    }

    const contextItems = [
        {label: 'Copy image URL', fn: copyImgUrl},
        {label: 'Open in new tab', fn: openInNewTab}
    ]

    const onContextMenu = (e) => {
        e.preventDefault();
        const x = e.clientX || 0;
        const y = e.clientY || 0;
        
        openContextMenu(x, y, contextItems);
    }

    return  <div onContextMenu={onContextMenu} className={`${styles.message} ${styles.textMessage}`}>
                <img className={styles.image} src={proxy(content)} alt='image sent by lnk'/>
            </div>
}
ImgMessage.propTypes = {
    content: PropTypes.string,
    openContextMenu: PropTypes.func
}



function TextMessage(props) {
    const { content, openContextMenu } = props;

    const copy = () => {
        navigator.clipboard.writeText(content);
    }

    const contextItems = [
        {label: 'Copy', fn: copy}
    ];

    const onContextMenu = (e) => {
        e.preventDefault();
        let x = e.clientX;
        let y = e.clientY;
        openContextMenu(x, y, contextItems);
    }

    return  <div onContextMenu={onContextMenu} className={`${styles.textMessage} ${styles.message}`}>
                <span>{content}</span>
            </div>
}
TextMessage.propTypes = {
    content: PropTypes.string,
    openContextMenu: PropTypes.func
};


function UrlMessage(props) {
    const { content, openContextMenu } = props;

    const goToUrl = (url) => {
        if (window.electron) {
            window.electron.openURL(url);
        } else {
            window.open(url);
        }
    }

    const copyText = () => {
        navigator.clipboard.writeText(content);
    }

    const goToURL = () => {
        window.open(content, '_blank');
    }

    const contextItems = [
        {label: 'Go to URL', fn: goToURL},
        {label: 'Copy URL', fn: copyText}
    ];

    const onContextMenu = (e) => {
        e.preventDefault();
        const x = e.clientX;
        const y = e.clientY;
        openContextMenu(x, y, contextItems);
    }

    return  <div onContextMenu={onContextMenu} onClick={() => goToUrl(content)} className={`${styles.message} ${styles.urlMessage}`}>
                <span>{content}</span>
            </div>
}
UrlMessage.propTypes = {
    content: PropTypes.string,
    openContextMenu: PropTypes.func
};

function Links(props) {

    const { links, openContextMenu } = props;


    const validMessage = (msg) => {
        switch(msg.type) {
            case 'url':
                return <UrlMessage openContextMenu={openContextMenu} content={msg.message}/>
            case 'img':
                return <ImgMessage openContextMenu={openContextMenu} content={msg.message}/>
            default:
                return <TextMessage openContextMenu={openContextMenu} content={msg.message}/>

        }
    }

    const linksComp = links.map((msg) => {
        return  <div key={msg.uid}>
                    {validMessage(msg)}
                </div>
    });

    return  <div className={styles.linksContainer}>
                {linksComp}
            </div>
}
Links.propTypes = {
    links: PropTypes.arrayOf(PropTypes.exact({
        type: PropTypes.string,
		message: PropTypes.string,
		uid: PropTypes.string,
		sender: PropTypes.string
    })),
    openContextMenu: PropTypes.func
};

export default Links;
