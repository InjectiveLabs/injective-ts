<script lang="ts" setup>
import { getEthereumAddress, MsgSend } from '@injectivelabs/sdk-ts'
import { onMounted, ref } from 'vue'
import { address, turnkeyStrategy, broadcaster, oidcToken } from '../reactives'
import { generateGoogleUrl } from '../utils'

const msgValues = ref({
  to: address.value,
  from: address.value,
  amount: '1000000',
  denom: 'factory/inj1dm0yt646fsjsvznjz2twyht9ytcmwz3aqydjjp/RealTrumPepe',
})

const txHash = ref('')

const isLoading = ref(false)

const handleSendClick = async () => {
  if (
    !msgValues.value.to ||
    !msgValues.value.from ||
    !msgValues.value.amount ||
    !msgValues.value.denom
  ) {
    throw new Error('Invalid input')
  }

  if (!address.value) {
    throw new Error('Address not initialized')
  }

  if (!broadcaster.value) {
    throw new Error('Broadcaster not initialized')
  }

  isLoading.value = true

  const msgs = MsgSend.fromJSON({
    srcInjectiveAddress: msgValues.value.from,
    dstInjectiveAddress: msgValues.value.to,
    amount: [
      {
        denom: msgValues.value.denom,
        amount: msgValues.value.amount,
      },
    ],
  })

  try {
    const result = await broadcaster.value.broadcastWithFeeDelegation({
      msgs,
      injectiveAddress: address.value,
      ethereumAddress: getEthereumAddress(address.value),
    })

    console.log('🪵 | result:', result)
    if (result.txHash) {
      txHash.value = result.txHash
    }
  } catch (error) {
    console.error('Error sending tx', error)
  } finally {
    isLoading.value = false
  }
}

async function deleteOrganization() {
  if (!turnkeyStrategy.value?.authIframeClient) {
    throw new Error('Auth iframe client not initialized')
  }

  const result =
    await turnkeyStrategy.value.authIframeClient.deleteSubOrganization({
      deleteWithoutExport: true,
      organizationId: turnkeyStrategy.value.organizationId,
      timestampMs: Date.now().toString(),
    })
  console.log('🪵 | deleteOrganization | result:', result)
}

async function addGoogleOAuth() {
  if (!turnkeyStrategy.value?.authIframeClient) {
    throw new Error('Auth iframe client not initialized')
  }
  const nonce = await turnkeyStrategy.value.generateOAuthNonce()

  const googleUrl = generateGoogleUrl(nonce)

  window.location.href = googleUrl
}

async function updateUserWithToken(oidcToken: string) {
  if (!turnkeyStrategy.value?.authIframeClient) {
    throw new Error('Auth iframe client not initialized')
  }

  const user = await turnkeyStrategy.value.turnkey.getCurrentUser()

  if (!user) {
    throw new Error('User not found')
  }

  const result =
    await turnkeyStrategy.value.authIframeClient.createOauthProviders({
      organizationId: turnkeyStrategy.value.organizationId,
      userId: user?.userId,
      oauthProviders: [{ providerName: 'google', oidcToken }],
    })

  console.log('🪵 | updateUserWithToken | result:', result)

  // Clear all params from URL either way
  window.history.replaceState({}, '', window.location.pathname)
}

onMounted(async () => {
  if (oidcToken.value) {
    updateUserWithToken(oidcToken.value)
  }
})
</script>

<template>
  <h2>Connected!</h2>
  <div class="actions">
    <button @click="turnkeyStrategy?.disconnect()">Logout</button>
    <button @click="deleteOrganization">Delete Organization (Account)</button>
    <button @click="addGoogleOAuth">Add Google OAuth</button>
  </div>
  <div>
    <span>Addresses: {{ address }}</span>
  </div>

  <h3>Send Tx</h3>
  <form>
    <label>
      <span>To</span>
      <input type="text" v-model="msgValues.to" />
    </label>
    <label>
      <span>Amount</span>
      <input type="text" v-model="msgValues.amount" />
    </label>
    <label>
      <span>Denom</span>
      <input type="text" v-model="msgValues.denom" />
    </label>
    <button
      type="submit"
      @click.prevent="handleSendClick"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Sending...' : 'Submit' }}
    </button>
    <div v-if="txHash">
      <span>Tx Hash: {{ txHash }}</span>
      <a :href="`https://injscan.com/transaction/${txHash}`" target="_blank">
        <span>View on Explorer</span>
      </a>
    </div>
  </form>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  padding-bottom: 10px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
