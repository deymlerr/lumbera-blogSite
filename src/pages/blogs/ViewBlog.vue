<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useGlobalStore } from '../../global'
import api from '../../api.js'
import BlogCard from '../../components/BlogCard.vue'

const store = useGlobalStore()
const { user } = storeToRefs(store)
const route = useRoute()
const blog = ref(null)
const loading = ref(true)
const error = ref(null)

const canDeleteBlog = computed(() => {
  if (!blog.value) return false
  const authorId = blog.value.author?._id || blog.value.author
  return user.value?.isAdmin || (user.value?.id && authorId && authorId.toString() === user.value.id.toString())
})

async function loadBlog() {
  loading.value = true
  error.value = null

  try {
    const { data } = await api.get(`/blogs/${route.params.id}`)
    blog.value = data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load the blog post.'
  } finally {
    loading.value = false
  }
}

onMounted(loadBlog)
</script>

<template>
  <section class="container py-5">
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="blog">
      <BlogCard :blog="blog" :showReadMore="false" />
      <div class="card mt-4">
        <div class="card-body">
          <p class="text-muted mb-2">Status: <strong>{{ blog.status }}</strong></p>
          <p class="card-text mb-4">{{ blog.content }}</p>
          <div class="d-flex flex-wrap gap-2">
            <router-link class="btn btn-outline-warning" :to="{ name: 'UpdateBlog', params: { id: blog._id } }">Edit</router-link>
            <router-link
              v-if="canDeleteBlog"
              class="btn btn-outline-danger"
              :to="{ name: 'DeleteBlog', params: { id: blog._id } }"
            >Delete</router-link>
            <router-link class="btn btn-secondary" :to="{ name: 'Blogs' }">Back to all blogs</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>