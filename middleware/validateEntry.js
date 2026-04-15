function validateEntry(req, res, next) {
  const { title, body } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "title is required" });
  }

  if (!body || body.trim() === "") {
    return res.status(400).json({ error: "body is required" });
  }

  next();
}

module.exports = validateEntry;
