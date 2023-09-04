import runWorkflow from '/@/workflows/run';

export default function workflowRun(_event: Electron.IpcMainInvokeEvent, workflowId: string): Promise<void> {
  return runWorkflow(workflowId);
}
