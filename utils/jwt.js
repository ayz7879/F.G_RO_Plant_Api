import jwt from "jsonwebtoken";

const secretKey = "@ayz123"; 

export const generateToken = (admin) => {
  return jwt.sign({ id: admin._id }, secretKey);
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};
