require("dotenv").config();
const express = require("express");
const app = express();
const JWT = require("jsonwebtoken");
const verifyToken = require("./middleware/auth");

const PORT = process.env.PORT || 3000;
app.use(express.json());

// data
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

const posts = [
  {
    userId: 1,
    post: "Kai's Post",
  },
  {
    userId: 2,
    post: "Cai's post",
  },
  {
    userId: 2,
    post: "Chi's post",
  },
];

// app
app.get("/posts", verifyToken, (req, res) => {
  // res.status(200).json({ posts: "my posts" });
  return res
    .status(200)
    .json(posts.filter((post) => (post.userId === req.userId)));
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user) return res.sendStatus(401);

  // Create JWT
  const accessToken = JWT.sign(user, process.env.ACCESS_TOKEN_SECRET);
  return res.status(200).json({ accessToken });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
