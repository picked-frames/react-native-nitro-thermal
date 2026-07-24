# react-native-nitro-thermal — example

An [Expo](https://expo.dev) (CNG) app demonstrating `react-native-nitro-thermal` — both polling `getCurrentThermalState()` and subscribing via the `useThermalState()` hook.

## Run

Install once from the repo root:

```bash
npm install
```

Then build and launch a dev client:

```bash
npx expo prebuild --clean
npx expo run:ios       # or: npx expo run:android
```

After the first native build, `npm start` gives you fast JS reloads on the dev client.

> Thermal state is only meaningful on real hardware — simulators and emulators generally report `nominal` regardless of load.
