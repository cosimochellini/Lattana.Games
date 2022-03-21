import { role } from "@/constants";
import { auth } from "./auth.service";

type EagerRoles = { [K in role]: boolean };
let authorizations: EagerRoles;

const setAuthorizations = () => {
    authorizations ??= {} as EagerRoles;

    for (const r in role)
        authorizations[r as role] = auth.isAuthorized([r as role]);

    return authorizations;
};

authorizations = setAuthorizations();

export const guard = {
    get role() {
        return authorizations;
    },
};

auth.onPlayerUpdate(setAuthorizations);
