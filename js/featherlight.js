! function(e) {
    "use strict";
    if (void 0 !== e) {
        var t = [],
            n = function(n) {
                return t = e.grep(t, function(e) {
                    return e !== n && e.$instance.closest("body").length > 0
                })
            },
            r = {
                keyup: "onKeyUp",
                resize: "onResize"
            },
            i = function(t) {
                e.each(o.opened().reverse(), function() {
                    if (!t.isDefaultPrevented() && !1 === this[r[t.type]](t)) return t.preventDefault(), t.stopPropagation(), !1
                })
            },
            a = function(t) {
                if (t !== o._globalHandlerInstalled) {
                    o._globalHandlerInstalled = t;
                    var n = e.map(r, function(e, t) {
                        return t + "." + o.prototype.namespace
                    }).join(" ");
                    e(window)[t ? "on" : "off"](n, i)
                }
            };
        o.prototype = {
            constructor: o,
            namespace: "featherlight",
            targetAttr: "data-featherlight",
            variant: null,
            resetCss: !1,
            background: null,
            openTrigger: "click",
            closeTrigger: "click",
            filter: null,
            root: "body",
            fadeInOnly: !1,
            openSpeed: 150,
            closeSpeed: 150,
            closeOnClick: false,
            closeOnEsc: !0,
            closeIcon: "&#10005;",
            loading: "",
            persist: !1,
            otherClose: null,
            beforeOpen: e.noop,
            beforeContent: e.noop,
            beforeClose: e.noop,
            afterOpen: e.noop,
            afterContent: e.noop,
            afterClose: e.noop,
            onKeyUp: e.noop,
            onResize: e.noop,
            type: null,
            contentFilters: ["jquery", "image", "html", "ajax", "iframe", "text"],
            setup: function(t, n) {
                "object" != typeof t || t instanceof e != !1 || n || (n = t, t = void 0);
                var r = e.extend(this, n, {
                        target: t
                    }),
                    i = r.resetCss ? r.namespace + "-reset" : r.namespace,
                    a = e(r.background || ['<div class="' + i + "-loading " + i + '">', '<div class="' + i + '-content">', '<span class="' + i + "-close-icon " + r.namespace + '-close" title="Press ESC to close">', r.closeIcon, "</span>", '<div class="' + r.namespace + '-inner">' + r.loading + "</div>", "</div>", "</div>"].join("")),
                    o = "." + r.namespace + "-close" + (r.otherClose ? "," + r.otherClose : "");
                return r.$instance = a.clone().addClass(r.variant), r.$instance.on(r.closeTrigger + "." + r.namespace, function(t) {
                    var n = e(t.target);
                    ("background" === r.closeOnClick && n.is("." + r.namespace) || "anywhere" === r.closeOnClick || n.closest(o).length) && (r.close(t), t.preventDefault())
                }), this
            },
            getContent: function() {
                if (this.$currentTarget && this.$currentTarget[0].classList.contains("disabled")) return !1;
                if (!1 !== this.persist && this.$content) return this.$content;
                var t = this,
                    n = this.constructor.contentFilters,
                    r = function(e) {
                        return t.$currentTarget && t.$currentTarget.attr(e)
                    },
                    i = r(t.targetAttr),
                    a = t.target || i || "";
                t.$currentTarget && t.$currentTarget[0].hasAttribute("data-unique") && (e.featherlight.close(), t.$currentTarget[0].classList.add("disabled"));
                var o = n[t.type];
                if (!o && a in n && (o = n[a], a = t.target && i), a = a || r("href") || "", !o)
                    for (var s in n) t[s] && (o = n[s], a = t[s]);
                if (!o) {
                    var c = a;
                    if (a = null, e.each(t.contentFilters, function() {
                            return (o = n[this]).test && (a = o.test(c)), !a && o.regex && c.match && c.match(o.regex) && (a = c), !a
                        }), !a) return "console" in window && window.console.error("Featherlight: no content filter found " + (c ? ' for "' + c + '"' : " (no target specified)")), !1
                }
                return o.process.call(t, a)
            },
            setContent: function(t) {
                var n = this;
                return (t.is("iframe") || e("iframe", t).length > 0) && n.$instance.addClass(n.namespace + "-iframe"), n.$instance.removeClass(n.namespace + "-loading"), n.$instance.find("." + n.namespace + "-inner").not(t).slice(1).remove().end().replaceWith(e.contains(n.$instance[0], t[0]) ? "" : t), n.$content = t.addClass(n.namespace + "-inner"), n
            },
            open: function(n) {
                var r = this;
                if (r.$instance.hide().appendTo(r.root), !(n && n.isDefaultPrevented() || !1 === r.beforeOpen(n))) {
                    n && n.preventDefault();
                    var i = r.getContent();
                    if (i) {
                        t.push(r), a(!0);
                        var o = !1;
                        return r.$currentTarget && (o = r.$currentTarget.data("featherlight-fadeinonly")), r.beforeContent(n), e.when(i).always(function(e) {
                            r.setContent(e), (r.fadeInOnly || o) && r.$instance.fadeIn(r.openSpeed), r.afterContent(n)
                        }).then(r.$instance.promise()).done(function() {
                            if (r.afterOpen(n), !r.fadeInOnly && 1 != o) {
                                var e = r.$instance.children(".featherlight-content");
                                r.$instance.show();
                                e[0].clientWidth, e[0].clientHeight;
                                r.$instance.hide(), e.css("top", -700), r.$instance.fadeIn(r.openSpeed, function() {
                                    e.show().animate({
                                        top: 0
                                    }, r.openSpeed + 500, function() {
                                        e.css("overflow", "visible")
                                    })
                                })
                            }
                        })
                    }
                }
                return r.$instance.detach(), e.Deferred().reject().promise()
            },
            close: function(t) {
                this.$currentTarget && this.$currentTarget[0].classList.contains("disabled") && e(".disabled").removeClass("disabled");
                var r = this,
                    i = e.Deferred();
                return !1 === r.beforeClose(t) ? i.reject() : (0 === n(r).length && a(!1), r.$instance.fadeOut(r.closeSpeed, function() {
                    r.$instance.detach(), r.afterClose(t), i.resolve()
                })), i.promise()
            },
            resize: function(e, t) {
                if (e && t) {
                    this.$content.css("width", "").css("height", "");
                    var n = Math.max(e / parseInt(this.$content.parent().css("width"), 10), t / parseInt(this.$content.parent().css("height"), 10));
                    n > 1 && this.$content.css("width", e / n + "px").css("height", t / n + "px")
                }
            },
            chainCallbacks: function(t) {
                for (var n in t) this[n] = e.proxy(t[n], this, e.proxy(this[n], this))
            }
        }, e.extend(o, {
            id: 0,
            autoBind: "[data-featherlight]",
            defaults: o.prototype,
            contentFilters: {
                jquery: {
                    regex: /^[#.]\w/,
                    test: function(t) {
                        return t instanceof e && t
                    },
                    process: function(t) {
                        return !1 !== this.persist ? e(t) : e(t).clone(!0)
                    }
                },
                image: {
                    regex: /\.(png|jpg|jpeg|gif|tiff|bmp|svg)(\?\S*)?$/i,
                    process: function(t) {
                        var n = e.Deferred(),
                            r = new Image,
                            i = e('<img src="' + t + '" alt="" class="' + this.namespace + '-image" />');
                        return r.onload = function() {
                            i.naturalWidth = r.width, i.naturalHeight = r.height, n.resolve(i)
                        }, r.onerror = function() {
                            n.reject(i)
                        }, r.src = t, n.promise()
                    }
                },
                html: {
                    regex: /^\s*<[\w!][^<]*>/,
                    process: function(t) {
                        return e(t)
                    }
                },
                ajax: {
                    regex: /./,
                    process: function(t) {
                        var n = e.Deferred();
                        e.get(t).then(function(t, r) {
                            n.resolve(e(t))
                        }, function() {
                            n.fail()
                        });
                        return n.promise()
                    }
                },
                iframe: {
                    process: function(t) {
                        var n = new e.Deferred,
                            r = e("<iframe/>").hide().attr("src", t).css(function(e, t) {
                                var n = {},
                                    r = new RegExp("^" + t + "([A-Z])(.*)");
                                for (var i in e) {
                                    var a = i.match(r);
                                    a && (n[(a[1] + a[2].replace(/([A-Z])/g, "-$1")).toLowerCase()] = e[i])
                                }
                                return n
                            }(this, "iframe")).on("load", function() {
                                n.resolve(r.show())
                            }).appendTo(this.$instance.find("." + this.namespace + "-content"));
                        return n.promise()
                    }
                },
                text: {
                    process: function(t) {
                        return e("<div>", {
                            text: t
                        })
                    }
                }
            },
            functionAttributes: ["beforeOpen", "afterOpen", "beforeContent", "afterContent", "beforeClose", "afterClose"],
            readElementConfig: function(t, n) {
                var r = this,
                    i = new RegExp("^data-" + n + "-(.*)"),
                    a = {};
                return t && t.attributes && e.each(t.attributes, function() {
                    var t = this.name.match(i);
                    if (t) {
                        var n = this.value,
                            o = e.camelCase(t[1]);
                        if (e.inArray(o, r.functionAttributes) >= 0) n = new Function(n);
                        else try {
                            n = e.parseJSON(n)
                        } catch (e) {}
                        a[o] = n
                    }
                }), a
            },
            extend: function(t, n) {
                var r = function() {
                    this.constructor = t
                };
                return r.prototype = this.prototype, t.prototype = new r, t.__super__ = this.prototype, e.extend(t, this, n), t.defaults = t.prototype, t
            },
            attach: function(t, n, r) {
                var i = this;
                "object" != typeof n || n instanceof e != !1 || r || (r = n, n = void 0);
                var a, o = (r = e.extend({}, r)).namespace || i.defaults.namespace,
                    s = e.extend({}, i.defaults, i.readElementConfig(t[0], o), r);
                return t.on(s.openTrigger + "." + s.namespace, s.filter, function(o) {
                    var c = e.extend({
                            $source: t,
                            $currentTarget: e(this)
                        }, i.readElementConfig(t[0], s.namespace), i.readElementConfig(this, s.namespace), r),
                        l = a || e(this).data("featherlight-persisted") || new i(n, c);
                    "shared" === l.persist ? a = l : !1 !== l.persist && e(this).data("featherlight-persisted", l), c.$currentTarget.blur(), l.open(o)
                }), t
            },
            current: function() {
                var e = this.opened();
                return e[e.length - 1] || {
                    close: function() {}
                }
            },
            prev: function() {
                var e = this.opened();
                return e[e.length - 2] || {
                    close: function() {}
                }
            },
            opened: function() {
                var r = this;
                return n(), e.grep(t, function(e) {
                    return e instanceof r
                })
            },
            close: function(e) {
                var t = this.current();
                if (t) return t.close(e)
            },
            closeAll: function(e) {
                for (var t = this.opened(), n = 0, r = t.length; n < r; n++) t[n] && t[n].close(e)
            },
            _onReady: function() {
                var t = this;
                t.autoBind && (e(t.autoBind).each(function() {
                    t.attach(e(this))
                }), e(document).on("click", t.autoBind, function(n) {
                    n.isDefaultPrevented() || "featherlight" === n.namespace || (n.preventDefault(), t.attach(e(n.currentTarget)), e(n.target).trigger("click.featherlight"))
                }))
            },
            _callbackChain: {
                onKeyUp: function(t, n) {
                    return 27 === n.keyCode ? (this.closeOnEsc && e.featherlight.close(n), !1) : t(n)
                },
                onResize: function(e, t) {
                    return this.resize(this.$content.naturalWidth, this.$content.naturalHeight), e(t)
                },
                afterContent: function(e, t) {
                    var n = e(t);
                    return this.onResize(t), n
                }
            }
        }), e.featherlight = o, e.fn.featherlight = function(e, t) {
            return o.attach(this, e, t)
        }, e(document).ready(function() {
            o._onReady()
        })
    } else "console" in window && window.console.info("Too much lightness, Featherlight needs jQuery.");

    function o(e, t) {
        if (!(this instanceof o)) {
            var n = new o(e, t);
            return n.open(), n
        }
        this.id = o.id++, this.setup(e, t), this.chainCallbacks(o._callbackChain)
    }
}(jQuery);