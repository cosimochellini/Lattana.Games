import { role } from "@/constants";
import { auth } from "./auth.service";

type EagerRoles = { [K in role]: boolean };

const setAuthorizations = () => {
  for (const r in role)
    authorizations[r as role] = auth.isAuthorized([r as role]);

  return authorizations;
};

const authorizations: EagerRoles = setAuthorizations();

export const guard = {
  get role() {
    return authorizations;
  },
};

auth.onPlayerUpdate(setAuthorizations);
