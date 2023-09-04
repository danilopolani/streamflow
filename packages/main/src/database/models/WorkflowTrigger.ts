import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import { Workflow } from './Workflow';

class WorkflowTrigger extends Model {
  declare id: string;
  declare workflowId: string;
  declare isDisabled: boolean;
  declare title: string|null;
  declare order: number;
  declare trigger: string;
  declare options: object;
}

WorkflowTrigger.init({
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
  isDisabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  title: DataTypes.STRING,
  order: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  trigger: {
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
  tableName: 'workflow_triggers',
  indexes: [
    { fields: ['workflowId'] },
  ],
});

export { WorkflowTrigger };
