// codegen:start {preset: barrel, include: '*.ts', exclude: 'index.ts', import: star, export: {name: migrations, keys: path}}

import * as _0CreateWorkflowsTable from './0-create-workflows-table';
import * as _1CreateWorkflowActionsTable from './1-create-workflow-actions-table';
import * as _2CreateSettingsTable from './2-create-settings-table';
import * as _3CreateWorkflowTriggersTable from './3-create-workflow-triggers-table';
import * as _4CreateWorkflowLogsTable from './4-create-workflow-logs-table';

export const migrations = {
 './0-create-workflows-table': _0CreateWorkflowsTable,
 './1-create-workflow-actions-table': _1CreateWorkflowActionsTable,
 './2-create-settings-table': _2CreateSettingsTable,
 './3-create-workflow-triggers-table': _3CreateWorkflowTriggersTable,
 './4-create-workflow-logs-table': _4CreateWorkflowLogsTable,
};

// codegen:end
