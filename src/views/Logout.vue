 <template>
  <div class="flex items-center self-center object-center m-11">
    Logging out...
  </div>
</template>

 <script lang="ts">
import { auth } from "@/services/auth.service";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "LogoutComponent",
  setup() {
    onMounted(() => {
      auth.logout();
      (window as any).location = "/";
    });
  },
});
</script>

 <style>
</style>
