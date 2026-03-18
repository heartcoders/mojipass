import { ref as m, readonly as a, computed as f, toValue as h, watch as S, defineComponent as b, resolveDirective as K, openBlock as l, createElementBlock as u, Fragment as $, renderList as M, withDirectives as E, normalizeClass as L, createElementVNode as d, toDisplayString as O, createBlock as A, unref as r, isRef as I, vModelText as N, createCommentVNode as V, createVNode as D } from "vue";
const B = "/api/mojipass/config", x = [
  { symbol: "🦊", value: 0 },
  { symbol: "🌊", value: 1 },
  { symbol: "🍕", value: 2 },
  { symbol: "🌈", value: 3 },
  { symbol: "🔥", value: 4 },
  { symbol: "🎯", value: 5 },
  { symbol: "🌙", value: 6 },
  { symbol: "⚡", value: 7 },
  { symbol: "🎸", value: 8 }
], R = {
  codeLength: 4,
  username: !1,
  keys: [...x]
};
function P() {
  return typeof window > "u" ? null : window.__MOJIPASS_CONFIG__ ?? null;
}
function U() {
  const e = m(P() ?? R), t = m(!1), n = m(!1);
  return P() ? {
    config: a(e),
    isLoading: a(t),
    hasError: a(n)
  } : (t.value = !0, fetch(B).then((o) => {
    if (!o.ok) throw new Error(`Config fetch failed: ${o.status}`);
    return o.json();
  }).then((o) => {
    e.value = o;
  }).catch(() => {
    n.value = !0;
  }).finally(() => {
    t.value = !1;
  }), {
    config: a(e),
    isLoading: a(t),
    hasError: a(n)
  });
}
function G(e) {
  const t = m([]), n = m(""), s = m("idle"), o = m(""), i = f(() => t.value.length), c = f(() => i.value === h(e).codeLength), p = f(() => s.value === "loading" || s.value === "success"), g = f(() => s.value === "error");
  function v(_) {
    p.value || c.value || (t.value = [...t.value, _], t.value.length === h(e).codeLength && w());
  }
  function C() {
    p.value || t.value.length === 0 || (t.value = t.value.slice(0, -1), s.value === "error" && (s.value = "idle", o.value = ""));
  }
  function k() {
    t.value = [], s.value = "idle", o.value = "";
  }
  async function w() {
    s.value = "loading", o.value = "";
    try {
      if (!(await fetch("/api/mojipass/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: t.value.join(""),
          username: h(e).username ? n.value : void 0
        })
      })).ok) throw new Error("Invalid code");
      s.value = "success";
      const j = new URLSearchParams(window.location.search).get("redirect") ?? "/";
      window.location.href = j;
    } catch {
      s.value = "error", o.value = "Incorrect code. Please try again.", setTimeout(k, 800);
    }
  }
  return {
    username: n,
    filledCount: a(i),
    isDisabled: a(p),
    isCodeComplete: a(c),
    hasError: a(g),
    status: a(s),
    errorMessage: a(o),
    pressKey: v,
    deleteLastKey: C
  };
}
const J = {
  background: "--mp-background",
  foreground: "--mp-foreground",
  primary: "--mp-primary",
  primaryForeground: "--mp-primary-foreground",
  accent: "--mp-accent",
  muted: "--mp-muted",
  border: "--mp-border"
};
function Y(e) {
  if (!e) return;
  const t = document.documentElement;
  for (const [n, s] of Object.entries(J)) {
    const o = e[n];
    o && t.style.setProperty(s, o);
  }
}
function z(e) {
  S(() => h(e), Y, { immediate: !0 });
}
const H = ["aria-label"], W = ["animate"], q = /* @__PURE__ */ b({
  __name: "CodeDisplay",
  props: {
    codeLength: {},
    filledCount: {},
    hasError: { type: Boolean }
  },
  setup(e) {
    return (t, n) => {
      const s = K("motion");
      return l(), u("div", {
        class: "mp-code",
        role: "status",
        "aria-live": "polite",
        "aria-label": `${e.filledCount} of ${e.codeLength} symbols entered`
      }, [
        (l(!0), u($, null, M(e.codeLength, (o) => E((l(), u("div", {
          key: o,
          initial: { scale: 1 },
          animate: {
            scale: e.filledCount >= o ? 1.15 : 1,
            transition: { duration: 150 }
          },
          class: L([
            "mp-code__dot",
            e.hasError ? "mp-code__dot--error" : e.filledCount >= o ? "mp-code__dot--filled" : ""
          ])
        }, null, 10, W)), [
          [s]
        ])), 128))
      ], 8, H);
    };
  }
}), Q = ["disabled", "aria-label"], X = { "aria-hidden": "true" }, Z = /* @__PURE__ */ b({
  __name: "EmojiKey",
  props: {
    emojiKey: {},
    isDisabled: { type: Boolean }
  },
  emits: ["press"],
  setup(e, { emit: t }) {
    const n = e, s = t;
    function o() {
      s("press", n.emojiKey.value);
    }
    return (i, c) => (l(), u("button", {
      type: "button",
      disabled: e.isDisabled,
      "aria-label": `Enter symbol ${e.emojiKey.symbol}`,
      class: "mp-key",
      onClick: o
    }, [
      d("span", X, O(e.emojiKey.symbol), 1)
    ], 8, Q));
  }
}), ee = { class: "mp-keypad" }, oe = ["disabled"], te = /* @__PURE__ */ b({
  __name: "EmojiKeypad",
  props: {
    keys: {},
    isDisabled: { type: Boolean }
  },
  emits: ["keyPress", "delete"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, o) => (l(), u("div", ee, [
      d("div", {
        class: L(["mp-keypad__grid", e.keys.length > 9 && "mp-keypad__grid--4col"]),
        role: "group",
        "aria-label": "Emoji keypad"
      }, [
        (l(!0), u($, null, M(e.keys, (i) => (l(), A(Z, {
          key: i.value,
          "emoji-key": i,
          "is-disabled": e.isDisabled,
          onPress: o[0] || (o[0] = (c) => n("keyPress", c))
        }, null, 8, ["emoji-key", "is-disabled"]))), 128))
      ], 2),
      d("button", {
        type: "button",
        disabled: e.isDisabled,
        "aria-label": "Delete last entry",
        class: "mp-keypad__delete",
        onClick: o[1] || (o[1] = (i) => n("delete"))
      }, " Delete ", 8, oe)
    ]));
  }
}), se = { class: "mp-login" }, ne = {
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 400 } },
  class: "mp-login__card"
}, ae = { class: "mp-login__header" }, ie = {
  key: 0,
  class: "mp-login__field"
}, le = ["disabled"], ue = /* @__PURE__ */ b({
  __name: "MojipassLogin",
  props: {
    config: {}
  },
  setup(e) {
    const t = e, { config: n, isLoading: s } = U(), o = f(() => t.config ?? n.value);
    z(f(() => o.value.colors));
    const {
      username: i,
      filledCount: c,
      isDisabled: p,
      hasError: g,
      status: v,
      errorMessage: C,
      pressKey: k,
      deleteLastKey: w
    } = G(o), _ = f(() => s.value ? "Loading..." : v.value === "loading" ? "Verifying..." : v.value === "success" ? "Access granted" : v.value === "error" ? C.value : "Enter your code");
    return (j, y) => {
      const T = K("motion");
      return l(), u("div", se, [
        E((l(), u("div", ne, [
          d("header", ae, [
            y[1] || (y[1] = d("h1", { class: "mp-login__title" }, " Mojipass ", -1)),
            d("p", {
              class: L(["mp-login__status", r(g) && "mp-login__status--error"]),
              role: "status",
              "aria-live": "polite"
            }, O(_.value), 3)
          ]),
          o.value.username ? (l(), u("div", ie, [
            y[2] || (y[2] = d("label", {
              for: "mojipass-username",
              class: "mp-login__label"
            }, " Username ", -1)),
            E(d("input", {
              id: "mojipass-username",
              "onUpdate:modelValue": y[0] || (y[0] = (F) => I(i) ? i.value = F : null),
              type: "text",
              autocomplete: "username",
              placeholder: "Enter your username",
              disabled: r(p),
              class: "mp-login__input"
            }, null, 8, le), [
              [N, r(i)]
            ])
          ])) : V("", !0),
          D(q, {
            "code-length": o.value.codeLength,
            "filled-count": r(c),
            "has-error": r(g)
          }, null, 8, ["code-length", "filled-count", "has-error"]),
          D(te, {
            keys: o.value.keys,
            "is-disabled": r(p) || r(s),
            onKeyPress: r(k),
            onDelete: r(w)
          }, null, 8, ["keys", "is-disabled", "onKeyPress", "onDelete"])
        ])), [
          [T]
        ])
      ]);
    };
  }
});
export {
  q as CodeDisplay,
  Z as EmojiKey,
  te as EmojiKeypad,
  ue as MojipassLogin,
  z as useColorScheme,
  G as useLoginFlow,
  U as useMojipassConfig
};
