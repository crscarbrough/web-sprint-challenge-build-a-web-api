// Write your "projects" router here!
const Projects = require("./projects-model");
const express = require("express");
const router = express.Router();
const { validateProjectId, validateProject } = require("./projects-middleware");

router.get("/", (req, res, next) => {
  Projects.get()
    .then((project) => {
      res.status(200).json(project);
    })
    .catch(next);
});

router.get("/:id", validateProjectId, (req, res) => {
  res.status(200).json(req.params);
});

router.post("/", validateProject, (req, res, next) => {
  const newProject = req.body;
  Projects.insert(newProject)
    .then((newProject) => {
      res.status(201).json(newProject);
    })
    .catch(next);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  if (!req.body.name || !req.body.description) {
    res
      .status(400)
      .json({ message: "The project with the specified ID does not exist" });
  } else {
    Projects.update(id, req.body)
      .then((success) => {
        res.status(400).json(success);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
});

router.delete("/:id", validateProjectId, async (req, res, next) => {
  try {
    await Projects.remove(req.params.id);
    res.json(res.Projects);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/actions", validateProjectId, async (req, res, next) => {
  Projects.getProjectActions(req.params.id)
    .then((actions) => {
      if (actions.length > 0) {
        res.status(200).json(actions);
      } else {
        res.status(400).json(actions);
      }
    })
    .catch(next);
});

module.exports = router;
