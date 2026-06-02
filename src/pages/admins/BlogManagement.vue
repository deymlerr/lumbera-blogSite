<script setup>
import '../../assets/main/style.css'
import { computed, onMounted, ref } from 'vue'
import api from '../../api.js'

const blogs = ref([])
const loading = ref(false)
const actionLoading = ref(false)
const error = ref(null)
const successMsg = ref(null)

function clearMessages() {
  error.value = null
  successMsg.value = null
}

async function fetchBlogs() {
  loading.value = true
  clearMessages()

  try {
    const { data } = await api.get('/blogs/all')
    blogs.value = data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load blog posts.'
  } finally {
    loading.value = false
  }
}

async function deleteBlog(blog) {
  const confirmed = confirm(`Delete blog "${blog.title}"? This action cannot be undone.`)
  if (!confirmed) return

  actionLoading.value = true
  clearMessages()

  try {
    await api.delete(`/blogs/${blog._id}/delete`)
    blogs.value = blogs.value.filter(existing => existing._id !== blog._id)
    successMsg.value = `Blog titled "${blog.title}" was deleted.`
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to delete blog post.'
  } finally {
    actionLoading.value = false
  }
}

const publishedCount = computed(() => blogs.value.filter(blog => blog.status === 'published').length)
const draftCount = computed(() => blogs.value.filter(blog => blog.status === 'draft').length)

function authorName(blog) {
  if (!blog.author) return 'Anonymous'
  if (typeof blog.author === 'string') return blog.author
  if (blog.author.firstName || blog.author.lastName) {
    return `${blog.author.firstName || ''} ${blog.author.lastName || ''}`.trim() || 'Anonymous'
  }
  return blog.author.name || 'Anonymous'
}

onMounted(fetchBlogs)
</script>

<template>
  <section class="admin-page">
    <div class="container py-5">
      <div class="admin-header mb-4 d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1 class="admin-title">Manage Blogs</h1>
          <p class="admin-subtitle">Create, edit, and delete blog posts from the admin dashboard.</p>
        </div>
        <div class="d-flex gap-2 flex-wrap">
          <router-link class="btn btn-secondary" to="/blogs/create">
            <i class="bi bi-plus-circle me-2"></i>
            New Blog
          </router-link>
          <button class="btn btn-primary" type="button" :disabled="loading" @click="fetchBlogs">
            <i class="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      <div class="user-summary-grid mb-4">
        <div class="user-summary-card">
          <span>Total Blogs</span>
          <strong>{{ blogs.length }}</strong>
        </div>
        <div class="user-summary-card">
          <span>Published</span>
          <strong>{{ publishedCount }}</strong>
        </div>
        <div class="user-summary-card">
          <span>Drafts</span>
          <strong>{{ draftCount }}</strong>
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

      <div v-else-if="blogs.length === 0" class="info-card">
        <p>No blog posts found.</p>
      </div>

      <div v-else class="admin-card-grid blog-management-grid">
        <div v-for="blog in blogs" :key="blog._id" class="card mb-4">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <h5 class="card-title mb-1">{{ blog.title }}</h5>
                <p class="text-muted mb-0">By: {{ authorName(blog) }}</p>
              </div>
              <span :class="['badge', blog.status === 'published' ? 'bg-success' : 'bg-secondary']">{{ blog.status }}</span>
            </div>
            <p class="card-text">{{ blog.content.substring(0, 180) }}...</p>
            <div class="d-flex flex-wrap gap-2 mt-3">
              <router-link :to="{ name: 'ViewBlog', params: { id: blog._id } }" class="btn btn-outline-primary btn-sm">View</router-link>
              <router-link :to="{ name: 'UpdateBlog', params: { id: blog._id } }" class="btn btn-outline-warning btn-sm">Edit</router-link>
              <button class="btn btn-outline-danger btn-sm" :disabled="actionLoading" @click="deleteBlog(blog)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
