<template>
  <div>
    <div v-show="false">
      Profile
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
          <!-- Image for mobile view-->
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
            <svg
              class="h-4 fill-current text-green-700 pr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z"
              />
            </svg>
            {{ currentPlayer.nickname }}
          </p>
          <p
            class="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"
          >
            <svg
              class="h-4 fill-current text-green-700 pr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M1.84 4.15c-.993 0-1.8.787-1.84 1.772.003.058.004.116.012.172l1.19 7.597h6.384v-.43h.873c1.145 0 2.083-.567 2.083-1.793 0-1.227-.659-1.835-1.827-1.835-1.213 0-1.861.79-1.88 1.75h-1.25c.024-1.643 1.411-2.77 3.132-2.77 1.932 0 3.078 1.096 3.078 2.882 0 1.138-.869 1.895-1.563 2.196h6.079v-3.468l-2.619.873V9.922l3.647-1.31h.203v5.08h5.256l1.19-7.598c.008-.057.01-.115.012-.172a1.842 1.842 0 0 0-1.84-1.772zm-.615 9.696l-.611 7.877a1.846 1.846 0 0 0 1.843 1.974h19.087a1.846 1.846 0 0 0 1.842-1.974l-.611-7.877h-5.233v5.233H16.31v-5.233h-5.806c.635.277 1.443.908 1.44 2.255 0 1.95-1.457 2.98-3.224 2.98-1.53 0-3.176-.815-3.23-2.771h1.258c.028 1.214.955 1.758 1.972 1.758 1.168 0 1.976-.613 1.976-1.94 0-1.014-.554-1.888-2.238-1.888h-.873v-.394zM3.076.304c-1.02 0-1.846.826-1.846 1.846l.006 1.957a1.83 1.83 0 0 1 .61-.112h20.308c.217 0 .422.045.616.113V2.15c0-1.02-.826-1.846-1.846-1.846zm3.078.922a.923.923 0 0 1 .922.924.923.923 0 0 1-.922.921.923.923 0 0 1-.924-.921.923.923 0 0 1 .924-.924zm11.692 0a.923.923 0 0 1 .924.924.923.923 0 0 1-.924.921.923.923 0 0 1-.922-.921.923.923 0 0 1 .922-.924Z"
              />
            </svg>
            {{ dateFormatter(currentPlayer.birthday) }}
          </p>
          <p
            class="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"
          >
            <svg
              class="h-4 fill-current text-green-700 pr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M2.3043 19.0607c.2259.01.4538.04.6667.12v-.003l.032.012 2.8091-2.7391.102.137c.146.1998.2999.3798.4638.5597l.06.068c.043.043.077.086.12.13l.3259.3249.077.07.07.06a7.4626 7.4626 0 004.6534 1.7753 7.5146 7.5146 0 004.0087-1.0396l.216.224c.2499.2658.5068.5327.7557.7997a8.8581 8.8581 0 01-5.0154 1.3995 8.8341 8.8341 0 01-5.4612-2.0623l.01-.015-1.8024 1.7764A2.2463 2.2463 0 110 21.305a2.2453 2.2453 0 012.2453-2.2453h.058zM19.4737 7.4765a8.8321 8.8321 0 011.2796 4.8264 8.7872 8.7872 0 01-2.2073 5.6152l.01.01 1.1066 1.1766c.4459-.06.8918.094 1.2017.4199a1.3935 1.3935 0 01-.052 1.9663 1.3935 1.3935 0 01-1.9664-.052 1.3826 1.3826 0 01-.3519-1.2196 336.5811 336.5811 0 00-1.9493-2.0693l-.11-.12.128-.103a6.9212 6.9212 0 00.9277-.8846 7.4256 7.4256 0 001.8793-4.7755 7.4376 7.4376 0 00-.9267-3.8118l1.0297-.9796zM3.8267 2.226c.395-.006.7648.15 1.0397.432.31.3258.4399.7817.353 1.2195L7.3475 6.111l-.128.104a6.9208 6.9208 0 00-.9276.8847 7.4906 7.4906 0 00-.9617 8.5942l-1.0217.9957A8.7602 8.7602 0 013.021 11.838c.044-2.0673.8498-4.0646 2.2033-5.6201L4.0517 4.9933a1.4005 1.4005 0 01-1.2026-.42 1.3955 1.3955 0 01.052-1.9673c.2169-.204.4968-.3349.7937-.3699.044-.006.09-.007.133-.01zM21.746.4427a2.2473 2.2473 0 11-.6998 4.3806l-.002.002-.033-.012-3.049 2.894-.102-.1379a7.1777 7.1777 0 00-.5328-.6268l-.034-.043-.2659-.2659-.12-.103-.077-.07-.06-.0499-.0769-.07a7.4556 7.4556 0 00-4.6185-1.7514A7.4336 7.4336 0 008.0724 5.629l-.9797-1.0216a8.8371 8.8371 0 015.0154-1.3996 8.7912 8.7912 0 015.4622 2.0694h.017l2.0194-1.9164A2.2463 2.2463 0 0121.75.4438zM11.956 5.4581c.254 0 .5069.02.7598.05 3.6228.4548 6.19 3.7608 5.7441 7.3846a6.6239 6.6239 0 01-7.3846 5.7451 6.6239 6.6239 0 01-5.7461-7.3846c.4318-3.3619 3.257-5.7831 6.6258-5.7951zm-.1 2.839c-1.4655.117-2.5271 1.2267-2.5651 2.6992.027 1.0537.5648 1.9394 1.5045 2.4252l-.5118 2.3993h3.4219l-.5099-2.3993c.9347-.5068 1.4896-1.3455 1.5046-2.4222-.02-1.5215-1.1977-2.6671-2.7052-2.7051l-.14.004zm.052-.015h-.01z"
              />
            </svg>
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
              >{{ role }}</a
            >
          </div>
          <!-- Use https://simpleicons.org/ to find the svg for your preferred product -->
        </div>
      </div>

      <!--Img Col-->
      <div class="w-full lg:w-2/5">
        <!-- Big profile image for side bar (desktop) -->
        <img
          :src="profileImage"
          class="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
        />
        <!-- Image from: http://unsplash.com/photos/MP0IUfwrn0A -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { player } from "@/types/sanity";
import { urlFor } from "@/istances/sanity";
import { getPlayer } from "@/services/authService";
import { PhotoTaker } from "@/services/photoTakerService";

import {
  dateFormatter,
  dayFormatter,
  longNumberFormatter,
} from "@/utils/formatters";

export default defineComponent({
  name: "Profile",
  data() {
    return {
      imageService: {} as PhotoTaker,
      currentPlayer: getPlayer() as player,
    };
  },
  mounted() {
    const { input, image } = this.$refs;
    console.log({ ...this.currentPlayer });
    this.imageService = new PhotoTaker(
      input as HTMLInputElement,
      image as HTMLImageElement
    );

    this.imageService.onLoad((data) => console.log(data));
  },

  methods: {
    dateFormatter,
    dayFormatter,
    longNumberFormatter,
    load() {
      this.imageService.load();
    },
  },
  computed: {
    profileImage(): string | null {
      return urlFor(this.currentPlayer.profileImage).toString();
    },
  },
});
</script>

<style>
</style>