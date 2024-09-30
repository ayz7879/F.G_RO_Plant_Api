import Customer from "../Models/Customer.js";

// Add New Customer
export const addCustomer = async (req, res) => {
  const { name, address, phone, advancePaid, jarDeposit, pricePerJar, capsuleDeposit } =
    req.body;
  try {
    const existingCustomer = await Customer.findOne({ phone });

    if (existingCustomer) {
      return res.status(400).json({
        message: "Customer already exists",
        success: false,
      });
    }

    const customer = new Customer({
      name,
      address,
      phone,
      advancePaid,
      jarDeposit,
      capsuleDeposit: parseInt(capsuleDeposit, 10),
      pricePerJar,
    });

    await customer.save();
    res.status(201).json({
      message: "Customer Added Successfully",
      success: true,
      customer,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Customer
export const getAllCustomer = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });

    if (customers.length === 0) {
      return res.status(404).json({
        message: "No Customers Available",
        success: false,
      });
    }

    res.status(200).json({
      message: "Customers Retrieved Successfully",
      success: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving customers",
      success: false,
      error: error.message,
    });
  }
};

// Update Customer
export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, advancePaid, jarDeposit, pricePerJar, capsuleDeposit } = req.body;

  try {
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
        success: false,
      });
    }

    customer.name = name || customer.name;
    customer.address = address || customer.address;
    customer.phone = phone || customer.phone;
    customer.advancePaid = advancePaid || customer.advancePaid;
    customer.jarDeposit = jarDeposit || customer.jarDeposit;
    customer.capsuleDeposit = parseInt(capsuleDeposit, 10) || customer.capsuleDeposit;
    customer.pricePerJar = pricePerJar || customer.pricePerJar;

    await customer.save();
    res.status(200).json({
      message: "Customer updated successfully",
      success: true,
      customer,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating customer",
      success: false,
      error: error.message,
    });
  }
};

// Delete Customer
export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error deleting customer",
      success: false,
      error: error.message,
    });
  }
};
