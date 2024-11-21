import Slot from "./models/slot.model.js";
import Owner from "./models/owner.model.js"
import cron from "node-cron"


export const  a=cron.schedule('* * * * * ', () => {
    console.log('Running a task every minute');
    // Your logic here
  });
