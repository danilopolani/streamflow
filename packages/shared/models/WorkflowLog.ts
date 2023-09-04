import type { Workflow } from './Workflow';
import type { WorkflowTrigger } from './WorkflowTrigger';

export type WorkflowLog = {
  id: number
  workflowId: string
  workflow: Workflow
  triggerId: string
  trigger: WorkflowTrigger
  variables: object
  error: string|null
  ranAt: string|null
  createdAt: string
}
