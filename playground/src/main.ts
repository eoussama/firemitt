import type { TFiremittOptions } from "@eoussama/firemitt";
import type { TConnectionField, TFormValues, TMode, TScenario } from "./scenarios";
import { Base64helper, BaseError, EnumHelper, ErrorType, EventType, FiremittHelper } from "@eoussama/firemitt";
import { CONNECTION_FIELDS, SCENARIOS } from "./scenarios";



declare const __FIREMITT_VERSION__: string;

type TResultState = "idle" | "pending" | "success" | "error";

const STORAGE_KEY = "firemitt-playground:connection";

const URL_PRESETS = [
  { label: "Local dev", value: "http://localhost:5173/" },
  { label: "Local preview", value: "http://localhost:4173/fireguard/" },
  { label: "Hosted", value: "https://ouss.es/fireguard/" },
];

const ENV_CONNECTION: Record<TConnectionField, string> = {
  url: import.meta.env.VITE_FIREGUARD_URL || URL_PRESETS[0].value,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
};

const FORM_DEFAULTS: Omit<TFormValues, TConnectionField> = {
  name: "",
  logo: "",
  provider: "google",
  themeEnabled: false,
  themeText: "#1a3544",
  themePrimary: "#ffe536",
  themeSecondary: "#1a3544",
  themeBackground: "#ffffff",
  dimWidth: "",
  dimHeight: "",
  posX: "",
  posY: "",
  mode: "popup",
};

const MODE_LABELS: Record<TMode, string> = {
  "popup": "popup",
  "iframe": "iframe",
  "iframe-dialog": "iframe in a dialog",
  "iframe-element": "existing iframe",
};

/**
 * The id of the latest run, results of older runs are only logged.
 */
let currentRun = 0;

/**
 * Timer updating the elapsed time of the current run.
 */
let elapsedTimer: ReturnType<typeof setInterval> | undefined;

const $ = <T extends HTMLElement = HTMLElement>(id: string): T => document.getElementById(id) as T;
const input = (id: string): HTMLInputElement => $<HTMLInputElement>(id);

/* Connection settings, remembered in this browser */

function loadConnection(): Record<TConnectionField, string> {
  try {
    return { ...ENV_CONNECTION, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") };
  }
  catch {
    return { ...ENV_CONNECTION };
  }
}

function saveConnection(): void {
  const connection = Object.fromEntries(CONNECTION_FIELDS.map(field => [field, input(field).value.trim()]));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connection));
  }
  catch {
    // Storage may be unavailable (private mode), the settings are simply not remembered.
  }
}

/* Form */

function getMode(): TMode {
  return (document.querySelector<HTMLInputElement>("input[name=\"mode\"]:checked")?.value ?? "popup") as TMode;
}

function setMode(mode: TMode): void {
  document.querySelectorAll<HTMLInputElement>("input[name=\"mode\"]").forEach((radio) => {
    radio.checked = radio.value === mode;
  });
}

function readForm(): TFormValues {
  const value = (id: string): string => input(id).value.trim();

  return {
    url: value("url"),
    name: value("name"),
    logo: value("logo"),
    provider: value("provider"),
    apiKey: value("apiKey"),
    appId: value("appId"),
    projectId: value("projectId"),
    authDomain: value("authDomain"),
    measurementId: value("measurementId"),
    storageBucket: value("storageBucket"),
    messagingSenderId: value("messagingSenderId"),
    themeEnabled: input("themeEnabled").checked,
    themeText: input("themeText").value,
    themePrimary: input("themePrimary").value,
    themeSecondary: input("themeSecondary").value,
    themeBackground: input("themeBackground").value,
    dimWidth: value("dimWidth"),
    dimHeight: value("dimHeight"),
    posX: value("posX"),
    posY: value("posY"),
    mode: getMode(),
  };
}

function writeForm(values: TFormValues): void {
  for (const [key, value] of Object.entries(values)) {
    if (key === "mode") {
      setMode(value as TMode);
    }
    else if (typeof value === "boolean") {
      input(key).checked = value;
    }
    else {
      input(key).value = value;
    }
  }

  syncUi();
}

function syncUi(): void {
  const url = input("url").value.trim();

  document.querySelectorAll<HTMLButtonElement>(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.url === url);
  });

  $("theme-colors").classList.toggle("disabled", !input("themeEnabled").checked);
  $("url-hint").hidden = !url.startsWith("https://ouss.es/");

  const configured = ["apiKey", "authDomain", "projectId", "appId"].every(id => input(id).value.trim());
  const hint = $("firebase-hint");

  hint.textContent = configured ? "configured" : "missing values";
  hint.classList.toggle("missing", !configured);
}

/**
 * Builds the options passed to `FiremittHelper.auth` from the form.
 *
 * @param values The form values.
 * @returns The Firemitt options.
 */
