import i18n from "@/i18n";
import I18n from "@/i18n";

export const taskFaultStatus = [
  {
    label: i18n.t('task.fault.status.pending'),
    value: 1
  },
  {
    label: i18n.t('task.fault.status.repairing'),
    value: 4
  },
  {
    label: i18n.t('task.fault.status.repaired'),
    value: 5
  },
  {
    label: i18n.t('task.fault.status.finished'),
    value: 3
  },
]

export const taskType = [
  {
    label: i18n.t('task.type.repair'),
    value: 1
  },
  {
    label: i18n.t('task.type.installation'),
    value: 2
  },
]

export const taskInstallStatus = [
  {
    label: i18n.t('task.install.status.pending'),
    value: 1
  },
  {
    label: i18n.t('task.install.status.processing'),
    value: 2
  },
  {
    label: i18n.t('task.install.status.completed'),
    value: 3
  },
]

export const communicationModule = [
  {
    label: i18n.t('site.module.bound'),
    value: 1
  },
  {
    label: i18n.t('site.module.unbound'),
    value: 0
  },
]

export const siteStatus = [
  {
    label: i18n.t('site.install.status.completed'),
    value: 1
  },  {
    label: i18n.t('site.install.status.commissioning'),
    value: 2
  },
]

export const networkStatus = [
  {
    label: i18n.t('network.status.offline'),
    value: 0
  },
  {
    label: i18n.t('network.status.online'),
    value: 1
  },
]

export const gridStatus = [
  {
    label: i18n.t('grid.status.free'),
    value: 0
  },
  {
    label: i18n.t('grid.status.export'),
    value: 1
  },
  {
    label: i18n.t('grid.status.import'),
    value: 2
  },
]

export const storeStatus = [
  {
    label: i18n.t('store.status.notChargeDischarge'),
    value: 1
  },
  {
    label: i18n.t('store.status.charging'),
    value: 2
  },
  {
    label: i18n.t('store.status.discharging'),
    value: 3
  },
]

export const newInstall = [
  {
    label: i18n.t('device.newInstall.yes'),
    value: 1
  },
  {
    label: i18n.t('device.newInstall.no'),
    value: 2
  }
]

export const productType = [
  {
    label: i18n.t('device.type.inverter'),
    value: 1
  },
  {
    label: i18n.t('device.type.battery'),
    value: 2
  },
  {
    label: i18n.t('device.type.charger'),
    value: 3
  },
  {
    label: i18n.t('device.type.stickLogger'),
    value: 4
  },
  {
    label: i18n.t('device.type.pv'),
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
    label: 'TIANBDA',
    value: 1
  },
  {
    label: 'PACEEX',
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
  }
]

export const upgradeResStatus = [
  {
    label: 'Success',
    value: 1
  },
  {
    label: 'Fail',
    value: 2
  },
  {
    label: 'Upgrading',
    value: 3
  }
]

export const upgradeTaskStatus = [
  {
    label: 'In progress',
    value: 1
  },
  {
    label: 'To be started',
    value: 2
  },
  {
    label: 'Completed',
    value: 3
  }
]

export const upgradeMode = [
  {
    label: 'Manual',
    value: 1
  },
  {
    label: 'Automatic',
    value: 2
  }
]

export const siteUpgradeStatus = [
  {
    label: i18n.t('dict.success'),
    value: 1
  },
  {
    label: i18n.t('dict.fail'),
    value: 2
  },
  {
    label: i18n.t('dict.upgrading'),
    value: 3
  },
  {
    label: i18n.t('dict.waiting'),
    value: 4
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
    label: i18n.t('alarm.open'),
    value: 0
  },
  {
    label: i18n.t('alarm.closed'),
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
    label: i18n.t('common.day'),
    value: 'date'
  },
  {
    label: i18n.t('common.week'),
    value: 'week'
  },
  {
    label: i18n.t('common.month'),
    value: 'month'
  },
  {
    label: i18n.t('common.year'),
    value: 'year'
  },
]

export const batInfoItemBtn = [
  {
    label: i18n.t('common.voltage'),
    value: 'Voltage'
  },  {
    label: i18n.t('common.current'),
    value: 'Current'
  },  {
    label: i18n.t('common.power'),
    value: 'Power'
  },  {
    label: 'SOC',
    value: 'SOC'
  },  {
    label: i18n.t('common.temperature'),
    value: 'Temperature'
  },
]

export const cellInfoItemBtn = [
  {
    label: 'Voltage(V)',
    value: 0
  },  {
    label: 'Cell_T(°C)',
    value: 1
  },  {
    label: 'Env_T(°C)',
    value: 2
  },  {
    label: 'MOS_T(°C)',
    value: 3
  }
]

export const agencyStatus = [
  {
    label: i18n.t('dict.valid'),
    value: 1
  },  {
    label: i18n.t('dict.invalid'),
    value: 2
  },
]

export const authStatus = [
  {
    label: i18n.t('dict.valid'),
    value: 0
  },  {
    label: i18n.t('dict.invalid'),
    value: 1
  },
]
