const express = require("express");
const cors = require("cors");
const { imageData } = require("./data");
const exiftool = require("exiftool-vendored").exiftool;

const app = express();
app.use(cors());

app.get("/", (req, res) => res.send("API Running"));

const getExifData = async () => {
  const responseArray = [];
  for (const image of imageData) {
    const tags = await exiftool.read(image.file);
    const response = {
      index: image.index,
      info: {
        Lens: tags.Lens,
        FocusMode: tags.FocusMode,
        CaptureTime: tags.DateTimeOriginal.rawValue,
        ISO: tags.ISO,
        Speed: tags.ShutterSpeed,
        Aperture: tags.ApertureValue,
        FileName: tags.FileName,
        ImageSize: tags.ImageSize,
        WhiteBalance: tags.WhiteBalance,
        Rating: tags.Rating,
        Camera: tags.CanonImageType,
      },
    };
    responseArray.push(response);
  }

  return responseArray;
};
app.get("/exif", async (req, res) => {
  try {
    const responses = await getExifData();
    return res.json(responses);
  } catch (error) {
    console.error("Something terrible happened:", error);
    return res.status(500).json({ error: "Error processing image metadata" });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
