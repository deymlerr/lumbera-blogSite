<script setup>
    import '../../assets/main/style.css'
    import { useGlobalStore } from "../../global";

    const { user } = useGlobalStore();
</script>

<template>
  <section class="home-hero">
    <div class="container home-hero__content">
      <p class="home-hero__eyebrow">Blog Site</p>
      <h1>ZuittBlog</h1>
      <p class="lead">Tell me about your experiences!</p>
      <div class="d-flex flex-wrap gap-2 mt-4">
        <RouterLink class="btn btn-primary btn-lg" :to="{ name: 'Blogs' }">Browse Blogs</RouterLink>
        <RouterLink
          v-if="!user.email"
          class="btn btn-secondary btn-lg"
          :to="{ name: 'Login' }"
        >
          Sign In
        </RouterLink>
        <RouterLink
          v-if="user.email"
          class="btn btn-secondary btn-lg"
          :to="{ name: 'Logout' }"
        >
          Logout
        </RouterLink>
      </div>
    </div>
  </section>
</template>
