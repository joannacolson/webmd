'use strict';
module.exports = function(sequelize, DataTypes) {
    var disease = sequelize.define('disease', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        isTerminal: DataTypes.BOOLEAN,
        severity: DataTypes.INTEGER,
        transmission: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.disease.belongsToMany(models.symptom, { through: models.disease_symptom });

            }
        }
    });
    return disease;
};
