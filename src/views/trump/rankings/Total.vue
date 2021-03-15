<script lang="ts">
import { HorizontalBar } from "vue3-chart-v2";
import { defineComponent, PropType } from "vue";
import { trumpMatch, trumpMatchPlayer } from "@/types/sanity";
type ranking = [string, number, number];

export default defineComponent({
  name: "TrumpRankingTotal",
  extends: HorizontalBar,
  props: {
    matches: {
      type: Array as PropType<trumpMatch[]>,
      required: true,
    },
  },
  mounted() {},
  methods: {
    render() {
      this.renderChart(
        {
          labels: this.ranking.map(([name]) => name),
          datasets: [
            {
              label: "Number of wins",
              backgroundColor: "#f37959",
              data: this.ranking.map(([, score]) => score),
            },

            {
              label: "Total matches",
              backgroundColor: "#d85959",
              data: this.ranking.map(([, , total]) => total),
            },
          ],
        },
        {
          responsive: true,
          aspectRatio: 0.6,
        }
      );
    },
  },
  computed: {
    allMatches(): trumpMatchPlayer[] {
      return this.matches.flatMap((x) => x.players);
    },
    uniquePlayers(): string[] {
      const allPlayers = this.allMatches.map((x) => x.player.nickname);

      return [...new Set(allPlayers)];
    },
    ranking(): ranking[] {
      return this.uniquePlayers
        .map((nickname) => {
          const currentPlays = this.allMatches.filter(
            (m) => m.player.nickname === nickname
          );

          return [
            nickname,
            currentPlays.filter((x) => x.win).length,
            currentPlays.length,
          ];
        })
        .sort(
          ([, score], [, scoreB]) => Number(score) - Number(scoreB)
        ) as ranking[];
    },
  },
  watch: {
    ranking() {
      this.render();
    },
  },
});
</script>

