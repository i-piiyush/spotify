import ImageKit from "imagekit";
import _config from "../config/config.js";

const imagekit = new ImageKit({
  publicKey: _config.IMAGEKIT_PUBLIC_KEY,
  privateKey: _config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: _config.IMAGEKIT_URL_ENDPOINT,
});

export const uploadMusic = async (file, filename, folder) => {
  const uploadedFile = await imagekit.upload({
    file,
    fileName: filename,
    folder,
  });

  return uploadedFile;
};

export const uploadCoverArt = async (file, filename, folder) => {
  const uploadedFile = await imagekit.upload({
    file,
    fileName: filename,
    folder,
  });

  return uploadedFile;
};
