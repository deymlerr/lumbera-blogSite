<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../api.js'
import BlogCard from '../../components/BlogCard.vue'

const route = useRoute()
const author = ref(null)
const blogs = ref([])
const loading = ref(true)
const error = ref(null)

function clearMessages() {
  error.value = null
}

async function loadAuthor() {
  loading.value = true
  clearMessages()

  try {
    const { data } = await api.get(`/blogs/authors/${route.params.id}`)
    author.value = data.author
    blogs.value = data.blogs
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load author.'
  } finally {
    loading.value = false
  }
}

onMounted(loadAuthor)
</script>

<template>
  <section class="container py-5">
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="author" class="">
      <div class="mb-4">
        <h1 class="mb-2">{{ author.firstName }} {{ author.lastName }}</h1>
        <p class="text-muted">{{ author.email }}</p>
        <p class="mb-0">Published blogs: <strong>{{ author.totalBlogs }}</strong></p>
      </div>

      <div v-if="blogs.length === 0" class="alert alert-secondary">
        This author does not have any published blog posts yet.
      </div>

      <div v-else class="row g-4">
        <div v-for="blog in blogs" :key="blog._id" class="col-12 col-md-6">
          <BlogCard :blog="blog" />
        </div>
      </div>
    </div>
  </section>
</template>