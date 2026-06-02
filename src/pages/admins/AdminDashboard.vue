<script setup>
    import '../../assets/main/style.css'
</script>

<template>
    <section class="admin-dashboard-page">
        <div class="container">
            <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <p class="text-lg text-gray-700">Welcome to the admin dashboard! Here you can manage blogs, authors, and users.</p>
            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="admin-card bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4">Manage Blogs</h2>
                    <p class="text-gray-600 mb-4">Create, edit, and delete blog posts to keep your content fresh and engaging.</p>
                    <router-link to="/admin/blogs" class="btn btn-primary">Blog Management</router-link>
                </div>
                <div class="admin-card bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4">Manage Users</h2>
                    <p class="text-gray-600 mb-4">Create, edit, and delete user accounts to manage your application's users.</p>
                    <router-link to="/users/" class="btn btn-primary">User Management</router-link>
                </div>
            </div>
        </div>
    </section>
</template>