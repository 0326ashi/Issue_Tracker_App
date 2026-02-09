const express = require("express");
const {
  createIssue,
  getIssue,
  listIssues,
  deleteIssue,
  updateIssueStatus,
  updateIssue,
} = require("../controllers/issueController");

const router = express.Router();

router.get("/", listIssues);
router.get("/:id", getIssue);
router.post("/", createIssue);
router.delete("/:id", deleteIssue);
router.patch("/:id", updateIssue);
router.patch("/:id/statusedit", updateIssueStatus);

module.exports = router;
