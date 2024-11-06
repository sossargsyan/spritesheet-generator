const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// Directory containing the images
const imagesDir = "./logos";

// Set up spritesheet configuration
const logosPerRow = 5; // Number of logos per row in the spritesheet

async function createSpritesheet() {
  // Load all image paths from the directory
  const imageFiles = fs
    .readdirSync(imagesDir)
    .filter((file) => /\.(png|jpg|jpeg)$/i.test(file));

  // Load images and get dimensions
  const images = await Promise.all(
    imageFiles.map((file) => loadImage(path.join(imagesDir, file)))
  );

  if (images.length === 0) {
    console.log("No images found in the directory.");
    return;
  }

  // Assuming all logos are the same size, use the size of the first image
  // const logoWidth = images[0].width;
  // const logoHeight = images[0].height;
  const logoWidth = 40;
  const logoHeight = 40;
  console.log(logoWidth, logoHeight);

  // Calculate spritesheet dimensions
  const rows = Math.ceil(images.length / logosPerRow);
  const spritesheetWidth = logoWidth * logosPerRow;
  const spritesheetHeight = logoHeight * rows;

  // Create a canvas
  const canvas = createCanvas(spritesheetWidth, spritesheetHeight);
  const ctx = canvas.getContext("2d");

  // Initialize metadata array
  const metadata = [];

  // Draw each logo onto the canvas and add metadata
  images.forEach((img, index) => {
    console.log(">>>>>", JSON.parse(JSON.stringify(img)));

    const x = (index % logosPerRow) * logoWidth;
    const y = Math.floor(index / logosPerRow) * logoHeight;
    ctx.drawImage(img, x, y, logoWidth, logoHeight);

    // Add metadata for each logo
    metadata.push({
      filename: imageFiles[index],
      x: x,
      y: y,
      width: logoWidth,
      height: logoHeight,
    });
  });

  // Create a folder to save the spritesheet and metadata
  const folderName = path.join(__dirname, "resources");
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);

    }
  } catch (err) {
    console.error(err);
  }

  // Save the spritesheet to a file
  const outputPath = path.join(folderName, "spritesheet.png");
  const out = fs.createWriteStream(outputPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on("finish", () => console.log(`Spritesheet saved as ${outputPath}`));

  // Save the metadata to a JSON file
  const metadataPath = path.join(folderName, "metadata.json");
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`Metadata saved as ${metadataPath}`);
}

// Run the spritesheet generation function
createSpritesheet().catch(console.error);
