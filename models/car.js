// Creating our User model
module.exports = function(sequelize, DataTypes) {
  const Car = sequelize.define("Car", {
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // The email cannot be null, and must be a proper email before creation
    heavy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    keys: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    flashers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    empty: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  return Car;
};
