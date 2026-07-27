const mongoose = require('mongoose');

const propertySchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['plot', 'flat_sale', 'house_rent'],
    },
    title: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
      index: true, // For faster filtering
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Available', 'Sold', 'Rented', 'Hold'],
      default: 'Available',
    },
    owner_name: {
      type: String,
      required: true,
    },
    owner_contact: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    specific_details: {
      // Dynamic fields like size for plots, or BHK for flats
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
