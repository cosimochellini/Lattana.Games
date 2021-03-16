<script lang="ts">
import { Ranking } from "@/utils/ranking";
import { byNumber, byValue } from "sort-es";
import { HorizontalBar } from "vue3-chart-v2";
import { defineComponent, PropType } from "vue";
import { trumpMatch, trumpMatchPlayer } from "@/types/sanity";

type ranking = [string, number, number, number];

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
      const r = new Ranking(this.allMatches)
        .groupBy((x) => x.player.nickname)
        .label((nickname) => nickname)
        .dataset("Number of wins", (m) => m.filter((x) => x.win).length)
        .dataset("Number of loose", (m) => m.filter((x) => !x.win).length)
        .dataset("Total matches", (matches) => matches.length)
        .orderBy(byValue(({ items: [win] }) => win, byNumber({ desc: false })));

      this.renderChart(
        {
          labels: r.labels,
          datasets: r.datasets,
        },
        {
          responsive: true,
          aspectRatio: (innerWidth * 0.8) / (innerHeight * 0.8),
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
            currentPlays.filter((x) => !x.win).length,
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

