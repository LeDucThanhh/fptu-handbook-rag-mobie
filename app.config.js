const path = require('path');
const dotenv = require('dotenv');

const envFilePath = path.join(__dirname, '.env');
dotenv.config({ path: envFilePath, override: false });
dotenv.config({ override: false });

module.exports = ({ config }) => {
  const base = config.expo ?? config ?? {};
  const defaultScheme = process.env.APP_SCHEME || base.scheme || 'fptuhandbook';

  const extra = {
    ...(base.extra ?? {}),
    apiBaseUrl: process.env.API_BASE_URL || base.extra?.apiBaseUrl || 'https://api.example.com',
    googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID || '',
    googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID || '',
    googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID || '',
    colors: {
      ...((base.extra && base.extra.colors) || {}),
      primary: process.env.COLOR_PRIMARY || base.extra?.colors?.primary || '#FF5722',
      secondary: process.env.COLOR_SECONDARY || base.extra?.colors?.secondary || '#FFC107',
      background: process.env.COLOR_BACKGROUND || base.extra?.colors?.background || '#FFFFFF',
      text: process.env.COLOR_TEXT || base.extra?.colors?.text || '#1A1A1A'
    }
  };

  const easProjectId = process.env.EAS_PROJECT_ID || base.extra?.eas?.projectId;
  if (easProjectId) {
    extra.eas = {
      ...(base.extra?.eas ?? {}),
      projectId: easProjectId
    };
  }

  const androidIntentFilters = [...(base.android?.intentFilters ?? [])];
  const hasAuthIntent = androidIntentFilters.some((filter) =>
    Array.isArray(filter?.data) &&
    filter.data.some?.(
      (item) => item?.scheme === defaultScheme && item?.host === 'auth'
    )
  );

  if (!hasAuthIntent) {
    androidIntentFilters.push({
      action: 'VIEW',
      data: [
        {
          scheme: defaultScheme,
          host: 'auth'
        }
      ],
      category: ['BROWSABLE', 'DEFAULT']
    });
  }

  const iosConfig = {
    ...base.ios,
    bundleIdentifier: process.env.IOS_BUNDLE_IDENTIFIER || base.ios?.bundleIdentifier
  };

  const androidConfig = {
    ...base.android,
    package: process.env.ANDROID_PACKAGE || base.android?.package,
    intentFilters: androidIntentFilters
  };

  return {
    expo: {
      ...base,
      scheme: defaultScheme,
      extra,
      ios: iosConfig,
      android: androidConfig
    }
  };
};

