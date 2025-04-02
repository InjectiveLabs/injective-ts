<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { turnkeyStrategy, turnkeyStatus, oidcToken } from '../reactives'
import { generateGoogleUrl } from '../utils'

const email = ref('')
const OTP = ref('')

const oauthError = ref('')

function handleEmailSubmit() {
  console.log('email', email.value)
  turnkeyStrategy.value?.enable({
    provider: 'email',
    email: email.value,
    initEmailOTPEndpoint: 'http://localhost:3000/turnkey/init-email-auth',
  })
}

async function handleOTPSubmit() {
  console.log('OTP', OTP.value)
  await turnkeyStrategy.value?.confirmEmailOTP({
    otpCode: OTP.value,
    endpoint: 'http://localhost:3000/turnkey/verify-email-auth',
  })
}

function handleSubmitClick() {
  if (turnkeyStatus.value === 'waiting-otp') {
    return handleOTPSubmit()
  }

  if (turnkeyStatus.value === 'ready') {
    return handleEmailSubmit()
  }

  throw new Error('Turnkey not ready')
}

async function handleGoogleOAuthClick() {
  console.log('Google')

  const nonce = await turnkeyStrategy.value?.generateOAuthNonce()

  if (!nonce) {
    throw new Error('Nonce not found')
  }

  const url = generateGoogleUrl(nonce)

  console.log('🪵 | handleGoogleSubmit | url:', url)
  window.location.href = url
}

onMounted(async () => {
  // ? Watches for a token response form Google and logs in if its there
  if (oidcToken.value) {
    const result = await turnkeyStrategy.value?.enable({
      provider: 'google',
      oidcToken: oidcToken.value,
      oauthLoginEndpoint: 'http://localhost:3000/turnkey/oauth-login',
    })

    if (!result) {
      //  tell the use to login with  OTP, store a flag
      oauthError.value =
        'An error occurred. Try logging in with your original signup method.'
    }
    // Clear all params from URL either way
    window.history.replaceState({}, '', window.location.pathname)
    oidcToken.value = ''
  }
})
</script>

<template>
  <div style="gap: 10px; display: flex; flex-direction: column">
    <form @submit.prevent="handleSubmitClick">
      <div v-if="oauthError" style="color: red">{{ oauthError }}</div>
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
    <div v-if="!oauthError && turnkeyStatus !== 'waiting-otp'">
      <div>or</div>
      <button @click="handleGoogleOAuthClick">Login with Google</button>
    </div>
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
