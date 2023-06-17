const app = require("./app");
const { PORT } = require("./secret");

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT} `);
});
