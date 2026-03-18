import { ref as f, readonly as i, computed as p, toValue as h, watch as F, defineComponent as _, resolveDirective as $, openBlock as l, createElementBlock as u, Fragment as K, renderList as M, withDirectives as L, normalizeClass as j, createElementVNode as c, toDisplayString as O, createBlock as V, unref as r, isRef as B, vModelText as N, createCommentVNode as x, createVNode as D } from "vue";
const A = [
  { symbol: "🦊", value: 0 },
  { symbol: "🌊", value: 1 },
  { symbol: "🍕", value: 2 },
  { symbol: "🌈", value: 3 },
  { symbol: "🔥", value: 4 },
  { symbol: "🎯", value: 5 },
  { symbol: "🌙", value: 6 },
  { symbol: "⚡", value: 7 },
  { symbol: "🎸", value: 8 }
], I = {
  codeLength: 4,
  username: !1,
  keys: [...A]
};
function P() {
  return typeof window > "u" ? null : window.__MOJIPASS_CONFIG__ ?? null;
}
function R(o = "") {
  const n = f(P() ?? I), t = f(!1), a = f(!1);
  return P() ? {
    config: i(n),
    isLoading: i(t),
    hasError: i(a)
  } : (t.value = !0, fetch(`${o}/api/mojipass/config`).then((s) => {
    if (!s.ok) throw new Error(`Config fetch failed: ${s.status}`);
    return s.json();
  }).then((s) => {
    n.value = s;
  }).catch(() => {
    a.value = !0;
  }).finally(() => {
    t.value = !1;
  }), {
    config: i(n),
    isLoading: i(t),
    hasError: i(a)
  });
}
function U(o, n = "") {
  const t = f([]), a = f(""), e = f("idle"), s = f(""), m = p(() => t.value.length), v = p(() => m.value === h(o).codeLength), y = p(() => e.value === "loading" || e.value === "success"), g = p(() => e.value === "error");
  function b(E) {
    y.value || v.value || (t.value = [...t.value, E], t.value.length === h(o).codeLength && w());
  }
  function C() {
    y.value || t.value.length === 0 || (t.value = t.value.slice(0, -1), e.value === "error" && (e.value = "idle", s.value = ""));
  }
  function k() {
    t.value = [], e.value = "idle", s.value = "";
  }
  async function w() {
    e.value = "loading", s.value = "";
    try {
      if (!(await fetch(`${n}/api/mojipass/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: t.value.join(""),
          username: h(o).username ? a.value : void 0
        })
      })).ok) throw new Error("Invalid code");
      e.value = "success";
      const d = new URLSearchParams(window.location.search).get("redirect") ?? "/";
      window.location.href = d;
    } catch {
      e.value = "error", s.value = "Incorrect code. Please try again.", setTimeout(k, 800);
    }
  }
  return {
    username: a,
    filledCount: i(m),
    isDisabled: i(y),
    isCodeComplete: i(v),
    hasError: i(g),
    status: i(e),
    errorMessage: i(s),
    pressKey: b,
    deleteLastKey: C
  };
}
const G = {
  background: "--mp-background",
  foreground: "--mp-foreground",
  primary: "--mp-primary",
  primaryForeground: "--mp-primary-foreground",
  accent: "--mp-accent",
  muted: "--mp-muted",
  border: "--mp-border"
};
function J(o) {
  if (!o) return;
  const n = document.documentElement;
  for (const [t, a] of Object.entries(G)) {
    const e = o[t];
    e && n.style.setProperty(a, e);
  }
}
function Y(o) {
  F(() => h(o), J, { immediate: !0 });
}
const z = ["aria-label"], W = ["animate"], q = /* @__PURE__ */ _({
  __name: "CodeDisplay",
  props: {
    codeLength: {},
    filledCount: {},
    hasError: { type: Boolean }
  },
  setup(o) {
    return (n, t) => {
      const a = $("motion");
      return l(), u("div", {
        class: "mp-code",
        role: "status",
        "aria-live": "polite",
        "aria-label": `${o.filledCount} of ${o.codeLength} symbols entered`
      }, [
        (l(!0), u(K, null, M(o.codeLength, (e) => L((l(), u("div", {
          key: e,
          initial: { scale: 1 },
          animate: {
            scale: o.filledCount >= e ? 1.15 : 1,
            transition: { duration: 150 }
          },
          class: j([
            "mp-code__dot",
            o.hasError ? "mp-code__dot--error" : o.filledCount >= e ? "mp-code__dot--filled" : ""
          ])
        }, null, 10, W)), [
          [a]
        ])), 128))
      ], 8, z);
    };
  }
}), H = ["disabled", "aria-label"], Q = { "aria-hidden": "true" }, X = /* @__PURE__ */ _({
  __name: "EmojiKey",
  props: {
    emojiKey: {},
    isDisabled: { type: Boolean }
  },
  emits: ["press"],
  setup(o, { emit: n }) {
    const t = o, a = n;
    function e() {
      a("press", t.emojiKey.value);
    }
    return (s, m) => (l(), u("button", {
      type: "button",
      disabled: o.isDisabled,
      "aria-label": `Enter symbol ${o.emojiKey.symbol}`,
      class: "mp-key",
      onClick: e
    }, [
      c("span", Q, O(o.emojiKey.symbol), 1)
    ], 8, H));
  }
}), Z = { class: "mp-keypad" }, ee = ["disabled"], oe = /* @__PURE__ */ _({
  __name: "EmojiKeypad",
  props: {
    keys: {},
    isDisabled: { type: Boolean }
  },
  emits: ["keyPress", "delete"],
  setup(o, { emit: n }) {
    const t = n;
    return (a, e) => (l(), u("div", Z, [
      c("div", {
        class: j(["mp-keypad__grid", o.keys.length > 9 && "mp-keypad__grid--4col"]),
        role: "group",
        "aria-label": "Emoji keypad"
      }, [
        (l(!0), u(K, null, M(o.keys, (s) => (l(), V(X, {
          key: s.value,
          "emoji-key": s,
          "is-disabled": o.isDisabled,
          onPress: e[0] || (e[0] = (m) => t("keyPress", m))
        }, null, 8, ["emoji-key", "is-disabled"]))), 128))
      ], 2),
      c("button", {
        type: "button",
        disabled: o.isDisabled,
        "aria-label": "Delete last entry",
        class: "mp-keypad__delete",
        onClick: e[1] || (e[1] = (s) => t("delete"))
      }, " Delete ", 8, ee)
    ]));
  }
}), te = { class: "mp-login" }, se = {
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 400 } },
  class: "mp-login__card"
}, ne = { class: "mp-login__header" }, ae = {
  key: 0,
  class: "mp-login__field"
}, ie = ["disabled"], re = /* @__PURE__ */ _({
  __name: "MojipassLogin",
  props: {
    config: {},
    basePath: { default: "" }
  },
  setup(o) {
    const n = o, { config: t, isLoading: a } = R(n.basePath), e = p(() => n.config ?? t.value);
    Y(p(() => e.value.colors));
    const {
      username: s,
      filledCount: m,
      isDisabled: v,
      hasError: y,
      status: g,
      errorMessage: b,
      pressKey: C,
      deleteLastKey: k
    } = U(e, n.basePath), w = p(() => a.value ? "Loading..." : g.value === "loading" ? "Verifying..." : g.value === "success" ? "Access granted" : g.value === "error" ? b.value : "Enter your code");
    return (E, d) => {
      const S = $("motion");
      return l(), u("div", te, [
        L((l(), u("div", se, [
          c("header", ne, [
            d[1] || (d[1] = c("h1", { class: "mp-login__title" }, " Mojipass ", -1)),
            c("p", {
              class: j(["mp-login__status", r(y) && "mp-login__status--error"]),
              role: "status",
              "aria-live": "polite"
            }, O(w.value), 3)
          ]),
          e.value.username ? (l(), u("div", ae, [
            d[2] || (d[2] = c("label", {
              for: "mojipass-username",
              class: "mp-login__label"
            }, " Username ", -1)),
            L(c("input", {
              id: "mojipass-username",
              "onUpdate:modelValue": d[0] || (d[0] = (T) => B(s) ? s.value = T : null),
              type: "text",
              autocomplete: "username",
              placeholder: "Enter your username",
              disabled: r(v),
              class: "mp-login__input"
            }, null, 8, ie), [
              [N, r(s)]
            ])
          ])) : x("", !0),
          D(q, {
            "code-length": e.value.codeLength,
            "filled-count": r(m),
            "has-error": r(y)
          }, null, 8, ["code-length", "filled-count", "has-error"]),
          D(oe, {
            keys: e.value.keys,
            "is-disabled": r(v) || r(a),
            onKeyPress: r(C),
            onDelete: r(k)
          }, null, 8, ["keys", "is-disabled", "onKeyPress", "onDelete"])
        ])), [
          [S]
        ])
      ]);
    };
  }
});
export {
  q as CodeDisplay,
  X as EmojiKey,
  oe as EmojiKeypad,
  re as MojipassLogin,
  Y as useColorScheme,
  U as useLoginFlow,
  R as useMojipassConfig
};
