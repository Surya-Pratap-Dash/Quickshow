import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Movie from "./Movie.js";

const Show = sequelize.define(
  "Show",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    movieId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    showDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    showPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    occupiedSeats: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    timestamps: true,
    tableName: "Shows",
  }
);

Show.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });
Movie.hasMany(Show, { foreignKey: "movieId", as: "shows" });

export default Show;
