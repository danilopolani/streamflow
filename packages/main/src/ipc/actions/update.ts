import { WorkflowAction } from '/@/database/models/WorkflowAction';
import type { BaseData } from '~shared/actions/baseData';

export default async function workflowActionUpdate(_event: Electron.IpcMainInvokeEvent, id: string, baseValues: BaseData, optionValues: object): Promise<void> {
  (await WorkflowAction.findByPk(id))?.update({
    title: baseValues.title,
    options: optionValues,
  });
}
