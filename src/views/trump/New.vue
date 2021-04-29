<template>
  <div class="container m-auto p-4">
    <div class="flex flex-col items-center">
      <h2 class="base-title first-capitalize">
        {{ $t("trump.titles.insertNewMatch") }}
        <i :class="iconRoles[role.editor]"></i>
      </h2>

      <draggable
        :list="remainingPlayers"
        group="people"
        itemKey="_id"
        class="base-card card-width"
        v-if="!(!remainingPlayers.length && allPlayers.length === 5)"
      >
        <template #header>
          <h2
            class="base-subtitle first-capitalize"
            v-t="'trump.form.remainingPlayers'"
          />

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
          <h2
            class="base-subtitle first-capitalize"
            v-t="'trump.form.callingTeam'"
          />
        </template>
        <template #item="{ element }">
          <draggable-user
            :user="element"
            :color="
              element._id === callingPlayer._id ? 'bg-blue-300' : 'bg-blue-100'
            "
            :avatarColor="tailwind.base.ringColor(callingPlayersWin)"
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
          <h2
            class="base-subtitle first-capitalize"
            v-t="'trump.form.opposingTeam'"
          />
        </template>
        <template #item="{ element }">
          <draggable-user
            :user="element"
            color="bg-red-100"
            :avatarColor="tailwind.base.ringColor(!callingPlayersWin)"
          />
        </template>
      </draggable>
    </div>
    <form
      @submit.prevent="saveMatch"
      class="flex flex-col items-center"
      v-show="remainingPlayers.length === 0 && allMatchPlayers.length === 5"
    >
      <article
        class="base-card flex flex-col items-stretch m-2 justify-between card-width"
      >
        <h2
          class="base-subtitle first-capitalize"
          v-t="'trump.form.callingPlayer'"
        />

        <user-autocomplete
          :exactPlayers="callingPlayers"
          v-model="callingPlayer"
        />

        <div class="m-2 flex justify-between">
          <label
            class="base-subtitle first-capitalize"
            for="starting score"
            v-t="'trump.form.startingScore'"
          />

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
          <label
            class="base-subtitle first-capitalize"
            for="final score"
            v-t="'trump.form.finalScore'"
          />

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
      <div class="inline-flex gap-4 w-full justify-center">
        <button
          class="base-button warning w-full"
          @click.prevent="discardChanges"
        >
          <span v-t="'buttons.base.discard'" />

          <i class="fas fa-trash-alt ml-1" />
        </button>
        <button
          class="base-button primary w-full"
          @click.prevent="saveMatch"
          :disabled="!contextValidated"
        >
          <span v-t="'buttons.base.save'" />

          <i class="fas fa-save ml-1" />
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import { defineComponent } from "vue";
import { mergeObjects, range } from "@/utils";
import { user } from "@/services/user.service";
import { trump } from "@/services/games/trump.service";
import { tailwind } from "@/services/tailwind.service";
import { queryRefresh } from "@/composable/routerRefresh";
import { dialog, dialogType } from "@/services/dialog.service";
import { player, trumpMatch, trumpMatchPlayer } from "@/types";
import DraggableUser from "@/components/base/DraggableUser.vue";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";
import { iconRoles, role } from "@/constants";

let orderedPlayers = [] as player[];

const initialData = () => ({
  role,
  tailwind,
  iconRoles,
  finalScore: 0,
  orderedPlayers,
  startingScore: 0,
  callingPlayer: {} as player,
  callingPlayers: [] as player[],
  opposingPlayers: [] as player[],
  remainingPlayers: [] as player[],
});
export default defineComponent({
  components: { UserAutocomplete, DraggableUser, draggable },
  name: "trumpNew",
  data: initialData,
  activated() {
    this.resetData();
  },
  methods: {
    async resetData() {
      this.remainingPlayers = [];
      if (!orderedPlayers.length) {
        await trump
          .getOrderedPlayers()
          .then((players) => (orderedPlayers = players));
      }

      mergeObjects(this.$data, initialData());

      if (this.$route.query.ref) {
        user
          .getTrumpRemainingPlayers(this.$route.query.ref as string)
          .then((players) => (this.remainingPlayers = players));
      }
    },
    addPlayer(p: player) {
      this.remainingPlayers.push(p);
    },
    deletePlayer(player: player) {
      this.remainingPlayers = this.remainingPlayers.filter(
        (p) => p._id !== player._id
      );
    },
    saveMatch() {
      const matchToSave: Partial<trumpMatch> = {
        matchDate: new Date(),
        finalScore: this.finalScore,
        players: this.allMatchPlayers,
        startingScore: this.startingScore,
        callingPlayer: this.callingPlayer,
      };

      trump.saveNewMatch(matchToSave).then((result) => {
        result &&
          this.$router.push({ name: "trumpHistory", query: queryRefresh });
      });
    },
    async discardChanges() {
      const result = await dialog.confirm({
        title: "discardMatch",
        type: dialogType.warning,
        buttons: {
          confirm: "confirm",
          cancel: "cancel",
        },
      });

      if (!result) return;

      this.resetData();
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
      const noRemainingPlayers = this.remainingPlayers.length === 0;
      const correctPlayersNumber = this.allPlayers.length === 5;
      const correctDifference = difference === 1;

      const is120 = this.startingScore === 120;
      const correct120Difference = range([-1, 0], difference);

      return (
        finalScoreCorrect &&
        noRemainingPlayers &&
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