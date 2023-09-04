export type WorkflowTrigger = {
  id: string
  workflowId: string
  isDisabled: boolean
  title: string|null
  order: number
  trigger: string
  options: object
}
