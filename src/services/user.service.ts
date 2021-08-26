import { sanityTypes } from "@/constants";
import { byString, byValue } from "sort-es";
import { groq } from "@/utils/GroqQueryBuilder";
import { IMatchPlayerBase, player } from "@/types";

export const user = {
  getUsersDropdown({ excluded }: { excluded: string[] }) {
    return new groq.QueryBuilder(sanityTypes.player)
      .orderBy(new groq.OrderBuilder("name"))
      .cached()
      .where(
        new groq.ConditionBuilder("_id in $excluded")
          .params({ excluded })
          .optional()
          .reverse()
      )
      .fetch<player[]>();
  },

  getTrumpRemainingPlayers(match: string) {
    return user.getBaseRemainingPlayers(match, sanityTypes.trumpMatchPlayer);
  },
  getSecretHitlerRemainingPlayers(match: string) {
    return user.getBaseRemainingPlayers(
      match,
      sanityTypes.secretHitlerMatchPlayer
    );
  },
  getBaseRemainingPlayers<TMatchPlayer extends IMatchPlayerBase>(
    match: string,
    type: sanityTypes
  ) {
    return new groq.QueryBuilder(type)
      .select("player ->")
      .where(new groq.ConditionBuilder("match._ref== $match").params({ match }))
      .fetch<TMatchPlayer[]>()
      .then((players) =>
        players.map((x) => x.player).sort(byValue((x) => x.name, byString()))
      );
  },

  getActualTrumpPlayers() {
    return user.getActualBasePlayers(sanityTypes.trumpMatchPlayer);
  },
  getActualSecretHitlerPlayers() {
    return user.getActualBasePlayers(sanityTypes.secretHitlerMatchPlayer);
  },

  getActualBasePlayers(type: sanityTypes) {
    return new groq.QueryBuilder(sanityTypes.player)
      .select(`..., 'count': count(*[_type=='${type}' && references(^._id)])`)
      .where(
        new groq.ConditionBuilder(
          ` _id in *[_type=='${type}' && win == true ].player._ref`
        )
      )
      .orderBy(new groq.OrderBuilder("count", true))
      .orderBy(new groq.OrderBuilder("name"))
      .cached()
      .fetch<player[]>();
  },
};
