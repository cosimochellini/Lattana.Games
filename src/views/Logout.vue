 <template>
  <div>Logging out...</div>
</template>
 
 <script lang="ts">
import { defineComponent, onMounted } from "vue";
import { setPlayer } from "@/services/authService";

export default defineComponent({
  setup() {
    onMounted(() => {
      setPlayer(null);
      (window as any).location = "/";
    });
  },
});
</script>
 
 <style>
</style>