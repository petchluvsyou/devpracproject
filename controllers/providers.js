const Provider = require("../models/Provider");
const Booking = require('../models/Booking');

// @desc    Get all Providers
// @route   GET /api/v1/Providers
// @access  Public
exports.getProviders = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Provider.find(JSON.parse(queryStr)).populate('Bookings');


    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Provider.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const providers = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: providers.length,
        pagination,
        data: providers
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

// @desc    Get single Provider
// @route   GET /api/v1/Providers/:id
// @access  Public
exports.getProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (!Provider) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

// @desc    Create new Provider
// @route   POST /api/v1/Providers
// @access  Private
exports.createProvider = async (req, res, next) => {
  const provider = await Provider.create(req.body);
  res
    .status(201)
    .json({ success: true, msg: "Create new Providers", data: provider });
};

// @desc    Update Provider
// @route   PUT /api/v1/Providers/:id
// @access  Private
exports.updateProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!Provider) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

// @desc    Delete Provider
// @route   DELETE /api/v1/Providers/:id
// @access  Private
exports.deleteProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
          success: false,
          message: `Provider not found with id of ${req.params.id}`
      });
  }

     // Delete all Bookings related to this Provider
     await Booking.deleteMany({ Provider: req.params.id });

     // Delete the Provider itself
     await Provider.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};