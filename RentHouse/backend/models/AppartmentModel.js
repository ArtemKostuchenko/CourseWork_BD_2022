import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        rating: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 5,
        },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);


const apartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    countRooms: {
        type: String,
        required: true
    },
    totalArea: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    totalAction: {
        type: String,
        required: true
    },
    numberApartment: {
        type: Number,
        required: true
    },
    furnitureAvailability: {
        type: String,
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    multimedia: {
        type: String,
        required: true
    },
    householdAppliances: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    Characteristics: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 1
    },
    numReviews: {
        type: Number,
        required: true,
        default: 1
    },
    StockIn: {
        type: Boolean,
        required: true,
        default: false
    },
    reviews: [reviewSchema]
});

const Apartment = mongoose.model('Apartment', apartmentSchema);

export default Apartment;