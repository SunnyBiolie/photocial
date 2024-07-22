import { AspectRatio, Direction } from "./types/create-post-types";

export const configCreateNewPost = {
  defCurrIndex: 0,
  defDirection: "vertical" as Direction,
  defAspectRatio: 1 as AspectRatio,
  maxImageFiles: 8,
  limitSize: 10, // MB
};

export const configCropParams = {
  vertical: [0.5625, 0.6666666666666667, 0.75, 0.8, 1] as AspectRatio[],
  verticalDisplay: ["9:16", "2:3", "3:4", "4:5", "1:1"],
  horizontal: [
    1.7777777777777778, 1.5, 1.3333333333333333, 1.25, 1,
  ] as AspectRatio[],
  horizontalDisplay: ["16:9", "3:2", "4:3", "5:4", "1:1"],
};

export const configImageKit = {
  folderName: "Photocial",
};
