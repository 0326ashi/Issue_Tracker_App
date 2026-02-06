const Issue = require("../models/issue");

const mapIssue = (issue) => ({
  id: issue._id,
  title: issue.title,
  description: issue.description,
  status: issue.status,
  priority: issue.priority,
  severity: issue.severity,
  createdAt: issue.createdAt,
});

//Create a new Issue
const createIssue = async (req, res) => {
  const { title, description, priority, severity } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required." });
  }

  const issue = await Issue.create({
    title,
    description,
    priority,
    severity,
  });

  return res.status(201).json({ issue: mapIssue(issue) });
};

//List all Issues
const listIssues = async (_req, res) => {
  const issues = await Issue.find().sort({ createdAt: -1 });
  return res.json({ issues: issues.map(mapIssue) });
};

module.exports = {
  createIssue,
  listIssues,
};
