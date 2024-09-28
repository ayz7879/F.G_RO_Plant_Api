import Jar from "../Models/Jar.js";

//add jar
export const addJar = async (req, res) => {
  const {
    jarsGiven,
    jarsTaken,
    customerPay,
    totalAmount,
    pendingJars,
    pendingPayment,
    totalJarsGiven,
    totalJarsTaken,
  } = req.body;
  try {
    let jar = await Jar.create({
      jarsGiven,
      jarsTaken,
      customerPay,
      totalAmount,
      pendingJars,
      pendingPayment,
      totalJarsGiven,
      totalJarsTaken,
    });
    res.json({ message: "Jar Added Succesfully", success: true, jar });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//get all jars
export const getAllJar = async (req, res) => {
  try {
    let jars = await Jar.find().sort({ createdAt: -1 });

    if (jars.length === 0) {
      return res.status(404).json({
        message: "No Jars Available",
        success: false,
      });
    }
    res.status(200).json({
      message: "Jars Retrieved Successfully",
      success: true,
      jars,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving Jars",
      success: false,
      error: error.message,
    });
  }
};
 
//get jar by id
export const getJarById = async (req, res) => {
  const id = req.params.id;
  try {
    let jars = await Jar.findById(id);

    if (!jars) {
      return res.status(404).json({
        message: "Invalid Id",
        success: false,
      });
    }
    res.status(200).json({
      message: "Specific Jar",
      success: true,
      jars,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error specific Jars",
      success: false,
      error: error.message,
    });
  }
};

//update jar by id
export const updateJarById = async (req, res) => {
  const id = req.params.id;
  try {
    let jars = await Jar.findByIdAndUpdate(id, req.body, { new: true });

    if (!jars) {
      return res.status(404).json({
        message: "Invalid Id",
        success: false,
      });
    }
    res.status(200).json({
      message: "Updated Specific Jar",
      success: true,
      jars,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error update specific Jars",
      success: false,
      error: error.message,
    });
  }
};

//delete jar by id
export const deleteJarById = async (req, res) => {
  const id = req.params.id;
  try {
    let jars = await Jar.findByIdAndDelete(id);

    if (!jars) {
      return res.status(404).json({
        message: "Invalid Id",
        success: false,
      });
    }
    res.status(200).json({
      message: "Deleted Specific Jar",
      success: true,
      jars,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error update specific Jars",
      success: false,
      error: error.message,
    });
  }
};
