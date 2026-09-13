import { ProfileContent } from "../../../features/profile/ProfileContent";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return <ProfileContent userId={userId} />;
}
