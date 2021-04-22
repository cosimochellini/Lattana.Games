<template>
  <div class="container text-center m-auto">
    <h2
      class="base-title first-capitalize"
      v-t="'secretHitler.titles.ranking'"
    />

    <div
      class="px-2 pt-2 flex items-center place-content-around max-w-2xl m-auto mb-3"
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
import { orderby, orderByShape } from "@/types/ranking";
import RankingUsers from "@/components/base/RankingUsers.vue";
import { RankingList } from "@/utils/classes/stats/ranks/baseRank";
import { secretHitler } from "@/services/games/secretHitler.service";
import { orderbyDirection, secretHitlerOrderBy } from "@/types/ranking";
import { secretHitlerRank } from "@/utils/classes/stats/ranks/secretHitlerRank";

const allOrderBy = { ...orderby, ...secretHitlerOrderBy };

export default defineComponent({
  components: { RankingUsers },
  name: "Ranking",
  data() {
    return {
      allOrderBy,
      orderbyDirection,
      orderByShape,
      selectedOrderby: allOrderBy.win,
      selectedShape: orderByShape.raw,
      selectedOrderbyDirection: orderbyDirection.desc,
      ranking: RankingList.default(secretHitlerRank.create),
    };
  },
  activated() {
    secretHitler.getRanking().then((rank) => (this.ranking = rank));
  },
  computed: {
    sortedRanks(): secretHitlerRank[] {
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