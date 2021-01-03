<template>
  <div>
    <ul>
      <li v-for="m in matches" :key="m._id">
        {{ m }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getPlayer } from "@/services/authService";
import { sanityTypes } from "@/constants/roleConstants";
import { player, trumpMatchPlayer } from "@/types/sanity";
import { notificationService } from "@/services/notificationService";
import { ConditionBuilder, QueryBuilder } from "@/utils/sanityQueryBuilder";

const playerQuery = new QueryBuilder(sanityTypes.player);

const matchesQuery = new QueryBuilder(sanityTypes.trumpMatchPlayer)
  .select("..., player ->, trumpMatch -> {..., players[] -> { player -> } }")
  .freeze();

export default defineComponent({
  data() {
    return {
      players: [] as player[],
      matches: [] as trumpMatchPlayer[],
      currentPlayer: getPlayer() as player,
    };
  },
  mounted() {
    playerQuery
      .fetch<player[]>()
      .then((players) => (this.players = players))
      .catch(notificationService.danger);

    this.loadMatches();
  },
  methods: {
    loadMatches() {
      matchesQuery
        .where(
          new ConditionBuilder("player._ref == $playerId").params({
            playerId: this.currentPlayer._id,
          })
        )
        .fetch<trumpMatchPlayer[]>()
        .then((matches) => (this.matches = matches));
    },
  },
});
</script>

<style>
</style>