export type ImageFile = {
  id: string;
  file: File;
};

export type ImgPreCropData = {
  id: string;
  originURL: string;
  intrinsicAR: number;
  perCropSize: [number, number]; // [width, height]
  perCropPos: [number, number]; // [top, left]
};

export type ImgCroppedData = {
  bytes: Uint8Array;
  croppedURL: string;
};

// ["select images", "set aspect ratio", "cropping image", "more info: title, description"]
export type CreatePostState = "se" | "ar" | "cr" | "in";

export type Direction = "vertical" | "horizontal";

// [9:16 | 2:3 | 3:4 | 4:5 | 1:1 | 5:4 | 4:3 | 3:2 | 16:9]
export type AspectRatio =
  | 0.5625
  | 0.6666666666666667
  | 0.75
  | 0.8
  | 1
  | 1.25
  | 1.3333333333333333
  | 1.5
  | 1.7777777777777778;
