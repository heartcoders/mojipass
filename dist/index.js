import { ref as y, readonly as i, getCurrentInstance as x, computed as v, toValue as h, watch as R, defineComponent as _, resolveDirective as T, openBlock as u, createElementBlock as m, Fragment as M, renderList as O, withDirectives as L, normalizeClass as P, createElementVNode as f, toDisplayString as F, createBlock as V, unref as c, isRef as A, vModelText as B, createCommentVNode as N, createVNode as $ } from "vue";
const I = [
  { symbol: "🦊", value: 0 },
  { symbol: "🌊", value: 1 },
  { symbol: "🍕", value: 2 },
  { symbol: "🌈", value: 3 },
  { symbol: "🔥", value: 4 },
  { symbol: "🎯", value: 5 },
  { symbol: "🌙", value: 6 },
  { symbol: "⚡", value: 7 },
  { symbol: "🎸", value: 8 }
], U = {
  codeLength: 4,
  username: !1,
  keys: [...I]
};
function K() {
  return typeof window > "u" ? null : window.__MOJIPASS_CONFIG__ ?? null;
}
function G(e = "") {
  const s = y(K() ?? U), t = y(!1), n = y(!1);
  if (K())
    return {
      config: i(s),
      isLoading: i(t),
      hasError: i(n)
    };
  t.value = !0;
  const a = globalThis.$fetch;
  return (a ? a("/api/mojipass/config") : fetch(`${e}/api/mojipass/config`).then((l) => {
    if (!l.ok) throw new Error(`Config fetch failed: ${l.status}`);
    return l.json();
  })).then((l) => {
    s.value = l;
  }).catch(() => {
    n.value = !0;
  }).finally(() => {
    t.value = !1;
  }), {
    config: i(s),
    isLoading: i(t),
    hasError: i(n)
  };
}
function J() {
  const e = new URLSearchParams(window.location.search).get("redirect") ?? "/";
  return e.startsWith("/api/") ? "/" : e;
}
function W(e, s) {
  s ? s.push(e) : window.location.href = e;
}
function Y(e, s = "") {
  const t = y([]), n = y(""), o = y("idle"), a = y(""), d = x(), l = v(() => t.value.length), g = v(() => l.value === h(e).codeLength), p = v(() => o.value === "loading" || o.value === "success"), C = v(() => o.value === "error");
  function k(r) {
    p.value || g.value || (t.value = [...t.value, r], t.value.length === h(e).codeLength && D());
  }
  function w() {
    p.value || t.value.length === 0 || (t.value = t.value.slice(0, -1), o.value === "error" && (o.value = "idle", a.value = ""));
  }
  function j() {
    t.value = [], o.value = "idle", a.value = "";
  }
  async function D() {
    var r;
    o.value = "loading", a.value = "";
    try {
      const b = globalThis.$fetch;
      if (b)
        await b("/api/mojipass/auth", {
          method: "POST",
          body: {
            code: t.value.join(""),
            username: h(e).username ? n.value : void 0
          }
        });
      else if (!(await fetch(`${s}/api/mojipass/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: t.value.join(""),
          username: h(e).username ? n.value : void 0
        })
      })).ok) throw new Error("Invalid code");
      o.value = "success";
      const E = J(), S = (r = d == null ? void 0 : d.appContext.app.config.globalProperties) == null ? void 0 : r.$router;
      W(E, S);
    } catch {
      o.value = "error", a.value = "Incorrect code. Please try again.", setTimeout(j, 800);
    }
  }
  return {
    username: n,
    filledCount: i(l),
    isDisabled: i(p),
    isCodeComplete: i(g),
    hasError: i(C),
    status: i(o),
    errorMessage: i(a),
    pressKey: k,
    deleteLastKey: w
  };
}
const z = {
  background: "--mp-background",
  foreground: "--mp-foreground",
  primary: "--mp-primary",
  primaryForeground: "--mp-primary-foreground",
  accent: "--mp-accent",
  muted: "--mp-muted",
  border: "--mp-border"
};
function q(e) {
  if (!e) return;
  const s = document.documentElement;
  for (const [t, n] of Object.entries(z)) {
    const o = e[t];
    o && s.style.setProperty(n, o);
  }
}
function H(e) {
  R(() => h(e), q, { immediate: !0 });
}
const Q = ["aria-label"], X = ["animate"], Z = /* @__PURE__ */ _({
  __name: "CodeDisplay",
  props: {
    codeLength: {},
    filledCount: {},
    hasError: { type: Boolean }
  },
  setup(e) {
    return (s, t) => {
      const n = T("motion");
      return u(), m("div", {
        class: "mp-code",
        role: "status",
        "aria-live": "polite",
        "aria-label": `${e.filledCount} of ${e.codeLength} symbols entered`
      }, [
        (u(!0), m(M, null, O(e.codeLength, (o) => L((u(), m("div", {
          key: o,
          initial: { scale: 1 },
          animate: {
            scale: e.filledCount >= o ? 1.15 : 1,
            transition: { duration: 150 }
          },
          class: P([
            "mp-code__dot",
            e.hasError ? "mp-code__dot--error" : e.filledCount >= o ? "mp-code__dot--filled" : ""
          ])
        }, null, 10, X)), [
          [n]
        ])), 128))
      ], 8, Q);
    };
  }
}), ee = ["disabled", "aria-label"], oe = { "aria-hidden": "true" }, te = /* @__PURE__ */ _({
  __name: "EmojiKey",
  props: {
    emojiKey: {},
    isDisabled: { type: Boolean }
  },
  emits: ["press"],
  setup(e, { emit: s }) {
    const t = e, n = s;
    function o() {
      n("press", t.emojiKey.value);
    }
    return (a, d) => (u(), m("button", {
      type: "button",
      disabled: e.isDisabled,
      "aria-label": `Enter symbol ${e.emojiKey.symbol}`,
      class: "mp-key",
      onClick: o
    }, [
      f("span", oe, F(e.emojiKey.symbol), 1)
    ], 8, ee));
  }
}), se = { class: "mp-keypad" }, ne = ["disabled"], ae = /* @__PURE__ */ _({
  __name: "EmojiKeypad",
  props: {
    keys: {},
    isDisabled: { type: Boolean }
  },
  emits: ["keyPress", "delete"],
  setup(e, { emit: s }) {
    const t = s;
    return (n, o) => (u(), m("div", se, [
      f("div", {
        class: P(["mp-keypad__grid", e.keys.length > 9 && "mp-keypad__grid--4col"]),
        role: "group",
        "aria-label": "Emoji keypad"
      }, [
        (u(!0), m(M, null, O(e.keys, (a) => (u(), V(te, {
          key: a.value,
          "emoji-key": a,
          "is-disabled": e.isDisabled,
          onPress: o[0] || (o[0] = (d) => t("keyPress", d))
        }, null, 8, ["emoji-key", "is-disabled"]))), 128))
      ], 2),
      f("button", {
        type: "button",
        disabled: e.isDisabled,
        "aria-label": "Delete last entry",
        class: "mp-keypad__delete",
        onClick: o[1] || (o[1] = (a) => t("delete"))
      }, " Delete ", 8, ne)
    ]));
  }
}), ie = { class: "mp-login" }, le = {
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 400 } },
  class: "mp-login__card"
}, re = { class: "mp-login__header" }, ue = {
  key: 0,
  class: "mp-login__field"
}, de = ["disabled"], fe = /* @__PURE__ */ _({
  __name: "MojipassLogin",
  props: {
    config: {},
    basePath: { default: "" }
  },
  setup(e) {
    const s = e, { config: t, isLoading: n } = G(s.basePath), o = v(() => s.config ?? t.value);
    H(v(() => o.value.colors));
    const {
      username: a,
      filledCount: d,
      isDisabled: l,
      hasError: g,
      status: p,
      errorMessage: C,
      pressKey: k,
      deleteLastKey: w
    } = Y(o, s.basePath), j = v(() => n.value ? "Loading..." : p.value === "loading" ? "Verifying..." : p.value === "success" ? "Access granted" : p.value === "error" ? C.value : "Enter your code");
    return (D, r) => {
      const b = T("motion");
      return u(), m("div", ie, [
        L((u(), m("div", le, [
          f("header", re, [
            r[1] || (r[1] = f("h1", { class: "mp-login__title" }, " Mojipass ", -1)),
            f("p", {
              class: P(["mp-login__status", c(g) && "mp-login__status--error"]),
              role: "status",
              "aria-live": "polite"
            }, F(j.value), 3)
          ]),
          o.value.username ? (u(), m("div", ue, [
            r[2] || (r[2] = f("label", {
              for: "mojipass-username",
              class: "mp-login__label"
            }, " Username ", -1)),
            L(f("input", {
              id: "mojipass-username",
              "onUpdate:modelValue": r[0] || (r[0] = (E) => A(a) ? a.value = E : null),
              type: "text",
              autocomplete: "username",
              placeholder: "Enter your username",
              disabled: c(l),
              class: "mp-login__input"
            }, null, 8, de), [
              [B, c(a)]
            ])
          ])) : N("", !0),
          $(Z, {
            "code-length": o.value.codeLength,
            "filled-count": c(d),
            "has-error": c(g)
          }, null, 8, ["code-length", "filled-count", "has-error"]),
          $(ae, {
            keys: o.value.keys,
            "is-disabled": c(l) || c(n),
            onKeyPress: c(k),
            onDelete: c(w)
          }, null, 8, ["keys", "is-disabled", "onKeyPress", "onDelete"])
        ])), [
          [b]
        ])
      ]);
    };
  }
});
export {
  Z as CodeDisplay,
  te as EmojiKey,
  ae as EmojiKeypad,
  fe as MojipassLogin,
  H as useColorScheme,
  Y as useLoginFlow,
  G as useMojipassConfig
};
