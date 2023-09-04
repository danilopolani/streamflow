import { Workflow } from './models/Workflow';
import { WorkflowAction } from './models/WorkflowAction';
import { WorkflowTrigger } from './models/WorkflowTrigger';
import { WorkflowLog } from './models/WorkflowLog';
import { migrator } from './db';
import { log } from '../logger';

export const initDatabase = async (runMigrations = true) => {
  if (runMigrations) {
    await migrator.up();
  }

  // Define relationships here to avoid circular dependencies
  Workflow.hasMany(WorkflowAction, {
    onDelete: 'CASCADE',
    hooks: true,
    as: 'actions',
  });

  WorkflowAction.belongsTo(Workflow);

  Workflow.hasMany(WorkflowTrigger, {
    onDelete: 'CASCADE',
    hooks: true,
    as: 'triggers',
  });

  WorkflowTrigger.belongsTo(Workflow);

  Workflow.hasMany(WorkflowLog, {
    onDelete: 'CASCADE',
    hooks: true,
    as: 'logs',
    foreignKey: 'workflowId',
  });

  WorkflowLog.belongsTo(Workflow, { as: 'workflow' });
  WorkflowLog.belongsTo(WorkflowTrigger, { as: 'trigger' });

  log.info('%c[Database] %cInitialized', 'color: cyan', 'color: unset');
};
