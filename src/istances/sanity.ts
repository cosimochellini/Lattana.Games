import imageUrlBuilder from "@sanity/image-url";
import sanityClientFactory, { SanityClient } from "@sanity/client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const sanityClient = sanityClientFactory({
  projectId: "tdm8v5j4",
  dataset: "production",
  token: process.env.SANITY_TOKEN,
  useCdn: true,
}) as Readonly<SanityClient>;

const builder = imageUrlBuilder(sanityClient);

const urlFor = (source: SanityImageSource) => builder.image(source);

export { sanityClient, urlFor };
