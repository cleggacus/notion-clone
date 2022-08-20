import { DetailedHTMLProps, HTMLAttributes, KeyboardEventHandler, MouseEventHandler, useEffect, useState } from "react"
import { FC } from "react"
import styles from "styles/components/Editor.module.scss"
import { DragDropContext, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd"
import { Block, createBlock } from "utils/editor/block"
import BlockComponent from "./BlockComponent"

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type Props = DivProps;

const Editor: FC<Props> = ({ className, ...props }) => {
  const [dragging, setDragging] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([
    createBlock({ type: "title" })
  ])

  const [row, setRow] = useState(0);
  const [col, setCol] = useState<[number, number]>([0, 0]);
  const [selected, setSelected] = useState(-1);

  const dragStart = () => setDragging(true);
  
  const dragEnd = (result: DropResult, _provided: ResponderProvided) => {
    if (!result.destination) return;
    let updatedList = [...blocks];
    const [reorderedItem] = updatedList.splice(result.source.index, 1);
    updatedList.splice(result.destination.index, 0, reorderedItem);
    setDragging(false);
    setSelected(result.destination.index);
    setBlocks(updatedList);
  };

  const modifyBlock = (index: number, info: Partial<Block>) => {
    setBlocks(blocks => blocks.map((block, i) => {
      return index == i ? Object.assign(block, info) : block
    }))
  }

  const deleteCurrentBlock = () => {
    if(row > 0) {
      setRow(row-1)
      setCol([blocks[row-1].content.length, 0])

      setBlocks(blocks => {
        blocks[row-1].content += blocks[row].content;
        blocks.splice(row, 1)
        return blocks;
      })
    }
  }

  const addNewBlock = (index = blocks.length, moveContentsDown = false) => {
    setBlocks(blocks => {
      blocks.splice(index, 0, createBlock())

      const [colPos] = col;

      if(moveContentsDown && index > 0) {
        blocks[index].content += blocks[index-1].content.substring(colPos)
        blocks[index-1].content = blocks[index-1].content.substring(0, colPos)
      }

      return blocks
    })

    setRow(index);
    setCol([0, 0]);
}

  const onClick: MouseEventHandler<HTMLDivElement> = e => {
    if(!dragging) {
      const last = blocks[blocks.length-1]
      if(!last || last.content || last.isMetaBlock())
        addNewBlock();
      else
        setRow(row => row + 1);
    }
  }

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = e => {
    switch(e.key) {
      case "Enter":
        addNewBlock(row+1, true)
        e.preventDefault()
        break;
      case "Backspace":
        const [colPos, colLen] = col
        const block = blocks[row];
        if(colPos == 0 && colLen == 0) {
          if(block.isDefaultType()) 
            deleteCurrentBlock();
          else
            modifyBlock(row, {
              type: "p"
            })
          e.preventDefault();
        }
        break;
    }
  }

  useEffect(() => {
    if(row >= blocks.length)
      setRow(blocks.length-1)
    else if(row < -1)
      setRow(-1)
  }, [row])

  useEffect(() => {
    window.addEventListener("mousedown", () => {
      setSelected(-1)
    })
  }, [])

  return <DragDropContext onDragStart={dragStart} onDragEnd={dragEnd}>
    <Droppable droppableId="list-container">
    {
      provided => ( 
        <div 
          onClick={onClick}
          onKeyDown={onKeyDown}
          className={`${styles.container}  ${className || ""}`}
          suppressContentEditableWarning={true}
          contentEditable={row >= 0}
          ref={provided.innerRef}
          { ...provided.droppableProps }
          { ...props }
        > 
          {
            blocks.map((block, key) => (
              <BlockComponent
                key={key}
                index={key}
                block={block}
                modifyBlock={info => modifyBlock(key, info)} 
                focused={row==key}
                focus={() => setRow(key)}
                col={col}
                setCol={setCol}
                selected={selected == key}
                select={() => setSelected(key)}
              ></BlockComponent>
            ))
          } 

          {provided.placeholder} 
        </div>
      )
    }
    </Droppable>
  </DragDropContext>
}

export default Editor