export type BlockInfo = {
  id: string,
  content: string
}

const genRanHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const getNewBlock = (): BlockInfo => ({
  id: genRanHex(16),
  content: ""
})

export {
  getNewBlock
}