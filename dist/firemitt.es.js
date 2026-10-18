//#region src/enums/error-type.enum.ts
var e = /* @__PURE__ */ function(e) {
	return e[e.InvalidURL = 1] = "InvalidURL", e[e.InvalidApp = 2] = "InvalidApp", e[e.InvalidAppName = 3] = "InvalidAppName", e[e.InvalidProvider = 4] = "InvalidProvider", e[e.InvalidFirebaseConfig = 5] = "InvalidFirebaseConfig", e[e.InvalidDim = 6] = "InvalidDim", e[e.InvalidIframe = 7] = "InvalidIframe", e[e.PopupBlocked = 8] = "PopupBlocked", e[e.AuthFailed = 9] = "AuthFailed", e;
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
//#region \0@oxc-project+runtime@0.154.0/helpers/esm/typeof.js
function r(e) {
	"@babel/helpers - typeof";
	return r = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, r(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.154.0/helpers/esm/toPrimitive.js
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
//#region \0@oxc-project+runtime@0.154.0/helpers/esm/toPropertyKey.js
function a(e) {
	var t = i(e, "string");
	return r(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.154.0/helpers/esm/defineProperty.js
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
		super(n), o(this, "type", void 0), this.type = t, this.name = `${re.getName(e, t) ?? "Base"}Error`;
	}
	toString() {
		return `[${this.name}] ${this.message}.`;
	}
	toObject() {
		let e = {
			type: this.type,
			name: this.name,
			message: this.message
		};
		return this.code !== void 0 && (e.code = this.code), e;
	}
}, c = class t extends s {
	constructor(n) {
		let r = t.toRemote(n), i = typeof r.type == "number" && e[r.type] !== void 0 ? r.type : e.AuthFailed, a = typeof r.message == "string" && r.message.length > 0 ? r.message : "Authentication failed";
		super(i, a), typeof r.name == "string" && r.name.length > 0 && (this.name = r.name), typeof r.code == "string" && r.code.length > 0 && (this.code = r.code), this.cause = n;
	}
	static toRemote(e) {
		return typeof e == "string" ? { message: e } : typeof e == "object" && e ? e : {};
	}
}, l = class extends s {
	constructor() {
		super(e.InvalidAppName, "Invalid app name, please specify a name for your app");
	}
}, u = class extends s {
	constructor() {
		super(e.InvalidApp, "Invalid Firebase app, failed to initialize Firebase with the given configuration");
	}
}, d = class extends s {
	constructor() {
		super(e.InvalidDim, "Invalid dimensions, width and height must be finite numbers greater than zero");
	}
}, f = class extends s {
	constructor() {
		super(e.InvalidFirebaseConfig, "Invalid Firebase configuration");
	}
}, p = class extends s {
	constructor() {
		super(e.InvalidIframe, "iframe mode requires either an iframe element or a container element");
	}
}, m = class extends s {
	constructor(t) {
		super(e.InvalidProvider, `Invalid provider, "${t}" is not a valid provider name`);
	}
}, h = class extends s {
	constructor() {
		super(e.InvalidURL, "Invalid URL, please specify a valid http(s) URL for a Fireguard instance");
	}
}, ee = class extends s {
	constructor() {
		super(e.PopupBlocked, "The Fireguard popup was blocked by the browser, call auth() directly from a user gesture such as a click handler");
	}
}, te = 127, g = class {
	static encode(e) {
		let t = JSON.stringify(e), n = "";
		for (let e = 0; e < t.length; e++) {
			let r = t.charCodeAt(e);
			n += r <= te ? t[e] : `\\u${r.toString(16).padStart(4, "0")}`;
		}
		return btoa(n);
	}
	static decode(e) {
		if (typeof e != "string") throw TypeError("Expected a Base64 encoded string.");
		let t = JSON.parse(atob(e));
		if (typeof t?.type != "number") throw TypeError("The decoded value is not a valid message.");
		return t;
	}
}, ne = class {
	static getDim(e, t) {
		let n = Number.parseFloat((e ?? 450).toString()), r = Number.parseFloat((t ?? 260).toString());
		if (!Number.isFinite(n) || !Number.isFinite(r) || n <= 0 || r <= 0) throw new d();
		return {
			width: n,
			height: r
		};
	}
	static getPos(e, t, n) {
		let r = window.screenX, i = window.outerWidth, a = Number.isFinite(r) && i > 0 ? r + (i - n) / 2 : window.screen.width / 2 - n / 2, o = Number.parseFloat((e ?? a).toString()), s = Number.parseFloat((t ?? 50).toString());
		return {
			x: Math.round(Number.isFinite(o) ? o : a),
			y: Math.round(Number.isFinite(s) ? s : 50)
		};
	}
	static getURL(e) {
		let t = $s.shape.url.safeParse(e);
		if (!t.success) throw new h();
		return new URL(t.data).toString();
	}
	static getProvider(e) {
		let t = (e ?? "").trim(), r = t.toLowerCase();
		return t ? Object.values(n).includes(r) ? r : t : n.GOOGLE;
	}
	static getFireguardConfig(e) {
		let t = e?.name ?? "", n = e?.logo ?? "", r = {
			text: e?.theme?.text || "#1a3544",
			primary: e?.theme?.primary || "#ffe536",
			secondary: e?.theme?.secondary || "#1a3544",
			background: e?.theme?.background || "#ffffff"
		}, i = this.getProvider(e?.provider), a = Qs.shape.name.safeParse(t);
		if (!e || !a.success) throw new l();
		let o = e.firebase, s = Zs.safeParse(o);
		if (!o || !s.success) throw new f();
		return {
			name: t,
			logo: n,
			theme: r,
			firebase: o,
			provider: i
		};
	}
	static init(e) {
		let t = this.getURL(e.url), n = this.getDim(e.dim?.width, e.dim?.height);
		return {
			url: t,
			dim: n,
			pos: this.getPos(e.pos?.x, e.pos?.y, n.width),
			fireguard: this.getFireguardConfig(e.config)
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
}, re = class {
	static getName(e, t) {
		return Object.keys(e).find((n) => e[n] === t);
	}
}, ie = class {
	static dispose() {
		for (let [e, t] of this.handlers) t.removeEventListener("message", e);
		this.handlers.clear();
	}
	static init(e) {
		return e ? (this.dispose(), this.hostWindow = window, this.target = e, !0) : !1;
	}
	static send(e, t, n = "*") {
		let r = {
			type: e,
			payload: { ...t }
		};
		return this.target?.postMessage(g.encode(r), n), this;
	}
	static on(e, t, n = {}) {
		let r = this.hostWindow ?? window, i = (a) => {
			if (!a.isTrusted || n.source !== void 0 && a.source !== n.source) return;
			let o;
			try {
				o = g.decode(a.data);
			} catch {
				return;
			}
			o.type === e && this.handlers.delete(i) && (r.removeEventListener("message", i), t(o.payload, a));
		};
		return this.handlers.set(i, r), r.addEventListener("message", i), this;
	}
};
o(ie, "target", void 0), o(ie, "hostWindow", void 0), o(ie, "handlers", /* @__PURE__ */ new Map());
//#endregion
//#region src/helpers/firemitt.helper.ts
var ae = 500, oe = 300, se = "The authentication window was closed.", ce = "A new authentication session was started.", le = class e {
	static getTargetOrigin(e) {
		return e && e !== "null" ? e : "*";
	}
	static startSession(n, r, i) {
		let a;
		return {
			promise: new Promise((o, s) => {
				let l = !1;
				function u(e) {
					l || (l = !0, window.removeEventListener("message", d), i(), e());
				}
				function d(i) {
					let a = n();
					if (!i.isTrusted || !a || i.source !== a) return;
					let l;
					try {
						l = g.decode(i.data);
					} catch {
						return;
					}
					switch (l.type) {
						case t.Loaded:
							a.postMessage(g.encode({
								type: t.Config,
								payload: { ...r }
							}), e.getTargetOrigin(i.origin));
							break;
						case t.AuthSucceded: {
							let e = l.payload?.token;
							typeof e == "string" && e.length > 0 ? u(() => o(e)) : u(() => s(new c({ message: "Fireguard reported a successful authentication without a token" })));
							break;
						}
						case t.AuthFailed:
							u(() => s(new c(l.payload?.error)));
							break;
						case t.Closed: u(() => s(/* @__PURE__ */ Error(se)));
					}
				}
				a = (e) => u(() => s(e)), window.addEventListener("message", d);
			}),
			cancel: a
		};
	}
	static activate(t, n = () => {}) {
		e.cancelActive?.();
		let r = () => {
			n(), t.cancel(/* @__PURE__ */ Error(ce));
		};
		e.cancelActive = r, t.promise.then(() => e.release(r), () => e.release(r));
	}
	static release(t) {
		e.cancelActive === t && (e.cancelActive = null);
	}
	static authPopup(t) {
		let n = ne.init(t), r = window.open(n.url, "_blank", ne.getFlags(n));
		if (!r) return Promise.reject(new ee());
		let i, a, o = e.startSession(() => r, n.fireguard, () => {
			clearInterval(i), clearTimeout(a);
		});
		return e.activate(o, () => {
			r.closed || r.close();
		}), i = setInterval(() => {
			r.closed && (a = setTimeout(() => o.cancel(/* @__PURE__ */ Error(se)), oe));
		}, ae), o.promise;
	}
	static authIframe(t) {
		let { iframe: n } = t;
		if (!n?.element && !n?.container) throw new p();
		let r = ne.init(t), i = !n.element, a = n.element ?? document.createElement("iframe"), o = e.startSession(() => a.contentWindow, r.fireguard, () => {
			i && a.parentNode && a.parentNode.removeChild(a);
		});
		return e.activate(o), i && (a.style.width = `${r.dim.width}px`, a.style.height = `${r.dim.height}px`, n.container.appendChild(a)), a.src = r.url, o.promise;
	}
	static auth(t) {
		return t.mode === "iframe" ? e.authIframe(t) : e.authPopup(t);
	}
};
o(le, "cancelActive", null);
//#endregion
//#region node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/util.js
function ue(e) {
	let t = Object.values(e).filter((e) => typeof e == "number");
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function de(e, t = "|") {
	return e.map((e) => Ae(e)).join(t);
}
function fe(e, t) {
	return typeof t == "bigint" ? t.toString() : t;
}
var pe = class {
	constructor(e) {
		this._getter = e, this._value = void 0;
	}
	get value() {
		let e = this._getter;
		return e !== void 0 && (this._value = e(), this._getter = void 0), this._value;
	}
};
function me(e) {
	return new pe(e);
}
function he(e) {
	return e == null;
}
function ge(e) {
	let t = +!!e.startsWith("^"), n = e.endsWith("$") ? e.length - 1 : e.length;
	return e.slice(t, n);
}
function _e(e, t) {
	let n = e / t, r = Math.round(n), i = 4 * 2 ** -52 * Math.max(Math.abs(n), 1);
	return Math.abs(n - r) < i ? 0 : n - r;
}
function _(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function ve(e) {
	let t = Object.getOwnPropertyDescriptor(e, "shape");
	return t?.get ? t.get.raw : t?.value;
}
function v(e) {
	return ve(e._zod.def) ?? e._zod.def.shape;
}
function ye(e, t, n) {
	Object.defineProperty(e, t, {
		get() {
			let e = n();
			return _(this, t, e), e;
		},
		enumerable: !0,
		configurable: !0
	});
}
function be(e, t, n) {
	t in e ? _(e, t, n) : e[t] = n;
}
function y(e, t, n, r) {
	let i = v(t);
	for (let a of n) {
		let n = Object.getOwnPropertyDescriptor(i, a);
		n.enumerable && (n.get ? ye(e, a, () => {
			let e = t._zod.def.shape[a];
			return r ? r(e, a) : e;
		}) : be(e, a, r ? r(n.value, a) : n.value));
	}
}
function xe(e, t) {
	for (let n of Reflect.ownKeys(t)) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.enumerable && (r.get ? ye(e, n, () => t[n]) : be(e, n, r.value));
	}
}
function b(...e) {
	let t = {};
	for (let n of e) {
		let e = Object.getOwnPropertyDescriptors(n);
		Object.assign(t, e);
	}
	return Object.defineProperties({}, t);
}
function Se(e) {
	return JSON.stringify(e);
}
function Ce(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var we = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function Te(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var Ee = /* @__PURE__*/ me(() => {
	if (N.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
	try {
		return Function(""), !0;
	} catch {
		return !1;
	}
});
function x(e) {
	if (Te(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != "function") return !0;
	let n = t.prototype;
	return Te(n) !== !1 && Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") !== !1;
}
function De(e) {
	return x(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
var Oe = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function ke(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function S(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function C(e) {
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
function Ae(e) {
	return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
function je(e) {
	return Object.keys(e).filter((t) => e[t]._zod.optin !== void 0 && e[t]._zod.optout === "optional");
}
var Me = {
	safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}, Ne = {
	int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
	uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")]
};
function Pe(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
	let i = {};
	return y(i, e, Fe(e, t)), S(e, b(n, {
		shape: i,
		checks: []
	}));
}
function Fe(e, t) {
	let n = v(e), r = [];
	for (let e of Reflect.ownKeys(t)) {
		if (!Object.getOwnPropertyDescriptor(n, e)?.enumerable) throw Error(`Unrecognized key: "${String(e)}"`);
		t[e] && r.push(e);
	}
	return r;
}
function Ie(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
	let i = new Set(Fe(e, t)), a = {};
	return y(a, e, Reflect.ownKeys(v(e)).filter((e) => !i.has(e))), S(e, b(n, {
		shape: a,
		checks: []
	}));
}
function Le(e, t) {
	if (!x(t)) throw Error("Invalid input to extend: expected a plain object");
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = v(e);
		for (let e of Reflect.ownKeys(t)) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return S(e, b(e._zod.def, { shape: Re(e, t) }));
}
function Re(e, t) {
	let n = {};
	return y(n, e, Reflect.ownKeys(v(e))), xe(n, t), n;
}
function ze(e, t) {
	if (!x(t)) throw Error("Invalid input to safeExtend: expected a plain object");
	return S(e, b(e._zod.def, { shape: Re(e, t) }));
}
function Be(e, t) {
	if (!t?._zod?.def) throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
	if (e._zod.def.checks?.length) throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	let n = {};
	return y(n, e, Reflect.ownKeys(v(e))), y(n, t, Reflect.ownKeys(v(t))), S(e, b(e._zod.def, {
		shape: n,
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: t._zod.def.checks ?? []
	}));
}
function Ve(e, t, n, r = "partial") {
	let i = t._zod.def.checks;
	if (i && i.length > 0) throw Error(`.${r}() cannot be used on object schemas containing refinements`);
	let a = n ? new Set(Fe(t, n)) : void 0, o = {};
	return y(o, t, Reflect.ownKeys(v(t)), e && ((t, n) => a && !a.has(n) ? t : new e({
		type: "optional",
		innerType: t
	}))), S(t, b(t._zod.def, {
		shape: o,
		checks: []
	}));
}
function He(e, t, n) {
	let r = n ? new Set(Fe(t, n)) : void 0, i = {};
	return y(i, t, Reflect.ownKeys(v(t)), (t, n) => r && !r.has(n) ? t : new e({
		type: "nonoptional",
		innerType: t
	})), S(t, b(t._zod.def, { shape: i }));
}
function w(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function Ue(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue === !1) return !0;
	return !1;
}
function We(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function T(e) {
	return typeof e == "string" ? e : e?.message;
}
function Ge(e) {
	let t = [];
	for (let n of e ?? []) {
		let e = n._zod.def;
		if (!/_(length|size)$|_equals$/.test(e.check)) break;
		let r = e.maximum ?? e.length ?? e.size;
		r >= 0 && t.push([r, n]);
	}
	return t;
}
function Ke(e, t, n) {
	var r;
	for (let i = t; i < e.length; i++) (r = e[i]).schema ?? (r.schema = n);
}
function E(e, t, n) {
	var r;
	let i = e.inst?._zod?.traits;
	i?.has("$ZodType") && (i.has("$ZodCheck") ? (r = e).schema ?? (r.schema = e.inst) : e.schema = e.inst);
	let a = e.schema === e.inst ? void 0 : e.schema?._zod.def?.error, o = e.message ? e.message : T(e.inst?._zod.def?.error?.(e)) ?? T(a?.(e)) ?? T(t?.error?.(e)) ?? T(n.customError?.(e)) ?? T(n.localeError?.(e)) ?? "Invalid input", s = {};
	for (let t of Object.keys(e)) t !== "inst" && t !== "schema" && t !== "continue" && t !== "input" && t !== "__proto__" && (s[t] = e[t]);
	return s.path ?? (s.path = []), s.message = o, t?.reportInput && (s.input = e.input), s;
}
var qe = /[\uD800-\uDBFF]/;
function Je(e) {
	let t = e.length;
	if (!qe.test(e)) return t;
	let n = t;
	for (let r = 0; r < t - 1; r++) (e.charCodeAt(r) & 64512) == 55296 && (e.charCodeAt(r + 1) & 64512) == 56320 && (n--, r++);
	return n;
}
function Ye(e) {
	return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function Xe(e) {
	let t = typeof e;
	switch (t) {
		case "number": return Number.isNaN(e) ? "nan" : "number";
		case "object": {
			if (e === null) return "null";
			if (Array.isArray(e)) return "array";
			let t = e;
			if (t && Object.getPrototypeOf(t) !== Object.prototype && "constructor" in t && t.constructor) return t.constructor.name;
		}
	}
	return t;
}
function D(...e) {
	let [t, n, r] = e;
	return typeof t == "string" ? {
		message: t,
		code: "custom",
		input: n,
		inst: r
	} : { ...t };
}
function Ze(e, t) {
	for (let n in t) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.get ? Object.defineProperty(e, n, {
			...r,
			enumerable: !1
		}) : et(e, n, r.value);
	}
}
function O(e, t, n, r = !0) {
	return Object.defineProperty(e, t, {
		configurable: !0,
		writable: !0,
		enumerable: r,
		value: n
	}), n;
}
function Qe(e, t, n) {
	return O(e, t, n, !1);
}
/* @__NO_SIDE_EFFECTS__ */
function $e(e, t) {
	for (let n in e) {
		let r = e[n];
		Object.defineProperty(t, n, {
			configurable: !0,
			enumerable: !0,
			get() {
				return O(this, n, r(this));
			},
			set(e) {
				O(this, n, e);
			}
		});
	}
	return t;
}
function et(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		get() {
			return this == null ? n : O(this, t, n.bind(this));
		},
		set(e) {
			O(this, t, e);
		}
	});
}
function tt(e, t) {
	let n = Object.getPrototypeOf(e);
	return t in n ? void 0 : n;
}
var nt, k = !1, rt = {
	configurable: !0,
	get() {
		k = !0;
	}
};
function A(e, t, n) {
	let r = Object.getPrototypeOf(e._zod);
	t in r && nt !== e._zod ? nt = void 0 : (nt = e._zod, Object.defineProperty(r, t, {
		configurable: !0,
		get() {
			Object.defineProperty(this, t, rt);
			let e = k;
			k = !1;
			try {
				let r = n(this);
				return k ? delete this[t] : Object.defineProperty(this, t, {
					configurable: !0,
					writable: !0,
					value: r
				}), k = k || e, r;
			} catch (n) {
				throw delete this[t], k = k || e, n;
			}
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				value: e
			});
		}
	}));
}
function it(e, t, n, r) {
	let i = tt(e, t);
	i && Object.defineProperty(i, t, {
		configurable: !0,
		get() {
			let e = {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: void 0
			};
			return Object.defineProperty(this, t, e), e.value = n(this), Object.defineProperty(this, t, e), e.value;
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: e
			});
		}
	});
}
var at = "~constantCatch";
function ot(e) {
	let t = () => e;
	return t[at] = !0, t;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/core.js
var st, ct = {
	value: void 0,
	enumerable: !1
}, lt = "captureStackTrace" in Error ? Error : null;
function ut(e) {
	let t = lt;
	if (t) {
		let n = t.stackTraceLimit;
		if (typeof n == "number") {
			try {
				t.stackTraceLimit = 0;
			} catch {
				return lt = null, new e();
			}
			try {
				return new e();
			} finally {
				t.stackTraceLimit = n;
			}
		}
	}
	return new e();
}
/* @__NO_SIDE_EFFECTS__ */
function j(e, t, n, r) {
	let i = {};
	function a(e) {
		this.def = e, this.constr = d, this.traits = /* @__PURE__ */ new Set();
	}
	a.prototype = i;
	let o = n, s = o && /* @__PURE__ */ new WeakSet();
	function c(n, r) {
		if (!n._zod) {
			ct.value = new a(r);
			try {
				Object.defineProperty(n, "_zod", ct);
			} finally {
				ct.value = void 0;
			}
		} else if (n._zod.traits.has(e)) return;
		if (n._zod.traits.add(e), t(n, r), s) {
			let e = Object.getPrototypeOf(n), t = n._zod.constr.prototype, r = e;
			for (; r && r !== t;) r = Object.getPrototypeOf(r);
			let i = r ?? e;
			s.has(i) || (s.add(i), Ze(i, o));
		}
		let i = d.prototype;
		for (let e in i) Object.prototype.hasOwnProperty.call(i, e) && (e in n || (n[e] = i[e].bind(n)));
	}
	let l = r?.Parent ?? Object;
	class u extends l {}
	Object.defineProperty(u, "name", { value: e });
	function d(e) {
		let t = r?.Parent ? ut(u) : this;
		c(t, e);
		let n = t._zod.deferred;
		if (n) {
			for (let e of n) e();
			t._zod.deferred = void 0;
		}
		let i = globalThis.__zod_globalConfig?.postProcessor;
		return i && i(t), t;
	}
	return Object.defineProperty(d, "init", { value: c }), Object.defineProperty(d, Symbol.hasInstance, { value: (t) => r?.Parent && t instanceof r.Parent ? !0 : t?._zod?.traits?.has(e) }), Object.defineProperty(d, "name", { value: e }), d;
}
var M = class extends Error {
	constructor() {
		super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
	}
}, dt = class extends Error {
	constructor(e) {
		super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
	}
};
(st = globalThis).__zod_globalConfig ?? (st.__zod_globalConfig = {});
var N = globalThis.__zod_globalConfig;
function P(e) {
	return e && Object.assign(N, e), N;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/errors.js
function ft() {
	let e = this._zod;
	return e.message ?? (e.message = JSON.stringify(e.def, fe, 2)), e.message;
}
function pt(e) {
	this._zod.message = e;
}
var mt = {
	get: ft,
	set: pt,
	enumerable: !0,
	configurable: !0
}, ht = {
	value: void 0,
	enumerable: !1
}, gt = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]), _t = /* @__PURE__ */ j("$ZodError", (e, t) => {
	e.name = "$ZodError", ht.value = t, Object.defineProperty(e, "issues", ht), ht.value = void 0, Object.defineProperty(e, "message", mt);
	let n = Object.getPrototypeOf(e);
	gt.has(n) || (gt.add(n), Object.defineProperty(n, "toString", {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = () => this.message;
			return Object.defineProperty(this, "toString", {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, "toString", {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	}));
});
function vt(e, t, n) {
	return Object.prototype.hasOwnProperty.call(e, t) || (t === "__proto__" ? Object.defineProperty(e, t, {
		value: n(),
		writable: !0,
		enumerable: !0,
		configurable: !0
	}) : e[t] = n()), e[t];
}
function yt(e, t = (e) => e.message) {
	let n = {}, r = [];
	for (let i of e.issues) i.path.length > 0 ? vt(n, i.path[0], () => []).push(t(i)) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function bt(e, t = (e) => e.message) {
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
					let n = e[i], o = i === e.length - 1;
					if (n === "_errors") {
						o && r._errors.push(t(a)), i++;
						continue;
					}
					Object.prototype.hasOwnProperty.call(r, n) || Object.defineProperty(r, n, {
						value: { _errors: [] },
						enumerable: !0,
						writable: !0,
						configurable: !0
					});
					let s = r[n];
					o && s._errors.push(t(a)), r = s, i++;
				}
			}
		}
	};
	return r(e), n;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/parse.js
function xt(e, t) {
	return {
		callee: t?.callee ?? e,
		Err: t?.Err
	};
}
var St = (e) => {
	let t = (n, r, i, a) => {
		let o = i ? {
			...i,
			async: !1
		} : { async: !1 }, s = n._zod.run({
			value: r,
			issues: []
		}, o);
		if (s instanceof Promise) throw new M();
		if (s.issues.length) {
			let n = new ((a?.Err) ?? e)(s.issues.map((e) => E(e, o, P())));
			throw we(n, a?.callee ?? t), n;
		}
		return s.value;
	};
	return t;
}, Ct = (e) => {
	let t = async (n, r, i, a) => {
		let o = i ? {
			...i,
			async: !0
		} : { async: !0 }, s = n._zod.run({
			value: r,
			issues: []
		}, o);
		if (s instanceof Promise && (s = await s), s.issues.length) {
			let n = new ((a?.Err) ?? e)(s.issues.map((e) => E(e, o, P())));
			throw we(n, a?.callee ?? t), n;
		}
		return s.value;
	};
	return t;
}, wt = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		async: !1
	} : { async: !1 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	if (a instanceof Promise) throw new M();
	return a.issues.length ? Tt(e, a.issues, i) : {
		success: !0,
		data: a.value
	};
};
function Tt(e, t, n) {
	let r;
	return {
		success: !1,
		get error() {
			return r || (r = new e(t.map((e) => E(e, n, P()))), t = void 0, n = void 0), r;
		},
		set error(e) {
			r = e, t = void 0, n = void 0;
		}
	};
}
var Et = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		async: !0
	} : { async: !0 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	return a instanceof Promise && (a = await a), a.issues.length ? Tt(e, a.issues, i) : {
		success: !0,
		data: a.value
	};
}, Dt = /* @__PURE__ */ Symbol.for("zod.compile.invalid"), Ot = /* @__PURE__ */ Symbol.for("zod.compile.fallback"), kt = ((e, t, n) => {
	let r = e._zod.bag.validator;
	if (r !== void 0) {
		if (r(t) !== Dt) return !0;
		if (r.definite === !0 && n === void 0) return !1;
	}
	return At(e, t, n);
});
function At(e, t, n) {
	let r = n ? {
		...n,
		async: !1,
		abortEarly: !0
	} : {
		async: !1,
		abortEarly: !0
	}, i = e._zod.bag.fallbackRun, a;
	if (i ? (r[Ot] = !0, a = i({
		value: t,
		issues: []
	}, r)) : a = e._zod.run({
		value: t,
		issues: []
	}, r), a instanceof Promise) throw new M();
	return a.issues.length === 0;
}
var jt = async (e, t, n) => {
	let r = n ? {
		...n,
		async: !0,
		abortEarly: !0
	} : {
		async: !0,
		abortEarly: !0
	}, i = e._zod.run({
		value: t,
		issues: []
	}, r);
	return i instanceof Promise && (i = await i), i.issues.length === 0;
}, Mt = (e) => {
	let t = St(e), n = (e, r, i, a) => {
		let o = i ? {
			...i,
			direction: "backward"
		} : { direction: "backward" };
		return t(e, r, o, xt(n, a));
	};
	return n;
}, Nt = (e) => {
	let t = St(e), n = (e, r, i, a) => t(e, r, i, xt(n, a));
	return n;
}, Pt = (e) => {
	let t = Ct(e), n = async (e, r, i, a) => {
		let o = i ? {
			...i,
			direction: "backward"
		} : { direction: "backward" };
		return await t(e, r, o, xt(n, a));
	};
	return n;
}, Ft = (e) => {
	let t = Ct(e), n = async (e, r, i, a) => await t(e, r, i, xt(n, a));
	return n;
}, It = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return wt(e)(t, n, i);
}, Lt = (e) => (t, n, r) => wt(e)(t, n, r), Rt = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return Et(e)(t, n, i);
}, zt = (e) => async (t, n, r) => Et(e)(t, n, r), Bt = /^[cC][0-9a-z]{6,}$/, Vt = /^[0-9a-z]+$/, Ht = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/, Ut = /^[0-9a-vA-V]{20}$/, Wt = /^[A-Za-z0-9]{27}$/, Gt = /^[a-zA-Z0-9_-]{21}$/;
function Kt(e) {
	return RegExp(`^[a-zA-Z0-9_-]{${e}}$`);
}
var qt = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, Jt = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, Yt = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, Xt = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, Zt = "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
function Qt() {
	return new RegExp(Zt, "u");
}
var $t = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, en = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, tn = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, nn = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, rn = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, an = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/, on = /^https?$/, sn = /^\+[1-9]\d{6,14}$/, cn = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
function ln(e) {
	return RegExp(`^${e}$`);
}
var un = /*@__PURE__*/ ln(cn);
function dn(e) {
	let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
	return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : e.seconds ? `${t}:[0-5]\\d(?:\\.\\d+)?` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function fn(e) {
	return RegExp(`^${dn(e)}$`);
}
function pn(e) {
	let t = ["Z"];
	e.offset && t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
	let n = `${dn({
		precision: e.precision,
		seconds: !0
	})}(?:${t.join("|")})`, r = e.local ? `${n}|${dn({ precision: e.precision })}` : n;
	return RegExp(`^${cn}T(?:${r})$`);
}
var mn = /^[\s\S]{0,}$/, hn = /^-?\d+(?:\.\d+)?$/, gn = /^[^A-Z]*$/, _n = /^[^a-z]*$/, F = /*@__PURE__*/ j("$ZodCheck", (e, t) => {
	var n;
	e._zod ?? (e._zod = {}), e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), vn = (e) => {
	let t = e.value;
	return !he(t) && t.length !== void 0;
}, yn = {
	number: "number",
	bigint: "bigint",
	object: "date"
}, bn = /*@__PURE__*/ j("$ZodCheckLessThan", (e, t) => {
	F.init(e, t);
	let n = yn[typeof t.value];
	e._zod.check = (r) => {
		(t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
			origin: yn[typeof r.value] ?? n,
			code: "too_big",
			maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), xn = /*@__PURE__*/ j("$ZodCheckGreaterThan", (e, t) => {
	F.init(e, t);
	let n = yn[typeof t.value];
	e._zod.check = (r) => {
		(t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
			origin: yn[typeof r.value] ?? n,
			code: "too_small",
			minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), Sn = /*@__PURE__*/ j("$ZodCheckMultipleOf", (e, t) => {
	F.init(e, t), e._zod.check = (n) => {
		if (typeof n.value != typeof t.value) throw Error("Cannot mix number and bigint in multiple_of check.");
		(typeof n.value == "bigint" ? t.value !== BigInt(0) && n.value % t.value === BigInt(0) : _e(n.value, t.value) === 0) || n.issues.push({
			origin: typeof n.value,
			code: "not_multiple_of",
			divisor: t.value,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Cn = /*@__PURE__*/ j("$ZodCheckNumberFormat", (e, t) => {
	F.init(e, t), t.format = t.format || "float64";
	let n = t.format?.includes("int"), r = n ? "int" : "number", [i, a] = Me[t.format];
	e._zod.check = (o) => {
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
}), wn = /*@__PURE__*/ j("$ZodCheckMaxLength", (e, t) => {
	var n;
	F.init(e, t), (n = e._zod.def).when ?? (n.when = vn), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if ((typeof r == "string" && i > t.maximum ? Je(r) : i) <= t.maximum) return;
		let a = Ye(r);
		n.issues.push({
			origin: a,
			code: "too_big",
			maximum: t.maximum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), Tn = /*@__PURE__*/ j("$ZodCheckMinLength", (e, t) => {
	var n;
	F.init(e, t), (n = e._zod.def).when ?? (n.when = vn), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if ((typeof r == "string" && i >= t.minimum && i < t.minimum * 2 ? Je(r) : i) >= t.minimum) return;
		let a = Ye(r);
		n.issues.push({
			origin: a,
			code: "too_small",
			minimum: t.minimum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), En = /*@__PURE__*/ j("$ZodCheckLengthEquals", (e, t) => {
	var n;
	F.init(e, t), (n = e._zod.def).when ?? (n.when = vn), e._zod.check = (n) => {
		let r = n.value, i = r.length, a = typeof r == "string" && i >= t.length && i <= t.length * 2 ? Je(r) : i;
		if (a === t.length) return;
		let o = Ye(r), s = a > t.length;
		n.issues.push({
			origin: o,
			...s ? {
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
}), Dn = /*@__PURE__*/ j("$ZodCheckStringFormat", (e, t) => {
	var n, r;
	F.init(e, t), t.pattern ? (n = e._zod).check ?? (n.check = (n) => {
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
}), On = /*@__PURE__*/ j("$ZodCheckRegex", (e, t) => {
	Dn.init(e, t), e._zod.check = (n) => {
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
}), kn = /*@__PURE__*/ j("$ZodCheckLowerCase", (e, t) => {
	t.pattern ?? (t.pattern = gn), Dn.init(e, t);
}), An = /*@__PURE__*/ j("$ZodCheckUpperCase", (e, t) => {
	t.pattern ?? (t.pattern = _n), Dn.init(e, t);
}), jn = /*@__PURE__*/ j("$ZodCheckIncludes", (e, t) => {
	F.init(e, t);
	let n = ke(t.includes);
	t.pattern = new RegExp(typeof t.position == "number" ? `^.{${t.position},}${n}` : n), e._zod.check = (n) => {
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
}), Mn = /*@__PURE__*/ j("$ZodCheckStartsWith", (e, t) => {
	F.init(e, t);
	let n = RegExp(`^${ke(t.prefix)}.*`);
	t.pattern ?? (t.pattern = n), e._zod.check = (n) => {
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
}), Nn = /*@__PURE__*/ j("$ZodCheckEndsWith", (e, t) => {
	F.init(e, t);
	let n = RegExp(`.*${ke(t.suffix)}$`);
	t.pattern ?? (t.pattern = n), e._zod.check = (n) => {
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
}), Pn = /*@__PURE__*/ j("$ZodCheckOverwrite", (e, t) => {
	F.init(e, t), e._zod.check = (e) => {
		e.value = t.tx(e.value);
	};
}), Fn = class {
	constructor(e = [], t = {}) {
		this.content = [], this.indent = 0, this.args = e, this.closed = t;
	}
	indented(e) {
		this.indent += 1;
		try {
			e(this);
		} finally {
			--this.indent;
		}
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
		let e = Function, t = this?.content ?? [""];
		return new e(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${t.join("\n")}\n};`)(...Object.values(this.closed));
	}
}, In = {
	major: 4,
	minor: 6,
	patch: 7
}, I = /*@__PURE__*/ j("$ZodType", (e, t) => {
	var n;
	e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = In;
	let r = e._zod.def.checks, i = e._zod.traits.has("$ZodCheck") ? [e, ...r ?? []] : r?.length ? [...r] : [];
	for (let t of i) for (let n of t._zod.onattach) n(e);
	if (i.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
		e._zod.run = e._zod.parse;
	});
	else {
		let t = (t, n, r) => {
			if (t.memo) return t;
			let i = w(t), a;
			for (let o of n) {
				if (o._zod.def.when) {
					if (Ue(t) || !o._zod.def.when(t)) continue;
				} else if (i) continue;
				let n = t.issues.length, s = o._zod.check(t);
				if (s instanceof Promise && r?.async === !1) throw new M();
				if (a || s instanceof Promise) a = (a ?? Promise.resolve()).then(async () => {
					await s, t.issues.length !== n && (Ke(t.issues, n, e), i || (i = w(t, n)));
				});
				else {
					if (t.issues.length === n) continue;
					Ke(t.issues, n, e), i || (i = w(t, n));
				}
			}
			return a ? a.then(() => t) : t;
		}, n = (n, r, a) => {
			if (w(n)) return n.aborted = !0, n;
			let o = t(r, i, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new M();
				return o.then((t) => e._zod.parse(t, a));
			}
			return e._zod.parse(o, a);
		};
		e._zod.run = (r, a) => {
			if (a.skipChecks) return e._zod.parse(r, a);
			if (a.direction === "backward") {
				let t = e._zod.parse({
					value: r.value,
					issues: []
				}, {
					...a,
					skipChecks: !0
				});
				return t instanceof Promise ? t.then((e) => n(e, r, a)) : n(t, r, a);
			}
			let o = e._zod.parse(r, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new M();
				return o.then((e) => t(e, i, a));
			}
			return t(o, i, a);
		};
	}
}, {
	get "~standard"() {
		return Qe(this, "~standard", zn(this));
	},
	set "~standard"(e) {
		O(this, "~standard", e);
	}
}), Ln = (e, t) => e.issues.length ? { issues: e.issues.map((e) => E(e, t, P())) } : { value: e.value };
async function Rn(e, t) {
	let n = { async: !0 };
	return Ln(await e._zod.run({
		value: t,
		issues: []
	}, n), n);
}
function zn(e) {
	return {
		validate: (t) => {
			let n = { async: !1 };
			try {
				let r = e._zod.run({
					value: t,
					issues: []
				}, n);
				if (!(r instanceof Promise)) return Ln(r, n);
			} catch {}
			return Rn(e, t);
		},
		vendor: "zod",
		version: 1
	};
}
var Bn = /*@__PURE__*/ j("$ZodString", (e, t) => {
	I.init(e, t), e._zod.pattern = t.pattern ?? mn, e._zod.parse = (n, r) => {
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
}), L = /*@__PURE__*/ j("$ZodStringFormat", (e, t) => {
	Dn.init(e, t), Bn.init(e, t);
}), Vn = /*@__PURE__*/ j("$ZodGUID", (e, t) => {
	t.pattern ?? (t.pattern = Jt), L.init(e, t);
}), Hn = /*@__PURE__*/ j("$ZodUUID", (e, t) => {
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
		t.pattern ?? (t.pattern = Yt(e));
	} else t.pattern ?? (t.pattern = Yt());
	L.init(e, t);
}), Un = /*@__PURE__*/ j("$ZodEmail", (e, t) => {
	t.pattern ?? (t.pattern = Xt), L.init(e, t);
});
function Wn(e) {
	try {
		return typeof URL < "u" && typeof URL.canParse == "function" ? URL.canParse(e) : (new URL(e), !0);
	} catch {
		return !1;
	}
}
function Gn(e, t) {
	return !("normalize" in t) && !("hostname" in t) && !("protocol" in t) ? Wn(e) || 2 : Kn(e, t);
}
function Kn(e, t) {
	if (!t.normalize && t.protocol?.source === on.source && !/^https?:\/\//i.test(e)) return 1;
	try {
		if (typeof URL < "u") {
			let t = URL;
			if (typeof t.parse == "function") return t.parse(e) ?? 2;
		}
		return new URL(e);
	} catch {
		return 2;
	}
}
var qn = /[\t\n\r]/g;
function Jn(e) {
	return e.replace(qn, "");
}
function Yn(e, t) {
	return t.lastIndex = 0, t.test(e.hostname);
}
function Xn(e, t) {
	return t.lastIndex = 0, t.test(e.protocol.endsWith(":") ? e.protocol.slice(0, -1) : e.protocol);
}
var Zn = /*@__PURE__*/ j("$ZodURL", (e, t) => {
	L.init(e, t), e._zod.check = (n) => {
		try {
			let r = n.value.trim(), i = Gn(r, t);
			if (i === 1) {
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
			if (i === 2) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			if (i === !0) {
				n.value = Jn(r);
				return;
			}
			t.hostname && !Yn(i, t.hostname) && n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: t.hostname.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			}), t.protocol && !Xn(i, t.protocol) && n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: t.protocol.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			}), n.value = t.normalize ? i.href : Jn(r);
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
}), Qn = /*@__PURE__*/ j("$ZodEmoji", (e, t) => {
	t.pattern ?? (t.pattern = Qt()), L.init(e, t);
}), $n = /*@__PURE__*/ j("$ZodNanoID", (e, t) => {
	if (t.length !== void 0 && (!Number.isInteger(t.length) || t.length < 1)) throw Error(`Invalid nanoid length: ${t.length}`);
	t.pattern ?? (t.pattern = t.length === void 0 ? Gt : Kt(t.length)), L.init(e, t);
}), er = /*@__PURE__*/ j("$ZodCUID", (e, t) => {
	t.pattern ?? (t.pattern = Bt), L.init(e, t);
}), tr = /*@__PURE__*/ j("$ZodCUID2", (e, t) => {
	t.pattern ?? (t.pattern = Vt), L.init(e, t);
}), nr = /*@__PURE__*/ j("$ZodULID", (e, t) => {
	t.pattern ?? (t.pattern = Ht), L.init(e, t);
}), rr = /*@__PURE__*/ j("$ZodXID", (e, t) => {
	t.pattern ?? (t.pattern = Ut), L.init(e, t);
}), ir = /*@__PURE__*/ j("$ZodKSUID", (e, t) => {
	t.pattern ?? (t.pattern = Wt), L.init(e, t);
}), ar = /*@__PURE__*/ j("$ZodISODateTime", (e, t) => {
	t.pattern ?? (t.pattern = pn(t)), L.init(e, t);
}), or = /*@__PURE__*/ j("$ZodISODate", (e, t) => {
	t.pattern ?? (t.pattern = un), L.init(e, t);
}), sr = /*@__PURE__*/ j("$ZodISOTime", (e, t) => {
	t.pattern ?? (t.pattern = fn(t)), L.init(e, t);
}), cr = /*@__PURE__*/ j("$ZodISODuration", (e, t) => {
	t.pattern ?? (t.pattern = qt), L.init(e, t);
}), lr = /*@__PURE__*/ j("$ZodIPv4", (e, t) => {
	t.pattern ?? (t.pattern = $t), L.init(e, t);
}), ur = /^[0-9a-fA-F:.]+$/;
function dr(e) {
	return ur.test(e) ? Wn(`http://[${e}]`) : !1;
}
var fr = /*@__PURE__*/ j("$ZodIPv6", (e, t) => {
	t.pattern ?? (t.pattern = en), L.init(e, t), e._zod.check = (n) => {
		dr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "ipv6",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), pr = /*@__PURE__*/ j("$ZodCIDRv4", (e, t) => {
	t.pattern ?? (t.pattern = tn), L.init(e, t);
});
function mr(e) {
	let t = e.split("/");
	if (t.length !== 2) return !1;
	let [n, r] = t;
	if (!r) return !1;
	let i = Number(r);
	return `${i}` !== r || i < 0 || i > 128 ? !1 : dr(n);
}
var hr = /*@__PURE__*/ j("$ZodCIDRv6", (e, t) => {
	t.pattern ?? (t.pattern = nn), L.init(e, t), e._zod.check = (n) => {
		mr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "cidrv6",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function gr(e) {
	if (e === "") return !0;
	if (/\s/.test(e) || e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
var _r = /^[0-9a-zA-Z+/]*={0,2}$/, vr = /*@__PURE__*/ j("$ZodBase64", (e, t) => {
	t.pattern ?? (t.pattern = _r), L.init(e, t), e._zod.check = (n) => {
		gr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), yr = /^[A-Za-z0-9_-]*$/;
function br(e) {
	if (!yr.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === "-" ? "+" : "/");
	return gr(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var xr = /*@__PURE__*/ j("$ZodBase64URL", (e, t) => {
	t.pattern ?? (t.pattern = yr), L.init(e, t), e._zod.check = (n) => {
		br(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Sr = /*@__PURE__*/ j("$ZodE164", (e, t) => {
	t.pattern ?? (t.pattern = sn), L.init(e, t);
});
function Cr(e, t = null) {
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
var wr = /*@__PURE__*/ j("$ZodJWT", (e, t) => {
	L.init(e, t), e._zod.check = (n) => {
		Cr(n.value, t.alg) || n.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Tr = /*@__PURE__*/ j("$ZodNumber", (e, t) => {
	I.init(e, t), e._zod.pattern = hn, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = Number(n.value);
		} catch {}
		let i = n.value;
		if (typeof i == "number" && !Number.isNaN(i) && Number.isFinite(i)) return n;
		let a = typeof i == "number" ? Number.isNaN(i) ? "NaN" : Number.isFinite(i) ? void 0 : String(i) : void 0;
		return n.issues.push({
			expected: "number",
			code: "invalid_type",
			input: i,
			inst: e,
			...a ? { received: a } : {}
		}), n;
	};
}), Er = /*@__PURE__*/ j("$ZodNumberFormat", (e, t) => {
	Cn.init(e, t), Tr.init(e, t);
}), Dr = /*@__PURE__*/ j("$ZodUnknown", (e, t) => {
	I.init(e, t), e._zod.parse = (e) => e;
}), Or = /*@__PURE__*/ j("$ZodNever", (e, t) => {
	I.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
		expected: "never",
		code: "invalid_type",
		input: t.value,
		inst: e
	}), t);
});
function kr(e, t) {
	let n = Ge(e._zod.def.checks);
	if (!n.length) return;
	let r = Math.min(...n.map((e) => e[0])), i = e._zod.parse;
	e._zod.parse = (n, a) => {
		let o = t(n.value);
		if (o > r && !a?.skipChecks && a?.direction !== "backward") {
			for (let [t, r] of Ge(e._zod.def.checks)) if (o > t && r._zod.def.when(n)) {
				let t = n.issues.length;
				return r._zod.check(n), n.issues[t].continue = !1, Ke(n.issues, t, e), n;
			}
		}
		return i(n, a);
	};
}
var Ar = (e) => Array.isArray(e) ? e.length : -1;
function jr(e, t, n) {
	e.issues.length && t.issues.push(...We(n, e.issues)), t.value[n] = e.value;
}
var Mr = /*@__PURE__*/ j("$ZodArray", (e, t) => {
	I.init(e, t);
	let n = N.memoizer;
	n?.attach(e), e._zod.parse = (r, i) => {
		let a = r.value;
		if (!Array.isArray(a)) return r.issues.push({
			expected: "array",
			code: "invalid_type",
			input: a,
			inst: e
		}), r;
		r.value = n ? n.alloc(e, r, Array(a.length), i) : Array(a.length);
		let o = [], s = i?.abortEarly;
		for (let e = 0; e < a.length; e++) {
			let n = a[e], c = t.element._zod.run({
				value: n,
				issues: []
			}, i);
			if (c instanceof Promise) o.push(c.then((t) => jr(t, r, e)));
			else if (jr(c, r, e), s && c.issues.length !== 0 && w(c)) break;
		}
		return o.length ? Promise.all(o).then(() => r) : r;
	}, kr(e, Ar);
});
function Nr(e, t, n, r, i, a) {
	let o = n in r, s = a === "optional";
	if (o || !s || i !== "optional") {
		if (e.issues.length) {
			if (i !== void 0 && s && !o) return;
			t.issues.push(...We(n, e.issues));
		}
		!o && i === void 0 ? e.issues.length || t.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [n]
		}) : e.value === void 0 ? (o || i === "defaulted" && !s) && (t.value[n] = void 0) : t.value[n] = e.value;
	}
}
var Pr = [];
function Fr(e) {
	let t = Object.keys(e.shape), n = Object.getOwnPropertySymbols(e.shape), r = n.length ? n : Pr, i = r.length ? [...t, ...r] : t;
	for (let t of i) if (!e.shape?.[t]?._zod?.traits?.has("$ZodType")) throw Error(`Invalid element at key "${String(t)}": expected a Zod schema`);
	let a = je(e.shape);
	return {
		...e,
		allKeys: i,
		symbolKeys: r,
		keySet: new Set(t),
		numKeys: t.length,
		optionalKeys: new Set(a)
	};
}
function Ir(e, t, n, r, i, a, o) {
	let s = [], c = i.keySet, l = i.catchall._zod, u = l.def.type, d = l.optin, f = l.optout, p = 0;
	for (let i in t) {
		if (o && n.issues.length !== p) {
			if (w(n, p)) break;
			p = n.issues.length;
		}
		if (c.has(i)) continue;
		if (i === "__proto__") {
			u === "never" && s.push(i);
			continue;
		}
		if (u === "never") {
			s.push(i);
			continue;
		}
		let a = l.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => Nr(e, n, i, t, d, f))) : Nr(a, n, i, t, d, f);
	}
	return s.length && n.issues.push({
		code: "unrecognized_keys",
		keys: s,
		input: t,
		inst: a,
		continue: !0
	}), e.length ? Promise.all(e).then(() => n) : n;
}
var Lr = /*@__PURE__*/ j("$ZodObject", (e, t) => {
	I.init(e, t);
	let n = Object.getOwnPropertyDescriptor(t, "shape"), r = n?.get ? n.get.raw : t.shape ?? {};
	if (r) {
		let e = () => {
			let n = { ...r };
			return Object.defineProperty(t, "shape", { value: n }), e.raw = n, n;
		};
		e.raw = r, Object.defineProperty(t, "shape", { get: e });
	}
	let i = me(() => Fr(t));
	A(e, "propValues", (e) => {
		let t = e.def.shape, n = {};
		for (let e in t) {
			let r = t[e]._zod;
			if (r.values) {
				Object.prototype.hasOwnProperty.call(n, e) || _(n, e, /* @__PURE__ */ new Set());
				for (let t of r.values) n[e].add(t);
				r.optin !== void 0 && n[e].add(void 0);
			}
		}
		return n;
	});
	let a = Te, o = t.catchall, s, c = N.memoizer;
	c?.attach(e), e._zod.parse = (t, n) => {
		s ?? (s = i.value);
		let r = t.value;
		if (!a(r)) return t.issues.push({
			expected: "object",
			code: "invalid_type",
			input: r,
			inst: e
		}), t;
		t.value = c ? c.alloc(e, t, {}, n) : {};
		let l = [], u = s.shape, d = n?.abortEarly, f = t.issues.length;
		for (let e of s.allKeys) {
			if (d && t.issues.length !== f) {
				if (w(t, f)) break;
				f = t.issues.length;
			}
			if (e === "__proto__") continue;
			let i = u[e], a = i._zod.optin, o = i._zod.optout, s = i._zod.run({
				value: r[e],
				issues: []
			}, n);
			s instanceof Promise ? l.push(s.then((n) => Nr(n, t, e, r, a, o))) : Nr(s, t, e, r, a, o);
		}
		return o ? Ir(l, r, t, n, i.value, e, d === !0) : l.length ? Promise.all(l).then(() => t) : t;
	};
}), Rr = /*@__PURE__*/ j("$ZodObjectJIT", (e, t) => {
	Lr.init(e, t);
	let n = e._zod.parse, r = me(() => Fr(t)), i = N.memoizer, a = (t) => {
		let n = r.value, a = n.symbolKeys, o = new Fn(["payload", "ctx"], {
			shape: t,
			inst: e,
			memo: i,
			syms: a
		}), s = (e) => `shape[${e}]._zod.run({ value: input[${e}], issues: [] }, ctx)`, c = (e, t) => `
          let ${e}_ab = false;
          for (let i = 0; i < ${e}.issues.length; i++) {
            const iss = ${e}.issues[i];
            iss.path = iss.path ? [${t}, ...iss.path] : [${t}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${e}_ab = true;
          }
          if (${e}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
		o.write("const input = payload.value;");
		let l = Object.create(null), u = 0;
		for (let e of n.allKeys) l[e] = `key_${u++}`;
		o.write(i ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};");
		for (let e of n.allKeys) {
			if (e === "__proto__") continue;
			let n = l[e], r = typeof e == "symbol" ? `syms[${a.indexOf(e)}]` : Se(e), i = `${r} in input`, u = t[e], d = u?._zod?.optin, f = d !== void 0, p = u?._zod?.optout === "optional";
			if (o.write(`const ${n} = ${s(r)};`), f && p) {
				let e = d === "optional" ? `${n}_present` : `${n}.value !== undefined || ${n}_present`;
				o.write(`
        const ${n}_present = ${i};
        if (!${n}.issues.length || ${n}_present) {
          if (${n}.issues.length) {${c(n, r)}
          }

          if (${e}) {
            newResult[${r}] = ${n}.value;
          }
        }

      `);
			} else f ? (o.write(`
        if (${n}.issues.length) {${c(n, r)}
        }
      `), d === "defaulted" ? o.write(`newResult[${r}] = ${n}.value;`) : o.write(`
        if (${n}.value !== undefined || ${i}) {
          newResult[${r}] = ${n}.value;
        }
      `)) : o.write(`
        const ${n}_present = ${i};
        if (${n}.issues.length) {${c(n, r)}
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${r}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${n}_present) {
          newResult[${r}] = ${n}.value;
        }

      `);
		}
		return o.write("payload.value = newResult;"), o.write("return payload;"), o.compile();
	}, o, s = Te, c = !N.jitless, l = c && Ee.value, u = t.catchall, d;
	e._zod.parse = (i, f) => {
		d ?? (d = r.value);
		let p = i.value;
		return s(p) ? c && l && f?.async === !1 && f.jitless !== !0 ? (o || (o = a(t.shape)), i = o(i, f), u ? Ir([], p, i, f, d, e, f?.abortEarly === !0) : i) : n(i, f) : (i.issues.push({
			expected: "object",
			code: "invalid_type",
			input: p,
			inst: e
		}), i);
	};
});
function zr(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !w(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: "invalid_union",
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => E(e, r, P())))
	}), t);
}
var Br = /*@__PURE__*/ j("$ZodUnion", (e, t) => {
	I.init(e, t), A(e, "optin", (e) => e.def.options.some((e) => e._zod.optin === "defaulted") ? "defaulted" : e.def.options.some((e) => e._zod.optin !== void 0) ? "optional" : void 0), A(e, "optout", (e) => e.def.options.some((e) => e._zod.optout === "optional") ? "optional" : void 0), A(e, "values", (e) => {
		if (e.def.options.every((e) => e._zod.values)) return new Set(e.def.options.flatMap((e) => Array.from(e._zod.values)));
	}), A(e, "pattern", (e) => {
		if (e.def.options.every((e) => e._zod.pattern)) {
			let t = e.def.options.map((e) => e._zod.pattern);
			return RegExp(`^(${t.map((e) => ge(e.source)).join("|")})$`);
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
		return a ? Promise.all(o).then((t) => zr(t, r, e, i)) : zr(o, r, e, i);
	};
}), Vr = /*@__PURE__*/ j("$ZodIntersection", (e, t) => {
	I.init(e, t), e._zod.parse = (e, n) => {
		let r = e.value, i = t.left._zod.run({
			value: r,
			issues: []
		}, n), a = t.right._zod.run({
			value: r,
			issues: []
		}, n);
		return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => Ur(e, t, n)) : Ur(e, i, a);
	};
});
function Hr(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (x(e) && x(t)) {
		let n = Object.keys(t), r = Object.keys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		Object.prototype.hasOwnProperty.call(i, "__proto__") && delete i.__proto__;
		for (let n of r) {
			if (n === "__proto__") continue;
			let r = Hr(e[n], t[n]);
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
			let i = e[r], a = t[r], o = Hr(i, a);
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
function Ur(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i, a = /* @__PURE__ */ new Map(), o = (e, t) => {
		let n;
		if (e.code === "unrecognized_keys" && !e.path?.length) i ?? (i = e), n = e.keys;
		else if (e.code === "invalid_key" && e.origin === "record" && e.path?.length === 1) {
			let t = String(e.path[0]);
			a.has(t) || a.set(t, e), n = [t];
		} else return !1;
		for (let e of n) r.has(e) || r.set(e, {}), r.get(e)[t] = !0;
		return !0;
	};
	for (let n of t.issues) o(n, "l") || e.issues.push(n);
	for (let t of n.issues) o(t, "r") || e.issues.push(t);
	let s = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
	if (s.length) {
		let t = i ? s.filter((e) => i.keys.includes(e)) : [];
		t.length && e.issues.push({
			...i,
			keys: t
		});
		for (let n of s) !t.includes(n) && a.has(n) && e.issues.push(a.get(n));
	}
	let c = Hr(t.value, n.value);
	if (!c.valid) {
		if (w(e)) return e;
		throw Error(`Unmergable intersection. Error path: ${JSON.stringify(c.mergeErrorPath)}`);
	}
	return e.value = c.data, e;
}
var Wr = /*@__PURE__*/ j("$ZodEnum", (e, t) => {
	I.init(e, t);
	let n = ue(t.entries), r = new Set(n);
	e._zod.values = r, A(e, "pattern", (e) => {
		let t = ue(e.def.entries).filter((e) => Oe.has(typeof e));
		return RegExp(t.length ? `^(${t.map((e) => ke(e.toString())).join("|")})$` : "^[^\\s\\S]$");
	}), e._zod.parse = (t, i) => {
		let a = t.value;
		return r.has(a) || t.issues.push({
			code: "invalid_value",
			values: n,
			input: a,
			inst: e
		}), t;
	};
}), Gr = /*@__PURE__*/ j("$ZodTransform", (e, t) => {
	I.init(e, t), e._zod.optin = "optional", N.memoizer?.guard(e), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new dt(e.constructor.name);
		let i = t.transform(n.value, n);
		if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n));
		if (i instanceof Promise) throw new M();
		return n.value = i, n;
	};
});
function Kr(e, t) {
	return e.value = t.issues.length ? void 0 : t.value, e;
}
var qr = /*@__PURE__*/ j("$ZodOptional", (e, t) => {
	I.init(e, t), A(e, "optin", (e) => e.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), e._zod.optout = "optional", A(e, "values", (e) => {
		let t = e.def.innerType._zod.values;
		return t ? /* @__PURE__ */ new Set([...t, void 0]) : void 0;
	}), A(e, "pattern", (e) => {
		let t = e.def.innerType._zod.pattern;
		return t ? RegExp(`^(${ge(t.source)})?$`) : void 0;
	}), e._zod.parse = (e, n) => {
		if (e.value === void 0) {
			if (t.innerType._zod.optin !== "defaulted") return e;
			let r = t.innerType._zod.run({
				value: e.value,
				issues: []
			}, n);
			return r instanceof Promise ? r.then((t) => Kr(e, t)) : Kr(e, r);
		}
		return t.innerType._zod.run(e, n);
	};
}), Jr = /*@__PURE__*/ j("$ZodExactOptional", (e, t) => {
	qr.init(e, t), A(e, "values", (e) => e.def.innerType._zod.values), A(e, "pattern", (e) => e.def.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
}), Yr = /*@__PURE__*/ j("$ZodNullable", (e, t) => {
	I.init(e, t), A(e, "optin", (e) => e.def.innerType._zod.optin), A(e, "optout", (e) => e.def.innerType._zod.optout), A(e, "pattern", (e) => {
		let t = e.def.innerType._zod.pattern;
		return t ? RegExp(`^(${ge(t.source)}|null)$`) : void 0;
	}), A(e, "values", (e) => e.def.innerType._zod.values ? /* @__PURE__ */ new Set([...e.def.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
}), Xr = /*@__PURE__*/ j("$ZodDefault", (e, t) => {
	I.init(e, t), e._zod.optin = "defaulted", A(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		if (e.value === void 0) return e.value = t.defaultValue, e;
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => Zr(e, t)) : Zr(r, t);
	};
});
function Zr(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
var Qr = /*@__PURE__*/ j("$ZodPrefault", (e, t) => {
	I.init(e, t), e._zod.optin = "defaulted", A(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === "backward" || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
}), $r = /*@__PURE__*/ j("$ZodNonOptional", (e, t) => {
	I.init(e, t), A(e, "values", (e) => {
		let t = e.def.innerType._zod.values;
		return t ? new Set([...t].filter((e) => e !== void 0)) : void 0;
	}), e._zod.parse = (n, r) => {
		let i = t.innerType._zod.run(n, r);
		return i instanceof Promise ? i.then((t) => ei(t, e)) : ei(i, e);
	};
});
function ei(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: e.value,
		inst: t
	}), e;
}
function ti(e, t, n, r) {
	return t.issues.length ? (e.value = n.catchValue({
		...t,
		value: e.value,
		error: { issues: t.issues.map((e) => E(e, r, P())) },
		input: e.value
	}), e) : (e.value = t.value, t.memo && (e.memo = !0), e);
}
var ni = /*@__PURE__*/ j("$ZodCatch", (e, t) => {
	I.init(e, t), A(e, "optin", (e) => e.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), A(e, "optout", (e) => e.def.innerType._zod.optout), A(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run({
			value: e.value,
			issues: []
		}, n);
		return r instanceof Promise ? r.then((r) => ti(e, r, t, n)) : ti(e, r, t, n);
	};
}), ri = /*@__PURE__*/ j("$ZodPipe", (e, t) => {
	I.init(e, t), A(e, "values", (e) => e.def.in._zod.values), A(e, "optin", (e) => e.def.in._zod.optin), A(e, "optout", (e) => e.def.out._zod.optout), A(e, "propValues", (e) => e.def.in._zod.propValues), e._zod.parse = (e, n) => {
		if (n.direction === "backward") {
			let r = t.out._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => ii(e, t.in, n)) : ii(r, t.in, n);
		}
		let r = t.in._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => ii(e, t.out, n)) : ii(r, t.out, n);
	};
});
function ii(e, t, n) {
	return e.issues.some((e) => e.code !== "unrecognized_keys") ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues
	}, n);
}
var ai = /*@__PURE__*/ j("$ZodReadonly", (e, t) => {
	I.init(e, t), A(e, "propValues", (e) => e.def.innerType._zod.propValues), A(e, "values", (e) => e.def.innerType._zod.values), A(e, "optin", (e) => e.def.innerType?._zod?.optin), A(e, "optout", (e) => e.def.innerType?._zod?.optout), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then(oi) : oi(r);
	};
});
function oi(e) {
	return e.memo || (e.value = Object.freeze(e.value)), e;
}
var si = /*@__PURE__*/ j("$ZodCustom", (e, t) => {
	F.init(e, t), I.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
		let r = n.value, i = t.fn(r);
		if (i instanceof Promise) return i.then((t) => ci(t, n, r, e));
		ci(i, n, r, e);
	};
});
function ci(e, t, n, r) {
	if (!e) {
		let e = {
			code: "custom",
			input: n,
			inst: r,
			path: [...r._zod.def.path ?? []],
			continue: !r._zod.def.abort
		};
		r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(D(e));
	}
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/memoizer.js
var li = class extends Error {
	constructor() {
		super("Cannot parse a reference cycle that closes through a transform"), this.name = "ZodCyclicError";
	}
}, ui = "~memo", di = [];
function fi(e) {
	return typeof e == "object" && !!e;
}
function pi(e) {
	return e.map((e) => e.path ? {
		...e,
		path: e.path.slice()
	} : { ...e });
}
var mi = /*@__PURE__*/ new WeakMap(), R = 0, hi = 1, z = 2;
function gi(e, t, n) {
	let r = mi.get(e);
	if (r !== void 0) return r ? z : R;
	if (t.has(e)) return z;
	t.add(e);
	let i = R, a = (e) => {
		if (i !== z && e?._zod) {
			let r = gi(e, t, n);
			r > i && (i = r);
		}
	}, o = (e, r) => {
		let i = R;
		for (let a of Reflect.ownKeys(e)) {
			let o = Object.getOwnPropertyDescriptor(e, a);
			if (r && !o.enumerable) continue;
			let s = o.get ? hi : o.value?._zod ? gi(o.value, t, n) : R;
			s > i && (i = s);
		}
		return i;
	}, s = (e) => {
		e > i && (i = e);
	}, c = e._zod.def;
	switch (c.type) {
		case "object": {
			let e = ve(c);
			s(e ? o(e, !0) : hi), a(c.catchall);
			break;
		}
		case "array":
			a(c.element);
			break;
		case "tuple":
			for (let e of c.items) a(e);
			a(c.rest);
			break;
		case "record":
		case "map":
			a(c.keyType), a(c.valueType);
			break;
		case "set":
			a(c.valueType);
			break;
		case "union":
			for (let e of c.options) a(e);
			break;
		case "intersection":
			a(c.left), a(c.right);
			break;
		case "optional":
		case "nullable":
		case "default":
		case "prefault":
		case "catch":
		case "readonly":
		case "nonoptional":
		case "promise":
		case "success":
			a(c.innerType);
			break;
		case "pipe":
			a(c.in), a(c.out);
			break;
		case "function":
			a(c.input), a(c.output);
			break;
		case "lazy": {
			let r = c._cachedInner ?? (n ? e._zod.innerType : void 0);
			s(r ? gi(r, t, !1) : hi);
			break;
		}
		case "template_literal":
		case "string":
		case "number":
		case "int":
		case "boolean":
		case "bigint":
		case "symbol":
		case "undefined":
		case "null":
		case "void":
		case "never":
		case "any":
		case "unknown":
		case "date":
		case "nan":
		case "enum":
		case "literal":
		case "file":
		case "transform":
		case "custom": break;
		default: for (let e in c) {
			let t = Object.getOwnPropertyDescriptor(c, e);
			if (!t || t.get) continue;
			let n = t.value;
			if (n && typeof n == "object") {
				if (n._zod) a(n);
				else if (Array.isArray(n)) for (let e of n) a(e);
			}
		}
	}
	return t.delete(e), _i(e, i);
}
function _i(e, t) {
	return t !== hi && mi.set(e, t === z), t;
}
function vi(e, t) {
	let n = e.buckets.get(t);
	return n || (n = /* @__PURE__ */ new WeakMap(), e.buckets.set(t, n)), n;
}
var yi, bi = [], xi = {
	alloc(e, t, n) {
		let r = yi;
		if (!r) return n;
		yi = void 0;
		let i = {
			value: n,
			issues: null
		};
		return r.set(t.value, i), bi.push(i), n;
	},
	guard(e) {
		var t;
		(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
			let t = e._zod.parse, n = (e, n) => {
				if (n.direction !== "backward" && Ci(n, e.value)) throw new li();
				return t(e, n);
			};
			e._zod.parse = n, e._zod.run === t && (e._zod.run = n);
		});
	},
	attach(e) {
		var t;
		let n, r = !1, i, a;
		(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
			let t = e._zod.parse, o = (s, c) => {
				if (n === void 0) {
					let i = gi(e, /* @__PURE__ */ new Set(), !1);
					if (i === R) return e._zod.parse = t, e._zod.run === o && (e._zod.run = t), t(s, c);
					i === z || r ? n = !0 : r = !0;
				}
				let l = s.value;
				if (!fi(l)) return t(s, c);
				let u = c[ui];
				u || (u = {
					buckets: /* @__PURE__ */ new WeakMap(),
					backEdges: void 0
				}, c[ui] = u);
				let d;
				i === c ? d = a : (d = vi(u, e), i = c, a = d);
				let f = d.get(l);
				if (f) return s.value = f.value, f.issues ? f.issues.length && s.issues.push(...pi(f.issues)) : (s.memo = !0, u.backEdges ?? (u.backEdges = /* @__PURE__ */ new WeakSet()), u.backEdges.add(f.value)), s;
				yi = d;
				let p = bi.length, m = t(s, c);
				yi = void 0;
				let h = bi.length > p ? bi.pop() : void 0;
				return m instanceof Promise ? m.then((e) => (h && (h.issues = e.issues.length ? pi(e.issues) : di), e)) : (h && (h.issues = m.issues.length ? pi(m.issues) : di), m);
			};
			e._zod.parse = o, e._zod.run === t && (e._zod.run = o);
		});
	}
};
function Si() {
	return xi;
}
function Ci(e, t) {
	let n = e[ui]?.backEdges;
	return n !== void 0 && fi(t) && n.has(t);
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/locales/en.js
var wi = () => {
	let e = {
		string: {
			unit: "characters",
			verb: "to have"
		},
		file: {
			unit: "bytes",
			verb: "to have"
		},
		array: {
			unit: "items",
			verb: "to have"
		},
		set: {
			unit: "items",
			verb: "to have"
		},
		map: {
			unit: "entries",
			verb: "to have"
		}
	};
	function t(t) {
		return e[t] ?? null;
	}
	let n = {
		regex: "input",
		email: "email address",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datetime",
		date: "ISO date",
		time: "ISO time",
		duration: "ISO duration",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded string",
		base64url: "base64url-encoded string",
		json_string: "JSON string",
		e164: "E.164 number",
		currency_code: "currency code",
		credit_card: "credit card number",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	}, r = { nan: "NaN" };
	function i(e, t) {
		return e === "number" && typeof t == "number" && !Number.isFinite(t) ? String(t) : r[e] ?? e;
	}
	return (e) => {
		switch (e.code) {
			case "invalid_type": return `Invalid input: expected ${i(e.expected)}, received ${i(Xe(e.input), e.input)}`;
			case "invalid_value": return e.values.length === 1 ? `Invalid input: expected ${Ae(e.values[0])}` : `Invalid option: expected one of ${de(e.values, "|")}`;
			case "too_big": {
				let n = e.exact ? "exactly " : e.inclusive ? "<=" : "<", r = t(e.origin);
				return r ? `Too big: expected ${e.origin ?? "value"} to have ${n}${e.maximum.toString()} ${r.unit ?? "elements"}` : `Too big: expected ${e.origin ?? "value"} to be ${n}${e.maximum.toString()}`;
			}
			case "too_small": {
				let n = e.exact ? "exactly " : e.inclusive ? ">=" : ">", r = t(e.origin);
				return r ? `Too small: expected ${e.origin} to have ${n}${e.minimum.toString()} ${r.unit}` : `Too small: expected ${e.origin} to be ${n}${e.minimum.toString()}`;
			}
			case "invalid_format": {
				let t = e;
				return t.format === "starts_with" ? `Invalid string: must start with "${t.prefix}"` : t.format === "ends_with" ? `Invalid string: must end with "${t.suffix}"` : t.format === "includes" ? `Invalid string: must include "${t.includes}"` : t.format === "regex" ? `Invalid string: must match pattern ${t.pattern}` : `Invalid ${n[t.format] ?? e.format}`;
			}
			case "not_multiple_of": return `Invalid number: must be a multiple of ${e.divisor}`;
			case "unrecognized_keys": return `Unrecognized key${e.keys.length > 1 ? "s" : ""}: ${de(e.keys, ", ")}`;
			case "invalid_key": return `Invalid key in ${e.origin}`;
			case "invalid_union": return e.options && Array.isArray(e.options) && e.options.length > 0 ? `Invalid discriminator value. Expected ${e.options.map((e) => `'${e}'`).join(" | ")}` : e.inclusive === !1 ? "Invalid input: more than one option matched" : "Invalid input";
			case "invalid_element": return `Invalid value in ${e.origin}`;
			default: return "Invalid input";
		}
	};
};
function Ti() {
	return { localeError: wi() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/registries.js
var Ei, Di = class {
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
function Oi() {
	return new Di();
}
(Ei = globalThis).__zod_globalRegistry ?? (Ei.__zod_globalRegistry = Oi());
var B = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/api.js
function ki(e) {
	return e.checks && (e.checks = [...e.checks]), e;
}
// @__NO_SIDE_EFFECTS__
function Ai(e, t) {
	return new e(ki({
		type: "string",
		...C(t)
	}));
}
// @__NO_SIDE_EFFECTS__
function ji(e, t) {
	return new e({
		type: "string",
		format: "email",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Mi(e, t) {
	return new e({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ni(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Pi(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v4",
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Fi(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v6",
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ii(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v7",
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Li(e, t) {
	return new e({
		type: "string",
		format: "url",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ri(e, t) {
	return new e({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function zi(e, t) {
	return new e({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Bi(e, t) {
	return new e({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Vi(e, t) {
	return new e({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Hi(e, t) {
	return new e({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ui(e, t) {
	return new e({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Wi(e, t) {
	return new e({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Gi(e, t) {
	return new e({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ki(e, t) {
	return new e({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function qi(e, t) {
	return new e({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ji(e, t) {
	return new e({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Yi(e, t) {
	return new e({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Xi(e, t) {
	return new e({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Zi(e, t) {
	return new e({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Qi(e, t) {
	return new e({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function $i(e, t) {
	return new e({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: !1,
		local: !1,
		precision: null,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ea(e, t) {
	return new e({
		type: "string",
		format: "date",
		check: "string_format",
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ta(e, t) {
	return new e({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function na(e, t) {
	return new e({
		type: "string",
		format: "duration",
		check: "string_format",
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ra(e, t) {
	return new e(ki({
		type: "number",
		checks: [],
		...C(t)
	}));
}
// @__NO_SIDE_EFFECTS__
function ia(e, t) {
	return new e({
		type: "number",
		check: "number_format",
		abort: !1,
		format: "safeint",
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function aa(e) {
	return new e({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function oa(e, t) {
	return new e({
		type: "never",
		...C(t)
	});
}
// @__NO_SIDE_EFFECTS__
function sa(e, t) {
	return new bn({
		check: "less_than",
		...C(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function ca(e, t) {
	return new bn({
		check: "less_than",
		...C(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function la(e, t) {
	return new xn({
		check: "greater_than",
		...C(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function ua(e, t) {
	return new xn({
		check: "greater_than",
		...C(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function da(e, t) {
	return new Sn({
		check: "multiple_of",
		...C(t),
		value: e
	});
}
// @__NO_SIDE_EFFECTS__
function fa(e, t) {
	return new wn({
		check: "max_length",
		...C(t),
		maximum: e
	});
}
// @__NO_SIDE_EFFECTS__
function pa(e, t) {
	return new Tn({
		check: "min_length",
		...C(t),
		minimum: e
	});
}
// @__NO_SIDE_EFFECTS__
function ma(e, t) {
	return new En({
		check: "length_equals",
		...C(t),
		length: e
	});
}
// @__NO_SIDE_EFFECTS__
function ha(e, t) {
	return new On({
		check: "string_format",
		format: "regex",
		...C(t),
		pattern: e
	});
}
// @__NO_SIDE_EFFECTS__
function ga(e) {
	return new kn({
		check: "string_format",
		format: "lowercase",
		...C(e)
	});
}
// @__NO_SIDE_EFFECTS__
function _a(e) {
	return new An({
		check: "string_format",
		format: "uppercase",
		...C(e)
	});
}
// @__NO_SIDE_EFFECTS__
function va(e, t) {
	return new jn({
		check: "string_format",
		format: "includes",
		...C(t),
		includes: e
	});
}
// @__NO_SIDE_EFFECTS__
function ya(e, t) {
	return new Mn({
		check: "string_format",
		format: "starts_with",
		...C(t),
		prefix: e
	});
}
// @__NO_SIDE_EFFECTS__
function ba(e, t) {
	return new Nn({
		check: "string_format",
		format: "ends_with",
		...C(t),
		suffix: e
	});
}
// @__NO_SIDE_EFFECTS__
function V(e) {
	return new Pn({
		check: "overwrite",
		tx: e
	});
}
// @__NO_SIDE_EFFECTS__
function xa(e) {
	return /* @__PURE__ */ V((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function Sa() {
	return /* @__PURE__ */ V((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Ca() {
	return /* @__PURE__ */ V((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function wa() {
	return /* @__PURE__ */ V((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function Ta() {
	return /* @__PURE__ */ V((e) => Ce(e));
}
// @__NO_SIDE_EFFECTS__
function Ea(e, t, n) {
	return new e({
		type: "array",
		element: t,
		...C(n)
	});
}
// @__NO_SIDE_EFFECTS__
function Da(e, t, n) {
	let r = C(n);
	return r.abort ?? (r.abort = !0), new e({
		type: "custom",
		check: "custom",
		fn: t,
		...r
	});
}
// @__NO_SIDE_EFFECTS__
function Oa(e, t, n) {
	return new e({
		type: "custom",
		check: "custom",
		fn: t,
		...C(n)
	});
}
// @__NO_SIDE_EFFECTS__
function ka(e, t) {
	let n = /* @__PURE__ */ Aa((t) => (t.addIssue = (e) => {
		if (typeof e == "string") t.issues.push(D(e, t.value, n._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ?? (r.code = "custom"), "input" in r || (r.input = t.value), r.inst ?? (r.inst = n), r.continue ?? (r.continue = !n._zod.def.abort), t.issues.push(D(r));
		}
	}, e(t.value, t)), t);
	return n;
}
// @__NO_SIDE_EFFECTS__
function Aa(e, t) {
	let n = new F({
		check: "custom",
		...C(t)
	});
	return n._zod.check = e, n;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/to-json-schema.js
function H(e, ...t) {
	for (let n of t) for (let t of Reflect.ownKeys(n)) Object.prototype.propertyIsEnumerable.call(n, t) && _(e, t, n[t]);
	return e;
}
function ja(e) {
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
		sharedDefsExtractedFor: void 0,
		sharedEmitDoneFor: void 0,
		cycles: e?.cycles ?? "ref",
		reused: e?.reused ?? "inline",
		intersections: [],
		deferred: [],
		external: e?.external ?? void 0
	};
}
function U(e, t, n, r, i) {
	let a = typeof t.unrepresentable == "function" ? t.unrepresentable({
		zodSchema: e,
		path: r.path,
		message: i
	}) : t.unrepresentable;
	if (a === "any") return !1;
	if (a === void 0 || a === "throw") throw Error(i);
	return Object.assign(n, a), !0;
}
function W(e, t, n = {
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
	t.seen.set(e, o), t.sharedDefsExtractedFor = void 0, t.sharedEmitDoneFor = void 0;
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
		a && (o.ref || (o.ref = a), W(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && H(o.schema, c), t.io === "input" && G(e) && (delete o.schema.examples, delete o.schema.default), t.io === "input" && "_prefault" in o.schema && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function Ma(e) {
	return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Na(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	if (e.external && e.sharedDefsExtractedFor === e.external) return;
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
				ref: `${i("__shared")}#/${r}/${Ma(a)}`
			};
		}
		let i = `#/${r}/`;
		if (t[1] === n && !t[1].schema.id) return { ref: "#" };
		let a = t[1].schema.id ?? `__schema${e.counter++}`;
		return {
			defId: a,
			ref: i + Ma(a)
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
		if (t === n[0]) a(n);
		else {
			if (e.external) {
				let r = e.external.registry.get(n[0])?.id;
				if (t !== n[0] && r) {
					a(n);
					continue;
				}
			}
			(e.metadataRegistry.get(n[0])?.id || r.cycle || r.count > 1 && e.reused === "ref") && a(n);
		}
	}
	e.external && (e.sharedDefsExtractedFor = e.external);
}
function Pa(e) {
	let t = e.anyOf;
	if (!Array.isArray(t) || t.length === 0 || e.type !== void 0) return;
	let n = [];
	for (let e of t) {
		if (!e || typeof e != "object") return;
		Pa(e);
		let t = Object.keys(e);
		if (t.length !== 1 || t[0] !== "type") return;
		let r = e.type;
		for (let e of Array.isArray(r) ? r : [r]) {
			if (typeof e != "string") return;
			n.includes(e) || n.push(e);
		}
	}
	delete e.anyOf, e.type = n.length === 1 ? n[0] : n;
}
var Fa = /* @__PURE__ */ new Set([
	"type",
	"properties",
	"required",
	"additionalProperties"
]), Ia = ["oneOf", "anyOf"];
function La(e) {
	let t = e.additionalProperties;
	return t === void 0 || t === !1 || typeof t != "object" || !t ? null : Object.keys(t).length ? t : null;
}
function Ra(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "object" || n.type !== "object") return null;
		for (let e in n) if (!Fa.has(e)) return null;
		t.push(n);
	}
	let n = {}, r = /* @__PURE__ */ new Set();
	for (let e of t) {
		for (let r in e.properties) {
			if (Object.prototype.hasOwnProperty.call(n, r)) continue;
			let e = [];
			for (let n of t) {
				let t = n.properties?.[r] ?? La(n);
				t != null && (e.some((e) => JSON.stringify(e) === JSON.stringify(t)) || e.push(t));
			}
			_(n, r, e.length === 1 ? e[0] : Ra(e) ?? { allOf: e });
		}
		for (let t of e.required ?? []) r.add(t);
	}
	let i = {
		type: "object",
		properties: n
	};
	if (r.size && (i.required = [...r]), t.every((e) => e.additionalProperties === !1)) i.additionalProperties = !1;
	else {
		let e = [];
		for (let n of t) {
			let t = La(n);
			t && !e.some((e) => JSON.stringify(e) === JSON.stringify(t)) && e.push(t);
		}
		e.length === 1 ? i.additionalProperties = e[0] : e.length > 1 && (i.additionalProperties = { allOf: e });
	}
	return i;
}
function za(e) {
	let t = e.allOf;
	if (!Array.isArray(t) || t.length < 2) return;
	for (let t of Fa) if (t in e) return;
	let n = t.filter((e) => Ia.some((t) => Array.isArray(e[t]))), r = null;
	if (!n.length) r = Ra(t);
	else {
		let e = n[0], i = Ia.find((t) => Array.isArray(e[t]));
		if (Object.keys(e).length !== 1) return;
		let a = t.filter((t) => t !== e), o = e[i].map((e) => Ra([...a, e]));
		if (o.some((e) => !e)) return;
		r = { [i]: o };
	}
	r && (delete e.allOf, H(e, r));
}
function Ba(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema, a = { ...i }, o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o), s = n.schema;
			if (s.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : H(i, s), H(i, a), t._zod.parent === o) for (let e in i) e !== "$ref" && e !== "allOf" && (e in a || delete i[e]);
			if (s.$ref && n.def) for (let e in i) e !== "$ref" && e !== "allOf" && e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e];
		}
		let s = t._zod.parent;
		if (s && s !== o) {
			r(s);
			let t = e.seen.get(s);
			if (t?.schema.$ref && (i.$ref = t.schema.$ref, t.def)) for (let e in i) e !== "$ref" && e !== "allOf" && e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e];
		}
		e.override({
			zodSchema: t,
			jsonSchema: i,
			path: n.path ?? []
		});
	};
	if (!e.external || e.sharedEmitDoneFor !== e.external) {
		for (let t of [...e.seen.entries()].reverse()) r(t[0]);
		if (e.target !== "openapi-3.0") for (let t of e.seen.entries()) Pa(t[1].def ?? t[1].schema);
		for (let t of e.deferred) t();
		if (e.intersections.length) {
			let t = /* @__PURE__ */ new Map();
			for (let n of e.seen.values()) for (let e of [n.schema, n.def]) {
				let n = e?.allOf;
				if (!Array.isArray(n)) continue;
				let r = t.get(n);
				r ? r.push(e) : t.set(n, [e]);
			}
			for (let n of e.intersections) for (let e of t.get(n) ?? []) za(e);
		}
	}
	let i = {};
	if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
		let n = e.external.registry.get(t)?.id;
		if (!n) throw Error("Schema is missing an `id` property");
		i.$id = e.external.uri(n);
	}
	H(i, n.defId ? n.schema : n.def ?? n.schema);
	let a = e.metadataRegistry.get(t)?.id;
	a !== void 0 && i.id === a && delete i.id;
	let o = e.external?.defs ?? {};
	if (!e.external || e.sharedEmitDoneFor !== e.external) for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (e.def.id === e.defId && delete e.def.id, _(o, e.defId, e.def));
	}
	e.external && (e.sharedEmitDoneFor = e.external), e.external || Object.keys(o).length > 0 && (e.target === "draft-2020-12" ? i.$defs = o : i.definitions = o);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t["~standard"],
				jsonSchema: {
					input: Ha(t, "input", e.processors),
					output: Ha(t, "output", e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error("Error converting schema to JSON.");
	}
}
function G(e, t) {
	let n = t ?? { seen: /* @__PURE__ */ new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === "transform") return !0;
	if (r.type === "array") return G(r.element, n);
	if (r.type === "set") return G(r.valueType, n);
	if (r.type === "lazy") return G(r.getter(), n);
	if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault" || r.type === "catch") return G(r.innerType, n);
	if (r.type === "intersection") return G(r.left, n) || G(r.right, n);
	if (r.type === "record" || r.type === "map") return G(r.keyType, n) || G(r.valueType, n);
	if (r.type === "pipe") return e._zod.traits.has("$ZodCodec") ? !0 : G(r.in, n) || G(r.out, n);
	if (r.type === "object") {
		for (let e in r.shape) if (G(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === "union") {
		for (let e of r.options) if (G(e, n)) return !0;
		return !1;
	}
	if (r.type === "tuple") {
		for (let e of r.items) if (G(e, n)) return !0;
		return !!(r.rest && G(r.rest, n));
	}
	return !1;
}
var Va = (e, t = {}) => (n) => {
	let r = ja({
		...n,
		processors: t
	});
	return W(e, r), Na(r, e), Ba(r, e);
}, Ha = (e, t, n = {}) => (r) => {
	let { libraryOptions: i, target: a } = r ?? {}, o = ja({
		...i ?? {},
		target: a,
		io: t,
		processors: n
	});
	return W(e, o), Na(o, e), Ba(o, e);
}, K = (e, t, n) => {
	(e[t] === void 0 || n > e[t]) && (e[t] = n);
}, q = (e, t, n) => {
	(e[t] === void 0 || n < e[t]) && (e[t] = n);
}, Ua = (e, t) => {
	K(e, "minimum", t), q(e, "maximum", t);
}, Wa = (e, t) => {
	e.multipleOf ?? (e.multipleOf = []), e.multipleOf.includes(t) || e.multipleOf.push(t);
}, Ga = (e, t) => {
	e.patterns ?? (e.patterns = /* @__PURE__ */ new Set()), e.patterns.add(t);
}, Ka = (e, t) => {
	e.mime = e.mime ? e.mime.filter((e) => t.includes(e)) : [...t];
}, qa = (e, t) => {
	e.format = t, t.includes("int") && (e.isInt = !0);
}, Ja = (e, t) => K(e, "minimum", t.minimum), Ya = (e, t) => q(e, "maximum", t.maximum), Xa = (e) => (t, n) => {
	qa(t, n.format);
	let [r, i] = e[n.format];
	K(t, "minimum", r), q(t, "maximum", i);
}, Za = {
	greater_than: (e, t) => K(e, t.inclusive ? "minimum" : "exclusiveMinimum", t.value),
	less_than: (e, t) => q(e, t.inclusive ? "maximum" : "exclusiveMaximum", t.value),
	multiple_of: (e, t) => Wa(e, t.value),
	number_format: Xa(Me),
	bigint_format: Xa(Ne),
	min_length: Ja,
	max_length: Ya,
	length_equals: (e, t) => Ua(e, t.length),
	min_size: Ja,
	max_size: Ya,
	size_equals: (e, t) => Ua(e, t.size),
	string_format: (e, t) => {
		qa(e, t.format), t.pattern && Ga(e, t.pattern), (t.format === "base64" || t.format === "base64url") && (e.contentEncoding = t.format), (t.local || t.precision === -1) && (e.laxFormat = !0);
	},
	mime_type: (e, t) => Ka(e, t.mime)
};
function J(e) {
	let t = {}, n = e._zod.def, r = e._zod.traits.has("$ZodCheck") ? [e, ...n.checks ?? []] : n.checks ?? [];
	for (let e of r) Za[e._zod.def.check]?.(t, e._zod.def);
	let i = e._zod.bag;
	i.minimum !== void 0 && K(t, "minimum", i.minimum), i.exclusiveMinimum !== void 0 && K(t, "exclusiveMinimum", i.exclusiveMinimum), i.maximum !== void 0 && q(t, "maximum", i.maximum), i.exclusiveMaximum !== void 0 && q(t, "exclusiveMaximum", i.exclusiveMaximum), i.multipleOf !== void 0 && Wa(t, i.multipleOf), i.format !== void 0 && (t.format ?? (t.format = i.format), i.format.includes("int") && (t.isInt = !0)), i.mime && Ka(t, i.mime);
	for (let e of i.patterns ?? []) Ga(t, e);
	return t;
}
var Qa = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
}, $a = /* @__PURE__ */ new Map([[_r, rn], [yr, an]]), eo = (e) => $a.get(e) ?? e, to = (e, t, n, r) => {
	let i = n;
	i.type = "string";
	let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l, laxFormat: u } = J(e);
	if (typeof a == "number" && (i.minLength = a), typeof o == "number" && (i.maxLength = o), s && (i.format = Qa[s] ?? s, i.format === "" && delete i.format, (s === "time" || u) && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
		let e = [...c].map(eo);
		e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
			...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: e.source
		}))]);
	}
}, no = (e, t, n, r) => {
	let i = n, { minimum: a, maximum: o, multipleOf: s, exclusiveMaximum: c, exclusiveMinimum: l, isInt: u } = J(e);
	i.type = u ? "integer" : "number";
	let d = typeof l == "number" && l >= (a ?? -Infinity), f = typeof c == "number" && c <= (o ?? Infinity), p = t.target === "draft-04" || t.target === "openapi-3.0";
	if (d ? p ? (i.minimum = l, i.exclusiveMinimum = !0) : i.exclusiveMinimum = l : typeof a == "number" && (i.minimum = a), f ? p ? (i.maximum = c, i.exclusiveMaximum = !0) : i.exclusiveMaximum = c : typeof o == "number" && (i.maximum = o), s) {
		let n = /* @__PURE__ */ new Set();
		for (let a of s) Number.isFinite(a) && a !== 0 ? n.add(Math.abs(a)) : U(e, t, i, r, `A multipleOf divisor of ${a} cannot be represented in JSON Schema`);
		let [a, ...o] = n;
		a !== void 0 && (i.multipleOf = a), o.length && (i.allOf = [...i.allOf ?? [], ...o.map((e) => ({ multipleOf: e }))]);
	}
}, ro = (e, t, n, r) => {
	n.not = {};
}, io = (e, t, n, r) => {
	let i = e._zod.def, a = ue(i.entries);
	a.length === 0 ? n.not = {} : (a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), n.enum = a);
}, ao = (e, t, n, r) => {
	U(e, t, n, r, "Custom types cannot be represented in JSON Schema");
}, oo = (e, t, n, r) => {
	U(e, t, n, r, "Transforms cannot be represented in JSON Schema");
}, so = (e, t, n, r) => {
	let i = n, a = e._zod.def, { minimum: o, maximum: s } = J(e);
	typeof o == "number" && (i.minItems = o), typeof s == "number" && (i.maxItems = s), i.type = "array", i.items = W(a.element, t, {
		...r,
		path: [...r.path, "items"]
	});
};
function co(e) {
	let t = e._zod.def;
	return t.type === "pipe" && t.in._zod.traits.has("$ZodTransform") ? co(t.out) : t.type === "catch" ? co(t.innerType) : e._zod.optin;
}
var lo = (e, t, n, r) => {
	let i = n, a = e._zod.def, o = a.shape;
	if (Object.getOwnPropertySymbols(o).length && U(e, t, i, r, "Symbol keys cannot be represented in JSON Schema")) return;
	i.type = "object", i.properties = {};
	for (let e in o) _(i.properties, e, W(o[e], t, {
		...r,
		path: [
			...r.path,
			"properties",
			e
		]
	}));
	let s = [];
	for (let e of Object.keys(o)) {
		let n = a.shape[e];
		(t.io === "input" ? co(n) === void 0 : n._zod.optout === void 0) && s.push(e);
	}
	s.length > 0 && (i.required = s), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = W(a.catchall, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	})) : t.io === "output" && (i.additionalProperties = !1);
}, uo = (e, t, n, r) => {
	let i = e._zod.def, a = i.inclusive === !1, o = i.options.map((e, n) => W(e, t, {
		...r,
		path: [
			...r.path,
			a ? "oneOf" : "anyOf",
			n
		]
	}));
	a ? n.oneOf = o : n.anyOf = o;
}, fo = (e, t, n, r) => {
	let i = e._zod.def, a = W(i.left, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			0
		]
	}), o = W(i.right, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			1
		]
	}), s = (e) => "allOf" in e && Object.keys(e).length === 1, c = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
	n.allOf = c, t.intersections.push(c);
}, po = (e, t, n, r) => {
	let i = e._zod.def, a = W(i.innerType, t, r), o = t.seen.get(e);
	t.target === "openapi-3.0" ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
}, mo = (e, t, n, r) => {
	let i = e._zod.def;
	W(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, ho = Symbol();
function go(e, t, n, r, i) {
	let a = !1, o = JSON.stringify(e, (e, t) => typeof t == "bigint" ? (a = !0, null) : t);
	return a ? (U(t, n, r, i, "BigInt defaults cannot be represented in JSON Schema"), ho) : JSON.parse(o);
}
var _o = (e, t, n, r) => {
	let i = e._zod.def;
	W(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o = go(i.defaultValue, e, t, n, r);
	o !== ho && (n.default = o);
}, vo = (e, t, n, r) => {
	let i = e._zod.def;
	W(i.innerType, t, r);
	let a = t.seen.get(e);
	if (a.ref = i.innerType, t.io !== "input") return;
	let o = go(i.defaultValue, e, t, n, r);
	o !== ho && (n._prefault = o);
}, yo = (e, t, n, r) => {
	let i = e._zod.def;
	W(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o;
	try {
		o = i.catchValue(void 0);
	} catch {
		U(e, t, n, r, "Dynamic catch values are not supported in JSON Schema");
		return;
	}
	n.default = o;
}, bo = (e, t, n, r) => {
	let i = e._zod.def, a = i.in._zod.traits.has("$ZodTransform"), o = t.io === "input" ? a ? i.out : i.in : i.out;
	W(o, t, r);
	let s = t.seen.get(e);
	s.ref = o;
}, xo = (e, t, n, r) => {
	let i = e._zod.def;
	W(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.readOnly = !0;
}, So = (e, t, n, r) => {
	let i = e._zod.def;
	W(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Co = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function wo(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = n(this);
			return Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	});
}
var Y = /*@__PURE__*/ j("ZodError", (e, t) => {
	_t.init(e, t), e.name = "ZodError";
	let n = Object.getPrototypeOf(e);
	Co.has(n) || (Co.add(n), wo(n, "format", (e) => (t) => bt(e, t)), wo(n, "flatten", (e) => (t) => yt(e, t)), wo(n, "addIssue", (e) => (t) => {
		e.issues.push(t), e.message = JSON.stringify(e.issues, fe, 2);
	}), wo(n, "addIssues", (e) => (t) => {
		e.issues.push(...t), e.message = JSON.stringify(e.issues, fe, 2);
	}), Object.defineProperty(n, "isEmpty", {
		configurable: !0,
		enumerable: !1,
		get() {
			return this.issues.length === 0;
		}
	}));
}, void 0, { Parent: Error }), To = /* @__PURE__ */ St(Y), Eo = /* @__PURE__ */ Ct(Y), Do = /* @__PURE__ */ wt(Y), Oo = /* @__PURE__ */ Et(Y), ko = /* @__PURE__ */ Mt(Y), Ao = /* @__PURE__ */ Nt(Y), jo = /* @__PURE__ */ Pt(Y), Mo = /* @__PURE__ */ Ft(Y), No = /* @__PURE__ */ It(Y), Po = /* @__PURE__ */ Lt(Y), Fo = /* @__PURE__ */ Rt(Y), Io = /* @__PURE__ */ zt(Y);
//#endregion
//#region node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/classic/schemas.js
function Lo() {
	N.localeError || P(Ti());
}
function Ro() {
	N.memoizer || P({ memoizer: Si() });
}
var X = /*@__PURE__*/ j("ZodType", (e, t) => (Lo(), I.init(e, t), e.def = t, e.type = t.type, e), {
	check(...e) {
		let t = this.def;
		return this.clone(b(t, { checks: [...t.checks ?? [], ...e.map((e) => typeof e == "function" ? { _zod: {
			check: e,
			def: { check: "custom" },
			onattach: []
		} } : e)] }), { parent: !0 });
	},
	with(...e) {
		return this.check(...e);
	},
	clone(e, t) {
		return S(this, e, t);
	},
	brand() {
		return this;
	},
	register(e, t) {
		return e.add(this, t), this;
	},
	refine(e, t) {
		return this.check(Ys(e, t));
	},
	superRefine(e, t) {
		return this.check(Xs(e, t));
	},
	overwrite(e) {
		return this.check(/* @__PURE__ */ V(e));
	},
	optional() {
		return As(this);
	},
	exactOptional() {
		return Ms(this);
	},
	nullable() {
		return Ps(this);
	},
	nullish() {
		return As(Ps(this));
	},
	nonoptional(e) {
		return Bs(this, e);
	},
	array() {
		return ys(this);
	},
	or(e) {
		return Ss([this, e]);
	},
	and(e) {
		return ws(this, e);
	},
	transform(e) {
		return Ws(this, Os(e));
	},
	default(e) {
		return Is(this, e);
	},
	prefault(e) {
		return Rs(this, e);
	},
	catch(e) {
		return Hs(this, e);
	},
	pipe(e) {
		return Ws(this, e);
	},
	readonly() {
		return Ks(this);
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
	apply(e, ...t) {
		return t.length === 0 ? e(this) : e(this, ...t);
	},
	get "~standard"() {
		return Qe(this, "~standard", {
			...zn(this),
			jsonSchema: {
				input: Ha(this, "input"),
				output: Ha(this, "output")
			}
		});
	},
	set "~standard"(e) {
		O(this, "~standard", e);
	},
	parse: function e(t, n) {
		return To(this, t, n, { callee: e });
	},
	parseAsync: async function e(t, n) {
		return await Eo(this, t, n, { callee: e });
	},
	safeParse(e, t) {
		return Do(this, e, t);
	},
	async safeParseAsync(e, t) {
		return Oo(this, e, t);
	},
	get spa() {
		return this?.safeParseAsync;
	},
	set spa(e) {
		O(this, "spa", e);
	},
	validate(e, t) {
		return kt(this, e, t);
	},
	validateAsync(e, t) {
		return jt(this, e, t);
	},
	encode: function e(t, n) {
		return ko(this, t, n, { callee: e });
	},
	decode: function e(t, n) {
		return Ao(this, t, n, { callee: e });
	},
	encodeAsync: async function e(t, n) {
		return await jo(this, t, n, { callee: e });
	},
	decodeAsync: async function e(t, n) {
		return await Mo(this, t, n, { callee: e });
	},
	safeEncode(e, t) {
		return No(this, e, t);
	},
	safeDecode(e, t) {
		return Po(this, e, t);
	},
	async safeEncodeAsync(e, t) {
		return Fo(this, e, t);
	},
	async safeDecodeAsync(e, t) {
		return Io(this, e, t);
	},
	toJSONSchema(e) {
		return Va(this, {})(e);
	},
	get description() {
		return B.get(this)?.description;
	},
	get _def() {
		return this._zod.def;
	}
}), zo = /*@__PURE__*/ j("_ZodString", (e, t) => {
	Bn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => to(e, t, n, r);
}, /*@__PURE__*/ $e({
	format: (e) => J(e).format ?? null,
	minLength: (e) => J(e).minimum ?? null,
	maxLength: (e) => J(e).maximum ?? null
}, {
	regex(...e) {
		return this.check(/* @__PURE__ */ ha(...e));
	},
	includes(...e) {
		return this.check(/* @__PURE__ */ va(...e));
	},
	startsWith(...e) {
		return this.check(/* @__PURE__ */ ya(...e));
	},
	endsWith(...e) {
		return this.check(/* @__PURE__ */ ba(...e));
	},
	min(...e) {
		return this.check(/* @__PURE__ */ pa(...e));
	},
	max(...e) {
		return this.check(/* @__PURE__ */ fa(...e));
	},
	length(...e) {
		return this.check(/* @__PURE__ */ ma(...e));
	},
	nonempty(...e) {
		return this.check(/* @__PURE__ */ pa(1, ...e));
	},
	lowercase(e) {
		return this.check(/* @__PURE__ */ ga(e));
	},
	uppercase(e) {
		return this.check(/* @__PURE__ */ _a(e));
	},
	trim() {
		return this.check(/* @__PURE__ */ Sa());
	},
	normalize(...e) {
		return this.check(/* @__PURE__ */ xa(...e));
	},
	toLowerCase() {
		return this.check(/* @__PURE__ */ Ca());
	},
	toUpperCase() {
		return this.check(/* @__PURE__ */ wa());
	},
	slugify() {
		return this.check(/* @__PURE__ */ Ta());
	}
})), Bo = /*@__PURE__*/ j("ZodString", (e, t) => {
	Bn.init(e, t), zo.init(e, t);
}, {
	email(e) {
		return this.check(/* @__PURE__ */ ji(Go, e));
	},
	url(e) {
		return this.check(/* @__PURE__ */ Li(Jo, e));
	},
	jwt(e) {
		return this.check(/* @__PURE__ */ Qi(ls, e));
	},
	emoji(e) {
		return this.check(/* @__PURE__ */ Ri(Yo, e));
	},
	guid(e) {
		return this.check(/* @__PURE__ */ Mi(Ko, e));
	},
	uuid(e) {
		return this.check(/* @__PURE__ */ Ni(qo, e));
	},
	uuidv4(e) {
		return this.check(/* @__PURE__ */ Pi(qo, e));
	},
	uuidv6(e) {
		return this.check(/* @__PURE__ */ Fi(qo, e));
	},
	uuidv7(e) {
		return this.check(/* @__PURE__ */ Ii(qo, e));
	},
	nanoid(e) {
		return this.check(/* @__PURE__ */ zi(Xo, e));
	},
	cuid(e) {
		return this.check(/* @__PURE__ */ Bi(Zo, e));
	},
	cuid2(e) {
		return this.check(/* @__PURE__ */ Vi(Qo, e));
	},
	ulid(e) {
		return this.check(/* @__PURE__ */ Hi($o, e));
	},
	base64(e) {
		return this.check(/* @__PURE__ */ Yi(os, e));
	},
	base64url(e) {
		return this.check(/* @__PURE__ */ Xi(ss, e));
	},
	xid(e) {
		return this.check(/* @__PURE__ */ Ui(es, e));
	},
	ksuid(e) {
		return this.check(/* @__PURE__ */ Wi(ts, e));
	},
	ipv4(e) {
		return this.check(/* @__PURE__ */ Gi(ns, e));
	},
	ipv6(e) {
		return this.check(/* @__PURE__ */ Ki(rs, e));
	},
	cidrv4(e) {
		return this.check(/* @__PURE__ */ qi(is, e));
	},
	cidrv6(e) {
		return this.check(/* @__PURE__ */ Ji(as, e));
	},
	e164(e) {
		return this.check(/* @__PURE__ */ Zi(cs, e));
	},
	datetime(e) {
		return this.check(/* @__PURE__ */ $i(Vo, e));
	},
	date(e) {
		return this.check(/* @__PURE__ */ ea(Ho, e));
	},
	time(e) {
		return this.check(/* @__PURE__ */ ta(Uo, e));
	},
	duration(e) {
		return this.check(/* @__PURE__ */ na(Wo, e));
	}
});
function Z(e) {
	return /* @__PURE__ */ Ai(Bo, e);
}
var Q = /*@__PURE__*/ j("ZodStringFormat", (e, t) => {
	L.init(e, t), zo.init(e, t);
}), Vo = /*@__PURE__*/ j("ZodISODateTime", (e, t) => {
	ar.init(e, t), Q.init(e, t);
}), Ho = /*@__PURE__*/ j("ZodISODate", (e, t) => {
	or.init(e, t), Q.init(e, t);
}), Uo = /*@__PURE__*/ j("ZodISOTime", (e, t) => {
	sr.init(e, t), Q.init(e, t);
}), Wo = /*@__PURE__*/ j("ZodISODuration", (e, t) => {
	cr.init(e, t), Q.init(e, t);
}), Go = /*@__PURE__*/ j("ZodEmail", (e, t) => {
	Un.init(e, t), Q.init(e, t);
}), Ko = /*@__PURE__*/ j("ZodGUID", (e, t) => {
	Vn.init(e, t), Q.init(e, t);
}), qo = /*@__PURE__*/ j("ZodUUID", (e, t) => {
	Hn.init(e, t), Q.init(e, t);
}), Jo = /*@__PURE__*/ j("ZodURL", (e, t) => {
	Zn.init(e, t), Q.init(e, t);
}), Yo = /*@__PURE__*/ j("ZodEmoji", (e, t) => {
	Qn.init(e, t), Q.init(e, t);
}), Xo = /*@__PURE__*/ j("ZodNanoID", (e, t) => {
	$n.init(e, t), Q.init(e, t);
}), Zo = /*@__PURE__*/ j("ZodCUID", (e, t) => {
	er.init(e, t), Q.init(e, t);
}), Qo = /*@__PURE__*/ j("ZodCUID2", (e, t) => {
	tr.init(e, t), Q.init(e, t);
}), $o = /*@__PURE__*/ j("ZodULID", (e, t) => {
	nr.init(e, t), Q.init(e, t);
}), es = /*@__PURE__*/ j("ZodXID", (e, t) => {
	rr.init(e, t), Q.init(e, t);
}), ts = /*@__PURE__*/ j("ZodKSUID", (e, t) => {
	ir.init(e, t), Q.init(e, t);
}), ns = /*@__PURE__*/ j("ZodIPv4", (e, t) => {
	lr.init(e, t), Q.init(e, t);
}), rs = /*@__PURE__*/ j("ZodIPv6", (e, t) => {
	fr.init(e, t), Q.init(e, t);
}), is = /*@__PURE__*/ j("ZodCIDRv4", (e, t) => {
	pr.init(e, t), Q.init(e, t);
}), as = /*@__PURE__*/ j("ZodCIDRv6", (e, t) => {
	hr.init(e, t), Q.init(e, t);
}), os = /*@__PURE__*/ j("ZodBase64", (e, t) => {
	vr.init(e, t), Q.init(e, t);
}), ss = /*@__PURE__*/ j("ZodBase64URL", (e, t) => {
	xr.init(e, t), Q.init(e, t);
}), cs = /*@__PURE__*/ j("ZodE164", (e, t) => {
	Sr.init(e, t), Q.init(e, t);
}), ls = /*@__PURE__*/ j("ZodJWT", (e, t) => {
	wr.init(e, t), Q.init(e, t);
}), us = /*@__PURE__*/ j("ZodNumber", (e, t) => {
	Tr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => no(e, t, n, r), e.isFinite = !0;
}, /*@__PURE__*/ $e({
	minValue: (e) => {
		let { minimum: t, exclusiveMinimum: n } = J(e);
		return Math.max(t ?? -Infinity, n ?? -Infinity);
	},
	maxValue: (e) => {
		let { maximum: t, exclusiveMaximum: n } = J(e);
		return Math.min(t ?? Infinity, n ?? Infinity);
	},
	isInt: (e) => {
		let { isInt: t, multipleOf: n } = J(e);
		return !!t || !!n?.some(Number.isSafeInteger);
	},
	format: (e) => J(e).format ?? null
}, {
	gt(e, t) {
		return this.check(/* @__PURE__ */ la(e, t));
	},
	gte(e, t) {
		return this.check(/* @__PURE__ */ ua(e, t));
	},
	min(e, t) {
		return this.check(/* @__PURE__ */ ua(e, t));
	},
	lt(e, t) {
		return this.check(/* @__PURE__ */ sa(e, t));
	},
	lte(e, t) {
		return this.check(/* @__PURE__ */ ca(e, t));
	},
	max(e, t) {
		return this.check(/* @__PURE__ */ ca(e, t));
	},
	int(e) {
		return this.check(ps(e));
	},
	safe(e) {
		return this.check(ps(e));
	},
	positive(e) {
		return this.check(/* @__PURE__ */ la(0, e));
	},
	nonnegative(e) {
		return this.check(/* @__PURE__ */ ua(0, e));
	},
	negative(e) {
		return this.check(/* @__PURE__ */ sa(0, e));
	},
	nonpositive(e) {
		return this.check(/* @__PURE__ */ ca(0, e));
	},
	multipleOf(e, t) {
		return this.check(/* @__PURE__ */ da(e, t));
	},
	step(e, t) {
		return this.check(/* @__PURE__ */ da(e, t));
	},
	finite() {
		return this;
	}
}));
function ds(e) {
	return /* @__PURE__ */ ra(us, e);
}
var fs = /*@__PURE__*/ j("ZodNumberFormat", (e, t) => {
	Er.init(e, t), us.init(e, t);
});
function ps(e) {
	return /* @__PURE__ */ ia(fs, e);
}
var ms = /*@__PURE__*/ j("ZodUnknown", (e, t) => {
	Dr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function hs() {
	return /* @__PURE__ */ aa(ms);
}
var gs = /*@__PURE__*/ j("ZodNever", (e, t) => {
	Or.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ro(e, t, n, r);
});
function _s(e) {
	return /* @__PURE__ */ oa(gs, e);
}
var vs = /*@__PURE__*/ j("ZodArray", (e, t) => {
	Ro(), Mr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => so(e, t, n, r), e.element = t.element;
}, {
	min(e, t) {
		return this.check(/* @__PURE__ */ pa(e, t));
	},
	nonempty(e) {
		return this.check(/* @__PURE__ */ pa(1, e));
	},
	max(e, t) {
		return this.check(/* @__PURE__ */ fa(e, t));
	},
	length(e, t) {
		return this.check(/* @__PURE__ */ ma(e, t));
	},
	unwrap() {
		return this.element;
	}
});
function ys(e, t) {
	return /* @__PURE__ */ Ea(vs, e, t);
}
var bs = /*@__PURE__*/ j("ZodObject", (e, t) => {
	Ro(), Rr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => lo(e, t, n, r), it(e, "shape", (e) => e._zod.def.shape, !1);
}, {
	keyof() {
		return Es(Object.keys(this._zod.def.shape));
	},
	catchall(e) {
		return this.clone(b(this._zod.def, { catchall: e }));
	},
	passthrough() {
		return this.clone(b(this._zod.def, { catchall: hs() }));
	},
	loose() {
		return this.clone(b(this._zod.def, { catchall: hs() }));
	},
	strict() {
		return this.clone(b(this._zod.def, { catchall: _s() }));
	},
	strip() {
		return this.clone(b(this._zod.def, { catchall: void 0 }));
	},
	extend(e) {
		return Le(this, e);
	},
	safeExtend(e) {
		return ze(this, e);
	},
	merge(e) {
		return Be(this, e);
	},
	pick(e) {
		return Pe(this, e);
	},
	omit(e) {
		return Ie(this, e);
	},
	partial(...e) {
		return Ve(ks, this, e[0]);
	},
	exactPartial(...e) {
		return Ve(js, this, e[0], "exactPartial");
	},
	required(...e) {
		return He(zs, this, e[0]);
	}
});
function $(e, t) {
	return new bs({
		type: "object",
		shape: e ?? {},
		...C(t)
	});
}
var xs = /*@__PURE__*/ j("ZodUnion", (e, t) => {
	Br.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => uo(e, t, n, r), e.options = t.options;
});
function Ss(e, t) {
	return new xs({
		type: "union",
		options: e,
		...C(t)
	});
}
var Cs = /*@__PURE__*/ j("ZodIntersection", (e, t) => {
	Vr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => fo(e, t, n, r);
});
function ws(e, t) {
	return new Cs({
		type: "intersection",
		left: e,
		right: t
	});
}
var Ts = /*@__PURE__*/ j("ZodEnum", (e, t) => {
	Wr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => io(e, t, n, r), e.enum = t.entries, e.options = [...e._zod.values];
	let n = new Set(Object.keys(t.entries));
	e.extract = (e, r) => {
		let i = {};
		for (let r of e) if (n.has(r)) i[r] = t.entries[r];
		else throw Error(`Key ${r} not found in enum`);
		return new Ts({
			...t,
			checks: [],
			...C(r),
			entries: i
		});
	}, e.exclude = (e, r) => {
		let i = { ...t.entries };
		for (let t of e) if (n.has(t)) delete i[t];
		else throw Error(`Key ${t} not found in enum`);
		return new Ts({
			...t,
			checks: [],
			...C(r),
			entries: i
		});
	};
});
function Es(e, t) {
	return new Ts({
		type: "enum",
		entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
		...C(t)
	});
}
var Ds = /*@__PURE__*/ j("ZodTransform", (e, t) => {
	Ro(), Gr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => oo(e, t, n, r), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new dt(e.constructor.name);
		n.addIssue = (r) => {
			if (typeof r == "string") n.issues.push(D(r, n.value, t));
			else {
				let t = r;
				t.fatal && (t.continue = !1), t.code ?? (t.code = "custom"), "input" in t || (t.input = n.value), t.inst ?? (t.inst = e), n.issues.push(D(t));
			}
		};
		let i = t.transform(n.value, n);
		return i instanceof Promise ? i.then((e) => (n.value = e, n)) : (n.value = i, n);
	};
});
function Os(e) {
	return new Ds({
		type: "transform",
		transform: e
	});
}
var ks = /*@__PURE__*/ j("ZodOptional", (e, t) => {
	qr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => So(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function As(e) {
	return new ks({
		type: "optional",
		innerType: e
	});
}
var js = /*@__PURE__*/ j("ZodExactOptional", (e, t) => {
	Jr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => So(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Ms(e) {
	return new js({
		type: "optional",
		innerType: e
	});
}
var Ns = /*@__PURE__*/ j("ZodNullable", (e, t) => {
	Yr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => po(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Ps(e) {
	return new Ns({
		type: "nullable",
		innerType: e
	});
}
var Fs = /*@__PURE__*/ j("ZodDefault", (e, t) => {
	Xr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => _o(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function Is(e, t) {
	return new Fs({
		type: "default",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : De(t);
		}
	});
}
var Ls = /*@__PURE__*/ j("ZodPrefault", (e, t) => {
	Qr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => vo(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Rs(e, t) {
	return new Ls({
		type: "prefault",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : De(t);
		}
	});
}
var zs = /*@__PURE__*/ j("ZodNonOptional", (e, t) => {
	$r.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => mo(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Bs(e, t) {
	return new zs({
		type: "nonoptional",
		innerType: e,
		...C(t)
	});
}
var Vs = /*@__PURE__*/ j("ZodCatch", (e, t) => {
	ni.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => yo(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function Hs(e, t) {
	return new Vs({
		type: "catch",
		innerType: e,
		catchValue: typeof t == "function" ? t : ot(t)
	});
}
var Us = /*@__PURE__*/ j("ZodPipe", (e, t) => {
	ri.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => bo(e, t, n, r), e.in = t.in, e.out = t.out;
});
function Ws(e, t) {
	return new Us({
		type: "pipe",
		in: e,
		out: t
	});
}
var Gs = /*@__PURE__*/ j("ZodReadonly", (e, t) => {
	ai.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => xo(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Ks(e) {
	return new Gs({
		type: "readonly",
		innerType: e
	});
}
var qs = /*@__PURE__*/ j("ZodCustom", (e, t) => {
	si.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ao(e, t, n, r);
});
function Js(e, t) {
	return /* @__PURE__ */ Da(qs, e ?? (() => !0), t);
}
function Ys(e, t = {}) {
	return /* @__PURE__ */ Oa(qs, e, t);
}
function Xs(e, t) {
	return /* @__PURE__ */ ka(e, t);
}
//#endregion
//#region src/schemas/firebase-config.schema.ts
var Zs = $({
	apiKey: Z().min(1),
	appId: Z().min(1),
	projectId: Z().min(1),
	authDomain: Z().min(1),
	measurementId: Z().optional(),
	storageBucket: Z().optional(),
	messagingSenderId: Z().optional()
}), Qs = $({
	name: Z().min(1),
	firebase: Zs,
	logo: Z().optional(),
	provider: Z().min(1).optional(),
	theme: $({
		text: Z(),
		primary: Z(),
		secondary: Z(),
		background: Z()
	}).partial().optional()
}), $s = $({
	url: Z().refine((e) => URL.canParse(e) && ["http:", "https:"].includes(new URL(e).protocol), { message: "Invalid URL" }),
	pos: $({
		x: ds().optional(),
		y: ds().optional()
	}).optional(),
	dim: $({
		width: ds().optional(),
		height: ds().optional()
	}).optional(),
	config: Qs.partial().optional(),
	mode: Es(["popup", "iframe"]).optional(),
	iframe: Ss([$({
		element: Js(),
		container: _s().optional()
	}), $({
		container: Js(),
		element: _s().optional()
	})]).optional()
});
//#endregion
export { c as AuthFailedError, g as Base64helper, s as BaseError, ne as ConfigHelper, n as EProvider, re as EnumHelper, e as ErrorType, ie as EventHelper, t as EventType, Zs as FirebaseConfigSchema, Qs as FireguardOptionsSchema, le as FiremittHelper, $s as FiremittOptionsSchema, u as InvalidAppError, l as InvalidAppNameError, d as InvalidDimError, f as InvalidFirebaseConfigError, p as InvalidIframeError, m as InvalidProviderError, h as InvalidURLError, ee as PopupBlockedError };
