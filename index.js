import fs from "fs/promises";
import path from "path";
import { createCanvas, loadImage } from "canvas";

const imagesDir = "./logos";
const logosPerRow = 8;

const createSpritesheet = async () => {
  try {
    const imageFiles = (await fs.readdir(imagesDir)).filter((file) =>
      /\.(png|jpg|jpeg)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      console.log("No images found in the directory.");
      return;
    }

    const images = await Promise.all(
      imageFiles.map((file) => loadImage(path.join(imagesDir, file)))
    );

    const logoWidth = 24;
    const logoHeight = 24;
    const rows = Math.ceil(images.length / logosPerRow);
    const spritesheetWidth = logoWidth * logosPerRow;
    const spritesheetHeight = logoHeight * rows;
    const canvas = createCanvas(spritesheetWidth, spritesheetHeight);
    const ctx = canvas.getContext("2d");
    const metadata = [];
    const folderName = path.join(process.cwd(), "resources");

    images.forEach((img, index) => {
      const x = (index % logosPerRow) * logoWidth;
      const y = Math.floor(index / logosPerRow) * logoHeight;
      ctx.drawImage(img, x, y, logoWidth, logoHeight);

      metadata.push({
        filename: imageFiles[index],
        x,
        y,
        width: logoWidth,
        height: logoHeight,
      });
    });

    await fs.mkdir(folderName, { recursive: true });

    const outputPath = path.join(folderName, "spritesheet.png");
    const stream = canvas.createPNGStream();
    await fs.writeFile(outputPath, stream);
    console.log(`Spritesheet saved as ${outputPath}`);

    const metadataPath = path.join(folderName, "metadata.json");
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`Metadata saved as ${metadataPath}`);
  } catch (error) {
    console.error(error);
  }
};

createSpritesheet();
