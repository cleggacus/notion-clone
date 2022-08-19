import { FC } from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { MdOutlineAdd, MdOutlineDragIndicator } from "react-icons/md";
import styles from "styles/components/Block.module.scss"

type Props = {
  handleProps?: DraggableProvidedDragHandleProps,
  select: () => void
}

const Dragger: FC<Props> = ({ select, handleProps }) => {
  return <div className={styles.tool}>
    <div className={`${styles.icon} ${styles.add}`}>
      <MdOutlineAdd></MdOutlineAdd>
    </div>
    <div 
      onMouseDown={e => {
        e.stopPropagation();
        select();
      }}
      className={`${styles.icon} ${styles.grab}`}
      {...handleProps}
    >
      <MdOutlineDragIndicator></MdOutlineDragIndicator>
    </div>
  </div>
}

export default Dragger;