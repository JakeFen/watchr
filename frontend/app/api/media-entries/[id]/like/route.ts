import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { likeMediaEntry, unlikeMediaEntry } from "../../../../services/mediaEntries";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  const { id } = await params;

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  await likeMediaEntry(token, id);
  return new NextResponse(null, { status: 204 });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  const { id } = await params;

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  await unlikeMediaEntry(token, id);
  return new NextResponse(null, { status: 204 });
}
