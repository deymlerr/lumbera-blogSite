<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api.js'

const route = useRoute()
const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  mobileNo: '',
})
const loading = ref(true)
const saving = ref(false)
const error = ref(null)
const successMsg = ref(null)

function clearMessages() {
  error.value = null
  successMsg.value = null
}

async function loadProfile() {
  loading.value = true
  clearMessages()

  try {
    const { data } = await api.get(`/users/${route.params.id}`)
    form.value.firstName = data.firstName || ''
    form.value.lastName = data.lastName || ''
    form.value.mobileNo = data.mobileNo || ''
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load profile.'
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  clearMessages()
  saving.value = true

  try {
    const { data } = await api.patch(`/users/${route.params.id}/update-profile`, {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      mobileNo: form.value.mobileNo,
    })
    successMsg.value = 'Profile updated successfully.'
    router.push({ name: 'ViewProfile', params: { id: route.params.id } })
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update profile.'
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <section class="container py-5">
    <div class="mb-4">
      <h1 class="mb-3">Update Profile</h1>
      <p class="text-muted">Edit your name and mobile number.</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <form v-else @submit.prevent="updateProfile">
      <div class="mb-3">
        <label class="form-label">First Name</label>
        <input v-model="form.firstName" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Last Name</label>
        <input v-model="form.lastName" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Mobile Number</label>
        <input v-model="form.mobileNo" type="tel" class="form-control" placeholder="09123456789" required />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="saving">
        {{ saving ? 'Saving...' : 'Save Profile' }}
      </button>
      <router-link class="btn btn-outline-secondary ms-2" :to="{ name: 'ViewProfile', params: { id: route.params.id } }">Cancel</router-link>
    </form>
  </section>
</template>