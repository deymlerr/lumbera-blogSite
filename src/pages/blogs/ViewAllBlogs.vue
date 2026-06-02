<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '../../global'
import api from '../../api.js'
import BlogCard from '../../components/BlogCard.vue'

const store = useGlobalStore()
const { user } = storeToRefs(store)

const blogs = ref([])
const loading = ref(false)
const error = ref(null)

const canDelete = (blog) => {
  const authorId = blog.author?._id || blog.author
  return user.value?.isAdmin || (user.value?.id && authorId && authorId.toString() === user.value.id.toString())
}

function clearMessages() {
  error.value = null
}

async function loadBlogs() {
  loading.value = true
  clearMessages()

  try {
    const { data } = await api.get('/blogs/all')
    blogs.value = data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load blogs.'
  } finally {
    loading.value = false
  }
}

onMounted(loadBlogs)
</script>

<template>
  <section class="container py-5">
    <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
      <div>
        <h1 class="mb-2">All Blogs</h1>
        <p class="text-muted">Browse all available blog posts.</p>
      </div>
      <router-link class="btn btn-primary" :to="{ name: 'CreateBlog' }">New Blog</router-link>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="blogs.length === 0" class="alert alert-secondary">No blog posts found.</div>

    <div v-else class="row g-4">
      <div v-for="blog in blogs" :key="blog._id" class="col-12 col-md-6">
        <div class="d-flex flex-column h-100">
          <BlogCard :blog="blog" />
          <div class="d-flex flex-wrap gap-2 mt-2">
            <router-link class="btn btn-sm btn-outline-primary" :to="{ name: 'ViewBlog', params: { id: blog._id } }">View</router-link>
            <router-link class="btn btn-sm btn-outline-warning" :to="{ name: 'UpdateBlog', params: { id: blog._id } }">Edit</router-link>
            <router-link
              v-if="canDelete(blog)"
              class="btn btn-sm btn-outline-danger"
              :to="{ name: 'DeleteBlog', params: { id: blog._id } }"
            >Delete</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>