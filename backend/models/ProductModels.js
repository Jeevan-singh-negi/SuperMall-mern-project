import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes whitespace from both ends of a string
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    images: [ // An array to store multiple image URLs (from Cloudinary later)
      {
        public_id: { // Cloudinary public ID for easy deletion/management
          type: String,
          required: true,
        },
        url: { // The actual URL of the image
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: true,
      // You might add an enum here later for predefined categories
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0, // Stock cannot be negative
    },
    // We'll link products to their merchants (users with 'merchant' role)
    // We'll create the User model soon.
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to the 'User' model (which we'll define)
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;