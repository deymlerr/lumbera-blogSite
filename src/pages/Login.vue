<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import { useGlobalStore } from "../global";
import api from "../api";
import '../assets/main/style.css';

const LOGIN_SUCCESS_DURATION = 2600;
const notyf = new Notyf({
  duration: LOGIN_SUCCESS_DURATION,
  dismissible: true,
  position: {
    x: "right",
    y: "top",
  },
});
const router = useRouter();
const { getUserDetails } = useGlobalStore();
const email = ref("");
const password = ref("");
const isSubmitting = ref(false);
const isEnabled = computed(
  () => email.value.trim() !== "" && password.value.trim() !== "",
);

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

onBeforeUnmount(() => {
  notyf.dismissAll();
});

async function handleSubmit() {
  if (!isEnabled.value || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await api.post("/users/login", {
      email: email.value,
      password: password.value,
    });

    if (response.data.access) {
      notyf.success("Login Successful");
      localStorage.setItem("token", response.data.access);
      await getUserDetails(response.data.access);

      email.value = "";
      password.value = "";

      await wait(LOGIN_SUCCESS_DURATION);
      notyf.dismissAll();
      router.push({ name: "Home" });
    }
  } catch (error) {
    if ([400, 401, 404].includes(error.response?.status)) {
      notyf.error(error.response.data.error || error.response.data.message);
    } else {
      console.error(error);
      notyf.error("Login Failed. Please contact administrator.");
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section class="auth-page">
    <form class="auth-card" @submit.prevent="handleSubmit">
      <h1 class="mb-4 text-center page-title">Login</h1>
      <div class="mb-3">
        <label for="userEmail" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="userEmail"
          placeholder="Enter email"
          v-model="email"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          placeholder="Password"
          v-model="password"
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary w-100"
        :disabled="!isEnabled || isSubmitting"
      >
        {{ isSubmitting ? "Logging in..." : "Login" }}
      </button>
    </form>
  </section>
</template>
