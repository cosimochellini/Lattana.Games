import { roleConstants } from "@/constants/roleConstants";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export type player = {
  _id: string;
  name: string;
  surname: string;
  nickname: string;
  email: string;
  roles: roleConstants[];
  profileImage: SanityImageSource;
};