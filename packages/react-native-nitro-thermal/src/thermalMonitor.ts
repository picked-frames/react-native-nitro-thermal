import { NitroModules } from 'react-native-nitro-modules'
import type { ThermalMonitor, ThermalState as ThermalStateType } from './specs/ThermalMonitor.nitro'

const thermalMonitor =
  NitroModules.createHybridObject<ThermalMonitor>('ThermalMonitor')

export const getCurrentThermalState =
  thermalMonitor.getCurrentThermalState.bind(thermalMonitor)
export const addThermalStateListener =
  thermalMonitor.addThermalStateListener.bind(thermalMonitor)

export const ThermalState = {
  NOMINAL: 'nominal',
  FAIR: 'fair',
  SERIOUS: 'serious',
  CRITICAL: 'critical',
  UNKNOWN: 'unknown',
} as const satisfies Record<string, ThermalStateType>

export type ThermalState = ThermalStateType
