<script setup>
    import { computed } from "vue";
    import { RouterLink } from "vue-router";
    import "../assets/cards/user.css";

    const props = defineProps({
        user: {
            type: Object,
            required: true
        }
    });

    const userId = computed(() => props.user.id || props.user._id || props.user.userId);
</script>

<template>

    <div class="card user-card h-100">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ props.user.firstName }} {{ props.user.lastName }}</h5>
            <p class="card-text">{{ props.user.email }}</p>
            <p class="card-text">Published Blogs: {{ props.user.publishedBlogs?.length || 0 }}</p>
        </div>
    </div>

</template>