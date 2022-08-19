import { FC, KeyboardEventHandler, memo, useRef, useState } from "react";
import { BlockInfo } from ".";
import styles from "styles/components/Block.module.scss"
import { useEffect } from "react";
import { MdOutlineAdd, MdOutlineDragIndicator } from "react-icons/md";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";

type Props = {
  blockInfo: BlockInfo,
  modifyBlock: (info: Partial<BlockInfo>) => void,
  focused: boolean,
  focus: () => void,
  col: number,
  setCol: (col: number) => void
  colLen: number,
  setColLen: (col: number) => void,
  handleProps?: DraggableProvidedDragHandleProps,
  selected: boolean,
  select: () => void
}

const Block: FC<Props> = ({ select, selected, handleProps, colLen, setColLen, col, setCol, blockInfo, modifyBlock, focused, focus }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(ref.current && focused)
      ref.current.focus()
  }, [focused])

  useEffect(() => {
    if(ref.current && ref.current.textContent != blockInfo.content) {
      ref.current.textContent = blockInfo.content
    }
  }, [blockInfo.content])

  const getRangeOffset = () => {
    const sel = window.getSelection()
    let val = [0, 0];

    if(ref.current && sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      val = [range.startOffset, range.endOffset];
    }

    return val
  }

  const selectAll = () => {
    if(ref.current && ref.current.firstChild && ref.current.textContent) {
      const range = document.createRange();
      const sel = window.getSelection();

      range.selectNodeContents(ref.current)

      range.setStart(ref.current.firstChild, 0);
      range.setEnd(ref.current.firstChild, ref.current.textContent.length);

      if(sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      } 
    }
  }

  const onKeyUp = () => {
    const [start, end] = getRangeOffset();
    setCol(start);
    setColLen(end-start)
  } 

  const setActualCol = () => {
    if(ref.current && ref.current.firstChild && ref.current.textContent) {
      const range = document.createRange();
      const sel = window.getSelection();

      range.selectNodeContents(ref.current)

      if(col < 0)
        col = 0;
      if(col > ref.current.textContent.length)
        col = ref.current.textContent.length - 1

      if(colLen < 0)
        colLen = 0
      if(colLen > ref.current.textContent.length - col)
        colLen = ref.current.textContent.length - col

      range.setStart(ref.current.firstChild, col);
      range.setEnd(ref.current.firstChild, col + colLen);

      if(sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      } 
    }
  }

  useEffect(() => {
    const [start, end] = getRangeOffset();
    if(col != start || colLen != end - start)
      setActualCol();
  }, [col])

  console.log("update")

  return <div 
    className={`${styles.container} ${selected ? styles.selected : ""}`}
    onClick={e => e.stopPropagation()}
    contentEditable={false}
    onFocus={() => {
      focus();
    }}
  >
    <div className={styles.tool}>
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

    <div
      tabIndex={1}
      ref={ref} 
      className={styles.input} 
      contentEditable={true}
      data-placeholder="Type '/' for commands"
      onKeyUp={onKeyUp}
      onKeyDown={e => {
        if(e.key == "a" && e.ctrlKey) {
          selectAll()
          e.preventDefault()
        }
        else
          onKeyUp()
      }}
      onInput={e => {
        onKeyUp();

        modifyBlock({
          content: e.currentTarget.textContent || ""
        })
      }}
    ></div>
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
