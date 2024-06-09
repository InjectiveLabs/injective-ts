import { Alchemy, Network } from 'alchemy-sdk'
import { Network as InjNetwork, isMainnet } from '@injectivelabs/networks'
import { HttpClient } from '@injectivelabs/utils'

const HISTORICAL_BLOCKS = 4

const avg = (arr: any[]) => {
  const sum = arr.reduce((a, v) => a + v)

  return Math.round(sum / arr.length)
}

const formatFeeHistory = (result: any) => {
  const results = result.data.result
  let blockNum = Number(results.oldestBlock)
  let index = 0
  const blocks = []

  while (blockNum < Number(results.oldestBlock) + HISTORICAL_BLOCKS) {
    blocks.push({
      number: blockNum,
      baseFeePerGas: Number(results.baseFeePerGas[index]),
      gasUsedRatio: Number(results.gasUsedRatio[index]),
      priorityFeePerGas: results.reward[index].map((x: string | number) =>
        Number(x),
      ),
    })
    blockNum += 1
    index += 1
  }

  return blocks
}

export const fetchEstimatorGasPrice = async (
  alchemyRpcUrl: string,
  network: InjNetwork = InjNetwork.Mainnet,
) => {
  const isMainnetNetwork = isMainnet(network)
  const settings = {
    apiKey: alchemyRpcUrl,
    network: isMainnetNetwork ? Network.ETH_MAINNET : Network.ETH_SEPOLIA,
  }

  const url = `https://eth-${
    isMainnetNetwork ? 'mainnet' : 'sepolia'
  }.alchemyapi.io/v2/`
  const alchemy = new Alchemy(settings)
  const httpClient = new HttpClient(url)

  const feeHistory = (await httpClient
    .setConfig({
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    })
    .post(alchemyRpcUrl, {
      id: Date.now().toString(16),
      jsonrpc: '2.0',
      method: 'eth_feeHistory',
      params: ['0x5', 'latest', [25, 50, 75]],
    })) as any[]

  const blocks = formatFeeHistory(feeHistory)

  const slow = avg(blocks.map((b) => b.priorityFeePerGas[0]))
  const average = avg(blocks.map((b) => b.priorityFeePerGas[1]))
  const fast = avg(blocks.map((b) => b.priorityFeePerGas[2]))

  const pendingBlock = await alchemy.core.getBlock('pending')
  const baseFeePerGas = Number(pendingBlock.baseFeePerGas)

  return {
    slow: slow + baseFeePerGas,
    average: average + baseFeePerGas,
    fast: fast + baseFeePerGas,
  }
}
