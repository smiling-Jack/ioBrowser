/** jQuery
 *
 *  xtreme simpel select
 *
 *  Copyright (c) 2014 Steffen Schorling http://github.com/smiling-Jack
 *  Lizenz: [CC BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/de/)
 */


(function ($) {
    $.fn.xs_combo = function (_options, _newData) {

        if (_newData) {
            if (_options == "setData") {
                var classes = $(this).find(".xs_list_box").first().attr("data-cssText");
                $(this).find(".xs_liste").remove();

                var liste = "";
                $.each(_newData, function () {
                    liste += ('<p class="' + classes + ' xs_liste">' + this + '</p>')
                });
                $(this).find(".xs_list_box").append(liste.toString())
            }

        } else if (typeof _options == "string") {
            var text = $(this).children("span");
            $(text).text(_options);
            $(this).val(_options);
            $(this).trigger("change");
        } else if (_options == undefined) {
            return $(this).val();
        } else {

            var $this = this;

            var o = {
                cssButton: _options.cssButton || "ui-widget ui-state-default ui-corner-all " + (_options.addcssButton || ""),
                cssMenu: _options.cssMenu || "ui-widget-content ui-corner-all " + (_options.addcssMenu || ""),
                cssFocus: _options.cssFocus || "ui-state-focus ui-corner-all " + (_options.addcssFocus || ""),
                cssText: _options.cssText || "",
                width: _options.width || false,
                height: _options.height || false,
                data: _options.data || [],
                time: _options.time || 750,
                val: _options.val || "",
                combo: _options.combo
            };
            $(this).val(o.val);
            var liste = "";

            var timer;
            var readonly = "";

            if (!o.combo) {
                readonly = "readonly";
            }
            $.each(o.data, function () {
                liste += ('<p class="' + o.cssText + ' xs_liste">' + this + '</p>')
            });

            this.addClass(o.cssButton);
            this.append('<input ' + readonly + ' style="outline-color: transparent;border: none; background-color: transparent;padding-top: 0;padding-bottom: 0"  type="text" value="' + o.val + '" class="' + o.cssText + '"></input>');
            this.append('<div class="' + o.cssMenu + ' xs_list_box" data-cssText="' + o.cssText + '">' + liste.toString() + '</div>');

            this.find("div").hide();
            text = this.children("input");
            var list = this.children("div");
            var list_elem = this.children("div").children("p");

            $(list_elem)
                .mouseenter(function () {
                    $(this).addClass(o.cssFocus);
                })
                .mouseleave(function () {
                    $(this).removeClass(o.cssFocus)
                })
                .click(function () {
                    $($this).val($(this).text());
                    $(text).val($(this).text());
                    $($this).trigger("change");
                    clearTimeout(timer);
                });
            $(this)
                .mouseenter(function () {
                    $(this).addClass(o.cssFocus)
                })
                .mouseleave(function () {
                    $(this).removeClass(o.cssFocus)
                })
                .click(function () {
                    clearTimeout(timer);
                });

            $(list)
                .mouseenter(function () {
                    clearTimeout(timer);
                })
                .mouseleave(function () {
                    timer = setTimeout(function () {
                        $(list).hide();
                    }, o.time)
                });

            this.click(function () {
                $(list).toggle();
            })
                .keydown(function () {
                    $(list).hide();
                });

            $(text).change(function () {
                $($this).val($(this).val());
                $($this).trigger("change");
            });
        }

    }

})(jQuery);
