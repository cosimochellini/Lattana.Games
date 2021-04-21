<template>
  <div class="container m-auto p-4">
    <div class="flex flex-col items-center">
      <h2
        class="base-title first-capitalize"
        v-t="'secretHitler.titles.insertNewMatch'"
      />
      <draggable
        :list="remainingPlayers"
        group="people"
        itemKey="_id"
        class="base-card card-width"
        v-if="!(!remainingPlayers.length && totalPlayers.length === 10)"
      >
        <template #header>
          <h2
            class="base-subtitle first-capitalize"
            v-t="'secretHitler.form.remainingPlayers'"
          />

          <user-autocomplete
            class="w-full"
            v-show="totalPlayers.length + remainingPlayers.length < 10"
            :excludedPlayers="excludedPlayers"
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
        :list="liberalPlayers"
        group="people"
        itemKey="_id"
        class="base-card mt-2 card-width"
      >
        <template #header>
          <h2
            class="base-subtitle first-capitalize"
            v-t="'secretHitler.form.liberalPlayers'"
          />
        </template>
        <template #item="{ element }">
          <draggable-user
            color="bg-blue-100"
            :user="element"
            :avatarColor="
              tailwind.base.ringColor(winningRole === secretHitlerRole.liberal)
            "
          />
        </template>
      </draggable>

      <draggable
        :list="fascistPlayers"
        group="people"
        itemKey="_id"
        class="base-card mt-2 card-width"
      >
        <template #header>
          <h2
            class="base-subtitle first-capitalize"
            v-t="'secretHitler.form.fascistPlayers'"
          />
        </template>
        <template #item="{ element }">
          <draggable-user
            :user="element"
            :color="
              element._id === hitlerPlayer._id ? 'bg-gray-300' : 'bg-red-100'
            "
            :avatarColor="
              tailwind.base.ringColor(winningRole === secretHitlerRole.fascist)
            "
          />
        </template>
      </draggable>
    </div>
    <form
      @submit.prevent="saveMatch"
      class="flex flex-col items-center mt-2"
      v-if="totalPlayers.length > 0 && remainingPlayers.length === 0"
    >
      <div class="base-card w-full mx-2 py-4 card-width">
        <h2
          class="base-subtitle first-capitalize"
          v-t="'secretHitler.form.winningRole'"
        />

        <select v-model="winningRole" class="base-select w-full">
          <option value="" disabled v-t="'secretHitler.form.selectRole'" />

          <option
            v-for="role in allRoles"
            :key="role"
            :value="role"
            v-t="'secretHitler.roles.' + role"
          />
        </select>

        <h2 class="base-subtitle mt-2">Hitler</h2>
        <user-autocomplete
          :exactPlayers="fascistPlayers"
          class="w-full"
          v-model="hitlerPlayer"
        />
      </div>

      <div class="inline-flex gap-4 w-full mt-2 justify-center">
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
import { tailwind } from "@/services/tailwind.service";
import { queryRefresh } from "@/composable/routerRefresh";
import { secretHitlerRole } from "@/constants/roleConstants";
import { dialog, dialogType } from "@/services/dialog.service";
import DraggableUser from "@/components/base/DraggableUser.vue";
import { secretHitler } from "@/services/games/secretHitler.service";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";
import { player, secretHitlerMatch, secretHitlerMatchPlayer } from "@/types";

let orderedPlayers = [] as player[];

const initialData = () => ({
  tailwind,
  orderedPlayers,
  secretHitlerRole,
  hitlerPlayer: {} as player,
  liberalPlayers: [] as player[],
  fascistPlayers: [] as player[],
  remainingPlayers: [] as player[],
  winningRole: "" as secretHitlerRole,
  allRoles: [secretHitlerRole.fascist, secretHitlerRole.liberal],
});

export default defineComponent({
  components: { UserAutocomplete, draggable, DraggableUser },
  name: "secretHitlerNew",
  data: initialData,
  activated() {
    this.resetData();
  },
  methods: {
    async resetData() {
      this.remainingPlayers = [];

      if (!orderedPlayers.length) {
        await secretHitler
          .getOrderedPlayers()
          .then((players) => (orderedPlayers = players));
      }
      mergeObjects(this.$data, initialData());

      if (this.$route.query.ref) {
        user
          .getSecretHitlerRemainingPlayers(this.$route.query.ref as string)
          .then((players) => (this.remainingPlayers = players));
      }
    },
    addPlayer(player: player) {
      this.remainingPlayers.push(player);
    },
    deletePlayer(player: player) {
      this.remainingPlayers = this.remainingPlayers.filter(
        (p) => p._id !== player._id
      );
    },
    saveMatch() {
      const matchToSave: Partial<secretHitlerMatch> = {
        matchDate: new Date(),
        winningRole: this.winningRole,
        players: this.totalPlayers,
      };

      secretHitler.saveNewMatch(matchToSave).then((result) => {
        result &&
          this.$router.push({
            name: "secretHitlerHistory",
            query: queryRefresh,
          });
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
    updateElement(index: number, p: player) {
      this.remainingPlayers[index] = { ...this.remainingPlayers[index], ...p };
    },
    bindPlayer(
      player: player,
      role: secretHitlerRole,
      hitlerPlayer: player | null = null
    ) {
      const win = this.winningRole === role;
      const isHitler = player._id === hitlerPlayer?._id;
      const fascistAreWinning = role === this.winningRole;

      return {
        player,
        win: win || (isHitler && fascistAreWinning),
        role: isHitler ? secretHitlerRole.hitler : role,
      } as secretHitlerMatchPlayer;
    },
  },
  computed: {
    totalPlayers(): secretHitlerMatchPlayer[] {
      return [
        ...this.liberalPlayers.map((p) =>
          this.bindPlayer(p, secretHitlerRole.liberal)
        ),
        ...this.fascistPlayers.map((p) =>
          this.bindPlayer(p, secretHitlerRole.fascist, this.hitlerPlayer)
        ),
      ];
    },
    excludedPlayers(): player[] {
      return this.totalPlayers
        .map((x) => x.player)
        .concat(this.remainingPlayers);
    },
    contextValidated(): boolean {
      const difference =
        this.liberalPlayers.length - this.fascistPlayers.length;

      const hitlerSelected = !!this.hitlerPlayer._id;
      const winningRoleSelected = !!this.winningRole;
      const noRemainingPlayers = this.remainingPlayers.length === 0;
      const correctPlayersNumber = range([6, 11], this.totalPlayers.length);
      const correctPlayerDistribution = range([1, 2], difference);

      return (
        hitlerSelected &&
        noRemainingPlayers &&
        winningRoleSelected &&
        correctPlayersNumber &&
        correctPlayerDistribution
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