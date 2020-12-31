<template>
  <div>
    Profile
    <input type="file" ref="input" @change="load" />
    <img ref="image" />
  </div>
</template>

<script lang="ts">
import { PhotoTaker } from "@/services/photoTakerService";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Profile",
  data() {
    return { imageService: {} as PhotoTaker };
  },
  mounted() {
    const input = this.$refs["input"] as HTMLInputElement;
    const image = this.$refs["image"] as HTMLImageElement;
    this.imageService = new PhotoTaker(input, image);

    this.imageService.onLoad((data) => console.log(data));
  },

  methods: {
    load() {
      this.imageService.load();
    },
  },
});
</script>

<style>
</style>