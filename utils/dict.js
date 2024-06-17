import I18n from "@/i18n";

export const taskFaultStatus = [
  {
    label: I18n.t('task.fault.status.pending'),
    value: 1
  },
  {
    label: I18n.t('task.fault.status.repairing'),
    value: 4
  },
  {
    label: I18n.t('task.fault.status.repaired'),
    value: 5
  },
  {
    label: I18n.t('task.fault.status.finished'),
    value: 3
  },
]

export const taskType = [
  {
    label: I18n.t('task.type.repair'),
    value: 1
  },
  {
    label: I18n.t('task.type.installation'),
    value: 2
  },
]

export const taskInstallStatus = [
  {
    label: I18n.t('task.install.status.pending'),
    value: 1
  },
  {
    label: I18n.t('task.install.status.processing'),
    value: 2
  },
  {
    label: I18n.t('task.install.status.completed'),
    value: 3
  },
]

export const communicationModule = [
  {
    label: I18n.t('site.module.bound'),
    value: 1
  },
  {
    label: I18n.t('site.module.unbound'),
    value: 0
  },
]

export const siteStatus = [
  {
    label: I18n.t('site.install.status.completed'),
    value: 1
  },  {
    label: I18n.t('site.install.status.commissioning'),
    value: 2
  },
]

export const networkStatus = [
  {
    label: I18n.t('network.status.offline'),
    value: 0
  },
  {
    label: I18n.t('network.status.online'),
    value: 1
  },
]

export const gridStatus = [
  {
    label: I18n.t('grid.status.free'),
    value: 0
  },
  {
    label: I18n.t('grid.status.export'),
    value: 1
  },
  {
    label: I18n.t('grid.status.import'),
    value: 2
  },
]

export const storeStatus = [
  {
    label: I18n.t('store.status.notChargeDischarge'),
    value: 1
  },
  {
    label: I18n.t('store.status.charging'),
    value: 2
  },
  {
    label: I18n.t('store.status.discharging'),
    value: 3
  },
]

export const newInstall = [
  {
    label: I18n.t('device.newInstall.yes'),
    value: 1
  },
  {
    label: I18n.t('device.newInstall.no'),
    value: 2
  }
]

export const productType = [
  {
    label: I18n.t('device.type.inverter'),
    value: 1
  },
  {
    label: I18n.t('device.type.battery'),
    value: 2
  },
  {
    label: I18n.t('device.type.charger'),
    value: 3
  },
  {
    label: I18n.t('device.type.stickLogger'),
    value: 4
  },
  {
    label: I18n.t('device.type.pv'),
    value: 6
  },
]

export const fileType = [
  {
    label: 'T_BOX',
    value: 0
  },
  {
    label: 'BMS',
    value: 1
  },
  {
    label: 'PCS',
    value: 2
  },
  {
    label: 'EV Charger',
    value: 3
  },
  {
    label: 'HMI',
    value: 4
  },
]

export const manufacturerTBox = [
  {
    label: 'Yotai',
    value: 0
  }
]

export const manufacturerPcs = [
  {
    label: 'MEGAREVO',
    value: 1
  },
  {
    label: 'LUXPOWER',
    value: 2
  }
]

export const manufacturerBms = [
  {
    label: 'TIAN POWER',
    value: 1
  },
  {
    label: 'PACE',
    value: 2
  }
]

export const submoduleBms = [
  {
    label: 'BAU',
    value: 1
  },
  {
    label: 'BCU',
    value: 2
  },
  {
    label: 'BMU',
    value: 3
  }
]

export const submoduleSignalBms = [
  {
    label: '48V BMS',
    value: 0
  }
]

export const submodulePcs = [
  {
    label: 'ARM',
    value: 1
  },
  {
    label: 'DSP',
    value: 2
  },
]

export const comMType = [
  {
    label: 'T-box',
    value: 0
  },
  {
    label: 'BMS',
    value: 1
  },
  {
    label: 'PCS',
    value: 2
  },
]

export const bmsType = [
  {
    label: 'Low Voltage',
    value: 0
  },
  {
    label: 'High Voltage 16s',
    value: 11
  },
  {
    label: 'High Voltage 32s',
    value: 13
  },
]

