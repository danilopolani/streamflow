import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import { type WorkflowAction } from './WorkflowAction';
import { type WorkflowTrigger } from './WorkflowTrigger';

class Workflow extends Model {
  declare id: string;
  declare isDisabled: boolean;
  declare skipsQueue: boolean;
  declare name: string;
  declare options: object;
  declare actions: WorkflowAction[];
  declare triggers: WorkflowTrigger[];
}

Workflow.init({
  id: {
    type: DataTypes.UUIDV4,
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
  options: {
    type: DataTypes.STRING,
    allowNull: true,

    get() {
      return JSON.parse(this.getDataValue('options') || null);
    },

    set(value: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      this.setDataValue('options', JSON.stringify(value));
    },
  },
}, {
  sequelize,
  tableName: 'workflows',
});

export { Workflow };
