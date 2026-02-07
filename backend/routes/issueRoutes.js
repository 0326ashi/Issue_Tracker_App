const express = require("express");
const {
  createIssue,
  listIssues,
  deleteIssue,
} = require("../controllers/issueController");

const router = express.Router();

router.get("/", listIssues);
router.post("/", createIssue);
router.delete("/:id", deleteIssue);

module.exports = router;
