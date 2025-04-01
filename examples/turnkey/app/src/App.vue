<script setup lang="ts">
import { BaseWalletStrategy, MsgBroadcaster } from '@injectivelabs/wallet-core'
import {
  TurnkeyWallet,
  TurnkeyWalletStrategy,
  type TurnkeyStatus,
} from '@injectivelabs/wallet-turnkey/src/index.ts'
import { injectiveClients } from './injective-clients'
import { computed, onMounted, ref, watch } from 'vue'
import { Wallet } from '@injectivelabs/wallet-base'
import LoginForm from './components/LoginForm.vue'
import Connected from './components/Connected.vue'
import {
  getEthereumAddress,
  type Msgs,
  type TxResponse,
} from '@injectivelabs/sdk-ts'
const turnkeyAuthIframeContainerId = 'turnkey-auth-iframe-container-id'

const turnkeyStrategy = ref<TurnkeyWalletStrategy | null>(null)
const broadcaster = ref<MsgBroadcaster | null>(null)
const turnkeyStatus = ref<TurnkeyStatus | null>(null)
const address = ref<string | null>(null)

const turnkeyReadyAndLoggedIn = computed(() => {
  return turnkeyStatus.value === 'logged-in' && turnkeyStrategy.value
})

onMounted(async () => {
  const _turnkeyStrategy = await TurnkeyWallet.create({
    onStatusChange(status) {
      turnkeyStatus.value = status
    },
    chainId: injectiveClients.chainId,
    ethereumOptions: {
      ethereumChainId: injectiveClients.ethereumChainId!,
    },
    metadata: {
      turnkeyAuthIframeContainerId,
      defaultOrganizationId: import.meta.env
        .VITE_TURNKEY_DEFAULT_ORGANIZATION_ID,
      apiBaseUrl: 'https://api.turnkey.com',
    },
  })

  turnkeyStrategy.value = _turnkeyStrategy
})

watch(turnkeyReadyAndLoggedIn, async (_ready) => {
  if (!_ready) {
    return
  }

  console.log('Watching and updating broadcaster')

  const _walletStrategy = new BaseWalletStrategy({
    strategies: {
      [Wallet.Turnkey]: turnkeyStrategy.value as TurnkeyWalletStrategy,
    },
    chainId: injectiveClients.chainId,
    wallet: Wallet.Turnkey,
  })

  broadcaster.value = new MsgBroadcaster({
    network: injectiveClients.network,
    walletStrategy: _walletStrategy,
    ethereumChainId: injectiveClients.ethereumChainId!,
    endpoints: injectiveClients.endpoints,
  })

  const addresses = await _walletStrategy?.getAddresses()
  console.log('🪵 | addresses:', addresses)
  console.log('relevant address: ', addresses[0])
  address.value = addresses[0]
})

watch(turnkeyStatus, (status) => {
  console.log('🪵 | turnkeyStatus:', status)
})

async function sendTx(msgs: Msgs): Promise<TxResponse> {
  if (!broadcaster.value) {
    throw new Error('Broadcaster not initialized')
  }

  if (!address.value) {
    throw new Error('Address not initialized')
  }

  const result = await broadcaster.value.broadcastWithFeeDelegation({
    msgs,
    injectiveAddress: address.value,
    ethereumAddress: getEthereumAddress(address.value),
  })

  console.log('🪵 | result:', result)

  return result
}
</script>

<template>
  <h1>Injective + Turnkey</h1>
  <LoginForm
    :init-email-o-t-p="turnkeyStrategy.initEmailOTP.bind(turnkeyStrategy)"
    :confirm-email-o-t-p="turnkeyStrategy.confirmEmailOTP.bind(turnkeyStrategy)"
    :turnkey-status="turnkeyStatus"
    v-if="turnkeyStrategy && turnkeyStatus && turnkeyStatus !== 'logged-in'"
  />
  <Connected
    v-if="address && turnkeyStatus === 'logged-in'"
    :address="address"
    :send-tx="sendTx"
    :logout="turnkeyStrategy?.disconnect.bind(turnkeyStrategy)"
  />
  <div :id="turnkeyAuthIframeContainerId" style="display: none"></div>
</template>

<style>
input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
</style>
