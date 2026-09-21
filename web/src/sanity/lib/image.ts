import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ dataset, projectId });

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}
