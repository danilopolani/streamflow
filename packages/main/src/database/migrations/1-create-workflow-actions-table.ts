import { DataTypes, type QueryInterface } from 'sequelize';

export const up = async ({ context: sequelize }: { context: QueryInterface }) => {
	await sequelize.createTable('workflow_actions', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    orderPreviousId: DataTypes.CHAR(36),
    isDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    title: DataTypes.STRING,
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });

  await sequelize.addIndex('workflow_actions', ['workflowId']);
};

export const down = async ({ context: sequelize }: { context: QueryInterface }) => {
	await sequelize.dropTable('workflow_actions');
};
