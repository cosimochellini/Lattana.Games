<template>
  <div>
    <form>
      <label>Name</label>
      <input type="text" v-model="form.name" />
      <label>Pin</label>
      <input type="text" v-model="form.pin" />
      <button @click.prevent="login">login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { isAuthorized, login } from "@/services/authService";
import { roleConstants } from "@/constants/roleConstants";
export default defineComponent({
  data() {
    return {
      form: {
        name: "",
        pin: "",
      },
    };
  },
  methods: {
    async login() {
      try {
        await login(this.form.name, this.form.pin);

        if (isAuthorized([roleConstants.User])) {
          console.log("yeye");
        } else {
          console.error("invalid credentials");
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>

<style>
</style>