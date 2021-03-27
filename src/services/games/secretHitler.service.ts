import { uuid } from "@/utils/uuid";
import { auth } from "../auth.service";
import { overlay } from "../overlay.service";
import { sanityClient } from "@/instances/sanity";
import { secretHitlerMatchPlayer } from "@/types";
import { sanityTypes } from "@/constants/roleConstants";
import { sanityDocument, secretHitlerMatch } from "@/types";
import { byRole } from "@/utils/sortables/secretHitlerSortables";
import { useInfiniteLoading } from "@/composable/infiniteLoading";
import { groq, reference, referenceWithKey } from "@/utils/GroqQueryBuilder";

const currentPlayer = auth.currentPlayer;

const matchesQuery = new groq.QueryBuilder(sanityTypes.secretHitlerMatch)
  .select(`...,  players[] -> {..., player ->}`)
  .where(
    new groq.ConditionBuilder(`$userId in players[] -> player._ref`).params({
      userId: currentPlayer._id,
    })
  )
  .orderBy(new groq.OrderBuilder("matchDate", true));

export const secretHitler = {
  getMatches() {
    const onResponse = (response: secretHitlerMatch[]) =>
      response.forEach((m) => m.players.sort(byRole));

    return useInfiniteLoading(matchesQuery, { onResponse });
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

  async deleteExistingMatch(match: secretHitlerMatch) {
    await sanityClient.patch(match._id).set({ players: [] }).commit();

    const playersPromises =
      match.players?.map((p) => sanityClient.delete(p._id)) ?? [];

    await Promise.all(playersPromises);

    await sanityClient.delete(match._id);

    return true;
  },
};
