<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api.js'
import { useGlobalStore } from '../../global.js'

const router = useRouter()
const globalStore = useGlobalStore()

const form = ref({
  title: '',
  content: '',
  status: 'draft',
})
const loading = ref(false)
const error = ref(null)
const successMsg = ref(null)

const authorId = computed(() => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  return globalStore.user._id || globalStore.user.id || storedUser._id || storedUser.id || null
})

function clearMessages() {
  error.value = null
  successMsg.value = null
}

async function submitBlog() {
  clearMessages()
  loading.value = true

  try {
    const payload = {
      title: form.value.title,
      content: form.value.content,
      status: form.value.status,
      author: authorId.value,
    }
    const { data } = await api.post('/blogs/create', payload)
    successMsg.value = data.message || 'Blog created successfully.'
    router.push({ name: 'Blogs' })
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create blog post.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="container py-5">
    <div class="mb-4">
      <h1 class="mb-3">Create Blog</h1>
      <p class="text-muted">Write and publish a new blog post.</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <form @submit.prevent="submitBlog">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input v-model="form.title" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Content</label>
        <textarea v-model="form.content" rows="10" class="form-control" required></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Status</label>
        <select v-model="form.status" class="form-select">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Saving...' : 'Create Blog' }}
      </button>
      <router-link class="btn btn-outline-secondary ms-2" :to="{ name: 'Blogs' }">Cancel</router-link>
    </form>
  </section>
</template>