import { useContext } from "react";
import { CreatePostContainerContext } from "@/components/create-new-post/container";

export const useCreateNewPost = () => {
  const context = useContext(CreatePostContainerContext);
  if (context === undefined) {
    throw new Error(
      "useCreateNewPost must be used with CreateNewPostContext.Provider"
    );
  }

  return context;
};
