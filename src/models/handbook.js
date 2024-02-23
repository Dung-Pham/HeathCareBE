'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Handbook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  };
  Handbook.init({
    name: DataTypes.STRING,
    contentHtml: DataTypes.TEXT('long'),
    contentHandbook: DataTypes.TEXT('long'),
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Handbook',
  });
  return Handbook;
};