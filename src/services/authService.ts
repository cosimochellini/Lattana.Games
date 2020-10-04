import { player } from "@/types/sanity";
import { sanityClient } from "@/istances/sanity";
import { loginQuery } from "@/constants/groq/auth";
import { roleConstants } from "@/constants/roleConstants";

const LS_PLAYER_KEY = "LG_stored_user";

const login = async (name: string, pin: string) => {
  const player = await sanityClient.fetch<player | null>(loginQuery, {
    name: name.toLowerCase(),
    pin: Number.parseInt(pin),
  });

  setPlayer(player);
};

const isAuthorized = (roles: string[] = [], player: player | null = null) => {
  if (player === null) {
    player = getPlayer();
  }

  if (player === null) return false;

  roles = roles.map((r) => r.toLowerCase());

  if (roles.length === 0) return isLogged(player);

  if (player.roles.includes(roleConstants.Admin)) return true;

  for (const role of player.roles) {
    if (roles.includes(role.toLowerCase())) return true;
  }

  return false;
};

const isLogged = (player: player | null = null) => {
  if (player === null) {
    player = getPlayer();
  }

  return player !== null;
};

const setPlayer = (player: player | null) =>
  localStorage.setItem(LS_PLAYER_KEY, JSON.stringify(player));

const getPlayer = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_PLAYER_KEY) ?? "") as player;
  } catch (error) {
    setPlayer(null);
    return null;
  }
};

export { login, isAuthorized, getPlayer, setPlayer };
