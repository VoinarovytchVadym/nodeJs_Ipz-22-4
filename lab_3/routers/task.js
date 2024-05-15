const express = require("express");
const Task = require("./../models/task");
const router = new express.Router();

router.post("/", async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).send("Task not found");
            return;
        }
        res.json(task);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            res.status(404).send("Task not found");
            return;
        }
        res.json(task);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).send("Task not found");
            return;
        }
        res.json(task);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete("/", async (req, res) => {
    try {
        const result = await Task.deleteMany();
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
