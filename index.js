const http = require("http");
const fs = require("fs");
const path = require("node:path");
const hostname = "127.0.0.1";
const port = 4800;

const server = http.createServer((req, res) => {
  // Set the response header to JSON for API responses
  res.setHeader("Content-Type", "application/json");
  console.log(req.method, req.url);

  // Routing logic
  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Welcome to the home page!" }));
  } else if (req.method === "GET" && req.url === "/spritesheet") {
    const pngPath = path.join(__dirname, "spritesheet.png");
    const jsonPath = path.join(__dirname, "metadata.json");

    // Check if both files exist before reading
    if (fs.existsSync(pngPath) && fs.existsSync(jsonPath)) {
      // Read the PNG file
      const pngFile = fs.readFileSync(pngPath);
      // Read the JSON file
      const jsonFile = fs.readFileSync(jsonPath, "utf8");

      // Set response headers for JSON and PNG boundary
      res.statusCode = 200;
      res.setHeader("Content-Type", "multipart/mixed; boundary=--boundary");

      // Send a multipart response with both PNG and JSON content
      res.write("--boundary\r\n");
      res.write("Content-Type: image/png\r\n\r\n");
      res.write(pngFile);
      res.write("\r\n--boundary\r\n");
      res.write("Content-Type: application/json\r\n\r\n");
      res.write(jsonFile);
      res.write("\r\n--boundary--\r\n");

      res.end();
    } else {
      // Handle undefined routes
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
