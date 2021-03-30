import { uuid } from "@/utils/uuid";
import { auth } from "../auth.service";
import { overlay } from "../overlay.service";
import { sanityClient } from "@/instances/sanity";
import { notification } from "../notification.service";
import { dialog, dialogType } from "../dialog.service";
import { sanityTypes } from "@/constants/roleConstants";
import { player, secretHitlerMatchPlayer } from "@/types";
import { sanityDocument, secretHitlerMatch } from "@/types";
import { byRole } from "@/utils/sortables/secretHitlerSortables";
import { useInfiniteLoading } from "@/composable/infiniteLoading";
import { RankingList } from "@/utils/classes/stats/ranks/baseRank";
import { groq, reference, referenceWithKey } from "@/utils/GroqQueryBuilder";
import { secretHitlerRank } from "@/utils/classes/stats/ranks/secretHitlerRank";
import { SecretHitlerStats } from "@/utils/classes/stats/secretHitlerMatchStats";

const currentPlayer = auth.currentPlayer;

export const secretHitler = {
  getMatches() {
    const matchesQuery = new groq.QueryBuilder(sanityTypes.secretHitlerMatch)
      .select(`...,  players[] -> {..., player ->}`)
      .where(
        new groq.ConditionBuilder(`$userId in players[] -> player._ref`)
          .params({ userId: currentPlayer._id })
          .optional()
      )
      .orderBy(new groq.OrderBuilder("matchDate", true));

    const onResponse = (response: secretHitlerMatch[]) =>
      response.forEach((m) => m.players.sort(byRole));

    return useInfiniteLoading(matchesQuery, { onResponse });
  },

  getStats(player: player) {
    return new groq.QueryBuilder(sanityTypes.secretHitlerMatchPlayer)
      .select("..., player ->, match -> {..., players[] -> {...,player -> } }")
      .where(
        new groq.ConditionBuilder("player._ref == $playerId").params({
          playerId: player._id,
        })
      )
      .cached()
      .fetch<secretHitlerMatchPlayer[]>()
      .then((matches) => new SecretHitlerStats(matches, player));
  },

  getRanking() {
    return new groq.QueryBuilder(sanityTypes.secretHitlerMatch)
      .select("..., players[] -> { player ->, ...}")
      .cached()
      .fetch<secretHitlerMatch[]>()
      .then((matches) => new RankingList(matches, secretHitlerRank.create));
  },

  getActualPlayers() {
    return new groq.QueryBuilder(sanityTypes.player)
      .where(
        new groq.ConditionBuilder(
          "_id in *[_type=='secretHitlerMatchPlayer' && win == true ].player._ref"
        )
      )
      .orderBy(new groq.OrderBuilder("name"))
      .cached()
      .fetch<player[]>();
  },

  async deleteExistingMatch(match: secretHitlerMatch) {
    try {
      const shouldDelete = await dialog.confirm({
        title: "deleteMatch",
        description: "deleteMatch",
        type: dialogType.danger,
        buttons: { cancel: "cancel", confirm: "confirm" },
      });

      if (!shouldDelete) return false;

      await sanityClient.patch(match._id).set({ players: [] }).commit();

      const playersPromises =
        match.players?.map((p) => sanityClient.delete(p._id)) ?? [];

      await Promise.all(playersPromises);

      await sanityClient.delete(match._id);

      notification.success("eliminazione eseguita");

      return true;
    } catch (error) {
      notification.danger(error);
      return false;
    } finally {
      overlay.hide();
    }
  },

  async saveNewMatch(match: Partial<secretHitlerMatch>) {
    overlay.show();

    const matchToCreate = {
      _id: uuid(),
      _type: sanityTypes.secretHitlerMatch,
      matchDate: match.matchDate,
      players: [],
      winningRole: match.winningRole,
      createdBy: reference(auth.currentPlayer),
      updatedBy: null,
    } as sanityDocument<secretHitlerMatch>;

    let result = await sanityClient.create(matchToCreate);

    const playersPromises = match.players?.map((p) =>
      sanityClient.create({
        _id: uuid(),
        _key: uuid(),
        _type: sanityTypes.secretHitlerMatchPlayer,
        win: p.win,
        penaltyPoint: p.penaltyPoint,
        player: reference(p.player),
        match: reference(result),
        role: p.role,
      } as sanityDocument<secretHitlerMatchPlayer>)
    );

    const savedPlayers = await Promise.all(playersPromises ?? []);

    result = await sanityClient
      .patch(result._id)
      .append("players", savedPlayers.map(referenceWithKey))
      .commit();

    return result;
  },
};
