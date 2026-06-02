<script setup>
import '../../assets/main/style.css'
import { computed, onMounted, ref } from 'vue'
import api from '../../api.js'
import { useGlobalStore } from '../../global.js'
import UserCard from '../../components/UserCard.vue'

const users = ref([])
const loading = ref(false)
const actionLoading = ref(false)
const error = ref(null)
const successMsg = ref(null)

const globalStore = useGlobalStore()

const currentUserId = computed(() => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  return globalStore.user._id || globalStore.user.id || storedUser._id
})

const adminCount = computed(() => users.value.filter(user => user.isAdmin).length)
const standardUserCount = computed(() => users.value.length - adminCount.value)

function clearMessages() {
  error.value = null
  successMsg.value = null
}

async function fetchUsers() {
  loading.value = true
  clearMessages()

  try {
    const { data } = await api.get('/users')
    users.value = data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load users.'
  } finally {
    loading.value = false
  }
}

async function promoteUser(user) {
  if (user.isAdmin) return

  actionLoading.value = true
  clearMessages()

  try {
    const { data } = await api.patch(`/users/${user._id}/set-as-admin`)
    users.value = users.value.map(existing => existing._id === data._id ? data : existing)
    successMsg.value = `${data.firstName} ${data.lastName} is now an admin.`
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to promote user.'
  } finally {
    actionLoading.value = false
  }
}

async function deleteUser(user) {
  if (user._id === currentUserId.value) return

  const confirmed = confirm(`Delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)
  if (!confirmed) return

  actionLoading.value = true
  clearMessages()

  try {
    await api.delete(`/users/${user._id}/delete-user`)
    users.value = users.value.filter(existing => existing._id !== user._id)
    successMsg.value = `${user.firstName} ${user.lastName} was deleted.`
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to delete user.'
  } finally {
    actionLoading.value = false
  }
}

onMounted(fetchUsers)
</script>

<template>
  <section class="admin-page">
    <div class="container py-5">
      <div class="admin-header mb-4">
        <div>
          <h1 class="admin-title">Manage Users</h1>
          <p class="admin-subtitle">Review and manage user accounts, permissions, and roles.</p>
        </div>
        <button class="btn-primary" type="button" :disabled="loading" @click="fetchUsers">
          <i class="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      <div class="user-summary-grid mb-4">
        <div class="user-summary-card">
          <span>Total Users</span>
          <strong>{{ users.length }}</strong>
        </div>
        <div class="user-summary-card">
          <span>Admins</span>
          <strong>{{ adminCount }}</strong>
        </div>
        <div class="user-summary-card">
          <span>Standard Users</span>
          <strong>{{ standardUserCount }}</strong>
        </div>
      </div>

      <div v-if="successMsg" class="alert-box alert-success mb-4">
        <i class="bi bi-check-circle-fill me-2"></i>{{ successMsg }}
      </div>
      <div v-if="error" class="alert-box alert-danger mb-4">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ error }}
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-sienna" role="status"></div>
      </div>

      <div v-else-if="users.length === 0" class="info-card">
        <p>No users found.</p>
      </div>

      <div v-else class="admin-card-grid user-directory-grid">
        <UserCard
          v-for="user in users"
          :key="user._id"
          :user="user"
          :busy="actionLoading"
          :is-current-user="user._id === currentUserId"
          @promote="promoteUser"
          @delete="deleteUser"
        />
      </div>
    </div>
  </section>
</template>
