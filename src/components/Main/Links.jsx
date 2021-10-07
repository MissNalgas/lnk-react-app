import styles from "./Links.module.css";
import PropTypes from "prop-types";



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
        return (msg.type === "url") ? <UrlMessage openContextMenu={openContextMenu} content={msg.message}/> : <TextMessage openContextMenu={openContextMenu} content={msg.message}/>;
    }

    const linksComp = links.map((msg, index) => {
        return  <div key={links.length - index}>
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
        message: PropTypes.string
    })),
    openContextMenu: PropTypes.func
};

export default Links;