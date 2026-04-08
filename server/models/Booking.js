import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";
import Show from "./Show.js";

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    showId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    bookedSeats: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paymentLink: {
      type: DataTypes.STRING(1000),
    },
  },
  {
    timestamps: true,
    tableName: "Bookings",
  }
);

Booking.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });

Booking.belongsTo(Show, { foreignKey: "showId", as: "show" });
Show.hasMany(Booking, { foreignKey: "showId", as: "bookings" });

export default Booking;
