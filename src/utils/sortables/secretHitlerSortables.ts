import { byValue } from "sort-es";
import { secretHitlerMatchPlayer } from "@/types";
import { sortable } from "sort-es/lib/src/types/types";
import { secretHitlerRole } from "@/constants/roleConstants";

export const byRole: sortable<secretHitlerMatchPlayer> = byValue(
  "role",
  (a, b) => {
    if (a === b) return 0;
    if (a === secretHitlerRole.hitler) return -1;
    if (b === secretHitlerRole.hitler) return 1;
    if (a === secretHitlerRole.fascist) return -1;
    return 1;
  }
);
