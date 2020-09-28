<template>
  <div class="w-full max-w-xl h-full m-auto">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <label class="label">Name</label>
      <input
        type="text"
        v-model="form.name"
        class="inputForm"
        autocomplete="email"
      />
      <label class="label">Pin</label>
      <input
        type="tel"
        v-model="form.pin"
        class="inputForm"
        autocomplete="current-password"
      />
      <button @click.prevent="login" class="loginButton">login</button>
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
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight mb-2;
}

.inputForm:focus {
  @apply shadow-outline outline-none;
}

.loginButton {
  @apply bg-gradient-to-l from-teal-400 to-blue-500 m-2 text-white font-bold py-2 px-4 rounded;
}

.loginButton:hover {
  @apply bg-blue-700;
}

.loginButton:focus {
  @apply shadow-outline outline-none;
}

</style>