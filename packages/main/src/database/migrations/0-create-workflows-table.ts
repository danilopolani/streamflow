import { DataTypes, type QueryInterface } from 'sequelize';

export const up = async ({ context: sequelize }: { context: QueryInterface }) => {
	await sequelize.createTable('workflows', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    isDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    skipsQueue: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
};

export const down = async ({ context: sequelize }: { context: QueryInterface }) => {
	await sequelize.dropTable('workflows');
};
