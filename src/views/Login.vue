<template>
  <div class="grid place-content-center min-h-screen gap-4">
    <div class="base-card sm:w-96">
      <span
        class="text-2xl text-center block font-bold font-sans tracking-wider leading-4 pt-2"
      >
        Lattana Games
      </span>
      <div
        class="text-xl text-center font-semibold tracking-wider leading-4 mt-6"
      >
        Sign in with your credentials
      </div>
      <form class="px-2 pt-6 text-center">
        <input
          type="text"
          v-model="form.name"
          class="base-input h-10"
          placeholder="Name (nickname or email)"
          autocomplete="email"
        />
        <input
          type="tel"
          placeholder="Pin (your personal pin)"
          v-model="form.pin"
          class="base-input h-10 mt-2"
          autocomplete="current-password"
        />
        <button
          @click.prevent="doLogin"
          class="base-button primary mt-2 full"
        >
          Sign in
        </button>
        <alert v-show="state.incorrectCredential" class="mt-4 text-left">
          <template #title> Wrong credentials</template>
          <template #description>
            Try again or contact an administrator
          </template>
        </alert>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent, ref } from "vue";
import { auth } from "@/services/auth.service";
import Alert from "@/components/base/Alert.vue";

export default defineComponent({
  components: { Alert },
  setup() {
    const form = ref({ name: "", pin: "" });
    const state = ref({ incorrectCredential: false });
    const router = useRouter();

    async function doLogin() {
      try {
        await auth.login(form.value.name, form.value.pin);

        if (auth.isAuthorized()) {
          state.value.incorrectCredential = false;

          await router.push({ path: "/" });
        } else {
          state.value.incorrectCredential = true;
        }
      } catch {
        state.value.incorrectCredential = true;
      }
    }

    return { form, state, doLogin };
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
  @apply bg-gradient-to-r from-blue-600 to-blue-800 py-2 my-4 text-white font-bold rounded;
}

.loginButton:hover {
  @apply bg-blue-700;
}

.loginButton:focus {
  @apply outline-none;
}
</style>