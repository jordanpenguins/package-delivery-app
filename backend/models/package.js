const mongoose = require('mongoose');

let packageSchema = new mongoose.Schema({
    package_id: {
        type: String,
        required: false
    },
    package_title: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 3 && v.length <= 15
            },
            message: 'Name must be between 3 to 15 characters long'
        }
    },
    package_weight: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return v > 0
            },
            message: 'Weight must be greater than 0'
        }
    },
    package_destination: {
        type: String,
        required: true,
        validate : {
            validator: function(v) {
                return v.length >= 5 && v.length <= 15
            },
            message: 'Destination must be between 5 to 15 characters'
        }
    },
    description: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return v.length >= 0 && v.length <= 30
            },
            message: 'Description must be between 0 to 30 characters long'
        }
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now()
    },
    isAllocated: {
        type: Boolean,
        required: true,
        default: false
    },
    driver_id: {
        type: String,
        required: true,
    }


});


module.exports = mongoose.model('Package', packageSchema);
