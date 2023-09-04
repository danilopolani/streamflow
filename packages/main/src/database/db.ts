import { app } from 'electron';
import path from 'node:path';
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { migrations } from './migrations';
import { inWorkerContext } from '../helpers';
import { log } from '../logger';

// If we're in a Worker context, retrieve DB path from envs
const dbPath = inWorkerContext() ? process.env.DB_BASEPATH! : app.getPath('userData');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dbPath, 'db.sqlite'),
  logging: import.meta.env.PROD ? false : (...data: any[]) => log.info('%c[Database] %c', 'color: cyan', 'color: unset', data[0]),
});

export const migrator = new Umzug({
  migrations: Object.entries(migrations).map(([path, migration]) => {
		path += '.ts';
		const name = path.replace('./migrations/', '').replace('./', '').replace('.ts', '');

		return { name, path, ...migration };
	}),
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: import.meta.env.PROD ? undefined : console,
});
