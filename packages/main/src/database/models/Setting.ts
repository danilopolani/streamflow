import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import { safeStorage } from 'electron';
import { SettingName } from '/@/enums';

class Setting<T> extends Model {
  declare name: string;
  declare value: T;
}

const encryptedSettings = [
  SettingName.ObsAuth,
  SettingName.TwitchAuth,
];

Setting.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,

    get() {
      let serialized = this.getDataValue('value');

      if (encryptedSettings.includes(this.getDataValue('name')) && safeStorage.isEncryptionAvailable()) {
        serialized = safeStorage.decryptString(Buffer.from(serialized, 'base64'));
      }

      return JSON.parse(serialized);
    },

    set(value: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      let serialized = JSON.stringify(value);

      if (encryptedSettings.includes(this.getDataValue('name')) && safeStorage.isEncryptionAvailable()) {
        serialized = safeStorage.encryptString(serialized).toString('base64');
      }

      this.setDataValue('value', serialized);
    },
  },
}, {
  sequelize,
  timestamps: false,
  tableName: 'settings',
});

export { Setting };
