import { uuid } from "@/utils";
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
const onResponse = (response: secretHitlerMatch[]) =>
  response.forEach((m) => m.players.sort(byRole));

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

    return useInfiniteLoading(matchesQuery, { onResponse, pageSize: 16 });
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

  getOrderedPlayers() {
    return new groq.QueryBuilder(sanityTypes.player)
      .select(
        "..., 'count': count(*[_type=='secretHitlerMatchPlayer' && references(^._id)])"
      )
      .orderBy(new groq.OrderBuilder("count", true))
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

      overlay.show();

      await sanityClient.patch(match._id).set({ players: [] }).commit();

      const playersPromises =
        match.players?.map((p) => sanityClient.delete(p._id)) ?? [];

      await Promise.all(playersPromises);

      await sanityClient.delete(match._id);

      notification.success("notification.delete");

      overlay.hide();

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
