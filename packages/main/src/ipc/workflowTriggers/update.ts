import { WorkflowTrigger } from '/@/database/models/WorkflowTrigger';
import type { BaseData } from '~shared/triggers/baseData';

export default async function workflowTriggerUpdate(_event: Electron.IpcMainInvokeEvent, id: string, baseValues: BaseData, optionValues: object): Promise<void> {
  (await WorkflowTrigger.findByPk(id))?.update({
    title: baseValues.title,
    options: optionValues,
  });
}
