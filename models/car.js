// A Car has a number, volume, and model column.
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
    keyz: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  return Car;
};
