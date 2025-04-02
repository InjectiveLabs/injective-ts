<script setup lang="ts">
import { BaseWalletStrategy, MsgBroadcaster } from '@injectivelabs/wallet-core'
import {
  TurnkeyWallet,
  TurnkeyWalletStrategy,
} from '@injectivelabs/wallet-turnkey/src/index.ts'
import { injectiveClients } from './injective-clients'
import { computed, onMounted, watch } from 'vue'
import { Wallet } from '@injectivelabs/wallet-base'
import LoginForm from './components/LoginForm.vue'
import Connected from './components/Connected.vue'
import {
  turnkeyStatus,
  turnkeyStrategy,
  address,
  broadcaster,
  oidcToken,
} from './reactives'

const turnkeyAuthIframeContainerId = 'turnkey-auth-iframe-container-id'
const turnkeyReadyAndLoggedIn = computed(() => {
  return turnkeyStatus.value === 'logged-in' && turnkeyStrategy.value
})

onMounted(async () => {
  const _turnkeyStrategy = new TurnkeyWallet({
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

onMounted(async () => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const params = {
    idToken: hashParams.get('id_token'),
  }

  oidcToken.value = params.idToken
})

watch(turnkeyReadyAndLoggedIn, async (_ready) => {
  if (!_ready) {
    return
  }

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
  address.value = addresses[0]
})
</script>

<template>
  <h1>Injective + Turnkey</h1>
  <div v-if="turnkeyStatus === 'initializing'">Loading...</div>
  <div v-else>
    <LoginForm
      v-if="turnkeyStrategy && turnkeyStatus && turnkeyStatus !== 'logged-in'"
    />
    <Connected v-if="address && turnkeyStatus === 'logged-in'" />
  </div>
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
