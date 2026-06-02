<script setup>
	import { onBeforeMount } from 'vue';
	import { useGlobalStore } from '../global';
	import { useRouter } from 'vue-router';

    const router = useRouter();

	const { getUserDetails }  = useGlobalStore();

	onBeforeMount(() => {
		localStorage.clear();
		getUserDetails(null);
		router.push({ name: "Login" });
	})
</script>

<template>
</template>