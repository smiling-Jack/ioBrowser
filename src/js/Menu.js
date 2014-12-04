/**
 * Copyright (c) 2013 Steffen Schorling http://github.com/smiling-Jack
 * Lizenz: [CC BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/de/)
 */

jQuery.extend(true, SGI, {

    menu_iconbar: function () {
        $("#menu.sf-menu").superclick({
            hoverClass: 'sfHover',
            uiClass: 'ui-state-hover',  // jQuery-UI modified
            pathClass: 'overideThisToUse',
            pathLevels: 1,
            disableHI: false
        });

        $('li.ui-state-default').hover(
            function () {
                $(this).addClass('ui-state-hover');
            },
            function () {
                $(this).removeClass('ui-state-hover');
            }
        );

//        $("#img_iconbar").tooltip();
//        $("#menu").menu({position: {at: "left bottom"}});
        $("#m_neu").click(function () {
            SGI.clear();
        });
        $("#m_save").click(function () {
//            if ($("body").find(".ui-dialog:not(.quick-help)").length == 0) {
            SGI.save_local();
//            }
        });
        $("#m_save_as").click(function () {
//            if ($("body").find(".ui-dialog:not(.quick-help)").length == 0) {
            SGI.save_as_local();
//            }
        });
        $("#m_open").click(function () {
//            if ($("body").find(".ui-dialog:not(.quick-help)").length == 0) {

            SGI.open_local();

//            }
        });
        $("#m_example").click(function () {
            if ($("body").find(".ui-dialog:not(.quick-help)").length == 0) {
                SGI.example_ccu_io();
            }
        });
        $("#ul_id_auswahl li a").click(function () {
            $("#id_js").remove();
            $("head").append('<script id="id_js" type="text/javascript" src="js/hmSelect_' + $(this).data('info') + '.js"></script>');

            storage.set("ScriptGUI_idjs", ($(this).data('info')));
        });
        $("#ul_theme li a").click(function () {
            $("#theme_css").remove();
            $("head").append('<link id="theme_css" rel="stylesheet" href="css/' + $(this).data('info') + '/jquery-ui.min.css"/>');
            setTimeout(function () {
                document.styleSheets[1].cssRules[3].style["background-color"] = $(".frame_color").css("background-color");
                document.styleSheets[1].cssRules[4].style["background-color"] = $(".frame_color").css("background-color");
            }, 300);


        });

        $("#m_setup").click(function () {
            $("#setup_dialog").dialog("open");
        });

        $("#m_show_script").click(function () {
//            if ($("body").find(".ui-dialog:not(.quick-help)").length == 0) {

            var script = Compiler.make_prg();
            SGI.show_Script(script)
//            }
        });
        $("#m_save_script").click(function () {
            SGI.save_Script();
        });
        $("#m_del_script").click(function () {
            SGI.del_script();
        });
        $("#m_quick-help").click(function () {
            SGI.open_quick_help_dialog()
        });
        $("#m_shortcuts").click(function () {

            if ($("body").find(".shortcuts").length < 1) {

                $("body").append('\
                   <div id="dialog_shortcuts" style="text-align: left" title="Tastenkominationen">\
                    <table>\
                        <tr>\
                            <td>Ctrl + ' + SGI.translate("links Klick") + ' </td>\
                            <td>-> ' + SGI.translate("Schnell Hilfe") + ' </td>\
                        </tr>\
                        <tr>\
                            <td>Shift + ' + SGI.translate("links Klick") + ' </td>\
                            <td>-> ' + SGI.translate("Markierung umschalten") + ' </td>\
                        </tr>\
                        <tr>\
                            <td>Ctrl + C</td>\
                            <td>-> ' + SGI.translate("Markierte Bausteine kopieren") + ' </td>\
                        </tr>\
                        <tr>\
                            <td>"Entf</td>\
                            <td>-> ' + SGI.translate("Alle markierten Bausteine löschen") + ' </td>\
                        </tr>\
                   </table>\
                   </div>');

                $("#dialog_shortcuts").dialog({
                    width: "auto",
                    dialogClass: "shortcuts",
                    close: function () {
                        $("#dialog_shortcuts").remove();
                    }
                });
            }
        });
        $("#m_video").click(function () {
            window.open("http://www.youtube.com/playlist?list=PLsNM5ZcvEidhmzZt_mp8cDlAVPXPychU7", null, "fullscreen=1,status=no,toolbar=no,menubar=no,location=no");

        });
        $("#m_update").click(function () {
            SGI.update(true);

        });

        $("#grid").click(function () {
            var fbs_list = $(".fbs_element");

            $.each(fbs_list, function () {
                var o_left = $(this).position().left / SGI.zoom;
                var o_top = $(this).position().top / SGI.zoom;

                var n_left = parseInt(o_left / SGI.grid + 0.5) * SGI.grid;
                var n_top = parseInt(o_top / SGI.grid + 0.5) * SGI.grid;

                $(this).css({"left": n_left + "px", "top": n_top + "px"})
            })
        });

        $("#m_mbs-image").click(function () {

            var type;
            var left = $(".mbs_element").position().left;
            var height = $(".mbs_element").height();
            var width = $(".mbs_element").width();
            var top = $(".mbs_element").position().top;

            $.each(scope.mbs, function () {
                type = this.type
            });
            $(".mbs_element, ._jsPlumb_endpoint").wrapAll('<div id="photo" style="position: relative"></div>');
            $("._jsPlumb_endpoint").wrapAll('<div id="endpoints" style="position: relative"></div>');

//          Für Trigger
            $("#endpoints").css({
                left: 0 - left + "px",
                top: -2 - top -height + "px",
                position: "relative"

            });

            $(".mbs_element").css({
                left: 0,
                top: 0,
                position: "relative"

            });
            $("#photo").css({
                height: 12 + height + "px",
                width: 3 + width + "px",
                left: "50%",
                top: "50%",
                position: "relative"
            });

//            Für Pause,Intervall,Loop
//            $("#endpoints").css({
//                left: 10 - left + "px",
//                top: 0 - top + "px",
//                position: "relative"
//
//            });

            $(".mbs_element").css({
                left: 10,
                top: 0,
                position: "relative"

            });
            $("#photo").css({
                height: 2 + height + "px",
                width: 20 + width + "px",
                left: "50%",
                top: "50%"
            });


            var data = $("#photo").html();

            data = data
                .replace("<div", '<div style="height:'+height+'px ; width:'+width+'px "')
                .replace(/(ng-model="|ng-style=")[A-Za-z0-9\[\].]+"/g, "")
                .replace(/(id=")[A-Za-z0-9\[\]._]+"/g, "")
                .replace(/(ng-)[A-Za-z0-9\[\].]+/g, "")
                .replace(/(_jsPlumb_endpoint_anchor_|jsplumb-draggable|jsplumb-droppable)/g, "")
                .replace(/(_jsPlumb_endpoint)/g, "html_endpoint")
                .replace(/(mbs_element )/g, "mbs_html ");

            var h = $(window).height() - 10;
            var v = $(window).width() - 10;

            $("body").append('\
                   <div id="dialog_html" style="text-align: left" title="Scriptvorschau">\
                    <textarea id="codemirror_html" name="codemirror" class="code frame_color ui-corner-all"></textarea>\
                    <button id="save_html">Save</button>\
                   </div>');
            $("#dialog_html").dialog({
                height: h,
                width: v,
                resizable: true,
                close: function () {
                    $("#dialog_html").remove();
                    SGI.clear();
                }
            });

            $("#save_html").button().click(function(){
                bausteine[type] =  {};
                bausteine[type]["data"] =  editor.getValue();
                bausteine[type]["h"] =  height;
                bausteine[type]["w"] =  width;
                fs.writeFile(nwDir+ '/../../src/js/bausteine.json', JSON.stringify(bausteine), function (err) {
                    if (err){
                        throw err;
                    }else{
                        $("#dialog_html").dialog("close");
                    }
                });
            });

            var editor = CodeMirror.fromTextArea(document.getElementById("codemirror_html"), {
                mode : "xml",
                htmlMode: true,
                lineNumbers: true,
                readOnly: false,
                theme: "monokai"
            });
            editor.setOption("value", html_beautify(data.toString(), {indent_size: 2}));

        });

        $("#m_fbs-image").click(function () {

            var type ="";
            var left = $(".fbs_element").position().left;
            var height = $(".fbs_element").height();
            var width = $(".fbs_element").width();
            var top = $(".fbs_element").position().top;

            $.each(scope.fbs, function () {
                type = this.type
            });
            $(".fbs_element, ._jsPlumb_endpoint").wrapAll('<div id="photo" style="position: relative"></div>');
            $("._jsPlumb_endpoint").wrapAll('<div id="endpoints" style="position: relative"></div>');

//            $("#endpoints").css({
//                left: 10 -  width + "px",
//                top: -4  - top -height + "px",
//                position: "relative"
//            });

            $("#endpoints").css({
                left: -0 - left + "px",
                top: -4  - top -height + "px",
                position: "relative",
                zindex: 10000
            });

            $(".fbs_element").css({
                left: 8,
                top: 0,
                position: "relative"
            });
            $("#photo").css({
                height: 2 + height + "px",
                width: 20 + width + "px",
                position: "relative"
            });

            var data = $("#photo").html();

            data = data
                .replace("<div", '<div style="height:'+height+'px ; width:'+width+'px "')
                .replace(/(ng-bind="fbs\[0\].name")/g, "")
                .replace(/(ng-model="|ng-style=")[A-Za-z0-9\[\].]+"/g, "")
                .replace(/(id="|ng-style=")[A-Za-z0-9\[\]._]+"/g, "")
                .replace(/(ng-)[A-Za-z0-9\[\].]+/g, "")
                .replace(/(_jsPlumb_endpoint_anchor_|jsplumb-draggable|jsplumb-droppable)/g, "")
                .replace(/(_jsPlumb_endpoint)/g, "html_endpoint")
                .replace(/(fbs_element )/g, "fbs_html ");

            var h = $(window).height() - 10;
            var v = $(window).width() - 10;

            $("body").append('\
                   <div id="dialog_html" style="text-align: left" title="Scriptvorschau">\
                    <textarea id="codemirror_html" name="codemirror" class="code frame_color ui-corner-all"></textarea>\
                    <button id="save_html">Save</button>\
                   </div>');
            $("#dialog_html").dialog({
                height: h,
                width: v,
                resizable: true,
                close: function () {

                    $("#dialog_html").remove();
                    SGI.clear();
                }
            });

            $("#save_html").button().click(function(){
                bausteine[type] =  {};
                bausteine[type]["data"] =  editor.getValue();
                bausteine[type]["h"] =  height;
                bausteine[type]["w"] =  width;
                fs.writeFile(nwDir+ '/../../src/js/bausteine.json', JSON.stringify(bausteine), function (err) {
                    if (err){
                        throw err;
                    }else{
                        $("#dialog_html").dialog("close");
                    }
                });
            });

            var editor = CodeMirror.fromTextArea(document.getElementById("codemirror_html"), {
                mode : "xml",
                htmlMode: true,
                lineNumbers: true,
                readOnly: false,
                theme: "monokai"
            });
            editor.setOption("value", html_beautify(data.toString(), {indent_size: 2}));


        });

        $("#m_show_debugscript").click(function () {


            var script = Compiler.make_prg(sim.run_type);
            SGI.show_Script(script)

        });

// Icon Bar XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Local
        $("#img_save_local").click(function () {

            SGI.save_local();


            $(this).stop(true, true).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#img_open_local").click(function () {
            SGI.open_last();

            $(this).stop(true, true).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

// Ordnen
        $("#img_set_left").click(function () {
            var items = $(".jsplumb-drag-selected");
            if (items.length > 1) {

                function SortByName(a, b) {
                    var aName = $(a).position().left;
                    var bName = $(b).position().left;
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }

                items.sort(SortByName);
                var position = $(items[0]).position().left;

                $.each(items, function () {
                    $(this).css("left", position);
                });

                var codebox = $(items.parent().parent()).attr("id");
                SGI.plumb_inst["inst_" + codebox].repaintEverything();
            }
            items = $(".mbs_selected");
            if (items.length > 1) {

                function SortByName(a, b) {
                    var aName = $(a).position().left;
                    var bName = $(b).position().left;
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }

                items.sort(SortByName);
                var position = $(items[0]).position().left;

                $.each(items, function () {
                    $(this).css("left", position);
                });

                SGI.plumb_inst["inst_mbs"].repaintEverything();
            }
            $(this).stop(true, true).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#img_set_right").click(function () {
            var position;
            var items = $(".jsplumb-drag-selected");

            if (items.length > 1) {
                function SortByName(a, b) {
                    var aName = $(a).position().left + $(a).width();
                    var bName = $(b).position().left + $(b).width();
                    return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
                }

                items.sort(SortByName);
                position = $(items[0]).position().left + $(items[0]).width();

                $.each(items, function () {
                    $(this).css("left", position - $(this).width());
                });

                var codebox = $(items.parent().parent()).attr("id");
                SGI.plumb_inst["inst_" + codebox].repaintEverything();
            }
            items = $(".mbs_selected");
            if (items.length > 1) {
                function SortByName(a, b) {
                    var aName = $(a).position().left + $(a).width();
                    var bName = $(b).position().left + $(b).width();
                    return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
                }

                items.sort(SortByName);
                position = $(items[0]).position().left + $(items[0]).width();

                $.each(items, function () {
                    $(this).css("left", position - $(this).width());
                });

                SGI.plumb_inst["inst_mbs"].repaintEverything();
            }
            $(this).stop(true, true).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#img_set_top").click(function () {
            var position;
            var items = $(".jsplumb-drag-selected");
            if (items.length > 1) {
                function SortByName(a, b) {
                    var aName = $(a).position().top;
                    var bName = $(b).position().top;
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }

                items.sort(SortByName);
                position = $(items[0]).position().top;

                $.each(items, function () {
                    $(this).css("top", position);
                });
                var codebox = $(items.parent().parent()).attr("id");
                SGI.plumb_inst["inst_" + codebox].repaintEverything();
            }
            items = $(".mbs_selected");
            if (items.length > 1) {
                function SortByName(a, b) {
                    var aName = $(a).position().top;
                    var bName = $(b).position().top;
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }

                items.sort(SortByName);
                position = $(items[0]).position().top;

                $.each(items, function () {
                    $(this).css("top", position);
                });

                SGI.plumb_inst["inst_mbs"].repaintEverything();
            }
            $(this).stop(true, true).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#img_set_bottom").click(function () {
            var position;
            var items = $(".jsplumb-drag-selected");
            if (items.length > 1) {
                function SortByName(a, b) {
                    var aName = $(a).position().top;
                    var bName = $(b).position().top;
                    return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
                }

                items.sort(SortByName);
                position = $(items[0]).position().top;

                $.each(items, function () {
                    $(this).css("top", position);
                });
                var codebox = $(items.parent().parent()).attr("id");
                SGI.plumb_inst["inst_" + codebox].repaintEverything();
            }
            var items = $(".mbs_selected");
            if (items.length > 1) {
                function SortByName(a, b) {
                    var aName = $(a).position().top;
                    var bName = $(b).position().top;
                    return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
                }

                items.sort(SortByName);
                position = $(items[0]).position().top;

                $.each(items, function () {
                    $(this).css("top", position);
                });

                SGI.plumb_inst["inst_mbs"].repaintEverything();
            }
            $(this).stop(true, true).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#img_set_steps").click(function () {

            var items = $(".jsplumb-drag-selected");
            if (items.length > 1) {
                function SortByTop(a, b) {
                    var aName = $(a).position().top;
                    var bName = $(b).position().top;
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }

                function SortByLeft(a, b) {
                    var aName = $(a).position().left;
                    var bName = $(b).position().left;
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }

                var top_list = items.sort(SortByTop);
                var left_list = items.sort(SortByLeft);
                var left = $(left_list[0]).position().left;
                var top = $(top_list[0]).position().top;

                var step = 0;


                $.each(items, function () {
                    $(this).css("left", left + step);
                    $(this).css("top", top + step);

                    top = top + parseInt($(this).css("height").split("px")[0]);


                    step = step + 9;
                });
                var codebox = $(items.parent().parent()).attr("id");
                SGI.plumb_inst["inst_" + codebox].repaintEverything();

            }
            var items = $(".mbs_selected");
            if (items.length > 1) {
                function SortByTop(a, b) {
                    var aName = $(a).position().top;
                    var bName = $(b).position().top;
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }

                function SortByLeft(a, b) {
                    var aName = $(a).position().left;
                    var bName = $(b).position().left;
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }

                var top_list = items.sort(SortByTop);
                var left_list = items.sort(SortByLeft);
                var left = $(left_list[0]).position().left;
                var top = $(top_list[0]).position().top;

                var step = 0;


                $.each(items, function () {
                    $(this).css("left", left + step);
                    $(this).css("top", top + step);

                    top = top + parseInt($(this).css("height").split("px")[0]);


                    step = step + 9;
                });

                SGI.plumb_inst["inst_mbs"].repaintEverything();
            }
            $(this).stop(true, true).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

// Scale
        $("#img_set_zoom").click(function () {
            SGI.zoom = 1;

            $.each(SGI.plumb_inst, function (idx) {
                SGI.plumb_inst[idx].setZoom(SGI.zoom);
            });


            $("#prg_panel").css({
                "transform": "scale(" + SGI.zoom + ")",
                "-ms-transform": "scale(" + SGI.zoom + ")",
                "-webkit-transform": "scale(" + SGI.zoom + ")"
            });
            $(this).stop(true, true).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );
        $("#img_set_zoom_in").click(function () {
            SGI.zoom = SGI.zoom + 0.1;
            $.each(SGI.plumb_inst, function (idx) {
                SGI.plumb_inst[idx].setZoom(SGI.zoom);
            });
            $("#prg_panel").css({
                "transform": "scale(" + SGI.zoom + ")",
                "-ms-transform": "scale(" + SGI.zoom + ")",
                "-webkit-transform": "scale(" + SGI.zoom + ")"
            });

            $(this).stop(true, true).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );
        $("#img_set_zoom_out").click(function () {
            SGI.zoom = SGI.zoom - 0.1;
            $.each(SGI.plumb_inst, function (idx) {
                SGI.plumb_inst[idx].setZoom(SGI.zoom);
            });

            $("#prg_panel").css({
                "transform": "scale(" + SGI.zoom + ")",
                "-ms-transform": "scale(" + SGI.zoom + ")",
                "-webkit-transform": "scale(" + SGI.zoom + ")"
            });

            $(this).stop(true, true).effect("highlight");
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        var script_engine_lock = false;
        $("#img_set_script_engine").click(function () {
            if (!script_engine_lock) {
                try {

//                    SGI.socket.emit("reloadScriptEngine");


                } catch (err) {
                    alert("Keine Verbindung zu CCU.IO");
                }

                script_engine_lock = true;
                $(this).stop(true, true).effect("highlight", "linear", 6000, function () {
                    script_engine_lock = false;
                })

            }
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

// Grid
        $("#img_set_grid_on").click(function () {
                if ($(this).hasClass("ui-state-focus")) {
                    scope.setup.snap_grid = false;
                } else {
                    scope.setup.snap_grid = true;
                }
                scope.$apply();
                $(this).stop(true, true).effect("highlight")
            }
        );
// Tolltip
        $("#img_set_tooltip_on").click(function () {
                if ($(this).hasClass("ui-state-focus")) {
                    scope.setup.tooltip = false;
                } else {
                    scope.setup.tooltip = true;
                }
                scope.$apply();
                $(this).stop(true, true).effect("highlight")
            }
        );
// Connection


        $("#btn_con_offline").click(function () {
            $(this).parent().stop(true, true).effect("highlight");
            if ($(this).parent().hasClass("div_img_glass_on")) {
                SGI.disconnect()
            } else {
                SGI.disconnect()
                SGI.offline()
            }
        }).hover(
            function () {
                $(this).parent().addClass("ui-state-focus");
            }, function () {
                $(this).parent().removeClass("ui-state-focus");
            }
        );
        $("#btn_con_online").click(function () {
            $(this).parent().stop(true, true).effect("highlight");
            if ($(this).parent().hasClass("div_img_glass_on")) {
                SGI.disconnect()
            } else {
                SGI.disconnect()
                SGI.online()
            }

        }).hover(
            function () {
                $(this).parent().addClass("ui-state-focus");
            }, function () {
                $(this).parent().removeClass("ui-state-focus");
            }
        );

// Live Test
        $("#img_set_script_play").button().click(function () {
                if (SGI.con_data) {

                    sim.simulate();
                    $(this).append('<div id="play_overlay"  ></div>')
                } else {
                    alert("Keine Online/Offline daten")
                }
            }
        ).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#img_set_script_stop").button().click(function () {
                sim.stopsim();
            }
        ).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );


        $("#run_type").buttonset();


        $('.run_type').click(function () {
            sim.run_type = $(".run_type:checked").data("info");
        });


        $("#prg_panel").on("click", ".btn_min_trigger", function () {
            if (!SGI.sim_run) {
                $($(this).parent().parent()).find(".div_hmid_trigger").toggle({
                    progress: function () {
                        SGI.plumb_inst.inst_mbs.repaintEverything();
                    }
                });
            }
            $(this).stop(true, true).effect("highlight");

        });
        $("#prg_panel").on("click", ".btn_min_obj", function () {
            $($(this).parent().parent()).find(".div_hmid_trigger").toggle();
            $(this).stop(true, true).effect("highlight");

        });
    },

    Setup_dialog: function () {
        $('.setup_cat').hover(
            function () {
                $(this).addClass('ui-state-hover');
            },
            function () {
                $(this).removeClass('ui-state-hover');
            }
        );

        $(".setup_cat").click(function () {
            $(".setup_field_content").hide();
            $("#" + $(this).data("info")).show();
        });


        $(".setup_field_content").hide();
        $("#setup_alg").show();
    },

    context_menu: function () {

        $(document).on('mouseenter', ".context-menu-item", function () {

            $(this).toggleClass("ui-state-focus")
        });
        $(document).on('mouseleave', ".context-menu-item", function () {
            $(this).toggleClass("ui-state-focus")

        });

        $(document).on('mouseenter', ".div_hmid_font", function () {

            $(this).toggleClass("ui-state-focus")
        });
        $(document).on('mouseleave', ".div_hmid_font", function () {
            $(this).toggleClass("ui-state-focus")

        });

        $(document).on('mouseenter', ".div_hmid_filter_font", function () {

            $(this).toggleClass("ui-state-focus")
        });
        $(document).on('mouseleave', ".div_hmid_filter_font", function () {
            $(this).toggleClass("ui-state-focus")

        });

        $(document).on('mouseenter', ".div_hmid_val", function () {

            $(this).toggleClass("ui-state-focus")
        });
        $(document).on('mouseleave', ".div_hmid_val", function () {
            $(this).toggleClass("ui-state-focus")

        });

// Body zum debuggen auskommentieren  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        $.contextMenu({
            selector: 'body',
            items: {
                "body": {
                    name: "body"
                }
            }
        });
        $("body").contextMenu(false);

        // Codebox  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        $.contextMenu({
            selector: '.titel_codebox',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_codebox(opt)
                    }
                }
            }
        });

        // FBS_Element   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        $.contextMenu({
            selector: '.fbs_element_varinput',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("Eingang Hinzufügen"),
                    className: "item_font ",
                    callback: function (key, opt) {
                        SGI.add_input(opt)
                    }
                },
                "Del": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: '.fbs_element_simpel',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: '.fbs_element_onborder',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs_onborder(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: '.fbs_element_tr',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs(opt)
                    }
                }
            }
        });

        $.contextMenu({
            selector: '.fbs_element_exp',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs(opt)
                    }
                },
                "Save": {
                    name: SGI.translate("Save Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.expert_save(opt)
                    }
                }
            }
        });

        $.contextMenu({
            selector: '.fbs_exp_custom',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del": {
                    name: SGI.translate("Lösche Vorlage"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.expert_del(opt)
                    }
                }
            }
        });

        // Trigger   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        $.contextMenu({
            selector: ".tr_singel",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("Add ID"),
                    className: "item_font ",
                    callback: function (key, opt) {
                        SGI.add_trigger_hmid(opt.$trigger, "singel")
                    }
                },
                "Del_elm": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".tr_vartime",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("Add ID"),
                    className: "item_font ",
                    callback: function (key, opt) {
                        SGI.add_trigger_hmid(opt.$trigger, "object")
                    }
                },
                "Del_elm": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".tr_val",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("Add ID"),
                    className: "item_font ",
                    callback: function (key, opt) {
                        SGI.add_trigger_hmid(opt.$trigger, "singel", "val")
                    }
                },
                "Del_elm": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".tr_simpel",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del_elm": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".tr_time",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("Add Zeit"),
                    className: "item_font ",
                    callback: function (key, opt) {
                        var nr = $(opt.$trigger).data("nr");
                        scope.mbs[nr]["time"].push("00:00");
                        scope.mbs[nr]["day"].push("88");
                        scope.$apply();
                        var $this = $(opt.$trigger).find(".div_hmid_trigger");
                        $($this).children().remove();
                        SGI.add_trigger_time($(opt.$trigger));
                        SGI.plumb_inst.inst_mbs.repaintEverything()

                    }
                },
                "Del_elm": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".tr_astro",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("Add Astro"),
                    className: "item_font ",
                    callback: function (key, opt) {
                        var nr = $(opt.$trigger).data("nr");
                        scope.mbs[nr]["minuten"].push("0");
                        scope.mbs[nr]["astro"].push("sunset");
                        var $this = $(opt.$trigger).find(".div_hmid_trigger");
                        $($this).children().remove();
                        SGI.add_trigger_astro($(opt.$trigger));
                        SGI.plumb_inst.inst_mbs.repaintEverything()

                    }
                },
                "Del_elm": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".div_hmid_font",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("Add ID"),
                    className: "item_font ",
                    callback: function (key, opt) {
                        if (opt.$trigger.parent().parent().attr("id").split("_")[1] == "vartime") {
                            SGI.add_trigger_hmid(opt.$trigger.parent().parent(), "object")
                        } else {
                            SGI.add_trigger_hmid(opt.$trigger.parent().parent(), "singel")
                        }
                    }
                },
                "Del_id": {
                    name: SGI.translate("Entferne ID"),
                    className: "item_font",
                    callback: function (key, opt) {

                        SGI.del_trigger_hmid(opt)
                    }
                },
                "Del_elm": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        opt.$trigger = $(opt.$trigger).parent().parent();
                        SGI.del_mbs(opt);
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".div_hmid_filter_font_device",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("Add Gerät"),
                    className: "item_font ",
                    callback: function (key, opt) {

                        SGI.add_filter_device(opt.$trigger.parent().parent());

                    }
                },
                "Del_id": {
                    name: SGI.translate("Entferne Gerät"),
                    className: "item_font",
                    callback: function (key, opt) {

                        SGI.del_filter_item(opt)
                    }
                },
                "Del_elm": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        opt.$trigger = $(opt.$trigger).parent().parent();
                        SGI.del_mbs(opt);
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".div_hmid_filter_font_channel",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("Add Kanal"),
                    className: "item_font ",
                    callback: function (key, opt) {

                        SGI.add_filter_channel(opt.$trigger.parent().parent());

                    }
                },
                "Del_id": {
                    name: SGI.translate("Entferne Kanal"),
                    className: "item_font",
                    callback: function (key, opt) {

                        SGI.del_filter_item(opt)
                    }
                },
                "Del_elm": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        opt.$trigger = $(opt.$trigger).parent().parent();
                        SGI.del_mbs(opt);
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".div_hmid_filter_font_dp",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("Add Datenpunkt"),
                    className: "item_font ",
                    callback: function (key, opt) {

                        SGI.add_filter_dp(opt.$trigger.parent().parent());

                    }
                },
                "Del_id": {
                    name: SGI.translate("Entferne Datenpunkt"),
                    className: "item_font",
                    callback: function (key, opt) {

                        SGI.del_filter_item(opt)
                    }
                },
                "Del_elm": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        opt.$trigger = $(opt.$trigger).parent().parent();
                        SGI.del_mbs(opt);
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".div_hmid_val",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("Add ID"),
                    className: "item_font ",
                    callback: function (key, opt) {
                        opt.$trigger = $(opt.$trigger).parent().parent().parent();
                        SGI.add_trigger_hmid(opt.$trigger, "val")
                    }
                },
                "Del_id": {
                    name: SGI.translate("Entferne ID"),
                    className: "item_font",
                    callback: function (key, opt) {

                        SGI.del_trigger_val(opt)
                    }
                },
                "Del_elm": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        opt.$trigger = $(opt.$trigger).parent().parent();
                        SGI.del_mbs(opt);
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".mbs_element_kommentar",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del_elm": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                },
                "background": {
                    "name": SGI.translate("Hintergrund"),
                    className: "ui-corner-all ui-widget-content",
                    "items": {
                        "back-red": {
                            className: "item_font",
                            "name": SGI.translate("Rot"),
                            callback: function (key, opt) {
                                scope.mbs[$(opt.$trigger).attr("id").split("_")[1]].style["background-color"] = "red";
                                scope.$apply();
                            }
                        },
                        "back-green": {
                            className: "item_font",
                            "name": SGI.translate("Grün"),
                            callback: function (key, opt) {
                                scope.mbs[$(opt.$trigger).attr("id").split("_")[1]].style["background-color"] = "green";
                                scope.$apply();

                            }
                        },
                        "back-yellow": {
                            className: "item_font",
                            "name": SGI.translate("Gelb"),
                            callback: function (key, opt) {
                                scope.mbs[$(opt.$trigger).attr("id").split("_")[1]].style["background-color"] = "yellow";
                                scope.$apply();

                            }
                        },
                        "back-trans": {
                            className: "item_font",
                            "name": SGI.translate("Transparent"),
                            callback: function (key, opt) {
                                scope.mbs[$(opt.$trigger).attr("id").split("_")[1]].style["background-color"] = "transparent";
                                scope.$apply();

                            }
                        }
                    }
                },
                "font": {
                    "name": SGI.translate("Schrift"),
                    className: "ui-corner-all ui-widget-content ",
                    "items": {
                        "font-red": {
                            className: "item_font",
                            "name": SGI.translate("Rot"),
                            callback: function (key, opt) {
                                scope.mbs[$(opt.$trigger).attr("id").split("_")[1]].style["color"] = "red";
                                scope.$apply();
                            }
                        },
                        "font-green": {
                            className: "item_font",
                            "name": SGI.translate("Grün"),
                            callback: function (key, opt) {
                                scope.mbs[$(opt.$trigger).attr("id").split("_")[1]].style["color"] = "green";
                                scope.$apply();
                            }
                        },
                        "font-yellow": {
                            className: "item_font",
                            "name": SGI.translate("Gelb"),
                            callback: function (key, opt) {
                                scope.mbs[$(opt.$trigger).attr("id").split("_")[1]].style["color"] = "yellow";
                                scope.$apply();
                            }
                        },
                        "font-white": {
                            className: "item_font",
                            "name": SGI.translate("Weiß"),
                            callback: function (key, opt) {
                                scope.mbs[$(opt.$trigger).attr("id").split("_")[1]].style["color"] = "white";
                                scope.$apply();
                            }
                        },
                        "font-black": {
                            className: "item_font",
                            "name": SGI.translate("Schwarz"),
                            callback: function (key, opt) {
                                scope.mbs[$(opt.$trigger).attr("id").split("_")[1]].style["color"] = "black";
                                scope.$apply();
                            }
                        }
                    }
                }
            }
        });

        $.contextMenu({
            selector: '.mbs_element_simpel',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                }
            }
        });

