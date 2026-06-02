<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import api from "../api";
import '../assets/main/style.css';

const router = useRouter();
const notyf = new Notyf();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPass = ref("");
const isSubmitting = ref(false);

const isEnabled = computed(() => {
  const requiredFields = [
    firstName.value,
    lastName.value,
    email.value,
    password.value,
    confirmPass.value,
  ];

  return (
    requiredFields.every((input) => input.trim() !== "") &&
    password.value.length >= 8 &&
    password.value === confirmPass.value
  );
});

async function handleSubmit() {
  if (!isEnabled.value || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await api.post("/users/register", {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });

    if (response.status === 201) {
      notyf.success(response.data.message || "Registration successful.");

      firstName.value = "";
      lastName.value = "";
      email.value = "";
      password.value = "";
      confirmPass.value = "";

      router.push({ name: "Login" });
    } else {
      notyf.error("Registration Failed. Please contact administrator.");
    }
  } catch (error) {
    console.error(error);
    notyf.error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Registration Failed. Please contact administrator.",
    );
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section class="auth-page">
  <form class="auth-card" @submit.prevent="handleSubmit">
    <h1 class="mb-4 text-center page-title">Register</h1>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="registerFirstName" class="form-label">First Name</label>
        <input
          type="text"
          id="registerFirstName"
          class="form-control"
          placeholder="Enter First Name"
          v-model="firstName"
        />
      </div>

      <div class="col-md-6 mb-3">
        <label for="registerLastName" class="form-label">Last Name</label>
        <input
          type="text"
          id="registerLastName"
          class="form-control"
          placeholder="Enter Last Name"
          v-model="lastName"
        />
      </div>
    </div>

    <div class="mb-3">
      <label for="registerEmail" class="form-label">Email</label>
      <input
        type="email"
        id="registerEmail"
        class="form-control"
        placeholder="Enter Email"
        v-model="email"
      />
    </div>


    <div class="mb-3">
      <label for="registerPassword" class="form-label">Password</label>
      <input
        type="password"
        id="registerPassword"
        class="form-control"
        placeholder="Enter Password"
        v-model="password"
      />
    </div>

    <div class="mb-3">
      <label for="registerConfirmPassword" class="form-label">Confirm Password</label>
      <input
        type="password"
        id="registerConfirmPassword"
        class="form-control"
        placeholder="Confirm Password"
        v-model="confirmPass"
      />
    </div>

    <button type="submit" class="btn btn-primary w-100" :disabled="!isEnabled || isSubmitting">
      {{ isSubmitting ? "Registering..." : "Register" }}
    </button>
  </form>
  </section>
</template>
