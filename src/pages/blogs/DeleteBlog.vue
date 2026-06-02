<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api.js'

const route = useRoute()
const router = useRouter()

const blog = ref(null)
const loading = ref(true)
const deleting = ref(false)
const error = ref(null)
const successMsg = ref(null)

async function loadBlog() {
  loading.value = true
  error.value = null

  try {
    const { data } = await api.get(`/blogs/${route.params.id}`)
    blog.value = data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load blog post.'
  } finally {
    loading.value = false
  }
}

async function deleteBlog() {
  deleting.value = true
  error.value = null

  try {
    const { data } = await api.delete(`/blogs/${route.params.id}/delete`)
    successMsg.value = data.message || 'Blog deleted successfully.'
    router.push({ name: 'Blogs' })
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to delete blog post.'
  } finally {
    deleting.value = false
  }
}

function cancelDelete() {
  router.push({ name: 'ViewBlog', params: { id: route.params.id } })
}

onMounted(loadBlog)
</script>

<template>
  <section class="container py-5">
    <div class="mb-4">
      <h1 class="mb-3">Delete Blog</h1>
      <p class="text-muted">Confirm that you want to permanently remove this blog post.</p>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="blog" class="card">
      <div class="card-body">
        <h5 class="card-title">{{ blog.title }}</h5>
        <p class="text-muted">By: {{ blog.author?.name || blog.author || 'Anonymous' }}</p>
        <p class="card-text">{{ blog.content }}</p>
        <div class="mt-4 d-flex gap-2">
          <button class="btn btn-danger" :disabled="deleting" @click="deleteBlog">
            {{ deleting ? 'Deleting...' : 'Delete Blog' }}
          </button>
          <button class="btn btn-outline-secondary" @click="cancelDelete">Cancel</button>
        </div>
      </div>
    </div>
  </section>
</template>