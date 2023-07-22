const express = require("express");
const notes = express.Router();
const { readFromFile, readAndAppend, writeToFile } = require("../utils/fsUtils");
const uuid = require("../utils/uuid");

// GET Route for retrieving all the notes
notes.get("/", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST Route for adding a new UX/UI note
notes.post("/", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`The notes have been successfully added`);
  } else {
    res.status(400).json({ error: "Error in adding note" });
  }
});

// DELETE route for deleting a note
notes.delete("/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);
      writeToFile("./db/db.json", result);
      res.json(`Note ${noteId} has been deleted `);
    })
    .catch((err) => {
      res.status(500).json({ error: "Error deleting note" });
    });
});

module.exports = notes;
