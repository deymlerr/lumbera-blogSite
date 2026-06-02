<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api.js'

const route = useRoute()
const router = useRouter()

const form = ref({
  newPassword: '',
  confirmPassword: '',
})
const saving = ref(false)
const error = ref(null)
const successMsg = ref(null)

function clearMessages() {
  error.value = null
  successMsg.value = null
}

async function updatePassword() {
  clearMessages()

  if (form.value.newPassword.length < 8) {
    error.value = 'New password must be at least 8 characters long.'
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'Passwords do not match.'
    return
  }

  saving.value = true

  try {
    const { data } = await api.patch(`/users/${route.params.id}/update-password`, {
      newPassword: form.value.newPassword,
    })
    successMsg.value = data.message || 'Password updated successfully.'
    form.value.newPassword = ''
    form.value.confirmPassword = ''
    router.push({ name: 'ViewProfile', params: { id: route.params.id } })
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update password.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="container py-5">
    <div class="mb-4">
      <h1 class="mb-3">Update Password</h1>
      <p class="text-muted">Choose a new password for your account.</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <form @submit.prevent="updatePassword">
      <div class="mb-3">
        <label class="form-label">New Password</label>
        <input v-model="form.newPassword" type="password" class="form-control" minlength="8" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Confirm New Password</label>
        <input v-model="form.confirmPassword" type="password" class="form-control" minlength="8" required />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="saving">
        {{ saving ? 'Saving...' : 'Update Password' }}
      </button>
      <router-link class="btn btn-outline-secondary ms-2" :to="{ name: 'ViewProfile', params: { id: route.params.id } }">Cancel</router-link>
    </form>
  </section>
</template>