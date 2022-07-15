const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/posts", (req, res) => {
  res.status(200).json({ posts: "my posts" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
