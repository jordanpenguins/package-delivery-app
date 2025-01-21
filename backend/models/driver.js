const mongoose  = require('mongoose');


let driverSchema = new mongoose.Schema({
    driver_id: {
        type: String,
        required: false,
        

    },
    driver_name: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 3 && v.length <= 20
            },
            message: 'Name must be between 3 to 20 characters long'
        }
        
    },
    driver_department: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                const formatString =  v.toLowerCase()
                return formatString === 'food' || formatString === 'furniture' || formatString === 'electronic'
            },
            message: 'Department must be food, furniture or electronic'
        }
    },
    driver_licence: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length === 5
            },
            message: 'Licence must be 5 characters long'
        }

    },
    driver_isActive: {
        type: Boolean,
        required: true,
        

    },
    driver_createdAt: {
        type: Date,
        required: false,
        default: Date.now()
    },
    assigned_packages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    }]
});

module.exports = mongoose.model('driver', driverSchema);
    
