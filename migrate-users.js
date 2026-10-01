import mongoose from "mongoose";
import User from "./models/User.js";
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function migrateUsers() {
  await connectDB();
  const users = await User.find({ shortUserId: { $exists: false } });
  for (const user of users) {
    let isUnique = false;
    let shortUserId;
    while (!isUnique) {
      shortUserId = Math.floor(100000 + Math.random() * 900000).toString();
      const existingId = await User.findOne({ shortUserId });
      if (!existingId) isUnique = true;
    }
    user.shortUserId = shortUserId;
    await user.save();
    console.log(`Updated user ${user.email} with shortUserId ${shortUserId}`);
  }
  console.log("Migration completed.");
  process.exit(0);
}

migrateUsers();
