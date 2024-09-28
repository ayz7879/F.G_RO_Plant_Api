import express from "express";
import {
  addJar,
  deleteJarById,
  getAllJar,
  getJarById,
  updateJarById,
} from "../Controllers/Jar.js";

const router = express.Router();

// add Jar
router.post("/addJar", addJar);

//get all jar
router.get("/getAllJar", getAllJar);

//get jar by id
router.get("/:id", getJarById);

//update jar by id
router.put("/:id", updateJarById);

//delete jar by id
router.delete("/:id", deleteJarById);

export default router;
