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
    label: 'Not charge-discharge',
    value: 1
  },
  {
    label: 'Charging',
    value: 2
  },
  {
    label: 'Discharging',
    value: 3
  },
]
