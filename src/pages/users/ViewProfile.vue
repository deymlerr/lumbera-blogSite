<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../api.js'
import { useGlobalStore } from '../../global.js'

const route = useRoute()
const globalStore = useGlobalStore()

const user = ref(null)
const loading = ref(true)
const error = ref(null)

const currentUserId = computed(() => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  return globalStore.user._id || globalStore.user.id || storedUser._id || storedUser.id || null
})

const isCurrentUser = computed(() => user.value && currentUserId.value && user.value._id === currentUserId.value)

async function loadProfile() {
  loading.value = true
  error.value = null

  try {
    const { data } = await api.get(`/users/${route.params.id}`)
    user.value = data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load user profile.'
  } finally {
    loading.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <section class="container py-5">
    <div class="mb-4">
      <h1 class="mb-3">Profile</h1>
      <p class="text-muted">View your profile details and access update actions.</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="user" class="card">
      <div class="card-body">
        <h2 class="card-title">{{ user.firstName }} {{ user.lastName }}</h2>
        <p class="text-muted mb-4">{{ user.email }}</p>

        <div class="mb-3">
          <strong>Mobile Number</strong>
          <p class="mb-0">{{ user.mobileNo || 'Not provided' }}</p>
        </div>

        <div class="mb-3">
          <strong>Admin</strong>
          <p class="mb-0">{{ user.isAdmin ? 'Yes' : 'No' }}</p>
        </div>

        <div v-if="isCurrentUser" class="mt-4 d-flex flex-wrap gap-2">
          <router-link class="btn btn-primary" :to="{ name: 'UpdateProfile', params: { id: user._id } }">Update Profile</router-link>
          <router-link class="btn btn-outline-secondary" :to="{ name: 'UpdatePassword', params: { id: user._id } }">Update Password</router-link>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-secondary">No profile data found.</div>
  </section>
</template>