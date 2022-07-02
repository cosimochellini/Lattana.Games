<template>
  <div>
    <div class="
        max-w-4xl
        flex
        items-center
        h-auto
        lg:h-screen
        flex-wrap
        mx-auto
        my-20
        lg:my-0
      ">
      <!--Main Col-->
      <div class="
          w-full
          lg:w-3/5
          rounded-lg
          shadow-2xl
          bg-white
          opacity-75
          mx-6
          lg:mx-0
        ">
        <div class="p-4 md:p-12 text-center lg:text-left">
          <div class="
              lg:hidden
              mx-auto
              -mt-16
              h-48
              w-48
              bg-cover bg-center
              relative
            ">
            <div class="
                absolute
                inset-0
                bg-cover bg-center
                z-0
                rounded-full
                shadow-2xl
                border
              " :class="editMode ? 'blur' : ''" :style="{ backgroundImage: ` url('${profileImage}')` }"></div>
            <div v-if="editMode" class="
                opacity-100
                absolute
                inset-0
                z-10
                flex
                justify-center
                items-center
                text-xl text-white
                font-semibold
              ">
              <span class="
                  border border-white
                  rounded-lg
                  px-2
                  py-1
                  tracking-wide
                  first-capitalize
                ">
                <span v-t="'form.profile.uploadPhoto'" />
                <input class="
                    cursor-pointer
                    absolute
                    block
                    opacity-0
                    w-48
                    inset-0
                    pin-r pin-t
                  " type="file" accept="image/*" name="profileImage" @change="updateProfileImage" />
                <i class="fad fa-cloud-upload" />
              </span>
            </div>
          </div>

          <h1 class="text-3xl font-bold pt-8 lg:pt-0 text-center tracking-wider">
            {{ currentPlayer.name }} {{ currentPlayer.surname }}
          </h1>
          <div class="
              mx-auto
              lg:mx-0
              w-full
              pt-3
              border-b-2 border-green-500
              opacity-25
            "></div>
          <div class="pt-4 text-base font-bold grid grid-cols-4">
            <i class="
                fad
                fa-id-card
                h-4
                fill-current
                text-green-700
                pr-4
                fa-lg
                col-span-1
              " />
            <span v-if="editMode" class="input-width">
              <input type="text" class="base-input" v-model="currentPlayer.nickname" />
            </span>
            <span v-else class="w-full input-width">
              {{ currentPlayer.nickname }}
            </span>
          </div>

          <div class="pt-4 text-base font-bold grid grid-cols-4">
            <i class="
                fad
                fa-at
                h-4
                fill-current
                text-green-700
                pr-4
                fa-lg
                col-span-1
              " />
            <span v-if="editMode" class="input-width">
              <input type="email" class="base-input" v-model="currentPlayer.email" />
            </span>
            <span v-else class="w-full input-width">
              {{ currentPlayer.email }}
            </span>
          </div>

          <div class="pt-4 text-base font-bold grid grid-cols-4">
            <i class="
                fad
                fa-birthday-cake
                h-4
                fill-current
                text-green-700
                pr-4
                fa-lg
                col-span-1
              " />

            <span class="input-width" v-if="editMode">
              <input type="date" class="base-input" v-model="currentPlayer.birthday" />
            </span>
            <span v-else class="w-full input-width">
              {{ formatter.dateFormatter(currentPlayer.birthday) }}
            </span>
          </div>
          <div class="pt-4 text-base font-bold grid grid-cols-4">
            <i class="
                fad
                fa-key
                h-4
                fill-current
                text-green-700
                pr-4
                fa-lg
                col-span-1
              " />

            <span class="input-width" v-if="editMode">
              <input type="tel" class="base-input" v-model.number="currentPlayer.pin" />
            </span>
            <span v-else class="w-full input-width">
              {{ formatter.longNumberFormatter(currentPlayer.pin) }}
            </span>
          </div>
          <div class="
              mt-6
              w-4/5
              lg:w-full
              mx-auto
              flex flex-wrap
              items-center
              justify-evenly
            " v-if="currentPlayer.roles?.length">
            <a class="
                link
                border-2
                p-2
                rounded-lg
                first-capitalize
                tracking-wider
              " v-for="role in currentPlayer.roles.split(';')" :key="role">
              {{ role }}
              <i :class="getRoleClass(role)"></i>
            </a>
          </div>
          <div class="pt-8 text-sm">
            <div class="first-capitalize mt-1" v-if="currentPlayer._createdAt">
              <span v-t="'system.createdAt'" />
              <date-badge :date="currentPlayer._createdAt" />
            </div>

            <div class="first-capitalize mt-1" v-if="currentPlayer._updatedAt">
              <span v-t="'system.updatedAt'" />

              <date-badge :date="currentPlayer._updatedAt" />
            </div>
          </div>

          <div class="pt-12 pb-8 flex justify-around gap-4 text-black">
            <button @click="() => (editMode = true)" class="base-button primary" v-show="!editMode">
              <span v-t="'buttons.base.editProfile'" />

              <i class="fas fa-user-edit" />
            </button>

            <button @click="updateProfile" class="base-button success" v-show="editMode">
              <span v-t="'buttons.base.update'" />

              <i class="fad fa-save" />
            </button>
            <button @click="discardChanges" class="base-button warning" v-show="editMode">
              <span v-t="'buttons.base.discard'" />

              <i class="fas fa-trash-undo-alt" />
            </button>
          </div>
        </div>
      </div>
      <div class="w-full lg:w-2/5 text-center hidden lg:block">
        <img :src="profileImage" class="rounded-none lg:rounded-lg shadow-2xl hover:bri" />
        <div class="relative w-64 mt-4 mb-4 m-auto" v-if="editMode">
          <button class="base-button primary">
            <span class="ml-2" v-t="'form.profile.uploadPhoto'" />

            <input class="cursor-pointer absolute block opacity-0 pin-r pin-t" type="file" accept="image/*"
              name="profileImage" @change="updateProfileImage" />
            <i class="fad fa-cloud-upload" />
          </button>
        </div>
      </div>
    </div>
    <div class="text-center font-semibold tracking-wider">
      <span v-t="'system.version'" />
      {{ settings.version }}
    </div>
  </div>
</template>

<script lang="ts">
import { settings } from "@/utils";
import { image } from "@/instances/sanity";
import { auth } from "@/services/auth.service";
import { formatter } from "@/utils/formatters";
import { iconRoles, role } from "@/constants";
import { HTMLInputEvent } from "@/types";
import { computed, defineComponent, ref } from "vue";
import DateBadge from "@/components/base/DateBadge.vue";
import { notification } from "@/services/notification.service";

export default defineComponent({
  components: { DateBadge },
  name: "ProfileComponent",

  setup() {
    const currentPlayer = ref(auth.editablePlayer);
    const editMode = ref(false);

    const profileImage = computed(() =>
      image(currentPlayer.value.profileImage, 1000)
    );

    const discardChanges = () => {
      editMode.value = false;
      currentPlayer.value = auth.editablePlayer;
    };

    auth.onPlayerUpdate(() => {
      currentPlayer.value = auth.editablePlayer;
      editMode.value = false;
    });

    const updateProfile = () =>
      auth.updatePlayer(currentPlayer.value).catch(notification.danger);

    const updateProfileImage = (event: Event) =>
      auth
        .updateProfileImage((event as HTMLInputEvent).target?.files?.[0])
        .catch(notification.danger);

    const getRoleClass = (role: string) => iconRoles[(role as role)]

    return {
      settings,
      editMode,
      formatter,
      profileImage,
      currentPlayer,
      updateProfile,
      discardChanges,
      updateProfileImage,
      iconRoles,
      getRoleClass,
    };
  },
});
</script>

<style>
.input-width {
  @apply col-span-3 md:col-span-2;
}

.blur {
  @apply filter blur-md brightness-50;
}
</style>
