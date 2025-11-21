import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema({
  index: { type: Number },
  timestamp: { type: Date },
  data: { type: Object },
  previousHash: { type: String },
  hash: { type: String }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 1 = Manufacturer, 2 = Retailer, 3 = Consumer
  status: { type: Number, required: true },

  // Wallet balance
  balance: { type: Number, default: 0 },

  // ----- Makeshift blockchain (NOT USED, ONLY STORED) -----
  chainVersion: { type: Number, default: 1 },
  dummyGenesisHash: { type: String, default: "0000GENESISHASH0000" },
  lastBlockHash: { type: String, default: "0000GENESISHASH0000" },

  // User-specific blockchain ledger (not used anywhere)
  blocks: {
    type: [BlockSchema],
    default: [
      {
        index: 0,
        timestamp: new Date(),
        data: { message: "Genesis Block" },
        previousHash: "0",
        hash: "0000GENESISHASH0000"
      }
    ]
  }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);

