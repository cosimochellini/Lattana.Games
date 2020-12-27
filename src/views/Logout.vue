 <template>
  <div>Logging out...</div>
</template>
 
 <script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent, onMounted } from "vue";
import { setPlayer } from "@/services/authService";

export default defineComponent({
  setup() {
    const router = useRouter();

    onMounted(() => {
      setPlayer(null);
      router.push("/");
    });
  },
});
</script>
 
 <style>
</style>