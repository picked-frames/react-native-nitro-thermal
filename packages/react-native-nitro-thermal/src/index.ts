import { NitroModules } from 'react-native-nitro-modules'
import type { ThermalMonitor, ThermalState as ThermalStateType } from './specs/ThermalMonitor.nitro'

const thermalMonitor =
  NitroModules.createHybridObject<ThermalMonitor>('ThermalMonitor')

const getCurrentThermalState = thermalMonitor.getCurrentThermalState.bind(thermalMonitor)
const addThermalStateListener = thermalMonitor.addThermalStateListener.bind(thermalMonitor)

const ThermalState = {
  NOMINAL: 'nominal',
  FAIR: 'fair',
  SERIOUS: 'serious',
  CRITICAL: 'critical',
  UNKNOWN: 'unknown',
} as const satisfies Record<string, ThermalStateType>

type ThermalState = ThermalStateType

export { getCurrentThermalState, addThermalStateListener, ThermalState }
export { useThermalState } from './useThermalState'
export type { UseThermalStateOptions } from './useThermalState'
