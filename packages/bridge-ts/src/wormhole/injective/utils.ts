import { CosmwasmWasmV1Query } from '@injectivelabs/core-proto-ts'
import { zeroPad } from 'ethers/lib/utils'
import { bech32 } from 'bech32'

export const parseSmartContractStateResponse: any = ({
  data,
}: CosmwasmWasmV1Query.QuerySmartContractStateResponse) =>
  JSON.parse(
    Buffer.from(
      typeof data === 'string' ? data : Buffer.from(data).toString(),
      'base64',
    ).toString(),
  )

// Scan for the Sequence attribute in all the outputs of the transaction.
export function parseSequenceFromLogInjective(info: any): string {
  let sequence = ''

  const jsonLog = JSON.parse(info.rawLog)

  jsonLog.map((row: any) => {
    row.events.map((event: any) => {
      event.attributes.map((attribute: any) => {
        if (attribute.key === 'message.sequence') {
          sequence = attribute.value
        }
      })
    })
  })

  return sequence.toString()
}

export async function getEmitterAddressInjective(programAddress: string) {
  return Buffer.from(
    zeroPad(bech32.fromWords(bech32.decode(programAddress).words), 32),
  ).toString('hex')
}
