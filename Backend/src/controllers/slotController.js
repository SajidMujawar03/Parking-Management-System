import Slot from '../models/slot.model.js';
import Owner from '../models/owner.model.js';
// import Booking from '../models/booking.model.js';
// import Slot from '../models/slot.model.js';
// import User from '../models/user.model.js';

export const createSlot = async (req, res) => {
    try {
        const { photo, location, hourly_price, owner } = req.body;

        const newSlot = new Slot({
            photo,
            location,
            hourly_price,
            owner,
        });

        await newSlot.save();
        // Optionally, update the owner's slots array
        await Owner.findByIdAndUpdate(owner, { $push: { slots: newSlot._id } });

        return res.status(201).json({ message: 'Slot created successfully', slot: newSlot });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create slot', error: error.message });
    }
};



// Update an existing parking slot
// export const updateSlot = async (req, res) => {
//     try {
//         const { slotId } = req.params;
//         const { photo, location, hourly_price, status } = req.body;

//         const updatedSlot = await Slot.findByIdAndUpdate(
//             slotId,
//             { photo, location, hourly_price, status },
//             { new: true } // Return the updated document
//         ).populate('owner',"name email photo phone"); // Populate owner details if needed

//         if (!updatedSlot) {
//             return res.status(404).json({ message: 'Slot not found' });
//         }

//         return res.status(200).json({ message: 'Slot updated successfully', slot: updatedSlot });
//     } catch (error) {
//         return res.status(500).json({ message: 'Failed to update slot', error: error.message });
//     }
// };



// Delete a parking slot
export const deleteSlot = async (req, res) => {
    try {
        const { slotId } = req.params;

        // First, find and delete the slot
        const deletedSlot = await Slot.findByIdAndDelete(slotId);

        if (!deletedSlot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        // Optionally, remove the slot from the owner's slots array
        await Owner.findByIdAndUpdate(deletedSlot.owner, { $pull: { slots: slotId } });
        

        return res.status(200).json({ message: 'Slot deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete slot', error: error.message });
    }
};
