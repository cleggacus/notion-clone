import { FC, useEffect, useRef } from "react";
import styles from "styles/components/Block.module.scss"
import { BlockInfo } from "utils/editor/block";

type Props = {
  blockInfo: BlockInfo,
  focused: boolean,
  focus: () => void,
  setCol: (col: [number, number]) => void,
  col: [number, number],
  modifyBlock: (info: Partial<BlockInfo>) => void,
}

const Input: FC<Props> = ({ blockInfo, focused, focus, col, setCol, modifyBlock }) => {
  const ref = useRef<HTMLDivElement>(null);

  const getRangeOffset = () => {
    const sel = window.getSelection()
    let val = [0, 0];

    if(ref.current && sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      val = [range.startOffset, range.endOffset];
    }

    return val
  }

  const onKeyUp = () => {
    const [start, end] = getRangeOffset();
    setCol([start, end-start])
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

  const setActualCol = () => {
    if(ref.current && ref.current.firstChild && ref.current.textContent) {
      const range = document.createRange();
      const sel = window.getSelection();

      range.selectNodeContents(ref.current)

      let [colPos, colLen] = col;

      if(colPos < 0)
        colPos = 0;
      if(colPos > ref.current.textContent.length)
        colPos = ref.current.textContent.length - 1

      if(colLen < 0)
        colLen = 0
      if(colLen > ref.current.textContent.length - colPos)
        colLen = ref.current.textContent.length - colPos

      range.setStart(ref.current.firstChild, colPos);
      range.setEnd(ref.current.firstChild, colPos + colLen);

      if(sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      } 
    }
  }

  useEffect(() => {
    if(ref.current && focused)
      ref.current.focus()
  }, [focused])

  useEffect(() => {
    if(ref.current && ref.current.textContent != blockInfo.content) {
      ref.current.textContent = blockInfo.content
    }
  }, [blockInfo.content])

  useEffect(() => {
    const [start, end] = getRangeOffset();
    const [colPos, colLen] = col;

    if(colPos != start || colLen != end - start)
      setActualCol();
  }, [col])

  return <div
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
}

export default Input;
