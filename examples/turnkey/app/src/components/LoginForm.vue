<script setup lang="ts">
import { ref } from 'vue'
import {
  TurnkeyWallet,
  type TurnkeyStatus,
} from '@injectivelabs/wallet-turnkey/src/index.ts'

const { initEmailOTP, confirmEmailOTP, turnkeyStatus } = defineProps<{
  initEmailOTP: typeof TurnkeyWallet.prototype.initEmailOTP
  confirmEmailOTP: typeof TurnkeyWallet.prototype.confirmEmailOTP
  turnkeyStatus: TurnkeyStatus
}>()

const email = ref('')
const OTP = ref('')

function handleEmailSubmit() {
  console.log('email', email.value)
  initEmailOTP({
    email: email.value,
    endpoint: 'http://localhost:3000/turnkey/init-email-auth',
  })
}

async function handleOTPSubmit() {
  console.log('OTP', OTP.value)
  await confirmEmailOTP({
    otpCode: OTP.value,
    endpoint: 'http://localhost:3000/turnkey/verify-email-auth',
  })
}

function handleSubmit() {
  if (turnkeyStatus === 'waiting-otp') {
    return handleOTPSubmit()
  }

  if (turnkeyStatus === 'ready') {
    return handleEmailSubmit()
  }

  throw new Error('Turnkey not ready')
}
</script>

<template>
  <div style="gap: 10px; display: flex; flex-direction: column">
    <form @submit.prevent="handleSubmit">
      <label>
        <span>Email address </span>
        <input
          type="email"
          v-model="email"
          required
          :disabled="turnkeyStatus === 'waiting-otp'"
        />
      </label>
      <label v-if="turnkeyStatus === 'waiting-otp'">
        <span>OTP</span>
        <input
          type="text"
          v-model="OTP"
          :required="turnkeyStatus === 'waiting-otp'"
        />
      </label>
      <button type="submit">Submit</button>
    </form>
    <!-- TODO -->
    <!-- <div>or</div>
    <button @click="">Login with Google</button> -->
  </div>
</template>

<style scoped>
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
