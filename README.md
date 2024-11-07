# Spritesheet Generator Tool

This tool takes a set of images in a directory and creates a spritesheet and produces a JSON metadata file. The more relevant one is metadata which contains coordinates and sizes of images in spritesheet, which is helpful in further rendering of sprites.

### Features

- Consolidates all the images found in a particular foldder into one spritesheet.
- Creates metadata about each image – where the file name is stored, the position of the image within the spritesheet, and its size.
- The spritesheet image and the metadata JSON are uploaded to an S3 bucket with a GitHub Action when the new commit is poshed to the main branch.

### Installation

1. **Clone the Repository**

   ```bash
   git clone git@github.com:sossargsyan/spritesheet-generator.git
   ```

2. **Navigate to your project directory**

   ```bash
   cd spritesheet-generator
   ```

3. **Install Dependencies**

      ```bash
      npm install
      ```

### Usage

1. **Prepare the Images:**
   - Save the images, which you want to be displayed, in the logos folder in the root of the project.
   - The size of each sprite can be changed from the `logoWidth` and `logoHeight` attributes of the script.
  
2. **Run the Script:**
   - Execute the following command to create the spritesheet image and metadata JSON locally:
     ```bash
     node index.js
     ```

3. **Output Files:**
   - The executed script generates two files in the `resources` folder:
     - `resources`: The combined spritesheet containing all images in a grid format.
     - `metadata.json`: SON metadata with details about each image's filename, position, and dimensions in the spritesheet.

4. **Automatic S3 Upload:**
   - When changes are pushed to the `main` branch, GitHub Actions will automatically:
     - Run the script to generate spritesheet.png and metadata.json.
     - Upload these files to the specified S3 bucket. They will be publicly accessible.


