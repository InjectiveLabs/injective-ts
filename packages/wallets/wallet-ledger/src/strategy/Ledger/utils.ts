import { hashDomain, hashStruct } from 'viem'

type TypeDefinition = Record<string, Array<{ name: string; type: string }>>

export interface EIP712Message {
  types: TypeDefinition
  domain: Record<string, any>
  primaryType: string
  message: Record<string, any>
}

/**
 * Used mainly for Ledger Nano S
 */

export const domainHash = (message: EIP712Message): `0x${string}` => {
  return hashDomain({ domain: message.domain, types: message.types })
}

export const messageHash = (message: EIP712Message): `0x${string}` => {
  return hashStruct({
    data: message.message,
    types: message.types,
    primaryType: message.primaryType,
  })
}

/**
 * Checks if an EIP-712 payload is too large for Ledger hardware wallet signing
 * @param {Object} eip712Payload - The EIP-712 typed data object
 * @returns {boolean} - Returns true if payload is too big, false otherwise
 */
export function isEIP712PayloadTooBig(eip712Payload: any) {
  // Ledger-specific limits (based on observed behavior and firmware constraints)
  const LIMITS = {
    // Maximum size of the entire JSON payload in bytes
    MAX_TOTAL_SIZE: 8000,

    // Maximum size of the message.msgs field (often the largest field)
    MAX_MSGS_SIZE: 4000,

    // Maximum size of the message.context field
    MAX_CONTEXT_SIZE: 2000,

    // Maximum nesting depth for escaped JSON strings
    MAX_NESTING_DEPTH: 3,

    // Maximum number of messages in a batch transaction
    MAX_MESSAGE_COUNT: 3,
  }

  try {
    // Check 1: Total payload size
    const totalSize = JSON.stringify(eip712Payload).length

    if (totalSize > LIMITS.MAX_TOTAL_SIZE) {
      // console.log(
      //   `❌ Total payload size (${totalSize} bytes) exceeds limit (${LIMITS.MAX_TOTAL_SIZE} bytes)`,
      // )
      return true
    }

    // Check 2: Message msgs field size
    if (eip712Payload.message?.msgs) {
      const msgsSize = eip712Payload.message.msgs.length

      if (msgsSize > LIMITS.MAX_MSGS_SIZE) {
        // console.log(
        //   `❌ msgs field size (${msgsSize} bytes) exceeds limit (${LIMITS.MAX_MSGS_SIZE} bytes)`,
        // )
        return true
      }

      // Check 3: Count number of messages in the array
      try {
        const msgsArray = JSON.parse(eip712Payload.message.msgs)

        if (
          Array.isArray(msgsArray) &&
          msgsArray.length > LIMITS.MAX_MESSAGE_COUNT
        ) {
          // console.log(
          //   `❌ Message count (${msgsArray.length}) exceeds limit (${LIMITS.MAX_MESSAGE_COUNT})`,
          // )
          return true
        }

        // Check 4: Detect deeply nested escaped JSON (common in contract calls)
        for (const msg of msgsArray) {
          if (msg.msg && typeof msg.msg === 'string') {
            const escapeCount = (msg.msg.match(/\\\\/g) || []).length

            if (escapeCount > 10) {
              // console.log(
              //   `❌ Detected deeply nested/escaped JSON (${escapeCount} escape sequences)`,
              // )
              return true
            }
          }
        }
      } catch (e: any) {
        // If we can't parse msgs, it might be malformed
        console.warn('⚠️ Could not parse msgs field:', (e as any).message)
      }
    }

    // Check 5: Context field size
    if (eip712Payload.message?.context) {
      const contextSize = eip712Payload.message.context.length

      if (contextSize > LIMITS.MAX_CONTEXT_SIZE) {
        // console.log(
        //   `❌ context field size (${contextSize} bytes) exceeds limit (${LIMITS.MAX_CONTEXT_SIZE} bytes)`,
        // )
        return true
      }
    }

    // All checks passed
    // console.log('✅ Payload size is within acceptable limits')
    return false
  } catch (_error) {
    // console.error('Error validating payload:', _error)
    // If we can't validate, assume it might be too big
    return true
  }
}
