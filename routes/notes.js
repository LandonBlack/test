const express = require("express");
const router = express.Router();
const Note = require("/models/Note");
const validateObjectId = require("../middleware/validateObjectId");

// POST: create/save a note
router.post("/", async (req, res) => {
  try {
    const newNote = await Note.create(req.body);
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: retrieve all notes
router.get('/', async (req, res) => {
  try {
    let sortOption = {};

    if (req.query.sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (req.query.sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (req.query.sort === 'title') {
      sortOption = { title: 1 };
    }

    const notes = await Note.find().sort(sortOption);

    res.status(200).json({
      success: true,
      data: notes
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

router.put("/:id", auth, validateObjectId, updateTask);
router.delete("/:id", auth, validateObjectId, deleteTask);

module.exports = router;