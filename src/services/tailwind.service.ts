import { range } from "@/utils";
import { secretHitlerRole } from "@/constants";
import { Dictionary, secretHitlerMatch, trumpMatch } from "@/types";

export const tailwind = {
  base: {
    text(condition: boolean) {
      return condition ? "text-green-900" : "text-red-900";
    },
    background(condition: boolean) {
      return condition ? "bg-green-300" : "bg-red-300";
    },
    ringColor(condition: boolean) {
      return condition ? "ring-green-600" : "ring-red-600";
    },
  },

  shared: {
    backgroundRatio(ratio: number, reverse: boolean = false) {
      return tailwind.base.background(ratio >= 0.5 !== reverse);
    },

    bindRate(rate: number): string {
      if (rate < 0.16) return "bg-green-400";
      if (rate < 0.33) return "bg-green-300";
      if (rate < 0.5) return "bg-green-200";

      if (rate < 0.66) return "bg-red-200";
      if (rate < 0.83) return "bg-red-300";

      return "bg-red-400";
    },

    rankingBackground: ["ring-yellow-400", "ring-gray-300", "ring-yellow-700"],

    bindImageRing(index: number): Dictionary<boolean> {
      if (index >= 3) return {};

      return {
        ring: true,
        [tailwind.shared.rankingBackground[index]]: true,
      };
    },
  },

  trump: {
    background(match: trumpMatch) {
      return tailwind.base.background(match.finalScore >= match.startingScore);
    },
    text(match: trumpMatch) {
      return tailwind.base.text(match.finalScore >= match.startingScore);
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
    bindBackground(role: string) {
      switch (role) {
        case secretHitlerRole.liberal:
          return "bg-blue-300";
        case secretHitlerRole.fascist:
          return "bg-red-300";
        default:
          return "bg-gray-400";
      }
    },
    bindTextColor(role: string) {
      switch (role) {
        case secretHitlerRole.liberal:
          return "text-blue-900";
        case secretHitlerRole.fascist:
          return "text-red-900";
        default:
          return "text-black";
      }
    },
  },
};
