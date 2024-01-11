const express = require("express");
const filePath = "./assets/Img.CR3";
const exiftool = require("exiftool-vendored").exiftool;

const app = express();
app.get("/", (req, res) => res.send("API Running"));

app.post("/exif", async (req, res) => {
  try {
    const tags = await exiftool.read(filePath);
    const response = {
      Lens: tags.Lens,
      FocusMode: tags.FocusMode,
      CaptureTime: tags.DateTimeOriginal.rawValue,
      ISO: tags.ISO,
      Speed: tags.ShutterSpeed,
      Apperture: tags.ApertureValue,
      FileName: tags.FileName,
      ImageSize: tags.ImageSize,
      WhiteBalance: tags.WhiteBalance,
      Rating: tags.Rating,
      Camera: tags.CanonImageType,
    };

    return res.send(response);
  } catch (error) {
    console.error("Something terrible happened:", error);
    return res.status(500).json({ error: "Error processing image metadata" });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
