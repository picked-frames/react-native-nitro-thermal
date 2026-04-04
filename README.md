# react-native-nitro-thermal

[![npm version](https://img.shields.io/npm/v/react-native-nitro-thermal)](https://www.npmjs.com/package/react-native-nitro-thermal)

Monitor the thermal state of iOS and Android devices in real-time. Built with [Nitro Modules](https://github.com/mrousavy/nitro).

## Installation

```bash
bun add react-native-nitro-thermal react-native-nitro-modules
```

### iOS

```bash
cd ios && pod install
```

### Android

No additional steps required.

## Platform Requirements

| Platform | Minimum Version | API |
|----------|----------------|-----|
| iOS | 15.1 | `ProcessInfo.thermalState` |
| Android | 10 (API 29) | `PowerManager.currentThermalStatus` |

## API

### `useThermalState(options?)`

React hook that returns the current thermal state and fires optional callbacks on state changes.

```tsx
import { useThermalState } from 'react-native-nitro-thermal';

function MyComponent() {
  const thermalState = useThermalState()

  return <Text>Thermal: {thermalState}</Text>;
}
```

```tsx
import { useThermalState } from 'react-native-nitro-thermal';

function MyComponent() {
  const thermalState = useThermalState({
    onSerious: (previous) => pauseHeavyOperation(),
    onCritical: (previous) => stopHeavyOperation(),
    onNominal: (previous) => resumeHeavyOperation(),
    onChange: (current, previous) => {
      analytics.log('thermal_change', { from: previous, to: current });
    },
  });

  // ...
}
```

| Option | Type | Description |
|--------|------|-------------|
| `onNominal` | `(previous: ThermalState) => void` | Fired when state changes to `nominal` |
| `onFair` | `(previous: ThermalState) => void` | Fired when state changes to `fair` |
| `onSerious` | `(previous: ThermalState) => void` | Fired when state changes to `serious` |
| `onCritical` | `(previous: ThermalState) => void` | Fired when state changes to `critical` |
| `onUnknown` | `(previous: ThermalState) => void` | Fired when state changes to `unknown` |
| `onChange` | `(current: ThermalState, previous: ThermalState) => void` | Fired on any state change |

All options are optional

### `getCurrentThermalState()`

Returns the current thermal state synchronously.

```typescript
import { getCurrentThermalState, ThermalState } from 'react-native-nitro-thermal';

const state = getCurrentThermalState();

if (state === ThermalState.CRITICAL) {
  // eg. displayMessageToUser('Your device is currently overheating, consider closing some of your other apps to increase performance')
}
```

### `addThermalStateListener(listener)`

Listens for thermal state changes. Returns an unsubscribe function.

```typescript
import { addThermalStateListener, ThermalState } from 'react-native-nitro-thermal';

const unsubscribe = addThermalStateListener((state) => {
  console.log('Thermal state changed:', state);
});

// Clean up listener
unsubscribe();
```

## Types

### `ThermalState`

```typescript
// Use as a type
type ThermalState = 'nominal' | 'fair' | 'serious' | 'critical' | 'unknown'

// Use as runtime values
ThermalState.NOMINAL   // 'nominal'
ThermalState.FAIR      // 'fair'
ThermalState.SERIOUS   // 'serious'
ThermalState.CRITICAL  // 'critical'
ThermalState.UNKNOWN   // 'unknown'
```

| State | Description |
|-------|-------------|
| `nominal` | No thermal issues; running normally |
| `fair` | Slightly elevated; performance may begin throttling |
| `serious` | High temperature; system is actively throttling |
| `critical` | Very high temperature; system may shut down |
| `unknown` | Thermal state could not be determined |

### Platform State Mapping

**iOS** (`ProcessInfo.ThermalState`)

| iOS | Mapped To |
|-----|-----------|
| `.nominal` | `nominal` |
| `.fair` | `fair` |
| `.serious` | `serious` |
| `.critical` | `critical` |

**Android** (`PowerManager.ThermalStatus`)

| Android | Mapped To |
|---------|-----------|
| `THERMAL_STATUS_NONE` | `nominal` |
| `THERMAL_STATUS_LIGHT` | `fair` |
| `THERMAL_STATUS_MODERATE` | `fair` |
| `THERMAL_STATUS_SEVERE` | `serious` |
| `THERMAL_STATUS_CRITICAL` | `critical` |
| `THERMAL_STATUS_EMERGENCY` | `critical` |
| `THERMAL_STATUS_SHUTDOWN` | `critical` |

## Usage Examples

### Adaptive Performance

```tsx
import { useThermalState } from 'react-native-nitro-thermal';

function MyComponent() {
  // eg. for heavy operations like on-device AI inference
  useThermalState({
    onNominal: () => resumeInference(),
    onSerious: () => pauseInference(),
  })
}
```

### User Warning

```tsx
import { Alert } from 'react-native';
import { useThermalState } from 'react-native-nitro-thermal';

function MyComponent() {
  const [showWarning, setShowWarning] = useState(false)

  useThermalState({
    onSerious: () => setShowWarning(true),
    onNominal: () => setShowWarning(false),
  })

  return (
    <View>
      {showWarning ? (
        <Text>Device is overheating. Consider closing some apps or letting it cool down.</Text>
      ) : null}
    </View>
  )
}
```

## Notes

- **Temperature values** are not exposed by iOS or Android public APIs — only discrete states are available.
- **Emulators/simulators** real thermal info doesn't exist on emulators / simulators, often returning 'nominal' regardless. Test on real devices

## License

MIT
