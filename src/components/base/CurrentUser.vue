<template>
  <div v-if="guard.role.nosy">
    <h2 class="font-semibold leading-3 block tracking-wider first-capitalize mb-1">
      {{ $t("trump.form.currentPlayer") }}

      <i :class="iconRoles[role.nosy]"></i>
    </h2>
    <user-autocomplete
      v-model="actualPlayer"
      :allowEmpty="allowEmpty"
      :exactPlayers="availablePlayers"
      class="block px-2 w-full md:w-auto"
    />
  </div>
</template>

<script lang="ts">
import { player } from "@/types";
import { auth } from "@/services/auth.service";
import { defineComponent, PropType } from "vue";
import { guard } from "@/services/guard.service";
import UserAutocomplete from "../form/UserAutocomplete.vue";
import { iconRoles, role } from "@/constants/roleConstants";

export default defineComponent({
  components: { UserAutocomplete },
  emits: ["update:modelValue"],
  data() {
    return {
      role,
      guard,
      iconRoles,
      actualPlayer: auth.currentPlayer,
      availablePlayers: [] as player[],
    };
  },
  props: {
    allowEmpty: {
      type: Boolean,
      default: () => false,
    },
    playerRetriever: {
      type: Function as PropType<() => Promise<player[]>>,
      required: true,
    },
  },
  mounted() {
    this.playerRetriever().then((players) => (this.availablePlayers = players));
  },
  watch: {
    actualPlayer() {
      this.$emit("update:modelValue", this.actualPlayer);
    },
  },
});
</script>
