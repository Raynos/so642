(function(c) {
    function d(e) {
        return typeof e == "object" ? e : {top: e,left: e}
    }
    var b = c.scrollTo = function(e, k, i) {
        c(window).scrollTo(e, k, i)
    };
    b.defaults = {axis: "xy",duration: parseFloat(c.fn.jquery) >= 1.3 ? 0 : 1};
    b.window = function() {
        return c(window)._scrollable()
    };
    c.fn._scrollable = function() {
        return this.map(function() {
            if (!(!this.nodeName || c.inArray(this.nodeName.toLowerCase(), ["iframe", "#document", "html", "body"]) != -1))
                return this;
            var e = (this.contentWindow || this).document || this.ownerDocument || this;
            return c.browser.safari || 
            e.compatMode == "BackCompat" ? e.body : e.documentElement
        })
    };
    c.fn.scrollTo = function(e, k, i) {
        if (typeof k == "object") {
            i = k;
            k = 0
        }
        if (typeof i == "function")
            i = {onAfter: i};
        if (e == "max")
            e = 9E9;
        i = c.extend({}, b.defaults, i);
        k = k || i.speed || i.duration;
        i.queue = i.queue && i.axis.length > 1;
        if (i.queue)
            k /= 2;
        i.offset = d(i.offset);
        i.over = d(i.over);
        return this._scrollable().each(function() {
            function m(v) {
                o.animate(p, k, i.easing, v && function() {
                    v.call(this, e, i)
                })
            }
            var j = this, o = c(j), g = e, h, p = {}, u = o.is("html,body");
            switch (typeof g) {
                case "number":
                case "string":
                    if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(g)) {
                        g = 
                        d(g);
                        break
                    }
                    g = c(g, this);
                case "object":
                    if (g.is || g.style)
                        h = (g = c(g)).offset()
            }
            c.each(i.axis.split(""), function(v, t) {
                var r = t == "x" ? "Left" : "Top", x = r.toLowerCase(), y = "scroll" + r, C = j[y], I = b.max(j, t);
                if (h) {
                    p[y] = h[x] + (u ? 0 : C - o.offset()[x]);
                    if (i.margin) {
                        p[y] -= parseInt(g.css("margin" + r)) || 0;
                        p[y] -= parseInt(g.css("border" + r + "Width")) || 0
                    }
                    p[y] += i.offset[x] || 0;
                    if (i.over[x])
                        p[y] += g[t == "x" ? "width" : "height"]() * i.over[x]
                } else {
                    r = g[x];
                    p[y] = r.slice && r.slice(-1) == "%" ? parseFloat(r) / 100 * I : r
                }
                if (/^\d+$/.test(p[y]))
                    p[y] = p[y] <= 0 ? 
                    0 : Math.min(p[y], I);
                if (!v && i.queue) {
                    C != p[y] && m(i.onAfterFirst);
                    delete p[y]
                }
            });
            m(i.onAfter)
        }).end()
    };
    b.max = function(e, k) {
        var i = k == "x" ? "Width" : "Height", m = "scroll" + i;
        if (!c(e).is("html,body"))
            return e[m] - c(e)[i.toLowerCase()]();
        i = "client" + i;
        var j = e.ownerDocument.documentElement, o = e.ownerDocument.body;
        return Math.max(j[m], o[m]) - Math.min(j[i], o[i])
    }
})(jQuery);
jQuery.cookie = function(c, d, b) {
    if (typeof d != "undefined") {
        b = b || {};
        if (d === null) {
            d = "";
            b.expires = -1
        }
        var e = "";
        if (b.expires && (typeof b.expires == "number" || b.expires.toUTCString)) {
            if (typeof b.expires == "number") {
                e = new Date;
                e.setTime(e.getTime() + b.expires * 24 * 60 * 60 * 1E3)
            } else
                e = b.expires;
            e = "; expires=" + e.toUTCString()
        }
        var k = b.path ? "; path=" + b.path : "", i = b.domain ? "; domain=" + b.domain : "";
        b = b.secure ? "; secure" : "";
        document.cookie = [c, "=", encodeURIComponent(d), e, k, i, b].join("")
    } else {
        d = null;
        if (document.cookie && document.cookie != 
        "") {
            b = document.cookie.split(";");
            for (e = 0; e < b.length; e++) {
                k = jQuery.trim(b[e]);
                if (k.substring(0, c.length + 1) == c + "=") {
                    d = decodeURIComponent(k.substring(c.length + 1));
                    break
                }
            }
        }
        return d
    }
};
(function(c) {
    var d = c.preload = function(b, e) {
        function k(g) {
            j.element = this;
            j.found = g.type == "load";
            j.image = this.src;
            j.index = this.index;
            g = j.original = b[this.index];
            j[j.found ? "loaded" : "failed"]++;
            j.done++;
            e.enforceCache && d.cache.push(c("<img/>").attr("src", j.image)[0]);
            if (e.placeholder && g.src)
                g.src = j.found ? j.image : e.notFound || g.src;
            e.onComplete && e.onComplete(j);
            if (j.done < j.total)
                i(0, this);
            else {
                o && o.unbind && o.unbind("load").unbind("error").unbind("abort");
                o = null;
                e.onFinish && e.onFinish(j)
            }
        }
        function i(g, h, 
        p) {
            if (h.attachEvent && j.next && j.next % d.gap == 0 && !p) {
                setTimeout(function() {
                    i(g, h, true)
                }, 0);
                return false
            }
            if (j.next == j.total)
                return false;
            h.index = j.next;
            h.src = m[j.next++];
            if (e.onRequest) {
                j.index = h.index;
                j.element = h;
                j.image = h.src;
                j.original = b[j.next - 1];
                e.onRequest(j)
            }
            h.complete && c(h).trigger("load")
        }
        if (b.split)
            b = c(b);
        e = c.extend({}, d.defaults, e);
        var m = c.map(b, function(g) {
            if (g) {
                if (g.split)
                    return e.base + g + e.ext;
                var h = g.src || g.href;
                if (typeof e.placeholder == "string" && g.src)
                    g.src = e.placeholder;
                if (h && e.find)
                    h = 
                    h.replace(e.find, e.replace);
                return h || null
            }
        }), j = {loaded: 0,failed: 0,next: 0,done: 0,total: m.length};
        if (j.total)
            var o = c(Array(e.threshold + 1).join("<img/>")).load(k).error(k).bind("abort", k).each(i);
        else
            e.onFinish && e.onFinish(j)
    };
    d.gap = 14;
    d.cache = [];
    d.defaults = {threshold: 2,base: "",ext: "",replace: ""};
    c.fn.preload = function(b) {
        d(this, b);
        return this
    }
})(jQuery);
(function(c) {
    c.fn.typeWatch = function(d) {
        function b(k) {
            if (k.type.toUpperCase() == "TEXT" || k.nodeName.toUpperCase() == "TEXTAREA") {
                var i = {timer: null,text: c(k).val().toUpperCase(),cb: e.callback,el: k,wait: e.wait};
                e.highlight && c(k).focus(function() {
                    this.select()
                });
                c(k).keydown(function(m) {
                    var j = i.wait, o = false;
                    if (m.keyCode == 13 && this.type.toUpperCase() == "TEXT") {
                        j = 1;
                        o = true
                    }
                    clearTimeout(i.timer);
                    i.timer = setTimeout(function() {
                        var g = o, h = c(i.el).val();
                        if (h.length > e.captureLength && h.toUpperCase() != i.text || g && h.length > 
                        e.captureLength) {
                            i.text = h.toUpperCase();
                            i.cb(h)
                        }
                    }, j)
                })
            }
        }
        var e = c.extend({wait: 750,callback: function() {
            },highlight: true,captureLength: 2}, d);
        return this.each(function() {
            b(this)
        })
    }
})(jQuery);
(function() {
    var c;
    c = Array.prototype.indexOf ? function(g, h) {
        return g.indexOf(h)
    } : function(g, h) {
        for (var p = g.length, u = 0; u < p; u++)
            if (u in g && g[u] === h)
                return u;
        return -1
    };
    var d = {}, b = function(g) {
        if (!(this instanceof b))
            return new b(g);
        this.forEach = typeof g === "function" ? i(g) : g.constructor === Array ? m(g) : j(g)
    }, e = function() {
        throw d;
    }, k = function(g) {
        this.message = g;
        this.name = "IterationError"
    };
    k.prototype = Error.prototype;
    var i = function(g) {
        return function(h, p) {
            var u = false, v = 0, t = {yield: function(x) {
                    if (u)
                        throw new k("yield after end of iteration");
                    x = h.call(p, x, v, e);
                    v++;
                    return x
                },yieldMany: function(x) {
                    (x instanceof b ? x : new b(x)).forEach(function(y) {
                        t.yield(y)
                    })
                },stop: e};
            try {
                g.call(t)
            } catch (r) {
                if (r !== d)
                    throw r;
            }finally {
                u = true
            }
        }
    }, m = function(g) {
        return i(function() {
            for (var h = g.length, p = 0; p < h; p++)
                p in g && this.yield(g[p])
        })
    }, j = function(g) {
        return i(function() {
            for (var h in g)
                g.hasOwnProperty(h) && this.yield([h, g[h]])
        })
    };
    b.prototype = {toArray: function() {
            var g = [];
            this.forEach(function(h) {
                g.push(h)
            });
            return g
        },filter: function(g, h) {
            var p = this;
            return new b(function() {
                var u = 
                this;
                p.forEach(function(v) {
                    g.call(h, v) && u.yield(v)
                })
            })
        },take: function(g) {
            var h = this;
            return new b(function() {
                var p = this;
                h.forEach(function(u, v) {
                    v >= g && p.stop();
                    p.yield(u)
                })
            })
        },skip: function(g) {
            var h = this;
            return new b(function() {
                var p = this;
                h.forEach(function(u, v) {
                    v >= g && p.yield(u)
                })
            })
        },map: function(g, h) {
            var p = this;
            return new b(function() {
                var u = this;
                p.forEach(function(v) {
                    u.yield(g.call(h, v))
                })
            })
        },zipWithArray: function(g, h) {
            if (typeof h === "undefined")
                h = function(u, v) {
                    return [u, v]
                };
            var p = this;
            return new b(function() {
                var u = 
                g.length, v = this;
                p.forEach(function(t, r) {
                    r >= u && v.stop();
                    v.yield(h(t, g[r]))
                })
            })
        },reduce: function(g, h) {
            var p, u;
            if (arguments.length < 2)
                p = true;
            else {
                p = false;
                u = h
            }
            this.forEach(function(v) {
                if (p) {
                    u = v;
                    p = false
                } else
                    u = g(u, v)
            });
            return u
        },and: function(g) {
            var h = this;
            return new b(function() {
                this.yieldMany(h);
                this.yieldMany(g)
            })
        },takeWhile: function(g) {
            var h = this;
            return new b(function() {
                var p = this;
                h.forEach(function(u) {
                    g(u) ? p.yield(u) : p.stop()
                })
            })
        },skipWhile: function(g) {
            var h = this;
            return new b(function() {
                var p = this, 
                u = true;
                h.forEach(function(v) {
                    (u = u && g(v)) || p.yield(v)
                })
            })
        },all: function() {
            var g = true;
            this.forEach(function(h, p, u) {
                if (!h) {
                    g = false;
                    u()
                }
            });
            return g
        },any: function() {
            var g = false;
            this.forEach(function(h, p, u) {
                if (h) {
                    g = true;
                    u()
                }
            });
            return g
        },first: function() {
            var g;
            this.forEach(function(h, p, u) {
                g = h;
                u()
            });
            return g
        },groupBy: function(g) {
            var h = this;
            return new b(function() {
                var p = [], u = [];
                h.forEach(function(v) {
                    var t = g(v), r = c(p, t);
                    if (r === -1) {
                        p.push(t);
                        u.push([v])
                    } else
                        u[r].push(v)
                });
                this.yieldMany((new b(p)).zipWithArray(u, 
                function(v, t) {
                    var r = new b(t);
                    r.key = v;
                    return r
                }))
            })
        },evaluated: function() {
            return new b(this.toArray())
        }};
    var o = function(g, h) {
        var p = g;
        if (typeof h === "undefined")
            h = 1;
        return new b(function() {
            for (; ; ) {
                this.yield(p);
                p += h
            }
        })
    };
    window.Generator = b;
    b.BreakIteration = d;
    b.Count = o;
    b.Range = function(g, h) {
        return o(g, 1).take(h)
    };
    b.IterationError = k
})();
function popUp(c, d, b, e) {
    e || $(".popup").remove();
    e = {};
    c = c - $(window).scrollLeft();
    d = d - $(window).scrollTop();
    if (c < $(window).width() / 2)
        e.left = c;
    else
        e.right = $(window).width() - c;
    if (d < $(window).height() / 2)
        e.top = d;
    else
        e.bottom = $(window).height() - d;
    var k = div("popup").css(e).hide();
    $("<div class='btn-close'>X</div>").click(function() {
        $(this).closest(".popup").fadeOut(200, function() {
            $(this).remove()
        })
    }).prependTo(k);
    b && $.browser.msie && b.addClass("tweaked-z-index").data("oldzindex", b.css("z-index")).css({zIndex: 4});
    k.appendTo(b || $("body")).fadeIn(200);
    k.close = function() {
        k.fadeOut(200, function() {
            k.remove()
        })
    };
    return k
}
function popupDismisser() {
    $(document).click(function(c) {
        $(c.target).closest(".popup").length == 0 && $(c.target).closest(".ac_results").length == 0 && $(".popup:not(.mini-help)").fadeOut(200, function() {
            $(this).remove()
        })
    });
    $(document).bind($.browser.opera ? "keypress" : "keydown", function(c) {
        c.which == 27 && $(".popup:not(.mini-help)").fadeOut(200, function() {
            $(this).remove()
        })
    })
}
function fkey(c) {
    c || (c = {});
    if (!c.fkey)
        c.fkey = $("input[name='fkey']").attr("value");
    return c
}
function repNumber(c) {
    if (c < 1E4)
        return c;
    else if (c < 1E5) {
        var d = Math.floor(Math.round(c / 100) / 10);
        c = Math.round((c - d * 1E3) / 100);
        return d + (c > 0 ? "." + c : "") + "k"
    } else
        return Math.round(c / 1E3) + "k"
}
function htmlEncode(c) {
    return document.createElement("div").appendChild(document.createTextNode(c)).parentNode.innerHTML
}
function selectStackSite(c, d, b, e, k, i) {
    var m = popUp(c.pageX, c.pageY, k, i).css({width: "auto",position: "absolute"}), j = $("<p/>").text("Loading available sites...");
    m.append(j);
    c = b ? {} : {sort: "site"};
    b = function(o) {
        if (o && o.length) {
            j.text("select a site:");
            $('<input type="text"/>').appendTo(m).autocomplete(o, {minChars: 0,width: 310,matchContains: "word",autoFill: false,formatItem: function(g) {
                    return '<img src="' + g.SiteIcon + '"/> ' + htmlEncode(g.SiteCaption)
                },formatMatch: function(g) {
                    return htmlEncode(g.SiteCaption)
                },
                formatResult: function(g) {
                    return g.Host
                }}).result(function(g, h) {
                if (h) {
                    m.close();
                    e(h.Host, h.SiteCaption, h.SiteIcon)
                }
            }).focus()
        } else
            j.text("(no sites found)")
    };
    d ? $.post("/users/sites/" + d, c, b) : $.get("/rooms/sites", b)
}
function PERMALINK(c) {
    return "/transcript/message/" + c + "#" + c
}
var moderatorTools = function(c) {
    var d = {}, b = function() {
        $(".quick-unmod").live("click", function() {
            var e = $(this).closest("tr"), k, i;
            if (e.length) {
                k = e.attr("id").replace("fl-", "");
                if (e.prev().hasClass("monologue-row") && (e.next().length == 0 || e.next().hasClass("monologue-row")))
                    i = e.prev()
            } else {
                e = $(this).closest("li");
                k = e.data("flag_id");
                if (e.closest("ul").find("li").length == 1)
                    i = e.closest(".flagged-message")
            }
            confirm("Dismiss this flag?") && $.post("/flags/" + k + "/clear", fkey(), function() {
                e.remove();
                i && i.remove()
            })
        })
    };
    d.initFlagSupport = function(e) {
        $(".reflag,.counterflag,.mehflag").live("click", function(k) {
            k.preventDefault();
            var i = $(this), m = i.closest("tr"), j;
            if (m.length) {
                j = m.prev("tr").attr("id").replace("msg-", "");
                k = i.closest("td")
            } else {
                m = i.closest(".flagged-message");
                j = m.data("message_id");
                k = i.parent()
            }
            i = i.hasClass("reflag") ? "flag" : i.hasClass("counterflag") ? "counter-flag" : "meh-flag";
            if (e && i != "meh-flag")
                if (!confirm("Please note that since you're a moderator, your vote is binding. Continue?"))
                    return;
            var o = $("<img/>").attr("src", 
            IMAGE("progress-dots.gif")).appendTo(k);
            messageActionById(j, i, null, function(g) {
                if (g == "ok")
                    m.fadeOut(function() {
                        $(this).remove()
                    });
                else {
                    g = g || GENERIC_ERROR;
                    c && g && c(g);
                    o.remove()
                }
            }, function(g) {
                o.remove();
                c && c(g)
            })
        });
        BindFlagListPopup("#flag-count, .global-flags:not(.mod-flag)", "/admin/flagged?json=true&show=new", "/admin/flagged?show=all", c);
        BindFlagListPopup("#modflag-count, .global-flags.mod-flag", "/admin/flagged-moderator?json=true", "/admin/flagged-moderator", c);
        e && b()
    };
    return d
};
function div(c) {
    return $("<div/>").addClass(c)
}
function span(c) {
    return $("<span/>").addClass(c)
}
GENERIC_ERROR = "An error occurred performing this action";
function confirmFlag(c) {
    return confirm("Do you want to flag this message as spam, inappropriate, or offensive?" + (c ? " Since you're a moderator, this flag is binding." : ""))
}
function messageActionById(c, d, b, e, k) {
    b || (b = {});
    $.ajax({type: "POST",url: "/messages/" + c + "/" + d,data: fkey(b),success: function(i) {
            if (e)
                e(i);
            else if (i != "ok" && k)
                k(i || GENERIC_ERROR)
        },dataType: "json",error: function(i, m) {
            var j = m == "error" ? i.status == 409 ? i.responseText : GENERIC_ERROR : m;
            if (e)
                e(j);
            else
                k && k(j)
        }})
}
function Notifier(c) {
    function d(m, j) {
        if (typeof m != "string")
            m = m.text();
        if (j == undefined || j)
            c.broadcast({command: "dismiss notification",notification: m});
        var o = $(".notification").not(".closing");
        o.find("p.notification-message").not(".dismissed").each(function() {
            $(this).text() == m && $(this).addClass("dismissed").slideUp(function() {
                $(this).remove()
            })
        });
        o.find("p.notification-message").not(".dismissed").length || o.slideUp(function() {
            $(this).remove()
        })
    }
    if (c == undefined)
        c = {broadcast: function() {
            }};
    var b = null;
    if (window.webkitNotifications) {
        var e = 
        [], k = function(m) {
            m.cancel();
            e = Generator(e).filter(function(j) {
                return j !== m
            }).toArray()
        }, i = function(m, j) {
            e.push(m);
            j && setTimeout(function() {
                k(m)
            }, j);
            m.show()
        };
        b = function(m) {
            if (m && m.text) {
                if (window.webkitNotifications.checkPermission() > 0)
                    return false;
                if (!m.icon || !m.icon.length)
                    m.icon = $('link[rel="apple-touch-icon"]').attr("href");
                if (!m.icon || !m.icon.length)
                    m.icon = $('link[rel="shortcut icon"]').attr("href");
                var j = window.webkitNotifications.createNotification(m.icon, m.title, m.text);
                if (j && j.show) {
                    i(j, 
                    m.timeout);
                    return true
                }
                return false
            } else if (window.webkitNotifications.checkPermission() == 0) {
                m && m.callback && m.callback();
                return true
            } else {
                m && m.callback && window.webkitNotifications.requestPermission(m.callback);
                return false
            }
        };
        b.removeAll = function() {
            Generator(e).forEach(function(m) {
                m.cancel()
            });
            e = []
        }
    }
    return {notify: function(m, j) {
            var o = $(".notification").not(".closing"), g = true;
            if (o.length == 0) {
                g = false;
                o = div("notification").hide().appendTo("body");
                $("<div/>").addClass("notify-close-info").text("click here to remove the notification bar").appendTo(o).click(function() {
                    o.find("p.notification-message").not(".dismissed").each(function() {
                        c.broadcast({command: "dismiss notification",
                            notification: $(this).text()})
                    });
                    o.addClass("closing").slideUp(function() {
                        $(this).remove()
                    })
                })
            } else {
                lastmsg = o.find("p.notification-message:last");
                if (lastmsg.html() == m)
                    return lastmsg
            }
            var h = $("<p/>").addClass("notification-message").html(m).hide().insertBefore(o.find(".notify-close-info"));
            j && j.length > 0 && h.addClass(j);
            if (g)
                h.slideDown();
            else {
                h.show();
                o.slideDown()
            }
            h.find("a").click(function() {
                d($(this).closest(".notification-message"))
            });
            return h
        },dismissSingleNotification: d,desktop: b}
}
function initSearchBox() {
    var c = $("#searchbox");
    c.focus(function() {
        $(this).val() == "search" && $(this).val("");
        c.removeClass("watermark")
    });
    c.blur(function() {
        if ($(this).val() == "") {
            $(this).val("search");
            c.addClass("watermark")
        }
    });
    var d = c.val();
    if (d === "" || d === "search") {
        c.val("search");
        c.addClass("watermark")
    }
}
function BindFlagListPopup(c, d, b, e) {
    function k(m) {
        return function() {
            m.find(".ajax-loader").remove();
            m.closest("li").find("button:contains('delete')").replaceWith("<span>message deleted</span>")
        }
    }
    function i(m, j) {
        return function() {
            if (confirm("Delete this message?")) {
                $("<img class='ajax-loader' src='" + IMAGE("progress-dots.gif") + "' />").appendTo(j);
                messageActionById(m, "delete", null, k(j), e)
            }
        }
    }
    $(c).click(function(m) {
        m.stopPropagation();
        m.preventDefault();
        var j = popUp(m.pageX, m.pageY).css({width: "auto",maxWidth: 600,
            minWidth: 300}).addClass("flags-popup").append("<h3>Loading flags <img class='ajax-loader' src='" + IMAGE("progress-dots.gif") + "' /></h3>");
        $.getJSON(d, function(o) {
            j.find("img.ajax-loader").remove();
            j.find("h3").text(d.indexOf("moderator") != -1 ? "Moderator flags" : "New spam/offensive flags").append(" <a href='" + b + "'>show all</a>");
            var g = $("<ul />").appendTo(j);
            if (o.messages && o.messages.length)
                for (var h = 0; h < o.messages.length; h++) {
                    var p = o.messages[h], u = !p.modflags, v = u ? "as spam/offensive" : "for moderator attention", 
                    t = $("<li class='flagged-message' />").data("message_id", p.message_id).appendTo(g);
                    $("<h4>This message was flagged " + v + " by " + p.flag_count + " user" + (p.flag_count > 1 ? "s" : "") + ":</h4>").appendTo(t);
                    $("<div class='content'/>").appendTo(t).html(p.content);
                    v = p.deleted ? " message is deleted &ndash; <a href='/messages/" + p.message_id + "/history'>history</a>" : "<a href='" + PERMALINK(p.message_id) + "'>permalink</a>";
                    $("<div style='text-align:right'> posted by <a href='/users/" + p.user_id + "'></a> &ndash; " + v + "</span>").appendTo(t).find("a:first").text(p.username);
                    if (u) {
                        p = $("<div />");
                        p.append("<button class='button reflag' title='agree that this message is spam or offensive'>valid</button> ");
                        p.append("<button class='button counterflag' title='this message is neither spam nor offensive'>invalid</button> ");
                        p.append("<button class='button mehflag' title='no strong opinion'>not sure</button> ");
                        p.appendTo(t)
                    } else {
                        u = $("<ul />").appendTo(t);
                        p.deleted || $("<button class='button' title='delete this message'>delete</button>").click(i(p.message_id, u)).appendTo(t.find("div:last").append("<span> &ndash; </span>"));
                        for (t = 0; t < p.modflags.length; t++) {
                            v = p.modflags[t];
                            var r = $('<span title="dismiss this moderator flag" class="quick-unmod btn-delete"> </span>'), x = $("<span class='mod-text' />").text(v.text), y = $("<span> &ndash; <a href='/users/" + v.user_id + "'></a></span>");
                            y.find("a").text(v.username);
                            u.append($("<li />").append(r, x, y).data("flag_id", v.flag_id))
                        }
                    }
                }
            else
                $("<div>There are no flags to display.</div>").appendTo(j)
        })
    })
}
(function(c) {
    function d(b, e) {
        var k = function(i) {
            i = c[b][i] || [];
            return typeof i == "string" ? i.split(/,?\s+/) : i
        }("getter");
        return c.inArray(e, k) != -1
    }
    c.fn.jPlayer = function(b) {
        var e = typeof b == "string", k = Array.prototype.slice.call(arguments, 1);
        if (e && b.substring(0, 1) == "_")
            return this;
        if (e && d("jPlayer", b, k)) {
            var i = c.data(this[0], "jPlayer");
            return i ? i[b].apply(i, k) : undefined
        }
        return this.each(function() {
            var m = c.data(this, "jPlayer");
            !m && !e && c.data(this, "jPlayer", new c.jPlayer(this, b))._init();
            m && e && c.isFunction(m[b]) && 
            m[b].apply(m, k)
        })
    };
    c.jPlayer = function(b, e) {
        this.options = c.extend({}, e);
        this.element = c(b)
    };
    c.jPlayer.getter = "jPlayerOnProgressChange jPlayerOnSoundComplete jPlayerVolume jPlayerReady getData jPlayerController";
    c.jPlayer.defaults = {cssPrefix: "jqjp",swfPath: "js",volume: 80,oggSupport: false,nativeSupport: true,preload: "none",customCssIds: false,graphicsFix: true,errorAlerts: false,warningAlerts: false,position: "absolute",width: "0",height: "0",top: "0",left: "0",quality: "high",bgcolor: "#ffffff"};
    c.jPlayer._config = 
    {version: "1.2.0",swfVersionRequired: "1.2.0",swfVersion: "unknown",jPlayerControllerId: undefined,delayedCommandId: undefined,isWaitingForPlay: false,isFileSet: false};
    c.jPlayer._diag = {isPlaying: false,src: "",loadPercent: 0,playedPercentRelative: 0,playedPercentAbsolute: 0,playedTime: 0,totalTime: 0};
    c.jPlayer._cssId = {play: "jplayer_play",pause: "jplayer_pause",stop: "jplayer_stop",loadBar: "jplayer_load_bar",playBar: "jplayer_play_bar",volumeMin: "jplayer_volume_min",volumeMax: "jplayer_volume_max",volumeBar: "jplayer_volume_bar",
        volumeBarValue: "jplayer_volume_bar_value"};
    c.jPlayer.count = 0;
    c.jPlayer.timeFormat = {showHour: false,showMin: true,showSec: true,padHour: false,padMin: true,padSec: true,sepHour: ":",sepMin: ":",sepSec: ""};
    c.jPlayer.convertTime = function(b) {
        var e = new Date(b), k = e.getUTCHours();
        b = e.getUTCMinutes();
        e = e.getUTCSeconds();
        k = c.jPlayer.timeFormat.padHour && k < 10 ? "0" + k : k;
        b = c.jPlayer.timeFormat.padMin && b < 10 ? "0" + b : b;
        e = c.jPlayer.timeFormat.padSec && e < 10 ? "0" + e : e;
        return (c.jPlayer.timeFormat.showHour ? k + c.jPlayer.timeFormat.sepHour : 
        "") + (c.jPlayer.timeFormat.showMin ? b + c.jPlayer.timeFormat.sepMin : "") + (c.jPlayer.timeFormat.showSec ? e + c.jPlayer.timeFormat.sepSec : "")
    };
    c.jPlayer.prototype = {_init: function() {
            var b = this, e = this.element;
            this.config = c.extend({}, c.jPlayer.defaults, this.options, c.jPlayer._config);
            this.config.diag = c.extend({}, c.jPlayer._diag);
            this.config.cssId = {};
            this.config.cssSelector = {};
            this.config.cssDisplay = {};
            this.config.clickHandler = {};
            this.element.data("jPlayer.config", this.config);
            c.extend(this.config, {id: this.element.attr("id"),
                swf: this.config.swfPath + (this.config.swfPath != "" && this.config.swfPath.slice(-1) != "/" ? "/" : "") + "Jplayer.swf",fid: this.config.cssPrefix + "_flash_" + c.jPlayer.count,aid: this.config.cssPrefix + "_audio_" + c.jPlayer.count,hid: this.config.cssPrefix + "_force_" + c.jPlayer.count,i: c.jPlayer.count,volume: this._limitValue(this.config.volume, 0, 100),autobuffer: this.config.preload != "none"});
            c.jPlayer.count++;
            if (this.config.ready != undefined)
                if (c.isFunction(this.config.ready))
                    this.jPlayerReadyCustom = this.config.ready;
                else
                    this._warning("Constructor's ready option is not a function.");
            this.config.audio = document.createElement("audio");
            this.config.audio.id = this.config.aid;
            c.extend(this.config, {canPlayMP3: !!(this.config.audio.canPlayType ? "" != this.config.audio.canPlayType("audio/mpeg") && "no" != this.config.audio.canPlayType("audio/mpeg") : false),canPlayOGG: !!(this.config.audio.canPlayType ? "" != this.config.audio.canPlayType("audio/ogg") && "no" != this.config.audio.canPlayType("audio/ogg") : false),aSel: c("#" + this.config.aid)});
            c.extend(this.config, {html5: !!(this.config.oggSupport ? this.config.canPlayOGG ? 
                true : this.config.canPlayMP3 : this.config.canPlayMP3)});
            c.extend(this.config, {usingFlash: !(this.config.html5 && this.config.nativeSupport),usingMP3: !(this.config.oggSupport && this.config.canPlayOGG && this.config.nativeSupport)});
            var k = {setButtons: function(o, g) {
                    b.config.diag.isPlaying = g;
                    if (b.config.cssId.play != undefined && b.config.cssId.pause != undefined)
                        if (g) {
                            b.config.cssSelector.play.css("display", "none");
                            b.config.cssSelector.pause.css("display", b.config.cssDisplay.pause)
                        } else {
                            b.config.cssSelector.play.css("display", 
                            b.config.cssDisplay.play);
                            b.config.cssSelector.pause.css("display", "none")
                        }
                    if (g)
                        b.config.isWaitingForPlay = false
                }}, i = {setFile: function(o, g) {
                    try {
                        b._getMovie().fl_setFile_mp3(g);
                        b.config.autobuffer && e.trigger("jPlayer.load");
                        b.config.diag.src = g;
                        b.config.isFileSet = true;
                        e.trigger("jPlayer.setButtons", false)
                    } catch (h) {
                        b._flashError(h)
                    }
                },clearFile: function() {
                    try {
                        e.trigger("jPlayer.setButtons", false);
                        b._getMovie().fl_clearFile_mp3();
                        b.config.diag.src = "";
                        b.config.isFileSet = false
                    } catch (o) {
                        b._flashError(o)
                    }
                },
                load: function() {
                    try {
                        b._getMovie().fl_load_mp3()
                    } catch (o) {
                        b._flashError(o)
                    }
                },play: function() {
                    try {
                        b._getMovie().fl_play_mp3() && e.trigger("jPlayer.setButtons", true)
                    } catch (o) {
                        b._flashError(o)
                    }
                },pause: function() {
                    try {
                        b._getMovie().fl_pause_mp3() && e.trigger("jPlayer.setButtons", false)
                    } catch (o) {
                        b._flashError(o)
                    }
                },stop: function() {
                    try {
                        b._getMovie().fl_stop_mp3() && e.trigger("jPlayer.setButtons", false)
                    } catch (o) {
                        b._flashError(o)
                    }
                },playHead: function(o, g) {
                    try {
                        b._getMovie().fl_play_head_mp3(g) && e.trigger("jPlayer.setButtons", 
                        true)
                    } catch (h) {
                        b._flashError(h)
                    }
                },playHeadTime: function(o, g) {
                    try {
                        b._getMovie().fl_play_head_time_mp3(g) && e.trigger("jPlayer.setButtons", true)
                    } catch (h) {
                        b._flashError(h)
                    }
                },volume: function(o, g) {
                    b.config.volume = g;
                    try {
                        b._getMovie().fl_volume_mp3(g)
                    } catch (h) {
                        b._flashError(h)
                    }
                }}, m = {setFile: function(o, g, h) {
                    b.config.diag.src = b.config.usingMP3 ? g : h;
                    b.config.isFileSet && !b.config.isWaitingForPlay && e.trigger("jPlayer.pause");
                    b.config.audio.autobuffer = b.config.autobuffer;
                    b.config.audio.preload = b.config.preload;
                    if (b.config.autobuffer) {
                        b.config.audio.src = b.config.diag.src;
                        b.config.audio.load()
                    } else
                        b.config.isWaitingForPlay = true;
                    b.config.isFileSet = true;
                    b.jPlayerOnProgressChange(0, 0, 0, 0, 0);
                    clearInterval(b.config.jPlayerControllerId);
                    if (b.config.autobuffer)
                        b.config.jPlayerControllerId = window.setInterval(function() {
                            b.jPlayerController(false)
                        }, 100);
                    clearInterval(b.config.delayedCommandId)
                },clearFile: function() {
                    b.setFile("", "");
                    b.config.isWaitingForPlay = false;
                    b.config.isFileSet = false
                },load: function() {
                    if (b.config.isFileSet)
                        if (b.config.isWaitingForPlay) {
                            b.config.audio.autobuffer = 
                            true;
                            b.config.audio.preload = "auto";
                            b.config.audio.src = b.config.diag.src;
                            b.config.audio.load();
                            b.config.isWaitingForPlay = false;
                            clearInterval(b.config.jPlayerControllerId);
                            b.config.jPlayerControllerId = window.setInterval(function() {
                                b.jPlayerController(false)
                            }, 100)
                        }
                },play: function() {
                    if (b.config.isFileSet) {
                        if (b.config.isWaitingForPlay) {
                            b.config.audio.src = b.config.diag.src;
                            b.config.audio.load()
                        }
                        b.config.audio.play();
                        e.trigger("jPlayer.setButtons", true);
                        clearInterval(b.config.jPlayerControllerId);
                        b.config.jPlayerControllerId = 
                        window.setInterval(function() {
                            b.jPlayerController(false)
                        }, 100);
                        clearInterval(b.config.delayedCommandId)
                    }
                },pause: function() {
                    if (b.config.isFileSet) {
                        b.config.audio.pause();
                        e.trigger("jPlayer.setButtons", false);
                        clearInterval(b.config.delayedCommandId)
                    }
                },stop: function() {
                    if (b.config.isFileSet)
                        try {
                            e.trigger("jPlayer.pause");
                            b.config.audio.currentTime = 0;
                            clearInterval(b.config.jPlayerControllerId);
                            b.config.jPlayerControllerId = window.setInterval(function() {
                                b.jPlayerController(true)
                            }, 100)
                        } catch (o) {
                            clearInterval(b.config.delayedCommandId);
                            b.config.delayedCommandId = window.setTimeout(function() {
                                b.stop()
                            }, 100)
                        }
                },playHead: function(o, g) {
                    if (b.config.isFileSet)
                        try {
                            e.trigger("jPlayer.load");
                            if (typeof b.config.audio.buffered == "object" && b.config.audio.buffered.length > 0)
                                b.config.audio.currentTime = g * b.config.audio.buffered.end(b.config.audio.buffered.length - 1) / 100;
                            else if (b.config.audio.duration > 0 && !isNaN(b.config.audio.duration))
                                b.config.audio.currentTime = g * b.config.audio.duration / 100;
                            else
                                throw "e";
                            e.trigger("jPlayer.play")
                        } catch (h) {
                            e.trigger("jPlayer.play");
                            e.trigger("jPlayer.pause");
                            b.config.delayedCommandId = window.setTimeout(function() {
                                b.playHead(g)
                            }, 100)
                        }
                },playHeadTime: function(o, g) {
                    if (b.config.isFileSet)
                        try {
                            e.trigger("jPlayer.load");
                            b.config.audio.currentTime = g / 1E3;
                            e.trigger("jPlayer.play")
                        } catch (h) {
                            e.trigger("jPlayer.play");
                            e.trigger("jPlayer.pause");
                            b.config.delayedCommandId = window.setTimeout(function() {
                                b.playHeadTime(g)
                            }, 100)
                        }
                },volume: function(o, g) {
                    b.config.volume = g;
                    b.config.audio.volume = g / 100;
                    b.jPlayerVolume(g)
                }};
            this.config.usingFlash ? c.extend(k, 
            i) : c.extend(k, m);
            for (var j in k) {
                i = "jPlayer." + j;
                this.element.unbind(i);
                this.element.bind(i, k[j])
            }
            if (this.config.usingFlash)
                if (this._checkForFlash(8))
                    if (c.browser.msie) {
                        j = '<object id="' + this.config.fid + '"';
                        j += ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';
                        j += ' codebase="' + document.URL.substring(0, document.URL.indexOf(":")) + '://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"';
                        j += ' type="application/x-shockwave-flash"';
                        j += ' width="' + this.config.width + '" height="' + this.config.height + 
                        '">';
                        j += "</object>";
                        k = [];
                        k[0] = '<param name="movie" value="' + this.config.swf + '" />';
                        k[1] = '<param name="quality" value="high" />';
                        k[2] = '<param name="FlashVars" value="id=' + escape(this.config.id) + "&fid=" + escape(this.config.fid) + "&vol=" + this.config.volume + '" />';
                        k[3] = '<param name="allowScriptAccess" value="always" />';
                        k[4] = '<param name="bgcolor" value="' + this.config.bgcolor + '" />';
                        j = document.createElement(j);
                        for (i = 0; i < k.length; i++)
                            j.appendChild(document.createElement(k[i]));
                        this.element.html(j)
                    } else {
                        k = 
                        '<embed name="' + this.config.fid + '" id="' + this.config.fid + '" src="' + this.config.swf + '"';
                        k += ' width="' + this.config.width + '" height="' + this.config.height + '" bgcolor="' + this.config.bgcolor + '"';
                        k += ' quality="high" FlashVars="id=' + escape(this.config.id) + "&fid=" + escape(this.config.fid) + "&vol=" + this.config.volume + '"';
                        k += ' allowScriptAccess="always"';
                        k += ' type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
                        this.element.html(k)
                    }
                else
                    this.element.html("<p>Flash 8 or above is not installed. <a href='http://get.adobe.com/flashplayer'>Get Flash!</a></p>");
            else {
                this.config.audio.autobuffer = this.config.autobuffer;
                this.config.audio.preload = this.config.preload;
                this.config.audio.addEventListener("canplay", function() {
                    var o = 0.1 * Math.random();
                    b.config.audio.volume = (b.config.volume + (b.config.volume < 50 ? o : -o)) / 100
                }, false);
                this.config.audio.addEventListener("ended", function() {
                    clearInterval(b.config.jPlayerControllerId);
                    b.jPlayerOnSoundComplete()
                }, false);
                this.element.append(this.config.audio)
            }
            this.element.css({position: this.config.position,top: this.config.top,
                left: this.config.left});
            if (this.config.graphicsFix) {
                this.element.append('<div id="' + this.config.hid + '"></div>');
                c.extend(this.config, {hSel: c("#" + this.config.hid)});
                this.config.hSel.css({"text-indent": "-9999px"})
            }
            this.config.customCssIds || c.each(c.jPlayer._cssId, function(o, g) {
                b.cssId(o, g)
            });
            if (!this.config.usingFlash) {
                this.element.css({left: "-9999px"});
                window.setTimeout(function() {
                    b.volume(b.config.volume);
                    b.jPlayerReady()
                }, 100)
            }
        },jPlayerReady: function(b) {
            if (this.config.usingFlash) {
                this.config.swfVersion = 
                b;
                this.config.swfVersionRequired != this.config.swfVersion && this._error("jPlayer's JavaScript / SWF version mismatch!\n\nJavaScript requires SWF : " + this.config.swfVersionRequired + "\nThe Jplayer.swf used is : " + this.config.swfVersion)
            } else
                this.config.swfVersion = "n/a";
            this.jPlayerReadyCustom()
        },jPlayerReadyCustom: function() {
        },setFile: function(b, e) {
            this.element.trigger("jPlayer.setFile", [b, e])
        },clearFile: function() {
            this.element.trigger("jPlayer.clearFile")
        },load: function() {
            this.element.trigger("jPlayer.load")
        },
        play: function() {
            this.element.trigger("jPlayer.play")
        },pause: function() {
            this.element.trigger("jPlayer.pause")
        },stop: function() {
            this.element.trigger("jPlayer.stop")
        },playHead: function(b) {
            this.element.trigger("jPlayer.playHead", [b])
        },playHeadTime: function(b) {
            this.element.trigger("jPlayer.playHeadTime", [b])
        },volume: function(b) {
            b = this._limitValue(b, 0, 100);
            this.element.trigger("jPlayer.volume", [b])
        },cssId: function(b, e) {
            var k = this;
            if (typeof e == "string")
                if (c.jPlayer._cssId[b]) {
                    this.config.cssId[b] != undefined && 
                    this.config.cssSelector[b].unbind("click", this.config.clickHandler[b]);
                    this.config.cssId[b] = e;
                    this.config.cssSelector[b] = c("#" + e);
                    this.config.clickHandler[b] = function(m) {
                        k[b](m);
                        c(this).blur();
                        return false
                    };
                    this.config.cssSelector[b].click(this.config.clickHandler[b]);
                    var i = this.config.cssSelector[b].css("display");
                    if (b == "play")
                        this.config.cssDisplay.pause = i;
                    if (!(b == "pause" && i == "none")) {
                        this.config.cssDisplay[b] = i;
                        b == "pause" && this.config.cssSelector[b].css("display", "none")
                    }
                } else
                    this._warning("Unknown/Illegal function in cssId\n\njPlayer('cssId', '" + 
                    b + "', '" + e + "')");
            else
                this._warning("cssId CSS Id must be a string\n\njPlayer('cssId', '" + b + "', " + e + ")")
        },loadBar: function(b) {
            if (this.config.cssId.loadBar != undefined) {
                var e = this.config.cssSelector.loadBar.offset();
                b = b.pageX - e.left;
                e = this.config.cssSelector.loadBar.width();
                this.playHead(100 * b / e)
            }
        },playBar: function(b) {
            this.loadBar(b)
        },onProgressChange: function(b) {
            if (c.isFunction(b))
                this.onProgressChangeCustom = b;
            else
                this._warning("onProgressChange parameter is not a function.")
        },onProgressChangeCustom: function() {
        },
        jPlayerOnProgressChange: function(b, e, k, i, m) {
            this.config.diag.loadPercent = b;
            this.config.diag.playedPercentRelative = e;
            this.config.diag.playedPercentAbsolute = k;
            this.config.diag.playedTime = i;
            this.config.diag.totalTime = m;
            this.config.cssId.loadBar != undefined && this.config.cssSelector.loadBar.width(b + "%");
            this.config.cssId.playBar != undefined && this.config.cssSelector.playBar.width(e + "%");
            this.onProgressChangeCustom(b, e, k, i, m);
            this._forceUpdate()
        },jPlayerController: function(b) {
            var e = 0, k = 0, i = 0, m = 0, j = 0;
            if (this.config.audio.readyState >= 
            1) {
                e = this.config.audio.currentTime * 1E3;
                k = this.config.audio.duration * 1E3;
                k = isNaN(k) ? 0 : k;
                i = k > 0 ? 100 * e / k : 0;
                if (typeof this.config.audio.buffered == "object" && this.config.audio.buffered.length > 0) {
                    m = 100 * this.config.audio.buffered.end(this.config.audio.buffered.length - 1) / this.config.audio.duration;
                    j = 100 * this.config.audio.currentTime / this.config.audio.buffered.end(this.config.audio.buffered.length - 1)
                } else {
                    m = 100;
                    j = i
                }
            }
            !this.config.diag.isPlaying && m >= 100 && clearInterval(this.config.jPlayerControllerId);
            b ? this.jPlayerOnProgressChange(m, 
            0, 0, 0, k) : this.jPlayerOnProgressChange(m, j, i, e, k)
        },volumeMin: function() {
            this.volume(0)
        },volumeMax: function() {
            this.volume(100)
        },volumeBar: function(b) {
            if (this.config.cssId.volumeBar != undefined) {
                var e = this.config.cssSelector.volumeBar.offset();
                b = b.pageX - e.left;
                e = this.config.cssSelector.volumeBar.width();
                this.volume(100 * b / e)
            }
        },volumeBarValue: function(b) {
            this.volumeBar(b)
        },jPlayerVolume: function(b) {
            if (this.config.cssId.volumeBarValue != null) {
                this.config.cssSelector.volumeBarValue.width(b + "%");
                this._forceUpdate()
            }
        },
        onSoundComplete: function(b) {
            if (c.isFunction(b))
                this.onSoundCompleteCustom = b;
            else
                this._warning("onSoundComplete parameter is not a function.")
        },onSoundCompleteCustom: function() {
        },jPlayerOnSoundComplete: function() {
            this.element.trigger("jPlayer.setButtons", false);
            this.onSoundCompleteCustom()
        },getData: function(b) {
            for (var e = b.split("."), k = this.config, i = 0; i < e.length; i++)
                if (k[e[i]] != undefined)
                    k = k[e[i]];
                else {
                    this._warning("Undefined data requested.\n\njPlayer('getData', '" + b + "')");
                    return
                }
            return k
        },_getMovie: function() {
            return document[this.config.fid]
        },
        _checkForFlash: function(b) {
            var e = false;
            if (window.ActiveXObject)
                try {
                    new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + b);
                    e = true
                } catch (k) {
                }
            else if (navigator.plugins && navigator.mimeTypes.length > 0)
                if (navigator.plugins["Shockwave Flash"])
                    if (navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/, "$1") >= b)
                        e = true;
            return e
        },_forceUpdate: function() {
            this.config.graphicsFix && this.config.hSel.text("" + Math.random())
        },_limitValue: function(b, e, k) {
            return b < e ? e : b > k ? k : b
        },_flashError: function(b) {
            this._error("Problem with Flash component.\n\nCheck the swfPath points at the Jplayer.swf path.\n\nswfPath = " + 
            this.config.swfPath + "\nurl: " + this.config.swf + "\n\nError: " + b.message)
        },_error: function(b) {
            this.config.errorAlerts && this._alert("Error!\n\n" + b)
        },_warning: function(b) {
            this.config.warningAlerts && this._alert("Warning!\n\n" + b)
        },_alert: function(b) {
            alert("jPlayer " + this.config.version + " : id='" + this.config.id + "' : " + b)
        }}
})(jQuery);
(function(c, d, b, e) {
    c.fn.caret = function(k, i) {
        var m, j, o = this[0], g = c.browser.msie;
        if (typeof k === "object" && typeof k.start === "number" && typeof k.end === "number") {
            m = k.start;
            j = k.end
        } else if (typeof k === "number" && typeof i === "number") {
            m = k;
            j = i
        } else if (typeof k === "string")
            if ((m = o.value.indexOf(k)) > -1)
                j = m + k[d];
            else
                m = null;
        else if (Object.prototype.toString.call(k) === "[object RegExp]") {
            k = k.exec(o.value);
            if (k != null) {
                m = k.index;
                j = m + k[0][d]
            }
        }
        if (typeof m != "undefined") {
            if (g) {
                g = this[0].createTextRange();
                g.collapse(true);
                g.moveStart("character", m);
                g.moveEnd("character", j - m);
                g.select()
            } else {
                this[0].selectionStart = m;
                this[0].selectionEnd = j
            }
            this[0].focus();
            return this
        } else {
            if (g) {
                j = document.selection;
                if (this[0].tagName.toLowerCase() != "textarea") {
                    g = this.val();
                    m = j[b]()[e]();
                    m.moveEnd("character", g[d]);
                    var h = m.text == "" ? g[d] : g.lastIndexOf(m.text);
                    m = j[b]()[e]();
                    m.moveStart("character", -g[d]);
                    var p = m.text[d]
                } else {
                    m = j[b]();
                    j = m[e]();
                    j.moveToElementText(this[0]);
                    j.setEndPoint("EndToEnd", m);
                    h = j.text[d] - m.text[d];
                    p = h + m.text[d]
                }
            } else {
                h = 
                o.selectionStart;
                p = o.selectionEnd
            }
            m = o.value.substring(h, p);
            return {start: h,end: p,text: m,replace: function(u) {
                    return o.value.substring(0, h) + u + o.value.substring(p, o.value[d])
                }}
        }
    }
})(jQuery, "length", "createRange", "duplicate");
var markdownMini = function() {
    var c = /(^|[\s,('"])(?:\*\*|__)(?=\S)(.+?\S)(?:\*\*|__)(?=[\s,?!.;:)]|$)/g, d = /(^|[\s,('">])(?:\*|_)(?=\S)(.+?\S)(?:\*|_)(?=[\s,?!.;:)<]|$)/g, b = /(^|[\s,('">])---(?=\S)(.+?\S)---(?=[\s,?!.;:)<]|$)/g, e = /(^|\W)(`+)(.*?[^`])\2(?!`)/g, k = /(^|\s)\[([^\]]+)\]\(((?:https?|ftp):\/\/[^)\s]+?)(?:\s(?:"|&quot;)([^"]+?)(?:"|&quot;))?\)/g;
    return function(i) {
        i = i.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (/[\n\r]/.test(i))
            return !/^ {0,3}[^ ]/m.test(i) ? "<pre>" + i.replace(/^    /mg, 
            "") + "</pre>" : "<div>" + i.replace(/\r\n?|\n/g, "<br/>") + "</div>";
        i = i.replace(/\\`/g, "&#96;");
        i = i.replace(/\\\*/g, "&#42;");
        i = i.replace(/\\_/g, "&#95;");
        i = i.replace(/\\\[/g, "&#91;");
        i = i.replace(/\\\]/g, "&#93;");
        i = i.replace(/\\\(/g, "&#40;");
        i = i.replace(/\\\)/g, "&#41;");
        i = i.replace(e, "$1<code>$3</code>");
        i = i.replace(c, "$1<b>$2</b>");
        i = i.replace(d, "$1<i>$2</i>");
        i = i.replace(b, "$1<strike>$2</strike>");
        return i = i.replace(k, '$1<a href="$3" title="$4">$2</a>')
    }
}(), autoLink = function() {
    var c = /([^">;]|^)\b((?:https?|ftp):\/\/[A-Za-z0-9][-A-Za-z0-9+&@#\/%?=~_|\[\]\(\)!:,.;]*[-A-Za-z0-9+&@#\/%=~_|\[\]])/gi, 
    d = /^(https?|ftp):\/\/(www\.)?|(\/$)/gi, b = RegExp("&zwnj;&#8203;", "g"), e = RegExp($("<span>&zwnj;&#8203;</span>").text(), "g");
    return function(k) {
        return k.replace(e, "&zwnj;&#8203;").replace(c, function(i, m, j) {
            i = m + '<a href="' + j.replace(b, "") + '">';
            a: {
                j = j;
                j = j.replace(d, "");
                if (j.length < 30)
                    j = j;
                else {
                    for (m = j.length - 1; m > 0; m--)
                        if (j[m] == "/" && m < 30) {
                            j = j.substring(0, m) + "/&hellip;";
                            break a
                        }
                    j = j.substring(0, 29) + "&hellip;"
                }
            }
            return i + j + "</a>"
        })
    }
}(), diacSubstitutions = {"\u00e0\u00e5\u00e1\u00e2\u00e4\u00e3\u00e5\u0105": "a",
    "\u00e8\u00e9\u00ea\u00eb\u0119": "e","\u00ec\u00ed\u00ee\u00ef\u0131": "i","\u00f2\u00f3\u00f4\u00f5\u00f6\u00f8\u0151": "o","\u00f9\u00fa\u00fb\u00fc": "u","\u00e7\u0107\u010d": "c","\u017c\u017a\u017e": "z","\u015b\u015f\u0161": "s","\u00f1\u0144": "n","\u00fd\u0178": "y","\u0142": "l","\u0111": "d","\u00df": "ss","\u011f": "g","\u00de": "th"}, diacritics = "";
(function() {
    for (var c in diacSubstitutions)
        diacritics += c
})();
function noDiac(c) {
    for (var d in diacSubstitutions)
        c = c.replace(RegExp("[" + d + "]", "g"), diacSubstitutions[d]);
    return c
}
function urlFriendly(c) {
    c = noDiac(c.toLowerCase());
    c = c.replace(/[\s,.\/\\_-]+/g, "-");
    c = c.replace(/[^0-9a-z-]/g, "");
    return c = c.replace(/^-/, "").replace(/--+/g, "-").substring(0, 80).replace(/-$/, "")
}
window.stringify = window.JSON ? JSON.stringify : function(c) {
    if (typeof c == "string")
        return '"' + c.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"';
    else if (typeof c == "number")
        return c.toString();
    else if (c == null)
        return "null";
    else if (c == undefined)
        return "undefined";
    else if (c.length != undefined)
        return "[" + $.map(c, stringify).join(",") + "]";
    var d = "{";
    for (var b in c)
        d = d + stringify(b) + ":" + stringify(c[b]) + ",";
    if (d.length > 1)
        d = d.substr(0, d.length - 1);
    return d + "}"
};
function InterClientCommunicator() {
    function c(o) {
        var g = localStorage.getItem(o);
        if (g) {
            var h;
            try {
                h = $.parseJSON(g)
            } catch (p) {
                h = undefined;
                localStorage.clear(o)
            }
            return h
        }
    }
    function d(o, g) {
        var h;
        if (g)
            g.new_data = false;
        h = o.originalEvent ? o.originalEvent : o;
        if (!(h.key && h.key != "chat:broadcastQueue"))
            if (queueObj = c("chat:broadcastQueue")) {
                var p = {}, u = [], v = false;
                $.each(queueObj, function(t, r) {
                    var x = r.sender + ":" + r.time;
                    p[x] = true;
                    if (!k[x]) {
                        v = true;
                        r.sender != b && u.push(r)
                    }
                });
                if (g)
                    g.new_data = v;
                k = p;
                $.each(u, function(t, r) {
                    $.each(e, 
                    function(x, y) {
                        y(r)
                    })
                })
            }
    }
    var b = "chat:" + (new Date).getTime() + ":" + Math.round(Math.random() * 1E5), e = [], k = {}, i = false;
    try {
        window.localStorage || (i = true)
    } catch (m) {
        i = true
    }
    if (i)
        return {broadcast: function() {
            },receive: function() {
            },id: b};
    $.each(c("chat:broadcastQueue") || [], function(o, g) {
        k[g.sender + ":" + g.time] = true
    });
    if ($.browser.msie) {
        var j = function() {
            var o = {};
            d({}, o);
            return o.new_data
        };
        document.attachEvent("onstorage", function() {
            window.setTimeout(function() {
                j() || window.setTimeout(j, 100)
            }, 1)
        })
    } else
        $.browser.opera ? 
        window.addEventListener("storage", d, true) : $(window).bind("storage", d);
    return {broadcast: function(o) {
            o = {sender: b,time: (new Date).getTime(),content: o};
            var g = c("chat:broadcastQueue") || [];
            g.push(o);
            if (g.length > 20)
                g = g.slice(g.length - 20, g.length);
            localStorage.setItem("chat:broadcastQueue", stringify(g))
        },receive: function(o) {
            e.push(o)
        },id: b}
}
function FeedTicker() {
    function c() {
        k = null;
        b.find(".ticker-item").slice(e).slideUp(function() {
            $(this).remove()
        });
        d.slideDown();
        b.find(".ticker-item").slice(0, e).slideDown()
    }
    var d = $("#feed-ticker"), b = $("#ticker-items"), e = 8, k;
    $("#dismiss-ticker").click(function() {
        b.find(".ticker-item").addClass("dismissed");
        d.slideUp(function() {
            $(this).find(".ticker-item.dismissed").remove()
        })
    });
    return {add: function(i) {
            $(i).hide().prependTo(b);
            k && window.clearTimeout(k);
            k = window.setTimeout(c, 1E3)
        }}
}
function Container() {
    var c = $([]);
    return {put: function(d) {
            c = c.add(d)
        },withAll: function(d) {
            c.each(d)
        },withAllButTakeYourTime: function(d) {
            var b = c.length;
            c.each(function(e, k) {
                window.setTimeout(function() {
                    d.call(k)
                }, (b - e) * 100)
            })
        },pull: function(d) {
            c = c.not(d)
        },spill: function() {
            c = $([])
        }}
}
var users = {}, unknown_users = [], unknown_users_roomId;
unknown_users.setRoomId = function(c) {
    unknown_users_roomId = c
};
unknown_users.uniquePush = function(c) {
    $.inArray(c, this) < 0 && this.push(c)
};
function userContainer(c) {
    var d = $("<div/>").addClass("user-container user-" + c);
    c && d.data("user", c).putInto(containers.needyUsers);
    return d
}
function gravatarUrl(c, d, b) {
    if (d.charAt(0) == "!")
        return d.substr(1);
    return "http://www.gravatar.com/avatar/" + d + "?s=" + b.toString() + "&d=identicon&r=PG"
}
function lineBreakBeforeHyphen(c) {
    return $("<span />").text(c).html().replace(/([^\s-])-([^\s-])/g, "$1&#8203;&#8209;$2")
}
function lineBreakAfterHyphen(c) {
    return $("<span />").text(c).html().replace(/([^\s-])-([^\s-])/g, "$1&#8208;$2")
}
function monologueSignature(c) {
    var d = $("<a href='/users/" + c + "' />").addClass("signature user-" + c), b = $("<div/>").addClass("username").hide(), e = $("<div><img width='32' height='32'/><div>").addClass("avatar avatar-32 clear-both").hide(), k = $("<div/>").addClass("flair").hide(), i = $("<div/>").addClass("tiny-signature"), m = $("<div><img width='16' height='16'/></div>").addClass("avatar avatar-16"), j = $("<div/>").addClass("username");
    i.append(m, j);
    d.append(i, e, b, k);
    if (c == 0) {
        d.find("img").attr("src", IMAGE("anon.png"));
        return d
    }
    if (i = users[c]) {
        b.html(lineBreakAfterHyphen(i.name));
        d.attr("href", "/users/" + c + "/" + urlFriendly(i.name));
        j.html(lineBreakBeforeHyphen(i.name));
        if (i.is_moderator) {
            b.addClass("moderator");
            j.addClass("moderator")
        } else if (i.is_owner) {
            b.addClass("owner");
            j.addClass("owner")
        }
        m.find("img").attr("src", gravatarUrl(c, i.email_hash, 16));
        e.find("img").attr("src", gravatarUrl(c, i.email_hash, 32));
        c > 0 && k.text(repNumber(i.reputation)).attr("title", i.reputation)
    } else if (c) {
        unknown_users.uniquePush(c);
        b.add(j).html("<i>loading&hellip;</i>")
    }
    return d
}
function updateUserContainer(c, d, b) {
    if (d == undefined)
        d = true;
    var e = c.data("user");
    if (!(!e || e.toString().length == 0)) {
        var k = users[e];
        if (k) {
            d = c.find(".username");
            d.each(function() {
                var i = $(this);
                i.closest(".tiny-signature").length != 0 ? i.html(lineBreakBeforeHyphen(k.name)) : i.html(lineBreakAfterHyphen(k.name))
            });
            if (k.is_moderator)
                d.addClass("moderator");
            else
                k.is_owner && d.addClass("owner");
            c.find(".userlink,a.signature").attr("href", "/users/" + k.id + "/" + urlFriendly(k.name));
            c.find(".avatar > img").each(function() {
                $(this).attr("src", 
                gravatarUrl(e, k.email_hash, $(this).attr("width"))).attr("alt", k.name).attr("title", k.name)
            });
            e > 0 && c.find(".flair").text(repNumber(k.reputation)).attr("title", k.reputation);
            b && b()
        } else {
            unknown_users.uniquePush(e);
            d && retrieveUserInfos(function() {
                updateUserContainer(c, false, b)
            })
        }
    }
}
function updateNeedyUserContainers() {
    var c = containers.needyUsers;
    c.withAll(function() {
        updateUserContainer($(this), false)
    });
    retrieveUserInfos(function() {
        c.withAll(function() {
            updateUserContainer($(this), false)
        });
        c.spill()
    })
}
function update_user(c) {
    if (typeof c.last_post == "undefined") {
        var d = $("#chat div.monologue.user-" + c.id + ":last .message:last");
        c.last_post = d.info("time") || 0
    }
    users[c.id] = c
}
function usersByActivity() {
    result = [];
    for (var c in users)
        users.hasOwnProperty(c) && result.push(users[c]);
    result.sort(function(d, b) {
        return b.last_post - d.last_post
    });
    return result
}
function retrieveUserInfos(c) {
    if (unknown_users.length == 0)
        c && c();
    else {
        for (var d = []; unknown_users.length > 0; )
            d.push(unknown_users.pop());
        $.post("/user/info", {ids: d.join(","),roomId: unknown_users_roomId}, function(b) {
            $.each(b.users, function(e, k) {
                update_user(k)
            });
            c && c()
        }, "json")
    }
}
function normalizeUserName(c) {
    return noDiac(c.toLowerCase()).replace(/[\W_]/g, "")
}
$.fn.fastHide = function(c) {
    c ? this.slideUp(c) : this.css("display", "none")
};
$.fn.fastShow = function(c) {
    c ? this.slideDown(c) : this.css("display", "block")
};
$.fn.updateCollapsible = function(c) {
    var d = this.find("li");
    c = c || d.length > 32 ? 0 : 500;
    var b = this.closest(".sidebar-widget"), e = b.find(".more"), k = this.data("show_max"), i = !!this.data("autohide");
    if (k == undefined)
        k = 5;
    var m = d.slice(0, k).add(d.filter(".always-visible"));
    if (d.length > k) {
        if (this.hasClass("expanded"))
            d.fastShow(c);
        else {
            m.fastShow(c);
            d.filter(".always-visible").fastShow(c);
            d.not(m).fastHide(c)
        }
        this.hasClass("expanded") ? e.text("only show top " + m.length) : e.text("show " + (d.length - m.length) + " more");
        e.show()
    } else {
        e.hide();
        d.fastShow(c)
    }
    if (i)
        d.length > 0 ? b.fastShow(c) : b.fastHide(c)
};
function Sidebar(c, d, b, e, k, i, m, j, o) {
    function g() {
        $("#my-rooms > li").each(function() {
            var q = $(this).find(".room-info > .last-message > .time").html();
            q = secondsSince(q);
            q = Math.min(6, Math.max(0, Math.floor(Math.log(q / 15))));
            oldClasses = $(this).attr("class").split(" ");
            newClasses = ["activity-" + q];
            for (var w in oldClasses) {
                q = oldClasses[w];
                q != "" && q.substr(0, 9) != "activity-" && newClasses.push(q)
            }
            $(this).attr("class", newClasses.join(" "));
            $.browser.msie && $(this).find("> a").css("color", $(this).css("color"))
        })
    }
    function h() {
        $("#my-rooms .room-info").each(function() {
            var q = $(this).find(".last-message");
            q.find(".text").text() == "" ? q.hide() : q.show()
        })
    }
    function p(q, w, A, H) {
        if (!w || confirm(w)) {
            var E = $(q).closest("li");
            E.attr("id").replace("summary_", "");
            d(E.attr("id").replace("summary_", ""), A, null, function(N) {
                if (N != "ok") {
                    pa(N || GENERIC_ERROR);
                    H && H()
                } else
                    w && w.length > 0 && E.slideUp(function() {
                        $(this).remove()
                    })
            }, pa)
        }
    }
    function u() {
        p(this, "Delete this post?", "delete")
    }
    function v() {
        p(this, "Remove this flags against this post?", 
        "unflag")
    }
    function t() {
        if (confirmFlag(i && i())) {
            var q = $(this), w = function() {
                q.toggleClass("user-flag")
            };
            p(this, null, "flag", w);
            w()
        }
    }
    function r() {
        p(this, "Remove the pins against this post?", "unowner-star")
    }
    function x() {
        p(this, "Remove the stars against this post?", "unstar")
    }
    function y() {
        p(this, null, "owner-star")
    }
    function C() {
        var q = $(this), w = function() {
            q.toggleClass("user-star")
        };
        p(this, null, "star", w);
        w()
    }
    function I(q) {
        q = parseInt(q);
        if (q in qa)
            return qa[q];
        var w = [], A = {}, H = {add: function(E, N, D, K) {
                var L = [];
                N && L.push({id: E,text: N,user: D,time: K});
                for (var ua in w) {
                    N = w[ua];
                    N.id != E && L.push(N)
                }
                w = L.sort(function(P, U) {
                    return U.id - P.id
                }).slice(0, Ta)
            },getLast: function() {
                if (w.length > 0)
                    return w[0];
                return {id: null,text: "",user: "",time: null}
            },leave: function() {
                delete qa[q]
            },addMention: function(E) {
                A[E] = true
            },dismissMention: function(E) {
                if (E)
                    delete A[E];
                else
                    A = {}
            },getMentionCount: function() {
                var E = 0;
                for (id in A)
                    E++;
                return E
            }};
        return qa[q] = H
    }
    function Q(q) {
        var w = I(q).getMentionCount();
        q = $("#room-" + q);
        if (q.length != 0) {
            var A = 
            q.find(".reply-count");
            if (w == 0)
                A.remove();
            else {
                if (A.length == 0)
                    A = $("<a/>").attr("href", q.find("a:first").attr("href")).attr("target", "_self").attr("title", "someone mentioned you in that room").addClass("reply-count").prependTo(q);
                A.text(w)
            }
        }
    }
    function M() {
        ea && clearTimeout(ea);
        ea = setTimeout(function() {
            ea = null;
            S()
        }, 500)
    }
    function S(q, w) {
        if (q == undefined)
            q = 10;
        var A = $("#sidebar").height() - $("#input-area").height() - 8 - $("#sidebar-content").height();
        if (w != undefined)
            if (w && A < 10)
                return S(0, false);
            else if (!w && A > 
            10)
                return;
        if (w == undefined)
            w = A > 0;
        var H = false;
        $("#sidebar .collapsible").not(".fixed-max").each(function() {
            var E = $(this).data("show_max") || 5;
            if (!w && E > 1) {
                $(this).data("show_max", E - 1);
                H = true
            } else if (w && E < 10) {
                $(this).data("show_max", E + 1);
                H = true
            }
            H && $(this).updateCollapsible(true)
        });
        q > 0 && H && S(q - 1, w)
    }
    function ra(q, w) {
        var A = secondsSince(w);
        q.css({opacity: 1 - Math.max(Math.min(A / 3600, 1), 0) * 0.85})
    }
    function Ha() {
        $("#present-users").find(".present-user").each(function() {
            var q = $(this);
            ra(q, q.find(".data > .last-activity-time").text())
        })
    }
    function sa(q) {
        if (q.search(/[<>&]/) == -1)
            return q;
        q = $("<div>" + q + "</div>").eq(0);
        q.find("p,div,h1,h2,h3,h4,h5").each(function() {
            $("<span> </span>").insertAfter(this)
        });
        q.find("br,hr,img").replaceWith("<span> </span>");
        return q.text()
    }
    function ka(q) {
        I(q).leave();
        $("#room-" + q).addClass("leaving").slideUp(function() {
            $(this).remove();
            h();
            $("#my-rooms").updateCollapsible();
            M()
        })
    }
    function Ia() {
        $("#starred-posts ul li").each(function() {
            var q = parseInt($(this).attr("data-time")) + SERVER_TIME_OFFSET;
            isNaN(q) || 
            $(".relativetime", this).text(ToRelativeTimeMini(q, true))
        })
    }
    function va(q) {
        if (q) {
            q.name && $("#roomname").text(q.name);
            q.description && $("#roomdesc").html(q.description);
            q.isFavorite ? $("#toggle-favorite").addClass("favorite-room") : $("#toggle-favorite").removeClass("favorite-room");
            document.title = document.title.replace(/^(\(\d*\*?\) )?(.*)( \| [^|]*)$/, "$1" + q.name.replace(/\$/g, "$$$$") + "$3")
        }
    }
    var pa = k.notify, Ja = k.icc, la = c.id, Ka = 10, La = 10, wa = ConversationSelector(c.id, j, pa, $("#chat")), qa = {}, Ta = 5, ea, W = $([]), 
    fa;
    g();
    h();
    initSearchBox();
    $("#starred-posts .quick-unstar").live("click", function(q) {
        q.stopPropagation();
        var w = $(this).closest("li");
        q = popUp(q.pageX, q.pageY, w);
        var A, H = [], E = $("<div/>").appendTo(q);
        A = w.attr("id").replace("summary_", "");
        E.html('<a href="' + PERMALINK(A) + '">permalink</a> | <a href="/messages/' + A + '/history">history</a><br/>');
        if (w.find(".sidebar-vote.user-star").length > 0) {
            A = "unstar";
            H.push("starred")
        } else
            A = "star";
        var N = b();
        $("<span/>").addClass("star").html("<span class='sprite sprite-icon-star'/> " + 
        A + " as interesting").click(C).click(q.close).attr("title", "click to " + A).appendTo(q);
        var D = false;
        if (w.find(".sidebar-vote.user-flag").length > 0) {
            D = true;
            H.push("flagged")
        }
        H.length > 0 && E.html(E.html() + "You have " + H.join(" and ") + " this message.<br/>");
        if (!D && (N || 1)) {
            q.append("<br/>");
            $("<span/>").addClass("flag").html("<span class='sprite sprite-icon-flag'/> flag as spam/offensive").click(t).click(q.close).attr("title", "click to " + A).appendTo(q)
        }
        q.append($("<br/><br/>"));
        if (N) {
            if ($(this).hasClass("quick-unstar")) {
                w = 
                "pin this item";
                H = y;
                if ($(this).siblings(".sidebar-vote.stars.owner-star").length > 0) {
                    w = "unpin this item";
                    H = r
                }
                q.append($("<span/>").addClass("owner-star").text(w).prepend('<span class="img"></span>').click(H).click(q.close).attr("title", w));
                q.append(" | ");
                q.append($("<span/>").addClass("star").html("cancel stars ").click(x).click(q.close).attr("title", "cancel stars"))
            }
            if ($(this).hasClass("quick-unflag")) {
                q.append($("<span/>").addClass("delete").html("delete").click(u).click(q.close).attr("title", "click to delete"));
                q.append(" | ");
                q.append($("<span/>").addClass("flag").html("cancel flags").click(v).click(q.close).attr("title", "cancel flags"))
            }
        }
    });
    $("#starred-posts .sidebar-vote").live("click", C);
    $("#my-rooms span.quickleave").live("click", function(q) {
        q.preventDefault();
        if ($(this).hasClass("quickleave")) {
            q = $(this).closest("li").find("a").not(".reply-count").eq(0);
            if (!confirm("Do you want to leave " + (q.attr("title").substr(10) || q.text()) + "?"))
                return
        }
        q = $(this).closest("li").attr("id").replace("room-", "");
        $.post("/chats/leave/" + 
        q, fkey({quiet: true}));
        ka(q)
    });
    $("#leave, #leaveall").click(function() {
        var q = false;
        if (this.id == "leaveall") {
            if (!confirm("This will remove you from all rooms; continue?"))
                return false;
            q = true
        }
        $.post($(this).attr("href"), fkey({quiet: true}), function() {
            q && Ja.broadcast({command: "leave all"});
            window.location = "/"
        });
        return false
    });
    $("#room-files .quick-delete").live("click", function() {
        if (confirm("This will permanently delete this file; are you sure?")) {
            var q = $(this).attr("id").replace("file-", ""), w = $(this).closest("li");
            $.post("/files/delete/" + la + "/" + q, fkey(), function() {
                w.slideUp(function() {
                    w.remove()
                })
            })
        }
    });
    $("#my-rooms").data("autohide", true).updateCollapsible();
    $("#my-rooms,#starred-posts ul").data("autohide", true);
    $("#toggle-favorite").click(function() {
        $("#toggle-favorite").toggleClass("favorite-room");
        $.post("/rooms/favorite", fkey({roomId: la}), va)
    });
    $("#room-menu").click(function(q) {
        if (q.shiftKey || q.ctrlKey || q.altKey)
            return true;
        var w = $("#about-room").attr("href").replace("/rooms/info/", ""), A = c.id, H = $("#roomname").text();
        q.preventDefault();
        q.stopPropagation();
        var E = popUp(q.pageX, q.pageY).addClass("room-popup");
        $("<h2/>").text(H).appendTo(E);
        var N = $("<div/>").css({width: 192,height: 25}).appendTo(E), D, K;
        q = $("<div/>").appendTo(E);
        if (b && b()) {
            $("<h5/>").text("Room owner").appendTo(E);
            D = $("<div/>").appendTo(E);
            if (i && i()) {
                $("<h5/>").text("Moderator").appendTo(E);
                K = $("<div/>").appendTo(E)
            }
        }
        var L = function(P, U, Y) {
            P = $("<a/>").text(P).attr("href", U);
            Y && P.attr("target", "_self");
            return $("<div/>").append(P)
        };
        L("full transcript", 
        "/transcript/" + A).appendTo(q);
        o && L("create new bookmark", "#").click(function(P) {
            P.preventDefault();
            wa.Dialog()
        }).appendTo(q);
        infoOrOwner = function(P, U, Y) {
            Y = Y || U;
            L(D ? Y : U, P).appendTo(D)
        };
        if (D) {
            infoOrOwner("/rooms/info/" + w + "?tab=schedule", "scheduled events", "schedule events");
            infoOrOwner("/rooms/info/" + w + "?tab=access", "user access", "control access");
            infoOrOwner("/rooms/info/" + w + "?tab=feeds", "room feeds", "manage feeds")
        }
        if (K) {
            L("timeout", "#").click(function(P) {
                P.preventDefault();
                promptUser(P, "<h2>Timeout</h2><p>This should only be used to help control an off-topic discussion.</p><p>You should also explain why the room is in timeout.</p><p>Enter the time in seconds:</p>", 
                "60", function(U) {
                    U && U.length > 0 && $.post("/rooms/timeout/" + w, fkey({duration: U}))
                });
                return false
            }).appendTo(K);
            L((c.frozen ? "un" : "") + "freeze this room", "#").click(function(P) {
                P.preventDefault();
                if (window.confirm(c.frozen ? "Do you want to unfreeze this room, allowing new messages to be posted?" : "Do you want to freeze this room, preventing regular users from talking?")) {
                    $.post("/rooms/setfrozen/" + A, fkey({freeze: !c.frozen}));
                    E.close()
                }
            }).appendTo(K);
            L((c.deleted ? "un" : "") + "delete this room", "#").click(function(P) {
                P.preventDefault();
                if (window.confirm(c.deleted ? "Do you want to undelete this room, making it visible again to regular users?" : "Do you want to delete this room and remove all users from it, including yourself?")) {
                    $.post("/rooms/setdeleted/" + A, fkey({"delete": !c.deleted}));
                    E.close()
                }
            }).appendTo(K)
        }
        if (m != null)
            L("message admin", "#").click(function() {
                E.close();
                m();
                return false
            }).appendTo(K || D);
        var ua = $("<img/>").attr("src", IMAGE("ajax-loader.gif")).appendTo(N);
        $.getJSON("/rooms/thumbs/" + A, {showUsage: true,host: c.host}, function(P) {
            ua.remove();
            P.usage ? N.html(P.usage) : N.slideUp()
        })
    });
    $("#present-users").data("show_max", 32);
    $("#rejoin-favs").click(function() {
        $.post("/chats/join/favorite", fkey({quiet: true,immediate: true}), function() {
            $("#rejoin-favs").fadeOut(function() {
                $("#rejoin-favs").remove()
            })
        })
    });
    (function() {
        $(".sidebar-widget:has(ul.collapsible)").find(".more").click(function() {
            $(this).closest(".sidebar-widget").find("ul.collapsible").toggleClass("expanded").updateCollapsible();
            window.setTimeout(M, 700)
        })
    })();
    window.setInterval(function() {
        g();
        Ha()
    }, 1E4);
    $(window).resize(M);
    return {relayout: M,userActivity: function(q, w, A, H, E) {
            var N = $("#present-users");
            A = A && N.find("li").length <= 32;
            if (H == undefined)
                H = now();
            if (!E)
                if (E = users[q])
                    E = E.email_hash;
                else
                    unknown_users.uniquePush(q);
            var D = $("#present-user-" + q);
            D.find(".data > .last-activity-time").text(H);
            if (D.length == 0 || D.hasClass("leaving")) {
                D.remove();
                D = $('<li class="present-user"/>').attr("id", "present-user-" + q).addClass("user-container user-" + q).data("user", q);
                shouldShowUser(q) || D.addClass("ignored");
                E = $('<img class="user-gravatar32" width="32" height="32"/>').attr("alt", w).attr("title", w);
                D.append($("<div/>").addClass("avatar").append(E));
                D.append(span("data").append(span("last-activity-time").text(H)))
            }
            updateUserContainer(D);
            ra(D, H);
            if (A && shouldShowUser(q)) {
                D.prependTo(N);
                D.css({visibility: "hidden",width: 0});
                D.addClass("arriving");
                D.animate({width: 32}, 3E3);
                var K = $("<div/>").css({padding: "10px",position: "fixed",zIndex: 3}).addClass("user-container").data("user", q);
                K.css({top: -100,left: D.offset().left,
                    backgroundColor: "white",border: "1px solid #ccc"}).appendTo("#main");
                K.append(D.find(".avatar").clone());
                K.append($("<span/>").text(w || "").addClass("username").css({fontSize: 24}));
                var L = false;
                q = function() {
                    if (!L) {
                        L = true;
                        K.animate({top: [D.offset().top - $(window).scrollTop() - 11, "swing"],left: [D.offset().left - $(window).scrollLeft() - 11, "linear"]}, 3E3, function() {
                            D.css({visibility: "visible"});
                            D.removeClass("arriving");
                            K.fadeOut(500, function() {
                                K.remove()
                            })
                        })
                    }
                };
                updateUserContainer(K, true, q);
                window.setTimeout(q, 
                5E3)
            } else
                D.prependTo(N);
            D.show();
            N.updateCollapsible()
        },userLeave: function(q) {
            var w = function() {
                $(this).remove();
                $("#present-users").updateCollapsible()
            }, A = $("#present-user-" + q).addClass("leaving");
            if ($("#present-users li").length > 32) {
                A.remove();
                $("#present-users").updateCollapsible()
            } else {
                shouldShowUser(q) && A.find(".avatar").clone().css({zIndex: 3,position: "fixed",top: A.offset().top - $(window).scrollTop(),left: A.offset().left - $(window).scrollLeft()}).appendTo("body").hide().fadeIn(500, function() {
                    A.css({visibility: "hidden"})
                }).animate({left: ["-=100px", 
                        "linear"],top: ["+=200px", "swing"],opacity: 0}, 3E3, w);
                A.animate({width: 0}, 3E3, w)
            }
        },leaveOtherRoom: ka,otherRoomActivity: function(q, w, A, H, E, N) {
            var D = $("#room-" + q), K = false;
            if (D.length == 0 || D.hasClass("leaving")) {
                D.remove();
                D = $("<li/>").attr("id", "room-" + q).hide();
                w = w || "(unknown)";
                K = w.length > 40 ? $("<a target='_self' href='/rooms/" + q + "/" + urlFriendly(w) + "' />").text(w.substring(0, 37)).append("<span>&hellip;</span>") : $("<a target='_self' href='/rooms/" + q + "/" + urlFriendly(w) + "' />").text(w);
                K.attr("title", "switch to " + 
                w).appendTo(D);
                $("<span class='quickleave'/>").insertAfter(K).attr("title", "leave that room");
                D.append(div("room-info").append(div("last-message").append(span("user-name"), ": ", span("text"), div("time data"))));
                K = true
            }
            if (arguments.length > 2) {
                var L = I(q);
                L.add(N, H, A, E);
                L = L.getLast();
                D.find(".room-info > .last-message > .user-name").text(L.user);
                D.find(".room-info > .last-message > .text").text(sa(L.text || ""));
                D.find(".room-info > .last-message > .time").text(L.time)
            }
            D.prependTo("#my-rooms").slideDown();
            g();
            if (K) {
                $("#room-ad").slideUp(function() {
                    $("#room-ad").remove()
                });
                M()
            }
            $("#my-rooms").updateCollapsible();
            h()
        },otherRoomMention: function(q, w) {
            I(q).addMention(w);
            Q(q)
        },updateStars: function() {
            if (fa) {
                window.clearInterval(fa);
                fa = null
            }
            Ka = 0;
            $("#starred-posts ul").load("/chats/stars/" + la + "?count=" + Ka, function() {
                $("#starred-posts ul").updateCollapsible(true);
                M();
                fa = window.setInterval(Ia, 12E4)
            })
        },updateFiles: function() {
            La = 0;
            $("#room-files ul").load("/chats/files/" + la + "?count=" + La, function() {
                $("#room-files ul").updateCollapsible(true);
                M()
            })
        },updateRoomMeta: function() {
            $.getJSON("/rooms/thumbs/" + la, va)
        },updateAdminCounters: function() {
            function q(H) {
                H.css("visibility", "visible");
                $.browser.msie || H.fadeIn()
            }
            function w(H) {
                $.browser.msie ? H.css("visibility", "hidden") : H.fadeOut()
            }
            var A = $("#flag-count");
            A.length > 0 && $.get("/admin/counters?show=new", function(H) {
                A.find("a").text(H.flags);
                H.flags ? q(A) : w(A);
                A = $("#modflag-count");
                A.find("a").text(H.modflags);
                H.modflags ? q(A) : w(A)
            })
        },loadUser: function(q, w, A) {
            w = $('<li class="present-user"/>').attr("id", 
            "present-user-" + q).addClass("user-container user-" + q).data("user", q);
            shouldShowUser(q) || w.addClass("ignored");
            q = $('<img class="user-gravatar32" width="32" height="32"/>');
            w.append($("<div/>").addClass("avatar").append(q));
            w.append(span("data").append(span("last-activity-time").text(A)));
            updateUserContainer(w);
            ra(w, A);
            W = W.add(w);
            W.length > 32 && w.hide()
        },loadingFinished: function() {
            $("#present-users").prepend(W).closest(".sidebar-widget").find(".more").setVisible(W.length > 32).text("show " + (W.length - 32) + 
            " more")
        },dismissOtherRoomMention: function(q, w) {
            I(q).dismissMention(w);
            Q(q)
        }}
}
var hiddenUsers = {}, SERVER_TIME_OFFSET, TITLE_UPDATE_DELAY = 200;
$.fn.potentialHeight = function() {
    if (this.is(":visible"))
        return this.height();
    var c = $("<div/>").css({height: 0,clear: "both",overflow: "hidden"}), d = this.wrap(c).show().height();
    this.hide().unwrap();
    c.removeData();
    return d
};
$.fn.putInto = function(c) {
    c.put(this);
    return this
};
$.fn.setVisible = function(c) {
    c ? this.show() : this.hide();
    return this
};
$.fn.messageId = function() {
    return parseInt(this.attr("id").substr(8))
};
$.fn.info = function(c, d) {
    var b = this.data("info");
    if (arguments.length == 1) {
        if (b)
            return b[c]
    } else {
        if (b)
            b[c] = d;
        else {
            b = {};
            b[c] = d;
            this.data("info", b)
        }
        return this
    }
};
var containers = {needyUsers: Container(),needyMonologues: Container(),timeTreatmentNeedy: Container()};
function SoundManager(c) {
    function d() {
        var j = b();
        j > 1 && j--;
        $("#sound").attr("class", "sprite sprite-sound-" + j)
    }
    function b() {
        var j = $.cookie("sl");
        return j == null ? 1 : j
    }
    var e = 99, k, i = null;
    d();
    $("#sound").click(function(j) {
        j.stopPropagation();
        var o = popUp(j.pageX, j.pageY), g = function(r) {
            var x = $(this).attr("id").replace("sound-level-", "");
            $.cookie("sl", x, {path: "/",expires: 90});
            o.close();
            d();
            r.preventDefault()
        };
        $("<h2/>").html("Sound notifications").appendTo(o);
        for (var h = $("<ul/>").addClass("no-bullets").appendTo(o), 
        p = ["none", "when mentioned", "visible room", "all my rooms"], u = b(), v = 0; v < p.length; v++) {
            var t = v == u ? " (current setting)" : "";
            $("<li/>").append($("<a/>").attr("href", "#").text(p[v] + t).attr("id", "sound-level-" + v).click(g).appendTo(o)).appendTo(h)
        }
        j.preventDefault()
    });
    var m = $("#jplayer");
    m.length > 0 && m.jPlayer && m.jPlayer({swfPath: c.swfPath,warningAlerts: true,nativeSupport: false,ready: function() {
            this.setFile(c.file);
            this.volume(c.vol);
            i = this
        }});
    return {queue: function(j) {
            if (!k || j == 2)
                e = Math.min(e, j)
        },play: function() {
            !i || 
            e > b() || i.play();
            e = 99
        },setIcc: function(j) {
            k = j
        }}
}
function StartChat(c, d, b, e, k, i, m) {
    function j() {
        function a() {
            var s = n.length;
            if (s) {
                l.text(s).attr("title", "You have been mentioned" + (s == 2 ? " twice" : s > 2 ? " " + s + " times" : "") + ". Click to show.");
                l.css("visibility", "visible");
                $.browser.msie || l.fadeIn()
            } else
                $.browser.msie ? l.css("visibility", "hidden") : l.fadeOut();
            y()
        }
        function f(s) {
            Z.broadcast({command: "clear mention",roomid: b.id,messageid: s})
        }
        var l = $("#reply-count"), n = [];
        uniquePush = function(s) {
            $.inArray(s, n) < 0 && n.push(s)
        };
        l.click(function() {
            var s = n.shift();
            if (s) {
                var z = $("#message-" + s);
                z.length ? wa(z, undefined, {offset: -100}) : window.open(PERMALINK(s));
                $.post("/messages/ack", fkey({id: s}))
            }
            n.length ? f(s) : f();
            a()
        });
        $.browser.msie || l.hide().css("visibility", "visible");
        return {add: function(s) {
                uniquePush(s);
                a()
            },len: function() {
                return n.length
            },clear: function() {
                n.length && $.post("/messages/ack", fkey({id: n.join(",")}));
                n = [];
                f();
                a()
            }}
    }
    function o() {
        try {
            var a = window.localStorage.getItem("chat:draft:" + b.id);
            a && $("#input").val(a).caret(0, a.length)
        } catch (f) {
        }
    }
    function g() {
        ma = 
        eb() <= 5
    }
    function h() {
        Ua && window.clearTimeout(Ua);
        Va && window.clearInterval(Va);
        k || (Ua = window.setTimeout(g, 200));
        Va = window.setInterval(function() {
            if (ma && eb() > 0)
                $.scrollTo($("#bottom"), k ? 0 : fb)
        }, 1E3)
    }
    function p(a) {
        var f = hiddenUsers;
        hiddenUsers = {};
        a && $(a).each(function(l, n) {
            showHideForUser(n, true, true)
        });
        for (key in f)
            f[key] && !hiddenUsers[key] && showHideForUser(key, false, true)
    }
    function u(a) {
        var f = ea(v(markdownMini(a), false));
        a = a;
        a = $.trim(a.replace(/^:\d+ /, ""));
        if (a.substr(0, 5).toLowerCase() == "!http" || Bb.test(a) || 
        Cb.test(a))
            f += ' <img src="' + IMAGE("progress-dots.gif") + '" class="progressbar" />';
        return f
    }
    function v(a, f) {
        if (!a)
            return "<span class='deleted'>(removed)</span>";
        if (a.substring(0, 4) == "<pre")
            return a;
        if (f)
            a = a.replace(/@((?:[^\s._!?();:\/+&<-]|&#\d{3,};){3,})/ig, function(s, z) {
                var B = z.replace(/&#(\d+);/g, function(F, J) {
                    return String.fromCharCode(parseInt(J))
                });
                if (normalizeUserName(B).length >= 3 && normalizeUserName(users[d].name).indexOf(normalizeUserName(B)) == 0)
                    return "<span class='mention'>".concat(s, "</span>");
                return s
            });
        var l = a.match(/^&gt;\s+(.*)$/);
        if (l) {
            l = $("<div/>").addClass("quote").html(l[1]);
            a = $("<p/>").append(l).html()
        }
        if (l = a.match(/^:(\d+)\s/)) {
            var n = $("#message-" + l[1]).closest(".monologue").data("user");
            if (n = users[n])
                a = "@" + n.name.replace(/[\s._!?();:\/+&<-]/g, "") + " " + a.substring(l[0].length)
        }
        return a
    }
    function t() {
        var a = $("#chat div.message").eq(0).messageId(), f = $("#getmore-mine").html();
        $("#getmore-mine").html("finding your last message&hellip;");
        $.post("/chats/" + b.id + "/lastMessage", {beforeId: a,
            highlights: i ? true : undefined}, function(l) {
            if (l.msgid)
                if (l.gap <= 300)
                    r(function() {
                        wa($("#message-" + l.msgid));
                        $("#getmore-mine").html(f)
                    }, l.gap + 5, "#getmore-mine");
                else {
                    R('Your last message is too far back; please use the <a href="' + PERMALINK(l.msgid) + '">transcript</a> instead');
                    $("#getmore-mine").html(f)
                }
            else
                $("#getmore-mine").fadeOut().slideUp()
        })
    }
    function r(a, f, l) {
        if ("which" in a)
            a = null;
        f = f || Db;
        xa += f;
        f = xa - $("#chat div.message").length;
        var n = $("#chat div.message").eq(0);
        $("#getmore");
        if (n.length == 0)
            $("#getmore").fadeOut().slideUp();
        else {
            var s = n.messageId(), z = $(window).scrollTop() - n.offset().top;
            s = "/chats/" + b.id + "/events?before=" + s + "&mode=Messages";
            $(l || "#getmore").html("loading&hellip;");
            s += "&msgCount=" + f;
            if (i)
                s += "&highlights=true";
            var B = (new Date).getTime();
            $.post(s, fkey(), function(F) {
                var J = (new Date).getTime();
                if (!F.events || F.events.length == 0)
                    $("#getmore,#getmore-mine").fadeOut().slideUp();
                $("#chat div.timestamp").eq(0).remove();
                gb(F).prependTo("#chat");
                $.preload(".message img.user-image", {placeholder: hb,notFound: Wa});
                $("#getmore").html("load older messages");
                Ia();
                $.scrollTo(n, {offset: z});
                a && a();
                debugMessage("server: " + (F.ms ? F.ms + "ms" : "n/a") + "; client: " + ((new Date).getTime() - J) + "ms; request (inc server): " + (J - B) + "ms")
            })
        }
    }
    function x(a, f, l) {
        if (f) {
            var n = a.data("source");
            if (n) {
                l(n);
                return
            }
        }
        n = l;
        var s = "/message/" + $(a).messageId();
        if (f) {
            s += "?plain=true";
            n = function(z) {
                a.data("source", z);
                l(z)
            }
        }
        $.get(s, n)
    }
    function y() {
        var a = document.title.replace(/^\(\d*\*?\) /, "");
        if (ya > 0 || aa.len())
            a = "(" + (ya > 0 ? ya : "") + (aa.len() ? "*" : "") + ") " + a;
        window.setTimeout(function() {
            $(document).attr("title", 
            a)
        }, TITLE_UPDATE_DELAY)
    }
    function C(a) {
        if (!users[d].is_moderator) {
            I();
            a = 120 - secondsSince(a.info("time"));
            if (a <= 10) {
                na.secondsLeft(a);
                ga = setTimeout(function() {
                    na.secondsLeft(-1);
                    ga = null
                }, a * 1E3)
            } else
                ga = setTimeout(function() {
                    na.secondsLeft(10);
                    ga = setTimeout(function() {
                        na.secondsLeft(-1);
                        ga = null
                    }, 1E4)
                }, (a - 10) * 1E3)
        }
    }
    function I() {
        ga && clearTimeout(ga);
        ga = null;
        na.secondsLeft(null)
    }
    function Q() {
        $("#chat div.message").removeClass("editing");
        M($(this).closest(".message"))
    }
    function M(a) {
        a.addClass("editing");
        var f = $("<img/>").attr("alt", "please wait").attr("src", IMAGE("ajax-loader.gif")).css({position: "absolute",margin: 3,padding: 5,backgroundColor: "white"}).hide().insertBefore("#input");
        window.setTimeout(function() {
            f.show()
        }, 200);
        $.browser.msie ? $("#cancel-editing-button").show() : $("#cancel-editing-button").stop().fadeIn();
        $.scrollTo(a, 500, {offset: -200});
        x(a, true, function(l) {
            f.remove();
            $("#input").addClass("editing");
            $("#input").val(l).focus().caret(l.length, l.length);
            na.clear();
            ha();
            C(a)
        })
    }
    function S() {
        $("#chat div.editing").removeClass("editing");
        $("#input").removeClass("editing").prev("img").remove();
        $("#cancel-editing-button").fadeOut();
        $("#input").val("");
        I()
    }
    function ra() {
        return $("#chat").find("div.editing").eq(0)
    }
    function Ha() {
        return div("clear-both").html("&nbsp;").css("height", 0)
    }
    function sa(a, f) {
        var l = userContainer(a || 0);
        l.addClass("monologue");
        a == d && l.addClass("mine");
        var n = $("<div/>").addClass("messages");
        if (a && a.toString().length > 0)
            l.append(monologueSignature(a));
        else
            f && f.length != 0 && l.append(monologueSignature(0)).find(".username").each(function() {
                $(this).text(f)
            });
        l.append(n);
        l.append(Ha());
        return l
    }
    function ka(a, f) {
        if (a.find("div.message").length == 0) {
            var l = a.prev(".system-message-container"), n = a.next(".system-message-container");
            if (n.length || l.length) {
                var s = (n.length ? n : a).next(".monologue");
                if (s.length) {
                    s.find(".timestamp").remove();
                    s.addClass("needs-elapsed");
                    s.putInto(containers.timeTreatmentNeedy)
                }
                n.remove();
                l.remove()
            }
            a.remove()
        } else {
            l = a.find("div.messages").height();
            n = a.find("a.signature > .username").potentialHeight();
            s = f ? 0 : 400;
            if (l - n < 37) {
                a.find(".avatar-32,.signature > .username,.flair").slideUp(s);
                a.find(".tiny-signature").slideDown(s)
            } else if (l - n < 50) {
                a.find(".avatar-32,.signature > .username").slideDown(s);
                a.find(".tiny-signature,.flair").slideUp(s)
            } else {
                a.find(".avatar-32,.signature > .username,.flair").slideDown(s);
                a.find(".tiny-signature").slideUp(s)
            }
        }
    }
    function Ia() {
        updateNeedyUserContainers();
        if (ma) {
            var a = $("#chat div.message").slice(0, -xa), f = a.length > Eb;
            if (f) {
                $("#getmore").show();
                a.closest(".monologue").putInto(containers.needyMonologues);
                a.remove();
                $(".monologue").eq(0).putInto(containers.needyMonologues)
            }
        }
        containers.needyMonologues.withAll(function() {
            ka($(this))
        });
        containers.needyMonologues.spill();
        f && K($("#chat > div.monologue").eq(0));
        ua()
    }
    function va(a, f) {
        var l = a.closest(".monologue"), n = a.nextAll(".message");
        if (n.length != 0) {
            var s = sa(l.data("user"), f);
            n.appendTo(s.find("div.messages"));
            s.insertAfter(l)
        }
    }
    function pa(a, f, l, n, s) {
        var z = $("#message-" + f);
        if (z.length > 0)
            return z.closest(".monologue");
        if (!s) {
            z = $("#chat div.message").not(".pending").filter(function() {
                return $(this).messageId() < f
            });
            if (z.length > 0) {
                var B = z.last().closest(".monologue"), F = z.last().info("time"), 
                J = B.next().hasClass("timebreak");
                s = J || F < l - ib;
                l = F < l - jb;
                if (!s && B.data("user") == a)
                    return B;
                va(z.last(), n);
                a = sa(a, n).insertAfter(J ? B.next() : B);
                s && a.addClass("needs-timestamp").putInto(containers.timeTreatmentNeedy);
                l && a.addClass("needs-elapsed").putInto(containers.timeTreatmentNeedy);
                return a
            } else
                return sa(a, n).prependTo($("#chat"))
        }
    }
    function Ja() {
        var a = $(this).closest(".message").messageId(), f = $("#input").focus().val().replace(/^:([0-9]+)\s+/, "");
        $("#input").focus().val(":" + a + " " + f)
    }
    function la() {
        $("#message-" + 
        $(this).info("parent_id")).addClass("reply-parent");
        $(".message.pid-" + $(this).messageId()).addClass("reply-child")
    }
    function Ka() {
        $("#message-" + $(this).info("parent_id")).removeClass("reply-parent");
        $(".message.pid-" + $(this).messageId()).removeClass("reply-child")
    }
    function La() {
        var a = $("#message-" + $(this).closest(".message").info("parent_id"));
        if (a.length == 1) {
            wa(a);
            return false
        }
    }
    function wa(a, f, l) {
        var n = $(a);
        n.addClass("highlight");
        window.setTimeout(function() {
            n.removeClass("highlight")
        }, f || 2E3);
        $.scrollTo(n, 
        200, l)
    }
    function qa(a) {
        a.stopPropagation();
        a.preventDefault();
        var f = $(this).closest(".message");
        a = popUp(a.pageX, a.pageY, f);
        var l, n = [], s = $("<div/>").appendTo(a), z = f.messageId();
        l = $("<span/>").text("posted " + ToRelativeTimeMini(f.info("time"))).attr("title", localTimeSimple(f.info("time")));
        if (f.find(".deleted").length == 0) {
            s.html(' &ndash; <a href="' + PERMALINK(z) + '">permalink</a><br/>');
            s.prepend(l);
            if (Fb && !f.closest(".user-container").hasClass("mine")) {
                $("<span/>").addClass("reply").html('<span class="newreply"> </span> reply to this message').click(Ja).click(a.close).appendTo(a);
                a.append("<br/>")
            }
            a.append("<br/>");
            if (f.find(".meta .stars").hasClass("user-star")) {
                l = "unstar";
                n.push("starred")
            } else
                l = "star";
            var B = f.closest(".monologue").data("user") == d;
            if (d > 0 && !B) {
                $("<span/>").addClass("star").html('<span class="img"/> ' + l + " as interesting").click(kb).click(a.close).attr("title", "Add a star to indicate an interesting message, for example to display in the room's highlights").appendTo(a);
                a.append("<br/>")
            }
            if (d > 0 && users[d].is_owner) {
                if (f.find(".meta .stars").hasClass("user-owner-star")) {
                    l = 
                    "unpin";
                    n.push("pinned")
                } else
                    l = "pin";
                $("<span/>").addClass("owner-star").html('<span class="img"/> ' + l + " this message").click(Gb).click(a.close).attr("title", "Pinning is like adding a star, but pinned items takes priority; this option is only available to the room owner.").appendTo(a);
                a.append("<br/>")
            }
            l = false;
            if (f.find(".meta .flags").hasClass("user-flag")) {
                l = true;
                n.push("flagged")
            }
            n.length > 0 && s.html(s.html() + "You have " + n.join(" and ") + " this message.<br/>");
            n = f.info("edits");
            var F = f.info("moved"), 
            J = f.find(".meta .stars").hasClass("owner-star");
            if (n || F || J) {
                var ca = "This message has been ";
                if (F)
                    ca += "moved from another room " + (n || J ? "and " : "");
                if (n)
                    ca += "edited " + (n == 1 ? "once" : n == 2 ? "twice" : n + " times") + (J ? " and " : "");
                if (J)
                    ca += "pinned";
                s.append(ca + " - ");
                s.append($("<a/>").attr("href", "/messages/" + z + "/history").text("history"))
            }
            if (!l && d > 0 && (users[d].is_owner || !B)) {
                $("<span/>").addClass("flag").html('<span class="img"/> flag as spam/offensive').click(lb).click(a.close).attr("title", "Flagging a message helps bring inappropriate content to the attention of moderators and other users, for example spam or abusive messages.").appendTo(a);
                a.append("<br/>")
            }
            a.append($("<br/>"));
            if (users[d].is_moderator || B && secondsSince(f.info("time")) < 115) {
                $("<span/>").addClass("edit").html("edit ").click(Q).click(a.close).attr("title", "click to edit").appendTo(a);
                a.append(" | ");
                delete_button = $("<span/>").addClass("delete").html("delete ").click(Hb).click(a.close).attr("title", "click to delete");
                a.append(delete_button);
                a.append(" | ")
            }
            d > 0 && $("<span/>").addClass("flag").html("flag for moderator").click(Ta).click(a.close).attr("title", "Moderator flags are seen only by the site-moderators, and should be used to indicate serious issues with a message, and other administrative issues.").appendTo(a)
        } else {
            s.html("<br/>This message has been deleted");
            s.prepend(l);
            if (B || users[d].is_moderator)
                s.append(" - ").append($("<a/>").attr("href", "/messages/" + z + "/history").text("history"))
        }
    }
    function Ta(a) {
        var f = $(this).closest(".message");
        promptUser(a, "<h2>Flag for moderator</h2><p>Please indicate why this requires moderator attention:</p>", "", function(l) {
            l && l.length > 0 && ta(f, "mod", {info: l}, function(n) {
                n == "ok" ? R("Thanks, we'll take a look at it.") : R(n || GENERIC_ERROR)
            })
        }, true, null, function(l) {
            return l.length > 400 ? "Maximum length exceeded" : ""
        })
    }
    function ea(a) {
        if (!a || 
        a.length == 0 || a.substring(0, 4) == "<pre")
            return a;
        if (a.search("<") == -1)
            return autoLink(a);
        a = $("<div/>").html(a);
        a.find("*").add(a).contents().filter(function() {
            return this.nodeType == 3 && $(this).closest("a,code").length == 0
        }).each(function() {
            var f = $(this).text();
            f && f.search("/") != -1 && $(this).replaceWith(autoLink(f.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")))
        });
        return a.html()
    }
    function W() {
        $("#main").toggleClass("message-admin-mode");
        fa()
    }
    function fa(a, f) {
        var l = $("#main"), n = l.hasClass("select-mode");
        za && za(null);
        za = a && f ? f : null;
        if (a == undefined)
            a = !n;
        $("#chat div.message.selected").removeClass("selected");
        if (a || !n) {
            l.addClass("select-mode");
            $.browser.msie && $("#chat *").each(function() {
                this.unselectable = "on"
            })
        } else if (!a || n) {
            l.removeClass("select-mode");
            $.browser.msie && $("#chat *").each(function() {
                delete this.unselectable
            })
        }
    }
    function q() {
        var a = "", f = 0;
        $("#chat div.message.selected").each(function(l, n) {
            a += "," + n.id.replace("message-", "");
            f++
        });
        if (a.length > 0)
            a = a.substr(1);
        return {id: a,count: f}
    }
    function w() {
        var a = 
        q();
        if (a.count > 0) {
            if (window.confirm("Delete the " + a.count + " selected posts?")) {
                $.post("/admin/deletePosts/" + b.id, fkey({id: a.id}));
                W()
            }
        } else
            window.alert("You have not selected any posts to delete.")
    }
    function A(a) {
        $("#roomsearchresult button").die();
        a.preventDefault();
        var f = q();
        if (!f.count) {
            window.alert("You have not selected any posts to relocate.");
            return false
        }
        var l = popUp($(window).width() - 50, a.pageY + 20).css("width", 750);
        $("<h2>Move posts</h2><p>This will move the selected posts to a different room. Enter the room name to <b>search</b> for the intended target room.</p>").appendTo(l);
        var n = $('<input type="text" name="roomname" />').appendTo(l), s = $("<img/>").attr("src", IMAGE("ajax-loader.gif")).appendTo(l).hide();
        if (users[d].is_moderator) {
            $('<p>You can also automatically <b>create a new room</b> as the target room by entering the <b>new room\'s name</b> and clicking "create".</p>').insertBefore(n);
            var z = $("<div/>").css("color", "red").insertBefore(n);
            $("<span>&nbsp;</span>").appendTo(l);
            $("<button class='button'>create</button>").appendTo(l).click(function() {
                var F = n.val();
                if (F == 
                "")
                    z.text("Please enter a name for the new room.");
                else if (confirm('Do you want to create a new room named "' + F + '", copy all user permissions from here to the new room, and move the selected messages there?')) {
                    s.show();
                    $.post("/admin/movePostsToNew/" + b.id, fkey({ids: f.id,newTitle: F}), function(J) {
                        s.hide();
                        if (J != "ok")
                            z.text(J);
                        else {
                            W(false);
                            $("#roomsearchresult button").die();
                            l.close()
                        }
                    }, "json")
                }
            })
        }
        $('<div id="roomsearchresult" />').appendTo(l);
        $("#roomsearchresult button").live("click", function() {
            var F = 
            $(this).closest(".room-mini").find("a:first").attr("href").replace(/^\/rooms\/(\d+)\/.*$/, "$1");
            $.post("/admin/movePosts/" + b.id, fkey({ids: f.id,to: F}));
            W(false);
            $("#roomsearchresult button").die();
            l.close()
        });
        var B = function() {
            s.show();
            $("#roomsearchresult").load("/rooms/minilist", {filter: n.val().toLowerCase(),forWriting: true}, function() {
                s.hide();
                $("#roomsearchresult .room-mini").each(function() {
                    $("<button class='button'>choose</button>").prependTo($(".room-mini-header", this)).css({"float": "right",
                        "margin-top": 0})
                })
            })
        };
        n.keyup(function(F) {
            F.which == 13 && B(n.val())
        }).typeWatch({callback: B,wait: 500,captureLength: 2});
        return false
    }
    function H(a, f) {
        var l = a.messageId(), n = f.messageId();
        if (n < l) {
            var s = l;
            l = n;
            n = s
        }
        return $("#chat div.message").filter(function() {
            var z = $(this).messageId();
            return l <= z && z <= n
        })
    }
    function E(a) {
        if ($("#main").hasClass("select-mode")) {
            a.preventDefault();
            a.stopImmediatePropagation();
            var f = $(this).closest(".message");
            if (za)
                za(f);
            else if (a.ctrlKey)
                f.toggleClass("selected");
            else if (a.shiftKey) {
                var l = 
                $("#chat div.message.selected");
                a = l.first();
                l = l.last();
                a = H(f, a);
                f = H(f, l);
                a.length >= f.length ? f.addClass("selected") : a.addClass("selected")
            } else {
                $("#chat div.message.selected").removeClass("selected");
                f.addClass("selected")
            }
        }
    }
    function N(a) {
        var f = $('<div class="message"/>').attr("id", "message-" + a.message_id), l = $('<a class="action-link" title="click for message actions"><span class="img menu"> </span></a>').attr("href", PERMALINK(a.message_id)).appendTo(f);
        a.parent_id && a.content && a.show_parent && $("<a/>").addClass("reply-info").attr("title", 
        "This is a reply to an earlier message").attr("href", PERMALINK(a.parent_id)).click(La).text(" ").appendTo(f);
        f.hover(la, Ka);
        a.moved && $("<span/>").addClass("moved").attr("title", "This message was moved from another room; see edit history").html("&larr;").appendTo(f);
        var n = $('<div class="content">' + ea(v(a.content, a.user_id != d)) + "</div>").appendTo(f), s = $('<span class="stars vote-count-container' + (a.message_stars > 0 || a.message_owner_stars > 0 ? " always" : "") + (a.message_owner_stars > 0 ? " owner-star" : "") + '"><span class="img"/><span class="times">' + 
        (a.message_stars > 1 ? a.message_stars : "") + "</span></span>"), z = $('<span class="flags vote-count-container' + (a.message_flags > 0 ? " always" : "") + '"><span class="img"/><span class="times">' + (a.message_flags > 1 ? a.message_flags : "") + "</span></span>"), B = $('<span class="meta"/>');
        B.append(z, "&nbsp;", s);
        if (d > 0 && a.user_id != d && a.content) {
            s.find(".img").addClass("vote").attr("title", "star this message as useful / interesting for the transcript").click(kb);
            a.message_flagged ? z.find(".img").attr("title", "you have flagged this message as spam, inappropriate, or offensive") : 
            z.find(".img").addClass("vote").attr("title", "flag this message as spam, inappropriate, or offensive").click(lb);
            B.append("&nbsp;");
            B.append($('<span class="newreply"/>').click(Ja).attr("title", "link my next chat message as a reply to this"))
        }
        a.message_starred && s.addClass("user-star");
        a.message_owner_starred && s.addClass("user-owner-star");
        a.message_flagged && z.addClass("user-flag");
        z = $('<span class="flash"/>');
        if (Ma && a.message_flags > 0 || a.message_flagged)
            z.addClass("flag-indicator");
        z.append(s.clone(true));
        a.message_edits > 0 && a.content && l.addClass("edits");
        f.append(B, z);
        a.parent_id && f.addClass("pid-" + a.parent_id);
        f.data("info", {time: a.time_stamp,edits: a.message_edits,moved: a.moved,parent_id: a.parent_id});
        var F = n.find(".partial");
        if (F.length == 1 && !F.parent().hasClass("quote")) {
            var J = $("<a/>").addClass("more-data").text("(see full text)").attr("href", "/messages/" + b.id + "/" + a.message_id);
            J.click(function(ca) {
                if (!(ca.button != 0 || ca.ctrlKey)) {
                    var V = $("<span/>").html("loading&hellip;");
                    V.insertAfter($(this).hide());
                    $.ajax({type: "GET",url: $(this).attr("href"),success: function(ia) {
                            F.removeClass("partial").addClass("full");
                            F.get(0).tagName.toLowerCase() != "pre" ? F.html(ea(v(ia.toString().replace(/\r\n?|\n/g, " <br> ")))) : F.html(ia.replace(/^    /mg, ""));
                            V.add(J).remove()
                        }});
                    ca.preventDefault()
                }
            });
            n.append(" ", J)
        }
        return f
    }
    function D(a) {
        var f = users[a.user_id];
        if (f && a.time_stamp > f.last_post)
            f.last_post = a.time_stamp;
        if (f = pa(a.user_id, a.message_id, a.time_stamp, a.user_name, !(a.event_type == G.MessagePosted || a.event_type == 
        G.MessageMovedIn || a.event_type == G.UserMentioned || a.event_type == G.MessageReply))) {
            f.putInto(containers.needyMonologues).putInto(containers.timeTreatmentNeedy);
            shouldShowUser(a.user_id) || showHideMonologue(f, true);
            var l = N(a).addClass("neworedit"), n = f.find("#message-" + a.message_id);
            if (n.length > 0) {
                $.each(["time", "starred", "flagged"], function(z, B) {
                    l.info(B, n.info(B))
                });
                $.each(["editing"], function(z, B) {
                    n.hasClass(B) && l.addClass(B)
                });
                l.data("source", n.data("source"));
                n.replaceWith(l)
            } else {
                var s = f.find("div.message").filter(function() {
                    return $(this).messageId() < 
                    a.message_id
                });
                s.length == 0 ? l.prependTo(f.find("div.messages")) : l.insertAfter(s.last())
            }
            if (a.content && a.content.match(/^[-=]{3,}$/)) {
                f = l.prev(".message");
                f.length > 0 && va(f, a.user_name)
            }
            $.preload("#message-" + a.message_id + " img.user-image", {placeholder: hb,notFound: Wa})
        }
    }
    function K(a, f) {
        if (a.length != 0) {
            var l = a;
            if (a.hasClass(".timestamp"))
                l = a.closest(".monologue");
            f || (f = l.find("div.message:first").info("time"));
            var n = l.find("div.timestamp");
            if (n.length == 0)
                n = $("<div/>").addClass("timestamp").prependTo(l.find("div.messages"));
            n.text(localTimeSimple(f))
        }
    }
    function L(a, f) {
        var l = div("system-message-container").append(div("system-message-spacer").html("&nbsp;"), div("system-message").html(a)).append(Ha());
        f && l.addClass(f);
        return l
    }
    function ua() {
        containers.timeTreatmentNeedy.withAll(function() {
            if (!($(this).find("div.timestamp").length > 0)) {
                var a = $(this).find("div.message:first").info("time");
                if (a) {
                    var f = $(this).prevAll(".monologue:has(.timestamp)").eq(0);
                    f = a - (f.find("div.message:first").info("time") || 0);
                    var l = $(this).prevUntil(".monologue:has(.timestamp)");
                    if (f > mb || l.length >= nb || $(this).hasClass("needs-timestamp")) {
                        K($(this), a);
                        $(this).removeClass("needs-timestamp")
                    }
                    if ($(this).hasClass("needs-elapsed")) {
                        (a = a - $(this).prevAll(".monologue").eq(0).find("div.message:last").info("time")) && L(timeSpanString(a, true) + " later&hellip;").insertBefore($(this));
                        $(this).removeClass("needs-elapsed")
                    }
                }
            }
        });
        containers.timeTreatmentNeedy.spill()
    }
    function P(a, f) {
        var l = secondsSince($("div.monologue:last div.message:last").info("time")), n = $("#silence-note:not(.removing)"), 
        s = f ? 0 : 600;
        if (!a && l > 3600) {
            l = "The last message was posted " + timeSpanString(l, true) + " ago.";
            if (n.length)
                n.find(".system-message").html(l);
            else
                n = L(l).attr("id", "silence-note").hide().appendTo("#chat").slideDown(s)
        } else
            n.addClass("removing").slideUp(s, function() {
                $(this).remove()
            })
    }
    function U(a, f) {
        if (a != null) {
            var l = $("#message-" + a.message_id).find(".stars");
            l.find(".times").html(a.message_stars > 1 ? a.message_stars : "");
            a.message_owner_stars > 0 ? l.addClass("owner-star") : l.removeClass("owner-star");
            a.message_stars > 
            0 || a.message_owner_stars > 0 ? l.addClass("always") : l.removeClass("always").removeClass("user-star")
        }
        f && O.updateStars()
    }
    function Y(a, f) {
        if (a != null) {
            var l = $("#message-" + a.message_id), n = l.find(".flags");
            n.find(".times").html(a.message_flags > 1 ? a.message_flags : "");
            var s = a.user_id == d;
            if (a.message_flags > 0) {
                n.addClass("always");
                if (Ma || s)
                    l.find(".flash").addClass("flag-indicator");
                s && n.addClass("user-flag").find(".img").unbind("click").removeClass("vote").attr("title", "you have flagged this message as spam, inappropriate, or offensive")
            } else {
                n.removeClass("always");
                n.removeClass("user-flag");
                Ma && l.find(".flash").removeClass("flag-indicator")
            }
        }
        f && O.updateAdminCounters()
    }
    function Ib(a, f) {
        switch (a.event_type) {
            case G.UserLeft:
                a.user_id == d && O.leaveOtherRoom(a.room_id);
                break;
            case G.MessagePosted:
            case G.MessageEdited:
                Aa.report_speaking();
                if (shouldShowUser(a.user_id)) {
                    O.otherRoomActivity(a.room_id, a.room_name, a.user_name, a.content, a.time_stamp, a.message_id);
                    a.user_id != d ? T.queue(3) : O.dismissOtherRoomMention(a.room_id)
                }
                break;
            case G.MessageDeleted:
                O.otherRoomActivity(a.room_id, 
                a.room_name, a.user_name, null, a.time_stamp, a.message_id);
                break;
            case G.UserMentioned:
            case G.MessageReply:
                if (a.target_user_id == d) {
                    T.queue(1);
                    O.otherRoomMention(a.room_id, a.message_id);
                    f || (Ba[a.message_id] = a)
                }
                break;
            case G.MessageFlagged:
                O.updateAdminCounters();
                break;
            case G.UserEntered:
                a.user_id == d && O.otherRoomActivity(a.room_id, a.room_name, a.user_name, a.content, a.time_stamp);
                break
        }
    }
    function Jb() {
        for (var a in Ba) {
            var f = Ba[a];
            if (X.desktop && c.desktopNotify && f.content && f.content.length) {
                var l = "New event";
                switch (f.event_type) {
                    case G.UserMentioned:
                        l = "You were mentioned by " + f.user_name;
                        break;
                    case G.MessageReply:
                        l = "You received a reply from " + f.user_name;
                        break
                }
                var n = $("<span/>").html(f.content).text();
                if (f.room_name && f.room_name.length > 0)
                    n = n + " (" + f.room_name + ")";
                var s = null;
                if (f.user_id && users[f.user_id] && users[f.user_id].email_hash)
                    s = gravatarUrl(f.user_id, users[f.user_id].email_hash, 48);
                X.desktop({title: l,text: n,icon: s,timeout: 15E3})
            }
        }
        Ba = {}
    }
    function ob(a, f, l) {
        Aa.report_happening();
        if (a.room_id && a.room_id != 
        b.id && a.event_type != G.ModeratorFlag && a.event_type != G.Invitation && a.event_type != G.GlobalNotification)
            return Ib(a, l);
        switch (a.event_type) {
            case G.MessagePosted:
            case G.MessageMovedIn:
            case G.MessageEdited:
            case G.MessageDeleted:
                D(a);
                a.user_id > 0 && O.userActivity(a.user_id, a.user_name, false, null, a.user_email_hash);
                if (!Ca) {
                    a.message_flags > 0 && Y(null, true);
                    a.message_stars > 0 && U(null, true)
                }
                Aa.report_speaking();
                break;
            case G.MessageMovedOut:
                a = $("#message-" + a.message_id);
                f = a.closest(".monologue");
                a.remove();
                f.find("div.timestamp").remove();
                f.putInto(containers.needyMonologues).putInto(containers.timeTreatmentNeedy);
                break;
            case G.DebugMessage:
                f || debugMessage(a.content);
                break;
            case G.UserEntered:
                O.userActivity(a.user_id, a.user_name, true, null, a.user_email_hash);
                if (a.user_id == d)
                    O.isLeaving = undefined;
                break;
            case G.UserLeft:
                if (a.user_id == d && !f) {
                    O.isLeaving = true;
                    if ($("#leave").length == 0)
                        window.location.href = "/";
                    else
                        $("#leave").click()
                } else
                    O.userLeave(a.user_id);
                break;
            case G.MessageStarred:
                U(a, true);
                Y(a, false);
                break;
            case G.AccessLevelChanged:
            case G.UserSuspended:
                if (a.target_user_id == 
                d || a.target_user_id == null)
                    window.location.reload();
                break;
            case G.ModeratorFlag:
                Y(null, true);
                break;
            case G.MessageFlagged:
                U(a, true);
                Y(a, true);
                break;
            case G.RoomNameChanged:
                O.updateRoomMeta();
                break;
            case G.MessageReply:
            case G.UserMentioned:
                if (a.target_user_id == d && shouldShowUser(a.user_id)) {
                    i && D(a);
                    aa.add(a.message_id);
                    T.queue(1);
                    l || (Ba[a.message_id] = a)
                }
                break;
            case G.FileAdded:
                O.updateFiles();
                break;
            case G.UserSettingsChanged:
                $.getJSON("/users/ignorelist", function(n) {
                    p(n)
                });
                break;
            case G.GlobalNotification:
            case G.UserNotification:
                if (f)
                    break;
                if (a.content && a.content.length > 0) {
                    T.queue(1);
                    R(a.content)
                }
                break;
            case G.Invitation:
                T.queue(1);
                R(a.content);
                break;
            case G.TimeBreak:
                debugMessage("time break");
                break;
            case G.FeedTicker:
                if (!a.user_id || shouldShowUser(a.user_id))
                    Na.add(a.content);
                break;
            default:
                debugMessage("Unknown event type " + a.event_type + "; content: " + (a.content ? a.content : "").substring(0, 100) + "...");
                break
        }
    }
    function pb(a, f) {
        if (a)
            if (a.reset)
                window.location.reload();
            else if (a.exit)
                window.location.href = "/";
            else if (!(a.since && ba && a.since < ba)) {
                var l = 
                (new Date).getTime();
                if (a.timeout) {
                    if (!(users[d].is_moderator || users[d].is_owner)) {
                        $("#input-table").fadeOut();
                        var n = $("<span/>").text(a.timeout).attr("title", "Timeout");
                        n.css({position: "fixed",zIndex: 10,height: 10,bottom: 0,left: 0,opacity: 1,fontSize: 1}).appendTo("#input-area").animate({fontSize: 200,opacity: 0,height: 220}, 5E3, function() {
                            n.remove()
                        })
                    }
                } else
                    $("#input-table").fadeIn();
                var s = $("body > div.notification .notification-message.server-connect");
                s.length > 0 && X.dismissSingleNotification(s.text(), 
                false);
                var z = ba;
                if (a.time)
                    if (!ba || a.time > ba)
                        ba = a.time;
                    else
                        ba && a.time < ba && debugMessage("replay: " + ba + " (client) vs " + a.time + " (server)");
                if (a.sync)
                    SERVER_TIME_OFFSET = a.sync - (new Date).getTime() / 1E3;
                Oa = now();
                if (Ca) {
                    Kb(a);
                    debugMessage("server: " + (a.ms ? a.ms + "ms" : "n/a") + "; client: " + ((new Date).getTime() - l) + "ms; request (inc server): " + (l - f) + "ms")
                } else {
                    $("#chat div.neworedit").removeClass("neworedit");
                    var B = 0;
                    if (a.events) {
                        $.each(a.events, function(F, J) {
                            J.id > z && J.event_type == G.MessagePosted && J.user_id != 
                            d && J.room_id == b.id && shouldShowUser(J.user_id) && B++
                        });
                        B > 0 && T.queue(2);
                        if (B > 0 && !Xa) {
                            ya += B;
                            y()
                        }
                        $.each(a.events, function(F, J) {
                            J.id > z && ob(J, false, a.icc)
                        })
                    }
                    Ia();
                    $("#timer").text(a.icc ? "icc" : a.ms ? a.ms + "ms" : "nil");
                    a.events && a.events.length > 0 && O.relayout();
                    P()
                }
            }
    }
    function Ya(a) {
        if (a)
            ja = da.Polling;
        a = ja;
        ja = da.Waiting;
        switch (a) {
            case da.Polling:
                Da = window.setTimeout(Ea, Fa);
                break;
            case da.Queued:
                Ea();
                break
        }
    }
    function Kb(a) {
        var f = $("#chat");
        a.events && a.events.length && Aa.report_speaking(a.events[a.events.length - 1].time_stamp);
        gb(a).appendTo(f);
        $.preload(".message img.user-image", {placeholder: null,notFound: Wa});
        P(false, true);
        var l = 10, n = f.find("img").filter(function() {
            return !!$(this).attr("src")
        }), s = function() {
            if (l == 0 || n.filter(function() {
                return !this.complete
            }).length == 0) {
                f.show();
                containers.needyMonologues.withAllButTakeYourTime(function() {
                    ka($(this), true)
                });
                containers.needyMonologues.spill();
                $.scrollTo("#bottom", 0);
                fb = 500;
                $("#input").focus();
                if (k) {
                    $("#loading").remove();
                    $("#topbuttons").show();
                    h()
                } else
                    $("#loading").fadeOut(function() {
                        $(this).remove()
                    })
            } else {
                l--;
                window.setTimeout(s, 200)
            }
        };
        s();
        Ca = false;
        O.relayout();
        ja = da.Waiting;
        Za(1E4);
        Ya(true)
    }
    function gb(a) {
        var f = $([]), l, n, s, z, B, F = 0, J = false;
        if (a.events) {
            $.each(a.events, function(ca, V) {
                if (V.event_type == G.TimeBreak)
                    J = true;
                else {
                    var ia = V.user_id, qb = !ia || ia != l, $a = V.time_stamp - n, Pa = J || $a > ib || qb && F % (nb + 1) == 0;
                    if (J)
                        f = f.add(L("", "timebreak"));
                    if (qb || Pa || V.content && V.content.match(/^[-=]{3,}$/)) {
                        Pa = Pa || V.time_stamp - B > mb;
                        if ($a > jb)
                            f = f.add(L(timeSpanString($a, true) + " later&hellip;"));
                        s = sa(ia, V.user_name);
                        f = f.add(s);
                        if (ia && 
                        !shouldShowUser(ia)) {
                            showHideMonologue(s, true);
                            s.hide()
                        }
                        if (Pa) {
                            K(s, V.time_stamp);
                            B = V.time_stamp;
                            F = 0
                        }
                        z = s.find("div.messages");
                        l = V.user_id;
                        F++;
                        s.putInto(containers.needyMonologues)
                    }
                    N(V).appendTo(z);
                    n = V.time_stamp;
                    J = false
                }
            });
            return f
        }
    }
    function Ea() {
        if (ja == da.Waiting) {
            ab();
            var a;
            if (Ca) {
                var f = "/chats/" + b.id + "/events";
                a = fkey({since: ba,mode: "Messages",msgCount: xa});
                if (i)
                    a.highlights = true;
                ja = da.Polling;
                var l = (new Date).getTime();
                Qa = now();
                $.post(f, a, function(n) {
                    pb(n, l)
                })
            } else if (oa > 0) {
                oa--;
                Qa = Oa = now();
                Ya(true)
            } else {
                f = 
                "/events";
                a = fkey();
                a[(i ? "h" : "r") + b.id] = ba;
                ja = da.Polling;
                Qa = now();
                $.post(f, a, function(n) {
                    rb(n, false)
                })
            }
        }
    }
    function ab() {
        if (Da) {
            window.clearTimeout(Da);
            Da = null
        }
    }
    function sb() {
        if (secondsSince(Qa) > 5 + tb / 1E3) {
            ab();
            debugMessage("polling stalled, restarting");
            ja = da.Waiting;
            Ea()
        }
        if (secondsSince(Oa) > 15) {
            Ra++;
            Ra > 0 && Ra % 4 == 0 && R("There seems to be a problem connecting to the server. Please check your internet connection and reload this page.", "server-connect")
        } else
            Ra = 0
    }
    function Lb(a) {
        return function(f) {
            if (!f.id || 
            $("#message-" + f.id).length > 0) {
                f = a.closest(".monologue");
                a.remove();
                ka(f)
            } else {
                a.addClass("posted").removeClass("pending").attr("id", "message-" + f.id);
                a.info("time", f.time)
            }
        }
    }
    function Mb(a) {
        return function(f, l) {
            var n = l;
            if (l == "error")
                n = f.getResponseHeader("chat") == "error" ? f.responseText : "An unknown error has occurred";
            var s = $("<i></i>").text(" - " + n + " - ");
            n = $("<a href='#'>retry</a>").click(function(B) {
                s.remove();
                ub(a);
                B.preventDefault()
            });
            var z = $("<a href='#'>cancel</a>").click(function(B) {
                s.remove();
                var F = a.closest(".monologue");
                a.remove();
                ka(F);
                B.preventDefault()
            });
            a.find("img.progressbar").remove();
            s.append(n, "<span> / </span>", z).appendTo(a)
        }
    }
    function bb(a) {
        if (a == "ok")
            return true;
        R(a);
        return false
    }
    function ub(a) {
        S();
        $("#input").focus();
        var f, l;
        if (a.attr("id").search(/^pending-message-/) != -1) {
            f = "/chats/" + b.id + "/messages/new";
            l = Lb(a)
        } else {
            f = "/messages/" + a.messageId();
            l = function(n) {
                a.removeClass("pending");
                if (bb(n, a))
                    a.addClass("posted");
                else {
                    a.data("source", null);
                    a.html(a.data("previous_content")).data("previous_content", 
                    null)
                }
            }
        }
        $.ajax({type: "POST",url: f,data: fkey({text: a.data("source")}),success: l,dataType: "json",error: Mb(a)})
    }
    function ha() {
        var a = $("#input").val() || "", f = false, l = false, n = a.match(/[\n\r]/);
        if (!a || a.length == 0 || $.trim(a).length == 0)
            a = "";
        else if (a.length > 500 && !n)
            l = true;
        else
            f = true;
        f || a.length == 0 ? $("#sayit-button").removeAttr("disabled").removeClass("disabled") : $("#sayit-button").attr("disabled", "disabled").addClass("disabled");
        a.length == 0 ? $("#upload-file").removeAttr("disabled").removeClass("disabled") : 
        $("#upload-file").attr("disabled", "disabled").addClass("disabled");
        na.tooLong(l);
        n ? $("#codify-button").fadeIn() : $("#codify-button").fadeOut();
        return f ? a : null
    }
    function Sa() {
        var a = ha();
        if (a) {
            $("#input").val("");
            ha();
            if (a == "//test")
                runTests();
            else if (a == "//cash")
                findCacheLeaks();
            else {
                var f = ra();
                if (f.length > 0) {
                    if (f.hasClass("pending")) {
                        $("#input").val(a);
                        ha();
                        R("This message cannot be edited before it has been received by the server. Please try again.");
                        return
                    }
                    f.addClass("pending").data("source", a);
                    f.data("previous_content", 
                    f.html());
                    f.html(u(a))
                } else {
                    f = $("#chat > div.monologue:last div.message:last");
                    var l;
                    if (f.hasClass("pending"))
                        l = f.closest(".monologue");
                    else {
                        f = f.length == 0 ? 0 : f.messageId();
                        l = pa(d, f + cb + 1E3, now(), users[d].name)
                    }
                    f = $("<div/>").addClass("message pending").attr("id", "pending-message-" + cb);
                    f.html(u(a)).appendTo(l.find(".messages"));
                    f.data("source", a);
                    $.scrollTo(f, 200);
                    cb++;
                    P(true);
                    k || Eggs.Current(a)
                }
                ub(f);
                I();
                oa = 0;
                if (Fa - secondsSince(Oa) * 1E3 > 2E3) {
                    ab();
                    Da = window.setTimeout(Ea, 2E3)
                }
                Fa = 2E3;
                aa.clear()
            }
        }
    }
    function vb(a, 
    f, l) {
        l && $(l).toggleClass("user-" + f);
        f == "flag" && !Ma && a.find(".flash").toggleClass("flag-indicator");
        f = {star: "starred",flag: "flagged"}[f];
        a.info(f, !a.info(f))
    }
    function ta(a, f, l, n) {
        var s = $(a);
        s.hasClass("message") || (s = s.closest(".message"));
        a = n;
        if (f == "star" || f == "flag") {
            var z = s.find("." + f + "s");
            vb(s, f, z);
            a = function(B) {
                if (B != "ok") {
                    vb(s, f, z);
                    R(B || GENERIC_ERROR)
                }
            }
        }
        n = s.messageId();
        messageActionById(n, f, l, a, R)
    }
    function kb() {
        $(this).closest(".message").find(".popup").hide();
        ta(this, "star")
    }
    function Gb() {
        $(this).closest(".message").find(".popup").hide();
        ta(this, "owner-star")
    }
    function lb() {
        $(this).closest(".message").find(".popup").hide();
        confirmFlag(users[d].is_moderator) && ta(this, "flag")
    }
    function Hb() {
        $(this).hide();
        var a = $(this).closest(".message");
        ta(this, "delete", null, function(f) {
            bb(f, a)
        })
    }
    function rb(a, f) {
        if (a)
            if (a.reset)
                window.location.reload();
            else {
                var l = a[(i ? "h" : "r") + b.id];
                T.setIcc(f);
                if (l != null) {
                    if (f)
                        oa = 2;
                    pb({time: l.t,events: l.e,timeout: l.timeout,sync: a.sync,icc: f,ms: l.ms,reset: l.reset,exit: l.exit,since: l.t && l.d ? l.t - l.d : undefined})
                }
                for (var n in a) {
                    var s = 
                    a[n];
                    s != l && s.e && $.each(s.e, function(z, B) {
                        ob(B, true, f)
                    })
                }
                T.play();
                Jb();
                if (!f) {
                    oa = 0;
                    Z.broadcast({command: "poll",data: a})
                }
                Fa = Aa.get_rate() * 1E3;
                $("#poll-interval").text(Math.round(Fa));
                Ya()
            }
    }
    function Nb(a) {
        if (a.content.command)
            switch (a.content.command) {
                case "dismiss notification":
                    X.dismissSingleNotification(a.content.notification, false);
                    break;
                case "poll":
                    !Ca && !i && rb(a.content.data, true);
                    break;
                case "master closing":
                    oa = 0;
                    break;
                case "clear mention":
                    O.dismissOtherRoomMention(a.content.roomid, a.content.messageid);
                    break;
                case "leave all":
                    window.location.href = "/"
            }
    }
    function wb() {
        var a = $("#input").val(), f = a.split(/[\n\r]/g), l = false, n = false;
        $.each(f, function(s, z) {
            if (z.match(/^ {4,}/))
                l = true;
            else
                n = true
        });
        l && !n ? $.each(f, function(s, z) {
            f[s] = z.substring(4)
        }) : $.each(f, function(s, z) {
            f[s] = "    " + z
        });
        a = f.join("\n");
        $("#input").val(a)
    }
    function xb(a) {
        if (!a && !Ga)
            return false;
        var f = ra();
        if (f.length == 0)
            return a ? yb() : false;
        if (!Ga)
            return false;
        var l = f.closest(".monologue");
        if (!l.hasClass("mine"))
            return false;
        var n = $("#input"), 
        s = n.val();
        if (s != f.data("source"))
            return false;
        if (n.caret().start < s.length)
            return false;
        f = a ? f.prev(".message") : f.next(".message");
        f.length || (f = a ? l.prevAll(".monologue.mine").first().find(".message:last") : l.nextAll(".monologue.mine").first().find(".message:first"));
        if (!f.length)
            return false;
        if (!(!users[d].is_moderator && secondsSince(f.info("time")) > 118)) {
            S();
            M(f);
            return true
        }
    }
    function yb() {
        var a = $("#input").val(), f = $(".monologue.mine").last().find(".message").last();
        if (f.length == 0)
            return false;
        var l = 
        users[d].is_moderator || secondsSince(f.info("time")) < 118;
        if ((!a || $.trim(a).length == 0) && f && l) {
            M(f);
            return Ga = true
        }
        return false
    }
    function Ob() {
        var a = $(".monologue.mine").last().find(".message").last(), f = users[d].is_moderator || secondsSince(a.info("time")) < 120;
        if (a.length > 0 && f)
            confirm("Delete your last message?") && ta(a, "delete", null, function(l) {
                bb(l, msg)
            });
        else
            R("Last message can't be deleted.")
    }
    function zb(a) {
        var f = $("#input");
        tabCompleter(f, d, a, b.id);
        f.bind($.browser.opera ? "keypress" : "keydown", function(l) {
            var n = 
            false;
            Ga = Ga && (l.which == 38 || l.which == 40);
            switch (l.which) {
                case 13:
                    if (!l.shiftKey && !k) {
                        Sa();
                        n = true
                    }
                    break;
                case 27:
                    f.val() || aa.clear();
                    S();
                    n = true;
                    break;
                case 38:
                    n = xb(true);
                    break;
                case 40:
                    n = xb(false);
                    break;
                case 75:
                    if (l.ctrlKey) {
                        wb();
                        n = true
                    }
                    break
            }
            if (n)
                l.preventDefault();
            else
                $.browser.opera && ha()
        }).bind("paste", ha);
        $.browser.opera || $("#input").bind("keyup", function() {
            ha()
        });
        ha();
        k || $(document).bind("keypress", function(l) {
            if (!(l.ctrlKey || l.altKey)) {
                var n;
                if (l.which && l.which != 13 && l.which != 32 && (n = l.target.nodeName.toLowerCase()) != 
                "input" && n != "textarea" && $(l.target).closest(".popup").length == 0 && (n = String.fromCharCode(l.keyCode || l.which))) {
                    f.focus();
                    $.browser.mozilla && f.val(f.val() + n)
                }
            }
        })
    }
    function Za(a) {
        tb = a;
        $.ajaxSetup({timeout: a})
    }
    function Pb() {
        $("#getmore").click(r);
        O = Mobile(b, messageActionById, function() {
            return users[d].is_owner
        }, k, {notify: R}, function() {
            return users[d].is_moderator
        }, W, fa);
        p(e);
        T = {};
        Z = {};
        aa = {};
        Na = {};
        Z.broadcast = Z.receive = T.play = T.queue = T.setIcc = aa.add = aa.clear = aa.len = Na.add = function() {
        };
        R = alert;
        X = {notify: R,
            dismissSingleNotification: function() {
            },desktop: null};
        Z.id = "n/a";
        $("#sayit-button").click(function() {
            Sa();
            $("#cancel-editing-button").hide();
            $("#gotomenu-main").show()
        });
        zb(null);
        $("#edit-last").click(function(l) {
            if (yb()) {
                $("#gotomenu-main").hide();
                $(".mobile-menu").slideUp(200);
                $("#input").attr("disabled", null).focus()
            } else
                alert("Last message cannot be edited.");
            l.preventDefault()
        });
        $("#delete-last").click(function() {
            $(".mobile-menu").slideUp(200);
            $("#input").attr("disabled", null);
            Ob()
        });
        $("#cancel-editing-button").click(function() {
            S();
            $("#gotomenu-main").show()
        });
        $.ajaxSetup({error: function(l, n) {
                var s;
                try {
                    s = l.statusText
                } catch (z) {
                    s = "unavailable"
                }
                debugMessage("AJAX request failed. Server response: " + s + ". Error: " + n)
            },cache: false});
        Za(2E4);
        var a = $("#bottom > a");
        a.click(function(l) {
            ma = !ma;
            try {
                window.localStorage && localStorage.setItem("chat:stayOnBottom", ma)
            } catch (n) {
            }
            a.text(ma ? "don't stay on bottom" : "stay on bottom");
            l.preventDefault()
        });
        try {
            window.localStorage && localStorage.getItem("chat:stayOnBottom") === "false" && a.click()
        } catch (f) {
        }
        $(window).scroll(h);
        $(document.body).bind("touchstart", h);
        $(document.body).bind("touchend", h);
        $(document.body).bind("touchmove", h);
        window.setInterval(sb, 1E4)
    }
    function Qb(a) {
        if (a)
            if ((a = a.toString()) && a.length) {
                $("#input").val(a);
                Sa()
            }
    }
    function Rb() {
        popupDismisser();
        Z = InterClientCommunicator();
        Z.receive(Nb);
        X = Notifier(Z);
        R = X.notify;
        try {
            T = SoundManager(c.sound)
        } catch (a) {
            T = {};
            T.play = T.queue = T.setIcc = function() {
            }
        }
        aa = j();
        Na = FeedTicker();
        $("#sayit-button").click(Sa);
        $("#cancel-editing-button").click(S);
        $("#codify-button").click(wb);
        $("#getmore").click(r);
        var f = $("#upload-file");
        if (f.length > 0) {
            var l = initFileUpload();
            f.click(function() {
                l.showDialog(Qb)
            })
        }
        $("#getmore-mine").click(t);
        $("#adm-delete").click(w);
        $("#adm-move").click(A);
        $("#sel-cancel").click(W);
        f = function() {
            return users[d].is_moderator
        };
        O = Sidebar(b, messageActionById, function() {
            return users[d].is_owner
        }, k, {notify: R,icc: Z}, f, W, fa, c.may_bookmark);
        $(".action-link").live("click", qa);
        $(".message .content").live("click", E);
        p(e);
        $("#active-user").data("user", d);
        o();
        zb(f);
        $.ajaxSetup({error: function(B, F) {
                var J;
                try {
                    J = B.statusText
                } catch (ca) {
                    J = "unavailable"
                }
                debugMessage("AJAX request failed. Server response: " + J + ". Error: " + F)
            },cache: false});
        Za(2E4);
        $(".user-container .signature, .user-container > .username, .user-container .avatar").live("click", UserUi(d, b.id, R, b.host).showUserPopupMenu);
        $(window).focus(function() {
            Xa = true;
            ya = 0;
            y();
            db = $("#chat > div.monologue:last div.message:last")
        });
        $(window).blur(function() {
            Xa = false;
            var B = $("#chat > div.monologue:last div.message:last");
            if (!db || B.get(0) != db.get(0)) {
                Ab = B;
                $("#chat div.catchup-marker").each(function() {
                    for (var F = 3; F > 0; F--)
                        if ($(this).hasClass("catchup-marker-" + F)) {
                            $(this).removeClass("catchup-marker-" + F);
                            F < 3 ? $(this).addClass("catchup-marker-" + (F + 1)) : $(this).removeClass("catchup-marker")
                        }
                });
                Ab.closest(".monologue").addClass("catchup-marker catchup-marker-1")
            }
        });
        $(window).scroll(h);
        if ($.browser.msie) {
            $(window).resize(function() {
                $("#input-area").css({bottom: 1});
                $("#input-area").css({bottom: 0})
            });
            window.setInterval(function() {
                $(".tweaked-z-index").not(":has(.popup)").each(function() {
                    $(this).css({zIndex: $(this).data("oldzindex")}).removeClass("tweaked-z-index")
                })
            }, 
            4E3)
        }
        if (m)
            for (var n in m) {
                f = m[n];
                f == b.id ? aa.add(n) : O.otherRoomMention(f, n)
            }
        delete m;
        if (d > 0 && X.desktop) {
            n = $('<div class="sidebar-widget"/>').appendTo("#sidebar #widgets");
            var s = $("<a/>").attr("href", "#");
            if (!X.desktop())
                c.desktopNotify = false;
            var z = function() {
                s.text((c.desktopNotify ? "dis" : "en") + "able desktop notification")
            };
            z();
            s.click(function() {
                c.desktopNotify ? $.post("/users/desktopnotify", fkey({value: false}), function() {
                    c.desktopNotify = false;
                    z()
                }) : X.desktop({callback: function() {
                        X.desktop() ? $.post("/users/desktopnotify", 
                        fkey({value: true}), function() {
                            c.desktopNotify = true;
                            z()
                        }) : R('Desktop notification is blocked by your browser; <a href="/help/desktop-notifications">help me with this</a>')
                    }});
                return false
            }).appendTo(n)
        }
        window.setInterval(sb, 1E4)
    }
    var G = {MessagePosted: 1,MessageEdited: 2,UserEntered: 3,UserLeft: 4,RoomNameChanged: 5,MessageStarred: 6,DebugMessage: 7,UserMentioned: 8,MessageFlagged: 9,MessageDeleted: 10,FileAdded: 11,ModeratorFlag: 12,UserSettingsChanged: 13,GlobalNotification: 14,AccessLevelChanged: 15,UserNotification: 16,
        Invitation: 17,MessageReply: 18,MessageMovedOut: 19,MessageMovedIn: 20,TimeBreak: 21,FeedTicker: 22,UserSuspended: 29}, da = {Waiting: 0,Polling: 1,Queued: 2}, ja = da.Waiting, Da, mb = 900, ib = 600, jb = 3600, nb = k ? 0 : 5, xa = k ? 25 : 100, Db = xa, Eb = k ? 0 : 19, ba = 0, Ca = true, Qa, Oa, Xa = true, ya = 0, cb = 0, Fa = 2E3, tb, ma = true, oa = 0, fb = 0, Ua, Va, Ra = 0, Ab, db, Fb = $("#input").length != 0, O, Z, T, R, X, aa, Na, Aa = Throttler(), za, hb = IMAGE("ajax-loader.gif"), Wa = IMAGE("ImageNotFound.png"), eb = k ? function() {
        return $("body").height() - (window.pageYOffset + screen.height)
    } : function() {
        return $("body").height() - 
        ($(window).scrollTop() + $(window).height())
    }, Bb = RegExp("^https?://(?:(?:www\\.)?(?:amazon|javari|endless)\\.\\w+\\S*(?:/dp/|/gp/product/|/ASIN/)|(?:www\\.)?amzn\\.com/(?:[\\d\\w]{3,})|area51.stackexchange.com/proposals/\\d+|[.\\w]+/rooms/(\\d+)/conversation/[\\w-]|gist\\.github\\.com/\\d+|\\S+\\.(?:jpe?g|png|gif|bmp)$|(?:bugs\\.)?(?:edge\\.)?launchpad\\.net/(?:[^/]*/\\+bug|bugs)/(\\d+)|[.\\w]+/(?:transcript|chats)/(?:message/\\d+|\\d+\\?m=)|[.\\w]+/rooms/\\d+(?:/[^/]*)?$|[.\\w]+/(?:q|questions|users)/\\d+(?:$|[?#/])|(?:www\\.)?twitter\\.com/(?:#!/)?[\\w_]+|identi\\.ca/notice/\\d+|twitpic\\.com/\\w+|manpages\\.ubuntu\\.com/manpages/.+\\.html|\\w+\\.wikipedia\\.org/wiki/\\S+|secure.wikimedia.org/wikipedia/\\w+/wiki/\\S+|(?:www\\.)?(xkcd|xckd)\\.(?:com|org)/\\d+|(?:www\\.)?youtu(?:\\.be|be\\.com)/.+|blog\\.(?:serverfault|stackoverflow|stackexchange|superuser)\\.com/(?:post/|\\d{4}))", 
    "i"), Cb = /\[\S+\](?!\()/, ga, Ba = {}, na = function() {
        var a = false, f = false, l = null, n = function() {
            var s = "";
            if (f)
                s = "This message is now too old to be edited. ";
            else if (typeof l == "number")
                s = "You have less than " + l + " seconds left for editing. ";
            if (a)
                s += "This message is too long.";
            s.length ? $("#inputerror").text(s).fadeIn() : $("#inputerror").fadeOut()
        };
        return {clear: function() {
                f = a = false;
                l = null;
                n()
            },tooLong: function(s) {
                a = s;
                n()
            },secondsLeft: function(s) {
                if (s === null) {
                    f = false;
                    l = null
                } else {
                    s |= 0;
                    if (s > 0) {
                        l = s;
                        f = false
                    } else
                        f = 
                        true
                }
                n()
            }}
    }(), Ga = true, Ma = $("#flag-count").length > 0;
    unknown_users.setRoomId(b.id);
    $(window).bind("beforeunload", function() {
        oa == 0 && Z.broadcast({command: "master closing"});
        X.desktop && X.desktop.removeAll();
        var a;
        a = "chat:draft:" + b.id;
        var f = $("#input");
        if (f.length == 0)
            a = true;
        else {
            f = f.val();
            var l = !f.length;
            try {
                f.length ? window.localStorage.setItem(a, f) : window.localStorage.removeItem(a);
                l = true
            } catch (n) {
            }
            a = l
        }
        if (!a && !O.isLeaving)
            return "This will lose your unsent message; continue?"
    });
    $("#chat").hide();
    $("#mini-help").click(function(a) {
        a.preventDefault();
        a.stopPropagation();
        var f = $("<div/>"), l = $("<a/>").html("More&hellip;").attr("href", $(this).attr("href"));
        popUp(a.pageX, a.pageY).addClass("mini-help").append(f).append(l).css("bottom", null).css("right", null);
        f.load("/faq #mini-help")
    });
    if (c.egg)
        Eggs.load(c.egg);
    else
        delete Eggs.load;
    k ? Pb() : Rb();
    Ea();
    U(null, true);
    Y(null, true);
    O.updateFiles();
    var Sb = moderatorTools(R);
    return {sidebar: O,initFlagSupport: Sb.initFlagSupport}
}
var Eggs = {};
Eggs.load = function(c) {
    var d = $("script").filter(function() {
        return /master-chat\.js/i.test(this.src)
    }).eq(0);
    if (d.length) {
        d = d.attr("src").replace(/master-chat\.js/i, "eggs.js");
        loaded = function() {
            for (var b in Eggs)
                if (!(!Eggs.hasOwnProperty(b) || b == "Current"))
                    if (b == c)
                        Eggs.Current = Eggs[b];
                    else
                        delete Eggs[b];
            c != "Asteroids" && delete window.initAsteroids
        };
        $.getScript(d, loaded)
    }
};
Eggs.Current = function() {
};
var month_name = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], weekday_name = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function now() {
    return (new Date).getTime() / 1E3 + SERVER_TIME_OFFSET
}
function secondsSince(c) {
    return now() - c
}
function localTimeSimple(c) {
    var d = new Date(c * 1E3), b = d.getMinutes(), e = (new Date).setHours(0, 0, 0, 0) / 1E3;
    b = d.getHours() + ":" + (b < 10 ? "0" : "") + b;
    if (e - c > 0)
        b = e - c < 86400 ? "yst " + b : e - c < 518400 ? weekday_name[d.getDay()] + " " + b : month_name[d.getMonth()] + " " + d.getDate() + ", " + b;
    return b
}
function plural(c, d, b) {
    if (!b)
        return c + d.substr(0, 1);
    return c + " " + d + (c != 1 ? "s" : "")
}
function timeSpanString(c, d, b, e) {
    e = e || "";
    if (c < 60)
        return plural(Math.round(c), "second", d) + e;
    if (c < 3600)
        return plural(Math.round(c / 60), "minute", d) + e;
    if (c < 86400)
        return plural(Math.round(c / 3600), "hour", d) + e;
    c = Math.round(c / 86400);
    if (c <= 2 || !b)
        return plural(c, "day", d) + e;
    d = b.getMinutes();
    d = month_name[b.getMonth()].toLowerCase() + " " + b.getDate() + " at " + b.getHours() + ":" + (d < 10 ? "0" : "") + d;
    if (c > 330)
        d = d.replace(" at ", " '" + ("" + b.getYear()).substr(2, 2) + " at ");
    return d
}
function ToRelativeTimeMini(c, d) {
    var b = secondsSince(c), e = null;
    if (d)
        e = new Date(c * 1E3);
    if (b <= 0)
        return "just now";
    return timeSpanString(b, false, e, " ago")
}
function Throttler() {
    function c(e) {
        d = e || now()
    }
    var d = now(), b = now();
    return {get_rate: function() {
            var e = Math.max(0, secondsSince(d)), k = Math.max(0, secondsSince(b));
            if (e >= 1200 || k >= 1800)
                return 15;
            return 2 + 13 * (1 - (1 - e / 1200) * (1 - k / 1800))
        },report_happening: c,report_speaking: function(e) {
            b = e || now();
            c(b)
        }}
}
function debugMessage(c) {
    $("<div class='debug-message'/>").text(c).prependTo($("#debug-messages"));
    $("#debug-message-container > h2").text("Debug (" + $(".debug-message").length + ")");
    $("#debug-messages:hidden").next().css({color: "red"})
}
function UserUi(c, d, b) {
    function e(i, m) {
        $.ajax({type: "POST",url: "/users/invite",data: fkey({UserId: i,RoomId: m}),success: function(j) {
                b && b(j)
            },dataType: "text",error: function(j, o) {
                if (b)
                    b(o == "error" ? j.status == 409 ? j.responseText : "An error occurred performing this action" : o)
            }})
    }
    function k(i) {
        var m = /^invite-(\d+)-(\d+)/.exec($(this).closest("li").attr("id")), j = parseInt(m[1]);
        m = parseInt(m[2]);
        i.preventDefault();
        e(j, m);
        $(this).closest(".popup").remove()
    }
    return {showUserPopupMenu: function(i) {
            if (!(i.button != 0 || 
            i.ctrlKey)) {
                i.stopPropagation();
                i.preventDefault();
                var m = $(this).closest(".user-container").data("user"), j = users[m], o = users[c], g = (j || {name: ""}).name, h = popUp(i.pageX, i.pageY).addClass("user-popup");
                if (m) {
                    var p = $("<a/>"), u = $("<img/>").attr("src", IMAGE("ajax-loader.gif")), v = $("<h4/>").addClass("username");
                    v.text(g);
                    p.appendTo(h);
                    u.appendTo(p);
                    v.appendTo(h);
                    $.getJSON("/users/thumbs/" + m, {showUsage: true}, function(t) {
                        if (t != null) {
                            v.text(t.name).attr("title", repNumber(t.reputation));
                            t.is_moderator && v.append("<span> &#9830;</span>");
                            v.addClass("username");
                            t.is_moderator && v.addClass("moderator");
                            t.email_hash ? u.attr("src", gravatarUrl(m, t.email_hash, 48)).addClass("user-gravatar48") : u.remove();
                            t.site && $("<img/>").attr("width", 16).attr("height", 16).attr("src", t.site.icon).addClass("small-site-logo").attr("alt", t.site.caption).attr("title", t.site.caption).appendTo(h);
                            h.append("<br style='clear:both;'/>");
                            t.user_message && t.user_message.length > 0 && $("<p/>").text(t.user_message).appendTo(h);
                            t.usage && t.usage.length > 0 && h.append(t.usage);
                            var r = [];
                            t.last_seen && m > 0 && r.push("seen <b>" + ToRelativeTimeMini(t.last_seen) + "</b>");
                            t.last_post && r.push("talked <b>" + ToRelativeTimeMini(t.last_post) + "</b>");
                            r.length && h.append("<div class='last-dates'>" + r.join(", ") + "</div>");
                            r = "/users/" + t.id + "/" + urlFriendly(t.name);
                            h.append($("<div/>").append($("<a/>").text("user profile").attr("href", r)));
                            p.attr("href", r);
                            t.profileUrl && t.profileUrl.length > 0 && h.append($("<div/>").append($("<a/>").text("user profile on " + t.host).attr("href", t.profileUrl)));
                            if (t.rooms && 
                            t.rooms.length) {
                                h.append("<h5>Rooms</h5>");
                                var x = $("<ul/>").addClass("no-bullets");
                                $.each(t.rooms, function(C, I) {
                                    x.append($("<li/>").append($("<a/>").text(I.name).attr("href", "/rooms/" + I.id + "/" + urlFriendly(I.name)).attr("target", "_self").attr("title", I.activity + " posts total" + (I.last_post ? "; last post " + ToRelativeTimeMini(I.last_post) : ""))))
                                });
                                h.append(x)
                            }
                            if (t.id != c) {
                                h.append("<h5>Actions</h5>");
                                if (t.invite_targets && t.invite_targets.length) {
                                    r = $("<div/>").appendTo(h);
                                    $("<a/>").html("invite this user&hellip;").appendTo(r).attr("href", 
                                    "#").click(function(C) {
                                        $(this).next().slideToggle();
                                        C.preventDefault()
                                    });
                                    var y = $("<ul/>").addClass("no-bullets").appendTo(r).hide();
                                    $.each(t.invite_targets, function(C, I) {
                                        var Q = I.name;
                                        if (I.id == d)
                                            Q = "<b>" + Q + "</b>";
                                        y.append($("<li/>").attr("id", "invite-" + m + "-" + I.id).append($("<a/>").html("&hellip;to " + Q).attr("href", "#").click(k)))
                                    })
                                }
                                if (m > 0 && j && !j.is_moderator && o && o.is_owner && t.is_registered)
                                    h.append($("<div/>").append($("<a/>").text((j.is_owner ? "remove" : "add") + " as room-owner").attr("href", "#").click(function() {
                                        $.post("/rooms/setuseraccess/" + 
                                        d, fkey({aclUserId: m,userAccess: j.is_owner ? "read-write" : "owner"}), function(C) {
                                            if (C && C.length > 0)
                                                b(C);
                                            else {
                                                j.is_owner = j.is_owner ? false : true;
                                                $(".user-container.user-" + m + " .username").toggleClass("owner")
                                            }
                                        });
                                        h.remove();
                                        return false
                                    })));
                                t.may_pairoff && h.append($("<div/>").append($("<a/>").text("start a new room with this user").attr("href", "#").click(function(C) {
                                    C.preventDefault();
                                    promptUser(C, "<p>To create a new room and automatically invite this user, please enter a name for the new room.</p><p>Please note that the room will be public, and anybody can join your conversation.</p><p>You will automatically enter the new room upon creation.</p>", 
                                    "Room for " + o.name + " and " + t.name, function(I) {
                                        $.post("/rooms/pairoff", fkey({withUserId: t.id,name: I}), function(Q) {
                                            if (Q && /^\d+$/.test(Q))
                                                window.location.href = "/rooms/" + Q
                                        })
                                    })
                                })));
                                h.append($("<div/>").append($("<a/>").text(shouldShowUser(t.id) ? "hide posts" : "show posts").attr("href", "#").click(function() {
                                    showHideForUser(t.id, shouldShowUser(t.id));
                                    h.remove();
                                    return false
                                })));
                                if (c > 0)
                                    h.append($("<div/>").append($("<a/>").text(shouldShowUser(t.id) ? "ignore this user (everywhere)" : "don't ignore this user").attr("href", 
                                    "#").click(function() {
                                        $.post("/users/ignorelist/" + (shouldShowUser(t.id) ? "add" : "remove"), fkey({id: t.id}));
                                        showHideForUser(t.id, shouldShowUser(t.id), false, true);
                                        h.remove();
                                        return false
                                    })));
                                t.id > 0 && !t.is_moderator && o.is_moderator && h.append($("<div/>").append($("<a/>").text("kick this user").attr("href", "#").click(function(C) {
                                    C.preventDefault();
                                    if (window.confirm("Do you want to kick this user out of this room?")) {
                                        $.post("/rooms/kickuser/" + d, fkey({userId: t.id}));
                                        h.close()
                                    }
                                })))
                            }
                        }
                    })
                } else
                    h.append("<p>no user data available</p>")
            }
        }}
}
function showHideForUser(c, d, b, e) {
    if (c) {
        c = c.toString();
        var k = hiddenUsers[c];
        if (!(!b && (k && d || !k && !d))) {
            hiddenUsers[c] = d;
            $(".monologue.user-" + c).each(function() {
                showHideMonologue(this, d, e)
            });
            c = $("#present-user-" + c);
            d ? c.addClass("ignored") : c.removeClass("ignored")
        }
    }
}
function showHideMonologue(c, d, b) {
    c = $(c).andSelf();
    d ? c.hide(b ? 500 : 0) : c.show(b ? 500 : 0)
}
function shouldShowUser(c) {
    return c && hiddenUsers[c.toString()] ? false : true
}
function promptUser(c, d, b, e, k, i, m) {
    var j = popUp(c.pageX, c.pageY);
    $("<div/>").html(d).appendTo(j);
    var o, g;
    g = m ? function(h) {
        h = m(h) || "";
        j.find(".error").remove();
        if (h.length) {
            $("<div/>").text(h).addClass("error").appendTo(j);
            j.find(".button").addClass("disabled");
            return false
        } else
            j.find(".button").removeClass("disabled");
        return true
    } : function() {
        return true
    };
    o = k ? $("<textarea/>").keypress(function() {
        g(o.val())
    }) : $("<input/>").attr("type", "text").keypress(function(h) {
        var p = o.val();
        if (g(p) && h.which == 13) {
            e(p);
            j.close()
        }
    });
    o.val(b || "").appendTo(j);
    i && i(o);
    $("<p><span class='button'>OK</span></p>").appendTo(j).click(function() {
        var h = o.val();
        if (g(h)) {
            e(h);
            j.close()
        }
    });
    b && o.caret(0, b.length);
    g(b || "");
    j.show()
}
function tabCompleter(c, d, b, e) {
    function k(g) {
        var h = $("#tabcomplete");
        h.empty();
        g.length > 5 || !g.length || $.each(g, function(p, u) {
            var v = $("<li/>").text(u).appendTo(h);
            u.toLowerCase() == j.toLowerCase() && v.addClass("chosen")
        })
    }
    function i() {
        var g = c.caret().start, h = c.val(), p = h.substring(g).search(/[\s._!?();:+-]/);
        if (p == -1)
            p = h.length - g;
        h = h.substring(0, g + p).match(/@[^\s._!?();:+-]+$/);
        if (!h)
            return null;
        if (b && b() && h.length == 1 && h[0] == "@@") {
            g = popUp().addClass("mention-any");
            g.append("<div>loading&hellip;</div>").load("/users/any/" + 
            e);
            g.show();
            return null
        }
        h = h[0].substr(1);
        p = g + p;
        return {start: p - h.length,pos: g,end: p,name: h}
    }
    function m(g) {
        var h = i();
        if (h.name == g)
            c.focus();
        else {
            oldval = c.val();
            c.val(oldval.substring(0, h.start) + g + oldval.substring(h.end));
            newpos = h.start + g.length;
            c.caret(newpos, newpos)
        }
    }
    var j = null, o = RegExp("[^\\w" + diacritics + "]|_", "ig");
    $("#tabcomplete > li").live("click", function() {
        $(this).parent().find("li.chosen").removeClass("chosen");
        m($(this).addClass("chosen").text())
    });
    c.bind($.browser.opera ? "keypress" : "keydown", 
    function(g) {
        var h;
        if (g.which == 9) {
            h = $("#tabcomplete li");
            if (!h.length)
                return;
            var p = h.filter(".chosen").removeClass("chosen");
            p = g.shiftKey ? p.prev() : p.next();
            p.length || (p = g.shiftKey ? h.last() : h.first());
            h = p.addClass("chosen").text()
        } else if (g.which == 27) {
            h = $("#tabcomplete li");
            if (!h.length)
                return;
            h = j;
            j = null;
            g.preventDefault();
            g.stopImmediatePropagation()
        } else
            return;
        g.preventDefault();
        m(h)
    });
    c.bind("keyup click", function(g) {
        if (g.which)
            switch (g.which) {
                case 9:
                case 16:
                case 17:
                case 18:
                case 220:
                    return
            }
        var h = 
        i();
        if (h) {
            if (j != h.name) {
                g = [];
                j = h.name;
                h = RegExp("^" + normalizeUserName(h.name.toLowerCase()));
                for (var p = usersByActivity(), u = p.length, v = 0; v < u; v++) {
                    var t = p[v], r = t.name, x = normalizeUserName(r);
                    t.id != d && x.match(h) && g.push(r.replace(o, ""))
                }
                k(g)
            }
        } else {
            j = null;
            k([])
        }
    })
}
$(function() {
    $("#debug-message-container > h2").click(function() {
        $("#debug-messages").slideToggle();
        $(this).css({color: "black"})
    });
    $("#debug-messages").dblclick(function() {
        $(".debug-message").slideUp(function() {
            $(this).remove()
        });
        $("#debug-message-container > h2").text("Debug (0)")
    })
});
function runTests() {
    test_functions = {chatContainsOnlyMonologuesAndSystemMessages: function() {
            var c = true;
            $("#chat").children().each(function() {
                if (!($(this).hasClass("monologue") || $(this).hasClass("system-message-container"))) {
                    $(this).addClass("failed-test");
                    c = false
                }
            });
            return c
        },userContainerDataAndClassMatch: function() {
            var c = true;
            $(".user-container").each(function() {
                if (!$(this).hasClass("user-" + $(this).data("user"))) {
                    $(this).addClass("failed-test");
                    c = false
                }
            });
            return c
        },eachCollapsibleHasOneMoreLink: function() {
            var c = 
            true;
            $(".collapsible").each(function() {
                if ($(this).closest(".sidebar-widget").find(".more").length != 1) {
                    $(this).addClass("failed-test");
                    c = false
                }
            });
            return c
        },eachMessageHasIdAndTime: function() {
            var c = true;
            $(".message").each(function() {
                if (!(/^message-\d+$/.test($(this).attr("id")) && $(this).info("time") != undefined)) {
                    $(this).addClass("failed-test");
                    c = false
                }
            });
            return c
        },monotoneMessageTimeAndId: function() {
            var c = true, d = 0, b = 0;
            $(".message").not(".pending").each(function() {
                var e = $(this).info("time"), k = $(this).attr("id").replace("message-", 
                "");
                if (1 * e < 1 * d || 1 * k <= 1 * b) {
                    $(this).addClass("failed-test");
                    c = false
                }
                d = e;
                b = k
            });
            return c
        },enoughTimeStamps: function() {
            var c = true, d = 0;
            $(".message").not(".pending").each(function() {
                var b = $(this).info("time");
                if (b - d > 600 && $(this).closest(".monologue").find(".timestamp").length != 1) {
                    $(this).addClass("failed-test");
                    c = false
                }
                d = b
            });
            return c
        }};
    $.each(test_functions, function(c, d) {
        debugMessage(c + ": " + (d() ? "success" : "failure"))
    })
}
function findCacheLeaks() {
    var c = total = handlers = 0;
    for (var d in $.cache) {
        total++;
        "events" in $.cache[d] && handlers++;
        if ($("[" + $.expando + "=" + d + "]").length == 0 && d != document[$.expando] && $.cache[d] != $(window).data()) {
            c++;
            console.log(d);
            console.log($.cache[d])
        }
    }
    debugMessage(c + " out of " + total + " cache entries are for elements that aren't in the dom, " + handlers + " have event handlers")
}
function initTranscript(c, d, b, e, k) {
    function i() {
        var r = $(this).closest(".message"), x = r.attr("id").replace("message-", ""), y = $("<div/>").insertAfter(r.find(".content")), C = $("<img/>").attr("src", IMAGE("ajax-loader.gif")).appendTo(y);
        $.get("/message/" + x + "?plain=true", function(I) {
            C.hide();
            var Q = $("<textarea/>").css({width: "80%",height: 50,"float": "left"}).val(I).appendTo(y);
            $("<button/>").addClass("button").css({"float": "left",marginLeft: 5}).text("save").appendTo(y).click(function() {
                var M = Q.val();
                C.show();
                $.ajax({type: "POST",url: "/messages/" + x,data: fkey({text: M}),success: function() {
                        var S = PERMALINK(x);
                        if (location.href.search(S) >= 0)
                            window.location.reload(true);
                        else
                            window.location.href = S
                    },error: function() {
                        u("Editing the message has failed.");
                        C.hide()
                    }})
            });
            $("<button/>").addClass("button").css({"float": "left",marginLeft: 5}).text("cancel").appendTo(y).click(function() {
                y.remove()
            });
            $("<div/>").addClass("clear-both").appendTo(y)
        })
    }
    function m() {
        var r = $(this).closest(".message"), x = r.attr("id").replace("message-", 
        "");
        confirm("Cancel the flags for this message?") && $.post("/messages/" + x + "/unflag", fkey(), function() {
            r.find(".flag-indicator").remove()
        })
    }
    function j() {
        var r = $(this).closest(".message"), x = r.attr("id").replace("message-", "");
        confirm("Delete this message?") && $.post("/messages/" + x + "/delete", fkey(), function() {
            var y = r.closest(".monologue-row");
            if (!y || !y.length)
                y = r.closest(".monologue");
            r.remove();
            y.find(".message").length == 0 && y.remove()
        })
    }
    function o() {
        var r = $(this).closest(".message");
        messageActionById(r.attr("id").replace("message-", 
        ""), r.hasClass("owner-star") ? "unowner-star" : "owner-star", null, function() {
            r.hasClass("owner-star") ? r.removeClass("owner-star") : r.addClass("owner-star")
        }, u)
    }
    function g() {
        var r = $(this).closest(".message");
        messageActionById(r.attr("id").replace("message-", ""), r.hasClass("user-star") ? "unstar" : "star", null, function() {
            r.hasClass("user-star") ? r.removeClass("user-star") : r.addClass("user-star")
        }, u)
    }
    function h() {
        if (confirmFlag(b)) {
            var r = $(this).closest(".message");
            messageActionById(r.attr("id").replace("message-", 
            ""), "flag", null, function() {
                r.addClass("user-flag")
            }, u)
        }
    }
    function p(r, x) {
        var y = $("#main"), C = y.hasClass("select-mode");
        v && v(null);
        v = r && x ? x : null;
        if (r == undefined)
            r = !C;
        $("#transcript div.message.selected").removeClass("selected");
        if (r || !C) {
            y.addClass("select-mode");
            $.browser.msie && $("#transcript *").each(function() {
                this.unselectable = "on"
            })
        } else if (!r || C) {
            y.removeClass("select-mode");
            $.browser.msie && $("#transcript *").each(function() {
                delete this.unselectable
            })
        }
    }
    var u = Notifier().notify;
    if (window.location.hash && 
    window.location.hash.length > 1)
        $(window.location.hash).addClass("highlight");
    else {
        d = $(".highlight");
        d.length > 0 && $.scrollTo(d, {offset: -100})
    }
    $.preload(".message img.user-image", {placeholder: IMAGE("ajax-loader.gif"),notFound: IMAGE("ImageNotFound.png")});
    $(".action-link").click(function(r) {
        r.stopPropagation();
        r.preventDefault();
        var x = $(this).closest(".message"), y = x.closest("#admin-flags");
        y = y != null && y.length > 0;
        r = popUp(r.pageX, r.pageY, x, y);
        var C;
        y = [];
        var I = $("<div/>").appendTo(r);
        C = x.attr("id").replace("message-", 
        "");
        I.html('<a href="' + PERMALINK(C) + '">permalink</a> | <a href="/messages/' + C + '/history">history</a><br/>');
        if (x.hasClass("user-star")) {
            C = "unstar";
            y.push("starred")
        } else
            C = "star";
        var Q = $(this).closest(".monologue").hasClass("mine");
        e && !Q && $("<span/>").addClass("star").html('<span class="sprite sprite-icon-star"> </span>' + C + " as interesting").click(g).click(r.close).attr("title", "Add a star to indicate an interesting message, for example to display in the room's highlights").appendTo(r);
        if (x.hasClass("user-star")) {
            C = 
            "unpin";
            y.push("pinned")
        } else
            C = "pin";
        if (c) {
            r.append("<br/>");
            $("<span/>").addClass("star").html('<span class="sprite sprite-ownerstar-on"> </span>' + C + " this message").click(o).click(r.close).attr("title", "Pinning is like adding a star, but pinned items takes priority; this option is only available to the room owner.").appendTo(r)
        }
        var M = x.hasClass("user-flag");
        M && y.push("flagged");
        y.length > 0 && I.html(I.html() + "You have " + y.join(" and ") + " this message.<br/>");
        if (!M && e && !Q) {
            r.append("<br/>");
            $("<span/>").addClass("flag").html('<span class="sprite sprite-icon-flag"> </span> flag as spam/offensive').click(h).click(r.close).attr("title", 
            "Flagging a message helps bring inappropriate content to the attention of moderators and other users, for example spam or abusive messages." + C).appendTo(r)
        }
        if (b) {
            r.append("<br/><br/>");
            $("<span/>").addClass("edit").text("edit").click(i).click(r.close).attr("title", "click to edit").appendTo(r);
            if (x.find(".flag-indicator").length > 0) {
                r.append(" | ");
                $("<span/>").addClass("edit").text("cancel flags").click(m).click(r.close).attr("title", "Cancel the flags against this message").appendTo(r)
            }
            r.append(" | ");
            $("<span/>").addClass("edit").text("delete").click(j).click(r.close).attr("title", "Delete this message").appendTo(r)
        }
        r.append("<br/><br><small>(changes will not show until you reload)</small>")
    }).find(".img").addClass("menu");
    $(".message:has(a.reply-info)").live("hover", function(r) {
        var x = $(this).find("a.reply-info").attr("href").replace(/^.*#/, "");
        r.type == "mouseover" ? $("#message-" + x).addClass("reply-parent") : $("#message-" + x).removeClass("reply-parent")
    });
    $(".message > .content > .partial").each(function() {
        var r = 
        $(this), x = $("<a/>").addClass("more-data").text("(see full text)").attr("href", "/messages/" + k + "/" + r.closest(".message").attr("id").replace("message-", ""));
        x.click(function(y) {
            if (!(y.button != 0 || y.ctrlKey)) {
                var C = $("<span/>").html("loading&hellip;");
                C.insertAfter($(this).hide());
                $.ajax({type: "GET",url: $(this).attr("href"),success: function(I) {
                        r.removeClass("partial").addClass("full");
                        r.is("pre") ? r.html(I.replace(/^    /mg, "")) : r.html(I.toString().replace(/^:\d+ /, "").replace(/\r\n?|\n/g, " <br> "));
                        C.add(x).remove()
                    }});
                y.preventDefault()
            }
        });
        r.closest(".content").append(" ", x)
    });
    $(".signature .username a").each(function() {
        $(this).attr("title", $(this).text())
    });
    initSearchBox();
    d = $("#sidebar .room-mini .room-current-user-count");
    if (d.length > 0)
        if ((d = d.text()) && d.length > 0)
            $("#sidebar #join-room").text("join " + (d == "1" ? "1 user" : d + " users") + " in this room now");
    var v;
    $(".message .content").live("click", function(r) {
        if ($("#main").hasClass("select-mode")) {
            r.preventDefault();
            r.stopImmediatePropagation();
            r = $(this).closest(".message");
            v && v(r)
        }
    });
    if ($("#bookmark-button").length) {
        var t = ConversationSelector(k, p, u, $("#transcript"));
        $("#bookmark-button").click(function(r) {
            r.preventDefault();
            t.Dialog()
        })
    }
    return {notify: u}
}
function Mobile(c) {
    function d(j, o) {
        var g = j.parent().find(".menupager");
        if (o == undefined)
            o = parseInt(g.find(".menupager-page").text()) - 1 || 0;
        var h = j.find("li"), p = Math.ceil(h.length / 5);
        o = Math.max(0, Math.min(p - 1, o));
        h.hide();
        h.slice(o * 5, (o + 1) * 5).show();
        g.setVisible(p > 1);
        g.find(".menupager-prev").setVisible(o > 0);
        g.find(".menupager-next").setVisible(o < p - 1);
        g.find(".menupager-pagecount").text(p);
        g.find(".menupager-page").text(o + 1)
    }
    function b(j, o, g, h, p, u) {
        g = $("#present-users");
        if (h == undefined)
            h = now();
        p || users[j] || 
        unknown_users.uniquePush(j);
        p = $("#present-user-" + j);
        p.find(".data > .last-activity-time").text(h);
        if (p.length == 0) {
            p = $('<li class="present-user"/>').attr("id", "present-user-" + j).addClass("user-container user-" + j).data("user", j);
            j = $('<a class="userlink"/>').appendTo(p);
            o = $('<img class="user-gravatar32" width="32" height="32"/>').attr("alt", o).attr("title", o);
            j.append($("<div/>").addClass("avatar").append(o));
            $('<div class="username" />').appendTo(j);
            p.append(span("data").append(span("last-activity-time").text(h)))
        }
        updateUserContainer(p);
        u ? p.appendTo(g) : p.prependTo(g);
        p.show();
        d(g)
    }
    function e(j) {
        $("#room-" + j).remove();
        d($("#my-rooms"))
    }
    var k = $("#menu-container > div.mobile-menu");
    $(".gotomenu").live("click", function() {
        var j = $(this).attr("id").replace(/(?:\d+-)?goto/, "single");
        if ($(this).attr("id") == "gotomenu-main" && k.filter(":visible").length > 0)
            j = "none";
        var o = $("#" + j);
        k.not(o).slideUp(200);
        switch (j) {
            case "singlemenu-people":
                d($("#present-users"), 0);
                break;
            case "singlemenu-otherrooms":
                d($("#my-rooms"), 0);
                $("#my-rooms li").each(function() {
                    var g = 
                    $(this);
                    g.find(".time-since-activity").text(ToRelativeTimeMini(g.find(".room-info > .last-message > .time").text()))
                });
                break
        }
        o.slideDown(200);
        o.length > 0 ? $("#input").attr("disabled", "disabled") : $("#input").attr("disabled", null);
        $(this).removeClass("mention")
    });
    $(".menupager-prev, .menupager-next").live("click", function() {
        var j = $(this).closest(".menupager"), o = j.parent().find("ul");
        j = parseInt(j.find(".menupager-page").text()) - 1;
        d(o, $(this).hasClass("menupager-prev") ? j - 1 : j + 1)
    });
    $("#my-rooms span.quickleave").live("click", 
    function() {
        if ($(this).hasClass("quickleave")) {
            var j = $(this).closest("li"), o = j.find("h3").text();
            if (!confirm("Do you want to leave " + o + "?"))
                return
        }
        j = j.attr("id").replace("room-", "");
        $.post("/chats/leave/" + j, fkey({quiet: true}));
        e(j)
    });
    $("#leave").click(function() {
        if (m.isLeaving || confirm("Do you want to leave this room?"))
            $.post($(this).attr("href"), fkey({quiet: true}), function() {
                window.location = "/"
            });
        return false
    });
    var i = function() {
    }, m = {relayout: i,userActivity: b,userLeave: function(j) {
            $("#present-user-" + 
            j).remove();
            d($("#present-users"))
        },leaveOtherRoom: e,otherRoomActivity: function(j, o, g, h, p, u) {
            var v = $("#room-" + j);
            if (v.length == 0) {
                v = $("<li/>").attr("id", "room-" + j);
                o = o || "(unknown)";
                var t = $("<tr/>").appendTo($("<table/>").appendTo(v)), r = $("<td/>").appendTo(t), x;
                a: {
                    x = location.search.substring(1).split("&");
                    for (var y = 0; y < x.length; y++)
                        if (x[y].length >= 8 && x[y].substring(0, 7) == "mobile=") {
                            x = x[y];
                            break a
                        }
                    x = ""
                }
                if (x.length)
                    x = "?" + x;
                $("<a class='button quickswitch'/>").appendTo(r).attr("href", "/rooms/" + j + "/" + urlFriendly(o) + 
                x).text("go");
                $("<span class='quickleave button'/>").appendTo(r).text("leave");
                $("<div/>").append($("<h3/>").text(o)).appendTo($("<td/>").appendTo(t)).append($("<span/>").text(g ? g + ", " : "")).append($("<span/>").addClass("time-since-activity").text(ToRelativeTimeMini(p)));
                v.append(div("room-info").append(div("last-message").append(span("user-name"), ": ", span("text"), div("time data"))))
            }
            t = v.data("message_id") || 0;
            if (u && u >= t) {
                if (arguments.length > 2) {
                    v.find(".room-info > .last-message > .user-name").text(g);
                    v.find(".room-info > .last-message > .text").text($("<span>" + (h || "") + "</span>").text());
                    v.find(".room-info > .last-message > .time").text(p);
                    v.find("div:first > span:first").text(g ? g + ", " : "");
                    v.find(".time-since-activity").text(ToRelativeTimeMini(p))
                }
                v.data("message_id", u)
            }
            v.prependTo("#my-rooms");
            d($("#my-rooms"))
        },otherRoomMention: function(j) {
            $("#room-" + j + ", #gotomenu-otherrooms, #gotomenu-main").addClass("mention")
        },updateStars: function() {
            $("#starred-posts ul").load("/chats/stars/" + c.id + "?count=3")
        },
        updateFiles: i,updateRoomMeta: i,updateAdminCounters: i,loadUser: function(j, o, g, h) {
            b(j, o, false, g, h, true)
        },loadingFinished: i,dismissOtherRoomMention: function(j) {
            $("#room-" + j).removeClass("mention");
            $("#my-rooms > li.mention").length == 0 && $("#gotomenu-otherrooms, #gotomenu-main").removeClass("mention")
        }};
    return m
}
function ConversationSelector(c, d, b, e) {
    function k() {
        var t;
        try {
            t = $.parseJSON(window.localStorage.getItem(v))
        } catch (r) {
            return false
        }
        if (t && t.roomId == c) {
            if ((new Date).getTime() - t.time > 6E5)
                return false;
            g = t.texts;
            h = t.ids;
            return true
        }
        return false
    }
    function i() {
        g = [];
        h = [];
        try {
            window.localStorage.setItem(v, null)
        } catch (t) {
        }
    }
    function m() {
        u.fadeOut(200, function() {
            $(this).remove()
        })
    }
    function j() {
        if (h.length < 2) {
            e.find("div.message.selected").removeClass("selected");
            h.length == 1 && $("#message-" + h[0]).addClass("selected")
        } else
            e.find("div.message").each(function() {
                var t = 
                $(this), r = t.attr("id").replace("message-", "");
                r < h[0] || r > h[1] ? t.removeClass("selected") : t.addClass("selected")
            })
    }
    function o(t) {
        if (t == null)
            m();
        else if (!t.find(".deleted").length) {
            var r = parseInt(t.attr("id").replace("message-", ""));
            t = t.find(".content").text();
            if (h.length < 2) {
                h.push(r);
                g.push(t)
            } else {
                var x = Math.abs(h[0] - r) < Math.abs(h[1] - r) ? 0 : 1;
                h[x] = r;
                g[x] = t
            }
            if (h[0] == h[1]) {
                g.pop();
                h.pop()
            } else if (h[0] > h[1]) {
                h.push(h.shift());
                g.push(g.shift())
            }
            j();
            p();
            try {
                window.localStorage.setItem(v, stringify({roomId: c,
                    texts: g,ids: h,time: (new Date).getTime()}))
            } catch (y) {
            }
        }
    }
    var g = [], h = [], p, u, v = "chat:conversationSelection";
    return {Dialog: function() {
            function t() {
                I.show();
                C.hide();
                $.ajax({type: "POST",url: "/conversation/new",data: fkey({roomId: c,firstMessageId: h[0],lastMessageId: h[1],title: y.val()}),success: function(M) {
                        if (M.ok) {
                            b(M.message);
                            i();
                            d(false)
                        } else
                            C.text(M).css("color", "red");
                        I.hide();
                        C.show()
                    },error: function(M) {
                        var S = GENERIC_ERROR;
                        if (M.responseText.length < 50)
                            S = M.responseText;
                        C.text(S).css("color", "red");
                        I.hide();
                        C.show()
                    },dataType: "json"})
            }
            d(true, o);
            $(".popup:not(.mini-help)").fadeOut(200, function() {
                $(this).remove()
            });
            u = $('<div id="conversation-sel"/>').css({width: 300,right: 200,top: 200}).appendTo("body");
            u.append("<h2>Bookmark a conversation</h2><p>A conversation is a chronological thread of chat messages that you can select, give a title to, and share.</p><p>Please <b>click the two messages</b> that define the <b>start</b> and the <b>end</b> of the conversation.</p>");
            first = $("<div/>").css({fontWeight: "bold",
                marginLeft: 10});
            last = $("<div/>").css({fontWeight: "bold",marginLeft: 10});
            u.append($("<p>First message:</p>").append(first).hide(), $("<p>Last message:</p>").append(last).hide());
            var r = $('<div><p>Give the conversation a title:</p><input type="text" /></div>').hide().appendTo(u), x = $('<button class="button"/>').text("bookmark").hide().appendTo(r), y = r.find("input").css("width", 250), C = $("<div/>").appendTo(u).hide(), I = $("<img/>").attr("src", IMAGE("ajax-loader.gif")).hide().appendTo(u);
            $('<button class="button"/>').text("cancel").appendTo(u).click(function() {
                i();
                d(false)
            });
            $("<span>&nbsp;</span>").appendTo(u);
            var Q = $('<button class="button"/>').text("clear").css("display", "none").appendTo(u).click(function() {
                i();
                p();
                j()
            });
            $("<div class='btn-close'>X</div>").prependTo(u).click(function() {
                d(false)
            });
            y.bind("change keyup click", function(M) {
                var S = $(this).val().length > 0;
                x.setVisible(S);
                M.type == "keyup" && M.which == 13 && S && t()
            });
            x.click(t);
            p = function() {
                if (g[0]) {
                    first.text(g[0].substr(0, 50));
                    first.closest("p").show()
                } else {
                    first.text("");
                    first.closest("p").hide()
                }
                if (g[1]) {
                    last.text(g[1].substr(0, 
                    50));
                    last.closest("p").show()
                } else {
                    last.text("");
                    last.closest("p").hide()
                }
                r.setVisible(h.length == 2);
                Q.css("display", h.length > 0 ? "inline" : "none")
            };
            k();
            j();
            p()
        }}
}
function ConversationViewer() {
    $("#participants li").click(function() {
        $(this).toggleClass("selected");
        var c = $("#participants li.selected").length;
        if (c > 0 && c < $("#participants li").length) {
            var d = ["div.system-message-container"], b = [];
            $("#participants li").each(function() {
                var e = "div.monologue." + $(this).attr("id").replace("participating-", "");
                $(this).hasClass("selected") ? b.push(e) : d.push(e)
            });
            $(b.join(","), "#conversation").slideDown();
            $(d.join(","), "#conversation").slideUp();
            $("#conversation div.timestamp").fadeOut()
        } else {
            $("div.monologue, div.system-message-container", 
            "#conversation").slideDown();
            $("#conversation div.timestamp").fadeIn()
        }
    })
}
function initFileUpload() {
    var c = {};
    c.removeEvent = function(b, e, k) {
        b.detachEvent ? b.detachEvent("on" + e, k) : b.removeEventListener(e, k, false)
    };
    c.addEvent = function(b, e, k) {
        b.attachEvent ? b.attachEvent("on" + e, k) : b.addEventListener(e, k, false)
    };
    var d = top.document;
    c.getPageSize = function() {
        var b, e, k, i;
        if (self.innerHeight && self.scrollMaxY) {
            b = d.body.scrollWidth;
            e = self.innerHeight + self.scrollMaxY
        } else if (d.body.scrollHeight > d.body.offsetHeight) {
            b = d.body.scrollWidth;
            e = d.body.scrollHeight
        } else {
            b = d.body.offsetWidth;
            e = d.body.offsetHeight
        }
        if (self.innerHeight) {
            k = self.innerWidth;
            i = self.innerHeight
        } else if (d.documentElement && d.documentElement.clientHeight) {
            k = d.documentElement.clientWidth;
            i = d.documentElement.clientHeight
        } else if (d.body) {
            k = d.body.clientWidth;
            i = d.body.clientHeight
        }
        return [Math.max(b, k), Math.max(e, i), k, i]
    };
    c.isIE_5or6 = /msie 6/.test(top.navigator.userAgent.toLowerCase()) || /msie 5/.test(top.navigator.userAgent.toLowerCase());
    c.isIE = /msie/.test(top.navigator.userAgent.toLowerCase());
    c.createBackground = function() {
        var b = 
        d.createElement("div");
        b.className = "wmd-prompt-background";
        style = b.style;
        style.position = "fixed";
        style.top = "0";
        style.zIndex = "1000";
        if (c.isIE)
            style.filter = "alpha(opacity=50)";
        else
            style.opacity = "0.5";
        if (c.isIE) {
            style.left = d.documentElement.scrollLeft;
            style.width = d.documentElement.clientWidth;
            style.height = d.documentElement.clientHeight
        } else {
            style.left = "0";
            style.width = "100%";
            style.height = "100%"
        }
        d.body.appendChild(b);
        return b
    };
    c.getHeight = function(b) {
        return b.offsetHeight || b.scrollHeight
    };
    c.getWidth = function(b) {
        return b.offsetWidth || 
        b.scrollWidth
    };
    c.getPageSize = function() {
        var b, e, k, i;
        if (self.innerHeight && self.scrollMaxY) {
            b = d.body.scrollWidth;
            e = self.innerHeight + self.scrollMaxY
        } else if (d.body.scrollHeight > d.body.offsetHeight) {
            b = d.body.scrollWidth;
            e = d.body.scrollHeight
        } else {
            b = d.body.offsetWidth;
            e = d.body.offsetHeight
        }
        if (self.innerHeight) {
            k = self.innerWidth;
            i = self.innerHeight
        } else if (d.documentElement && d.documentElement.clientHeight) {
            k = d.documentElement.clientWidth;
            i = d.documentElement.clientHeight
        } else if (d.body) {
            k = d.body.clientWidth;
            i = d.body.clientHeight
        }
        return [Math.max(b, k), Math.max(e, i), k, i]
    };
    c.uploadDialog = function(b) {
        var e, k, i = "upload-iframe-" + (new Date).getTime() + "-" + (Math.random() * 1E5 | 0), m = function(o) {
            (o.charCode || o.keyCode) === 27 && j(null)
        };
        e = $("<div style='top: 50%; left: 50%; display: block; padding: 10px; position: fixed; width:400px; z-index:1001' class='wmd-prompt-dialog'><div style='position: absolute; right: 20px; bottom: 5px; font-size: 10px;'>image hosting by <a title='imgur: the simple image sharer' href='http://imgur.com'>imgur.com</a></div><p><b>Insert an image</b></p><p style='padding-top: 10px;'><a href='#' class='wmd-mini-button selected' id='upload-image-button'>from my computer</a><a href='#' class='wmd-mini-button' id='upload-url-button'>from the web</a></p><iframe id='" + 
        i + "' style='display:none;' src='about:blank' name='" + i + "'/><form action='/upload/image' method='post' enctype='multipart/form-data'><div style='position: relative' id='upload-file-input'>  <input type='file' name='filename' id='filename-input' value='browse' style='border:0; font-size:18px; position:relative; text-align:right; -moz-opacity:0; filter:alpha(opacity: 0); opacity: 0; z-index: 2;'>  <img src='http://i.imgur.com/GKc7H.png' height='15px' width='15px' style='position: absolute; left: 38px; top: 6px;'>  <div style='position: absolute; top:0px; left:0px; z-index: 1;'>    <input type='input' name='shadow-filename' value='' id='shadow-filename' style='width: 180px; margin-left:64px;'>    <input class='button' type='button' name='choose-file' id='choose-file' value='browse&hellip;' style='width: 7em; margin-left: 5px;'>  </div></div><div id='upload-url-input' style='display:none;'>    <input type='input' name='upload-url' value='' style='width: 250px;'></div><p id='upload-message' style='padding-top: 4px; margin:0; line-height: 16px;'></p><div class='ac_loading' id='image-upload-progress' style='background-color: transparent; display:none;'>Uploading&hellip;</div><input class='button' type='submit' value='upload' style='width: 7em; margin: 10px;'><input class='button' type='button' value='cancel' id='close-dialog-button' style='width: 7em; margin: 10px 10px 20px;'></form></div>");
        if (c.isIE_5or6) {
            e[0].style.position = "absolute";
            e[0].style.top = d.documentElement.scrollTop + 200 + "px";
            e[0].style.left = "50%"
        }
        k = c.createBackground();
        var j = function(o) {
            c.removeEvent(d.body, "keydown", m);
            e.remove();
            $(k).remove();
            if (b)
                b(o == undefined ? null : o);
            return false
        };
        top.setTimeout(function() {
            $(d.body).append(e);
            $("#close-dialog-button").click(function() {
                j()
            });
            var o = $("#upload-image-button"), g = $("#upload-url-button"), h = $("#upload-url-input"), p = h.parent(), u = $("#upload-file-input");
            h.remove().show();
            var v = 
            function() {
                $("#upload-message").text("click browse to choose an image from your computer")
            };
            v();
            o.click(function() {
                g.removeClass("selected");
                o.addClass("selected");
                v();
                h.remove();
                p.prepend(u);
                t();
                return false
            });
            g.click(function() {
                o.removeClass("selected");
                g.addClass("selected");
                $("#upload-message").text("paste the URL of your image above");
                p.prepend(h);
                u.remove();
                return false
            });
            var t = function() {
                $("#filename-input").click(function() {
                    this.blur()
                });
                $("#filename-input").change(function() {
                    $("#shadow-filename").val(this.value)
                })
            };
            t();
            $("#" + i);
            e.find("form").submit(function() {
                $("#upload-message").hide();
                $("#image-upload-progress").show();
                this.target = i;
                window.closeDialog = j;
                window.displayUploadError = function(r) {
                    $("#image-upload-progress").hide();
                    $("#upload-message").show().text(r)
                };
                return true
            });
            e[0].style.marginTop = -(c.getHeight(e[0]) / 2) + "px";
            e[0].style.marginLeft = -(c.getWidth(e[0]) / 2) + "px";
            c.addEvent(d.body, "keydown", m)
        }, 0)
    };
    return {showDialog: c.uploadDialog}
}
;
