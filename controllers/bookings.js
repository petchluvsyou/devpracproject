const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

// @desc    Get all Bookings
// @route   GET /api/v1/Bookings
// @access  Public
exports.getBookings = async (req, res, next) => {
    let query;

    if (req.user.role !== 'admin') {
        // General users can see only their Bookings
        query = Booking.find({ user: req.user.id }).populate({
            path: 'Provider',
            select: 'name province tel'
        });
    } else {// If you are an admin, you can see all!
        if (req.params.ProviderId) {
            console.log(req.params.ProviderId);
            query = Booking.find({ Provider: req.params.ProviderId }).populate({
                path: 'Provider',
                select: 'name province tel',
            });
        } else {
            query = Booking.find().populate({
                path: 'Provider',
                select: 'name province tel',
            });
        }
    }

    try {
        const Bookings = await query;

        res.status(200).json({
            success: true,
            count: Bookings.length,
            data: Bookings
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot find Booking"
        });
    }
};

// @desc    Get single Booking
// @route   GET /api/v1/Bookings/:id
// @access  Public
exports.getBooking = async (req, res, next) => {
    try {
        const Booking = await Booking.findById(req.params.id).populate({
            path: 'Provider',
            select: 'name description tel'
        });

        if (!Booking) {
            return res.status(404).json({
                success: false,
                message: `No Booking with the id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: Booking
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot find Booking"
        });
    }
};


// @desc    Add Booking
// @route   POST /api/v1/Providers/:ProviderId/Booking
// @access  Private
exports.addBooking = async (req, res, next) => {
    try {
        req.body.Provider = req.params.ProviderId;

        const Provider = await Provider.findById(req.params.ProviderId);

        if (!Provider) {
            return res.status(404).json({
                success: false,
                message: `No Provider with the id of ${req.params.ProviderId}`
            });
        }

        const Booking = await Booking.create(req.body);

        res.status(200).json({
            success: true,
            data: Booking
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot create Booking"
        });
    }
};

// @desc    Update Booking
// @route   PUT /api/v1/Bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
    try {
        let Booking = await Booking.findById(req.params.id);

        if (!Booking) {
            return res.status(404).json({
                success: false,
                message: `No Booking with the id of ${req.params.id}`
            });
        }

        // Make sure the user is the Booking owner or an admin
        if (Booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this Booking`
            });
        }

        Booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: Booking
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot update Booking"
        });
    }
};

// @desc    Delete Booking
// @route   DELETE /api/v1/Bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
    try {
        const Booking = await Booking.findById(req.params.id);

        if (!Booking) {
            return res.status(404).json({
                success: false,
                message: `No Booking with the id of ${req.params.id}`
            });
        }

        // Make sure the user is the Booking owner or an admin
        if (Booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this Booking`
            });
        }

        await Booking.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot delete Booking"
        });
    }
};