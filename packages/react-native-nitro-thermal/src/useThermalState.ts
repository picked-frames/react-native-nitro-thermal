import { useEffect, useRef, useState } from 'react'
import { addThermalStateListener } from './index'
import type { ThermalState } from './specs/ThermalMonitor.nitro'

type ThermalStateCallback = (previous: ThermalState) => void

export interface UseThermalStateOptions {
  onNominal?: ThermalStateCallback
  onFair?: ThermalStateCallback
  onSerious?: ThermalStateCallback
  onCritical?: ThermalStateCallback
  onUnknown?: ThermalStateCallback
  onChange?: (current: ThermalState, previous: ThermalState) => void
}

const callbackMap: Record<ThermalState, keyof Omit<UseThermalStateOptions, 'onChange'>> = {
  nominal: 'onNominal',
  fair: 'onFair',
  serious: 'onSerious',
  critical: 'onCritical',
  unknown: 'onUnknown',
}

export function useThermalState(options?: UseThermalStateOptions): ThermalState {
  const [thermalState, setThermalState] = useState<ThermalState>('unknown')
  const optionsRef = useRef(options)
  const previousRef = useRef<ThermalState | null>(null)
  optionsRef.current = options

  useEffect(() => {
    const unsubscribe = addThermalStateListener((state) => {
      const prev = previousRef.current
      previousRef.current = state
      setThermalState(state)

      if (prev === null || prev === state) return

      const opts = optionsRef.current
      if (!opts) return

      const callbackKey = callbackMap[state]
      opts[callbackKey]?.(prev)
      opts.onChange?.(state, prev)
    })

    return unsubscribe
  }, [])

  return thermalState
}
