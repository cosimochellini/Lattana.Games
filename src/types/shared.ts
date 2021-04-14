export type BottomTab = {
  name: string;
  icon: string;
  route: string;
  activeColor: string;
  iconActive: string;
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