export const applicationType = [
  {
    label: 'Boot',
    value: 0
  },
  {
    label: 'App',
    value: 1
  }
]

export const inverterVersion = [
  {
    label: 'V1.5',
    value: 0
  },
  {
    label: 'Mini',
    value: 1
  },
  {
    label: 'V1.0',
    value: 2
  },
  {
    label: '--',
    value: 10
  }
]

export const upgradeResStatus = [
  {
    label: I18n.t('dict.success'),
    value: 1
  },
  {
    label: I18n.t('dict.fail'),
    value: 2
  },
  {
    label: I18n.t('dict.upgrading'),
    value: 3
  },
  {
    label: I18n.t('dict.waiting'),
    value: 4
  },
  {
    label: I18n.t('dict.timeout'),
    value: 5
  }
]

export const upgradeTaskStatus = [
  {
    label: I18n.t('dict.inProgress'),
    value: 1
  },
  {
    label: I18n.t('dict.toBeStarted'),
    value: 2
  },
  {
    label: I18n.t('site.install.status.completed'),
    value: 3
  }
]

export const upgradeMode = [
  {
    label: I18n.t('dict.clear.manual'),
    value: 1
  },
  {
    label: I18n.t('dict.clear.automatic'),
    value: 2
  }
]

export const siteUpgradeStatus = [
  {
    label: I18n.t('dict.success'),
    value: 1
  },
  {
    label: I18n.t('dict.fail'),
    value: 2
  },
  {
    label: I18n.t('dict.upgrading'),
    value: 3
  },
  {
    label: I18n.t('dict.waiting'),
    value: 4
  },
  {
    label: I18n.t('dict.timeout'),
    value: 5
  }
]

export const alarmImportance = [
  {
    label: I18n.t('alarm.warning'),
    value: 1
  },
  {
    label: I18n.t('alarm.fault'),
    value: 2
  },
  {
    label: I18n.t('alarm.notice'),
    value: 3
  }
]

export const alarmClearType = [
  {
    label: I18n.t('dict.clear.automatic'),
    value: 0
  },
  {
    label: I18n.t('dict.clear.manual'),
    value: 1
  }
]

export const alarmStatus = [
  {
    label: I18n.t('alarm.open'),
    value: 0
  },
  {
    label: I18n.t('alarm.closed'),
    value: 1
  }
]

export const deviceInstallStatus = [
  {
    label: I18n.t('device.install.status.unbind'),
    value: 0
  },
  {
    label: I18n.t('device.install.status.installed'),
    value: 1
  }
]

export const roleSource = [
  {
    label: I18n.t('dict.systemPresets'),
    value: 1
  },
  {
    label: I18n.t('dict.manual'),
    value: 2
  }
]

export const dateRadioBtn = [
  {
    label: I18n.t('common.day'),
    value: 'date'
  },
  {
    label: I18n.t('common.week'),
    value: 'week'
  },
  {
    label: I18n.t('common.month'),
    value: 'month'
  },
  {
    label: I18n.t('common.year'),
    value: 'year'
  },
]

export const batInfoItemBtn = [
  {
    label: I18n.t('common.voltage'),
    value: 'Voltage'
  },  {
    label: I18n.t('common.current'),
    value: 'Current'
  },  {
    label: I18n.t('common.power'),
    value: 'Power'
  },  {
    label: 'SOC',
    value: 'SOC'
  },  {
    label: I18n.t('common.temperature'),
    value: 'Temperature'
  },
]

export const cellInfoItemBtn = [
  {
    label: I18n.t('common.voltage') + '(V)',
    value: 0
  },  {
    label: I18n.t('bms.cellT') + '(°C)',
    value: 1
  },  {
    label: I18n.t('bms.envT') + '(°C)',
    value: 2
  },  {
    label: I18n.t('bms.mosT') + '(°C)',
    value: 3
  }
]

export const agencyStatus = [
  {
    label: I18n.t('dict.valid'),
    value: 1
  },  {
    label: I18n.t('dict.invalid'),
    value: 2
  },
]

export const authStatus = [
  {
    label: I18n.t('dict.valid'),
    value: 0
  },  {
    label: I18n.t('dict.invalid'),
    value: 1
  },
]
