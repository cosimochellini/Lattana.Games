import { IMatchBase } from "@/types";
import { auth } from "@/services/auth.service";

const currentPlayer = auth.currentPlayer;

export const getCurrentPlayer = (match: IMatchBase) =>
  match.players.find((p) => p.player._id === currentPlayer._id);
