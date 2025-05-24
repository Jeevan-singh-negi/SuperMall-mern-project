import jwt from 'jsonwebtoken';

// Function to generate a JSON Web Token (JWT)
const generateToken = (id) => {
  // Sign the token with the user's ID and a secret key
  // The secret key should be a strong, random string stored in .env
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

export default generateToken;