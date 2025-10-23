'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lead.init({
    user_id: DataTypes.UUID,
    created_time: DataTypes.DATE,
    form_name: DataTypes.STRING,
    service_requested: DataTypes.STRING,
    description: DataTypes.TEXT,
    email: DataTypes.STRING,
    full_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    post_code: DataTypes.STRING,
    lead_status: DataTypes.STRING,
    source: DataTypes.STRING,
    raw_payload: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Lead',
  });
  return Lead;
};