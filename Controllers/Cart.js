import Cart from "../Models/Cart.js";
import Customer from "../Models/Customer.js";
import moment from "moment";

// Add to cart
export const addToCart = async (req, res) => {
  const {
    customerId,
    jarsGiven = 0,
    jarsTaken = 0,
    customerPay = 0,
  } = req.body;


  const capsulesGiven = parseInt(req.body.capsulesGiven, 10) || 0
  const capsulesTaken = parseInt(req.body.capsulesTaken, 10) || 0


  try {
    // Get the customer details to fetch price per jar
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Customer not found", success: false });
    }

    const pricePerJar = customer.pricePerJar;

    // Find the cart for the user or create a new one
    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      cart = new Cart({ customerId, item: [] });
    }

    // Calculate totals from existing cart
    let totalJarsGiven =
      cart.item.reduce((total, item) => total + item.jarsGiven, 0) + jarsGiven;

    let totalCapsulesGiven = cart.item.reduce((total, item) => total + item.capsulesGiven, 0) + capsulesGiven;

    let totalJarsTaken =
      cart.item.reduce((total, item) => total + item.jarsTaken, 0) + jarsTaken;

    let totalCapsulesTaken =
      cart.item.reduce((total, item) => total + item.capsulesTaken, 0) + capsulesTaken;

    // Calculate pending jars
    const pendingJars = totalJarsGiven - totalJarsTaken;
    const pendingCapsules = totalCapsulesGiven - totalCapsulesTaken;

    const totalCustomerPaid =
      cart.item.reduce((total, item) => total + item.customerPay, 0) +
      customerPay;
    // Calculate the total amount based on totalJarsGiven
    const totalGiven = totalJarsGiven + totalCapsulesGiven
    const totalAmount = totalGiven * pricePerJar;

    // Calculate pending payment as total amount minus customer pay
    const pendingPayment = totalAmount - totalCustomerPaid;

    // Create the jar object with calculated values and add the current date
    const jar = {
      jarsGiven,
      capsulesGiven,
      jarsTaken,
      capsulesTaken,
      customerPay,
      totalCustomerPaid,
      totalAmount,
      pendingJars,
      pendingCapsules,
      pendingPayment,
      totalJarsGiven,
      totalCapsulesGiven,
      totalJarsTaken,
      totalCapsulesTaken,
      date: new Date(), // Add the current date and time for this cart item
    };

    // Add the jar object to the cart's items array
    cart.item.push(jar);

    // Save the updated cart
    await cart.save();


    res.json({ message: "Item Added To Cart", success: true, cart, customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Customer cart
export const customerCart = async (req, res) => {
  const { customerId } = req.params;
  try {
    // Find customer by ID
    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.json({ message: "Customer Not Found", success: false });

    // Find the cart for this customer
    let cart = await Cart.findOne({ customerId });
    if (!cart) return res.json({ message: "Cart Not Found", success: false });

    // Return the customer and cart data
    res.json({
      message: "Customer Cart Retrieved Successfully",
      success: true,
      cart,
      customer,
    });
  } catch (error) {
    // Return an error message
    res.status(500).json({ message: error.message, success: false });
  }
};

// Update Cart Item
export const updateCartItem = async (req, res) => {
  const { customerId } = req.params; // Dynamically getting customerId from params
  const { id } = req.params;
  const {
    jarsGiven,
    jarsTaken,
    customerPay,
    totalCustomerPaid,
    totalAmount,
    pendingJars,
    pendingPayment,
    totalJarsGiven,
    totalJarsTaken,
    capsulesGiven,
    capsulesTaken,
    totalCapsulesGiven,
    totalCapsulesTaken,
    pendingCapsules
  } = req.body;

  console.log(req.body)
  try {

    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }

    const itemToUpdate = cart.item.id(id);
    if (!itemToUpdate) {
      return res
        .status(404)
        .json({ message: "Item not found", success: false });
    }

    // Update the item with the new values
    itemToUpdate.jarsGiven = jarsGiven;
    itemToUpdate.capsulesGiven = capsulesGiven;
    itemToUpdate.jarsTaken = jarsTaken;
    itemToUpdate.capsulesTaken = capsulesTaken;
    itemToUpdate.customerPay = customerPay;
    itemToUpdate.totalCustomerPaid = totalCustomerPaid;
    itemToUpdate.totalAmount = totalAmount;
    itemToUpdate.pendingJars = pendingJars;
    itemToUpdate.pendingPayment = pendingPayment;
    itemToUpdate.totalJarsGiven = totalJarsGiven;
    itemToUpdate.totalJarsTaken = totalJarsTaken;
    itemToUpdate.totalCapsulesGiven = totalCapsulesGiven;
    itemToUpdate.totalCapsulesTaken = totalCapsulesTaken;
    itemToUpdate.pendingCapsules = pendingCapsules;

    await cart.save();
    // console.log(cart)

    res.json({
      message: "Cart item updated and totals recalculated successfully",
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Cart Item
export const deleteCartItem = async (req, res) => {
  const { customerId, id } = req.params;

  try {
    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }

    const itemExists = cart.item.some((item) => item._id.toString() === id);
    if (!itemExists) {
      return res
        .status(404)
        .json({ message: "Item not found", success: false });
    }
    cart.item = cart.item.filter((item) => item._id.toString() !== id);

    let totalJarsGiven = cart.item.reduce(
      (total, item) => total + item.jarsGiven,
      0
    );
    let totalJarsTaken = cart.item.reduce(
      (total, item) => total + item.jarsTaken,
      0
    );
    const pendingJars = totalJarsGiven - totalJarsTaken;

    const customer = await Customer.findById(customerId);
    const totalAmount = totalJarsGiven * customer.pricePerJar;

    const totalCustomerPay = cart.item.reduce(
      (total, item) => total + item.customerPay,
      0
    );
    const pendingPayment = totalAmount - totalCustomerPay;

    cart.totalJarsGiven = totalJarsGiven;
    cart.totalJarsTaken = totalJarsTaken;
    cart.pendingJars = pendingJars;
    cart.totalAmount = totalAmount;
    cart.pendingPayment = pendingPayment;

    await cart.save();

    res.json({
      message: "Cart item deleted and totals updated successfully",
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Valid Carts
export const getAllCarts = async (req, res) => {
  try {
    // Fetch all carts from the database and populate customerId
    const carts = await Cart.find().populate("customerId");

    // Filter out carts with invalid or non-existing customerId
    const validCarts = carts.filter(
      (cart) => cart.customerId !== null && cart.customerId !== undefined
    );

    // Optional: Ensure the customer exists in the database
    const validCartsWithValidCustomer = await Promise.all(
      validCarts.map(async (cart) => {
        const customerExists = await Customer.findById(cart.customerId._id);
        return customerExists ? cart : null;
      })
    );

    // Remove any null entries (carts with invalid customers)
    const finalValidCarts = validCartsWithValidCustomer.filter(
      (cart) => cart !== null
    );

    res.json({
      message: "Valid customer carts retrieved successfully",
      success: true,
      carts: finalValidCarts,
    });


  } catch (error) {
    console.error("Error retrieving all carts:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};





import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

// Get All Valid Carts with Dynamic Filters
export const getAllCartsForDashbord = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const today = new Date();

    // Set up date filters
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const thisMonthStart = startOfMonth(today);
    const thisMonthEnd = endOfMonth(today);

    // Define date range based on request or default to null
    const from = startDate ? startOfDay(new Date(startDate)) : todayStart;
    const to = endDate ? endOfDay(new Date(endDate)) : todayEnd;

    // Fetch carts within the specified or default date range and populate customerId
    const carts = await Cart.find({
      "item.date": { $gte: from || todayStart, $lte: to || todayEnd }
    }).populate("customerId");

    
    // Filter carts to ensure each has a valid customer
    const validCarts = await Promise.all(
      carts
        .filter(cart => cart.customerId)
        .map(async (cart) => {
          const customerExists = await Customer.findById(cart.customerId._id);
          return customerExists ? cart : null;
        })
    ).then(carts => carts.filter(cart => cart !== null));


    // Initialize stats object with zeros
    const stats = {
      today: {
        jarsGiven: 0,
        jarsTaken: 0,
        capsulesGiven: 0,
        capsulesTaken: 0,
        customerPay: 0, // Add customerPay field
      },
      thisMonth: {
        jarsGiven: 0,
        jarsTaken: 0,
        capsulesGiven: 0,
        capsulesTaken: 0,
        customerPay: 0, // Add customerPay field
      },
      customRange: {
        jarsGiven: startDate && endDate ? 0 : undefined, // Set to undefined if no date is provided
        jarsTaken: startDate && endDate ? 0 : undefined,
        capsulesGiven: startDate && endDate ? 0 : undefined,
        capsulesTaken: startDate && endDate ? 0 : undefined,
        customerPay: startDate && endDate ? 0 : undefined, // Add customerPay field
      }
    };



    // Calculate today's stats, this month's stats, and custom range stats
    validCarts.forEach(cart => {
      cart.item.forEach(cartItem => {
        const cartDate = new Date(cartItem.date);
        const updateStats = (target) => {
          target.jarsGiven += cartItem.jarsGiven || 0;
          target.jarsTaken += cartItem.jarsTaken || 0;
          target.capsulesGiven += cartItem.capsulesGiven || 0;
          target.capsulesTaken += cartItem.capsulesTaken || 0;
          target.customerPay += cartItem.customerPay || 0; // Add customerPay to the stats
        };

        // Update today’s stats if within today's range
        if (cartDate >= todayStart && cartDate <= todayEnd) {
          updateStats(stats.today);
        }

        // Update this month’s stats if within this month's range
        if (cartDate >= thisMonthStart && cartDate <= thisMonthEnd) {
          updateStats(stats.thisMonth);
        }

        // Update custom range stats for the filtered date range
        if (from && to && cartDate >= from && cartDate <= to) {
          updateStats(stats.customRange);
        }
      });
    });


    // Send final response
    res.json({
      message: "Valid customer carts retrieved successfully",
      success: true,
      carts: validCarts,
      stats,
    });
  } catch (error) {
    console.error("Error retrieving all carts:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};
//   try {
//     const { startDate, endDate } = req.query;

//     console.log(req.query)
//     const today = new Date();

//     // Set up date filters
//     const todayStart = startOfDay(today);
//     const todayEnd = endOfDay(today);
//     const thisMonthStart = startOfMonth(today);
//     const thisMonthEnd = endOfMonth(today);

//     // Define date range based on request or default to today
//     const from = startDate ? new Date(startDate) : todayStart;
//     const to = endDate ? new Date(endDate) : todayEnd;

//     // Fetch carts within the specified or default date range and populate customerId
//     const carts = await Cart.find({
//       "item.date": { $gte: from, $lte: to }
//     }).populate("customerId");

//     // Filter carts to ensure each has a valid customer
//     const validCarts = await Promise.all(
//       carts
//         .filter(cart => cart.customerId)
//         .map(async (cart) => {
//           const customerExists = await Customer.findById(cart.customerId._id);
//           return customerExists ? cart : null;
//         })
//     ).then(carts => carts.filter(cart => cart !== null));

//     // Aggregate stats
//     const stats = {
//       today: {
//         jarsGiven: 0,
//         jarsTaken: 0,
//         capsulesGiven: 0,
//         capsulesTaken: 0,
//       },
//       thisMonth: {
//         jarsGiven: 0,
//         jarsTaken: 0,
//         capsulesGiven: 0,
//         capsulesTaken: 0,
//       },
//       customRange: {
//         jarsGiven: 0,
//         jarsTaken: 0,
//         capsulesGiven: 0,
//         capsulesTaken: 0,
//       }
//     };
//     console.log('today date s', todayStart)
//     console.log('today date e', todayEnd)
//     console.log('thisMonthStart', thisMonthStart)
//     console.log('thisMonthEnd', thisMonthEnd)

//     // Calculate today's stats, this month's stats, and custom range stats
//     validCarts.forEach(cart => {
//       cart.item.forEach(cartItem => {
//         const cartDate = new Date(cartItem.date);
//         const updateStats = (target) => {
//           target.jarsGiven += cartItem.jarsGiven || 0;
//           target.jarsTaken += cartItem.jarsTaken || 0;
//           target.capsulesGiven += cartItem.capsulesGiven || 0;
//           target.capsulesTaken += cartItem.capsulesTaken || 0;
//         };

//         console.log('cartDate', cartDate)
//         // Update today’s stats if within today's range
//         if (cartDate >= todayStart && cartDate <= todayEnd) {
//           updateStats(stats.today);
//         }

//         // Update this month’s stats if within this month's range
//         if (cartDate >= thisMonthStart && cartDate <= thisMonthEnd) {
//           updateStats(stats.thisMonth);
//         }

//         // Update custom range stats for the filtered date range
//         if (cartDate >= from && cartDate <= to) {
//           updateStats(stats.customRange);
//         }
//       });
//     });

//     console.log(stats)

//     // Send final response
//     res.json({
//       message: "Valid customer carts retrieved successfully",
//       success: true,
//       carts: validCarts,
//       stats,
//     });
//   } catch (error) {
//     console.error("Error retrieving all carts:", error);
//     res.status(500).json({ message: error.message, success: false });
//   }
// };








