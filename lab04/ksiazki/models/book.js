module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
    return Book;
  };