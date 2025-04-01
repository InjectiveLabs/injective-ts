<script lang="ts" setup>
import { MsgSend, type Msgs, type TxResponse } from '@injectivelabs/sdk-ts'
import { ref } from 'vue'

const { address, sendTx, logout } = defineProps<{
  address: string
  sendTx: (msgs: Msgs) => Promise<TxResponse>
  logout?: () => Promise<void>
}>()

const to = ref(address)
const from = ref(address)
const amount = ref('1000000')
// const amount = ref('1')
const denom = ref(
  'factory/inj1dm0yt646fsjsvznjz2twyht9ytcmwz3aqydjjp/RealTrumPepe',
)
// const denom = ref('inj')

const txHash = ref('')

const isLoading = ref(false)

const handleSubmit = async () => {
  console.log('to', to.value)
  console.log('amount', amount.value)

  if (!to.value || !amount.value || !denom.value) {
    throw new Error('Invalid input')
  }

  isLoading.value = true

  const msgs = MsgSend.fromJSON({
    srcInjectiveAddress: from.value,
    dstInjectiveAddress: to.value,
    amount: [
      {
        denom: denom.value,
        amount: amount.value,
      },
    ],
  })

  try {
    const result = await sendTx(msgs)
    if (result.txHash) {
      txHash.value = result.txHash
    }
  } catch (error) {
    console.error('Error sending tx', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <h2>Connected!</h2>
  <button @click="logout">Logout</button>
  <div>
    <span>Addresses: {{ address }}</span>
  </div>

  <h3>Send Tx</h3>
  <form>
    <label>
      <span>To</span>
      <input type="text" v-model="to" />
    </label>
    <label>
      <span>Amount</span>
      <input type="text" v-model="amount" />
    </label>
    <label>
      <span>Denom</span>
      <input type="text" v-model="denom" />
    </label>
    <button type="submit" @click.prevent="handleSubmit" :disabled="isLoading">
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

<style>
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
