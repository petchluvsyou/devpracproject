const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const getTravelSuggestions = require('../utils/ai');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Public
exports.getBookings = async (req, res, next) => {
  let query;

  if (req.user.role !== 'admin') {
    // General users can see only their bookings
    query = Booking.find({ user: req.user.id, isDeleted: false }).populate({
      path: 'provider',
      select: 'name province tel',
    });
  } else {
    // Admin can see all bookings
    if (req.params.providerId) {
      console.log(req.params.providerId);
      query = Booking.find({ provider: req.params.providerId }).populate({
        path: 'provider',
        select: 'name province tel',
      });
    } else {
      query = Booking.find().populate({
        path: 'provider',
        select: 'name province tel',
      });
    }
  }

  try {
    const bookings = await query;

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Cannot find bookings',
    });
  }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate({
      path: 'provider',
      select: 'name description tel',
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Cannot find booking',
    });
  }
};

// @desc    Add booking
// @route   POST /api/v1/providers/:providerId/booking
// @access  Private
exports.addBooking = async (req, res, next) => {
  try {
    req.body.provider = req.params.providerId;
    req.body.user = req.user.id;

    const provider = await Provider.findById(req.params.providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `No provider with the id of ${req.params.providerId}`,
      });
    }

    // Limit bookings
    const userBookingsCount = await Booking.countDocuments({
      user: req.user.id,
      isDeleted: false,
    });
    if (userBookingsCount >= 3) {
      return res.status(400).json({
        success: false,
        message: 'You can only have a maximum of 3 bookings.',
      });
    }

    // AI-based travel suggestions
    const travelSuggestions = await getTravelSuggestions(provider);

    const booking = await Booking.create(req.body);

    res.status(200).json({
      success: true,
      data: {
        booking,
        travelSuggestions,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Cannot create booking',
    });
  }
};

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Cannot update booking',
    });
  }
};

// @desc    Delete booking (soft delete)
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.isDeleted) {
      return res.status(404).json({
        success: false,
        message: `No active booking with the id of ${req.params.id}`,
      });
    }

    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }

    booking.isDeleted = true;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking has been marked as deleted',
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Cannot delete booking',
    });
  }
};

// @desc    Get past bookings (including deleted)
// @route   GET /api/v1/bookings/past
// @access  Private
exports.getPastBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate({
      path: 'provider',
      select: 'name province tel',
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Cannot retrieve past bookings',
    });
  }
};
