import Block from "./Block"
import { DetailedHTMLProps, HTMLAttributes, KeyboardEventHandler, MouseEventHandler, useEffect, useState } from "react"
import { FC } from "react"
import styles from "styles/components/Editor.module.scss"
import useStatePromise from "utils/useStatePromise"
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd"

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type Props = DivProps;

export type BlockInfo = {
  id: string,
  content: string
}

const genRanHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const getNewBlock = (): BlockInfo => ({
  id: genRanHex(16),
  content: ""
})

const Editor: FC<Props> = ({ className, ...props }) => {
  const [dragging, setDragging] = useStatePromise(false);
  const [blocks, setBlocks] = useState<BlockInfo[]>([])
  const [row, setRow] = useStatePromise(-1);
  const [col, setCol] = useStatePromise(-1);
  const [selected, setSelected] = useStatePromise(-1);
  const [colLen, setColLen] = useStatePromise(0);

  const dragStart = () => {
    setDragging(true);
  }
  
  const handleDrop = (result: DropResult, _provided: ResponderProvided) => {
    if (!result.destination) return;
    var updatedList = [...blocks];
    const [reorderedItem] = updatedList.splice(result.source.index, 1);
    updatedList.splice(result.destination.index, 0, reorderedItem);
    setDragging(false);
    setSelected(result.destination.index);
    setBlocks(updatedList);
  };

  const modifyBlock = (index: number, info: Partial<BlockInfo>) => {
    setBlocks(blocks => blocks.map((block, i) => {
      return index == i ? {
        ...block,
        ...info
      } : block
    }))
  }

  const deleteCurrentBlock = () => {
    if(row > 0) {
      const temp = blocks.map(block => ({...block}));

      temp[row-1].content += temp[row].content;
      temp.splice(row, 1)

      setRow(row-1)
      setCol(blocks[row-1].content.length || 0)
      setBlocks(temp)
    }
  }

  const addNewBlock = (index = blocks.length, moveContentsDown = false) => {
    const temp = blocks.map(block => ({...block}));

    temp.splice(index, 0, getNewBlock())

    if(moveContentsDown && index > 0) {
      temp[index].content += temp[index-1].content.substring(col)
      temp[index-1].content = temp[index-1].content.substring(0, col)
    }

    setBlocks(temp);
    setRow(index);
    setCol(0);
}

  const onClick: MouseEventHandler<HTMLDivElement> = e => {
    if(!dragging) {
      if(!blocks.length || blocks[blocks.length-1].content)
        addNewBlock();
      else
        setRow(row => row + 1);
    }
  }

  useEffect(() => {
    if(row >= blocks.length)
      setRow(blocks.length-1)
    else if(row < -1)
      setRow(-1)
  }, [row])

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = e => {
    switch(e.key) {
      case "Enter":
        addNewBlock(row+1, true)
        e.preventDefault()
        break;
      case "Backspace":
        if(col == 0 && colLen == 0) {
          deleteCurrentBlock();
          e.preventDefault();
        }
        break;
    }
  }

  useEffect(() => {
    window.addEventListener("mousedown", () => {
      setBlocks(blocks => blocks.map(block => ({
        ...block,
        selected: false
      })))
    })
  }, [])

  return <DragDropContext onDragStart={dragStart} onDragEnd={handleDrop}>
    <Droppable droppableId="list-container">
    {
      (provided) => ( 
        <div 
          onClick={onClick}
          onKeyDown={onKeyDown}
          className={`${styles.container}  ${className || ""}`}
          suppressContentEditableWarning={true}
          contentEditable={row >= 0}
          { ...props }
          { ...provided.droppableProps }
          ref={provided.innerRef}
        > {
          blocks.map((blockInfo, key) => {
            return <Draggable key={blockInfo.id} draggableId={blockInfo.id} index={key}>
              {
                (provided) => (
                  <div
                    className="item-container"
                    ref={provided.innerRef}
                    {...provided.draggableProps} 
                  >
                    <Block
                      blockInfo={blockInfo}
                      modifyBlock={info => modifyBlock(key, info)} 
                      focused={row==key}
                      focus={() => setRow(key)}
                      col={col}
                      setCol={setCol}
                      colLen={colLen}
                      setColLen={setColLen}
                      handleProps={provided.dragHandleProps}
                      selected={selected == key}
                      select={() => setSelected(key)}
                    ></Block>
                  </div>
                )
              }
            </Draggable>
          })
        } 

        {provided.placeholder} 
        </div>
      )
    }
    </Droppable>
  </DragDropContext>
}

export default Editor