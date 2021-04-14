<template>
  <div
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-800 opacity-80 flex flex-col items-center justify-center p-4 text-white"
  >
    <div class="ease-linear text-center h-12 w-12 mb-4">
      <i class="fa-3x fa-spin fad fa-spinner-third" />
    </div>

    <h2
      class="text-center text-xl font-semibold tracking-wider first-capitalize"
      v-t="'system.wait'"
    />
    <p
      class="w-full text-center tracking-wide font-medium first-capitalize"
      v-t="'system.fewSeconds'"
    />
  </div>
</template>

<script>
export default {};
</script>
