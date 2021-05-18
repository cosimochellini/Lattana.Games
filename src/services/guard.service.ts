import { role } from "@/constants";
import { auth } from "./auth.service";

type EagerRoles = { [K in role]: boolean };

const setAuthorizations = () => {
  authorizations ??= {} as EagerRoles;

  for (const r in role)
    authorizations[r as role] = auth.isAuthorized([r as role]);

  return authorizations;
};

let authorizations: EagerRoles = setAuthorizations();

export const guard = {
  get role() {
    return authorizations;
  },
};

auth.onPlayerUpdate(setAuthorizations);
