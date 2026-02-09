const express = require("express");
const {
  createIssue,
  listIssues,
  deleteIssue,
  updateIssueStatus,
} = require("../controllers/issueController");

const router = express.Router();

router.get("/", listIssues);
router.post("/", createIssue);
router.delete("/:id", deleteIssue);
router.patch("/:id/status", updateIssueStatus);

module.exports = router;
