import { uuid } from "@/utils/uuid";
import { auth } from "../auth.service";
import { sanityDocument } from "@/types/base";
import { sanityClient } from "@/instances/sanity";
import { sanityTypes } from "@/constants/roleConstants";
import { trumpMatch, trumpMatchPlayer } from "@/types/sanity";
import { reference, referenceWithKey } from "@/utils/GroqQueryBuilder";

export const trumpService = {
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
      createdBy: reference(auth.currentPlayer),
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

    return sanityClient
      .patch(matchToCreate._id)
      .append("players", savedPlayers.map(referenceWithKey))
      .commit();
  },

  async updateMatch(match: trumpMatch) {
    return sanityClient.createOrReplace(match);
  },

  async deleteExistingMatch(match: trumpMatch) {
    await sanityClient.patch(match._id).set({ players: [] }).commit();

    const playersPromises =
      match.players?.map((p) => sanityClient.delete(p._id)) ?? [];

    await Promise.all(playersPromises);

    await sanityClient.delete(match._id);

    return true;
  },
};
