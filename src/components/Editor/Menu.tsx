import { FC, useEffect, useRef, useState } from "react";
import styles from "styles/components/Block.module.scss";
import { BsType, BsTypeH1, BsTypeH2, BsTypeH3 } from "react-icons/bs"
import { Block, BlockType } from "utils/editor/block";
import { IconType } from "react-icons";

type Props = {
  block: Block,
  select: (item: Item) => void,
  setItem: (item: Item) => void
}

export type Item = {
  title: string,
  desc: string,
  type: BlockType,
  terms: string[],
  Icon: IconType
}

const allItems: Item[] = [
  {
    title: "Text",
    desc: "Just start typing with plain text.",
    type: "p",
    terms: ["p", "text", "paragraph"],
    Icon: BsType
  },
  {
    title: "Heading 1",
    desc: "Big section heading.",
    type: "h1",
    terms: ["h1", "text", "heading1"],
    Icon: BsTypeH1
  },
  {
    title: "Heading 2",
    desc: "Medium section heading.",
    type: "h2",
    terms: ["h2", "text", "heading2"],
    Icon: BsTypeH2
  },
  {
    title: "Heading 3",
    desc: "Small section heading.",
    type: "h3",
    terms: ["h3", "text", "heading3"],
    Icon: BsTypeH3
  },
]

const Menu: FC<Props> = ({ block, setItem, select }) => {
  const [items, setItems] = useState(allItems);

  useEffect(() => {
    const value = block.content.substring(1);

    let results = [];

    for(const item of allItems) {
      for(const term of item.terms) {
        if(term.includes(value)) {
          results.push(item);
          break;
        }
      }
    }

    setItems(results)
  }, [block.content]);

  useEffect(() => {
    setItem(items[0]);
  }, [items])

  return <div 
    onClick={e => e.preventDefault()}
    className={styles.menuContainer}
  >
    <div className={styles.menu}>
      {
        items.map((item, key) => {
          return <div 
            key={key}
            onClick={() => {
              select(items[key])
            }}
            className={styles.item}
          >
            <div className={styles.inner}>
              <div className={styles.icon}>
                <item.Icon></item.Icon>
              </div>

              <div className={styles.desc}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          </div>
        })
      }
    </div>
  </div>
}

export default Menu;
