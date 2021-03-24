<template>
  <div
    class="border list-none rounded-lg p-3 my-2 justify-around items-center grid grid-cols-5"
    :class="color"
  >
    <span
      class="text-gray-700 font-semibold font-sans tracking-wide text-center"
      :class="showDelete ? 'col-span-3' : 'col-span-4'"
    >
      {{ user.name }} {{ user.surname }}
    </span>
    <img
      class="w-10 h-10 rounded-full text-center col-span-1"
      :class="avatarColor ? ' ring ' + avatarColor : ''"
      :src="image(user.profileImage, 500)"
    />
    <button
      class="base-button transparent w-12 col-span-1 text-center"
      v-show="showDelete"
      @click.capture="emitDelete"
    >
      <i class="fas fa-trash-alt mr-1" @click.capture="emitDelete"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { player } from "@/types/sanity";
import { image } from "@/instances/sanity";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "draggable-user",
  emits: ["deletePlayer"],
  props: {
    user: {
      type: Object as PropType<player>,
      required: true,
    },
    color: {
      type: String,
      default: () => "bg-gray-50",
    },
    showDelete: {
      type: Boolean,
      default: () => false,
    },
    avatarColor: {
      type: String,
      default: () => "",
    },
  },
  methods: {
    image,
    emitDelete() {
      this.$emit("deletePlayer", this.user);
    },
  },
});
</script>

<style>
</style>