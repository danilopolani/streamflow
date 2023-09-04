import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import { Workflow } from './Workflow';

class WorkflowAction extends Model {
  declare id: string;
  declare workflowId: string;
  declare orderPreviousId: string|null;
  declare isDisabled: boolean;
  declare title: string|null;
  declare action: string;
  declare options: object;
}

WorkflowAction.init({
  id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  workflowId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Workflow,
    },
  },
  orderPreviousId: DataTypes.UUID,
  isDisabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  title: DataTypes.STRING,
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  options: {
    type: DataTypes.TEXT,
    allowNull: true,

    get() {
      return JSON.parse(this.getDataValue('options'));
    },

    set(value: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      this.setDataValue('options', JSON.stringify(value));
    },
  },
}, {
  sequelize,
  tableName: 'workflow_actions',
  indexes: [
    { fields: ['workflowId'] },
  ],
});

export { WorkflowAction };
