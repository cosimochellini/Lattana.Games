<template>
  <div>
    <div
      class="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0"
    >
      <!--Main Col-->
      <div
        class="w-full lg:w-3/5 rounded-lg shadow-2xl bg-white opacity-75 mx-6 lg:mx-0"
      >
        <div class="p-4 md:p-12 text-center lg:text-left">
          <div
            class="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
            :style="{ backgroundImage: `url('${profileImage}')` }"
          ></div>

          <h1
            class="text-3xl font-bold pt-8 lg:pt-0 text-center tracking-wider"
          >
            {{ currentPlayer.name }} {{ currentPlayer.surname }}
          </h1>
          <div
            class="mx-auto lg:mx-0 w-full pt-3 border-b-2 border-green-500 opacity-25"
          ></div>
          <div class="pt-4 text-base font-bold grid grid-cols-4">
            <i
              class="fad fa-id-card h-4 fill-current text-green-700 pr-4 fa-lg col-span-1"
            />
            <span v-if="editMode" class="input-width">
              <input
                type="text"
                class="base-input"
                v-model="currentPlayer.nickname"
              />
            </span>
            <span v-else class="w-full input-width">
              {{ currentPlayer.nickname }}
            </span>
          </div>

          <div class="pt-4 text-base font-bold grid grid-cols-4">
            <i
              class="fad fa-at h-4 fill-current text-green-700 pr-4 fa-lg col-span-1"
            />
            <span v-if="editMode" class="input-width">
              <input
                type="email"
                class="base-input"
                v-model="currentPlayer.email"
              />
            </span>
            <span v-else class="w-full input-width">
              {{ currentPlayer.email }}
            </span>
          </div>

          <div class="pt-4 text-base font-bold grid grid-cols-4">
            <i
              class="fad fa-birthday-cake h-4 fill-current text-green-700 pr-4 fa-lg col-span-1"
            />

            <span class="input-width" v-if="editMode">
              <input
                type="date"
                class="base-input"
                v-model="currentPlayer.birthday"
              />
            </span>
            <span v-else class="w-full input-width">
              {{ formatter.dateFormatter(currentPlayer.birthday) }}
            </span>
          </div>
          <div class="pt-4 text-base font-bold grid grid-cols-4">
            <i
              class="fad fa-key h-4 fill-current text-green-700 pr-4 fa-lg col-span-1"
            />

            <span class="input-width" v-if="editMode">
              <input
                type="tel"
                class="base-input"
                v-model.number="currentPlayer.pin"
              />
            </span>
            <span v-else class="w-full input-width">
              {{ formatter.longNumberFormatter(currentPlayer.pin) }}
            </span>
          </div>
          <p class="pt-8 text-sm">
            Creato il {{ formatter.dayFormatter(currentPlayer._createdAt) }},
            ultima modifica il
            {{ formatter.dayFormatter(currentPlayer._updatedAt) }}
          </p>

          <div class="pt-12 pb-8 flex justify-around">
            <button
              @click="editMode = true"
              class="base-button primary"
              v-show="!editMode"
            >
              edit profile
            </button>

            <button
              @click="updateProfile"
              class="base-button success"
              v-show="editMode"
            >
              update profile
            </button>
            <button
              @click="discardChanges"
              class="base-button warning"
              v-show="editMode"
            >
              discard changes
            </button>
          </div>

          <div
            class="mt-6 pb-16 lg:pb-0 w-4/5 lg:w-full mx-auto flex flex-wrap items-center justify-evenly"
          >
            <a
              class="link border-2 p-2 rounded-lg uppercase"
              v-for="role in currentPlayer.roles"
              :key="role"
            >
              {{ role }}
            </a>
          </div>
        </div>
      </div>
      <div class="w-full lg:w-2/5">
        <img
          :src="profileImage"
          class="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
        />
      </div>
    </div>
    <div class="first-capitalize text-center font-semibold tracking-wider">
      version {{ settings.version }}
    </div>
  </div>
</template>

<script lang="ts">
import { image } from "@/instances/sanity";
import { defineComponent, ref } from "vue";
import { auth } from "@/services/auth.service";
import { formatter } from "@/utils/formatters";
import { settings } from "@/instances/package.json";
import { notification } from "@/services/notification.service";

export default defineComponent({
  name: "Profile",

  setup() {
    const currentPlayer = ref(auth.editablePlayer);
    const editMode = ref(false);

    const profileImage = image(currentPlayer.value.profileImage, 1000);

    const discardChanges = () => {
      editMode.value = false;
      currentPlayer.value = auth.editablePlayer;
    };
    const updateProfile = async () => {
      auth
        .updatePlayer(currentPlayer.value)
        .then(() => (currentPlayer.value = auth.editablePlayer))
        .catch(notification.danger)
        .finally(() => (editMode.value = false));
    };

    return {
      settings,
      editMode,
      formatter,
      profileImage,
      currentPlayer,
      updateProfile,
      discardChanges,
    };
  },
});
</script>

<style>
.input-width {
  @apply col-span-3 md:col-span-2;
}
</style>