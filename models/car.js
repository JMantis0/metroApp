// Creating our User model
module.exports = function(sequelize, DataTypes) {
  const Car = sequelize.define("Car", {
    num: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    volume: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // The email cannot be null, and must be a proper email before creation
    heavy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    keyz: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    flashers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    clear: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  return Car;
};
