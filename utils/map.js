import I18n from "@/i18n";

export const weatherCodeEnum = {
  "200": "thunderstorm", //雷雨
  "201": "thunderstorm",
  "202": "thunderstorm",
  "210": "thunderstorm",
  "211": "thunderstorm",
  "212": "thunderstorm",
  '221': "thunderstorm",
  '230': "thunderstorm",
  "231": "thunderstorm",
  "232": "thunderstorm",
  "300": "drizzle", //小雨
  "301": "drizzle",
  "302": "drizzle",
  '310': "drizzle",
  "311": "drizzle",
  '312': "drizzle",
  "313": "drizzle",
  "314": "drizzle",
  "321": "drizzle",
  "500": "drizzle",
  "501": "heavyRain",
  "502": "heavyRain", //大雨
  "503": "heavyRain",
  "504": "heavyRain",
  "511": "heavyRain",
  "520": "heavyRain",
  "521": "heavyRain",
  "522": "heavyRain",
  "531": "heavyRain",
  "600": "lightSnow", //小雪
  "601": "lightSnow",
  "602": "heavySnow", //大雪
  "611": "heavySnow",
  "612": "heavySnow",
  '613': "heavySnow",
  "615": "heavySnow",
  "616": "heavySnow",
  "620": "heavySnow",
  "621": "heavySnow",
  '622': "heavySnow",
  "701": "fog", // 雾
  "711": "fog",
  "721": "fog",
  "731": "fog",
  "741": "fog",
  "751": "fog",
  "761": "fog",
  "762": "fog",
  "771": "fog",
  "781": "fog",
  "800": "sunny", // 晴朗
  "801": "cloudy", // 多云
  "802": "cloudy",
  "803": "cloudy",
  "804": "overcast", // 阴天
}

export const deviceCapacityLabel = {
  1: `${I18n.t('site.ratedPower')} (kW)`,
  2: `${I18n.t('common.capacity')} (kWh)`,
  6: `${I18n.t('site.totalComponentCapacity')} (kW)`,
}

export const tagType = {
  1: 'success',
  2: 'info'
}

export const accountActive = {
  1: I18n.t('dict.active'),
  2: I18n.t('dict.notActive'),
}

export const validMap = {
  1: I18n.t('dict.valid'),
  2: I18n.t('dict.invalid')
}

export const inverterSetRes = {
  1: I18n.t('dict.success'),
  2: I18n.t('dict.fail'),
  3: I18n.t('dict.timeout')
}

export const inverterVersion = {
  1: 'V1.5',
  2: 'Mini',
  3: 'V1.0'
}

export const newInstall = {
  1: I18n.t('device.newInstall.yes'),
  2: I18n.t('device.newInstall.no')
}

export const clientType = {
  1: 'APP',
  2: 'Web'
}

export const batteryStatus =   {
  1: I18n.t('store.status.notChargeDischarge'),
  2: I18n.t('store.status.charging'),
  3: I18n.t('store.status.discharging')
}

export const updateFailReasonMap = {
  2: I18n.t('upgrade.fail.reason.crc'),
  3: I18n.t('upgrade.fail.reason.ota'),
  4: I18n.t('upgrade.fail.reason.oversize'),
  5: I18n.t('upgrade.fail.reason.manu'),
  6: I18n.t('upgrade.fail.reason.extern'),
  7: I18n.t('upgrade.fail.reason.md'),
  999: I18n.t('upgrade.fail.reason.timeout')
}
