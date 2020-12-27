import { player } from "@/types/sanity";
import { sanityClient } from "@/istances/sanity";
import { sanityTypes } from "@/constants/roleConstants";
import { nanoid } from "nanoid";
import { reference, referenceWithKey } from "@/utils/sanityQueryBuilder";

export const saveNewMatch = async (
  players: player[],
  startingScore: number,
  finalScore: number
) => {
  if (players.length !== 5) throw new Error("incorrect number of players");

  const match = {
    _key: nanoid(),
    _type: sanityTypes.trumpMatch,
    matchDate: new Date(),
    startingScore,
    finalScore,
    callingPlayer: reference(players[0]),
  };

  const result = await sanityClient.create(match);

  const playersPromises = players.map((p) =>
    sanityClient.create({
      _key: nanoid(),
      _type: sanityTypes.trumpMatchPlayer,
      win: true,
      penaltyPoint: false,
      player: reference(p),
      trumpMatch: reference(result),
    })
  );

  const savedPlayers = await Promise.all(playersPromises);

  const result2 = await sanityClient
    .patch(result._id)
    .setIfMissing({ players: [] })
    .append("players", savedPlayers.map(referenceWithKey))
    .commit();

  // eslint-disable-next-line no-debugger
  debugger;
  console.log(result2);
};
