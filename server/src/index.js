
const app = require("./app");

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(
    `http://localhost:${PORT}`
  );
});
