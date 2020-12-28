import { nanoid } from "nanoid";
import { sanityClient } from "@/istances/sanity";
import { sanityTypes } from "@/constants/roleConstants";
import { reference, referenceWithKey } from "@/utils/sanityQueryBuilder";
import { sanityDocument, trumpMatch, trumpMatchPlayer } from "@/types/sanity";

export const saveNewMatch = async (
  players: trumpMatchPlayer[],
  startingScore: number,
  finalScore: number
) => {
  if (players.length !== 5) throw new Error("incorrect number of players");

  const match = {
    _id: nanoid(),
    _type: sanityTypes.trumpMatch,
    matchDate: new Date(),
    startingScore,
    finalScore,
    callingPlayer: reference(players[0]),
  } as sanityDocument<trumpMatch>;

  const result = await sanityClient.create(match);

  const playersPromises = players.map((p) =>
    sanityClient.create({
      _key: nanoid(),
      _type: sanityTypes.trumpMatchPlayer,
      win: p.win,
      penaltyPoint: p.penaltyPoint,
      player: reference(p.player),
      trumpMatch: reference(result),
    })
  );

  const savedPlayers = await Promise.all(playersPromises);

  const result2 = await sanityClient
    .patch(result._id)
    .setIfMissing({ players: [] })
    .append("players", savedPlayers.map(referenceWithKey))
    .commit();

  console.log(result2);
};
