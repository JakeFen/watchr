import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createMediaEntry } from "../../services/mediaEntries";
import type { WatchStatus } from "../../types/media";
import type { TmdbMediaType } from "../../types/tmdb";

export async function POST(request: Request) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  const body: {
    mediaType: TmdbMediaType;
    tmdbId: number;
    title: string;
    posterPath?: string;
    status: WatchStatus;
  } = await request.json();

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  const entry = await createMediaEntry(token, body);
  return NextResponse.json(entry, { status: 201 });
}
