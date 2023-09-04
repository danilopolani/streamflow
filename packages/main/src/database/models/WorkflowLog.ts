import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import { Workflow } from './Workflow';
import { WorkflowTrigger } from './WorkflowTrigger';

class WorkflowLog extends Model {
  declare id: number;
  declare workflowId: string;
  declare triggerId: string;
  declare workflow: Workflow;
  declare trigger: WorkflowTrigger;
  declare variables: object;
  declare error: string | null;
  declare ranAt: string | null;
}

WorkflowLog.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  workflowId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Workflow,
    },
  },
  triggerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: WorkflowTrigger,
    },
  },
  variables: {
    type: DataTypes.TEXT,
    allowNull: true,

    get() {
      return JSON.parse(this.getDataValue('variables'));
    },

    set(value: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      this.setDataValue('variables', JSON.stringify(value));
    },
  },
  error: DataTypes.TEXT,
  ranAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: 'workflow_logs',
  indexes: [
    { fields: ['workflowId'] },
    { fields: ['triggerId'] },
  ],
});

export { WorkflowLog };
