import { Op } from "sequelize";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import Movie from "../models/Movie.js";

// API to check if user is an admin
export const isAdmin = async (req, res) => {
  res.json({ success: true, isAdmin: true });
};

// API to get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ where: { isPaid: true } });
    const activeShows = await Show.findAll({
      where: { showDateTime: { [Op.gte]: new Date() } },
      include: [{ model: Movie, as: "movie" }],
    });

    const totalUser = await User.count();

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all shows
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.findAll({
      where: { showDateTime: { [Op.gte]: new Date() } },
      include: [{ model: Movie, as: "movie" }],
      order: [["showDateTime", "ASC"]],
    });

    res.json({ success: true, shows });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: "user" },
        {
          model: Show,
          as: "show",
          include: [{ model: Movie, as: "movie" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
