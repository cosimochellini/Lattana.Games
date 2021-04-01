<template>
  <div class="container m-auto p-4">
    <div class="flex flex-col items-center">
      <h2 class="base-title first-capitalize">
        {{ $t("trump.titles.insertNewMatch") }}
      </h2>
      <draggable
        :list="remainingPlayers"
        group="people"
        itemKey="_id"
        class="base-card card-width"
        v-if="!(!remainingPlayers.length && allPlayers.length === 5)"
      >
        <template #header>
          <h2 class="base-subtitle first-capitalize">
            {{ $t("trump.form.remainingPlayers") }}
          </h2>

          <user-autocomplete
            class="w-full"
            v-show="allPlayers.length < 5"
            :excludedPlayers="allPlayers"
            @update:modelValue="addPlayer"
            :exactPlayers="orderedPlayers"
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
        class="base-card mt-2 card-width"
      >
        <template #header>
          <h2 class="base-subtitle first-capitalize">
            {{ $t("trump.form.callingTeam") }}
          </h2>
        </template>
        <template #item="{ element }">
          <draggable-user
            :user="element"
            :color="
              element._id === callingPlayer._id ? 'bg-blue-300' : 'bg-blue-100'
            "
            :avatarColor="tailwind.winRingColor(callingPlayersWin)"
          />
        </template>
      </draggable>

      <draggable
        :list="opposingPlayers"
        group="people"
        itemKey="_id"
        class="base-card mt-2 card-width"
      >
        <template #header>
          <h2 class="base-subtitle first-capitalize">
            {{ $t("trump.form.opposingTeam") }}
          </h2>
        </template>
        <template #item="{ element }">
          <draggable-user
            :user="element"
            color="bg-red-100"
            :avatarColor="tailwind.winRingColor(!callingPlayersWin)"
          />
        </template>
      </draggable>
    </div>
    <form @submit.prevent="saveMatch" class="flex flex-col items-center">
      <article
        class="base-card flex flex-col items-stretch m-2 justify-between card-width"
      >
        <h2 class="base-subtitle first-capitalize">
          {{ $t("trump.form.callingPlayer") }}
        </h2>
        <user-autocomplete
          :exactPlayers="callingPlayers"
          v-model="callingPlayer"
        />

        <div class="m-2 flex justify-between">
          <label class="base-subtitle first-capitalize" for="starting score">
            {{ $t("trump.form.startingScore") }}
          </label>
          <input
            name="starting score"
            type="number"
            min="60"
            max="120"
            class="pa-2 border rounded-md text-center"
            v-model.number="startingScore"
          />
        </div>
        <div class="m-2 flex justify-between">
          <label class="base-subtitle first-capitalize" for="final score">
            {{ $t("trump.form.finalScore") }}
          </label>
          <input
            name="final score"
            type="number"
            min="40"
            max="120"
            class="pa-2 border rounded-md text-center"
            v-model.number="finalScore"
          />
        </div>
      </article>
      <button
        class="base-button primary large"
        @click.prevent="saveMatch"
        :disabled="!contextValidated"
      >
        {{ $t("buttons.base.save") }}
        <i class="fas fa-save ml-1"></i>
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import { range } from "@/utils/range";
import { defineComponent } from "vue";
import { byString, byValue } from "sort-es";
import { mergeObjects } from "@/utils/merge";
import { groq } from "@/utils/GroqQueryBuilder";
import { trump } from "@/services/games/trump.service";
import { tailwind } from "@/services/tailwind.service";
import { sanityTypes } from "@/constants/roleConstants";
import { queryRefresh } from "@/composable/routerRefresh";
import { player, trumpMatch, trumpMatchPlayer } from "@/types";
import DraggableUser from "@/components/base/DraggableUser.vue";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";

const playersQuery = new groq.QueryBuilder(sanityTypes.trumpMatchPlayer).select(
  "player ->"
);

const initialData = () => ({
  tailwind,
  finalScore: 0,
  startingScore: 0,
  callingPlayer: {} as player,
  orderedPlayers: [] as player[],
  callingPlayers: [] as player[],
  opposingPlayers: [] as player[],
  remainingPlayers: [] as player[],
});

export default defineComponent({
  components: { UserAutocomplete, DraggableUser, draggable },
  name: "trumpNew",
  data: initialData,
  async activated() {
    if (!this.$route.query.ref) return;

    playersQuery
      .where(
        new groq.ConditionBuilder("match._ref == $match").params({
          match: this.$route.query.ref,
        })
      )
      .fetch<trumpMatchPlayer[]>()
      .then((players) => {
        this.remainingPlayers = players
          .map((x) => x.player)
          .sort(byValue((x) => x.name, byString()));
      });
  },
  deactivated() {
    this.$nextTick(() => mergeObjects(this.$data, initialData()));
  },
  mounted() {
    trump
      .getOrderedPlayers()
      .then((players) => (this.orderedPlayers = players));
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
      trump
        .saveNewMatch({
          matchDate: new Date(),
          finalScore: this.finalScore,
          players: this.allMatchPlayers,
          startingScore: this.startingScore,
          callingPlayer: this.callingPlayer,
        } as trumpMatch)
        .then((result) => {
          result &&
            this.$router.push({ name: "trumpHistory", query: queryRefresh });
        });
    },
  },
  computed: {
    allMatchPlayers(): trumpMatchPlayer[] {
      return [
        ...this.callingPlayers.map((player) => ({
          player,
          win: this.callingPlayersWin,
        })),
        ...this.opposingPlayers.map((player) => ({
          player,
          win: !this.callingPlayersWin,
        })),
      ] as trumpMatchPlayer[];
    },
    allPlayers(): player[] {
      return [
        ...this.remainingPlayers,
        ...this.callingPlayers,
        ...this.opposingPlayers,
      ].filter((p) => p?._id);
    },
    callingPlayersWin(): boolean {
      return this.startingScore <= this.finalScore;
    },
    contextValidated(): boolean {
      const difference =
        this.opposingPlayers.length - this.callingPlayers.length;

      const callingPlayerSelected = !!this.callingPlayer._id;
      const startingScoreCorrect = range([60, 120], this.startingScore);
      const finalScoreCorrect = range([1, 120], this.finalScore);
      const noRemaingPlayers = this.remainingPlayers.length === 0;
      const correctPlayersNumber = this.allPlayers.length === 5;
      const correctDifference = difference === 1;

      const is120 = this.startingScore === 120;
      const correct120Difference = range([-1, 0], difference);

      return (
        noRemaingPlayers &&
        finalScoreCorrect &&
        startingScoreCorrect &&
        correctPlayersNumber &&
        callingPlayerSelected &&
        (correctDifference || (is120 && correct120Difference))
      );
    },
  },
});
</script>

<style>
.card-width {
  @apply w-full md:w-10/12 lg:w-4/5 xl:w-3/5 2xl:w-2/5;
}
</style>