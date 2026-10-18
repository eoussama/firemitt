<p align="center">
  <img width="180" alt="Firemitt logo" src="https://raw.githubusercontent.com/eoussama/firemitt/main/assets/logo.svg">
</p>

<h1 align="center">Firemitt</h1>
<p align="center">Fireguards are hot, but not enough to burn. As long as you got your mitts on.</p>

<p align="center">
    <img alt="Documentation workflow" src="https://github.com/eoussama/firemitt/actions/workflows/doc.yml/badge.svg" />
    <img alt="Unit tests workflow" src="https://github.com/eoussama/firemitt/actions/workflows/test.yml/badge.svg" />
    <img alt="Build workflow" src="https://github.com/eoussama/firemitt/actions/workflows/build.yml/badge.svg" />
    <img alt="Publish workflow" src="https://github.com/eoussama/firemitt/actions/workflows/publish.yml/badge.svg" />
</p>

<p align="center">
    <img alt="License" src="https://img.shields.io/github/license/eoussama/firemitt" />
    <img alt="npm version" src="https://img.shields.io/npm/v/%40eoussama%2Ffiremitt" />
    <img alt="Code size" src="https://img.shields.io/github/languages/code-size/eoussama/firemitt" />
</p>

## Description

Firemitt is a client-side integration package for [Fireguard](https://github.com/eoussama/fireguard), a Firebase authentication middleman app. It handles the full lifecycle of an auth flow: opening the Fireguard window (popup or iframe), passing configuration, and resolving or rejecting based on the authentication result.

It is particularly useful for browser extensions and web apps operating under Manifest V3 restrictions, where direct Firebase SDK usage is limited or blocked.

## Features

- **Popup authentication**: `FiremittHelper.auth` opens a Fireguard popup window, manages the auth handshake, and returns a promise that resolves with the token on success or rejects on failure.
- **Iframe authentication**: Optionally embed Fireguard inside an iframe by setting `mode: "iframe"`. Provide an existing iframe element or a container element and Firemitt manages the lifecycle.
- **Flexible configuration**: Control the popup position, dimensions, app name, logo, Firebase credentials, auth provider, and theme with a single options object.
- **Custom theming**: Pass primary, secondary, text, and background colors to style the Fireguard UI to match your app.
- **Multiple auth providers**: Choose from Google, GitHub, Facebook, Twitter, Microsoft, Apple, or Yahoo via the `provider` field.
- **Robust handshake**: Only messages coming from the Fireguard window are accepted, the configuration is re-sent whenever Fireguard (re)loads, and every session settles exactly once.
- **Config validation**: `ConfigHelper` validates and normalizes Fireguard options before they are used, catching missing or malformed values early.

## Installation

```sh
pnpm add @eoussama/firemitt
```

## Usage

### Popup authentication

`FiremittHelper.auth` is the main entry point. It opens a Fireguard popup window, passes your configuration to it, and returns a promise that resolves with the auth token on success.

> **Important:** browsers only allow popups opened from a user gesture. Call `FiremittHelper.auth` **synchronously** inside your click handler (do not `await` anything before it), otherwise the promise rejects with a `PopupBlockedError`.

```ts
import { FiremittHelper } from "@eoussama/firemitt";

const options = {

  // URL of the Fireguard instance (use the hosted one or a self-hosted deployment)
  url: "https://ouss.es/fireguard/",

  // Optional: position of the popup window (defaults to centered on the current window, 50px from the top)
  pos: {
    x: window.screenX + (window.outerWidth - 450) / 2,
    y: 50
  },

  // Optional: dimensions of the popup window (defaults to 450x260)
  dim: {
    width: 450,
    height: 260
  },

  config: {
    name: "My App Name",

    // Optional: authentication provider (default: "google")
    provider: "google",

    // Optional: absolute URL to your app's logo
    logo: "https://url/to/your/logo/image",

    // Optional: custom theme colors
    theme: {
      text: "#1a3544",
      primary: "#ffe536",
      secondary: "#1a3544",
      background: "#ffffff"
    },

    // Your web app's Firebase configuration
    firebase: {
      appId: "",
      apiKey: "",
      projectId: "",
      authDomain: ""
    }
  }
};

button.addEventListener("click", async () => {
  try {
    const token = await FiremittHelper.auth(options);

    // Use the token, e.g. to sign in to Firebase in your app (see below).
    await onSignedIn(token);
  }
  catch (error) {
    console.error("Authentication failed:", error);
  }
});
```

> **Chrome extensions:** do not call `auth()` from the toolbar (action) popup. It closes as soon as the Fireguard window takes focus, which destroys the page waiting for the result. Call it from an options page, a tab or a side panel instead. Iframe mode does not help there either, since Fireguard opens the provider's sign-in popup, which closes the toolbar popup as well.

### Iframe authentication

Set `mode: "iframe"` and provide either a `container` (Firemitt creates the iframe, sizes it with `dim`, and removes it once the session settles) or an existing `element` (Firemitt loads Fireguard into it but never resizes or removes it).

```ts
// Auto-created iframe inside a container element
FiremittHelper.auth({
  url: "https://ouss.es/fireguard/",
  mode: "iframe",
  iframe: { container: document.getElementById("auth-container")! },
  config: { name: "My App", firebase: { /* ... */ } }
});

// Existing iframe element
FiremittHelper.auth({
  url: "https://ouss.es/fireguard/",
  mode: "iframe",
  iframe: { element: document.getElementById("auth-frame") as HTMLIFrameElement },
  config: { name: "My App", firebase: { /* ... */ } }
});
```

> Fireguard opens the provider's sign-in popup from inside the iframe, so the iframe must not be sandboxed (the sign-in popup would inherit the sandbox, unless `allow-popups-to-escape-sandbox` is set along with `allow-scripts allow-same-origin allow-popups`).

> You can point `url` at the hosted Fireguard instance (`https://ouss.es/fireguard/`) or your own [self-hosted](https://github.com/eoussama/fireguard) deployment.

> **Note:** Firebase only allows sign-in popups from authorized domains. Add the domain of the Fireguard instance you use (`ouss.es` for the hosted one, or your own domain when self-hosting) to the authorized domains list in the Firebase Console under **Authentication → Settings → Authorized domains**. Skipping this step makes the authentication fail with `auth/unauthorized-domain`.

### Errors

| Error | When |
| ----- | ---- |
| `InvalidURLError`, `InvalidDimError`, `InvalidAppNameError`, `InvalidFirebaseConfigError`, `InvalidIframeError` | Thrown **synchronously** by `auth()` when the options are invalid. |
| `PopupBlockedError` | The promise rejects when the browser refused to open the popup. |
| `AuthFailedError` | The promise rejects when Fireguard reports a failure. It keeps the remote `type`, `name` and `message`, the `code` when the Fireguard instance sends one (e.g. a Firebase `auth/*` code, Fireguard 0.1.4+), and the raw payload as `cause`. A success reported without a token also rejects with an `AuthFailedError`. |
| `Error("The authentication window was closed.")` | The promise rejects when the user closes the Fireguard window. |
| `Error("A new authentication session was started.")` | The promise rejects when another `auth()` call replaces the session. The previous popup is closed, the previous auto-created iframe is removed. |

### The token

`auth()` resolves with the OAuth token returned by the provider: the **ID token** when the provider issues one (Google, Apple, Microsoft, Yahoo, OIDC providers), the **access token** otherwise (GitHub, Facebook, Twitter). For example, to sign the user in to Firebase in your app:

```ts
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithCredential } from "firebase/auth";



await signInWithCredential(getAuth(), GoogleAuthProvider.credential(token)); // Google: ID token
await signInWithCredential(getAuth(), GithubAuthProvider.credential(token)); // GitHub: access token
```

Check the Firebase documentation to know whether `signInWithCredential` supports your provider. Twitter credentials also require the OAuth secret, which Fireguard does not return. SAML providers return no OAuth token, so they are not supported yet.

### Configuration

#### `TFiremittOptions`

| Property | Type | Required | Default | Description |
| -------- | ---- | :------: | ------- | ----------- |
| `url` | `string` | ✓ | | URL of the Fireguard instance to open (`http` or `https`). |
| `mode` | `"popup" \| "iframe"` | | `"popup"` | Authentication mode. |
| `iframe` | `TIframeOptions` | In iframe mode | | Provide either an existing element or a container. |
| `pos` | `Partial<TPos>` | | Centered on the current window, 50px from the top | Position of the popup window on screen. Ignored in iframe mode. |
| `dim` | `Partial<TDim>` | | `450` × `260` | Dimensions of the popup or auto-created iframe. |
| `config` | `Partial<TFireguardOptions>` | ✓ | | Fireguard configuration passed to the auth window. |

#### `TIframeOptions`

| Property | Type | Required | Description |
| -------- | ---- | :------: | ----------- |
| `element` | `HTMLIFrameElement` | ✓ (or `container`) | Existing iframe element to load Fireguard into. |
| `container` | `HTMLElement` | ✓ (or `element`) | Container element where Firemitt creates and appends an iframe automatically. |

#### `TPos`

| Property | Type | Required | Description |
| -------- | ---- | :------: | ----------- |
| `x` | `number` | | Horizontal position of the popup window in pixels. |
| `y` | `number` | | Vertical position of the popup window in pixels. |

#### `TDim`

| Property | Type | Required | Description |
| -------- | ---- | :------: | ----------- |
| `width` | `number` | | Width of the popup or auto-created iframe in pixels, greater than zero. |
| `height` | `number` | | Height of the popup or auto-created iframe in pixels, greater than zero. |

#### `TFireguardOptions`

| Property | Type | Required | Default | Description |
| -------- | ---- | :------: | ------- | ----------- |
| `name` | `string` | ✓ | | Display name of your application shown in the Fireguard UI. |
| `firebase` | `TFirebaseConfig` | ✓ | | Firebase project configuration used to initialize authentication. |
| `logo` | `string` | | | Absolute URL to your app's logo image displayed in the Fireguard UI. |
| `provider` | `string` | | `"google"` | Authentication provider to use, see `EProvider`. Built-in values are case-insensitive. Custom `oidc.<id>` identifiers are also accepted. |
| `theme` | `Partial<TTheme>` | | See `TTheme` | Custom colors applied to the Fireguard UI. |

#### `TTheme`

| Property | Type | Required | Default | Description |
| -------- | ---- | :------: | ------- | ----------- |
| `text` | `string` | | `#1a3544` | Color applied to text elements. |
| `primary` | `string` | | `#ffe536` | Primary accent color. |
| `secondary` | `string` | | `#1a3544` | Secondary accent color. |
| `background` | `string` | | `#ffffff` | Page background color. |

#### `EProvider`

| Value | Provider |
| ----- | -------- |
| `"google"` | Google |
| `"github"` | GitHub |
| `"facebook"` | Facebook |
| `"twitter"` | Twitter / X |
| `"microsoft"` | Microsoft |
| `"apple"` | Apple |
| `"yahoo"` | Yahoo |

#### `TFirebaseConfig`

| Property | Type | Required | Description |
| -------- | ---- | :------: | ----------- |
| `appId` | `string` | ✓ | Unique identifier for the Firebase app. |
| `apiKey` | `string` | ✓ | API key for authenticating Firebase requests. |
| `projectId` | `string` | ✓ | Globally unique identifier for the Firebase project. |
| `authDomain` | `string` | ✓ | Domain used by Firebase Authentication. |
| `measurementId` | `string` | | Google Analytics measurement ID. |
| `storageBucket` | `string` | | Cloud Storage bucket name for Firebase Storage. |
| `messagingSenderId` | `string` | | Sender ID for Firebase Cloud Messaging. |

Full API reference is available in the [docs](https://ouss.es/firemitt).

## Security model

- Firemitt only accepts messages posted by the Fireguard window it opened (or the iframe it manages), and replies to the origin Fireguard reported.
- Your Firebase web configuration is not secret, but anyone can open a public Fireguard instance with it. Restrict your Firebase project's **authorized domains** to the Fireguard instances you trust, and prefer a [self-hosted](https://github.com/eoussama/fireguard) Fireguard on a dedicated domain for production.
- `window.open` keeps the `opener` relationship on purpose: Fireguard needs it to send the result back.

## Playground

An interactive playground runs Firemitt (from `src`, no build needed) against a Fireguard instance without writing any code:

- Ready-made scenarios for sign-in flows, every embedding mode (popup, iframe, dialog, existing iframe) and error cases.
- Every option in a form: Fireguard URL (local dev, local preview or hosted), app name, logo, provider, theme, Firebase credentials, window size and position.
- The result with its timing, the error name, type and code, or the token with its decoded ID token claims.
- A live log of the messages exchanged with Fireguard.

To run it, copy `.env.example` to `.env` to prefill the Fireguard URL and your Firebase credentials (or type them in the form, they are remembered in your browser), then:

```sh
pnpm playground   # http://localhost:5174
```

To test a local Fireguard, start it next to Firemitt (`pnpm dev` in the Fireguard repository, on http://localhost:5173) and pick the "Local dev" URL. `Ctrl` + `Enter` runs the selected scenario.

## Contributing

Contributions are welcome. Please read the [contributing guidelines](CONTRIBUTING.md) and [code of conduct](CODE_OF_CONDUCT.md) before opening a pull request.
