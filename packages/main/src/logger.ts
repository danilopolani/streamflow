import log from 'electron-log/main';
import { redactSecrets } from './helpers';

if (import.meta.env.PROD) {
  log.transports.console.level = false;

  // Redact private envs
  log.hooks.push((message) => {
    message.data = message.data.map((value: string) => redactSecrets(value));

    return message;
  });

  Object.assign(console, log.functions);
} else {
  log.transports.file.level = false;
}

log.transports.console.useStyles = true;

export { log };