// I/O´s   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        $.contextMenu({
            selector: '.fbs_element_io',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("ID Auswahl"),
                    className: "item_font ",
                    callback: function (key, opt) {
                        SGI.change_id(opt)
                    }
                },
                "Del": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: '.fbs_element_io_fix',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs(opt)
                    }
                }
            }
        });

        $.contextMenu({
            selector: '.fbs_element_i_liste',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("ID Auswahl"),
                    className: "item_font ",
                    callback: function (key, opt) {
                        SGI.change_i_liste(opt)
                    }
                },
                "Del": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs(opt)
                    }
                }
            }
        });

        $.contextMenu({
            selector: '.fbs_element_io_local',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: SGI.translate("ID Auswahl"),
                    className: "item_font ",
                    callback: function (key, opt) {
                        SGI.change_local(opt)
                    }
                },
                "Del": {
                    name: SGI.translate("Entferne Element"),
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs(opt)
                    }
                }
            }
        });

        //TODO REMOVE
        $.contextMenu({
            selector: '._jsPlumb_connector',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            build: function ($trigger) {
                if ($trigger.parent().attr("id") == "prg_panel") {
                    return {
                        className: "ui-widget-content ui-corner-all",
                        items: {
                            "auto_route": {
                                name: SGI.translate("Auto route"),
                                className: "item_font ",
                                callback: function () {
                                    $(".dot").remove();
                                    scope.con.mbs[SGI.con.id].connector.stub = [30, 30];
                                    scope.con.mbs[SGI.con.id].connector.midpoint = 0.5;
                                    SGI.con.setConnector(["Flowchart", {
                                        stub: [30, 30],
                                        alwaysRespectStubs: true,
                                        midpoint: 0.5
                                    }]);
                                    scope.$apply();
                                }
                            }
                        }
                    }
                }

                return {
                    className: "ui-widget-content ui-corner-all",
                    items: {
                        "add_Force": {
                            name: SGI.translate("Add Force"),
                            className: "item_font ",
                            callback: function () {
                                SGI.add_force(SGI.con);
                            }
                        },
                        "del_Force": {
                            name: SGI.translate("Del Force"),
                            className: "item_font ",
                            callback: function () {

                                SGI.del_force(SGI.con);

                            }
                        },
                        "auto_route": {
                            name: SGI.translate("Auto route"),
                            className: "item_font ",
                            callback: function () {
                                $(".dot").remove();
                                scope.con.fbs[$trigger.parent().attr("id")][SGI.con.id].connector.stub = [30, 30];
                                scope.con.fbs[$trigger.parent().attr("id")][SGI.con.id].connector.midpoint = 0.5;
                                SGI.con.setConnector(["Flowchart", {
                                    stub: [30, 30],
                                    alwaysRespectStubs: true,
                                    midpoint: 0.5
                                }]);
                                scope.$apply();
                            }
                        }
                    }
                }
            }

        });

    },

    add_force: function (con) {
        var _ep = con.sourceId.split("_");
        var nr = _ep[1];
        var parent = scope.fbs[nr].parent.split("_");
        var codebox = parent[1] + '_' + parent[2];
        var source = con.sourceId;
        var cons = SGI.plumb_inst['inst_' + codebox].getConnections({source: source});
        if (scope.fbs[nr].force == undefined) {
            scope.fbs[nr].force = "";
        }

        $.each(cons, function () {

            var con = this;
            var id = con.id;
            this.removeOverlay('force');
            this.addOverlay(
                ["Custom", {
                    create: function () {
                        return $('<div><div class="force_overlay ui-corner-all" style="max-height: 18px">\
                    <input type="text" value="' + scope.fbs[nr].force + '" data-info="' + source + '" id="overlay_force_' + id + '" class="force_input ui-corner-all"></input>\
                    </div></div>');
                    },
                    id: "force",
                    location: -25
                }]
            );

            $('#overlay_force_' + id).change(function () {
                scope.fbs[nr].force = $(this).val();
                SGI.add_force(con);
            });
        });
    },

    del_force: function (con) {
        var _ep = con.sourceId.split("_");
        var nr = _ep[1];
        var parent = scope.fbs[nr].parent.split("_");
        var codebox = parent[1] + '_' + parent[2];

        var cons = SGI.plumb_inst['inst_' + codebox].getConnections({source: con.sourceId});

        var id = con.id;
        $("#overlay_force_" + id).val("");
        $("#overlay_force_" + id).trigger("change");
        $.each(cons, function () {
            this.removeOverlay('force');
            scope.fbs[nr].force = undefined;
        });
        scope.$apply();

    },

    del_all_force: function () {
        var cons = [];
        $.each(SGI.plumb_inst, function () {
            var _cons = this.getConnections("*");
            cons = cons.concat(_cons)
        });

        $.each(cons, function () {
            if (this.getOverlay('force')) {
                this.removeOverlay('force');
                console.log(this.sourceId);
                scope.fbs[this.sourceId.split("_")[1]].force = undefined;
            }
        });
        scope.$apply();

    },

    del_mbs: function (opt) {

        var trigger = $(opt).attr("$trigger");
        var children = $(trigger).find("div");
        var nr = $(opt.$trigger).data("nr");

        SGI.plumb_inst.inst_mbs.deleteEndpoint($(opt.$trigger).attr("id"));
        $.each(children, function () {
            var ep = SGI.plumb_inst["inst_mbs"].getEndpoints($(this).attr("id"));

            SGI.plumb_inst["inst_mbs"].detachAllConnections(this);

            if (ep != undefined) {
                SGI.plumb_inst["inst_mbs"].deleteEndpoint($(ep).attr("elementId"));
            }
        });
        $(trigger).remove();
        delete scope.mbs[nr];
        scope.$apply()
    },

    del_fbs: function (opt) {

        var trigger = $(opt).attr("$trigger");
        var children = $(trigger).find("div");
        var nr = $(opt.$trigger).data("nr");
        var parent = scope.fbs[nr]["parent"].split("_");

        $.each(children, function () {
            var ep = SGI.plumb_inst["inst_" + parent[1] + "_" + parent[2]].getEndpoints($(this).attr("id"));

            SGI.plumb_inst["inst_" + parent[1] + "_" + parent[2]].detachAllConnections(this);

            if (ep != undefined) {
                SGI.plumb_inst["inst_" + parent[1] + "_" + parent[2]].deleteEndpoint($(ep).attr("elementId"));
            }
        });
        $(trigger).remove();
        delete scope.fbs[nr];
        scope.$apply()
    },

    del_fbs_onborder: function (opt) {

        var trigger = $(opt).attr("$trigger");
        var id = $(opt.$trigger).attr("id");
        var nr = $(opt.$trigger).data("nr");
        var parent = scope.fbs[nr]["parent"].split("_");


        SGI.plumb_inst["inst_" + parent[1] + "_" + parent[2]].detachAllConnections(id);
        SGI.plumb_inst["inst_" + parent[1] + "_" + parent[2]].deleteEndpoint(id);
        SGI.plumb_inst.inst_mbs.deleteEndpoint(id);
        $(trigger).remove();
        delete scope.fbs[nr];
        scope.$apply()
    },

    del_codebox: function (opt) {
        var $this = $(opt).attr("$trigger");

        if (!$($this).hasClass("mbs_element_codebox")) {
            $this = $(opt).attr("$trigger").parent().parent()
        }


        var children = $($this).find("div");
        $.each(children, function () {
            var ep = SGI.plumb_inst.inst_mbs.getEndpoints($(this).attr("id"));

            SGI.plumb_inst.inst_mbs.detachAllConnections(this);

            if (ep != undefined) {
                SGI.plumb_inst.inst_mbs.deleteEndpoint($(ep).attr("elementId"));
            }

            if ($(this).hasClass("fbs_element")) {
                delete scope.fbs[$(this).data("nr")];
            }

        });
        $($this).remove();
        delete scope.mbs[$($this).data("nr")];

        scope.$apply();

    },

    del_selected: function () {

        var mbs_sel = $(".mbs_selected");
        var fbs_sel = $(".jsplumb-drag-selected");
        var opt = {};

        $.each($(".jsplumb-drag-selected"), function () {
            if ($(this).hasClass("fbs_element")) {
                if ($(this).hasClass("fbs_element_onborder")) {
                    opt.$trigger = this;
                    SGI.del_fbs_onborder(opt)

                } else {
                    opt.$trigger = this;
                    SGI.del_fbs(opt)
                }
            } else {
                if ($(this).hasClass("mbs_element_codebox")) {
                    opt.$trigger = this;
                    SGI.del_codebox(opt)

                } else {
                    opt.$trigger = this;
                    SGI.del_mbs(opt)
                }
            }
        });

    },

    change_id: function (opt) {

        $.id_select({
            type: "singel",
            close: function (hmid) {
                if (hmid != null) {

                    var _name = SGI.get_name(hmid);

                    scope.fbs[$(opt.$trigger).data("nr")]["hmid"] = hmid;

                    $(opt.$trigger).find(".div_hmid").text(_name);
                    scope.fbs[$(opt.$trigger).data("nr")]["name"] = _name;

                    SGI.plumb_inst["inst_" + $(opt.$trigger).parent().parent().attr("id")].repaintEverything();
                }
            }
        });

    },

    change_i_liste: function (opt) {

        $.id_select({
            type: "groups",
            close: function (hmid) {
                if (hmid != null) {

                    var _name = SGI.get_name(hmid);
                    scope.fbs[$(opt.$trigger).data("nr")]["hmid"] = hmid;
                    $(opt.$trigger).find(".div_hmid").text(_name);
                    scope.fbs[$(opt.$trigger).data("nr")]["name"] = _name;

                    scope.$apply();
                    SGI.plumb_inst["inst_" + $(opt.$trigger).parent().parent().attr("id")].repaintEverything();
                }
            }
        });
    },

    change_o_liste: function (opt) {

        $.id_select({
            type: "obj",
            close: function (hmid) {
                if (hmid != null) {
                    var _name = SGI.get_name(hmid);
                    scope.fbs[$(opt.$trigger).data("nr")]["hmid"] = hmid;
                    $(opt.$trigger).find(".div_hmid").text(_name);
                    scope.fbs[$(opt.$trigger).data("nr")]["name"] = _name;

                    scope.$apply();
                    SGI.plumb_inst["inst_" + $(opt.$trigger).parent().parent().attr("id")].repaintEverything();
                }
            }
        });

    },

    change_local: function (opt) {

        $.id_select({
            type: "local",
            close: function (hmid) {
                if (hmid != null) {

                    scope.fbs[$(opt.$trigger).data("nr")]["hmid"] = hmid;
                    $(opt.$trigger).find(".div_hmid").text(hmid);
                    scope.fbs[$(opt.$trigger).data("nr")]["name"] = hmid;

                    scope.$apply();
                    SGI.plumb_inst["inst_" + $(opt.$trigger).parent().parent().attr("id")].repaintEverything();
                }
            }
        });
    },

    del_trigger_hmid: function (opt) {
        var nr = $("#" + $(opt.$trigger).data("info")).data("nr");
        var name = $(opt.$trigger).text();
        var index = $.inArray(name, scope.mbs[nr]["name"]);

        scope.mbs[nr]["name"].splice(index, 1);
        scope.mbs[nr]["hmid"].splice(index, 1);

        $(opt.$trigger).remove();

        scope.$apply();
        SGI.plumb_inst.inst_mbs.repaintEverything()
    },

    del_device_hmid: function (opt) {
        var nr = $("#" + $(opt.$trigger).data("info")).data("nr");
        var name = $(opt.$trigger).text();
        var index = $.inArray(name, scope.fbs[nr]["name"]);

//     scope.fbs[nr]["name"].splice(index, 1);
        scope.fbs[nr]["hmid"].splice(index, 1);

        $(opt.$trigger).remove();

        scope.$apply();
        SGI.plumb_inst["inst_" + $("#" + $(opt.$trigger).data("info")).parent().parent().attr("id")].repaintEverything();
    },

    del_filter_item: function (opt) {
        var nr = $("#" + $(opt.$trigger).data("info")).data("nr");
        var name = $(opt.$trigger).text();
        var index = $.inArray(name, scope.fbs[nr]["hmid"]);

//        PRG.fbs[nr]["name"].splice(index, 1); //todo Remove after ng
        scope.fbs[nr]["hmid"].splice(index, 1);

        $(opt.$trigger).remove();
        scope.$apply();

        SGI.plumb_inst["inst_" + $("#" + $(opt.$trigger).data("info")).parent().parent().attr("id")].repaintEverything();
    },

    del_trigger_val: function (opt) {
        var nr = $("#" + $(opt.$trigger).data("info")).data("nr");
        var parrent = $(opt.$trigger).data("info");
        var name = $(opt.$trigger).text();
        var index = $.inArray(name, scope.mbs[nr]["name"]);

        scope.mbs[nr]["name"].splice(index, 1);
        scope.mbs[nr]["hmid"].splice(index, 1);
        scope.mbs[nr]["val"].splice(index, 1);
        scope.mbs[nr]["wert"].splice(index, 1);

        $(opt.$trigger).parent().remove();
        scope.$apply();

        SGI.plumb_inst.inst_mbs.repaintEverything()
    },

    expert_save: function (opt) {
        var nr = $(opt.$trigger).data("nr");

        var data = {
            name: scope.fbs[nr]["opt"],
            value: scope.fbs[nr]["value"],
            in: scope.fbs[nr]["exp_in"],
            out: scope.fbs[nr]["exp_out"]
        };

        fs.writeFile(scope.setup.datastore + '/ScriptGUI_Data/experts/expert_' + data.name + '.json', JSON.stringify(data), function (err) {
            if (err) {
                throw err;
            } else {
                SGI.read_experts();
            }

        });
    },

    expert_del: function (opt) {
        var name = $(opt.$trigger).attr("id");
        fs.unlink(scope.setup.datastore + '/ScriptGUI_Data/experts/' + name + ".json", function (err) {
            if (err) {
                throw err;
            } else {
                SGI.read_experts();
            }

        });
    },

    save_as_local: function () {
        var data = SGI.make_savedata();
        var chooser = $('#prgsaveas');
        chooser.change(function () {
            var filep = $(this).val();
            fs.writeFile(filep, JSON.stringify(data), function (err) {
                if (err) {
                    throw err;
                } else {
                    SGI.prg_store = path.dirname(filep);
                    SGI.file_name = path.basename(filep);
                    $("#m_file").text(SGI.file_name);
                    scope.setup.last_file = filep;
                    scope.$apply()
                }
            });
        });
        chooser.trigger('click');
    },

    save_local: function () {
        if (SGI.file_name == "") {
            SGI.save_as_local()
        } else {
            var data = SGI.make_savedata();

            try {
                fs.writeFile(path.resolve(scope.setup.datastore + "/ScriptGUI_Data/programms/" + SGI.file_name), JSON.stringify(data), function (err) {
                    if (err) {
                        throw err;
                    } else {


                    }
                });
            } catch (err) {
                alert("Speichern nicht möglich")
            }
        }
    },

    open_local: function () {
        var chooser = $('#prgopen');
        chooser.val("");
        chooser.change(function (evt) {
            var filep = $(this).val();
            $("#wait_div").show();
            try {

                fs.readFile(filep, function (err, data) {
                    if (err) {
                        $("#wait_div").hide();
                        throw err;
                    } else {
                        SGI.clear();
                        SGI.load_prg(JSON.parse(data));

                        SGI.prg_store = path.dirname(filep);
                        SGI.file_name = path.basename(filep);
                        $("#m_file").text(SGI.file_name);
                        scope.setup.last_file = filep;
                        scope.$apply();
                        $("#wait_div").hide();
                    }
                });
            }
            catch (err) {
                $("#wait_div").hide();
                throw err

            }


        });

        chooser.trigger('click');
    },

    open_last: function () {
        if (scope.setup.last_file != "") {
            try {
                $("#wait_div").show();
                fs.readFile(scope.setup.last_file, function (err, data) {
                    if (err) {
                        $("#wait_div").hide();
                        alert("Datei kann nicht gelesen werden")
                    } else {
                        SGI.clear();
                        SGI.load_prg(JSON.parse(data));
                        SGI.prg_store = path.dirname(scope.setup.last_file);
                        SGI.file_name = path.basename(scope.setup.last_file);
                        $("#m_file").text(SGI.file_name);
                        $("#wait_div").hide();
                    }
                });
            }
            catch (err) {
                $("#wait_div").hide();
                throw err
            }
        }
    },

    example_ccu_io: function () {
        $.fm({
            lang: SGI.language,
            path: "www/ScriptGUI/example/",
            file_filter: ["prg"],
            folder_filter: true,
            mode: "open"

        }, function (_data) {
            SGI.socket.emit("readJsonFile", _data.path + _data.file, function (data) {
                SGI.clear();
                SGI.load_prg(data);
                SGI.file_name = _data.file;
                $("#m_file").text(SGI.file_name);
            });
        });
    },

    save_Script: function () {
        var script = Compiler.make_prg();
        if (SGI.file_name == undefined || SGI.file_name == "Neu" || SGI.file_name == "") {
            alert("Bitte erst Programm Speichern");

        } else {
            try {
                var name = SGI.file_name.replace('.prg', '.js');
                SGI.socket.emit("writeRawFile", "scripts/" + name, script);
            } catch (err) {
                alert("Keine Verbindung zu CCU.IO")
            }
        }
    },

    del_script: function () {
        $.fm({
            lang: SGI.language,
            path: "scripts/",
            file_filter: ["js", "js_"],
            folder_filter: true,
            mode: "show"
        });
    },

    show_Script: function (data) {

        var h = $(window).height() - 200;
        var v = $(window).width() - 400;

        $("body").append('\
                   <div id="dialog_code" style="text-align: left" title="Scriptvorschau">\
                    <textarea id="codemirror" name="codemirror" class="code frame_color ui-corner-all"></textarea>\
                   </div>');
        $("#dialog_code").dialog({
            height: h,
            width: v,
            resizable: true,
            close: function () {
                $("#dialog_code").remove();
            }
        });

        var editor = CodeMirror.fromTextArea(document.getElementById("codemirror"), {
            mode: {name: "javascript", json: true},
//            value:data.toString(),
            lineNumbers: true,
            readOnly: true,
            theme: "monokai"

        });


        editor.setOption("value", js_beautify(data.toString(), {indent_size: 2}));

    },

    error_box: function (data) {

        var _data = data.split("\n").join("<br>").replace(/file:\/\/\//g, "").replace(/at HTMLDocument./g, "");

        var mail = "";
        if (scope.setup.user_mail.split("@").length > 1) {
            mail = scope.setup.user_mail;
        }

        $("body").append('\
                   <div id="dialog_info"  title="Info">\
                   <div class="ui-state-error">' + SGI.translate("Es ist ein Fehler aufgetreten") + '</div>\
                   <hr>\
                   <div class="err_text">' + _data + '</div>\
                   <hr>\
                   <span>' + SGI.translate("Die Folgenden angaben sind optional:") + '</span><br><br>\
                   <span style="width: 150px; display: inline-block">' + SGI.translate("E-Mail Adresse : ") + '</span><input id="inp_error_mail" value="' + mail + '" style="width: 317px; "type="email"/><br>\
                   <div style="display: flex; align-items: center"><span style="width: 150px ; display: inline-block">' + SGI.translate("Kommentar : ") + '</span><textarea id="txt_error_comment" style="width: 315px; height: 60px; max-width: 315px"></textarea></div>\
                   <span style="width: 150px; display: inline-block">' + SGI.translate("Programm Daten: ") + '</span></span><input id="inp_prg_data" style="height:20px; width:20px; margin-left: 0; vertical-align: middle;" checked value="true" type="checkbox"/><br>\
                   <br><br>\
                   <div style="text-align: center">\
                   <button id="btn_info_send" >' + SGI.translate("Senden") + '</button>\
                   <button style="margin-left: 20px" id="btn_info_close" >' + SGI.translate("Schliesen") + '</button>\
        </div>\
        </div>');

        $("#dialog_info").dialog({
            dialogClass: "error_box",
            maxWidth: "90%",
            width: "auto",
            close: function () {
                $("#dialog_info").remove();
            }
        });
        $("#btn_info_close").button().click(function () {
            $("#dialog_info").remove();
        });

        $("#btn_info_send").button().click(function () {
            SGI.server_error(_data);
            $("#dialog_info").remove();
        });
    },

    update: function (show) {
        $("#dialog_update").remove();

        upd.checkNewVersion(function (error, newVersionExists, manifest) {

            if (!error && newVersionExists || show) {


                $("body").append('\
                    <div id="dialog_update" style="width: 438px; height:428px; text-align: center" title="' + SGI.translate("Update") + '">\
                    <img src="./img/logo.png" style="width: 300px"/>\
                    <br><br><br>\
                    <div style="width: 200px; display: inline-block;text-align: left">' + SGI.translate("Version ist:") + '</div><div style="width: 250px; display: inline-block;text-align: left">' + up_pkg.version + '</div>\
                    <br><br>\
                    <div style="width: 200px; display: inline-block;text-align: left">' + SGI.translate("erstellung") + '</div><div style="width: 250px; display: inline-block;text-align: left">' + up_pkg.build_date + ' ' + up_pkg.build_time + '</div>\
                    <br><br><hr><br>\
                    <div style="width: 200px; display: inline-block;text-align: left">' + SGI.translate("Neuste Version: ") + '</div><div style="width: 250px; display: inline-block;text-align: left">' + manifest.version + '</div>\
                    <br><br>\
                    <div style="width: 200px; display: inline-block;text-align: left">' + SGI.translate("erstellung") + '</div><div style="width: 250px; display: inline-block;text-align: left">' + manifest.build_date + ' ' + manifest.build_time + '</div>\
                    <br><br><br>\
                    <button id="btn_update">' + SGI.translate("Update") + '</button>\
                    </div>');

                $("#dialog_update").dialog({
                    width: "auto",
                    height: 500,
                    dialogClass: "update",
                    modal: true,
                    close: function () {
                        $("#dialog_update").remove();
                    }
                });
                $("#btn_update").button()
                    .click(function () {
                        $("#btn_update").remove();
                        $("#dialog_update").append('<div style="width: 100%; height: 33px; line-height: 33px" class="ui-state-default ui-corner-all" id="update_info"></div>');
                        $('#update_info').text("Downloading");

                        upd.download(function (error, filename) {
                            if (!error) {
                                $('#update_info').text("Unzip");

                                upd.unpack(filename, function (error, newAppPath) {
                                    if (!error) {
                                        $('#update_info').text("Restart");
                                        var _np = newAppPath.split("ScriptGUI.");
                                        var np;
                                        if (SGI.os == "darwin") {
                                            np = newAppPath
                                        } else {
                                            np = _np[0] + "ScriptGUI/ScriptGUI." + _np[1];
                                        }
                                        upd.runInstaller(np, [upd.getAppPath(), upd.getAppExec()], {});
                                        main_win.close()

                                    } else {
                                        throw error
                                    }
                                }, manifest);
                            }
                        }, manifest);
                    });


                if (!newVersionExists) {
                    $("#btn_update").button("disable")
                }
            }
        });
    },

    open_quick_help_dialog: function () {

        if ($("body").find(".quick-help").length < 1) {

            $("body").append('\
                   <div id="dialog_quick-help" style="text-align: center, " title="Quick Help">\
                   <input class="focus_dummy" type="button"/>\
                   <div id="help-content"></div>\
                   </div>');

            $("#dialog_quick-help").dialog({

                dialogClass: "quick-help",
                close: function () {
                    $("#dialog_quick-help").remove();
                }

            });
//            $(".ui-tooltip").remove()

            $(".quick-help").css({
                position: "absolute",
                top: "51px",
                left: "auto",
                right: "21px",
                width: "200px"

            });

        }

    },

    quick_help: function () {
        var help = {
            toint: '<div class="quick-help_content">      <H2>INT:</H2>                     <p>' + SGI.translate("toint") + '</p></div>',
            tofloat: '<div class="quick-help_content">      <H2>Float:</H2>                   <p>' + SGI.translate("tofloat") + '</p></div>',
            tostring: '<div class="quick-help_content">      <H2>String:</H2>                  <p>' + SGI.translate("tostring") + '</p></div>',
            und: '<div class="quick-help_content">      <H2>and:</H2>                     <p>' + SGI.translate("und") + '</p></div>',
            oder: '<div class="quick-help_content">      <H2>or:</H2>                      <p>' + SGI.translate("oder") + '</p></div>',
            not: '<div class="quick-help_content">      <H2>Not:</H2>                     <p>' + SGI.translate("not") + '</p></div>',
            verketten: '<div class="quick-help_content">      <H2>concate:</H2>                 <p>' + SGI.translate("verketten") + '</p></div>',
            input: '<div class="quick-help_content">      <H2>Get:</H2>                     <p>' + SGI.translate("input") + '</p></div>',
            inputliste: '<div class="quick-help_content">      <H2>Get Liste:</H2>               <p>' + SGI.translate("inputliste") + '</p></div>',
            inputlocal: '<div class="quick-help_content">      <H2>Get Local:</H2>               <p>' + SGI.translate("inputlocal") + '</p></div>',
            output: '<div class="quick-help_content">      <H2>Set:</H2>                     <p>' + SGI.translate("output") + '</p></div>',
            outputlocal: '<div class="quick-help_content">      <H2>Set Local:</H2>               <p>' + SGI.translate("outputlocal") + '</p></div>',
            mail: '<div class="quick-help_content">      <H2>Mail:</H2>                    <p>' + SGI.translate("mail") + '</p></div>',
            debugout: '<div class="quick-help_content">      <H2>CCU.IO LOG:</H2>              <p>' + SGI.translate("debugout") + '</p></div>',
            "true": '<div class="quick-help_content">      <H2>true:</H2>                    <p>' + SGI.translate("true") + '</p></div>',
            "false": '<div class="quick-help_content">      <H2>false:</H2>                   <p>' + SGI.translate("false") + '</p></div>',
            zahl: '<div class="quick-help_content">      <H2>Number:</H2>                  <p>' + SGI.translate("zahl") + '</p></div>',
            string: '<div class="quick-help_content">      <H2>Text:</H2>                    <p>' + SGI.translate("string") + '</p></div>',
            vartime: '<div class="quick-help_content">      <H2>Time:</H2>                    <p>' + SGI.translate("vartime") + '</p></div>',
            trigvalue: '<div class="quick-help_content">      <H2>Trigger Value:</H2>           <p>' + SGI.translate("trigvalue") + '</p></div>',
            trigtime: '<div class="quick-help_content">      <H2>Trigger Time:</H2>            <p>' + SGI.translate("trigtime") + '</p></div>',
            trigoldvalue: '<div class="quick-help_content">      <H2>Trigger old Value:</H2>       <p>' + SGI.translate("trigoldvalue") + '</p></div>',
            trigoldtime: '<div class="quick-help_content">      <H2>Trigger old Time:</H2>        <p>' + SGI.translate("trigoldtime") + '</p></div>',
            trigid: '<div class="quick-help_content">      <H2>Trigger ID:</H2>              <p>' + SGI.translate("trigid") + '</p></div>',
            trigname: '<div class="quick-help_content">      <H2>Trigger Name:</H2>            <p>' + SGI.translate("trigname") + '</p></div>',
            trigtype: '<div class="quick-help_content">      <H2>Trigger Type:</H2>            <p>' + SGI.translate("trigtype") + '</p></div>',
            trigdevid: '<div class="quick-help_content">      <H2>Trigger Device ID:</H2>       <p>' + SGI.translate("trigdevid") + '</p></div>',
            trigdevname: '<div class="quick-help_content">      <H2>Trigger Device Name:</H2>     <p>' + SGI.translate("trigdevname") + '</p></div>',
            trigdevtype: '<div class="quick-help_content">      <H2>Trigger Device Type:</H2>     <p>' + SGI.translate("trigdevtype") + '</p></div>',
            codebox: '<div class="quick-help_content">      <H2>Program Box:</H2>             <p>' + SGI.translate("codebox") + '</p></div>',
            brake: '<div class="quick-help_content">      <H2>Delay:</H2>                   <p>' + SGI.translate("brake") + '</p></div>',
            intervall: '<div class="quick-help_content">      <H2>Intervall:</H2>               <p>' + SGI.translate("intervall") + '</p></div>',
            loop: '<div class="quick-help_content">      <H2>Loop:</H2>                    <p>' + SGI.translate("loop") + '</p></div>',
            next: '<div class="quick-help_content">      <H2>Next:</H2>                    <p>' + SGI.translate("next") + '</p></div>',
            next1: '<div class="quick-help_content">      <H2>Next 1:</H2>                  <p>' + SGI.translate("next1") + '</p></div>',
            komex: '<div class="quick-help_content">      <H2>Comment:</H2>                 <p>' + SGI.translate("komex") + '</p></div>',
            ccuobj: '<div class="quick-help_content">      <H2>CCU.IO Object:</H2>           <p>' + SGI.translate("ccuobj") + '</p></div>',
            ccuobjpersi: '<div class="quick-help_content">      <H2>CCU.IO Object persident:</H2> <p>' + SGI.translate("ccuobjpersi") + '</p></div>',
            trigger_event: '<div class="quick-help_content">      <H2>Trigger --:</H2>              <p>' + SGI.translate("trigger_event") + '</p></div>',
            trigger_EQ: '<div class="quick-help_content">      <H2>Trigger EQ:</H2>              <p>' + SGI.translate("trigger_EQ") + '</p></div>',
            trigger_NE: '<div class="quick-help_content">      <H2>Trigger NE:</H2>              <p>' + SGI.translate("trigger_NE") + '</p></div>',
            trigger_GT: '<div class="quick-help_content">      <H2>Trigger GT:</H2>              <p>' + SGI.translate("trigger_GT") + '</p></div>',
            trigger_GE: '<div class="quick-help_content">      <H2>Trigger GE:</H2>              <p>' + SGI.translate("trigger_GE") + '</p></div>',
            trigger_LT: '<div class="quick-help_content">      <H2>Trigger LT:</H2>              <p>' + SGI.translate("trigger_LT") + '</p></div>',
            trigger_LE: '<div class="quick-help_content">      <H2>Trigger LE:</H2>              <p>' + SGI.translate("trigger_LE") + '</p></div>',
            trigger_valNe: '<div class="quick-help_content">      <H2>Trigger valNE:</H2>           <p>' + SGI.translate("trigger_valNe") + '</p></div>',
            trigger_val: '<div class="quick-help_content">      <H2>Trigger VAL:</H2>             <p>' + SGI.translate("trigger_val") + '</p></div>',
            trigger_time: '<div class="quick-help_content">      <H2>Trigger Time:</H2>            <p>' + SGI.translate("trigger_time") + '</p></div>',
            trigger_vartime: '<div class="quick-help_content">      <H2>Trigger var. Time:</H2>       <p>' + SGI.translate("trigger_vartime") + '</p></div>',
            trigger_zykm: '<div class="quick-help_content">      <H2>Trigger Zyklus M:</H2>        <p>' + SGI.translate("trigger_zykm") + '</p></div>',
            trigger_astro: '<div class="quick-help_content">      <H2>Trigger Astro:</H2>           <p>' + SGI.translate("trigger_astro") + '</p></div>',
            trigger_start: '<div class="quick-help_content">      <H2>Trigger Start:</H2>           <p>' + SGI.translate("trigger_start") + '</p></div>',
            wenn: '<div class="quick-help_content">      <H2>IF:</H2>                      <p>' + SGI.translate("wenn") + '</p></div>',
            timespan: '<div class="quick-help_content">      <H2>Timespan:</H2>                <p>' + SGI.translate("timespan") + '</p></div>',
            inc: '<div class="quick-help_content">      <H2>+1:</H2>                      <p>' + SGI.translate("inc") + '</p></div>',
            dec: '<div class="quick-help_content">      <H2>-1:</H2>                      <p>' + SGI.translate("dec") + '</p></div>',
            summe: '<div class="quick-help_content">      <H2>Sum:</H2>                     <p>' + SGI.translate("summe") + '</p></div>',
            differenz: '<div class="quick-help_content">      <H2>Difference:</H2>              <p>' + SGI.translate("differenz") + '</p></div>'
        };

        $(document).click(function (elem) {
            SGI.klick = elem;


            //   console.log("Keynumber: " + SGI.key);
            if (SGI.key == 17) {
                SGI.open_quick_help_dialog();
                $("#help-content").children().remove();
                var type
                if ($(elem.target).hasClass("fbs_element") || $(elem.target).hasClass("mbs_element")) {

                    if ($(elem.target).attr("id").split("_")[0] == "trigger") {
                        type = $(elem.target).attr("id").split("_")[0] + "_" + $(elem.target).attr("id").split("_")[1];
                    } else {
                        type = $(elem.target).attr("id").split("_")[0];
                    }

                    $("#help-content").append(help[type]);
                } else {
                    $.each($(elem.target).parents(), function () {
                        if ($(this).hasClass("fbs_element") || $(this).hasClass("mbs_element")) {

                            if ($(this).attr("id").split("_")[0] == "trigger") {
                                type = $(this).attr("id").split("_")[0] + "_" + $(this).attr("id").split("_")[1];
                            } else {
                                type = $(this).attr("id").split("_")[0];
                            }
                            $("#help-content").append(help[type]);
                            return false
                        }
                        if ($(this).hasClass("_jsPlumb_overlay")) {
                            type = $(this).attr("id").split("_")[0];
                            $("#help-content").append(help[type]);
                            return false
                        }
                    });
                }

                if ($(elem.target).parent().hasClass("fbs") || $(elem.target).parent().hasClass("mbs")) {
                    type = $(elem.target).parent().attr("id");
                    $("#help-content").append(help[type]);
                }

            }
        });
    }
});

