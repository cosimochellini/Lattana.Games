<template>
  <div
    class="border list-none rounded-md px-3 py-3 my-1 flex justify-around items-center"
    :class="color"
  >
    <span
      class="ml-2 text-gray-700 font-semibold font-sans tracking-wide text-left"
    >
      {{ user.name }} {{ user.surname }}
    </span>
    <img
      class="w-10 h-10 rounded-full text-right"
      :src="image(user.profileImage, 100)"
    />
    <button
      class="bg-transparent border border-red-800 rounded-md p-1 px-2"
      v-show="showDelete"
      @click.prevent="emitDelete"
    >
      <i class="fas fa-trash-alt"></i>
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