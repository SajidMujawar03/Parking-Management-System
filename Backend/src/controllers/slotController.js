import Slot from '../models/slot.model.js';
import Owner from '../models/owner.model.js';
import Booking from '../models/booking.model.js';
// import Slot from '../models/slot.model.js';
// import User from '../models/user.model.js';

export const createSlot = async (req, res) => {
    try {
        const { photo, address, hourly_price, owner,coordinates: { latitude, longitude },expiry_date } = req.body;

        const newSlot = new Slot({
            photo,
            hourly_price,
            longitude,
            latitude,
            address,
            owner,
            expiry_date
        });
        const user=await Owner.findById(owner);
        if(!user)
        {
            console.log(req.body)
            return res.status(404).json({success:false, message: 'user not found' });
        }

        

        if (!user.bankAccount || !user.ifscCode) {
            return res.status(400).json({
              success: false,
              message: 'Slot creation is allowed only if the owner has provided bank account and IFSC code.',
            });
          }

        await newSlot.save();

        // Optionally, update the owner's slots array
        await Owner.findByIdAndUpdate(owner, { $push: { slots: newSlot._id } });
        console.log("success")
        return res.status(201).json({success:true, message: 'Slot created successfully', slot: newSlot });
    } catch (error) {
        // console.log(error.message)
        console.log(error)
        return res.status(500).json({success:false, message: 'Failed to create slot'});
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
        const  slotId  = req.params.id;

        const activeBookings = await Booking.find({ slot: slotId, endTime: { $gt: new Date() } });

        // First, find and delete the slot
        if (activeBookings.length > 0) {
            return res.status(400).json({success:false, message: 'Slot is currently booked and cannot be deleted.' });
          }

          await Owner.findByIdAndUpdate(req.user.id, {
            $pull: { slots: slotId },  // Remove the slot ID from the owner's slots array
          });
      
          // Delete the slot if no active bookings
          await Slot.findByIdAndDelete(slotId);
          res.status(200).json({success:true, message: 'Slot deleted successfully.' });
        } catch (error) {


            console.log(error)
          res.status(500).json({success:false, message: 'Server error.' });
        }
};

export const getSlot=async(req,res)=>{
    const id=req.params.id;
    try {

        console.log(id)
        const slot=await Slot.findById(id);
        if(slot==null)
            res.status(404).json({success:false,message:"Slot Not Found"});

        // console.log(slot)
        res.status(200).json({success:true,message:"Slot Found",data:slot});

    } catch (error) {
        
    }
}


export const getAllSlots = async (req, res) => {
    try {
        const slots = await Slot.find({}).populate('owner', 'name phone') ; 


        return res.status(200).json({slots}); 
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get slots', error: error.message });
    }
};


