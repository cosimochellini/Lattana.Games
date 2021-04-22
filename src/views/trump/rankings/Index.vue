<template>
  <div class="container text-center m-auto">
    <h2 class="base-title first-capitalize" v-t="'trump.titles.ranking'" />

    <div
      class="pt-1 flex items-center place-content-around max-w-2xl mb-3"
    >
      <select class="base-select" v-model="selectedOrderby">
        <option
          v-for="option in allOrderBy"
          :key="option"
          :value="option"
          v-t="'form.orderBy.' + option"
        />
      </select>
      <select class="base-select" v-model="selectedShape">
        <option
          v-for="option in orderByShape"
          :key="option"
          :value="option"
          v-t="'form.base.shapeOptions.' + option"
        />
      </select>
      <select class="base-select" v-model="selectedOrderbyDirection">
        <option
          v-for="option in orderbyDirection"
          :key="option"
          :value="option"
          v-t="'form.orderBy.' + option"
        />
      </select>
    </div>
    <ranking-users
      :rankingList="sortedRanks"
      :orderby="selectedOrderby"
      :shape="selectedShape"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { byNumber, byValue } from "sort-es";
import { trump } from "@/services/games/trump.service";
import { orderby, orderByShape } from "@/types/ranking";
import RankingUsers from "@/components/base/RankingUsers.vue";
import { orderbyDirection, trumpOrderBy } from "@/types/ranking";
import { trumpRank } from "@/utils/classes/stats/ranks/trumpRank";
import { RankingList } from "@/utils/classes/stats/ranks/baseRank";

const allOrderBy = { ...orderby, ...trumpOrderBy };
export default defineComponent({
  components: { RankingUsers },
  name: "Ranking",
  data() {
    return {
      allOrderBy,
      orderByShape,
      orderbyDirection,
      selectedOrderby: allOrderBy.win,
      selectedShape: orderByShape.raw,
      ranking: RankingList.default(trumpRank.create),
      selectedOrderbyDirection: orderbyDirection.desc,
    };
  },
  activated() {
    trump.getRanking().then((rank) => (this.ranking = rank));
  },
  computed: {
    sortedRanks(): trumpRank[] {
      const desc = this.selectedOrderbyDirection === orderbyDirection.desc;
      const type = this.selectedOrderby;
      const shape = this.selectedShape;

      return this.ranking
        .toList()
        .sort(byValue((rank) => rank[type][shape], byNumber({ desc })));
    },
  },
});
</script>