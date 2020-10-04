import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export type player = {
  name: string;
  surname: string;
  nikname: string;
  email: string;
  roles: string[];
  profileImage: SanityImageSource;
};
