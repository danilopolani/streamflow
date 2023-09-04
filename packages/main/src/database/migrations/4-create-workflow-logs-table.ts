import { DataTypes, type QueryInterface } from 'sequelize';

export const up = async ({ context: sequelize }: { context: QueryInterface }) => {
	await sequelize.createTable('workflow_logs', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    workflowId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: 'workflows',
        },
        key: 'id',
      },
    },
    triggerId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: 'workflow_triggers',
        },
        key: 'id',
      },
    },
    variables: DataTypes.TEXT,
    error: DataTypes.TEXT,
    ranAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });

  await sequelize.addIndex('workflow_logs', ['workflowId']);
  await sequelize.addIndex('workflow_logs', ['triggerId']);
};

export const down = async ({ context: sequelize }: { context: QueryInterface }) => {
	await sequelize.dropTable('workflow_logs');
};
