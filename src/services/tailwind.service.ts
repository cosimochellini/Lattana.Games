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

  bindRate(rate: number): string {
    if (rate < 0.16) return "bg-green-400";
    if (rate < 0.33) return "bg-green-300";
    if (rate < 0.5) return "bg-green-200";

    if (rate < 0.66) return "bg-red-200";
    if (rate < 0.83) return "bg-red-300";

    return "bg-red-400";
  },

  text(condition: boolean) {
    return condition ? "text-green-900" : "text-red-900";
  },

  rankingBackground: ["ring-yellow-400", "ring-gray-300", "ring-yellow-700"],

  trump: {
    background(match: trumpMatch) {
      return match.finalScore >= match.startingScore
        ? "bg-green-200"
        : "bg-red-200";
    },
    text(match: trumpMatch) {
      return tailwind.text(match.finalScore >= match.startingScore);
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
