import mongoose from "mongoose";

const leaseSchema = new mongoose.Schema({
    rentItems: [
        {
            name: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            price: {
                type: String,
                required: true
            },
            apartment: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Apartment',
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registLease: {
        phone: String,
        description: String
    },
    payment: {
        paymentMethod: String,
        paymentResult: {
            appartmentID: String,
            payerID: String,
            paymentID: String,
        }
    },
    isPaid:{
        type: Boolean,
        required: true,
        default: true
    },
    itemsPrice: Number,
    isRent: {
        type: Boolean,
        required: true,
        default: false
    },
    isConfirm: {
        type: Boolean,
        required: true,
        default: false
    },
    confirmAt: Date,
    paidAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
}, {
    timestamps: true
});

const Lease = mongoose.model('Lease', leaseSchema);

export default Lease;