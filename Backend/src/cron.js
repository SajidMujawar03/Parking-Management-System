import Slot from "./models/slot.model.js";
import Owner from "./models/owner.model.js";
import cron from "node-cron";

export const cleanupExpiredSlots = cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();

    // Step 1: Find all expired slots
    const expiredSlots = await Slot.find({ expiry_date: { $lte: now } });

    if (expiredSlots.length === 0) {
      console.log("No expired slots found.");
      return;
    }

    // Step 2: Delete each expired slot and update the corresponding owner
    for (const slot of expiredSlots) {
      const slotId = slot._id;

      // Remove the slot from the Slot collection
      await Slot.findByIdAndDelete(slotId);

      // Remove the slot reference from the Owner model
      const ownerId = slot.owner; // Assuming slot has an `owner` field referring to the owner's ID
      if (ownerId) {
        await Owner.findByIdAndUpdate(ownerId, {
          $pull: { slots: slotId },
        });
      }

      console.log(`Expired slot ${slotId} deleted and removed from owner ${ownerId}.`);
    }
  } catch (error) {
    console.error("Error during expired slot cleanup:", error);
  }
});
