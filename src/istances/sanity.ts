import sanityClientFactory, { SanityClient } from "@sanity/client";

const sanityClient = sanityClientFactory({
  projectId: "tdm8v5j4",
  dataset: "production",
  token: process.env.SANITY_TOKEN,
  useCdn: true,
}) as Readonly<SanityClient>;

export { sanityClient };
