<template>
  <div
    v-show="opened"
    class="w-11/12 md:w-3/5 my-2 rounded-r-md px-6 border-l-4 -ml-4 fixed bottom-0 z-50"
    :class="notificationScope.class"
  >
    <div class="flex items-center py-4">
      <i
        class="fas fa-exclamation-circle rounded-full fill-current text-4xl text-gray-800"
      ></i>
      <div class="ml-5">
        <h1 class="font-bold text-gray-800 text-lg">
          {{ notification.title }}
        </h1>
        <p class="text-gray-800 my-0">
          {{ notification.message }}
        </p>
      </div>
      <div>
        <button type="button" class="text-yellow-100" @click.prevent="toggle">
          <span class="text-2xl text-gray-800">&times;</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { Notification, notificationType } from "@/services/notificationService";

export default defineComponent({
  setup() {
    const notification = ref(new Notification(""));
    const opened = ref(false);
    const toggle = () => (opened.value = !opened.value);
    const close = () => (opened.value = false);

    const call = (n: Notification) => {
      opened.value = true;
      notification.value = n;
      setTimeout(close, 3000);
    };

    const notificationScope = computed(() => {
      switch (notification.value.type) {
        case notificationType.danger:
          return {
            title: "success",
            class: " border-gray-100 bg-yellow-400 ",
          };
        case notificationType.info:
          return {
            title: "",
            class: " border-gray-100 bg-blue-400 ",
          };
        default:
          return {
            title: "",
            class: " border-gray-100 bg-blue-400 ",
          };
      }
    });

    return { notification, toggle, close, call, notificationScope, opened };
  },
});
</script>

<style>
</style>