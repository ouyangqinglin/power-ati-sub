import i18n from "@/i18n";

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
  },
  {
    label: 'Waiting',
    value: 4
  }
]

export const alarmImportance = [
  {
    label: 'Warning',
    value: 1
  },
  {
    label: 'Fault',
    value: 2
  },
  {
    label: 'Notice',
    value: 3
  }
]

export const alarmClearType = [
  {
    label: 'Automatic',
    value: 0
  },
  {
    label: 'Manual',
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
    label: 'Unbind',
    value: 0
  },
  {
    label: 'Installed',
    value: 1
  }
]

export const roleSource = [
  {
    label: 'System Presets',
    value: 1
  },
  {
    label: 'Manual',
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
    label: 'Voltage',
    value: 'Voltage'
  },  {
    label: 'Current',
    value: 'Current'
  },  {
    label: 'Power',
    value: 'Power'
  },  {
    label: 'SOC',
    value: 'SOC'
  },  {
    label: 'Temperature',
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
    label: 'Valid',
    value: 1
  },  {
    label: 'Invalid',
    value: 2
  },
]

export const authStatus = [
  {
    label: 'Valid',
    value: 0
  },  {
    label: 'Invalid',
    value: 1
  },
]
