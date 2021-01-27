<template>
  <div
    class="border list-none rounded-md px-3 py-3 my-1 flex justify-evenly items-center"
    :class="color"
  >
    <span
      class="ml-2 text-gray-700 font-semibold font-sans tracking-wide text-left"
    >
      {{ user.name }} {{ user.surname }}
    </span>
    <img
      class="w-10 h-10 rounded-full text-right"
      :src="image(user.profileImage).width(100)"
    />
  </div>
</template>

<script lang="ts">
import { player } from "@/types/sanity";
import { urlFor } from "@/instances/sanity";
import { defineComponent, PropType } from "vue";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const image = (img: SanityImageSource) => urlFor(img).width(100);

export default defineComponent({
  name: "draggable-user",
  props: {
    user: {
      type: Object as PropType<player>,
      required: true,
    },
    color: {
      type: String,
      default: () => "bg-gray-50",
    },
  },
  methods: {
    image,
  },
});
</script>

<style>
</style>