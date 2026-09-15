import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { removeFriendship, sendFriendRequest } from "../../../services/friendships";

export async function POST(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId: viewerId, getToken } = await auth();
  if (!viewerId) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  const { userId } = await params;
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  await sendFriendRequest(token, userId);
  return new NextResponse(null, { status: 201 });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId: viewerId, getToken } = await auth();
  if (!viewerId) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  const { userId } = await params;
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  await removeFriendship(token, userId);
  return new NextResponse(null, { status: 204 });
}
