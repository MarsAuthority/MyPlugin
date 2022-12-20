// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
! function (t) {
    "object" == typeof exports && "object" == typeof module ? t(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], t) : t(CodeMirror)
}(function (W) {
    "use strict";
    var I = "CodeMirror-hint-active";

    function o(t, i) {
        this.cm = t, this.options = i, this.widget = null, this.debounce = 0, this.tick = 0, this.startPos = this.cm.getCursor("start"), this.startLen = this.cm.getLine(this.startPos.line).length - this.cm.getSelection().length;
        var e = this;
        t.on("cursorActivity", this.activityFunc = function () {
            e.cursorActivity()
        })
    }
    W.showHint = function (t, i, e) {
        if (!i) return t.showHint(e);
        e && e.async && (i.async = !0);
        var n = {
            hint: i
        };
        if (e)
            for (var o in e) n[o] = e[o];
        return t.showHint(n)
    }, W.defineExtension("showHint", function (t) {
        t = function (t, i, e) {
            var n = t.options.hintOptions,
                o = {};
            for (var s in l) o[s] = l[s];
            if (n)
                for (var s in n) void 0 !== n[s] && (o[s] = n[s]);
            if (e)
                for (var s in e) void 0 !== e[s] && (o[s] = e[s]);
            o.hint.resolve && (o.hint = o.hint.resolve(t, i));
            return o
        }(this, this.getCursor("start"), t);
        var i = this.listSelections();
        if (!(1 < i.length)) {
            if (this.somethingSelected()) {
                if (!t.hint.supportsSelection) return;
                for (var e = 0; e < i.length; e++)
                    if (i[e].head.line != i[e].anchor.line) return
            }
            this.state.completionActive && this.state.completionActive.close();
            var n = this.state.completionActive = new o(this, t);
            n.options.hint && (W.signal(this, "startCompletion", this), n.update(!0))
        }
    }), W.defineExtension("closeHint", function () {
        this.state.completionActive && this.state.completionActive.close()
    });
    var s = window.requestAnimationFrame || function (t) {
            return setTimeout(t, 1e3 / 60)
        },
        c = window.cancelAnimationFrame || clearTimeout;

    function B(t) {
        return "string" == typeof t ? t : t.text
    }

    function K(t, i) {
        for (; i && i != t;) {
            if ("LI" === i.nodeName.toUpperCase() && i.parentNode == t) return i;
            i = i.parentNode
        }
    }

    function n(o, t) {
        this.completion = o, this.data = t, this.picked = !1;
        var e = this,
            s = o.cm,
            c = s.getInputField().ownerDocument,
            r = c.defaultView || c.parentWindow,
            l = this.hints = c.createElement("ul"),
            i = o.cm.options.theme;
        l.className = "CodeMirror-hints " + i, this.selectedHint = t.selectedHint || 0;
        for (var n = t.list, h = 0; h < n.length; ++h) {
            var a = l.appendChild(c.createElement("li")),
                u = n[h],
                f = "CodeMirror-hint" + (h != this.selectedHint ? "" : " " + I);
            null != u.className && (f = u.className + " " + f), a.className = f, u.render ? u.render(a, t, u) : a.appendChild(c.createTextNode(u.displayText || B(u))), a.hintId = h
        }
        var p, d, m, g = o.options.container || c.body,
            v = s.cursorCoords(o.options.alignWithWord ? t.from : null),
            y = v.left,
            w = v.bottom,
            H = !0,
            C = 0,
            b = 0;
        g !== c.body && (d = (p = -1 !== ["absolute", "relative", "fixed"].indexOf(r.getComputedStyle(g).position) ? g : g.offsetParent).getBoundingClientRect(), m = c.body.getBoundingClientRect(), C = d.left - m.left - p.scrollLeft, b = d.top - m.top - p.scrollTop), l.style.left = y - C + "px", l.style.top = w - b + "px";
        var k = r.innerWidth || Math.max(c.body.offsetWidth, c.documentElement.offsetWidth),
            A = r.innerHeight || Math.max(c.body.offsetHeight, c.documentElement.offsetHeight);
        g.appendChild(l);
        var x, T, S = l.getBoundingClientRect(),
            M = S.bottom - A,
            N = l.scrollHeight > l.clientHeight + 1,
            F = s.getScrollInfo();
        0 < M && (x = S.bottom - S.top, 0 < v.top - (v.bottom - S.top) - x ? (l.style.top = (w = v.top - x - b) + "px", H = !1) : A < x && (l.style.height = A - 5 + "px", l.style.top = (w = v.bottom - S.top - b) + "px", T = s.getCursor(), t.from.ch != T.ch && (v = s.cursorCoords(T), l.style.left = (y = v.left - C) + "px", S = l.getBoundingClientRect())));
        var E, O = S.right - k;
        if (0 < O && (S.right - S.left > k && (l.style.width = k - 5 + "px", O -= S.right - S.left - k), l.style.left = (y = v.left - O - C) + "px"), N)
            for (var P = l.firstChild; P; P = P.nextSibling) P.style.paddingRight = s.display.nativeBarWidth + "px";
        return s.addKeyMap(this.keyMap = function (t, n) {
            var o = {
                Up: function () {
                    n.moveFocus(-1)
                },
                Down: function () {
                    n.moveFocus(1)
                },
                PageUp: function () {
                    n.moveFocus(1 - n.menuSize(), !0)
                },
                PageDown: function () {
                    n.moveFocus(n.menuSize() - 1, !0)
                },
                Home: function () {
                    n.setFocus(0)
                },
                End: function () {
                    n.setFocus(n.length - 1)
                },
                Enter: n.pick,
                Tab: n.pick,
                Esc: n.close
            };
            /Mac/.test(navigator.platform) && (o["Ctrl-P"] = function () {
                n.moveFocus(-1)
            }, o["Ctrl-N"] = function () {
                n.moveFocus(1)
            });
            var i = t.options.customKeys,
                s = i ? {} : o;

            function e(t, i) {
                var e = "string" != typeof i ? function (t) {
                    return i(t, n)
                } : o.hasOwnProperty(i) ? o[i] : i;
                s[t] = e
            }
            if (i)
                for (var c in i) i.hasOwnProperty(c) && e(c, i[c]);
            var r = t.options.extraKeys;
            if (r)
                for (var c in r) r.hasOwnProperty(c) && e(c, r[c]);
            return s
        }(o, {
            moveFocus: function (t, i) {
                e.changeActive(e.selectedHint + t, i)
            },
            setFocus: function (t) {
                e.changeActive(t)
            },
            menuSize: function () {
                return e.screenAmount()
            },
            length: n.length,
            close: function () {
                o.close()
            },
            pick: function () {
                e.pick()
            },
            data: t
        })), o.options.closeOnUnfocus && (s.on("blur", this.onBlur = function () {
            E = setTimeout(function () {
                o.close()
            }, 100)
        }), s.on("focus", this.onFocus = function () {
            clearTimeout(E)
        })), s.on("scroll", this.onScroll = function () {
            var t = s.getScrollInfo(),
                i = s.getWrapperElement().getBoundingClientRect(),
                e = w + F.top - t.top,
                n = e - (r.pageYOffset || (c.documentElement || c.body).scrollTop);
            if (H || (n += l.offsetHeight), n <= i.top || n >= i.bottom) return o.close();
            l.style.top = e + "px", l.style.left = y + F.left - t.left + "px"
        }), W.on(l, "dblclick", function (t) {
            var i = K(l, t.target || t.srcElement);
            i && null != i.hintId && (e.changeActive(i.hintId), e.pick())
        }), W.on(l, "click", function (t) {
            var i = K(l, t.target || t.srcElement);
            i && null != i.hintId && (e.changeActive(i.hintId), o.options.completeOnSingleClick && e.pick())
        }), W.on(l, "mousedown", function () {
            setTimeout(function () {
                s.focus()
            }, 20)
        }), this.scrollToActive(), W.signal(t, "select", n[this.selectedHint], l.childNodes[this.selectedHint]), !0
    }

    function r(t, i, e, n) {
        var o;
        t.async ? t(i, n, e) : (o = t(i, e)) && o.then ? o.then(n) : n(o)
    }
    o.prototype = {
        close: function () {
            this.active() && (this.cm.state.completionActive = null, this.tick = null, this.cm.off("cursorActivity", this.activityFunc), this.widget && this.data && W.signal(this.data, "close"), this.widget && this.widget.close(), W.signal(this.cm, "endCompletion", this.cm))
        },
        active: function () {
            return this.cm.state.completionActive == this
        },
        pick: function (t, i) {
            var e = t.list[i],
                n = this;
            this.cm.operation(function () {
                e.hint ? e.hint(n.cm, t, e) : n.cm.replaceRange(B(e), e.from || t.from, e.to || t.to, "complete"), W.signal(t, "pick", e), n.cm.scrollIntoView()
            }), this.close()
        },
        cursorActivity: function () {
            this.debounce && (c(this.debounce), this.debounce = 0);
            var t = this.startPos;
            this.data && (t = this.data.from);
            var i, e = this.cm.getCursor(),
                n = this.cm.getLine(e.line);
            e.line != this.startPos.line || n.length - e.ch != this.startLen - this.startPos.ch || e.ch < t.ch || this.cm.somethingSelected() || !e.ch || this.options.closeCharacters.test(n.charAt(e.ch - 1)) ? this.close() : ((i = this).debounce = s(function () {
                i.update()
            }), this.widget && this.widget.disable())
        },
        update: function (i) {
            var e, n;
            null != this.tick && (n = ++(e = this).tick, r(this.options.hint, this.cm, this.options, function (t) {
                e.tick == n && e.finishUpdate(t, i)
            }))
        },
        finishUpdate: function (t, i) {
            this.data && W.signal(this.data, "update");
            var e = this.widget && this.widget.picked || i && this.options.completeSingle;
            this.widget && this.widget.close(), (this.data = t) && t.list.length && (e && 1 == t.list.length ? this.pick(t, 0) : (this.widget = new n(this, t), W.signal(t, "shown")))
        }
    }, n.prototype = {
        close: function () {
            var t;
            this.completion.widget == this && (this.completion.widget = null, this.hints.parentNode.removeChild(this.hints), this.completion.cm.removeKeyMap(this.keyMap), t = this.completion.cm, this.completion.options.closeOnUnfocus && (t.off("blur", this.onBlur), t.off("focus", this.onFocus)), t.off("scroll", this.onScroll))
        },
        disable: function () {
            this.completion.cm.removeKeyMap(this.keyMap);
            var t = this;
            this.keyMap = {
                Enter: function () {
                    t.picked = !0
                }
            }, this.completion.cm.addKeyMap(this.keyMap)
        },
        pick: function () {
            this.completion.pick(this.data, this.selectedHint)
        },
        changeActive: function (t, i) {
            var e;
            t >= this.data.list.length ? t = i ? this.data.list.length - 1 : 0 : t < 0 && (t = i ? 0 : this.data.list.length - 1), this.selectedHint != t && ((e = this.hints.childNodes[this.selectedHint]) && (e.className = e.className.replace(" " + I, "")), (e = this.hints.childNodes[this.selectedHint = t]).className += " " + I, this.scrollToActive(), W.signal(this.data, "select", this.data.list[this.selectedHint], e))
        },
        scrollToActive: function () {
            var t = this.completion.options.scrollMargin || 0,
                i = this.hints.childNodes[Math.max(0, this.selectedHint - t)],
                e = this.hints.childNodes[Math.min(this.data.list.length - 1, this.selectedHint + t)],
                n = this.hints.firstChild;
            i.offsetTop < this.hints.scrollTop ? this.hints.scrollTop = i.offsetTop - n.offsetTop : e.offsetTop + e.offsetHeight > this.hints.scrollTop + this.hints.clientHeight && (this.hints.scrollTop = e.offsetTop + e.offsetHeight - this.hints.clientHeight + n.offsetTop)
        },
        screenAmount: function () {
            return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1
        }
    }, W.registerHelper("hint", "auto", {
        resolve: function (t, i) {
            var e, c = t.getHelpers(i, "hint");
            if (c.length) {
                var n = function (t, n, o) {
                    var s = function (t, i) {
                        if (!t.somethingSelected()) return i;
                        for (var e = [], n = 0; n < i.length; n++) i[n].supportsSelection && e.push(i[n]);
                        return e
                    }(t, c);
                    ! function i(e) {
                        if (e == s.length) return n(null);
                        r(s[e], t, o, function (t) {
                            t && 0 < t.list.length ? n(t) : i(e + 1)
                        })
                    }(0)
                };
                return n.async = !0, n.supportsSelection = !0, n
            }
            return (e = t.getHelper(t.getCursor(), "hintWords")) ? function (t) {
                return W.hint.fromList(t, {
                    words: e
                })
            } : W.hint.anyword ? function (t, i) {
                return W.hint.anyword(t, i)
            } : function () {}
        }
    }), W.registerHelper("hint", "fromList", function (t, i) {
        var e, n = t.getCursor(),
            o = t.getTokenAt(n),
            s = W.Pos(n.line, o.start),
            c = n;
        o.start < n.ch && /\w/.test(o.string.charAt(n.ch - o.start - 1)) ? e = o.string.substr(0, n.ch - o.start) : (e = "", s = n);
        for (var r = [], l = 0; l < i.words.length; l++) {
            var h = i.words[l];
            h.slice(0, e.length) == e && r.push(h)
        }
        if (r.length) return {
            list: r,
            from: s,
            to: c
        }
    }), W.commands.autocomplete = W.showHint;
    var l = {
        hint: W.hint.auto,
        completeSingle: !0,
        alignWithWord: !0,
        closeCharacters: /[\s()\[\]{};:>,]/,
        closeOnUnfocus: !0,
        completeOnSingleClick: !0,
        container: null,
        customKeys: null,
        extraKeys: null
    };
    W.defineOption("hintOptions", null)
});