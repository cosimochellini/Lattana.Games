import { range } from "@/utils/range";
import { secretHitlerMatch, trumpMatch } from "@/types";
import { secretHitlerRole } from "@/constants/roleConstants";

export const tailwind = {
  winRingColor(win: boolean) {
    return win ? "ring-green-600" : "ring-red-600";
  },
  backgroundRatio(ratio: number, reverse: boolean = false) {
    return ratio >= 0.5 !== reverse ? "bg-green-300" : "bg-red-300";
  },

  trump: {
    background(match: trumpMatch) {
      return match.finalScore >= match.startingScore
        ? "bg-green-200"
        : "bg-red-200";
    },
    text(match: trumpMatch) {
      return match.finalScore >= match.startingScore
        ? "text-green-900"
        : "text-red-900";
    },
  },

  secretHitler: {
    borderColor(role: secretHitlerRole) {
      switch (role) {
        case secretHitlerRole.fascist:
          return "ring-red-500";
        case secretHitlerRole.liberal:
          return "ring-blue-500";
        case secretHitlerRole.hitler:
          return "ring-black";
      }
    },
    bindSpace(match: secretHitlerMatch) {
      const players = match.players.length;

      if (range([9, 10], players)) return "-space-x-2";
      if (range([8, 9], players)) return "-space-x-1";
      return "";
    },
  },
};
