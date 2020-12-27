import { player } from "@/types/sanity";
import { sanityClient } from "@/istances/sanity";
import { sanityTypes } from "@/constants/roleConstants";
import { nanoid } from "nanoid";

export const saveNewMatch = async (
  players: player[],
  startingScore: number,
  finalScore: number
) => {
  if (players.length !== 5) throw new Error("incorrect number of players");

  const match = {
    _type: sanityTypes.trumpMatch,
    matchDate: new Date(),
    startingScore,
    finalScore,
    grants: [
      {
        path: "*",
        permissions: ["read", "update", "create"],
      },
    ],
  };

  const result = await sanityClient.create(match);

  console.log(result);

  const result2 = await sanityClient
    .patch(result._id)
    .setIfMissing({ players: [] })
    .append(
      "players",
      players.map((p) => ({
        _key: nanoid(),
        win: true,
        penaltyPoint: false,
        player: { type: "references", _ref: p._id },
      }))
    )
    .commit();

  console.log(result2);
};
