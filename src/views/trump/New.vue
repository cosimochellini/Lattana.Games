<template>
  <div class="container m-auto p-4">
    <h2 class="base-title my-1 py-1">Inserisci nuova partita 🃏</h2>
    <draggable
      :list="remainingPlayers"
      group="people"
      itemKey="_id"
      class="base-card"
    >
      <template #header>
        <h2 class="base-subtitle">Giocatori da smistare</h2>

        <user-autocomplete
          class="w-full"
          v-show="allPlayers.length < 5"
          :excludedPlayers="allPlayers"
          @update:modelValue="addPlayer"
        />
      </template>
      <template #item="{ element }">
        <draggable-user
          :user="element"
          showDelete
          @deletePlayer="deletePlayer"
        />
      </template>
    </draggable>

    <draggable
      :list="callingPlayers"
      group="people"
      itemKey="_id"
      class="base-card mt-2 hover:border-2 hover:border-blue-400"
    >
      <template #header>
        <h2 class="base-subtitle">Squadra 1</h2>
      </template>
      <template #item="{ element }">
        <draggable-user :user="element" color="bg-blue-100" />
      </template>
    </draggable>

    <draggable
      :list="opposingPlayers"
      group="people"
      itemKey="_id"
      class="base-card mt-2"
    >
      <template #header>
        <h2 class="base-subtitle">Squadra 2</h2>
      </template>
      <template #item="{ element }">
        <draggable-user :user="element" color="bg-red-100" />
      </template>
    </draggable>

    <form @submit.prevent="saveMatch" class="flex flex-col items-center">
      <article
        class="base-card flex flex-col items-stretch m-2 justify-between sm:w-4/5 md:w-1/2 w-full"
      >
        <h2 class="base-subtitle">Giocatore chiamante</h2>
        <user-autocomplete :exactPlayers="allPlayers" v-model="callingPlayer" />

        <div class="m-2 flex justify-between">
          <label class="base-subtitle" for="initial points">
            Punteggio chiamato
          </label>
          <input
            name="initial points"
            type="number"
            min="60"
            max="120"
            class="pa-2 border rounded-md text-center"
            v-model.number="startingScore"
          />
        </div>
        <div class="m-2 flex justify-between">
          <label class="base-subtitle" for="initial points">
            Punteggio finale
          </label>
          <input
            name="initial points"
            type="number"
            min="60"
            max="120"
            class="pa-2 border rounded-md text-center"
            v-model.number="finalScore"
          />
        </div>
        <div class="m-2 flex justify-between">
          <label class="base-subtitle" for="initial points">
            Squadra vincente
          </label>
          <select class="base-select" v-model="firstTeamWin">
            <option :value="true">Squadra 1</option>
            <option :value="false">Squadra 2</option>
          </select>
        </div>
      </article>
      <button class="base-button primary" @click.prevent="saveMatch">
        salva
        <i class="fas fa-save ml-1"></i>
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import { defineComponent } from "vue";
import { sanityTypes } from "@/constants/roleConstants";
import { overlayService } from "@/services/overlayService";
import { trumpService } from "@/services/games/trumpService";
import DraggableUser from "@/components/base/DraggableUser.vue";
import { notificationService } from "@/services/notificationService";
import { player, trumpMatch, trumpMatchPlayer } from "@/types/sanity";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";
import { ConditionBuilder, QueryBuilder } from "@/utils/sanityQueryBuilder";

const playersQuery = new QueryBuilder(sanityTypes.trumpMatchPlayer).select(
  "player ->"
);

export default defineComponent({
  components: { UserAutocomplete, DraggableUser, draggable },
  name: "trumpNew",
  data() {
    return {
      remainingPlayers: [] as player[],
      callingPlayers: [] as player[],
      opposingPlayers: [] as player[],
      callingPlayer: {} as player,
      startingScore: 0,
      finalScore: 0,
      firstTeamWin: true,
    };
  },
  mounted() {
    if (this.$route.query.ref) {
      playersQuery
        .where(
          new ConditionBuilder("match._ref== $match").params({
            match: this.$route.query.ref as string,
          })
        )
        .fetch<trumpMatchPlayer[]>()
        .then(
          (players) => (this.remainingPlayers = players.map((x) => x.player))
        );
    }
  },
  methods: {
    addPlayer(p: player) {
      this.remainingPlayers.push(p);
    },
    deletePlayer(player: player) {
      this.remainingPlayers = this.remainingPlayers.filter(
        (p) => p._id !== player._id
      );
    },
    saveMatch() {
      try {
        const match = {
          matchDate: new Date(),
          startingScore: this.startingScore,
          finalScore: this.finalScore,
          callingPlayer: this.callingPlayer,
          players: this.allMatchPlayers,
        } as trumpMatch;

        overlayService.showOverlay();

        trumpService
          .saveNewMatch(match)
          .then(() => notificationService.success("salvataggio eseguito"))
          .catch(notificationService.danger)
          .finally(() => this.$router.push({ name: "trumpHistory" }));
      } catch (error) {
        notificationService.danger(error);
      }
    },
  },
  computed: {
    allMatchPlayers(): trumpMatchPlayer[] {
      const win = this.firstTeamWin;
      return [
        ...this.callingPlayers.map((p) => ({ player: p, win })),
        ...this.opposingPlayers.map((p) => ({ player: p, win: !win })),
      ] as trumpMatchPlayer[];
    },
    allPlayers(): player[] {
      return [
        ...this.remainingPlayers,
        ...this.callingPlayers,
        ...this.opposingPlayers,
      ].filter((p) => p?._id);
    },
  },
});
</script>

<style>
</style>