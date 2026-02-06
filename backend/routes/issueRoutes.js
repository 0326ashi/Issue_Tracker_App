const express = require("express");
const { createIssue, listIssues } = require("../controllers/issueController");

const router = express.Router();

router.get("/", listIssues);
router.post("/", createIssue);

module.exports = router;
