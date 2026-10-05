import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { POSTS_CACHE_TAG } from "@/sanity/lib/queries";

// Document types whose content is rendered by the post queries (authors and
// categories are dereferenced into post listings).
const POST_CONTENT_TYPES = new Set(["post", "author", "category"]);

type WebhookPayload = { _type?: string };

// Called by a Sanity GROQ webhook on publish, update, or delete. Expires the
// post cache immediately so the next request renders fresh content, without
// depending on a visitor having <SanityLive /> connected.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }

    if (!body?._type || !POST_CONTENT_TYPES.has(body._type)) {
      return NextResponse.json(
        { message: "Ignored document type", type: body?._type ?? null },
        { status: 200 },
      );
    }

    // `expire: 0` skips stale-while-revalidate: the next request blocks on
    // fresh data instead of being served the cached post list.
    revalidateTag(POSTS_CACHE_TAG, { expire: 0 });

    return NextResponse.json({
      revalidated: true,
      tag: POSTS_CACHE_TAG,
      type: body._type,
    });
  } catch (error) {
    console.error("Sanity revalidate webhook failed", error);
    return NextResponse.json(
      { message: "Failed to process webhook" },
      { status: 500 },
    );
  }
}
