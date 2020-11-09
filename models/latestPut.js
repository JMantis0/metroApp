// Creating our User model
module.exports = function(sequelize, DataTypes) {
  const LatestPut = sequelize.define("LatestPut", {
    latestPut: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  });

  return LatestPut;
};
