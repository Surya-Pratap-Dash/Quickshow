import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";
import Movie from "./Movie.js";

const Favorite = sequelize.define(
  "Favorite",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    movieId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "Favorites",
  }
);

User.hasMany(Favorite, { foreignKey: "userId", as: "favorites" });
Favorite.belongsTo(User, { foreignKey: "userId", as: "user" });

Movie.hasMany(Favorite, { foreignKey: "movieId", as: "favorites" });
Favorite.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });

export default Favorite;