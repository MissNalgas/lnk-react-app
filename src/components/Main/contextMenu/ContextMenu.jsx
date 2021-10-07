import styles from "./ContextMenu.module.css";
import PropTypes from 'prop-types';

function ContextMenu({context}) {


    return  <div style={{left: `${context.x}px`, top: `${context.y}px`}} className={context.visible ? styles.contextMenu : `${styles.contextMenu} ${styles.contextMenuHidden}`}>
                {context.items.map((item) => (
                    <div className={styles.item} onClick={() => item.fn()} key={item.label}>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>

}


ContextMenu.propTypes = {
    context: PropTypes.exact({
        x: PropTypes.number,
        y: PropTypes.number,
        items: PropTypes.arrayOf(PropTypes.exact({
            label: PropTypes.string,
            fn: PropTypes.func
        })),
        visible: PropTypes.bool
    })
}

export default ContextMenu;