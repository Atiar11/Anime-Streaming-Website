import mongoose from "mongoose";
import Wishlist from "../models/wishlist.model.js";

// --- MOCK IN-MEMORY STORAGE ---
const mockWishlistStore = new Map(); // key: userId, value: wishlistItems array
// -----------------------------

// Add item to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const wishlistItem = req.body;
    const { userId, productId } = wishlistItem;

    // --- MOCK MODE FALLBACK ---
    if (mongoose.connection.readyState !== 1) {
      console.log("Database not connected. Using Mock Mode for adding to wishlist.");
      if (!mockWishlistStore.has(userId)) {
        mockWishlistStore.set(userId, []);
      }
      const existing = mockWishlistStore.get(userId).find(item => item.productId === productId);
      if (existing) {
        return res.status(400).json({ message: "Item already exists in wishlist" });
      }
      const newMockItem = { ...wishlistItem, _id: "mock-wish-" + Date.now() };
      mockWishlistStore.get(userId).push(newMockItem);
      return res.status(201).json({ message: "Item added to wishlist successfully", wishlistData: newMockItem });
    }
    // --- END MOCK MODE ---

    // Check if wishlist item already exists
    const existingWishlistItem = await Wishlist.findOne({ userId, productId });

    if (existingWishlistItem) {
      return res
        .status(400)
        .json({ message: "Item already exists in wishlist" });
    }

    // If wishlist item does not exist, save it
    const wishlistData = new Wishlist(wishlistItem);
    await wishlistData.save();
    res
      .status(201)
      .json({ message: "Item added to wishlist successfully", wishlistData });
  } catch (err) {
    console.error("Error adding item to wishlist: ", err);
    res.status(400).json({ message: "Failed to add item to wishlist" });
  }
};

// Get item from wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.params.userId;

    // --- MOCK MODE FALLBACK ---
    if (mongoose.connection.readyState !== 1) {
      console.log("Database not connected. Using Mock Mode for fetching wishlist.");
      return res.status(200).json({ wishlistItems: mockWishlistStore.get(userId) || [] });
    }
    // --- END MOCK MODE ---

    const wishlistItems = await Wishlist.find({ userId });
    res.status(200).json({ wishlistItems });
  } catch (err) {
    console.error("Error fetching wishlist items: ", err);
    res.status(500).json({ message: "Failed to get wishlist items" });
  }
};

// Remove item from wishlist
export const removeWishlistItem = async (req, res) => {
  try {
    const productId = req.params.productId;

    // --- MOCK MODE FALLBACK ---
    if (mongoose.connection.readyState !== 1) {
      console.log("Database not connected. Using Mock Mode for removing from wishlist.");
      for (const [userId, items] of mockWishlistStore.entries()) {
        const index = items.findIndex(item => item._id === productId);
        if (index !== -1) {
          const removed = items.splice(index, 1)[0];
          return res.status(200).json({ productData: removed });
        }
      }
      return res.status(404).json({ message: "Wishlist Item not found" });
    }
    // --- END MOCK MODE ---

    const productData = await Wishlist.findByIdAndDelete(productId);

    if (!productData) {
      return res.status(404).json({
        status: "fail",
        message: "Wishlist Item not found",
      });
    }
    res.status(200).json({ productData });
  } catch (err) {
    console.error("Error deleting wishlist items: ", err);
    res.status(500).json({ message: "Failed to delete wishlist items" });
  }
};
