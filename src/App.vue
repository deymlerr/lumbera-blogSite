<script setup>
  import { onMounted } from "vue";
  import NavBar from "./components/AppNavBar.vue";
  import { useGlobalStore } from "./global.js";
  
  const { getUserDetails } = useGlobalStore();

  onMounted(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserDetails();
    }
  });
</script>

<template>
  <NavBar />
  <router-view />
</template>
