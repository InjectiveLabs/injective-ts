import {
  Web3Exception,
  LedgerException,
} from '../packages/exceptions/dist/esm/index.js'

const aaa = new Web3Exception({
  name: 'chen wei le',
  message: 'aaa',
})

const bbb = new LedgerException({
  name: 'fake chinese',
  message: 'aaa',
})
