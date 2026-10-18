/**
 * Values of the playground form.
 */
export type TFormValues = {
  readonly url: string;
  readonly name: string;
  readonly logo: string;
  readonly provider: string;
  readonly apiKey: string;
  readonly appId: string;
  readonly projectId: string;
  readonly authDomain: string;
  readonly measurementId: string;
  readonly storageBucket: string;
  readonly messagingSenderId: string;
  readonly themeEnabled: boolean;
  readonly themeText: string;
  readonly themePrimary: string;
  readonly themeSecondary: string;
  readonly themeBackground: string;
  readonly dimWidth: string;
  readonly dimHeight: string;
  readonly posX: string;
  readonly posY: string;
  readonly mode: TMode;
};

/**
 * How Fireguard is opened.
 */
export type TMode = "popup" | "iframe" | "iframe-dialog" | "iframe-element";

/**
 * Fields describing where Fireguard runs and which Firebase project it uses.
 * They are remembered between scenarios, unless a scenario overrides them.
 */
export const CONNECTION_FIELDS = [
  "url",
  "apiKey",
  "appId",
  "projectId",
  "authDomain",
  "measurementId",
  "storageBucket",
  "messagingSenderId",
] as const;

/**
 * A connection field.
 */
export type TConnectionField = (typeof CONNECTION_FIELDS)[number];

/**
 * A preset of the playground form.
 */
export type TScenario = {
  readonly group: "Sign-in" | "Embedding" | "Errors";
  readonly label: string;
  readonly description: string;
  readonly preset: Partial<TFormValues>;
};

export const SCENARIOS: readonly TScenario[] = [
  {
    group: "Sign-in",
    label: "Google sign-in",
    description: "Opens Fireguard in a popup and signs in with Google. Resolves with a Google ID token.",
    preset: { name: "Test App", provider: "google" },
  },
  {
    group: "Sign-in",
    label: "GitHub sign-in",
    description: "Signs in with GitHub instead of Google. Resolves with a GitHub access token.",
    preset: { name: "Test App", provider: "github" },
  },
  {
    group: "Sign-in",
    label: "Branded",
    description: "Sends a logo and custom theme colors, which Fireguard applies to its UI.",
    preset: {
      name: "Branded App",
      logo: "https://raw.githubusercontent.com/eoussama/firemitt/main/assets/logo.svg",
      themeEnabled: true,
      themeText: "#79531a",
      themePrimary: "#ee16cc",
      themeSecondary: "#12ff32",
      themeBackground: "#0d1b24",
    },
  },
  {
    group: "Sign-in",
    label: "Unicode app name",
    description: "Uses an app name with accents, Arabic script and an emoji. The configuration must still reach Fireguard.",
    preset: { name: "Café – تطبيق 😀" },
  },
  {
    group: "Sign-in",
    label: "Window size & position",
    description: "Overrides the popup dimensions and position.",
    preset: { name: "Test App", dimWidth: "600", dimHeight: "400", posX: "100", posY: "100" },
  },
  {
    group: "Embedding",
    label: "Iframe",
    description: "Embeds Fireguard in an iframe that Firemitt creates in the preview area, and removes once the session settles.",
    preset: { name: "Test App", mode: "iframe" },
  },
  {
    group: "Embedding",
    label: "Iframe in a dialog",
    description: "Embeds Fireguard in an iframe inside a modal dialog, closed when the session settles.",
    preset: { name: "Test App", mode: "iframe-dialog" },
  },
  {
    group: "Embedding",
    label: "Existing iframe",
    description: "Loads Fireguard into an iframe already in the page. Firemitt neither resizes nor removes it.",
    preset: { name: "Test App", mode: "iframe-element" },
  },
  {
    group: "Errors",
    label: "Missing URL",
    description: "The Fireguard URL is empty: auth() throws an InvalidURLError right away.",
    preset: { url: "", name: "Test App" },
  },
  {
    group: "Errors",
    label: "Non-http URL",
    description: "The URL uses the ftp:// protocol: auth() throws an InvalidURLError.",
    preset: { url: "ftp://example.com", name: "Test App" },
  },
  {
    group: "Errors",
    label: "Missing app name",
    description: "The app name is empty: auth() throws an InvalidAppNameError.",
    preset: { name: "" },
  },
  {
    group: "Errors",
    label: "Empty Firebase config",
    description: "Every Firebase field is empty: auth() throws an InvalidFirebaseConfigError.",
    preset: {
      name: "Test App",
      apiKey: "",
      appId: "",
      projectId: "",
      authDomain: "",
      measurementId: "",
      storageBucket: "",
      messagingSenderId: "",
    },
  },
  {
    group: "Errors",
    label: "Invalid dimensions",
    description: "The width is zero: auth() throws an InvalidDimError.",
    preset: { name: "Test App", dimWidth: "0" },
  },
  {
    group: "Errors",
    label: "Unknown provider",
    description: "The provider is misspelled: Fireguard reports an InvalidProviderError instead of signing in with Google.",
    preset: { name: "Test App", provider: "gogle" },
  },
];
