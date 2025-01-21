const Package = require('../models/package');
const Driver = require('../models/driver');
const firebase_db = require('../firebase')

/**
 * Generate a unique package ID
 * 
 * @function generatePackageID
 * @returns {string} A unique package ID in the format PXX-JN-XXX
 */
function generatePackageID() {
    const randomChars = () => String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randomDigits = () => Math.floor(100 + Math.random() * 900).toString();
    const initials = "JN"
    
    return `P${randomChars()}-${initials}-${randomDigits()}`;
}

let deletedCount = 0;


module.exports = {

    //insert a new Package 
    /**
     * This function is used to insert a new package
     * 
     * @function insertPackage
     * @param {object} req
     * @param {object} res
     * @returns {void}
     * 
     */

    insertPackage: async (req, res) => {
        try {

            // check if the driver exists
            const driver = await Driver.findById(req.body.driver_id);
            if (!driver) {
                res.status(400).json({
                    "error": "Driver not found"
                });
                return;
            }

            let packageNew = new Package({
                package_id: generatePackageID(),
                package_title: req.body.package_title,
                package_weight: req.body.package_weight,
                package_destination: req.body.package_destination,
                description: req.body.description,
                driver_id: req.body.driver_id,
                isAllocated: req.body.isAllocated
            });

            //add package to driver
            driver.assigned_packages.push(packageNew._id);
            await driver.save();
            let result = await packageNew.save();

            firebase_db.countCrudeOperations("insert");
            
            res.status(200).json({
                "id": result._id,
                "package_id": result.package_id
            });
        } catch(error){
            console.log(error)
            res.status(400).send("Driver not found");
        }
    },


    /**
     * 
     * @function listAllPackages
     * @param {*} req 
     * @param {*} res 
     * @returns {void}
     * 
     */
    //list all packages
    listAllPackages: async(req, res) => {
        console.log("list all packages");
        let result = await Package.find();
        firebase_db.countCrudeOperations("retrieve");
        res.status(200).json(result);
    },

    //delete package by id 

    deletePackageByID : async(req, res) => {
        try {
            //delete all packahes assigned to driver
            const packageId = req.params.id;
            console.log(packageId)
            const packageToDelete = await Package.findByIdAndDelete(packageId)
            const deleteAssignedPackages = await Driver.findByIdAndUpdate(packageToDelete.driver_id, { $pull: { assigned_packages: packageId } });
            await deleteAssignedPackages.save();
            firebase_db.countCrudeOperations("delete");
            
            res.status(200).json({
                "acknowledged": packageToDelete ? true : false,
                "deletedCount" : packageToDelete ?  1 : 0
            });
            deletedCount++;
        } catch (error) {
            console.log(error)
            res.status(400).json({
                "acknowledged" : false,
                "deletedCount" : 0
            })
        }
    },

    updatePackageDestinationByID : async(req, res) => {
        const packageId = req.body.package_id;
        try {
            const packageToUpdate = await Package.findById(packageId);
            packageToUpdate.package_destination = req.body.package_destination
            const result = await packageToUpdate.save();
            firebase_db.countCrudeOperations("update");
            res.status(200).json({
                "status": "updated sucessfully"
            })
        } catch(error) {
            res.status(400).json({
                "status" : "ID is not found"
            });
        }
    }
}



