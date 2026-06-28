//#region src/enums/error-type.enum.ts
var e = /* @__PURE__ */ function(e) {
	return e[e.InvalidURL = 1] = "InvalidURL", e[e.InvalidApp = 2] = "InvalidApp", e[e.InvalidAppName = 3] = "InvalidAppName", e[e.InvalidProvider = 4] = "InvalidProvider", e[e.InvalidFirebaseConfig = 5] = "InvalidFirebaseConfig", e[e.InvalidDim = 6] = "InvalidDim", e[e.InvalidIframe = 7] = "InvalidIframe", e;
}({}), t = /* @__PURE__ */ function(e) {
	return e[e.Loaded = 0] = "Loaded", e[e.Config = 1] = "Config", e[e.AuthSucceded = 2] = "AuthSucceded", e[e.AuthFailed = 3] = "AuthFailed", e[e.Retry = 4] = "Retry", e[e.Closed = 5] = "Closed", e;
}({}), n = {
	GOOGLE: "google",
	GITHUB: "github",
	FACEBOOK: "facebook",
	TWITTER: "twitter",
	MICROSOFT: "microsoft",
	APPLE: "apple",
	YAHOO: "yahoo"
};
//#endregion
//#region \0@oxc-project+runtime@0.137.0/helpers/esm/typeof.js
function r(e) {
	"@babel/helpers - typeof";
	return r = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, r(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.137.0/helpers/esm/toPrimitive.js
function i(e, t) {
	if (r(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var i = n.call(e, t || "default");
		if (r(i) != "object") return i;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.137.0/helpers/esm/toPropertyKey.js
function a(e) {
	var t = i(e, "string");
	return r(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.137.0/helpers/esm/defineProperty.js
function o(e, t, n) {
	return (t = a(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
//#region src/errors/base.error.ts
var s = class extends Error {
	constructor(t, n) {
		super(n), o(this, "type", void 0), this.type = t, this.name = `${ne.getName(e, t) ?? "Base"}Error`;
	}
	toString() {
		return `[${this.name}] ${this.message}.`;
	}
	toObject() {
		return {
			type: this.type,
			name: this.name,
			message: this.message
		};
	}
}, c = class extends s {
	constructor() {
		super(e.InvalidAppName, "Invalid app name, please specify a name for your app");
	}
}, l = class extends s {
	constructor() {
		super(e.InvalidApp, "Invalid Firebase app, failed initializing fire base with the given configuration");
	}
}, u = class extends s {
	constructor() {
		super(e.InvalidDim, "Invalid dimensions, width and height must be valid numbers");
	}
}, d = class extends s {
	constructor() {
		super(e.InvalidFirebaseConfig, "Invalid Firebase configuration");
	}
}, f = class extends s {
	constructor() {
		super(e.InvalidIframe, "iframe mode requires either an iframe element or a container element");
	}
}, p = class extends s {
	constructor(t) {
		super(e.InvalidProvider, `Invalid provider, "${t}" is not a valid provider name`);
	}
}, ee = class extends s {
	constructor() {
		super(e.InvalidURL, "Invalid URL name, please specify a valid URL for a Fireguard instance");
	}
}, te = class {
	static encode(e) {
		let t = JSON.stringify(e);
		return btoa(t);
	}
	static decode(e) {
		let t = atob(e);
		return JSON.parse(t);
	}
}, m = class {
	static getDim(e, t) {
		let n = Number.parseFloat((e ?? 450).toString()), r = Number.parseFloat((t ?? 260).toString());
		if (Number.isNaN(n) || Number.isNaN(r)) throw new u();
		return {
			width: n,
			height: r
		};
	}
	static getPos(e, t, n) {
		let r = Number.parseFloat((t ?? 50).toString());
		return {
			x: Number.parseFloat((e ?? window.screen.width / 2 - n / 2).toString()),
			y: r
		};
	}
	static getURL(e) {
		let t = Ya.shape.url.safeParse(e ?? "");
		if (!t.success) throw new ee();
		return new URL(t.data).toString();
	}
	static getFireguardConfig(e) {
		let t = e?.name ?? "", n = e?.logo ?? "", r = {
			text: e?.theme?.text || "#1a3544",
			primary: e?.theme?.primary || "#ffe536",
			secondary: e?.theme?.secondary || "#1a3544",
			background: e?.theme?.background || "#ffffff"
		}, i = e?.firebase ?? {
			apiKey: "",
			appId: "",
			projectId: "",
			authDomain: "",
			measurementId: "",
			storageBucket: "",
			messagingSenderId: ""
		}, a = e?.provider ?? "google";
		if (!Ja.shape.name.safeParse(t).success) throw new c();
		if (!qa.safeParse(i).success) throw new d();
		return {
			name: t,
			logo: n,
			theme: r,
			firebase: i,
			provider: a
		};
	}
	static init(e) {
		let t = this.getURL(e.url), n = this.getDim(e?.dim?.width, e?.dim?.height);
		return {
			url: t,
			dim: n,
			pos: this.getPos(e?.pos?.x, e?.pos?.y, n.width),
			fireguard: this.getFireguardConfig(e?.config)
		};
	}
	static getFlags(e) {
		return [
			`width=${e.dim.width}`,
			`height=${e.dim.height}`,
			`left=${e.pos.x}`,
			`top=${e.pos.y}`
		].join(",");
	}
}, ne = class {
	static getName(e, t) {
		return Object.keys(e).find((n) => e[n] === t);
	}
}, h = class {
	static cleanup() {
		for (let e of this.handlers) this.hostWindow.removeEventListener("message", e);
		this.handlers.clear();
	}
	static init(e) {
		return this.hostWindow = window, this.cleanup(), this.target = e, !!this.target;
	}
	static send(e, t) {
		let n = {
			type: e,
			payload: { ...t }
		}, r = te.encode(n);
		return this.target.postMessage(r, "*"), this;
	}
	static on(e, t) {
		let n = (r) => {
			if (r.isTrusted) {
				let i;
				try {
					i = te.decode(r.data);
				} catch {
					return;
				}
				i.type === e && (t(i.payload), this.hostWindow.removeEventListener("message", n), this.handlers.delete(n));
			}
		};
		return this.handlers.add(n), this.hostWindow.addEventListener("message", n), this;
	}
};
o(h, "target", void 0), o(h, "hostWindow", globalThis.window), o(h, "handlers", /* @__PURE__ */ new Set());
//#endregion
//#region src/helpers/firemitt.helper.ts
var re = 500, ie = class e {
	/* v8 ignore next */
	static runSession(e, n) {
		return new Promise((r, i) => {
			let a = !1, o = (e) => {
				a || (a = !0, n(), e());
			}, s = () => {
				h.send(t.Config, e).on(t.AuthSucceded, (e) => {
					o(() => r(e.token));
				}).on(t.AuthFailed, (e) => {
					o(() => i(e.error));
				}).on(t.Closed, () => {
					o(() => i(/* @__PURE__ */ Error("The authentication window was closed.")));
				}), h.on(t.Loaded, s);
			};
			h.on(t.Loaded, s).on(t.Retry, () => {});
		});
	}
	static authPopup(e) {
		let n = m.init(e), r = m.getFlags(n), i = window.open(n.url, "_blank", r);
		if (!h.init(i)) return new Promise(() => {});
		let a;
		return new Promise((e, r) => {
			let o = !1, s = (e) => {
				o || (o = !0, clearInterval(a), e());
			};
			a = setInterval(() => {
				i.closed && s(() => r(/* @__PURE__ */ Error("The authentication window was closed.")));
			}, re);
			let c = () => {
				h.send(t.Config, n.fireguard).on(t.AuthSucceded, (t) => {
					s(() => e(t.token));
				}).on(t.AuthFailed, (e) => {
					s(() => r(e.error));
				}).on(t.Closed, () => {
					s(() => r(/* @__PURE__ */ Error("The authentication window was closed.")));
				}), h.on(t.Loaded, c);
			};
			h.on(t.Loaded, c).on(t.Retry, () => {});
		});
	}
	static authIframe(t) {
		let { iframe: n } = t;
		if (!n?.element && !n?.container) throw new f();
		e.cancelActiveIframe?.(), e.cancelActiveIframe = null;
		let r = m.init(t), i, a = !1;
		n.element ? i = n.element : (i = document.createElement("iframe"), a = !0, n.container.appendChild(i)), a && (i.style.width = `${r.dim.width}px`, i.style.height = `${r.dim.height}px`), i.src = r.url;
		let o = () => {
			e.cancelActiveIframe = null, a && i.parentNode && i.parentNode.removeChild(i);
		};
		return new Promise((t, n) => {
			let a = !1;
			e.cancelActiveIframe = () => {
				a = !0, o(), n(/* @__PURE__ */ Error("A new authentication session was started."));
			}, i.addEventListener("load", () => {
				if (a) return;
				let s = i.contentWindow;
				if (!s || !h.init(s)) {
					o(), n(/* @__PURE__ */ Error("Could not access the iframe window."));
					return;
				}
				e.runSession(r.fireguard, o).then(t, n);
			}, { once: !0 });
		});
	}
	static auth(t) {
		return t.mode === "iframe" ? e.authIframe(t) : e.authPopup(t);
	}
};
o(ie, "cancelActiveIframe", null);
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
var ae;
function g(e, t, n) {
	function r(n, r) {
		if (n._zod || Object.defineProperty(n, "_zod", {
			value: {
				def: r,
				constr: o,
				traits: /* @__PURE__ */ new Set()
			},
			enumerable: !1
		}), n._zod.traits.has(e)) return;
		n._zod.traits.add(e), t(n, r);
		let i = o.prototype, a = Object.keys(i);
		for (let e = 0; e < a.length; e++) {
			let t = a[e];
			t in n || (n[t] = i[t].bind(n));
		}
	}
	let i = n?.Parent ?? Object;
	class a extends i {}
	Object.defineProperty(a, "name", { value: e });
	function o(e) {
		var t;
		let i = n?.Parent ? new a() : this;
		r(i, e), (t = i._zod).deferred ?? (t.deferred = []);
		for (let e of i._zod.deferred) e();
		return i;
	}
	return Object.defineProperty(o, "init", { value: r }), Object.defineProperty(o, Symbol.hasInstance, { value: (t) => n?.Parent && t instanceof n.Parent ? !0 : t?._zod?.traits?.has(e) }), Object.defineProperty(o, "name", { value: e }), o;
}
var _ = class extends Error {
	constructor() {
		super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
	}
}, oe = class extends Error {
	constructor(e) {
		super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
	}
};
(ae = globalThis).__zod_globalConfig ?? (ae.__zod_globalConfig = {});
var v = globalThis.__zod_globalConfig;
function y(e) {
	return e && Object.assign(v, e), v;
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
function se(e) {
	let t = Object.values(e).filter((e) => typeof e == "number");
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function ce(e, t) {
	return typeof t == "bigint" ? t.toString() : t;
}
function le(e) {
	return { get value() {
		{
			let t = e();
			return Object.defineProperty(this, "value", { value: t }), t;
		}
		throw Error("cached value already set");
	} };
}
function ue(e) {
	return e == null;
}
function de(e) {
	let t = +!!e.startsWith("^"), n = e.endsWith("$") ? e.length - 1 : e.length;
	return e.slice(t, n);
}
function fe(e, t) {
	let n = e / t, r = Math.round(n), i = 2 ** -52 * Math.max(Math.abs(n), 1);
	return Math.abs(n - r) < i ? 0 : n - r;
}
var pe = /* @__PURE__*/ Symbol("evaluating");
function b(e, t, n) {
	let r;
	Object.defineProperty(e, t, {
		get() {
			if (r !== pe) return r === void 0 && (r = pe, r = n()), r;
		},
		set(n) {
			Object.defineProperty(e, t, { value: n });
		},
		configurable: !0
	});
}
function x(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function S(...e) {
	let t = {};
	for (let n of e) {
		let e = Object.getOwnPropertyDescriptors(n);
		Object.assign(t, e);
	}
	return Object.defineProperties({}, t);
}
function me(e) {
	return JSON.stringify(e);
}
function he(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var ge = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function C(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var _e = /* @__PURE__*/ le(() => {
	if (v.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
	try {
		return Function(""), !0;
	} catch {
		return !1;
	}
});
function w(e) {
	if (C(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != "function") return !0;
	let n = t.prototype;
	return !(C(n) === !1 || Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") === !1);
}
function ve(e) {
	return w(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
var ye = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function T(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function E(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function D(e) {
	let t = e;
	if (!t) return {};
	if (typeof t == "string") return { error: () => t };
	if (t?.message !== void 0) {
		if (t?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
		t.error = t.message;
	}
	return delete t.message, typeof t.error == "string" ? {
		...t,
		error: () => t.error
	} : t;
}
function be(e) {
	return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
var xe = {
	safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function Se(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
	return E(e, S(e._zod.def, {
		get shape() {
			let e = {};
			for (let r in t) {
				if (!(r in n.shape)) throw Error(`Unrecognized key: "${r}"`);
				t[r] && (e[r] = n.shape[r]);
			}
			return x(this, "shape", e), e;
		},
		checks: []
	}));
}
function Ce(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
	return E(e, S(e._zod.def, {
		get shape() {
			let r = { ...e._zod.def.shape };
			for (let e in t) {
				if (!(e in n.shape)) throw Error(`Unrecognized key: "${e}"`);
				t[e] && delete r[e];
			}
			return x(this, "shape", r), r;
		},
		checks: []
	}));
}
function we(e, t) {
	if (!w(t)) throw Error("Invalid input to extend: expected a plain object");
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = e._zod.def.shape;
		for (let e in t) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return E(e, S(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return x(this, "shape", n), n;
	} }));
}
function Te(e, t) {
	if (!w(t)) throw Error("Invalid input to safeExtend: expected a plain object");
	return E(e, S(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return x(this, "shape", n), n;
	} }));
}
function Ee(e, t) {
	if (e._zod.def.checks?.length) throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	return E(e, S(e._zod.def, {
		get shape() {
			let n = {
				...e._zod.def.shape,
				...t._zod.def.shape
			};
			return x(this, "shape", n), n;
		},
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: t._zod.def.checks ?? []
	}));
}
function De(e, t, n) {
	let r = t._zod.def.checks;
	if (r && r.length > 0) throw Error(".partial() cannot be used on object schemas containing refinements");
	return E(t, S(t._zod.def, {
		get shape() {
			let r = t._zod.def.shape, i = { ...r };
			if (n) for (let t in n) {
				if (!(t in r)) throw Error(`Unrecognized key: "${t}"`);
				n[t] && (i[t] = e ? new e({
					type: "optional",
					innerType: r[t]
				}) : r[t]);
			}
			else for (let t in r) i[t] = e ? new e({
				type: "optional",
				innerType: r[t]
			}) : r[t];
			return x(this, "shape", i), i;
		},
		checks: []
	}));
}
function Oe(e, t, n) {
	return E(t, S(t._zod.def, { get shape() {
		let r = t._zod.def.shape, i = { ...r };
		if (n) for (let t in n) {
			if (!(t in i)) throw Error(`Unrecognized key: "${t}"`);
			n[t] && (i[t] = new e({
				type: "nonoptional",
				innerType: r[t]
			}));
		}
		else for (let t in r) i[t] = new e({
			type: "nonoptional",
			innerType: r[t]
		});
		return x(this, "shape", i), i;
	} }));
}
function O(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function ke(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue === !1) return !0;
	return !1;
}
function Ae(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function k(e) {
	return typeof e == "string" ? e : e?.message;
}
function A(e, t, n) {
	let r = e.message ? e.message : k(e.inst?._zod.def?.error?.(e)) ?? k(t?.error?.(e)) ?? k(n.customError?.(e)) ?? k(n.localeError?.(e)) ?? "Invalid input", { inst: i, continue: a, input: o, ...s } = e;
	return s.path ?? (s.path = []), s.message = r, t?.reportInput && (s.input = o), s;
}
function je(e) {
	return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function j(...e) {
	let [t, n, r] = e;
	return typeof t == "string" ? {
		message: t,
		code: "custom",
		input: n,
		inst: r
	} : { ...t };
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
var Me = (e, t) => {
	e.name = "$ZodError", Object.defineProperty(e, "_zod", {
		value: e._zod,
		enumerable: !1
	}), Object.defineProperty(e, "issues", {
		value: t,
		enumerable: !1
	}), e.message = JSON.stringify(t, ce, 2), Object.defineProperty(e, "toString", {
		value: () => e.message,
		enumerable: !1
	});
}, Ne = g("$ZodError", Me), Pe = g("$ZodError", Me, { Parent: Error });
function Fe(e, t = (e) => e.message) {
	let n = {}, r = [];
	for (let i of e.issues) i.path.length > 0 ? (n[i.path[0]] = n[i.path[0]] || [], n[i.path[0]].push(t(i))) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function Ie(e, t = (e) => e.message) {
	let n = { _errors: [] }, r = (e, i = []) => {
		for (let a of e.issues) if (a.code === "invalid_union" && a.errors.length) a.errors.map((e) => r({ issues: e }, [...i, ...a.path]));
		else if (a.code === "invalid_key") r({ issues: a.issues }, [...i, ...a.path]);
		else if (a.code === "invalid_element") r({ issues: a.issues }, [...i, ...a.path]);
		else {
			let e = [...i, ...a.path];
			if (e.length === 0) n._errors.push(t(a));
			else {
				let r = n, i = 0;
				for (; i < e.length;) {
					let n = e[i];
					i === e.length - 1 ? (r[n] = r[n] || { _errors: [] }, r[n]._errors.push(t(a))) : r[n] = r[n] || { _errors: [] }, r = r[n], i++;
				}
			}
		}
	};
	return r(e), n;
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
var Le = (e) => (t, n, r, i) => {
	let a = r ? {
		...r,
		async: !1
	} : { async: !1 }, o = t._zod.run({
		value: n,
		issues: []
	}, a);
	if (o instanceof Promise) throw new _();
	if (o.issues.length) {
		let t = new ((i?.Err) ?? e)(o.issues.map((e) => A(e, a, y())));
		throw ge(t, i?.callee), t;
	}
	return o.value;
}, Re = (e) => async (t, n, r, i) => {
	let a = r ? {
		...r,
		async: !0
	} : { async: !0 }, o = t._zod.run({
		value: n,
		issues: []
	}, a);
	if (o instanceof Promise && (o = await o), o.issues.length) {
		let t = new ((i?.Err) ?? e)(o.issues.map((e) => A(e, a, y())));
		throw ge(t, i?.callee), t;
	}
	return o.value;
}, M = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		async: !1
	} : { async: !1 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	if (a instanceof Promise) throw new _();
	return a.issues.length ? {
		success: !1,
		error: new (e ?? Ne)(a.issues.map((e) => A(e, i, y())))
	} : {
		success: !0,
		data: a.value
	};
}, ze = /* @__PURE__*/ M(Pe), N = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		async: !0
	} : { async: !0 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	return a instanceof Promise && (a = await a), a.issues.length ? {
		success: !1,
		error: new e(a.issues.map((e) => A(e, i, y())))
	} : {
		success: !0,
		data: a.value
	};
}, Be = /* @__PURE__*/ N(Pe), Ve = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return Le(e)(t, n, i);
}, He = (e) => (t, n, r) => Le(e)(t, n, r), Ue = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return Re(e)(t, n, i);
}, We = (e) => async (t, n, r) => Re(e)(t, n, r), Ge = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return M(e)(t, n, i);
}, Ke = (e) => (t, n, r) => M(e)(t, n, r), qe = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return N(e)(t, n, i);
}, Je = (e) => async (t, n, r) => N(e)(t, n, r), Ye = /^[cC][0-9a-z]{6,}$/, Xe = /^[0-9a-z]+$/, Ze = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Qe = /^[0-9a-vA-V]{20}$/, $e = /^[A-Za-z0-9]{27}$/, et = /^[a-zA-Z0-9_-]{21}$/, tt = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, nt = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, rt = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, it = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, at = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function ot() {
	return new RegExp(at, "u");
}
var st = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ct = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, lt = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, ut = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, dt = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, ft = /^[A-Za-z0-9_-]*$/, pt = /^https?$/, mt = /^\+[1-9]\d{6,14}$/, ht = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", gt = /*@__PURE__*/ RegExp(`^${ht}$`);
function _t(e) {
	let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
	return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function vt(e) {
	return RegExp(`^${_t(e)}$`);
}
function yt(e) {
	let t = _t({ precision: e.precision }), n = ["Z"];
	e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
	let r = `${t}(?:${n.join("|")})`;
	return RegExp(`^${ht}T(?:${r})$`);
}
var bt = (e) => {
	let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
	return RegExp(`^${t}$`);
}, xt = /^-?\d+$/, St = /^-?\d+(?:\.\d+)?$/, Ct = /^[^A-Z]*$/, wt = /^[^a-z]*$/, P = /*@__PURE__*/ g("$ZodCheck", (e, t) => {
	var n;
	e._zod ?? (e._zod = {}), e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), Tt = {
	number: "number",
	bigint: "bigint",
	object: "date"
}, Et = /*@__PURE__*/ g("$ZodCheckLessThan", (e, t) => {
	P.init(e, t);
	let n = Tt[typeof t.value];
	e._zod.onattach.push((e) => {
		let n = e._zod.bag, r = (t.inclusive ? n.maximum : n.exclusiveMaximum) ?? Infinity;
		t.value < r && (t.inclusive ? n.maximum = t.value : n.exclusiveMaximum = t.value);
	}), e._zod.check = (r) => {
		(t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
			origin: n,
			code: "too_big",
			maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), Dt = /*@__PURE__*/ g("$ZodCheckGreaterThan", (e, t) => {
	P.init(e, t);
	let n = Tt[typeof t.value];
	e._zod.onattach.push((e) => {
		let n = e._zod.bag, r = (t.inclusive ? n.minimum : n.exclusiveMinimum) ?? -Infinity;
		t.value > r && (t.inclusive ? n.minimum = t.value : n.exclusiveMinimum = t.value);
	}), e._zod.check = (r) => {
		(t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
			origin: n,
			code: "too_small",
			minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), Ot = /*@__PURE__*/ g("$ZodCheckMultipleOf", (e, t) => {
	P.init(e, t), e._zod.onattach.push((e) => {
		var n;
		(n = e._zod.bag).multipleOf ?? (n.multipleOf = t.value);
	}), e._zod.check = (n) => {
		if (typeof n.value != typeof t.value) throw Error("Cannot mix number and bigint in multiple_of check.");
		(typeof n.value == "bigint" ? n.value % t.value === BigInt(0) : fe(n.value, t.value) === 0) || n.issues.push({
			origin: typeof n.value,
			code: "not_multiple_of",
			divisor: t.value,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), kt = /*@__PURE__*/ g("$ZodCheckNumberFormat", (e, t) => {
	P.init(e, t), t.format = t.format || "float64";
	let n = t.format?.includes("int"), r = n ? "int" : "number", [i, a] = xe[t.format];
	e._zod.onattach.push((e) => {
		let r = e._zod.bag;
		r.format = t.format, r.minimum = i, r.maximum = a, n && (r.pattern = xt);
	}), e._zod.check = (o) => {
		let s = o.value;
		if (n) {
			if (!Number.isInteger(s)) {
				o.issues.push({
					expected: r,
					format: t.format,
					code: "invalid_type",
					continue: !1,
					input: s,
					inst: e
				});
				return;
			}
			if (!Number.isSafeInteger(s)) {
				s > 0 ? o.issues.push({
					input: s,
					code: "too_big",
					maximum: 2 ** 53 - 1,
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				}) : o.issues.push({
					input: s,
					code: "too_small",
					minimum: -(2 ** 53 - 1),
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				});
				return;
			}
		}
		s < i && o.issues.push({
			origin: "number",
			input: s,
			code: "too_small",
			minimum: i,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		}), s > a && o.issues.push({
			origin: "number",
			input: s,
			code: "too_big",
			maximum: a,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		});
	};
}), At = /*@__PURE__*/ g("$ZodCheckMaxLength", (e, t) => {
	var n;
	P.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !ue(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag.maximum ?? Infinity;
		t.maximum < n && (e._zod.bag.maximum = t.maximum);
	}), e._zod.check = (n) => {
		let r = n.value;
		if (r.length <= t.maximum) return;
		let i = je(r);
		n.issues.push({
			origin: i,
			code: "too_big",
			maximum: t.maximum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), jt = /*@__PURE__*/ g("$ZodCheckMinLength", (e, t) => {
	var n;
	P.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !ue(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag.minimum ?? -Infinity;
		t.minimum > n && (e._zod.bag.minimum = t.minimum);
	}), e._zod.check = (n) => {
		let r = n.value;
		if (r.length >= t.minimum) return;
		let i = je(r);
		n.issues.push({
			origin: i,
			code: "too_small",
			minimum: t.minimum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), Mt = /*@__PURE__*/ g("$ZodCheckLengthEquals", (e, t) => {
	var n;
	P.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !ue(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag;
		n.minimum = t.length, n.maximum = t.length, n.length = t.length;
	}), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if (i === t.length) return;
		let a = je(r), o = i > t.length;
		n.issues.push({
			origin: a,
			...o ? {
				code: "too_big",
				maximum: t.length
			} : {
				code: "too_small",
				minimum: t.length
			},
			inclusive: !0,
			exact: !0,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), F = /*@__PURE__*/ g("$ZodCheckStringFormat", (e, t) => {
	var n, r;
	P.init(e, t), e._zod.onattach.push((e) => {
		let n = e._zod.bag;
		n.format = t.format, t.pattern && (n.patterns ?? (n.patterns = /* @__PURE__ */ new Set()), n.patterns.add(t.pattern));
	}), t.pattern ? (n = e._zod).check ?? (n.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: t.format,
			input: n.value,
			...t.pattern ? { pattern: t.pattern.toString() } : {},
			inst: e,
			continue: !t.abort
		});
	}) : (r = e._zod).check ?? (r.check = () => {});
}), Nt = /*@__PURE__*/ g("$ZodCheckRegex", (e, t) => {
	F.init(e, t), e._zod.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: n.value,
			pattern: t.pattern.toString(),
			inst: e,
			continue: !t.abort
		});
	};
}), Pt = /*@__PURE__*/ g("$ZodCheckLowerCase", (e, t) => {
	t.pattern ?? (t.pattern = Ct), F.init(e, t);
}), Ft = /*@__PURE__*/ g("$ZodCheckUpperCase", (e, t) => {
	t.pattern ?? (t.pattern = wt), F.init(e, t);
}), It = /*@__PURE__*/ g("$ZodCheckIncludes", (e, t) => {
	P.init(e, t);
	let n = T(t.includes), r = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${n}` : n);
	t.pattern = r, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ?? (t.patterns = /* @__PURE__ */ new Set()), t.patterns.add(r);
	}), e._zod.check = (n) => {
		n.value.includes(t.includes, t.position) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: t.includes,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Lt = /*@__PURE__*/ g("$ZodCheckStartsWith", (e, t) => {
	P.init(e, t);
	let n = RegExp(`^${T(t.prefix)}.*`);
	t.pattern ?? (t.pattern = n), e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ?? (t.patterns = /* @__PURE__ */ new Set()), t.patterns.add(n);
	}), e._zod.check = (n) => {
		n.value.startsWith(t.prefix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: t.prefix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Rt = /*@__PURE__*/ g("$ZodCheckEndsWith", (e, t) => {
	P.init(e, t);
	let n = RegExp(`.*${T(t.suffix)}$`);
	t.pattern ?? (t.pattern = n), e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ?? (t.patterns = /* @__PURE__ */ new Set()), t.patterns.add(n);
	}), e._zod.check = (n) => {
		n.value.endsWith(t.suffix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: t.suffix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), zt = /*@__PURE__*/ g("$ZodCheckOverwrite", (e, t) => {
	P.init(e, t), e._zod.check = (e) => {
		e.value = t.tx(e.value);
	};
}), Bt = class {
	constructor(e = []) {
		this.content = [], this.indent = 0, this && (this.args = e);
	}
	indented(e) {
		this.indent += 1, e(this), --this.indent;
	}
	write(e) {
		if (typeof e == "function") {
			e(this, { execution: "sync" }), e(this, { execution: "async" });
			return;
		}
		let t = e.split("\n").filter((e) => e), n = Math.min(...t.map((e) => e.length - e.trimStart().length)), r = t.map((e) => e.slice(n)).map((e) => " ".repeat(this.indent * 2) + e);
		for (let e of r) this.content.push(e);
	}
	compile() {
		let e = Function, t = this?.args, n = [...(this?.content ?? [""]).map((e) => `  ${e}`)];
		return new e(...t, n.join("\n"));
	}
}, Vt = {
	major: 4,
	minor: 4,
	patch: 3
}, I = /*@__PURE__*/ g("$ZodType", (e, t) => {
	var n;
	e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = Vt;
	let r = [...e._zod.def.checks ?? []];
	e._zod.traits.has("$ZodCheck") && r.unshift(e);
	for (let t of r) for (let n of t._zod.onattach) n(e);
	if (r.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
		e._zod.run = e._zod.parse;
	});
	else {
		let t = (e, t, n) => {
			let r = O(e), i;
			for (let a of t) {
				if (a._zod.def.when) {
					if (ke(e) || !a._zod.def.when(e)) continue;
				} else if (r) continue;
				let t = e.issues.length, o = a._zod.check(e);
				if (o instanceof Promise && n?.async === !1) throw new _();
				if (i || o instanceof Promise) i = (i ?? Promise.resolve()).then(async () => {
					await o, e.issues.length !== t && (r || (r = O(e, t)));
				});
				else {
					if (e.issues.length === t) continue;
					r || (r = O(e, t));
				}
			}
			return i ? i.then(() => e) : e;
		}, n = (n, i, a) => {
			if (O(n)) return n.aborted = !0, n;
			let o = t(i, r, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new _();
				return o.then((t) => e._zod.parse(t, a));
			}
			return e._zod.parse(o, a);
		};
		e._zod.run = (i, a) => {
			if (a.skipChecks) return e._zod.parse(i, a);
			if (a.direction === "backward") {
				let t = e._zod.parse({
					value: i.value,
					issues: []
				}, {
					...a,
					skipChecks: !0
				});
				return t instanceof Promise ? t.then((e) => n(e, i, a)) : n(t, i, a);
			}
			let o = e._zod.parse(i, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new _();
				return o.then((e) => t(e, r, a));
			}
			return t(o, r, a);
		};
	}
	b(e, "~standard", () => ({
		validate: (t) => {
			try {
				let n = ze(e, t);
				return n.success ? { value: n.data } : { issues: n.error?.issues };
			} catch {
				return Be(e, t).then((e) => e.success ? { value: e.data } : { issues: e.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
}), Ht = /*@__PURE__*/ g("$ZodString", (e, t) => {
	I.init(e, t), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? bt(e._zod.bag), e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = String(n.value);
		} catch {}
		return typeof n.value == "string" || n.issues.push({
			expected: "string",
			code: "invalid_type",
			input: n.value,
			inst: e
		}), n;
	};
}), L = /*@__PURE__*/ g("$ZodStringFormat", (e, t) => {
	F.init(e, t), Ht.init(e, t);
}), Ut = /*@__PURE__*/ g("$ZodGUID", (e, t) => {
	t.pattern ?? (t.pattern = nt), L.init(e, t);
}), Wt = /*@__PURE__*/ g("$ZodUUID", (e, t) => {
	if (t.version) {
		let e = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[t.version];
		if (e === void 0) throw Error(`Invalid UUID version: "${t.version}"`);
		t.pattern ?? (t.pattern = rt(e));
	} else t.pattern ?? (t.pattern = rt());
	L.init(e, t);
}), Gt = /*@__PURE__*/ g("$ZodEmail", (e, t) => {
	t.pattern ?? (t.pattern = it), L.init(e, t);
}), Kt = /*@__PURE__*/ g("$ZodURL", (e, t) => {
	L.init(e, t), e._zod.check = (n) => {
		try {
			let r = n.value.trim();
			if (!t.normalize && t.protocol?.source === pt.source && !/^https?:\/\//i.test(r)) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			let i = new URL(r);
			t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(i.hostname) || n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: t.hostname.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			})), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(i.protocol.endsWith(":") ? i.protocol.slice(0, -1) : i.protocol) || n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: t.protocol.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			})), t.normalize ? n.value = i.href : n.value = r;
			return;
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "url",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), qt = /*@__PURE__*/ g("$ZodEmoji", (e, t) => {
	t.pattern ?? (t.pattern = ot()), L.init(e, t);
}), Jt = /*@__PURE__*/ g("$ZodNanoID", (e, t) => {
	t.pattern ?? (t.pattern = et), L.init(e, t);
}), Yt = /*@__PURE__*/ g("$ZodCUID", (e, t) => {
	t.pattern ?? (t.pattern = Ye), L.init(e, t);
}), Xt = /*@__PURE__*/ g("$ZodCUID2", (e, t) => {
	t.pattern ?? (t.pattern = Xe), L.init(e, t);
}), Zt = /*@__PURE__*/ g("$ZodULID", (e, t) => {
	t.pattern ?? (t.pattern = Ze), L.init(e, t);
}), Qt = /*@__PURE__*/ g("$ZodXID", (e, t) => {
	t.pattern ?? (t.pattern = Qe), L.init(e, t);
}), $t = /*@__PURE__*/ g("$ZodKSUID", (e, t) => {
	t.pattern ?? (t.pattern = $e), L.init(e, t);
}), en = /*@__PURE__*/ g("$ZodISODateTime", (e, t) => {
	t.pattern ?? (t.pattern = yt(t)), L.init(e, t);
}), tn = /*@__PURE__*/ g("$ZodISODate", (e, t) => {
	t.pattern ?? (t.pattern = gt), L.init(e, t);
}), nn = /*@__PURE__*/ g("$ZodISOTime", (e, t) => {
	t.pattern ?? (t.pattern = vt(t)), L.init(e, t);
}), rn = /*@__PURE__*/ g("$ZodISODuration", (e, t) => {
	t.pattern ?? (t.pattern = tt), L.init(e, t);
}), an = /*@__PURE__*/ g("$ZodIPv4", (e, t) => {
	t.pattern ?? (t.pattern = st), L.init(e, t), e._zod.bag.format = "ipv4";
}), on = /*@__PURE__*/ g("$ZodIPv6", (e, t) => {
	t.pattern ?? (t.pattern = ct), L.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
		try {
			new URL(`http://[${n.value}]`);
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "ipv6",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), sn = /*@__PURE__*/ g("$ZodCIDRv4", (e, t) => {
	t.pattern ?? (t.pattern = lt), L.init(e, t);
}), cn = /*@__PURE__*/ g("$ZodCIDRv6", (e, t) => {
	t.pattern ?? (t.pattern = ut), L.init(e, t), e._zod.check = (n) => {
		let r = n.value.split("/");
		try {
			if (r.length !== 2) throw Error();
			let [e, t] = r;
			if (!t) throw Error();
			let n = Number(t);
			if (`${n}` !== t || n < 0 || n > 128) throw Error();
			new URL(`http://[${e}]`);
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "cidrv6",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
});
function ln(e) {
	if (e === "") return !0;
	if (/\s/.test(e) || e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
var un = /*@__PURE__*/ g("$ZodBase64", (e, t) => {
	t.pattern ?? (t.pattern = dt), L.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
		ln(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function dn(e) {
	if (!ft.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === "-" ? "+" : "/");
	return ln(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var fn = /*@__PURE__*/ g("$ZodBase64URL", (e, t) => {
	t.pattern ?? (t.pattern = ft), L.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
		dn(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), pn = /*@__PURE__*/ g("$ZodE164", (e, t) => {
	t.pattern ?? (t.pattern = mt), L.init(e, t);
});
function mn(e, t = null) {
	try {
		let n = e.split(".");
		if (n.length !== 3) return !1;
		let [r] = n;
		if (!r) return !1;
		let i = JSON.parse(atob(r));
		return !("typ" in i && i?.typ !== "JWT" || !i.alg || t && (!("alg" in i) || i.alg !== t));
	} catch {
		return !1;
	}
}
var hn = /*@__PURE__*/ g("$ZodJWT", (e, t) => {
	L.init(e, t), e._zod.check = (n) => {
		mn(n.value, t.alg) || n.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), gn = /*@__PURE__*/ g("$ZodNumber", (e, t) => {
	I.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? St, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = Number(n.value);
		} catch {}
		let i = n.value;
		if (typeof i == "number" && !Number.isNaN(i) && Number.isFinite(i)) return n;
		let a = typeof i == "number" ? Number.isNaN(i) ? "NaN" : Number.isFinite(i) ? void 0 : "Infinity" : void 0;
		return n.issues.push({
			expected: "number",
			code: "invalid_type",
			input: i,
			inst: e,
			...a ? { received: a } : {}
		}), n;
	};
}), _n = /*@__PURE__*/ g("$ZodNumberFormat", (e, t) => {
	kt.init(e, t), gn.init(e, t);
}), vn = /*@__PURE__*/ g("$ZodUnknown", (e, t) => {
	I.init(e, t), e._zod.parse = (e) => e;
}), yn = /*@__PURE__*/ g("$ZodNever", (e, t) => {
	I.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
		expected: "never",
		code: "invalid_type",
		input: t.value,
		inst: e
	}), t);
});
function bn(e, t, n) {
	e.issues.length && t.issues.push(...Ae(n, e.issues)), t.value[n] = e.value;
}
var xn = /*@__PURE__*/ g("$ZodArray", (e, t) => {
	I.init(e, t), e._zod.parse = (n, r) => {
		let i = n.value;
		if (!Array.isArray(i)) return n.issues.push({
			expected: "array",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
		n.value = Array(i.length);
		let a = [];
		for (let e = 0; e < i.length; e++) {
			let o = i[e], s = t.element._zod.run({
				value: o,
				issues: []
			}, r);
			s instanceof Promise ? a.push(s.then((t) => bn(t, n, e))) : bn(s, n, e);
		}
		return a.length ? Promise.all(a).then(() => n) : n;
	};
});
function R(e, t, n, r, i, a) {
	let o = n in r;
	if (e.issues.length) {
		if (i && a && !o) return;
		t.issues.push(...Ae(n, e.issues));
	}
	if (!o && !i) {
		e.issues.length || t.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [n]
		});
		return;
	}
	e.value === void 0 ? o && (t.value[n] = void 0) : t.value[n] = e.value;
}
function Sn(e) {
	let t = Object.keys(e.shape);
	for (let n of t) if (!e.shape?.[n]?._zod?.traits?.has("$ZodType")) throw Error(`Invalid element at key "${n}": expected a Zod schema`);
	let n = be(e.shape);
	return {
		...e,
		keys: t,
		keySet: new Set(t),
		numKeys: t.length,
		optionalKeys: new Set(n)
	};
}
function Cn(e, t, n, r, i, a) {
	let o = [], s = i.keySet, c = i.catchall._zod, l = c.def.type, u = c.optin === "optional", d = c.optout === "optional";
	for (let i in t) {
		if (i === "__proto__" || s.has(i)) continue;
		if (l === "never") {
			o.push(i);
			continue;
		}
		let a = c.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => R(e, n, i, t, u, d))) : R(a, n, i, t, u, d);
	}
	return o.length && n.issues.push({
		code: "unrecognized_keys",
		keys: o,
		input: t,
		inst: a
	}), e.length ? Promise.all(e).then(() => n) : n;
}
var wn = /*@__PURE__*/ g("$ZodObject", (e, t) => {
	if (I.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
		let e = t.shape;
		Object.defineProperty(t, "shape", { get: () => {
			let n = { ...e };
			return Object.defineProperty(t, "shape", { value: n }), n;
		} });
	}
	let n = le(() => Sn(t));
	b(e._zod, "propValues", () => {
		let e = t.shape, n = {};
		for (let t in e) {
			let r = e[t]._zod;
			if (r.values) {
				n[t] ?? (n[t] = /* @__PURE__ */ new Set());
				for (let e of r.values) n[t].add(e);
			}
		}
		return n;
	});
	let r = C, i = t.catchall, a;
	e._zod.parse = (t, o) => {
		a ?? (a = n.value);
		let s = t.value;
		if (!r(s)) return t.issues.push({
			expected: "object",
			code: "invalid_type",
			input: s,
			inst: e
		}), t;
		t.value = {};
		let c = [], l = a.shape;
		for (let e of a.keys) {
			let n = l[e], r = n._zod.optin === "optional", i = n._zod.optout === "optional", a = n._zod.run({
				value: s[e],
				issues: []
			}, o);
			a instanceof Promise ? c.push(a.then((n) => R(n, t, e, s, r, i))) : R(a, t, e, s, r, i);
		}
		return i ? Cn(c, s, t, o, n.value, e) : c.length ? Promise.all(c).then(() => t) : t;
	};
}), Tn = /*@__PURE__*/ g("$ZodObjectJIT", (e, t) => {
	wn.init(e, t);
	let n = e._zod.parse, r = le(() => Sn(t)), i = (e) => {
		let t = new Bt([
			"shape",
			"payload",
			"ctx"
		]), n = r.value, i = (e) => {
			let t = me(e);
			return `shape[${t}]._zod.run({ value: input[${t}], issues: [] }, ctx)`;
		};
		t.write("const input = payload.value;");
		let a = Object.create(null), o = 0;
		for (let e of n.keys) a[e] = `key_${o++}`;
		t.write("const newResult = {};");
		for (let r of n.keys) {
			let n = a[r], o = me(r), s = e[r], c = s?._zod?.optin === "optional", l = s?._zod?.optout === "optional";
			t.write(`const ${n} = ${i(r)};`), c && l ? t.write(`
        if (${n}.issues.length) {
          if (${o} in input) {
            payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${o}, ...iss.path] : [${o}]
            })));
          }
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `) : c ? t.write(`
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `) : t.write(`
        const ${n}_present = ${o} in input;
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${o}]
          });
        }

        if (${n}_present) {
          if (${n}.value === undefined) {
            newResult[${o}] = undefined;
          } else {
            newResult[${o}] = ${n}.value;
          }
        }

      `);
		}
		t.write("payload.value = newResult;"), t.write("return payload;");
		let s = t.compile();
		return (t, n) => s(e, t, n);
	}, a, o = C, s = !v.jitless, c = s && _e.value, l = t.catchall, u;
	e._zod.parse = (d, f) => {
		u ?? (u = r.value);
		let p = d.value;
		return o(p) ? s && c && f?.async === !1 && f.jitless !== !0 ? (a || (a = i(t.shape)), d = a(d, f), l ? Cn([], p, d, f, u, e) : d) : n(d, f) : (d.issues.push({
			expected: "object",
			code: "invalid_type",
			input: p,
			inst: e
		}), d);
	};
});
function En(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !O(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: "invalid_union",
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => A(e, r, y())))
	}), t);
}
var Dn = /*@__PURE__*/ g("$ZodUnion", (e, t) => {
	I.init(e, t), b(e._zod, "optin", () => t.options.some((e) => e._zod.optin === "optional") ? "optional" : void 0), b(e._zod, "optout", () => t.options.some((e) => e._zod.optout === "optional") ? "optional" : void 0), b(e._zod, "values", () => {
		if (t.options.every((e) => e._zod.values)) return new Set(t.options.flatMap((e) => Array.from(e._zod.values)));
	}), b(e._zod, "pattern", () => {
		if (t.options.every((e) => e._zod.pattern)) {
			let e = t.options.map((e) => e._zod.pattern);
			return RegExp(`^(${e.map((e) => de(e.source)).join("|")})$`);
		}
	});
	let n = t.options.length === 1 ? t.options[0]._zod.run : null;
	e._zod.parse = (r, i) => {
		if (n) return n(r, i);
		let a = !1, o = [];
		for (let e of t.options) {
			let t = e._zod.run({
				value: r.value,
				issues: []
			}, i);
			if (t instanceof Promise) o.push(t), a = !0;
			else {
				if (t.issues.length === 0) return t;
				o.push(t);
			}
		}
		return a ? Promise.all(o).then((t) => En(t, r, e, i)) : En(o, r, e, i);
	};
}), On = /*@__PURE__*/ g("$ZodIntersection", (e, t) => {
	I.init(e, t), e._zod.parse = (e, n) => {
		let r = e.value, i = t.left._zod.run({
			value: r,
			issues: []
		}, n), a = t.right._zod.run({
			value: r,
			issues: []
		}, n);
		return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => An(e, t, n)) : An(e, i, a);
	};
});
function kn(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (w(e) && w(t)) {
		let n = Object.keys(t), r = Object.keys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		for (let n of r) {
			let r = kn(e[n], t[n]);
			if (!r.valid) return {
				valid: !1,
				mergeErrorPath: [n, ...r.mergeErrorPath]
			};
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	}
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return {
			valid: !1,
			mergeErrorPath: []
		};
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = kn(i, a);
			if (!o.valid) return {
				valid: !1,
				mergeErrorPath: [r, ...o.mergeErrorPath]
			};
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	}
	return {
		valid: !1,
		mergeErrorPath: []
	};
}
function An(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i;
	for (let n of t.issues) if (n.code === "unrecognized_keys") {
		i ?? (i = n);
		for (let e of n.keys) r.has(e) || r.set(e, {}), r.get(e).l = !0;
	} else e.issues.push(n);
	for (let t of n.issues) if (t.code === "unrecognized_keys") for (let e of t.keys) r.has(e) || r.set(e, {}), r.get(e).r = !0;
	else e.issues.push(t);
	let a = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
	if (a.length && i && e.issues.push({
		...i,
		keys: a
	}), O(e)) return e;
	let o = kn(t.value, n.value);
	if (!o.valid) throw Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);
	return e.value = o.data, e;
}
var jn = /*@__PURE__*/ g("$ZodEnum", (e, t) => {
	I.init(e, t);
	let n = se(t.entries), r = new Set(n);
	e._zod.values = r, e._zod.pattern = RegExp(`^(${n.filter((e) => ye.has(typeof e)).map((e) => typeof e == "string" ? T(e) : e.toString()).join("|")})$`), e._zod.parse = (t, i) => {
		let a = t.value;
		return r.has(a) || t.issues.push({
			code: "invalid_value",
			values: n,
			input: a,
			inst: e
		}), t;
	};
}), Mn = /*@__PURE__*/ g("$ZodTransform", (e, t) => {
	I.init(e, t), e._zod.optin = "optional", e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new oe(e.constructor.name);
		let i = t.transform(n.value, n);
		if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n.fallback = !0, n));
		if (i instanceof Promise) throw new _();
		return n.value = i, n.fallback = !0, n;
	};
});
function Nn(e, t) {
	return t === void 0 && (e.issues.length || e.fallback) ? {
		issues: [],
		value: void 0
	} : e;
}
var Pn = /*@__PURE__*/ g("$ZodOptional", (e, t) => {
	I.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", b(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0]) : void 0), b(e._zod, "pattern", () => {
		let e = t.innerType._zod.pattern;
		return e ? RegExp(`^(${de(e.source)})?$`) : void 0;
	}), e._zod.parse = (e, n) => {
		if (t.innerType._zod.optin === "optional") {
			let r = e.value, i = t.innerType._zod.run(e, n);
			return i instanceof Promise ? i.then((e) => Nn(e, r)) : Nn(i, r);
		}
		return e.value === void 0 ? e : t.innerType._zod.run(e, n);
	};
}), Fn = /*@__PURE__*/ g("$ZodExactOptional", (e, t) => {
	Pn.init(e, t), b(e._zod, "values", () => t.innerType._zod.values), b(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
}), In = /*@__PURE__*/ g("$ZodNullable", (e, t) => {
	I.init(e, t), b(e._zod, "optin", () => t.innerType._zod.optin), b(e._zod, "optout", () => t.innerType._zod.optout), b(e._zod, "pattern", () => {
		let e = t.innerType._zod.pattern;
		return e ? RegExp(`^(${de(e.source)}|null)$`) : void 0;
	}), b(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
}), Ln = /*@__PURE__*/ g("$ZodDefault", (e, t) => {
	I.init(e, t), e._zod.optin = "optional", b(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		if (e.value === void 0) return e.value = t.defaultValue, e;
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => Rn(e, t)) : Rn(r, t);
	};
});
function Rn(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
var zn = /*@__PURE__*/ g("$ZodPrefault", (e, t) => {
	I.init(e, t), e._zod.optin = "optional", b(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === "backward" || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
}), Bn = /*@__PURE__*/ g("$ZodNonOptional", (e, t) => {
	I.init(e, t), b(e._zod, "values", () => {
		let e = t.innerType._zod.values;
		return e ? new Set([...e].filter((e) => e !== void 0)) : void 0;
	}), e._zod.parse = (n, r) => {
		let i = t.innerType._zod.run(n, r);
		return i instanceof Promise ? i.then((t) => Vn(t, e)) : Vn(i, e);
	};
});
function Vn(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: e.value,
		inst: t
	}), e;
}
var Hn = /*@__PURE__*/ g("$ZodCatch", (e, t) => {
	I.init(e, t), e._zod.optin = "optional", b(e._zod, "optout", () => t.innerType._zod.optout), b(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((r) => (e.value = r.value, r.issues.length && (e.value = t.catchValue({
			...e,
			error: { issues: r.issues.map((e) => A(e, n, y())) },
			input: e.value
		}), e.issues = [], e.fallback = !0), e)) : (e.value = r.value, r.issues.length && (e.value = t.catchValue({
			...e,
			error: { issues: r.issues.map((e) => A(e, n, y())) },
			input: e.value
		}), e.issues = [], e.fallback = !0), e);
	};
}), Un = /*@__PURE__*/ g("$ZodPipe", (e, t) => {
	I.init(e, t), b(e._zod, "values", () => t.in._zod.values), b(e._zod, "optin", () => t.in._zod.optin), b(e._zod, "optout", () => t.out._zod.optout), b(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (e, n) => {
		if (n.direction === "backward") {
			let r = t.out._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => z(e, t.in, n)) : z(r, t.in, n);
		}
		let r = t.in._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => z(e, t.out, n)) : z(r, t.out, n);
	};
});
function z(e, t, n) {
	return e.issues.length ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues,
		fallback: e.fallback
	}, n);
}
var Wn = /*@__PURE__*/ g("$ZodReadonly", (e, t) => {
	I.init(e, t), b(e._zod, "propValues", () => t.innerType._zod.propValues), b(e._zod, "values", () => t.innerType._zod.values), b(e._zod, "optin", () => t.innerType?._zod?.optin), b(e._zod, "optout", () => t.innerType?._zod?.optout), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then(Gn) : Gn(r);
	};
});
function Gn(e) {
	return e.value = Object.freeze(e.value), e;
}
var Kn = /*@__PURE__*/ g("$ZodCustom", (e, t) => {
	P.init(e, t), I.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
		let r = n.value, i = t.fn(r);
		if (i instanceof Promise) return i.then((t) => qn(t, n, r, e));
		qn(i, n, r, e);
	};
});
function qn(e, t, n, r) {
	if (!e) {
		let e = {
			code: "custom",
			input: n,
			inst: r,
			path: [...r._zod.def.path ?? []],
			continue: !r._zod.def.abort
		};
		r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(j(e));
	}
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
var Jn, Yn = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
	}
	add(e, ...t) {
		let n = t[0];
		return this._map.set(e, n), n && typeof n == "object" && "id" in n && this._idmap.set(n.id, e), this;
	}
	clear() {
		return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
	}
	remove(e) {
		let t = this._map.get(e);
		return t && typeof t == "object" && "id" in t && this._idmap.delete(t.id), this._map.delete(e), this;
	}
	get(e) {
		let t = e._zod.parent;
		if (t) {
			let n = { ...this.get(t) ?? {} };
			delete n.id;
			let r = {
				...n,
				...this._map.get(e)
			};
			return Object.keys(r).length ? r : void 0;
		}
		return this._map.get(e);
	}
	has(e) {
		return this._map.has(e);
	}
};
function Xn() {
	return new Yn();
}
(Jn = globalThis).__zod_globalRegistry ?? (Jn.__zod_globalRegistry = Xn());
var B = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function Zn(e, t) {
	return new e({
		type: "string",
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Qn(e, t) {
	return new e({
		type: "string",
		format: "email",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function $n(e, t) {
	return new e({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function er(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function tr(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v4",
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function nr(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v6",
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function rr(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v7",
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ir(e, t) {
	return new e({
		type: "string",
		format: "url",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ar(e, t) {
	return new e({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function or(e, t) {
	return new e({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function sr(e, t) {
	return new e({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function cr(e, t) {
	return new e({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function lr(e, t) {
	return new e({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ur(e, t) {
	return new e({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function dr(e, t) {
	return new e({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function fr(e, t) {
	return new e({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function pr(e, t) {
	return new e({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function mr(e, t) {
	return new e({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function hr(e, t) {
	return new e({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function gr(e, t) {
	return new e({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function _r(e, t) {
	return new e({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function vr(e, t) {
	return new e({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function yr(e, t) {
	return new e({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: !1,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function br(e, t) {
	return new e({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: !1,
		local: !1,
		precision: null,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function xr(e, t) {
	return new e({
		type: "string",
		format: "date",
		check: "string_format",
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Sr(e, t) {
	return new e({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Cr(e, t) {
	return new e({
		type: "string",
		format: "duration",
		check: "string_format",
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function wr(e, t) {
	return new e({
		type: "number",
		checks: [],
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Tr(e, t) {
	return new e({
		type: "number",
		check: "number_format",
		abort: !1,
		format: "safeint",
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Er(e) {
	return new e({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function Dr(e, t) {
	return new e({
		type: "never",
		...D(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Or(e, t) {
	return new Et({
		check: "less_than",
		...D(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function kr(e, t) {
	return new Et({
		check: "less_than",
		...D(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function Ar(e, t) {
	return new Dt({
		check: "greater_than",
		...D(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function jr(e, t) {
	return new Dt({
		check: "greater_than",
		...D(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function Mr(e, t) {
	return new Ot({
		check: "multiple_of",
		...D(t),
		value: e
	});
}
// @__NO_SIDE_EFFECTS__
function Nr(e, t) {
	return new At({
		check: "max_length",
		...D(t),
		maximum: e
	});
}
// @__NO_SIDE_EFFECTS__
function V(e, t) {
	return new jt({
		check: "min_length",
		...D(t),
		minimum: e
	});
}
// @__NO_SIDE_EFFECTS__
function Pr(e, t) {
	return new Mt({
		check: "length_equals",
		...D(t),
		length: e
	});
}
// @__NO_SIDE_EFFECTS__
function Fr(e, t) {
	return new Nt({
		check: "string_format",
		format: "regex",
		...D(t),
		pattern: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ir(e) {
	return new Pt({
		check: "string_format",
		format: "lowercase",
		...D(e)
	});
}
// @__NO_SIDE_EFFECTS__
function Lr(e) {
	return new Ft({
		check: "string_format",
		format: "uppercase",
		...D(e)
	});
}
// @__NO_SIDE_EFFECTS__
function Rr(e, t) {
	return new It({
		check: "string_format",
		format: "includes",
		...D(t),
		includes: e
	});
}
// @__NO_SIDE_EFFECTS__
function zr(e, t) {
	return new Lt({
		check: "string_format",
		format: "starts_with",
		...D(t),
		prefix: e
	});
}
// @__NO_SIDE_EFFECTS__
function Br(e, t) {
	return new Rt({
		check: "string_format",
		format: "ends_with",
		...D(t),
		suffix: e
	});
}
// @__NO_SIDE_EFFECTS__
function H(e) {
	return new zt({
		check: "overwrite",
		tx: e
	});
}
// @__NO_SIDE_EFFECTS__
function Vr(e) {
	return /* @__PURE__ */ H((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function Hr() {
	return /* @__PURE__ */ H((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Ur() {
	return /* @__PURE__ */ H((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function Wr() {
	return /* @__PURE__ */ H((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function Gr() {
	return /* @__PURE__ */ H((e) => he(e));
}
// @__NO_SIDE_EFFECTS__
function Kr(e, t, n) {
	return new e({
		type: "array",
		element: t,
		...D(n)
	});
}
// @__NO_SIDE_EFFECTS__
function qr(e, t, n) {
	let r = D(n);
	return r.abort ?? (r.abort = !0), new e({
		type: "custom",
		check: "custom",
		fn: t,
		...r
	});
}
// @__NO_SIDE_EFFECTS__
function Jr(e, t, n) {
	return new e({
		type: "custom",
		check: "custom",
		fn: t,
		...D(n)
	});
}
// @__NO_SIDE_EFFECTS__
function Yr(e, t) {
	let n = /* @__PURE__ */ Xr((t) => (t.addIssue = (e) => {
		if (typeof e == "string") t.issues.push(j(e, t.value, n._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ?? (r.code = "custom"), r.input ?? (r.input = t.value), r.inst ?? (r.inst = n), r.continue ?? (r.continue = !n._zod.def.abort), t.issues.push(j(r));
		}
	}, e(t.value, t)), t);
	return n;
}
// @__NO_SIDE_EFFECTS__
function Xr(e, t) {
	let n = new P({
		check: "custom",
		...D(t)
	});
	return n._zod.check = e, n;
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
function Zr(e) {
	let t = e?.target ?? "draft-2020-12";
	return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
		processors: e.processors ?? {},
		metadataRegistry: e?.metadata ?? B,
		target: t,
		unrepresentable: e?.unrepresentable ?? "throw",
		override: e?.override ?? (() => {}),
		io: e?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		cycles: e?.cycles ?? "ref",
		reused: e?.reused ?? "inline",
		external: e?.external ?? void 0
	};
}
function U(e, t, n = {
	path: [],
	schemaPath: []
}) {
	var r;
	let i = e._zod.def, a = t.seen.get(e);
	if (a) return a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema;
	let o = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: n.path
	};
	t.seen.set(e, o);
	let s = e._zod.toJSONSchema?.();
	if (s) o.schema = s;
	else {
		let r = {
			...n,
			schemaPath: [...n.schemaPath, e],
			path: n.path
		};
		if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
		else {
			let n = o.schema, a = t.processors[i.type];
			if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
			a(e, t, n, r);
		}
		let a = e._zod.parent;
		a && (o.ref || (o.ref = a), U(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && Object.assign(o.schema, c), t.io === "input" && W(e) && (delete o.schema.examples, delete o.schema.default), t.io === "input" && "_prefault" in o.schema && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function Qr(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = /* @__PURE__ */ new Map();
	for (let t of e.seen.entries()) {
		let n = e.metadataRegistry.get(t[0])?.id;
		if (n) {
			let e = r.get(n);
			if (e && e !== t[0]) throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			r.set(n, t[0]);
		}
	}
	let i = (t) => {
		let r = e.target === "draft-2020-12" ? "$defs" : "definitions";
		if (e.external) {
			let n = e.external.registry.get(t[0])?.id, i = e.external.uri ?? ((e) => e);
			if (n) return { ref: i(n) };
			let a = t[1].defId ?? t[1].schema.id ?? `schema${e.counter++}`;
			return t[1].defId = a, {
				defId: a,
				ref: `${i("__shared")}#/${r}/${a}`
			};
		}
		if (t[1] === n) return { ref: "#" };
		let i = `#/${r}/`, a = t[1].schema.id ?? `__schema${e.counter++}`;
		return {
			defId: a,
			ref: i + a
		};
	}, a = (e) => {
		if (e[1].schema.$ref) return;
		let t = e[1], { ref: n, defId: r } = i(e);
		t.def = { ...t.schema }, r && (t.defId = r);
		let a = t.schema;
		for (let e in a) delete a[e];
		a.$ref = n;
	};
	if (e.cycles === "throw") for (let t of e.seen.entries()) {
		let e = t[1];
		if (e.cycle) throw Error(`Cycle detected: #/${e.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (let n of e.seen.entries()) {
		let r = n[1];
		if (t === n[0]) {
			a(n);
			continue;
		}
		if (e.external) {
			let r = e.external.registry.get(n[0])?.id;
			if (t !== n[0] && r) {
				a(n);
				continue;
			}
		}
		if (e.metadataRegistry.get(n[0])?.id) {
			a(n);
			continue;
		}
		if (r.cycle) {
			a(n);
			continue;
		}
		if (r.count > 1 && e.reused === "ref") {
			a(n);
			continue;
		}
	}
}
function $r(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema, a = { ...i }, o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o), s = n.schema;
			if (s.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : Object.assign(i, s), Object.assign(i, a), t._zod.parent === o) for (let e in i) e === "$ref" || e === "allOf" || e in a || delete i[e];
			if (s.$ref && n.def) for (let e in i) e === "$ref" || e === "allOf" || e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e];
		}
		let s = t._zod.parent;
		if (s && s !== o) {
			r(s);
			let t = e.seen.get(s);
			if (t?.schema.$ref && (i.$ref = t.schema.$ref, t.def)) for (let e in i) e === "$ref" || e === "allOf" || e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e];
		}
		e.override({
			zodSchema: t,
			jsonSchema: i,
			path: n.path ?? []
		});
	};
	for (let t of [...e.seen.entries()].reverse()) r(t[0]);
	let i = {};
	if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
		let n = e.external.registry.get(t)?.id;
		if (!n) throw Error("Schema is missing an `id` property");
		i.$id = e.external.uri(n);
	}
	Object.assign(i, n.def ?? n.schema);
	let a = e.metadataRegistry.get(t)?.id;
	a !== void 0 && i.id === a && delete i.id;
	let o = e.external?.defs ?? {};
	for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (e.def.id === e.defId && delete e.def.id, o[e.defId] = e.def);
	}
	e.external || Object.keys(o).length > 0 && (e.target === "draft-2020-12" ? i.$defs = o : i.definitions = o);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t["~standard"],
				jsonSchema: {
					input: G(t, "input", e.processors),
					output: G(t, "output", e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error("Error converting schema to JSON.");
	}
}
function W(e, t) {
	let n = t ?? { seen: /* @__PURE__ */ new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === "transform") return !0;
	if (r.type === "array") return W(r.element, n);
	if (r.type === "set") return W(r.valueType, n);
	if (r.type === "lazy") return W(r.getter(), n);
	if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault") return W(r.innerType, n);
	if (r.type === "intersection") return W(r.left, n) || W(r.right, n);
	if (r.type === "record" || r.type === "map") return W(r.keyType, n) || W(r.valueType, n);
	if (r.type === "pipe") return e._zod.traits.has("$ZodCodec") ? !0 : W(r.in, n) || W(r.out, n);
	if (r.type === "object") {
		for (let e in r.shape) if (W(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === "union") {
		for (let e of r.options) if (W(e, n)) return !0;
		return !1;
	}
	if (r.type === "tuple") {
		for (let e of r.items) if (W(e, n)) return !0;
		return !!(r.rest && W(r.rest, n));
	}
	return !1;
}
var ei = (e, t = {}) => (n) => {
	let r = Zr({
		...n,
		processors: t
	});
	return U(e, r), Qr(r, e), $r(r, e);
}, G = (e, t, n = {}) => (r) => {
	let { libraryOptions: i, target: a } = r ?? {}, o = Zr({
		...i ?? {},
		target: a,
		io: t,
		processors: n
	});
	return U(e, o), Qr(o, e), $r(o, e);
}, ti = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
}, ni = (e, t, n, r) => {
	let i = n;
	i.type = "string";
	let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l } = e._zod.bag;
	if (typeof a == "number" && (i.minLength = a), typeof o == "number" && (i.maxLength = o), s && (i.format = ti[s] ?? s, i.format === "" && delete i.format, s === "time" && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
		let e = [...c];
		e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
			...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: e.source
		}))]);
	}
}, ri = (e, t, n, r) => {
	let i = n, { minimum: a, maximum: o, format: s, multipleOf: c, exclusiveMaximum: l, exclusiveMinimum: u } = e._zod.bag;
	typeof s == "string" && s.includes("int") ? i.type = "integer" : i.type = "number";
	let d = typeof u == "number" && u >= (a ?? -Infinity), f = typeof l == "number" && l <= (o ?? Infinity), p = t.target === "draft-04" || t.target === "openapi-3.0";
	d ? p ? (i.minimum = u, i.exclusiveMinimum = !0) : i.exclusiveMinimum = u : typeof a == "number" && (i.minimum = a), f ? p ? (i.maximum = l, i.exclusiveMaximum = !0) : i.exclusiveMaximum = l : typeof o == "number" && (i.maximum = o), typeof c == "number" && (i.multipleOf = c);
}, ii = (e, t, n, r) => {
	n.not = {};
}, ai = (e, t, n, r) => {
	let i = e._zod.def, a = se(i.entries);
	a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), n.enum = a;
}, oi = (e, t, n, r) => {
	if (t.unrepresentable === "throw") throw Error("Custom types cannot be represented in JSON Schema");
}, si = (e, t, n, r) => {
	if (t.unrepresentable === "throw") throw Error("Transforms cannot be represented in JSON Schema");
}, ci = (e, t, n, r) => {
	let i = n, a = e._zod.def, { minimum: o, maximum: s } = e._zod.bag;
	typeof o == "number" && (i.minItems = o), typeof s == "number" && (i.maxItems = s), i.type = "array", i.items = U(a.element, t, {
		...r,
		path: [...r.path, "items"]
	});
}, li = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "object", i.properties = {};
	let o = a.shape;
	for (let e in o) i.properties[e] = U(o[e], t, {
		...r,
		path: [
			...r.path,
			"properties",
			e
		]
	});
	let s = new Set(Object.keys(o)), c = new Set([...s].filter((e) => {
		let n = a.shape[e]._zod;
		return t.io === "input" ? n.optin === void 0 : n.optout === void 0;
	}));
	c.size > 0 && (i.required = Array.from(c)), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = U(a.catchall, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	})) : t.io === "output" && (i.additionalProperties = !1);
}, ui = (e, t, n, r) => {
	let i = e._zod.def, a = i.inclusive === !1, o = i.options.map((e, n) => U(e, t, {
		...r,
		path: [
			...r.path,
			a ? "oneOf" : "anyOf",
			n
		]
	}));
	a ? n.oneOf = o : n.anyOf = o;
}, di = (e, t, n, r) => {
	let i = e._zod.def, a = U(i.left, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			0
		]
	}), o = U(i.right, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			1
		]
	}), s = (e) => "allOf" in e && Object.keys(e).length === 1;
	n.allOf = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
}, fi = (e, t, n, r) => {
	let i = e._zod.def, a = U(i.innerType, t, r), o = t.seen.get(e);
	t.target === "openapi-3.0" ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
}, pi = (e, t, n, r) => {
	let i = e._zod.def;
	U(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, mi = (e, t, n, r) => {
	let i = e._zod.def;
	U(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.default = JSON.parse(JSON.stringify(i.defaultValue));
}, hi = (e, t, n, r) => {
	let i = e._zod.def;
	U(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, t.io === "input" && (n._prefault = JSON.parse(JSON.stringify(i.defaultValue)));
}, gi = (e, t, n, r) => {
	let i = e._zod.def;
	U(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o;
	try {
		o = i.catchValue(void 0);
	} catch {
		throw Error("Dynamic catch values are not supported in JSON Schema");
	}
	n.default = o;
}, _i = (e, t, n, r) => {
	let i = e._zod.def, a = i.in._zod.traits.has("$ZodTransform"), o = t.io === "input" ? a ? i.out : i.in : i.out;
	U(o, t, r);
	let s = t.seen.get(e);
	s.ref = o;
}, vi = (e, t, n, r) => {
	let i = e._zod.def;
	U(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.readOnly = !0;
}, yi = (e, t, n, r) => {
	let i = e._zod.def;
	U(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, bi = /*@__PURE__*/ g("ZodISODateTime", (e, t) => {
	en.init(e, t), X.init(e, t);
});
function xi(e) {
	return /* @__PURE__ */ br(bi, e);
}
var Si = /*@__PURE__*/ g("ZodISODate", (e, t) => {
	tn.init(e, t), X.init(e, t);
});
function Ci(e) {
	return /* @__PURE__ */ xr(Si, e);
}
var wi = /*@__PURE__*/ g("ZodISOTime", (e, t) => {
	nn.init(e, t), X.init(e, t);
});
function Ti(e) {
	return /* @__PURE__ */ Sr(wi, e);
}
var Ei = /*@__PURE__*/ g("ZodISODuration", (e, t) => {
	rn.init(e, t), X.init(e, t);
});
function Di(e) {
	return /* @__PURE__ */ Cr(Ei, e);
}
var K = /*@__PURE__*/ g("ZodError", (e, t) => {
	Ne.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
		format: { value: (t) => Ie(e, t) },
		flatten: { value: (t) => Fe(e, t) },
		addIssue: { value: (t) => {
			e.issues.push(t), e.message = JSON.stringify(e.issues, ce, 2);
		} },
		addIssues: { value: (t) => {
			e.issues.push(...t), e.message = JSON.stringify(e.issues, ce, 2);
		} },
		isEmpty: { get() {
			return e.issues.length === 0;
		} }
	});
}, { Parent: Error }), Oi = /* @__PURE__ */ Le(K), ki = /* @__PURE__ */ Re(K), Ai = /* @__PURE__ */ M(K), ji = /* @__PURE__ */ N(K), Mi = /* @__PURE__ */ Ve(K), Ni = /* @__PURE__ */ He(K), Pi = /* @__PURE__ */ Ue(K), Fi = /* @__PURE__ */ We(K), Ii = /* @__PURE__ */ Ge(K), Li = /* @__PURE__ */ Ke(K), Ri = /* @__PURE__ */ qe(K), zi = /* @__PURE__ */ Je(K), Bi = /* @__PURE__ */ new WeakMap();
function q(e, t, n) {
	let r = Object.getPrototypeOf(e), i = Bi.get(r);
	if (i || (i = /* @__PURE__ */ new Set(), Bi.set(r, i)), !i.has(t)) {
		i.add(t);
		for (let e in n) {
			let t = n[e];
			Object.defineProperty(r, e, {
				configurable: !0,
				enumerable: !1,
				get() {
					let n = t.bind(this);
					return Object.defineProperty(this, e, {
						configurable: !0,
						writable: !0,
						enumerable: !0,
						value: n
					}), n;
				},
				set(t) {
					Object.defineProperty(this, e, {
						configurable: !0,
						writable: !0,
						enumerable: !0,
						value: t
					});
				}
			});
		}
	}
}
var J = /*@__PURE__*/ g("ZodType", (e, t) => (I.init(e, t), Object.assign(e["~standard"], { jsonSchema: {
	input: G(e, "input"),
	output: G(e, "output")
} }), e.toJSONSchema = ei(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.parse = (t, n) => Oi(e, t, n, { callee: e.parse }), e.safeParse = (t, n) => Ai(e, t, n), e.parseAsync = async (t, n) => ki(e, t, n, { callee: e.parseAsync }), e.safeParseAsync = async (t, n) => ji(e, t, n), e.spa = e.safeParseAsync, e.encode = (t, n) => Mi(e, t, n), e.decode = (t, n) => Ni(e, t, n), e.encodeAsync = async (t, n) => Pi(e, t, n), e.decodeAsync = async (t, n) => Fi(e, t, n), e.safeEncode = (t, n) => Ii(e, t, n), e.safeDecode = (t, n) => Li(e, t, n), e.safeEncodeAsync = async (t, n) => Ri(e, t, n), e.safeDecodeAsync = async (t, n) => zi(e, t, n), q(e, "ZodType", {
	check(...e) {
		let t = this.def;
		return this.clone(S(t, { checks: [...t.checks ?? [], ...e.map((e) => typeof e == "function" ? { _zod: {
			check: e,
			def: { check: "custom" },
			onattach: []
		} } : e)] }), { parent: !0 });
	},
	with(...e) {
		return this.check(...e);
	},
	clone(e, t) {
		return E(this, e, t);
	},
	brand() {
		return this;
	},
	register(e, t) {
		return e.add(this, t), this;
	},
	refine(e, t) {
		return this.check(Ga(e, t));
	},
	superRefine(e, t) {
		return this.check(Ka(e, t));
	},
	overwrite(e) {
		return this.check(/* @__PURE__ */ H(e));
	},
	optional() {
		return Ea(this);
	},
	exactOptional() {
		return Oa(this);
	},
	nullable() {
		return Aa(this);
	},
	nullish() {
		return Ea(Aa(this));
	},
	nonoptional(e) {
		return Ia(this, e);
	},
	array() {
		return ha(this);
	},
	or(e) {
		return va([this, e]);
	},
	and(e) {
		return ba(this, e);
	},
	transform(e) {
		return Ba(this, wa(e));
	},
	default(e) {
		return Ma(this, e);
	},
	prefault(e) {
		return Pa(this, e);
	},
	catch(e) {
		return Ra(this, e);
	},
	pipe(e) {
		return Ba(this, e);
	},
	readonly() {
		return Ha(this);
	},
	describe(e) {
		let t = this.clone();
		return B.add(t, { description: e }), t;
	},
	meta(...e) {
		if (e.length === 0) return B.get(this);
		let t = this.clone();
		return B.add(t, e[0]), t;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(e) {
		return e(this);
	}
}), Object.defineProperty(e, "description", {
	get() {
		return B.get(e)?.description;
	},
	configurable: !0
}), e)), Vi = /*@__PURE__*/ g("_ZodString", (e, t) => {
	Ht.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => ni(e, t, n, r);
	let n = e._zod.bag;
	e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, q(e, "_ZodString", {
		regex(...e) {
			return this.check(/* @__PURE__ */ Fr(...e));
		},
		includes(...e) {
			return this.check(/* @__PURE__ */ Rr(...e));
		},
		startsWith(...e) {
			return this.check(/* @__PURE__ */ zr(...e));
		},
		endsWith(...e) {
			return this.check(/* @__PURE__ */ Br(...e));
		},
		min(...e) {
			return this.check(/* @__PURE__ */ V(...e));
		},
		max(...e) {
			return this.check(/* @__PURE__ */ Nr(...e));
		},
		length(...e) {
			return this.check(/* @__PURE__ */ Pr(...e));
		},
		nonempty(...e) {
			return this.check(/* @__PURE__ */ V(1, ...e));
		},
		lowercase(e) {
			return this.check(/* @__PURE__ */ Ir(e));
		},
		uppercase(e) {
			return this.check(/* @__PURE__ */ Lr(e));
		},
		trim() {
			return this.check(/* @__PURE__ */ Hr());
		},
		normalize(...e) {
			return this.check(/* @__PURE__ */ Vr(...e));
		},
		toLowerCase() {
			return this.check(/* @__PURE__ */ Ur());
		},
		toUpperCase() {
			return this.check(/* @__PURE__ */ Wr());
		},
		slugify() {
			return this.check(/* @__PURE__ */ Gr());
		}
	});
}), Hi = /*@__PURE__*/ g("ZodString", (e, t) => {
	Ht.init(e, t), Vi.init(e, t), e.email = (t) => e.check(/* @__PURE__ */ Qn(Ui, t)), e.url = (t) => e.check(/* @__PURE__ */ ir(Gi, t)), e.jwt = (t) => e.check(/* @__PURE__ */ yr(oa, t)), e.emoji = (t) => e.check(/* @__PURE__ */ ar(Ki, t)), e.guid = (t) => e.check(/* @__PURE__ */ $n(Wi, t)), e.uuid = (t) => e.check(/* @__PURE__ */ er(Z, t)), e.uuidv4 = (t) => e.check(/* @__PURE__ */ tr(Z, t)), e.uuidv6 = (t) => e.check(/* @__PURE__ */ nr(Z, t)), e.uuidv7 = (t) => e.check(/* @__PURE__ */ rr(Z, t)), e.nanoid = (t) => e.check(/* @__PURE__ */ or(qi, t)), e.guid = (t) => e.check(/* @__PURE__ */ $n(Wi, t)), e.cuid = (t) => e.check(/* @__PURE__ */ sr(Ji, t)), e.cuid2 = (t) => e.check(/* @__PURE__ */ cr(Yi, t)), e.ulid = (t) => e.check(/* @__PURE__ */ lr(Xi, t)), e.base64 = (t) => e.check(/* @__PURE__ */ gr(ra, t)), e.base64url = (t) => e.check(/* @__PURE__ */ _r(ia, t)), e.xid = (t) => e.check(/* @__PURE__ */ ur(Zi, t)), e.ksuid = (t) => e.check(/* @__PURE__ */ dr(Qi, t)), e.ipv4 = (t) => e.check(/* @__PURE__ */ fr($i, t)), e.ipv6 = (t) => e.check(/* @__PURE__ */ pr(ea, t)), e.cidrv4 = (t) => e.check(/* @__PURE__ */ mr(ta, t)), e.cidrv6 = (t) => e.check(/* @__PURE__ */ hr(na, t)), e.e164 = (t) => e.check(/* @__PURE__ */ vr(aa, t)), e.datetime = (t) => e.check(xi(t)), e.date = (t) => e.check(Ci(t)), e.time = (t) => e.check(Ti(t)), e.duration = (t) => e.check(Di(t));
});
function Y(e) {
	return /* @__PURE__ */ Zn(Hi, e);
}
var X = /*@__PURE__*/ g("ZodStringFormat", (e, t) => {
	L.init(e, t), Vi.init(e, t);
}), Ui = /*@__PURE__*/ g("ZodEmail", (e, t) => {
	Gt.init(e, t), X.init(e, t);
}), Wi = /*@__PURE__*/ g("ZodGUID", (e, t) => {
	Ut.init(e, t), X.init(e, t);
}), Z = /*@__PURE__*/ g("ZodUUID", (e, t) => {
	Wt.init(e, t), X.init(e, t);
}), Gi = /*@__PURE__*/ g("ZodURL", (e, t) => {
	Kt.init(e, t), X.init(e, t);
}), Ki = /*@__PURE__*/ g("ZodEmoji", (e, t) => {
	qt.init(e, t), X.init(e, t);
}), qi = /*@__PURE__*/ g("ZodNanoID", (e, t) => {
	Jt.init(e, t), X.init(e, t);
}), Ji = /*@__PURE__*/ g("ZodCUID", (e, t) => {
	Yt.init(e, t), X.init(e, t);
}), Yi = /*@__PURE__*/ g("ZodCUID2", (e, t) => {
	Xt.init(e, t), X.init(e, t);
}), Xi = /*@__PURE__*/ g("ZodULID", (e, t) => {
	Zt.init(e, t), X.init(e, t);
}), Zi = /*@__PURE__*/ g("ZodXID", (e, t) => {
	Qt.init(e, t), X.init(e, t);
}), Qi = /*@__PURE__*/ g("ZodKSUID", (e, t) => {
	$t.init(e, t), X.init(e, t);
}), $i = /*@__PURE__*/ g("ZodIPv4", (e, t) => {
	an.init(e, t), X.init(e, t);
}), ea = /*@__PURE__*/ g("ZodIPv6", (e, t) => {
	on.init(e, t), X.init(e, t);
}), ta = /*@__PURE__*/ g("ZodCIDRv4", (e, t) => {
	sn.init(e, t), X.init(e, t);
}), na = /*@__PURE__*/ g("ZodCIDRv6", (e, t) => {
	cn.init(e, t), X.init(e, t);
}), ra = /*@__PURE__*/ g("ZodBase64", (e, t) => {
	un.init(e, t), X.init(e, t);
}), ia = /*@__PURE__*/ g("ZodBase64URL", (e, t) => {
	fn.init(e, t), X.init(e, t);
}), aa = /*@__PURE__*/ g("ZodE164", (e, t) => {
	pn.init(e, t), X.init(e, t);
}), oa = /*@__PURE__*/ g("ZodJWT", (e, t) => {
	hn.init(e, t), X.init(e, t);
}), sa = /*@__PURE__*/ g("ZodNumber", (e, t) => {
	gn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => ri(e, t, n, r), q(e, "ZodNumber", {
		gt(e, t) {
			return this.check(/* @__PURE__ */ Ar(e, t));
		},
		gte(e, t) {
			return this.check(/* @__PURE__ */ jr(e, t));
		},
		min(e, t) {
			return this.check(/* @__PURE__ */ jr(e, t));
		},
		lt(e, t) {
			return this.check(/* @__PURE__ */ Or(e, t));
		},
		lte(e, t) {
			return this.check(/* @__PURE__ */ kr(e, t));
		},
		max(e, t) {
			return this.check(/* @__PURE__ */ kr(e, t));
		},
		int(e) {
			return this.check(la(e));
		},
		safe(e) {
			return this.check(la(e));
		},
		positive(e) {
			return this.check(/* @__PURE__ */ Ar(0, e));
		},
		nonnegative(e) {
			return this.check(/* @__PURE__ */ jr(0, e));
		},
		negative(e) {
			return this.check(/* @__PURE__ */ Or(0, e));
		},
		nonpositive(e) {
			return this.check(/* @__PURE__ */ kr(0, e));
		},
		multipleOf(e, t) {
			return this.check(/* @__PURE__ */ Mr(e, t));
		},
		step(e, t) {
			return this.check(/* @__PURE__ */ Mr(e, t));
		},
		finite() {
			return this;
		}
	});
	let n = e._zod.bag;
	e.minValue = Math.max(n.minimum ?? -Infinity, n.exclusiveMinimum ?? -Infinity) ?? null, e.maxValue = Math.min(n.maximum ?? Infinity, n.exclusiveMaximum ?? Infinity) ?? null, e.isInt = (n.format ?? "").includes("int") || Number.isSafeInteger(n.multipleOf ?? .5), e.isFinite = !0, e.format = n.format ?? null;
});
function Q(e) {
	return /* @__PURE__ */ wr(sa, e);
}
var ca = /*@__PURE__*/ g("ZodNumberFormat", (e, t) => {
	_n.init(e, t), sa.init(e, t);
});
function la(e) {
	return /* @__PURE__ */ Tr(ca, e);
}
var ua = /*@__PURE__*/ g("ZodUnknown", (e, t) => {
	vn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function da() {
	return /* @__PURE__ */ Er(ua);
}
var fa = /*@__PURE__*/ g("ZodNever", (e, t) => {
	yn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => ii(e, t, n, r);
});
function pa(e) {
	return /* @__PURE__ */ Dr(fa, e);
}
var ma = /*@__PURE__*/ g("ZodArray", (e, t) => {
	xn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => ci(e, t, n, r), e.element = t.element, q(e, "ZodArray", {
		min(e, t) {
			return this.check(/* @__PURE__ */ V(e, t));
		},
		nonempty(e) {
			return this.check(/* @__PURE__ */ V(1, e));
		},
		max(e, t) {
			return this.check(/* @__PURE__ */ Nr(e, t));
		},
		length(e, t) {
			return this.check(/* @__PURE__ */ Pr(e, t));
		},
		unwrap() {
			return this.element;
		}
	});
});
function ha(e, t) {
	return /* @__PURE__ */ Kr(ma, e, t);
}
var ga = /*@__PURE__*/ g("ZodObject", (e, t) => {
	Tn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => li(e, t, n, r), b(e, "shape", () => t.shape), q(e, "ZodObject", {
		keyof() {
			return Sa(Object.keys(this._zod.def.shape));
		},
		catchall(e) {
			return this.clone({
				...this._zod.def,
				catchall: e
			});
		},
		passthrough() {
			return this.clone({
				...this._zod.def,
				catchall: da()
			});
		},
		loose() {
			return this.clone({
				...this._zod.def,
				catchall: da()
			});
		},
		strict() {
			return this.clone({
				...this._zod.def,
				catchall: pa()
			});
		},
		strip() {
			return this.clone({
				...this._zod.def,
				catchall: void 0
			});
		},
		extend(e) {
			return we(this, e);
		},
		safeExtend(e) {
			return Te(this, e);
		},
		merge(e) {
			return Ee(this, e);
		},
		pick(e) {
			return Se(this, e);
		},
		omit(e) {
			return Ce(this, e);
		},
		partial(...e) {
			return De(Ta, this, e[0]);
		},
		required(...e) {
			return Oe(Fa, this, e[0]);
		}
	});
});
function $(e, t) {
	return new ga({
		type: "object",
		shape: e ?? {},
		...D(t)
	});
}
var _a = /*@__PURE__*/ g("ZodUnion", (e, t) => {
	Dn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => ui(e, t, n, r), e.options = t.options;
});
function va(e, t) {
	return new _a({
		type: "union",
		options: e,
		...D(t)
	});
}
var ya = /*@__PURE__*/ g("ZodIntersection", (e, t) => {
	On.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => di(e, t, n, r);
});
function ba(e, t) {
	return new ya({
		type: "intersection",
		left: e,
		right: t
	});
}
var xa = /*@__PURE__*/ g("ZodEnum", (e, t) => {
	jn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => ai(e, t, n, r), e.enum = t.entries, e.options = Object.values(t.entries);
	let n = new Set(Object.keys(t.entries));
	e.extract = (e, r) => {
		let i = {};
		for (let r of e) if (n.has(r)) i[r] = t.entries[r];
		else throw Error(`Key ${r} not found in enum`);
		return new xa({
			...t,
			checks: [],
			...D(r),
			entries: i
		});
	}, e.exclude = (e, r) => {
		let i = { ...t.entries };
		for (let t of e) if (n.has(t)) delete i[t];
		else throw Error(`Key ${t} not found in enum`);
		return new xa({
			...t,
			checks: [],
			...D(r),
			entries: i
		});
	};
});
function Sa(e, t) {
	return new xa({
		type: "enum",
		entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
		...D(t)
	});
}
var Ca = /*@__PURE__*/ g("ZodTransform", (e, t) => {
	Mn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => si(e, t, n, r), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new oe(e.constructor.name);
		n.addIssue = (r) => {
			if (typeof r == "string") n.issues.push(j(r, n.value, t));
			else {
				let t = r;
				t.fatal && (t.continue = !1), t.code ?? (t.code = "custom"), t.input ?? (t.input = n.value), t.inst ?? (t.inst = e), n.issues.push(j(t));
			}
		};
		let i = t.transform(n.value, n);
		return i instanceof Promise ? i.then((e) => (n.value = e, n.fallback = !0, n)) : (n.value = i, n.fallback = !0, n);
	};
});
function wa(e) {
	return new Ca({
		type: "transform",
		transform: e
	});
}
var Ta = /*@__PURE__*/ g("ZodOptional", (e, t) => {
	Pn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => yi(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Ea(e) {
	return new Ta({
		type: "optional",
		innerType: e
	});
}
var Da = /*@__PURE__*/ g("ZodExactOptional", (e, t) => {
	Fn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => yi(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Oa(e) {
	return new Da({
		type: "optional",
		innerType: e
	});
}
var ka = /*@__PURE__*/ g("ZodNullable", (e, t) => {
	In.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => fi(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Aa(e) {
	return new ka({
		type: "nullable",
		innerType: e
	});
}
var ja = /*@__PURE__*/ g("ZodDefault", (e, t) => {
	Ln.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => mi(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function Ma(e, t) {
	return new ja({
		type: "default",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : ve(t);
		}
	});
}
var Na = /*@__PURE__*/ g("ZodPrefault", (e, t) => {
	zn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => hi(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Pa(e, t) {
	return new Na({
		type: "prefault",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : ve(t);
		}
	});
}
var Fa = /*@__PURE__*/ g("ZodNonOptional", (e, t) => {
	Bn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => pi(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Ia(e, t) {
	return new Fa({
		type: "nonoptional",
		innerType: e,
		...D(t)
	});
}
var La = /*@__PURE__*/ g("ZodCatch", (e, t) => {
	Hn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => gi(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function Ra(e, t) {
	return new La({
		type: "catch",
		innerType: e,
		catchValue: typeof t == "function" ? t : () => t
	});
}
var za = /*@__PURE__*/ g("ZodPipe", (e, t) => {
	Un.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => _i(e, t, n, r), e.in = t.in, e.out = t.out;
});
function Ba(e, t) {
	return new za({
		type: "pipe",
		in: e,
		out: t
	});
}
var Va = /*@__PURE__*/ g("ZodReadonly", (e, t) => {
	Wn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => vi(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Ha(e) {
	return new Va({
		type: "readonly",
		innerType: e
	});
}
var Ua = /*@__PURE__*/ g("ZodCustom", (e, t) => {
	Kn.init(e, t), J.init(e, t), e._zod.processJSONSchema = (t, n, r) => oi(e, t, n, r);
});
function Wa(e, t) {
	return /* @__PURE__ */ qr(Ua, e ?? (() => !0), t);
}
function Ga(e, t = {}) {
	return /* @__PURE__ */ Jr(Ua, e, t);
}
function Ka(e, t) {
	return /* @__PURE__ */ Yr(e, t);
}
//#endregion
//#region src/schemas/firebase-config.schema.ts
var qa = $({
	apiKey: Y().min(1),
	appId: Y().min(1),
	projectId: Y().min(1),
	authDomain: Y().min(1),
	measurementId: Y().min(1),
	storageBucket: Y().min(1),
	messagingSenderId: Y().min(1)
}), Ja = $({
	name: Y().min(1),
	firebase: qa,
	logo: Y().optional(),
	provider: Y().min(1).optional(),
	theme: $({
		text: Y(),
		primary: Y(),
		secondary: Y(),
		background: Y()
	}).partial().optional()
}), Ya = $({
	url: Y().refine((e) => {
		try {
			let t = new URL(e);
			return t.protocol === "http:" || t.protocol === "https:";
		} catch {
			return !1;
		}
	}, { message: "Invalid URL" }),
	pos: $({
		x: Q().optional(),
		y: Q().optional()
	}).optional(),
	dim: $({
		width: Q().optional(),
		height: Q().optional()
	}).optional(),
	config: Ja.partial().optional(),
	mode: Sa(["popup", "iframe"]).optional(),
	iframe: va([$({
		element: Wa(),
		container: pa().optional()
	}), $({
		container: Wa(),
		element: pa().optional()
	})]).optional()
});
//#endregion
export { te as Base64helper, s as BaseError, m as ConfigHelper, n as EProvider, ne as EnumHelper, e as ErrorType, h as EventHelper, t as EventType, qa as FirebaseConfigSchema, Ja as FireguardOptionsSchema, ie as FiremittHelper, Ya as FiremittOptionsSchema, l as InvalidAppError, c as InvalidAppNameError, u as InvalidDimError, d as InvalidFirebaseConfigError, f as InvalidIframeError, p as InvalidProviderError, ee as InvalidURLError };
