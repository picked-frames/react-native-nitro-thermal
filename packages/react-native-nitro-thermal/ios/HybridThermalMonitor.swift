import Foundation
import NitroModules

class HybridThermalMonitor: HybridThermalMonitorSpec {

  // MARK: - Get current thermal state

  func getCurrentThermalState() throws -> ThermalState {
    return mapProcessInfoThermalState(ProcessInfo.processInfo.thermalState)
  }

  // MARK: - Listener

  func addThermalStateListener(
    listener: @escaping (_ state: ThermalState) -> Void
  ) throws -> () -> Void {
    let observer = NotificationCenter.default.addObserver(
      forName: ProcessInfo.thermalStateDidChangeNotification,
      object: nil,
      queue: .main
    ) { _ in
      let mapped = self.mapProcessInfoThermalState(
        ProcessInfo.processInfo.thermalState
      )
      listener(mapped)
    }

    // Emit current state immediately to match Android behavior
    listener(mapProcessInfoThermalState(ProcessInfo.processInfo.thermalState))

    // Return a cleanup function that removes the observer
    return {
      NotificationCenter.default.removeObserver(observer)
    }
  }

  // MARK: - Helpers

  private func mapProcessInfoThermalState(
    _ state: ProcessInfo.ThermalState
  ) -> ThermalState {
    switch state {
    case .nominal:
      return .nominal
    case .fair:
      return .fair
    case .serious:
      return .serious
    case .critical:
      return .critical
    @unknown default:
      return .unknown
    }
  }
}
