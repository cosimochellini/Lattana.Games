<template>
  <div class="grid place-items-center mt-16 pt-16">
    <div class="w-full md:w-1/2 lg:w-1/3 pt-4 block">
      <span class="text-xl font-extrabold leading-4 m-auto pt-2 px-16">
        Sign in with your credentials
      </span>
      <form class="px-8 pt-6 pb-8">
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
        <button @click.prevent="login" class="loginButton w-full">
          Sign in
        </button>
        <alert v-show="state.incorrectCredential" class="mt-4 text-left">
          <template #title> Wrong credentials</template>
          <template #description>
            Try again or contact an administrator</template
          >
        </alert>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { isAuthorized, login } from "@/services/authService";
import Alert from "@/components/base/Alert.vue";

export default defineComponent({
  components: {
    Alert,
  },
  data() {
    return {
      form: {
        name: "",
        pin: "",
      },
      state: {
        incorrectCredential: false,
      },
    };
  },
  methods: {
    async login() {
      try {
        await login(this.form.name, this.form.pin);

        if (isAuthorized()) {
          this.state.incorrectCredential = false;

          let redirect = this.$route.query.redirect?.toString() ?? "/";

          if (redirect === "/log-out") redirect = "/";

          await this.$router.push({ path: redirect });
        } else {
          this.state.incorrectCredential = true;
        }
      } catch {
        this.state.incorrectCredential = true;
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
  @apply outline-none;
}

.loginButton {
  @apply bg-gradient-to-r from-purple-600 to-purple-800 py-2 my-4 text-white font-bold rounded;
}

.loginButton:hover {
  @apply bg-blue-700;
}

.loginButton:focus {
  @apply outline-none;
}
</style>