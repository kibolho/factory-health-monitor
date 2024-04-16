import * as Application from 'expo-application';

export const CONSTANTS_ENV = {
  VERSION: Application.nativeApplicationVersion ?? 'unknown',
  BUILD_NUMBER: Application.nativeBuildVersion ?? 'unknown',
};
