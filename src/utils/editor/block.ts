const genRanHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export type BlockType = "title" | "p" | "h1" | "h2" | "h3";

const placeholders: {
  [key in BlockType]: string
} = {
  title: "Untitled",
  p: "Type '/' for commands",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3"
}

export type BlockData = {
  id: string,
  content: string,
  type: BlockType
}

export class Block implements BlockData {
  public id: string = genRanHex(16);
  public content: string = "";
  public type: BlockType = "p";

  public constructor(data?: Partial<BlockData>) {    
    Object.assign(this, data);
  }

  public isMetaBlock() {
    return this.type == "title";
  }

  public getPlaceholder() {
    return placeholders[this.type] || "";
  }

  public isDefaultType() {
    return this.type == "p" || this.type == "title";
  }
}

export const createBlock = (data?: Partial<BlockData>) => new Block(data);