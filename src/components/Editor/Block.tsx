import { FC, memo } from "react";
import styles from "styles/components/Block.module.scss"
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import Input from "./Input";
import { BlockInfo } from "utils/editor/block";
import Dragger from "./Dragger";

type Props = {
  blockInfo: BlockInfo,
  modifyBlock: (info: Partial<BlockInfo>) => void,
  focused: boolean,
  focus: () => void,
  col: [number, number],
  setCol: (col: [number, number]) => void
  handleProps?: DraggableProvidedDragHandleProps,
  selected: boolean,
  select: () => void
}

const Block: FC<Props> = ({ select, selected, handleProps, col, setCol, blockInfo, modifyBlock, focused, focus }) => {
  return <div 
    className={`${styles.container} ${selected ? styles.selected : ""}`}
    onClick={e => e.stopPropagation()}
    contentEditable={false}
    onFocus={() => {
      focus();
    }}
  >
    <Dragger
        select={select}
        handleProps={handleProps}
    ></Dragger>

    <Input 
      col={col} 
      setCol={setCol}
      modifyBlock={modifyBlock}
      blockInfo={blockInfo}
      focus={focus}
      focused={focused}
    ></Input>

  </div>
}

export default memo(Block, (prev, next) => {
  return !(
    (
      (prev.focused || next.focused) &&
      (prev != next)
    ) ||
    (prev.select != next.select)
  )
});
