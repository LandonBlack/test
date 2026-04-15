const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const validateEntry = require("../middleware/validateEntry");

const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem
} = require("../controllers/noteController");

// CREATE (protected + validated)
router.post("/", auth, validateEntry, createItem);

// READ
router.get("/", getAllItems);

// UPDATE
router.put("/:id", updateItem);

// DELETE
router.delete("/:id", deleteItem);

module.exports = router;