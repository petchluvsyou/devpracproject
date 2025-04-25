const Provider = require("../models/Provider");
const Booking = require('../models/Booking');

// @desc    Get all providers
// @route   GET /api/v1/providers
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
    query = Provider.find(JSON.parse(queryStr)).populate('bookings');

    // Select fields
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

    const providers = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: providers.length,
      pagination,
      data: providers,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Error fetching providers",
    });
  }
};

// @desc    Get single provider
// @route   GET /api/v1/providers/:id
// @access  Public
exports.getProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `No provider found with ID ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Error fetching provider",
    });
  }
};

// @desc    Create new provider
// @route   POST /api/v1/providers
// @access  Private
exports.createProvider = async (req, res, next) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json({
      success: true,
      message: "Created new provider",
      data: provider,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Failed to create provider",
    });
  }
};

// @desc    Update provider
// @route   PUT /api/v1/providers/:id
// @access  Private
exports.updateProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `No provider found with ID ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Failed to update provider",
    });
  }
};

// @desc    Delete provider
// @route   DELETE /api/v1/providers/:id
// @access  Private
exports.deleteProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `No provider found with ID ${req.params.id}`,
      });
    }

    // Delete all bookings related to this provider
    await Booking.deleteMany({ provider: req.params.id });

    // Delete the provider itself
    await Provider.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Provider and related bookings deleted",
      data: {},
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Failed to delete provider",
    });
  }
};
