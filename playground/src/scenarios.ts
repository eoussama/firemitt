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
  readonly themeText: string;
  readonly themePrimary: string;
  readonly themeSecondary: string;
  readonly dimWidth: string;
  readonly dimHeight: string;
  readonly posX: string;
  readonly posY: string;
  readonly mode: string;
};

export type TScenario = {
  readonly label: string;
  readonly description: string;
  readonly preset: Partial<TFormValues>;
};

export const SCENARIOS: readonly TScenario[] = [
  {
    label: "Valid config",
    description: "All required fields are present and valid. Should open the Fireguard popup and complete auth.",
    preset: {
      name: "Test App",
    },
  },
  {
    label: "Missing URL",
    description: "The url field is empty. ConfigHelper should throw InvalidURLError immediately.",
    preset: {
      url: "",
      name: "Test App",
    },
  },
  {
    label: "Invalid URL (bad protocol)",
    description: "URL uses ftp:// protocol. ConfigHelper rejects non http/https URLs.",
    preset: {
      url: "ftp://example.com",
      name: "Test App",
    },
  },
  {
    label: "Invalid URL (not a URL)",
    description: "URL is a plain string with no protocol. ConfigHelper should throw InvalidURLError.",
    preset: {
      url: "not-a-valid-url",
      name: "Test App",
    },
  },
  {
    label: "Missing app name",
    description: "The app name is empty. ConfigHelper should throw InvalidAppNameError.",
    preset: {
      name: "",
    },
  },
  {
    label: "Empty Firebase object",
    description: "Firebase config is explicitly an empty object {}. ConfigHelper should throw InvalidFirebaseConfigError.",
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
    label: "GitHub provider",
    description: "Uses GitHub as the auth provider instead of the default Google.",
    preset: {
      name: "Test App",
      provider: "github",
    },
  },
  {
    label: "Custom theme",
    description: "Passes custom theme colors to the Fireguard UI alongside a logo URL.",
    preset: {
      name: "Branded App",
      logo: "../assets/logo.svg",
      themeText: "#79531a",
      themePrimary: "#ee16cc",
      themeSecondary: "#12ff32",
    },
  },
  {
    label: "Custom dimensions",
    description: "Overrides the popup width/height and position.",
    preset: {
      name: "Test App",
      dimWidth: "600",
      dimHeight: "400",
      posX: "100",
      posY: "100",
    },
  },
  {
    label: "Non-numeric dimensions",
    description: "Passes non-numeric strings for width/height. parseFloat coerces them to NaN.",
    preset: {
      name: "Test App",
      dimWidth: "wide",
      dimHeight: "tall",
    },
  },
  {
    label: "Iframe embed (auto-create)",
    description: "Opens Fireguard embedded in an iframe created inside the result panel. Uses mode: \"iframe\" with a container.",
    preset: {
      name: "Test App",
      mode: "iframe",
    },
  },
  {
    label: "Iframe embed (dialog)",
    description: "Opens Fireguard embedded in an iframe inside a modal <dialog>. The dialog closes automatically when auth resolves or rejects.",
    preset: {
      name: "Test App",
      mode: "iframe-dialog",
    },
  },
  {
    label: "Iframe embed (existing element)",
    description: "Reuses a persistent <iframe> element already in the DOM. Fireguard is loaded into it without Firemitt managing its lifecycle.",
    preset: {
      name: "Test App",
      mode: "iframe-element",
    },
  },
];
