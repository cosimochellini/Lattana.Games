import { auth } from "./auth.service";
import { role } from "@/constants/roleConstants";

type EagerRoles = { [K in role]: boolean };

let authorizations: EagerRoles | null = null;

export const guard = {
  get role() {
    if (!authorizations) setAuthorizations();

    return authorizations as EagerRoles;
  },
};

const setAuthorizations = () => {
  authorizations = {} as EagerRoles;
  for (const r in role)
    authorizations[r as role] = auth.isAuthorized([r as role]);
};

auth.onPlayerUpdate(setAuthorizations);
