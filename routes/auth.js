const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
  updateUser,
} = require("../controllers/auth");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", logout);
router.put("/:id", protect, authorize("admin", "user"), updateUser);

module.exports = router;
