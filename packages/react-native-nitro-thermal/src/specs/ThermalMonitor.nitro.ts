import { type HybridObject } from 'react-native-nitro-modules'

/**
 * Thermal state of the device.
 *
 * - `nominal`  – No thermal issues; the device is running normally.
 * - `fair`     – Slightly elevated temperature; performance may begin to be throttled.
 * - `serious`  – High temperature; the system is actively throttling performance.
 * - `critical` – Very high temperature; the system may shut down if it gets hotter.
 * - `unknown`  – The thermal state could not be determined.
 */
export type ThermalState =
  | 'nominal'
  | 'fair'
  | 'serious'
  | 'critical'
  | 'unknown'

export interface ThermalMonitor
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Get the current thermal state of the device synchronously.
   */
  getCurrentThermalState(): ThermalState

  /**
   * Register a listener that fires whenever the thermal state changes.
   * Returns a function that unregisters the listener when called.
   */
  addThermalStateListener(
    listener: (state: ThermalState) => void
  ): () => void
}
