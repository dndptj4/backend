const app = require("./express-app");

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
