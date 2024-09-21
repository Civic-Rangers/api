import express from "express";

const router = express.Router();

router.get("/users", (req, res) => {
  res.send("Get all users");
});

router.post("/users", (req, res) => {
  res.send("Create a new user");
});

router.get("/users/:id", (req, res) => {
  res.send(`Get user with id ${req.params.id}`);
});

router.put("/users/:id", (req, res) => {
  res.send(`Update user with id ${req.params.id}`);
});

router.delete("/users/:id", (req, res) => {
  res.send(`Delete user with id ${req.params.id}`);
});

export default router;
