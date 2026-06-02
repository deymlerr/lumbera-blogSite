<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api.js'
import { useGlobalStore } from '../../global.js'

const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore()

const form = ref({
  title: '',
  content: '',
  status: 'draft',
  author: null,
})
const loading = ref(true)
const saving = ref(false)
const error = ref(null)
const successMsg = ref(null)

const authorId = computed(() => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  return form.value.author?._id || form.value.author?.id || form.value.author || globalStore.user._id || globalStore.user.id || storedUser._id || storedUser.id || null
})

function clearMessages() {
  error.value = null
  successMsg.value = null
}

async function loadBlog() {
  loading.value = true
  clearMessages()

  try {
    const { data } = await api.get(`/blogs/${route.params.id}`)
    form.value.title = data.title || ''
    form.value.content = data.content || ''
    form.value.status = data.status || 'draft'
    form.value.author = data.author || null
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load blog post.'
  } finally {
    loading.value = false
  }
}

async function updateBlog() {
  clearMessages()
  saving.value = true

  try {
    await api.patch(`/blogs/${route.params.id}/update`, {
      title: form.value.title,
      content: form.value.content,
      status: form.value.status,
      author: authorId.value,
    })
    successMsg.value = 'Blog updated successfully.'
    router.push({ name: 'ViewBlog', params: { id: route.params.id } })
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update blog post.'
  } finally {
    saving.value = false
  }
}

onMounted(loadBlog)
</script>

<template>
  <section class="container py-5">
    <div class="mb-4">
      <h1 class="mb-3">Edit Blog</h1>
      <p class="text-muted">Modify the blog post content and status.</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <form v-else @submit.prevent="updateBlog">
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

      <button type="submit" class="btn btn-primary" :disabled="saving">
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
      <router-link class="btn btn-outline-secondary ms-2" :to="{ name: 'ViewBlog', params: { id: route.params.id } }">Cancel</router-link>
    </form>
  </section>
</template>