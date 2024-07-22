import ImageKit from "imagekit";

declare global {
  var imagekitGlobal: ImageKit | undefined;
}

const imageKit =
  globalThis.imagekitGlobal ||
  new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT!,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.imagekitGlobal = imageKit;
}

export default imageKit;
