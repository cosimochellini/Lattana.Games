import { uuid } from "@/utils/uuid";
import { sanityDocument } from "@/types/base";
import { sanityClient } from "@/instances/sanity";
import { sanityTypes } from "@/constants/roleConstants";
import { reference, referenceWithKey } from "@/utils/sanityQueryBuilder";
import { secretHitlerMatch, secretHitlerMatchPlayer } from "@/types/sanity";

export const secretHitlerService = {
  async saveNewMatch(match: secretHitlerMatch) {
    const matchToCreate = {
      _id: uuid(),
      _type: sanityTypes.secretHitlerMatch,
      matchDate: match.matchDate,
      players: [],
      winningRole: match.winningRole,
    } as sanityDocument<secretHitlerMatch>;

    let result = await sanityClient.create(matchToCreate);

    const playersPromises = match.players.map((p) =>
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

    const savedPlayers = await Promise.all(playersPromises);

    result = await sanityClient
      .patch(result._id)
      .append("players", savedPlayers.map(referenceWithKey))
      .commit();

    return result;
  },

  async deleteExistingMatch(match: secretHitlerMatch) {
    await sanityClient
      .patch(match._id)
      .set({ players: [] })
      .commit();

    const playersPromises =
      match.players?.map((p) => sanityClient.delete(p._id)) ?? [];

    await Promise.all(playersPromises);

    await sanityClient.delete(match._id);

    return true;
  },
};
