// migrations/upgradeSlotSchema.js
import mongoose from 'mongoose';
import Slot from './src/models/slot.model.js'

import dotenv from "dotenv"
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB for migration.');

    // Set a default expiry date (e.g., one year from now) for existing slots
    const defaultExpiryDate = new Date();
    defaultExpiryDate.setFullYear(defaultExpiryDate.getFullYear() + 1);

    // Update all documents to include the new expiry_date field
    await Slot.updateMany(
      { expiry_date: { $exists: false } }, // Only update documents that don't already have this field
      { $set: { expiry_date: defaultExpiryDate } } // Add expiry_date field with the default value
    );

    console.log('Added "expiry_date" field with default value.');

    // Close the connection
    mongoose.connection.close();
    console.log('Migration completed and connection closed.');
  })
  .catch(err => {
    console.error('Migration failed:', err);
    mongoose.connection.close();
  });
