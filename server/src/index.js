// Load the private keys from server/.env (the file is never uploaded to GitHub).
try {
  process.loadEnvFile();
} catch {
  // No .env file: the server still starts, but database calls will fail.
}

const app = require("./app");

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(
    `http://localhost:${PORT}`
  );
});
