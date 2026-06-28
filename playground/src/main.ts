import type { TFormValues } from "./scenarios";
import { FiremittHelper } from "@eoussama/firemitt";
import { SCENARIOS } from "./scenarios";



const DEFAULT_FIREGUARD_URL = import.meta.env.VITE_FIREGUARD_URL || "http://localhost:5173";

function getField(id: string): HTMLInputElement {
  return document.getElementById(id) as HTMLInputElement;
}

function readForm(): TFormValues {
  return {
    url: getField("url").value.trim(),
    name: getField("name").value.trim(),
    logo: getField("logo").value.trim(),
    provider: getField("provider").value.trim(),
    apiKey: getField("apiKey").value.trim(),
    appId: getField("appId").value.trim(),
    projectId: getField("projectId").value.trim(),
    authDomain: getField("authDomain").value.trim(),
    measurementId: getField("measurementId").value.trim(),
    storageBucket: getField("storageBucket").value.trim(),
    messagingSenderId: getField("messagingSenderId").value.trim(),
    themeText: getField("themeText").value.trim(),
    themePrimary: getField("themePrimary").value.trim(),
    themeSecondary: getField("themeSecondary").value.trim(),
    dimWidth: getField("dimWidth").value.trim(),
    dimHeight: getField("dimHeight").value.trim(),
    posX: getField("posX").value.trim(),
    posY: getField("posY").value.trim(),
    mode: (document.getElementById("mode") as HTMLSelectElement)?.value?.trim() ?? "",
  };
}

function syncUrlChips(url: string): void {
  document.querySelectorAll<HTMLButtonElement>(".url-preset-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.url === url);
  });
}

function applyPreset(preset: Partial<TFormValues>): void {
  const defaults: TFormValues = {
    url: DEFAULT_FIREGUARD_URL,
    name: "",
    logo: "",
    provider: "",
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
    themeText: "",
    themePrimary: "",
    themeSecondary: "",
    dimWidth: "",
    dimHeight: "",
    posX: "",
    posY: "",
    mode: "",
  };

  const resolved = { ...defaults, ...preset };

  for (const [key, value] of Object.entries(resolved)) {
    const el = document.getElementById(key) as HTMLInputElement | null;

    if (el) {
      el.value = value;
    }
  }

  syncUrlChips(resolved.url);
}

function setResult(state: "idle" | "pending" | "success" | "error", message: string): void {
  const panel = document.getElementById("result-panel") as HTMLElement;
  const text = document.getElementById("result-text") as HTMLElement;

  panel.dataset.state = state;
  text.textContent = message;
}

