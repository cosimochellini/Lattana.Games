import { IMatchBase } from "@/types";
import { auth } from "@/services/auth.service";

export const getCurrentPlayer = <T extends IMatchBase>(
  match: T,
  playerId = auth.currentPlayer._id
) => match.players.find((p) => p.player._id === playerId);
