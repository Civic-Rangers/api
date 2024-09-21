import ImageKit from "imagekit";
import "dotenv/config";

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export const uploadImage = (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    imageKit.upload(
      {
        file: file.buffer,
        fileName: file.originalname,
      },
      (err, result) => {
        if (err) return reject(err);
        if (result) {
          resolve(result.url);
        } else {
          reject(new Error("Upload failed, result is null"));
        }
      }
    );
  });
};
