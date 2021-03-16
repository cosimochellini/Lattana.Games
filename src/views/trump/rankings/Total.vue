<script lang="ts">
import { Ranking } from "@/utils/ranking";
import { byNumber, byValue } from "sort-es";
import { trumpMatch } from "@/types/sanity";
import { HorizontalBar } from "vue3-chart-v2";
import { defineComponent, PropType } from "vue";
import { getColor } from "@/services/color.service";

export default defineComponent({
  name: "TrumpRankingTotal",
  extends: HorizontalBar,
  props: {
    matches: {
      type: Array as PropType<trumpMatch[]>,
      required: true,
    },
  },
  mounted() {
    this.render();
  },
  methods: {
    render() {
      const r = new Ranking(this.matches.flatMap((m) => m.players))
        .groupBy((x) => x.player.nickname)
        .label((nickname) => nickname)
        .onMissingBackground(getColor)
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
  watch: {
    matches() {
      this.render();
    },
  },
  activated() {
    this.render();
  },
});
</script>

