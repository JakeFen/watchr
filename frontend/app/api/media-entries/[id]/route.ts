import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { deleteMediaEntry, updateMediaEntryStatus } from "../../../services/mediaEntries";
import type { WatchStatus } from "../../../types/media";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  const { id } = await params;
  const { status }: { status: WatchStatus } = await request.json();

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  const entry = await updateMediaEntryStatus(token, id, status);
  return NextResponse.json(entry);
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

  await deleteMediaEntry(token, id);
  return new NextResponse(null, { status: 204 });
}
