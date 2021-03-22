<template>
  <div
    class="border list-none rounded-md px-3 py-3 my-1 flex justify-around items-center"
    :class="color"
  >
    <span
      class="ml-2 text-gray-700 font-semibold font-sans tracking-wide text-left flex-1"
    >
      {{ user.name }} {{ user.surname }}
    </span>
    <img
      class="w-10 h-10 rounded-full text-right mr-2"
      :class="avatarColor ? ' ring ' + avatarColor : ''"
      :src="image(user.profileImage, 250)"
    />
    <button
      class="base-button transparent w-12"
      v-show="showDelete"
      @click.prevent="emitDelete"
    >
      <i class="fas fa-trash-alt mr-1"></i>
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