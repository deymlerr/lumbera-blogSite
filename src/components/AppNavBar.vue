<script setup>
    import { storeToRefs } from 'pinia';
    import { useGlobalStore } from '../global';
    import "../assets/NavBar/navbar.css";

    const store = useGlobalStore();
    const { user } = storeToRefs(store);
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
            <RouterLink class="navbar-brand" :to="{ name: 'Home' }">ZuittBlog</RouterLink>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <RouterLink class="nav-link" :to="{ name: 'Home' }">Home</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" :to="{ name: 'Blogs' }">Blogs</RouterLink>
                    </li>
                    <li v-if="!user.email" class="nav-item">
                        <RouterLink class="nav-link" :to="{ name: 'Login' }">Login</RouterLink>
                    </li>
                    <li v-if="!user.email" class="nav-item">
                        <RouterLink class="nav-link" :to="{ name: 'Register' }">Register</RouterLink>
                    </li>
                    <li v-if="user.email && user.id" class="nav-item">
                        <RouterLink class="nav-link" :to="{ name: 'ViewProfile', params: { id: user.id } }">Profile</RouterLink>
                    </li>
                    <li v-if="user.isAdmin" class="nav-item">
                        <RouterLink class="nav-link" :to="{ name: 'AdminDashboard' }">Admin Dashboard</RouterLink>
                    </li>
                    <li v-if="user.email" class="nav-item">
                        <RouterLink class="nav-link" :to="{ name: 'Logout' }">Logout</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>