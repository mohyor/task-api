const {
 createTask,
 updateTask,
 getTaskById,
 getTasks,
 deleteTask,
} = require("../../../controllers/task");

const router = require("express").Router();

router
 .post('/', createTask)

 .put('/', updateTask)

 .get("/", getTasks)

 .get("/:taskID", getTaskById)

 .delete('/:taskID', deleteTask)

module.exports = router;
