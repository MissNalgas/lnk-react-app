import styles from "./Links.module.css";
import PropTypes from "prop-types";


function TextMessage(props) {
    const { content } = props;

    return  <div className={`${styles.textMessage} ${styles.message}`}>
                <span>{content}</span>
            </div>
}
TextMessage.propTypes = {
    content: PropTypes.string
};


function UrlMessage(props) {
    const { content } = props;

    const goToUrl = (url) => {
        if (window.electron) {
            window.electron.openURL(url);
        } else {
            window.open(url);
        }
    }

    return  <div onClick={() => goToUrl(content)} className={`${styles.message} ${styles.urlMessage}`}>
                <span>{content}</span>
            </div>
}
UrlMessage.propTypes = {
    content: PropTypes.string
};

export default function Links(props) {

    const { links } = props;


    const validMessage = (msg) => {
        return (msg.type === "url") ? <UrlMessage content={msg.message}/> : <TextMessage content={msg.message}/>;
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
    links: PropTypes.arrayOf({
        type: PropTypes.string,
        message: PropTypes.string
    })
};