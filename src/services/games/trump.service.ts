import { uuid } from "@/utils/uuid";
import { auth } from "../auth.service";
import { overlay } from "../overlay.service";
import { sanityClient } from "@/instances/sanity";
import { notification } from "../notification.service";
import { dialog, dialogType } from "../dialog.service";
import { sanityTypes } from "@/constants/roleConstants";
import { useInfiniteLoading } from "@/composable/infiniteLoading";
import { trumpRank } from "@/utils/classes/stats/ranks/trumpRank";
import { RankingList } from "@/utils/classes/stats/ranks/baseRank";
import { groq, reference, referenceWithKey } from "@/utils/GroqQueryBuilder";
import { player, sanityDocument, trumpMatch, trumpMatchPlayer } from "@/types";

const currentPlayer = auth.currentPlayer;

export const trump = {
  getMatches(player: player | null) {
    const matchesQuery = new groq.QueryBuilder(sanityTypes.trumpMatch)
      .select(`...,  callingPlayer ->, players[] -> {player ->,...}`)
      .where(
        new groq.ConditionBuilder(`$userId in players[] -> player._ref`)
          .params({ userId: player?._id })
          .optional()
      )
      .orderBy(new groq.OrderBuilder("matchDate", true));

    const infiniteLoading = useInfiniteLoading<trumpMatch>(matchesQuery, {
      pageSize: 6,
    });

    const { getMoreData, items: matches, moreDataAvailable } = infiniteLoading;

    return { getMoreData, matches, moreDataAvailable };
  },

  getRanking() {
    return new groq.QueryBuilder(sanityTypes.trumpMatch)
      .select(
        "..., players[] -> { player ->, match ->{callingPlayer ->, ...}, ...}"
      )
      .cached()
      .fetch<trumpMatch[]>()
      .then((matches) => new RankingList(matches, trumpRank.create));
  },

  async saveNewMatch(match: trumpMatch) {
    if (match.players.length !== 5)
      throw new Error("incorrect number of players");

    const matchToCreate = {
      _id: uuid(),
      _type: sanityTypes.trumpMatch,
      matchDate: match.matchDate,
      startingScore: match.startingScore,
      finalScore: match.finalScore,
      callingPlayer: reference(match.callingPlayer),
      players: [],
      createdBy: reference(currentPlayer),
      updatedBy: undefined,
    } as sanityDocument<trumpMatch>;

    await sanityClient.create(matchToCreate);

    const playersPromises = match.players.map((p) =>
      sanityClient.create({
        _id: uuid(),
        _key: uuid(),
        _type: sanityTypes.trumpMatchPlayer,
        win: p.win,
        penaltyPoint: p.penaltyPoint,
        player: reference(p.player),
        match: reference(matchToCreate),
      } as sanityDocument<trumpMatchPlayer>)
    );

    const savedPlayers = await Promise.all(playersPromises);

    return await sanityClient
      .patch(matchToCreate._id)
      .append("players", savedPlayers.map(referenceWithKey))
      .commit();
  },

  async updateMatch(match: trumpMatch) {
    return sanityClient.createOrReplace(match);
  },

  async deleteExistingMatch(match: trumpMatch) {
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

      notification.success("eliminazione eseguita");

      return true;
    } catch (error) {
      notification.danger(error);

      return false;
    } finally {
      overlay.hide();
    }
  },
};
