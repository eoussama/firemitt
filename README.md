<p align="center">
  <img width="100" src="https://raw.githubusercontent.com/EOussama/firemitt/main/assets/logo.svg">
</p>

<h1 align="center">Firemitt</h1>
<p align="center">Fireguards are hot, but not enough to burn. As long as you got your mitts on.</p>

<p align="center">
    <img src="https://github.com/EOussama/firemitt/actions/workflows/doc.yml/badge.svg" />
    <img src="https://github.com/EOussama/firemitt/actions/workflows/test.yml/badge.svg" />
    <img src="https://github.com/EOussama/firemitt/actions/workflows/build.yml/badge.svg" />
    <img src="https://github.com/EOussama/firemitt/actions/workflows/publish.yml/badge.svg" />
</p>

<p align="center">
    <img src="https://img.shields.io/github/license/eoussama/firemitt" />
    <img src="https://img.shields.io/npm/v/%40eoussama%2Ffiremitt" />
    <img src="https://img.shields.io/github/languages/code-size/eoussama/firemitt" />
</p>

## Description

Firemitt is a client-side integration package for [Fireguard](https://github.com/EOussama/fireguard), a Firebase authentication middleman app. It handles the full lifecycle of a popup-based auth flow: opening the Fireguard window, passing configuration, and resolving or rejecting based on the authentication result.

It is particularly useful for browser extensions and web apps operating under Manifest V3 restrictions, where direct Firebase SDK usage is limited or blocked.

## Features

- **Popup authentication**: `FiremittHelper.auth` opens a Fireguard window, manages the auth handshake, and returns a promise that resolves with the token on success or rejects on failure.
- **Flexible configuration**: Control the popup position, dimensions, app name, logo, Firebase credentials, and theme with a single options object.
- **Custom theming**: Pass primary, secondary, and text colors to style the Fireguard UI to match your app.
- **Event-driven internals**: `EventHelper` provides a clean interface for sending and receiving cross-window events used by the auth flow.
- **Config validation**: `ConfigHelper` validates and normalizes Fireguard options before they are used, catching missing or malformed values early.

## Installation

```sh
pnpm add @eoussama/firemitt
```

## Usage

### Authentication

`FiremittHelper.auth` is the main entry point. It opens a Fireguard popup window, passes your configuration to it, and returns a promise that resolves with the auth token on success.

```ts
import { FiremittHelper } from "@eoussama/firemitt";

const options = {

  // URL of the Fireguard instance (use the hosted one or a self-hosted deployment)
  url: "https://ouss.es/fireguard",

  // Optional: position of the popup window
  pos: {
    y: 50,
    x: (window.screen.width / 2) - 500
  },

  // Optional: dimensions of the popup window
  dim: {
    width: 450,
    height: 260
  },

  config: {
    name: "My App Name",

    // Optional: URL to your app's logo
    logo: "https://url/to/your/logo/image",

    // Optional: custom theme colors
    theme: {
      text: "grey",
      primary: "#ee16cc",
      secondary: "#ff12ee"
    },

    // Your web app's Firebase configuration
    firebase: {
      appId: "",
      apiKey: "",
      projectId: "",
      authDomain: "",
      measurementId: "",
      storageBucket: "",
      messagingSenderId: ""
    }
  }
};

FiremittHelper.auth(options)
  .then((token) => {
    console.warn("Authentication successful!", token);
  })
  .catch((error) => {
    console.error("Authentication failed:", error);
  });
```

> You can point `url` at the hosted Fireguard instance (`https://ouss.es/fireguard`) or your own [self-hosted](https://github.com/EOussama/fireguard) deployment.

> **Note:** Firebase only allows sign-in popups from authorized domains. If you are using a self-hosted Fireguard deployment, add its domain to the authorized domains list in the Firebase Console under **Authentication → Settings → Authorized domains**. Skipping this step will cause the authentication popup to be blocked.

### Configuration

#### `TFiremittOptions`

| Property | Type | Required | Description |
| -------- | ---- | :------: | ----------- |
| `url` | `string` | ✓ | URL of the Fireguard instance to open. |
| `pos` | `Partial<TPos>` | | Position of the popup window on screen. |
| `dim` | `Partial<TDim>` | | Dimensions of the popup window. |
| `config` | `Partial<TFireguardOptions>` | | Fireguard configuration passed to the popup. |

#### `TPos`

| Property | Type | Required | Description |
| -------- | ---- | :------: | ----------- |
| `x` | `number` | ✓ | Horizontal position of the popup window in pixels. |
| `y` | `number` | ✓ | Vertical position of the popup window in pixels. |

#### `TDim`

| Property | Type | Required | Description |
| -------- | ---- | :------: | ----------- |
| `width` | `number` | ✓ | Width of the popup window in pixels. |
| `height` | `number` | ✓ | Height of the popup window in pixels. |

#### `TFireguardOptions`

| Property | Type | Required | Description |
| -------- | ---- | :------: | ----------- |
| `name` | `string` | ✓ | Display name of your application shown in the Fireguard UI. |
| `firebase` | `TFirebaseConfig` | ✓ | Firebase project configuration used to initialize authentication. |
| `logo` | `string` | | URL to your app's logo image displayed in the Fireguard UI. |
| `theme` | `Partial<TTheme>` | | Custom colors applied to the Fireguard UI. |

#### `TTheme`

| Property | Type | Required | Description |
| -------- | ---- | :------: | ----------- |
| `text` | `string` | ✓ | Color applied to text elements. |
| `primary` | `string` | ✓ | Primary accent color. |
| `secondary` | `string` | ✓ | Secondary accent color. |

#### `TFirebaseConfig`

| Property | Type | Required | Description |
| -------- | ---- | :------: | ----------- |
| `appId` | `string` | ✓ | Unique identifier for the Firebase app. |
| `apiKey` | `string` | ✓ | API key for authenticating Firebase requests. |
| `projectId` | `string` | ✓ | Globally unique identifier for the Firebase project. |
| `authDomain` | `string` | ✓ | Domain used by Firebase Authentication. |
| `measurementId` | `string` | ✓ | Google Analytics measurement ID. |
| `storageBucket` | `string` | ✓ | Cloud Storage bucket name for Firebase Storage. |
| `messagingSenderId` | `string` | ✓ | Sender ID for Firebase Cloud Messaging. |

Full API reference is available in the [docs](https://ouss.es/firemitt).

## Contributing

Contributions are welcome. Please read the [contributing guidelines](CONTRIBUTING.md) and [code of conduct](CODE_OF_CONDUCT.md) before opening a pull request.
