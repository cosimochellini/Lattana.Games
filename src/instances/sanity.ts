import imageUrlBuilder from "@sanity/image-url";
import sanityClientFactory, { SanityClient } from "@sanity/client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const sanityClient = sanityClientFactory({
  useCdn: false,
  projectId: process.env.VUE_APP_SANITY_PROJECT,
  dataset: "production",
  withCredentials: true,
  ignoreBrowserTokenWarning: true,
  token: process.env.VUE_APP_SANITY_TOKEN,
}) as Readonly<SanityClient>;

const readOnlySanityClient = sanityClientFactory({
  useCdn: true,
  projectId: process.env.VUE_APP_SANITY_PROJECT,
  dataset: "production",
  ignoreBrowserTokenWarning: true,
}) as Readonly<SanityClient>;

const urlFor = (source: SanityImageSource) =>
  imageUrlBuilder(readOnlySanityClient).image(source);

const image = (source: SanityImageSource, width: number) =>
  urlFor(source)
    .width(width)
    .toString() as string;

export { sanityClient, readOnlySanityClient, urlFor, image };
