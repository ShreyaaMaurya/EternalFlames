const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    }, 
    login: [
       {  
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        loginAt: {
            type: Date,
            default: Date.now()
        }
    }
    ],
});
const Customer = mongoose.model('Customer', customerSchema)
module.exports = Customer;
