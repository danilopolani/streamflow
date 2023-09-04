import log from 'electron-log/main';

if (import.meta.env.PROD) {
  log.transports.console.level = false;
  Object.assign(console, log.functions);
} else {
  log.transports.file.level = false;
}

log.transports.console.useStyles = true;

export { log };
