import { FriendsPageContent } from "../../../../features/profile/FriendsPageContent";

export default async function UserFriendsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return <FriendsPageContent userId={userId} />;
}
