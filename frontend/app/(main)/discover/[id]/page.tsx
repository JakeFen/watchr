export default async function MediaDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <p className="py-8 text-zinc-200">Media {id}</p>;
}
