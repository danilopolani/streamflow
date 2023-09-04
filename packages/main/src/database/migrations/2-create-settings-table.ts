import { DataTypes, type QueryInterface } from 'sequelize';

export const up = async ({ context: sequelize }: { context: QueryInterface }) => {
	await sequelize.createTable('settings', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    value: DataTypes.TEXT,
  });
};

export const down = async ({ context: sequelize }: { context: QueryInterface }) => {
	await sequelize.dropTable('settings');
};
