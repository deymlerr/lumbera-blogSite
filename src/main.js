import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import { createApp } from 'vue'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from './App.vue'
import api from "./api";
import { useGlobalStore } from "./global";
import { notyf } from "./notyf";

// PUBLIC PAGES
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";
import Logout from "./pages/Logout.vue";

// USER PAGES
import Home from "./pages/users/Home.vue";
import UpdateProfile from "./pages/users/UpdateProfile.vue";
import UpdatePassword from "./pages/users/UpdatePassword.vue";
import ViewProfile from "./pages/users/ViewProfile.vue";

// ADMIN PAGES
import AdminDashboard from "./pages/admins/AdminDashboard.vue";
import UserManagement from "./pages/admins/UserManagement.vue";
import BlogManagement from "./pages/admins/BlogManagement.vue";

// AUTHOR PAGES
import Authors from "./pages/authors/ViewAllAuthors.vue";
import AuthorDetails from "./pages/authors/ViewAuthor.vue";

// BLOG PAGES
import Blogs from "./pages/blogs/ViewAllBlogs.vue";
import CreateBlog from "./pages/blogs/AddBlog.vue";
import UpdateBlog from "./pages/blogs/UpdateBlog.vue";
import ViewBlog from "./pages/blogs/ViewBlog.vue";
import DeleteBlog from "./pages/blogs/DeleteBlog.vue";



const pinia = createPinia();

// ROUTER
const router = createRouter({
    history: createWebHistory(),
    routes: [
        // PUBLIC ROUTES
        {
            path: "/",
            name: "Home",
            component: Home,
        },
        {
            path: "/login",
            name: "Login",
            component: Login,
        },
        {
            path: "/register",
            name: "Register",
            component: Register,
        },
        {
            path: "/logout",
            name: "Logout",
            component: Logout,
        },
        
        // USER ROUTES
        {
            path: "/users/:id",
            name: "ViewProfile",
            component: ViewProfile,
        },
        {
            path: "/users/:id/update-profile",
            name: "UpdateProfile",
            component: UpdateProfile,
        },
        {
            path: "/users/:id/update-password",
            name: "UpdatePassword",
            component: UpdatePassword,
        },
        
        // ADMIN ROUTES
        {
            path: "/admin-dashoard",
            name: "AdminDashboard",
            component: AdminDashboard,
        },
        {
            path: "/users/",
            name: "UserManagement",
            component: UserManagement,
        },
        {
            path: "/admin/blogs",
            name: "BlogManagement",
            component: BlogManagement,
        },

        // AUTHOR ROUTES
        {
            path: "/authors",
            name: "Authors",
            component: Authors,
        },
        {
            path: "/authors/:id",
            name: "AuthorDetails",
            component: AuthorDetails,
        },

        // BLOG ROUTES
        {
            path: "/blogs/all",
            name: "Blogs",
            component: Blogs,
        },
        {
            path: "/blogs/create",
            name: "CreateBlog",
            component: CreateBlog,
        },
        {
            path: "/blogs/:id",
            name: "ViewBlog",
            component: ViewBlog,
        },
        {
            path: "/blogs/:id/update",
            name: "UpdateBlog",
            component: UpdateBlog,
        },
        {
            path: "/blogs/:id/delete",
            name: "DeleteBlog",
            component: DeleteBlog,
        }
    ]
})

router.beforeEach((to, from, next) => {
    notyf.dismissAll();
    next();
});

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
