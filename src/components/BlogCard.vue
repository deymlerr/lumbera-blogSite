<script setup>
    import { computed } from "vue";
    import { RouterLink } from "vue-router";
    import "../assets/cards/blog.css";

    const props = defineProps({
        blog: {
            type: Object,
            required: true
        },
        showReadMore: {
            type: Boolean,
            default: true
        }
    });

    const blogId = computed(() => props.blog.id || props.blog._id || props.blog.blogId);

    const authorName = computed(() => {
        const author = props.blog.author
        if (!author) return "Anonymous"
        if (typeof author === "string") return author
        if (author.firstName || author.lastName) {
            return `${author.firstName || ''} ${author.lastName || ''}`.trim() || "Anonymous"
        }
        return author.name || "Anonymous"
    })
</script>

<template>

    <div class="card blog-card h-100">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ props.blog.title }}</h5>
            <p class="card-text">{{ props.blog.content.substring(0, 100) }}...</p>
            <p class="card-text mt-auto">By: {{ authorName }}</p>
            <RouterLink v-if="props.showReadMore" class="btn btn-primary mt-2" :to="{ name: 'ViewBlog', params: { id: blogId } }">Read More</RouterLink>
        </div>
    </div>

</template>