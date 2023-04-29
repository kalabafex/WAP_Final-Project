"use strict";

const express = require("express");
const userController = require("../controllers/userController");

const route = express.Router();

route.get("/", userController.getAll);
route.post("/", userController.save);
route.put("/", userController.edit);
route.get("/:id", userController.findById);
route.delete("/:id", userController.delete);

module.exports = route;
