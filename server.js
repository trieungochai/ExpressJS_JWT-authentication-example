require("dotenv").config();
const express = require("express");
const app = express();
const JWT = require("jsonwebtoken");

const PORT = process.env.PORT || 3000;
app.use(express.json());

const users = [
  {
    id: 1,
    username: "Kai",
  },
  {
    id: 2,
    username: "Cai",
  },
];

app.get("/posts", (req, res) => {
  res.status(200).json({ posts: "my posts" });
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  const user = users.find((user) => user.username === username);
  console.log(user);

  if (!user) return res.sendStatus(401);

  // Create JWT
  const accessToken = JWT.sign(user, process.env.ACCESS_TOKEN_SECRET);
  return res.status(200).json({ accessToken });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
