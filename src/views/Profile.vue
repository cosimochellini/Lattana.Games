<template>
  <div>
    <div v-show="false">
      <input type="file" ref="input" @change="load" />
      <img ref="image" />
    </div>
    <div
      class="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0"
    >
      <!--Main Col-->
      <div
        id="profile"
        class="w-full lg:w-3/5 rounded-lg shadow-2xl bg-white opacity-75 mx-6 lg:mx-0"
      >
        <div class="p-4 md:p-12 text-center lg:text-left">
          <div
            class="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
            :style="{ backgroundImage: `url('${profileImage}')` }"
          ></div>

          <h1 class="text-3xl font-bold pt-8 lg:pt-0">
            {{ currentPlayer.name }} {{ currentPlayer.surname }}
          </h1>
          <div
            class="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"
          ></div>
          <p
            class="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"
          >
            <i
              class="fas fa-id-card-alt h-4 fill-current text-green-700 pr-4 fa-lg"
            ></i>
            {{ currentPlayer.nickname }}
          </p>
          <p
            class="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"
          >
            <i
              class="fas fa-birthday-cake h-4 fill-current text-green-700 pr-4 fa-lg"
            ></i>
            {{ dateFormatter(currentPlayer.birthday) }}
          </p>
          <p
            class="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"
          >
            <i
              class="fas fa-lock h-4 fill-current text-green-700 pr-4 fa-lg"
            ></i>
            {{ longNumberFormatter(currentPlayer.pin) }}
          </p>
          <p class="pt-8 text-sm">
            Creato il {{ dayFormatter(currentPlayer._createdAt) }}, ultima
            modifica il {{ dayFormatter(currentPlayer._updatedAt) }}
          </p>

          <div class="pt-12 pb-8">
            <router-link
              tag="button"
              to="edit-profile"
              class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full"
            >
              Edit profile
            </router-link>
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
import { player } from "@/types/sanity";
import { getPlayer } from "@/services/authService";
import { settings } from "@/instances/package.json";
import { PhotoTaker } from "@/services/photoTaker.service";
import { image as imageBuilder } from "@/instances/sanity";
import { computed, defineComponent, onMounted, ref } from "vue";
import {
  dayFormatter,
  dateFormatter,
  longNumberFormatter,
} from "@/utils/formatters";

export default defineComponent({
  name: "Profile",

  setup() {
    const imageService = ref({} as PhotoTaker);
    const currentPlayer = ref(getPlayer() as player);
    const input = ref(null as HTMLInputElement | null);
    const image = ref(null as HTMLImageElement | null);
    const load = () => imageService.value.load();

    const profileImage = computed(() =>
      imageBuilder(currentPlayer.value.profileImage, 500)
    );

    onMounted(() => {
      imageService.value = new PhotoTaker(
        input.value as HTMLInputElement,
        image.value as HTMLImageElement
      );

      imageService.value.onLoad(console.log);
    });

    return {
      load,
      settings,
      dayFormatter,
      profileImage,
      dateFormatter,
      currentPlayer,
      longNumberFormatter,
    };
  },
});
</script>

<style>
</style>