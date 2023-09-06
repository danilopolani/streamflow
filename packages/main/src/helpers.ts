import { getQuickJS, shouldInterruptAfterDeadline } from 'quickjs-emscripten';
import type { WorkerMessage } from '~shared/WorkerMessage';
import { browserWindow } from './mainWindow';

export const inWorkerContext = () => process.argv[2] === '--work';

export const tellRenderer = (payload: Omit<WorkerMessage, 'forwardToRenderer'>) => {
  browserWindow?.webContents.send('messageToRenderer', payload);
};

export const tellMain = (subject: string, extra?: Partial<Omit<WorkerMessage, 'subject'>>) => {
  process.parentPort.postMessage({
    subject,
    ...extra,
  } as WorkerMessage);
};

export const compileTemplate = (value: string, args: { [key: string]: any }) => {
  for (const [variableName, variableValue] of Object.entries(args)) {
    value = value.replaceAll('{' + variableName + '}', variableValue);
  }

  return value;
};

export const execLambda = async (code: string) => {
  const QuickJS = await getQuickJS();

  const runtime = QuickJS.newRuntime();
  runtime.setInterruptHandler(shouldInterruptAfterDeadline(Date.now() + 1000));
  runtime.setMemoryLimit(1024 * 640);
  runtime.setMaxStackSize(1024 * 320);

  const context = runtime.newContext();
  const exec = context.evalCode(code);

  if (exec.error) {
    const errorText = context.dump(exec.error);

    exec.error.dispose();

    return Promise.reject(errorText);
  }

  const result = context.dump(exec.value);

  exec.value.dispose();
  context.dispose();
  runtime.dispose();

  return result;
};
