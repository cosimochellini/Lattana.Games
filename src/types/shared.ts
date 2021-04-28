import { role } from "@/constants/roleConstants";

export type BottomTab = {
  name: string;
  icon: string;
  route: string;
  activeColor: string;
  iconActive: string;
  roles: role[] | null;
};

export type BottomElement = {
  game: string;
  elements: BottomTab[];
};

export type ApplicationState = {
  name: string;
  color: string;
  icon: string;
};
