package com.margelo.nitro.nitrothermal

import android.content.Context
import android.os.PowerManager
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.NitroModules

@Keep
@DoNotStrip
class HybridThermalMonitor : HybridThermalMonitorSpec() {

    private val context: Context
        get() = NitroModules.applicationContext
            ?: throw IllegalStateException("React context is not available")

    private val powerManager: PowerManager
        get() = context.getSystemService(Context.POWER_SERVICE) as PowerManager

    // MARK: - Get current thermal state

    override fun getCurrentThermalState(): ThermalState {
        return mapAndroidThermalStatus(powerManager.currentThermalStatus)
    }

    // MARK: - Listener

    override fun addThermalStateListener(
        listener: (state: ThermalState) -> Unit
    ): () -> Unit {
        val thermalListener = PowerManager.OnThermalStatusChangedListener { status ->
            listener(mapAndroidThermalStatus(status))
        }

        powerManager.addThermalStatusListener(thermalListener)

        return {
            powerManager.removeThermalStatusListener(thermalListener)
        }
    }

    // MARK: - Helpers

    private fun mapAndroidThermalStatus(status: Int): ThermalState {
        return when (status) {
            PowerManager.THERMAL_STATUS_NONE -> ThermalState.NOMINAL
            PowerManager.THERMAL_STATUS_LIGHT -> ThermalState.FAIR
            PowerManager.THERMAL_STATUS_MODERATE -> ThermalState.FAIR
            PowerManager.THERMAL_STATUS_SEVERE -> ThermalState.SERIOUS
            PowerManager.THERMAL_STATUS_CRITICAL -> ThermalState.CRITICAL
            PowerManager.THERMAL_STATUS_EMERGENCY -> ThermalState.CRITICAL
            PowerManager.THERMAL_STATUS_SHUTDOWN -> ThermalState.CRITICAL
            else -> ThermalState.UNKNOWN
        }
    }
}
