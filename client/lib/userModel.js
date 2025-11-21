import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Number, required: true }, // 1 = Manufacturer, 2 = Retailer, 3 = Consumer
  balance: { type: Number, default: 0 }, // Manufacturers can add any amount
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
