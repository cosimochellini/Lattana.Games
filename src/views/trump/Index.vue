<template>
  <router-view />
  <bottom-bar :game="'trump'" />
</template>

<script lang="ts">
import BottomBar from "@/components/base/BottomBar.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { BottomBar },
});
</script>

<style>
</style>