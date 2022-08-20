import { FC, memo, useEffect, useRef, useState } from "react";
import styles from "styles/components/Block.module.scss"
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import Input from "./Input";
import { Block } from "utils/editor/block";
import Dragger from "./Dragger";
import Menu, { Item } from "./Menu";

type Props = {
  block: Block,
  modifyBlock: (info: Partial<Block>) => void,
  focused: boolean,
  focus: () => void,
  col: [number, number],
  setCol: (col: [number, number]) => void
  selected: boolean,
  select: () => void,
  index: number
}

type InnerBlockProps = Props & {
  provided?: DraggableProvided
}

const InnerBlock: FC<InnerBlockProps> = ({ 
  select, selected, col, setCol, block, modifyBlock, focused, focus, provided
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [item, setItem] = useState<Item>();

  const selectItem = (value = item) => {
    if(value && showMenu) {
      modifyBlock({
        content: "",
        type: value.type
      })

      setShowMenu(false)
      setItem(undefined)

      return true;
    }
    return false;
  }

  useEffect(() => {
    if(block.isMetaBlock())
      return;
    setShowMenu(block.content.startsWith("/"))
  }, [block.content])

  useEffect(() => {
    provided?.innerRef(ref.current);
  }, [ref.current])

  useEffect(() => {
    if(!focused)
      setShowMenu(false)
  }, [focused])

  return <div 
    className={`item-container ${styles.container} ${styles[block.type]} ${selected ? styles.selected : ""}`}
    tabIndex={1}
    onClick={e => {
      e.stopPropagation()
    }}
    contentEditable={false}
    onKeyDown={e => {
      if(e.key == "Enter") {
        if(selectItem(item)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }}
    onFocus={() => focus()}
    ref={ref}
    {...provided?.draggableProps} 
  >
    {
      !block.isMetaBlock() ?
        <Dragger
            select={select}
            handleProps={provided?.dragHandleProps}
            setShowMenu={setShowMenu}
        ></Dragger> : <></>
    }

    <Input 
      col={col} 
      setCol={setCol}
      block={block}
      modifyBlock={modifyBlock}
      focused={focused && !showMenu}
    ></Input>

    {
      showMenu ? <Menu
        select={selectItem}
        setItem={setItem}
        block={block}
      /> : <></>
    }
  </div>
}

const BlockComponent: FC<Props> = (props) => {
  if(!props.block.isMetaBlock())
    return <Draggable 
      key={props.block.id} 
      draggableId={props.block.id} 
      index={props.index}
    >
      { provided => <InnerBlock provided={provided} {...props} /> }
    </Draggable>
  
  return <InnerBlock {...props} ></InnerBlock>
}

export default memo(BlockComponent, (prev, next) => {
  return !(
    (
      (prev.focused || next.focused) &&
      (prev != next)
    ) ||
    (prev.select != next.select)
  )
});
