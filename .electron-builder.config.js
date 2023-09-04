/**
 * TODO: Rewrite this config to ESM
 * But currently electron-builder doesn't support ESM configs
 * @see https://github.com/develar/read-config-file/issues/10
 */

/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = async function () {
  const { getVersion } = await import('./version/getVersion.mjs');

  return {
    appId: 'app.streamflow.pog',
    productName: 'Streamflow',
    directories: {
      output: 'dist',
      buildResources: 'buildResources',
    },
    files: ['packages/**/dist/**'],
    extraMetadata: {
      version: getVersion(),
    },
    protocols: {
      name: 'Deeplink',
      schemes: ['streamflow']
    },

    nsis: {
      artifactName: 'Install Streamflow.${ext}',
      uninstallDisplayName: 'Streamflow',
    },

    linux: {
      target: 'deb',
      desktop: {
        StartupNotify: 'false',
        Encoding: 'UTF-8',
        MimeType: 'x-scheme-handler/streamflow',
      },
    },
  };
};