async function runAuth(): Promise<void> {
  const values = readForm();

  const firebase = {
    apiKey: values.apiKey,
    appId: values.appId,
    projectId: values.projectId,
    authDomain: values.authDomain,
    measurementId: values.measurementId,
    storageBucket: values.storageBucket,
    messagingSenderId: values.messagingSenderId,
  };

  const allFirebaseEmpty = Object.values(firebase).every(v => v === "");
  const isIframe = values.mode === "iframe";
  const isIframeDialog = values.mode === "iframe-dialog";
  const isIframeElement = values.mode === "iframe-element";

  const iframeContainer = isIframe
    ? (document.getElementById("iframe-container") as HTMLElement)
    : undefined;

  let dialogContainer: HTMLElement | undefined;

  if (isIframeDialog) {
    const dialog = document.getElementById("iframe-dialog") as HTMLDialogElement;

    dialogContainer = dialog.querySelector<HTMLElement>(".dialog-iframe-container") ?? undefined;
    dialog.showModal();
  }

  let existingIframe: HTMLIFrameElement | undefined;

  if (isIframeElement) {
    existingIframe = document.getElementById("fireguard-iframe") as HTMLIFrameElement;
    existingIframe.style.display = "block";
  }
  else {
    const el = document.getElementById("fireguard-iframe") as HTMLIFrameElement;

    el.style.display = "none";
  }

  const options = {
    url: values.url,
    ...(isIframe
      ? { mode: "iframe" as const, iframe: { container: iframeContainer! } }
      : isIframeDialog
        ? { mode: "iframe" as const, iframe: { container: dialogContainer! } }
        : isIframeElement
          ? { mode: "iframe" as const, iframe: { element: existingIframe! } }
          : {}),
    ...(values.dimWidth || values.dimHeight
      ? {
          dim: {
            ...(values.dimWidth ? { width: Number(values.dimWidth) } : {}),
            ...(values.dimHeight ? { height: Number(values.dimHeight) } : {}),
          },
        }
      : {}),
    ...(values.posX || values.posY
      ? {
          pos: {
            ...(values.posX ? { x: Number(values.posX) } : {}),
            ...(values.posY ? { y: Number(values.posY) } : {}),
          },
        }
      : {}),
    config: {
      name: values.name,
      ...(values.logo ? { logo: values.logo } : {}),
      provider: values.provider.toLowerCase() || "google",
      ...(values.themeText && values.themePrimary && values.themeSecondary
        ? {
            theme: {
              text: values.themeText,
              primary: values.themePrimary,
              secondary: values.themeSecondary,
            },
          }
        : {}),
      firebase: allFirebaseEmpty ? ({} as typeof firebase) : firebase,
    },
  };

  const pendingMsg = (isIframe || isIframeDialog || isIframeElement)
    ? "Waiting for authentication in iframe..."
    : "Waiting for authentication...";

  setResult("pending", pendingMsg);

  try {
    const token = await FiremittHelper.auth(options);

    if (isIframeDialog) {
      (document.getElementById("iframe-dialog") as HTMLDialogElement).close();
    }

    setResult("success", `Token: ${token}`);
  }
  catch (err) {
    if (isIframeDialog) {
      (document.getElementById("iframe-dialog") as HTMLDialogElement).close();
    }

    const message = err instanceof Error ? err.message : String(err);

    setResult("error", message);
  }
}

function buildScenarios(): void {
  const list = document.getElementById("scenario-list") as HTMLElement;

  for (const scenario of SCENARIOS) {
    const item = document.createElement("div");

    item.className = "scenario-item";

    const btn = document.createElement("button");

    btn.className = "scenario-btn";
    btn.textContent = scenario.label;
    btn.title = scenario.description;
    btn.addEventListener("click", () => {
      applyPreset(scenario.preset);
      setActiveScenario(btn);
      document.getElementById("scenario-desc")!.textContent = scenario.description;
    });

    item.appendChild(btn);
    list.appendChild(item);
  }
}

function setActiveScenario(active: HTMLButtonElement): void {
  document.querySelectorAll(".scenario-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  active.classList.add("active");
}

function buildUrlPresets(): void {
  const presets = [
    { label: "localhost:5173", value: "http://localhost:5173" },
    { label: "localhost:5174", value: "http://localhost:5174" },
    { label: "localhost:8080", value: "http://localhost:8080" },
    { label: "Hosted", value: "https://ouss.es/fireguard" },
  ];

  const bar = document.getElementById("url-presets") as HTMLElement;

  for (const preset of presets) {
    const btn = document.createElement("button");

    btn.className = "url-preset-btn";
    btn.textContent = preset.label;
    btn.dataset.url = preset.value;
    btn.addEventListener("click", () => {
      getField("url").value = preset.value;
      syncUrlChips(preset.value);
    });

    bar.appendChild(btn);
  }
}

function seedFromEnv(): void {
  const fields: Array<[string, string]> = [
    ["apiKey", import.meta.env.VITE_FIREBASE_API_KEY ?? ""],
    ["appId", import.meta.env.VITE_FIREBASE_APP_ID ?? ""],
    ["projectId", import.meta.env.VITE_FIREBASE_PROJECT_ID ?? ""],
    ["authDomain", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? ""],
    ["measurementId", import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? ""],
    ["storageBucket", import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? ""],
    ["messagingSenderId", import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? ""],
  ];

  for (const [id, value] of fields) {
    if (value) {
      getField(id).value = value;
    }
  }
}

function init(): void {
  getField("url").value = DEFAULT_FIREGUARD_URL;

  buildUrlPresets();
  buildScenarios();
  seedFromEnv();
  syncUrlChips(DEFAULT_FIREGUARD_URL);

  getField("url").addEventListener("input", () => {
    syncUrlChips(getField("url").value.trim());
  });

  document.getElementById("run-btn")!.addEventListener("click", () => {
    void runAuth();
  });
}

init();
