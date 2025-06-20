import express from "express";

const router = express.Router();

// Users routes
router.get("/", (req, res) => {
  // TODO: Implement get all users
  res.json({ message: "Get all users" });
});

router.get("/:id", (req, res) => {
  // TODO: Implement get user by id
  res.json({ message: `Get user ${req.params.id}` });
});

router.put("/:id", (req, res) => {
  // TODO: Implement update user
  res.json({ message: `Update user ${req.params.id}` });
});

router.delete("/:id", (req, res) => {
  // TODO: Implement delete user
  res.json({ message: `Delete user ${req.params.id}` });
});

export default router;