function toOptions(values: TFormValues): TFiremittOptions {
  const number = (value: string) => (value ? { value: Number(value) } : undefined);
  const width = number(values.dimWidth);
  const height = number(values.dimHeight);
  const x = number(values.posX);
  const y = number(values.posY);

  const firebase = {
    apiKey: values.apiKey,
    appId: values.appId,
    projectId: values.projectId,
    authDomain: values.authDomain,
    ...(values.measurementId ? { measurementId: values.measurementId } : {}),
    ...(values.storageBucket ? { storageBucket: values.storageBucket } : {}),
    ...(values.messagingSenderId ? { messagingSenderId: values.messagingSenderId } : {}),
  };

  const iframe = {
    "popup": undefined,
    "iframe": { container: $("iframe-container") },
    "iframe-dialog": { container: $("dialog-container") },
    "iframe-element": { element: $<HTMLIFrameElement>("fireguard-iframe") },
  }[values.mode];

  return {
    url: values.url,
    ...(iframe ? { mode: "iframe" as const, iframe } : {}),
    ...(width || height ? { dim: { ...(width && { width: width.value }), ...(height && { height: height.value }) } } : {}),
    ...(x || y ? { pos: { ...(x && { x: x.value }), ...(y && { y: y.value }) } } : {}),
    config: {
      name: values.name,
      ...(values.logo ? { logo: values.logo } : {}),
      ...(values.provider ? { provider: values.provider } : {}),
      ...(values.themeEnabled
        ? {
            theme: {
              text: values.themeText,
              primary: values.themePrimary,
              secondary: values.themeSecondary,
              background: values.themeBackground,
            },
          }
        : {}),
      firebase,
    },
  };
}

/* Scenarios */

function applyScenario(scenario: TScenario, button: HTMLButtonElement): void {
  const connection = loadConnection();
  const overrides = Object.fromEntries(CONNECTION_FIELDS.map(field => [field, scenario.preset[field] ?? connection[field]]));

  writeForm({ ...FORM_DEFAULTS, ...overrides, ...scenario.preset } as TFormValues);

  document.querySelectorAll(".scenario-btn").forEach(other => other.classList.toggle("active", other === button));
  $("scenario-title").textContent = scenario.label;
  $("scenario-desc").textContent = scenario.description;
}

function buildScenarios(): void {
  const list = $("scenario-list");
  const groups = new Map<string, HTMLElement>();

  for (const scenario of SCENARIOS) {
    let group = groups.get(scenario.group);

    if (!group) {
      group = document.createElement("div");
      group.className = "scenario-group";
      group.innerHTML = `<h3>${scenario.group}</h3>`;
      groups.set(scenario.group, group);
      list.appendChild(group);
    }

    const button = document.createElement("button");

    button.type = "button";
    button.className = "scenario-btn";
    button.textContent = scenario.label;
    button.title = scenario.description;
    button.addEventListener("click", () => applyScenario(scenario, button));
    group.appendChild(button);
  }
}

function buildUrlPresets(): void {
  for (const preset of URL_PRESETS) {
    const chip = document.createElement("button");

    chip.type = "button";
    chip.className = "chip";
    chip.textContent = preset.label;
    chip.title = preset.value;
    chip.dataset.url = preset.value;
    chip.addEventListener("click", () => {
      input("url").value = preset.value;
      saveConnection();
      syncUi();
    });

    $("url-presets").appendChild(chip);
  }
}

/* Handshake log */

function log(direction: "in" | "out" | "note", text: string): void {
  const item = document.createElement("li");
  const now = new Date();
  const time = `${now.toTimeString().slice(0, 8)}.${String(now.getMilliseconds()).padStart(3, "0")}`;
  const arrow = { in: "in", out: "out", note: "·" }[direction];

  item.className = direction;
  item.innerHTML = `<time></time><span class="direction"></span><span class="text"></span>`;
  item.children[0].textContent = time;
  item.children[1].textContent = arrow;
  item.children[2].textContent = text;

  const list = $("log");

  list.appendChild(item);
  list.scrollTop = list.scrollHeight;
}

function summarize(payload: unknown): string {
  const json = JSON.stringify(payload, (key, value: unknown) => key === "token" && typeof value === "string" ? `${value.slice(0, 12)}…` : value);

  return json && json !== "{}" ? json : "";
}

function listenToMessages(): void {
  window.addEventListener("message", (event) => {
    let message: ReturnType<typeof Base64helper.decode>;

    try {
      message = Base64helper.decode(event.data);
    }
    catch {
      return;
    }

    const name = EnumHelper.getName(EventType, message.type) ?? `#${message.type}`;

    log("in", `${String(name)} from ${event.origin} ${summarize(message.payload)}`.trim());

    if (message.type === EventType.Loaded) {
      log("out", "Config (Firemitt answers every Loaded)");
    }
  });
}

/* Result */

function setResult(state: TResultState, status: string, message: string, details: Record<string, string> = {}): void {
  const result = $("result");
  const list = $("result-details");

  result.dataset.state = state;
  $("result-status").textContent = status;
  $("result-message").textContent = message;

  list.replaceChildren(...Object.entries(details).flatMap(([term, description]) => {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");

    dt.textContent = term;
    dd.textContent = description;

    return [dt, dd];
  }));
}

