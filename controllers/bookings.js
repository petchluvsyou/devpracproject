const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

// @desc    Get all Bookings
// @route   GET /api/v1/Bookings
// @access  Public
exports.getBookings = async (req, res, next) => {
    let query;

    if (req.user.role !== 'admin') {
        // General users can see only their Bookings
        query = Booking.find({ user: req.user.id, isDeleted: false }).populate({
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
        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
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
        const booking = await Booking.findOne({ _id: req.params.id, isDeleted: false }).populate({
            path: 'Provider',
            select: 'name description tel'
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No Booking with the id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: booking
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

        const provider = await Provider.findById(req.params.ProviderId);

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: `No Provider with the id of ${req.params.ProviderId}`
            });
        }

        // limit bookings
        const userBookingsCount = await Booking.countDocuments({ user: req.user.id, isDeleted: false });

        if (userBookingsCount >= 3) {
            return res.status(400).json({
                success: false,
                message: "You can only have a maximum of 3 bookings."
            });
        }

        const booking = await Booking.create(req.body);

        res.status(200).json({
            success: true,
            data: booking
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
        let booking = await Booking.findOne({ _id: req.params.id, isDeleted: false });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No Booking with the id of ${req.params.id}`
            });
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this Booking`
            });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot update Booking"
        });
    }
};


// @desc    Delete Booking (Soft Delete)
// @route   DELETE /api/v1/Bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking || booking.isDeleted) {
            return res.status(404).json({
                success: false,
                message: `No active Booking with the id of ${req.params.id}`
            });
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this Booking`
            });
        }

        booking.isDeleted = true;
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking has been marked as deleted',
            data: booking
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot delete Booking"
        });
    }
};


// @desc    Get past Bookings including deleted
// @route   GET /api/v1/bookings/past
// @access  Private
exports.getPastBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }) // includes both deleted & non-deleted
            .populate({
                path: 'Provider',
                select: 'name province tel'
            });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot retrieve past bookings'
        });
    }
};