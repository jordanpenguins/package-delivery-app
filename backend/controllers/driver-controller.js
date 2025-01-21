
const Driver = require('../models/driver');
const Package = require('../models/package');
const firebase_db = require('../firebase')
const { ObjectId } = require('mongodb');

/**
 * Generate a unique driver ID
 * 
 * @function generateDriverID
 * @returns {string} A unique driver ID in the format DXX-33-XXX
 */
function generateDriverID(){
    // generate 2 random digits
    const digits = Math.floor(Math.random() * 90 + 10).toString();
    const studentIDtwoDigits = "33"
    const randomLetters = Array.from({ length: 3 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
    const id = `D${digits}-${studentIDtwoDigits}-${randomLetters}`;
    return id
  }

let deletedCount = 0;


module.exports = {
    // insert driver
    /**
     * This function is used to insert a new driver
     * 
     * @function insertDriver
     * @param {object} req
     * @param {object} res
     * @returns {void}
     * 
     */
    insertDriver: async (req, res) => {
        try {
            let driver = new Driver({
                driver_id: generateDriverID(),
                driver_name: req.body.driver_name,
                driver_department: req.body.driver_department,
                driver_licence: req.body.driver_licence,
                driver_isActive: req.body.driver_isActive
            });
            console.log(driver);
            let result = await driver.save();

            // increament insert count by 1
            firebase_db.countCrudeOperations("insert");


            res.status(200).json({
                "id": result._id,
                "driver_id": result.driver_id
            });
        } catch (error) {
            res.status(400).send(error);
        }
    },

    // list all drivers

    /**
     * This function is used to list all the drivers
     * 
     * @function listAllDrivers
     * @param {object} req
     * @param {object} res
     * @returns {void}
     * 
     * 
     */

    listAllDrivers: async(req ,res) => {
        let result = await Driver.find().populate('assigned_packages').exec();
        // increament retrieve count by 1
        firebase_db.countCrudeOperations("retrieve");   
        res.status(200).json(result);
    },

    // delete driver by id 
    deleteDriverByID : async(req, res) => {
        try {
            //delete all packahes assigned to driver
            const driverId = req.query.id;
            const driverToDelete = await Driver.findById(driverId);
            console.log(driverToDelete)
            // delete all the packages that are assigned to the driver 
            const deletePackagesResult = await Package.deleteMany({ driver_id: new ObjectId(driverToDelete._id)});
            const deleteDriver = await driverToDelete.deleteOne();

            // increament delete count by 1
            firebase_db.countCrudeOperations("delete");

            res.status(200).json({
                "acknowledged": true,
                "deletedCount" : 1
            });

            deletedCount++;


        } catch (error) {
            console.log(error);
            res.status(400).json({
                "acknowledged" :  false,
                "deletedCount" : 0
            });
        }
    },

    /**
     * This function is used to update the driver licence and department by id
     * 
     * @function updateDriverlicenceAndDepartmentByID
     * @param {object} req
     * @param {object} res
     * @returns {void}
     * 
     * 
     */

    //Update driver licence and department by id
    updateDriverlicenceAndDepartmentByID : async(req, res) => {
        // find the driverr by id 
        console.log("update")
        const driverMongoID = req.body.id;
        try {
            const driverToUpdate = await Driver.findById(driverMongoID);
            driverToUpdate.driver_department = req.body.driver_department.toLowerCase();
            driverToUpdate.driver_licence = req.body.driver_licence;
            const result = await driverToUpdate.save();

            // increament update count by 1
            firebase_db.countCrudeOperations("update");


            res.status(200).json({
            "status" : "Driver Updated Successfully"
            });
        } catch(error){
            res.status(400).json({
                "status" : "ID not found"
            })
           
        }
    }



}