function showToken(token?: string): void {
  const claims = $("token-claims");

  $("token").hidden = !token;
  $("token-value").textContent = token ?? "";
  claims.hidden = true;

  const [, payload] = token?.split(".") ?? [];

  if (token?.split(".").length === 3 && payload) {
    try {
      const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));

      claims.textContent = JSON.stringify(JSON.parse(decodeURIComponent(escape(json))), null, 2);
      claims.hidden = false;
    }
    catch {
      // Not a JWT (e.g. an OAuth access token).
    }
  }
}

function startTimer(): void {
  const startedAt = performance.now();
  const elapsed = $("result-elapsed");

  clearInterval(elapsedTimer);
  elapsed.textContent = "0.0s";
  elapsedTimer = setInterval(() => {
    elapsed.textContent = `${((performance.now() - startedAt) / 1000).toFixed(1)}s`;
  }, 100);
}

function stopTimer(): void {
  clearInterval(elapsedTimer);
}

function describeError(error: unknown): Record<string, string> {
  if (!(error instanceof Error)) {
    return { value: String(error) };
  }

  const details: Record<string, string> = { name: error.name };

  if (error instanceof BaseError) {
    const { type, code } = error as BaseError;

    details.type = `${String(EnumHelper.getName(ErrorType, type) ?? "unknown")} (${type})`;

    if (code) {
      details.code = code;
    }
  }

  return details;
}

/* Run */

function run(): void {
  const values = readForm();
  const runId = ++currentRun;
  const dialog = $<HTMLDialogElement>("iframe-dialog");
  const embedded = values.mode === "iframe" || values.mode === "iframe-element";

  $("preview").hidden = !embedded;
  $("fireguard-iframe").hidden = values.mode !== "iframe-element";
  showToken();
  log("note", `Run #${runId}: ${MODE_LABELS[values.mode]}, ${values.url || "(no URL)"}`);

  if (values.mode === "iframe-dialog") {
    dialog.showModal();
  }

  startTimer();
  setResult("pending", "Waiting", values.mode === "popup" ? "Complete the sign-in in the Fireguard popup." : "Complete the sign-in in the embedded Fireguard.");

  let promise: Promise<string>;

  try {
    // Called synchronously from the click (or key press), so that the browser allows the popup.
    promise = FiremittHelper.auth(toOptions(values));
  }
  catch (error) {
    promise = Promise.reject(error);
    log("note", `Run #${runId}: auth() threw synchronously`);
  }

  // Firemitt never removes an iframe it did not create: the host page (this playground) hides it once the session is over.
  const release = (): void => {
    if (values.mode === "iframe-element" && runId === currentRun) {
      const iframe = $<HTMLIFrameElement>("fireguard-iframe");

      iframe.hidden = true;
      iframe.src = "about:blank";
      $("preview").hidden = true;
    }
  };

  promise.finally(release).catch(() => {});

  promise.then(
    (token) => {
      log("note", `Run #${runId}: resolved`);

      if (runId === currentRun) {
        stopTimer();
        setResult("success", "Signed in", "Fireguard returned a token.");
        showToken(token);
        dialog.close();
      }
    },
    (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);

      log("note", `Run #${runId}: rejected, ${message}`);

      if (runId === currentRun) {
        stopTimer();
        setResult("error", "Failed", message, describeError(error));
        dialog.close();
      }
    },
  );
}

/* Init */

function init(): void {
  $("version").textContent = `v${__FIREMITT_VERSION__}`;

  buildUrlPresets();
  buildScenarios();

  document.querySelector<HTMLButtonElement>(".scenario-btn")?.click();

  for (const field of CONNECTION_FIELDS) {
    input(field).addEventListener("input", () => {
      saveConnection();
      syncUi();
    });
  }

  input("themeEnabled").addEventListener("change", syncUi);

  $("reset-connection").addEventListener("click", () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    }
    catch {
      // Nothing was stored.
    }

    for (const field of CONNECTION_FIELDS) {
      input(field).value = ENV_CONNECTION[field];
    }

    syncUi();
  });

  $("run-btn").addEventListener("click", run);

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      run();
    }
  });

  $("close-dialog").addEventListener("click", () => $<HTMLDialogElement>("iframe-dialog").close());

  $("iframe-dialog").addEventListener("close", () => {
    // The session is still pending in Firemitt, the next run replaces it.
    if ($("result").dataset.state === "pending") {
      stopTimer();
      setResult("idle", "Cancelled", "The dialog was closed before the session settled.");
      log("note", `Run #${currentRun}: dialog closed`);
      currentRun++;
    }

    $("dialog-container").replaceChildren();
  });

  $("copy-token").addEventListener("click", () => {
    void navigator.clipboard.writeText($("token-value").textContent ?? "").then(() => {
      $("copy-token").textContent = "Copied";
      setTimeout(() => {
        $("copy-token").textContent = "Copy";
      }, 1500);
    });
  });

  $("clear-log").addEventListener("click", () => $("log").replaceChildren());

  listenToMessages();
}

init();
