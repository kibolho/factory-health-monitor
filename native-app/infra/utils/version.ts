import { CONSTANTS_ENV } from '../../constants';

export class Version {
  static fullVersion: string | undefined = undefined;
  static versionName: string | undefined = undefined;
  static buildNumber: string | undefined = undefined;
  static codePushVersion: string | undefined = undefined;

  static getFullVersion = () => {
    if (Version.fullVersion) {
      return Version.fullVersion;
    }
    Version.factoryFullVersion();
    return Version.fullVersion;
  };

  static getFullVersionStatic = () => {
    if (Version.fullVersion) {
      return Version.fullVersion;
    }
    Version.factoryFullVersion();
    return Version.fullVersion;
  };

  static factoryFullVersion = () => {
    Version.fullVersion = `${Version.getVersionName()} (${Version.getBuildNumber()}${
      Version.codePushVersion ? ` - ${Version.codePushVersion}` : ''
    })`;
  };

  static getBuildNumber = () => {
    if (Version.buildNumber) {
      return Version.buildNumber;
    }
    Version.buildNumber = CONSTANTS_ENV.BUILD_NUMBER;
    return Version.buildNumber;
  };

  static getVersionName = () => {
    if (Version.versionName) {
      return Version.versionName;
    }
    Version.versionName = CONSTANTS_ENV.VERSION;
    return Version.versionName;
  };

  static getCodePushVersionStatic = () => {
    return Version.codePushVersion;
  };

}
