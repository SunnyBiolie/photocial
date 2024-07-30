import { notFound } from "next/navigation";
import { getPostByPostId } from "@/action/post/get";

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export default async function PostLayout({ params, children }: Props) {
  const post = await getPostByPostId(params.id);

  if (post === undefined) {
    throw new Error(
      `Prisma error: Something went wrong when fetching post with id: ${params.id}`
    );
  } else if (post === null) {
    return notFound();
  }

  return <div>{children}</div>;
}
