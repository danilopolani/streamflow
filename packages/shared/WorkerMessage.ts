export type WorkerMessage = {
  subject: string
  message?: string
  details?: string
  shouldNotify?: boolean
  forwardToRenderer?: boolean
}
