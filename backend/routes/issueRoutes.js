const express = require("express");
const {
  createIssue,
  getIssue,
  listIssues,
  deleteIssue,
  updateIssueStatus,
} = require("../controllers/issueController");

const router = express.Router();

router.get("/", listIssues);
router.get("/:id", getIssue);
router.post("/", createIssue);
router.delete("/:id", deleteIssue);
router.patch("/:id/status", updateIssueStatus);

module.exports = router;
