<template>
  <div class="w-full max-w-xl h-full m-auto pt-4">
    <span class="text-2xl font-extrabold leading-6"
      >Sign in with your credentials</span
    >
    <form class="rounded px-8 pt-6 pb-8 mb-4">
      <input
        type="text"
        v-model="form.name"
        class="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
        placeholder="Name (nikname or email)"
        autocomplete="email"
      />
      <input
        type="tel"
        placeholder="Pin (your personal pin)"
        v-model="form.pin"
        class="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
        autocomplete="current-password"
      />
      <button @click.prevent="login" class="loginButton w-full">Sign in</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { roleConstants } from "@/constants/roleConstants";
import { isAuthorized, login } from "@/services/authService";

export default defineComponent({
  data() {
    return {
      form: {
        name: "",
        pin: "",
      },
    };
  },
  methods: {
    async login() {
      try {
        await login(this.form.name, this.form.pin);

        if (isAuthorized([roleConstants.User])) {
          console.log("yeye");
        } else {
          console.error("invalid credentials");
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>

<style scoped>
.label {
  @apply block text-gray-700 text-sm font-bold mb-2 text-left;
}

.inputForm {
  @apply w-full py-2 px-3 appearance-none border-gray-300 text-gray-900 leading-tight;
}

.inputForm:focus {
  @apply shadow-outline outline-none;
}

.loginButton {
  @apply bg-gradient-to-r from-purple-600 to-purple-800 py-2 my-4 text-white font-bold rounded;
}

.loginButton:hover {
  @apply bg-blue-700;
}

.loginButton:focus {
  @apply shadow-outline outline-none;
}
</style>