import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Movie = sequelize.define(
  "Movie",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    poster_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    backdrop_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    release_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    original_language: {
      type: DataTypes.STRING,
    },
    tagline: {
      type: DataTypes.STRING,
    },
    genres: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    casts: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    vote_average: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    runtime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "Movies",
  }
);

export default Movie;
