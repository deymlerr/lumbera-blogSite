<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '../../api.js'
import { RouterLink } from 'vue-router'

const authors = ref([])
const filter = ref('')
const loading = ref(false)
const error = ref(null)

function clearMessages() {
  error.value = null
}

const filteredAuthors = computed(() => {
  const query = filter.value.trim().toLowerCase()
  if (!query) return authors.value
  return authors.value.filter(author => {
    const fullName = `${author.firstName || ''} ${author.lastName || ''}`.toLowerCase()
    return fullName.includes(query) || (author.email || '').toLowerCase().includes(query)
  })
})

async function loadAuthors() {
  loading.value = true
  clearMessages()

  try {
    const { data } = await api.get('/blogs/authors')
    authors.value = data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load authors.'
  } finally {
    loading.value = false
  }
}

onMounted(loadAuthors)
</script>

<template>
  <section class="container py-5">
    <div class="mb-4">
      <h1 class="mb-3">Authors</h1>
      <p class="text-muted">Search authors by name or email and view their published blog posts.</p>
    </div>

    <div class="mb-4 row g-3 align-items-center">
      <div class="col-auto flex-grow-1">
        <input v-model="filter" type="search" class="form-control" placeholder="Search authors..." />
      </div>
      <div class="col-auto">
        <button class="btn btn-secondary" type="button" :disabled="loading" @click="loadAuthors">Refresh</button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="filteredAuthors.length === 0" class="alert alert-secondary">
      No authors found.
    </div>

    <div v-else class="row g-4">
      <div v-for="author in filteredAuthors" :key="author._id" class="col-12 col-md-6">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <div>
              <h5 class="card-title mb-1">{{ author.firstName }} {{ author.lastName }}</h5>
              <p class="text-muted mb-2">{{ author.email }}</p>
              <p class="mb-3">Published blogs: <strong>{{ author.totalBlogs }}</strong></p>
            </div>
            <div class="mt-auto">
              <RouterLink class="btn btn-primary" :to="{ name: 'AuthorDetails', params: { id: author._id } }">View Author</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>