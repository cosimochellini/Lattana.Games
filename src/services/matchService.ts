import { nanoid } from "nanoid";
import { sanityClient } from "@/istances/sanity";
import { sanityTypes } from "@/constants/roleConstants";
import { reference, referenceWithKey } from "@/utils/sanityQueryBuilder";
import { sanityDocument, trumpMatch, trumpMatchPlayer } from "@/types/sanity";

export const saveNewMatch = async (match: trumpMatch) => {
  if (match.players.length !== 5)
    throw new Error("incorrect number of players");

  const matchToCreate = {
    _id: nanoid(),
    _type: sanityTypes.trumpMatch,
    matchDate: match.matchDate,
    startingScore: match.startingScore,
    finalScore: match.finalScore,
    callingPlayer: reference(match.players[0].player),
  } as sanityDocument<trumpMatch>;

  let result = await sanityClient.create(matchToCreate);

  const playersPromises = match.players.map((p) =>
    sanityClient.create({
      _id: nanoid(),
      _key: nanoid(),
      _type: sanityTypes.trumpMatchPlayer,
      win: p.win,
      penaltyPoint: p.penaltyPoint,
      player: reference(p.player),
      trumpMatch: reference(result),
    } as sanityDocument<trumpMatchPlayer>)
  );

  const savedPlayers = await Promise.all(playersPromises);

  result = await sanityClient
    .patch(result._id)
    .setIfMissing({ players: [] })
    .append("players", savedPlayers.map(referenceWithKey))
    .commit();

  return result;
};
