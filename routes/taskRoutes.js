const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();


// ===================== GET =====================
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.status(200).json({ message: "Your tasks", data: tasks });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});


// ===================== POST =====================
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "title is required" });
    }

    const task = await Task.create({
      userId: req.userId,
      title,
      description: description || ""
    });

    return res.status(201).json({
      message: "Task created",
      data: task
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});


// ===================== PUT =====================
router.put("/:id", auth, validateObjectId, async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json({
      message: "Task updated",
      data: updated
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});


// ===================== DELETE =====================
router.delete("/:id", auth, validateObjectId, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json({
      message: "Task deleted",
      data: { id: deleted._id }
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;