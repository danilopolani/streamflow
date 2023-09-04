export type WorkflowAction = {
  id: string
  workflowId: string
  orderPreviousId: string|null
  isDisabled: boolean
  title: string|null
  action: string
  options: object
}
