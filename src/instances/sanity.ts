import imageUrlBuilder from "@sanity/image-url";
import sanityClientFactory, { SanityClient } from "@sanity/client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const apiVersion = "2020-01-01";

const sanityClient = sanityClientFactory({
  apiVersion,
  useCdn: false,
  dataset: "production",
  withCredentials: true,
  ignoreBrowserTokenWarning: true,
  token: process.env.VUE_APP_SANITY_TOKEN,
  projectId: process.env.VUE_APP_SANITY_PROJECT,
}) as Readonly<SanityClient>;

const readOnlySanityClient = sanityClientFactory({
  apiVersion,
  useCdn: true,
  dataset: "production",
  ignoreBrowserTokenWarning: true,
  projectId: process.env.VUE_APP_SANITY_PROJECT,
}) as Readonly<SanityClient>;

const urlFor = (source: SanityImageSource) =>
  imageUrlBuilder(readOnlySanityClient).image(source);

const image = (source: SanityImageSource, width: number) =>
  urlFor(source).width(width).toString() as string;

export { sanityClient, readOnlySanityClient, urlFor, image };
