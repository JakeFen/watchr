import { MediaDetailsContent } from "../../../features/discover/media-details/MediaDetailsContent";

export default async function MediaDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { id } = await params;
  const { type } = await searchParams;

  return <MediaDetailsContent id={id} type={type} />;
}
