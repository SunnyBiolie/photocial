import { getPostByPostId } from "@/action/post/get";
import { PostPage } from "@/components/post/post-page";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function PostPageServer({ params }: Props) {
  const post = await getPostByPostId(params.id);

  if (post === undefined) {
    throw new Error(
      `Prisma error: Something went wrong when fetching post with id: ${params.id}`
    );
  } else if (post === null) {
    return notFound();
  }

  return <PostPage post={post} />;
}
