/**
 * Copyright (c) 2013 Steffen Schorling http://github.com/smiling-Jack
 * Lizenz: [CC BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/de/)
 */
"use strict";
var os = require('os');
var net = require('net');
var path = require('path');
var fs = require('fs');
var nw_gui = require('nw.gui');

var js_beautify = require('js-beautify');
var html_beautify = require('js-beautify').html;

var start_win;
var main_win = nw_gui.Window.get();
var main_manifest = nw_gui.App.manifest;

var request = require("request");
var ncp = require('ncp');
var up_pkg = require('./update.json');
var updater = require('node-webkit-updater');
var upd = new updater(up_pkg);

var bausteine = require('./js/bausteine.json');

main_win.title = main_manifest.name + " " + main_manifest.version + " Beta-Test";

function haveParent(theParent) {
    start_win = theParent;
}

var nwDir = upd.getAppPath();


process.on("uncaughtException", function (e) {
    console.log(e);
    main_win.show();
    SGI.error_box(e.stack)
});

//var execPath = path.dirname(process.execPath);

var scope;

var PRG = {
    struck: {
        codebox: {},
        trigger: [],
        control: []
    }
};

var SGI = {

    dev: false,
    version: main_manifest.version,

    HOST: '37.120.169.17',
    HOST_PORT: 3000,

    os: (os.type() == "Windows_NT" ? "win" : os.type() == "darwin" ? "osx" : os.type()) + "_" + os.arch().replace(/[a-z]+/, ""),
    copy_data: [],
    socket: {},
    con_files: [],
    con_data: false,
    settings: {},
    zoom: 1,
    theme: "",
    fbs_n: 0,
    mbs_n: 0,
    scope_init: {},
    experts: {},
    grid: 9,

    drop_block: false,
    str_tollbox: "ScriptGUI_Toolbox",

    sim_run: false,

    file_name: "",
    prg_store: "www/ScriptGUI/",
    example_store: "www/ScriptGUI/example/",
    key: "",
    plumb_inst: {
        inst_mbs: undefined
    },

    start_data: {
        id: 0,
        name: "Sim_Data",
        newState: {
            value: 0,
            timestamp: 0,
            ack: 0,
            lastchange: 0
        },
        oldState: {
            value: 0,
            timestamp: 0,
            ack: 0,
            lastchange: 0
        },
        channel: {
            id: 0,
            name: "Sim_Data",
            type: "Sim_Data",
            funcIds: "Sim_Data",
            roomIds: "Sim_Data",
            funcNames: "Sim_Data",
            roomNames: "Sim_Data"
        },
        device: {
            id: 0,
            name: "Sim_Data",
            type: "Sim_Data"
        }
    },

    Setup: function () {
        SGI.dev = true;

        scope = angular.element($('body')).scope();
        scope.$apply();

        $("#prgopen").attr("nwworkingdir", path.resolve(scope.setup.datastore + "/ScriptGUI_Data/programms/"));
        $("#prgsaveas").attr("nwworkingdir", path.resolve(scope.setup.datastore + "/ScriptGUI_Data/programms/"));
// Setze Sprache
        SGI.language = scope.setup.lang;


        jsPlumb.ready(function () {

            SGI.mbs_inst();

        });
        // translate XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        $.each($(".translate"), function () {
            var $this = this;
            $($this).text(SGI.translate($($this).text()))

        });
        $.each($(".title_translate"), function () {
            var $this = this;
            $($this).attr("title", (SGI.translate($($this).attr("title"))))

        });

        // slider XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


        $(".prg_body").scrollTop(1000 - ($(".prg_body").height() / 2));
        $(".prg_body").scrollLeft(2000 - ($(".prg_body").width() / 2));

        var color = $(".frame_color").css("background-color");
        document.styleSheets[1].cssRules[3].style["background-color"] = color;
        document.styleSheets[1].cssRules[4].style["background-color"] = color;

        $("#sim_output").prepend("<tr><td style='width: 100px'>Script Log</td><td></td></tr>");


        // Toolbox XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        $(".toolbox").hide();

        $.each($(".html_element"), function (a) {
            var id = $(this).attr("id");
            if (bausteine[id]) {
                $(this)
                    .append('<div style="position:absolute">' + bausteine[id]["data"] + '</div>')
                    .css({height: bausteine[id].h + "px", width: bausteine[id].w + "px"})
            } else {
                $(this).append('<div class="mbs_html " style="height:62px; width: 124px ;position: relative;">\
                    <div style="position: relative; z-index: 3; color: red; margin-top: 10px;font-size: 12px;font-weight: 900; line-height: 44px;">' + id + '</div>\
                </div>');
            }

        });


        var box_init = storage.get(SGI.str_tollbox) || ["Allgemain", "alg"];
        // Make btn Toolboxauswahl
        $("#toolbox_select").xs_combo({
            addcssButton: "xs_button_toolbox",
            addcssMenu: "xs_menu_toolbox",
            addcssFocus: "xs_focus_toolbox",
            cssText: "xs_text_toolbox item_font",
            time: 750,
            val: box_init[0],
            data: [
                SGI.translate("Allgemein"),
                SGI.translate("Programme"),
                SGI.translate("Logic"),
                SGI.translate("Listen Filter"),
                SGI.translate("Get Set Var"),
                SGI.translate("Convert"),
                SGI.translate("Math."),
                SGI.translate("Singel Trigger"),
                SGI.translate("Zeit Trigger"),
                SGI.translate("Trigger Daten"),
                SGI.translate("Expert")
            ]

        });


        $("#toolbox_" + box_init[1]).show();

        // Toolboxauswahl
        $("#toolbox_select").change(function () {
            var val = $("#toolbox_select").xs_combo();
            var box = "";

            if (val == SGI.translate("Allgemein")) {
                box = "alg"
            }
            if (val == SGI.translate("Programme")) {
                box = "prog"
            }
            if (val == SGI.translate("Logic")) {
                box = "logic"
            }
            if (val == SGI.translate("Listen Filter")) {
                box = "filter"
            }
            if (val == SGI.translate("Get Set Var")) {
                box = "io"
            }
            if (val == SGI.translate("Singel Trigger")) {
                box = "s_trigger"
            }
            if (val == SGI.translate("Zeit Trigger")) {
                box = "t_trigger"
            }
            if (val == SGI.translate("Trigger Daten")) {
                box = "trigger_daten"
            }
            if (val == SGI.translate("Expert")) {
                box = "expert"
            }
            if (val == SGI.translate("Math.")) {
                box = "math"
            }
            if (val == SGI.translate("Convert")) {
                box = "convert"
            }
//            if(val ==""){box = ""}
//            if(val ==""){box = ""}
//            if(val ==""){box = ""}
            $(".toolbox").hide();
            $("#toolbox_" + box).show();
            storage.set(SGI.str_tollbox, [val, box]);
        });

        // Live Test
        $("#clear_force").button()
            .click(function () {
                $(this).removeClass("ui-state-focus");
                SGI.del_all_force();
            });


        var start_h;
        var log_h = 130;
        $("#sim_log_head")
            .hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            })
            .dblclick(function () {

                if ($("#sim_log").height() > 129) {
                    log_h = $("#sim_log").height();

                    $("#sim_log").css({
                        height: "10px",
                        "min-height": "10px"
                    });
                    $("#main").css({height: 'calc(100% - ' + (58 + 10) + 'px)'});
                } else {
                    $("#sim_log").css({height: "" + log_h + "px"});
                    $("#main").css({height: 'calc(100% - ' + (58 + log_h) + 'px)'});
                }
            })

            .drag("init", function () {
                start_h = $("#sim_log").height();
            })

            .drag("start", function (ev, dd) {

            })

            .drag(function (ev, dd) {
                if (start_h - dd.deltaY < 130) {
                    $("#sim_log").css({height: "130px"});
                    $("#main").css({height: 'calc(100% - ' + (58 + 130) + 'px)'});
                } else {
                    $("#sim_log").css({height: start_h - dd.deltaY + "px"});
                    $("#main").css({height: 'calc(100% - ' + (58 + start_h - dd.deltaY) + 'px)'});
                }

            });

        if (scope.setup.LT_open == false) {
            $("#sim_log").css({
                height: "10px",
                "min-height": "10px"
            });
            $("#main").css({height: 'calc(100% - ' + (58 + 10) + 'px)'});
        }


        //      Make element draggable
        var active_toolbox;

        $(".fbs").draggable({
            helper: "clone",
            appendTo: "body",
            zIndex: 101,
            containment: "body",
            iframeFix: true,
            start: function (e, ui) {
            },
            drag: function (e, ui) {
                ui.position.left = parseInt(ui.offset.left + 52);
                ui.position.top = parseInt(ui.offset.top - 0);
            },
            stop: function () {
                $("#helper").remove()
            }
        });

        $(".mbs").draggable({
            helper: "clone",
            appendTo: "body",
            zIndex: 101,
            containment: "body",
            iframeFix: true,
            start: function (e, ui) {

            },
            drag: function (e, ui) {

                ui.position.left = parseInt(ui.offset.left + 10);
                ui.position.top = parseInt(ui.offset.top - 0);
            },
            stop: function () {
                $("#helper").remove()
            }
        });

        //Make element droppable
        $(".prg_panel")
            .droppable({
                accept: ".mbs , .fbs",
                drop: function (ev, ui) {
                    setTimeout(function () {


                        if ($(ui["draggable"][0]).hasClass("mbs")) {
                            if (ui["draggable"] != ui["helper"] && ev.pageX > 180) {
                                var data = {
                                    type: $(ui["draggable"][0]).attr("id")
                                };
                                var top = parseInt((ui["offset"]["top"] - $("#prg_panel").offset().top + 30) / SGI.zoom);
                                var left = parseInt((ui["offset"]["left"] - $("#prg_panel").offset().left + 10 ) / SGI.zoom);
                                SGI.add_mbs_element(data, left, top);
                            }
                        } else {

                            if ($(ev.target).attr("id") == "prg_panel" && SGI.drop_block == false && scope.setup.fbs_wrap == true && ev.pageX > 180) {
                                var data = {
                                    type: "codebox"
                                };
                                var top = parseInt((ui["offset"]["top"] - $("#prg_panel").offset().top - 20 ) / SGI.zoom);
                                var left = parseInt((ui["offset"]["left"] - $("#prg_panel").offset().left ) / SGI.zoom);
                                SGI.add_mbs_element(data, left, top);


                                data = {
                                    parent: $("#prg_panel").children().last().children().last().attr("id"),
                                    type: $(ui["draggable"][0]).attr("id")
                                };


                                SGI.add_fbs_element(data, 50 / SGI.zoom, 50 / SGI.zoom);

                            }

                        }
                    }, 0);
                }

            });


        SGI.menu_iconbar();
        SGI.context_menu();
        SGI.quick_help();
        SGI.select_mbs();
        SGI.select_fbs();
        SGI.setup_socket();
        SGI.global_event();
        SGI.check_fs(function () {
            SGI.read_experts();
            SGI.make_conpanel();
        });


// SETUP ___________________________________________________________________________________________________________

        $("#setup_dialog").dialog({
            modal: false,
            width: 600,
            maxWidth: "80%",
            height: 400,
            maxHeight: "80%",
            autoOpen: false,
            open: function () {
                SGI.Setup_dialog()
            },
            close: function () {
                scope.$apply();
                SGI.save_setup();
            }
        });

//      $("#setup_dialog").dialog("close");

        scope.save_scope_watchers();


        main_win.focus();
        main_win.show();
        try {
            start_win.close();
        }
        catch (err) {
        }

        console.log("Start finish");


        // todo Register mit Homepage verbinden
//        setTimeout(function () {
//            SGI.server_register()
//        }, 5000);

        setTimeout(function () {
            if (SGI.dev != true) {


                if (scope.setup.update) {
                    upd.checkNewVersion(function (error, newVersionExists, manifest) {

                        if (!error && newVersionExists) {
                            SGI.update()
                        }
                    });
                }

                if ((new Date).toLocaleDateString() != scope.setup.last_open) {
                    SGI.server_homecall()
                }

            }
        }, 100);
    },

    global_event: function () {
        $('#body').on('click', function (event) {
            if ($(event.target).hasClass("prg_panel")) {
                $(".codebox_active").removeClass("codebox_active");
            }
            if (!$(event.target).hasClass("dot") && $(event.target).parent().prop("tagName") != "svg") {
                $(".dot").remove();
            }

        });

        //todo umstellung auf node-webkit shortcuts
        // | backspace 	 8    |   e 	            69   |    numpad 8          104
        // | tab 	     9    |   f 	            70   |    numpad 9          105
        // | enter 	     13   |   g 	            71   |    multiply          106
        // | shift 	     16   |   h 	            72   |    add           	107
        // | ctrl 	     17   |   i 	            73   |    subtract          109
        // | alt 	     18   |   j 	            74   |    decimal point     110
        // | pause/break 19   |   k 	            75   |    divide            111
        // | caps lock 	 20   |   l 	            76   |    f1            	112
        // | escape 	 27   |   m 	            77   |    f2            	113
        // | page up 	 33   |   n 	            78   |    f3            	114
        // | page down 	 34   |   o 	            79   |    f4            	115
        // | end 	     35   |   p 	            80   |    f5            	116
        // | home 	     36   |   q 	            81   |    f6            	117
        // | left arrow  37   |   r 	            82   |    f7            	118
        // | up arrow 	 38   |   s 	            83   |    f8            	119
        // | right arrow 39   |   t	                84   |    f9            	120
        // | down arrow  40   |   u 	            85   |    f10           	121
        // | insert 	 45   |   v 	            86   |    f11           	122
        // | delete 	 46   |   w 	            87   |    f12           	123
        // | 0 	         48   |   x 	            88   |    num lock          144
        // | 1 	         49   |   y 	            89   |    scroll lock      	145
        // | 2 	         50   |   z 	            90   |    semi-colon       	186
        // | 3 	         51   |   left window key   91   |    equal sign       	187
        // | 4 	         52   |   right window key  92   |    comma             188
        // | 5 	         53   |   select key 	    93   |    dash          	189
        // | 6 	         54   |   numpad 0 	        96   |    period            190
        // | 7 	         55   |   numpad 1 	        97   |    forward slash     191
        // | 8 	         56   |   numpad 2 	        98   |    grave accent      192
        // | 9 	         57   |   numpad 3 	        99   |    open bracket      219
        // | a 	         65   |   numpad 4 	        100  |    back slash        220
        // | b 	         66   |   numpad 5 	        101  |    close braket      221
        // | c 	         67   |   numpad 6 	        102  |    single quote 	    222
        // | d 	         68   |   numpad 7 	        103  |

        $(document).keydown(function (event) {
            SGI.key = event.keyCode;

            if (SGI.key == 46) {
                SGI.del_selected()
            } else if (SGI.key == 67 && event.ctrlKey == true) {
                SGI.copy_selected();
                $("body").css({cursor: "default"});
            } else if (SGI.key == 86 && event.ctrlKey == true) {
                SGI.paste_selected();
                $("body").css({cursor: "default"});
            } else if (SGI.key == 68 && event.altKey == true) {
                $("#develop_menu").show()
            } else if (SGI.key == 89 && event.altKey == true) {
                main_win.showDevTools();
            } else if (SGI.key == 88 && event.altKey == true) {
//                main_win.close();
                main_win.reload();
            } else if (SGI.key == 70 && event.altKey == true) {
                var test = test_fehler;
            } else if (SGI.key == 18 || SGI.key == 91 || SGI.key == 93 || event.alt == true) {
                $("body").css({cursor: "help"});
                SGI.key = 17;
            }

        });

        $(document).on('click', ".fbs_element", function (target) {
            if (SGI.key == 16) {
                if ($(this).hasClass("fbs_element")) {

                    if ($(this).hasClass("jsplumb-drag-selected")) {
                        SGI.plumb_inst["inst_" + $(this).parent().parent().attr("id")].removeFromDragSelection($(this));
                    } else {
                        SGI.plumb_inst["inst_" + $(this).parent().parent().attr("id")].addToDragSelection($(this));
                    }

                } else {
                    $.each($(target.target).parents(), function () {

                        if ($(this).hasClass("fbs_element")) {
                            if ($(this).hasClass("jsplumb-drag-selected")) {
                                SGI.plumb_inst["inst_" + $(this).parent().parent().attr("id")].removeFromDragSelection($(this));
                            } else {
                                SGI.plumb_inst["inst_" + $(this).parent().parent().attr("id")].addToDragSelection($(this));
                            }
                        }

                    });
                }
            }
        });

        $(document).on('click', ".mbs_element", function (target) {
            if (SGI.key == 16) {
                if ($(this).hasClass("mbs_element")) {
                    if ($(this).hasClass("jsplumb-drag-selected")) {
                        SGI.plumb_inst.inst_mbs.removeFromDragSelection($(this));
                    } else {
                        SGI.plumb_inst.inst_mbs.addToDragSelection($(this));
                    }
                } else {
                    $.each($(target.target).parents(), function () {

                        if ($(this).hasClass("mbs_element")) {
                            if ($(this).hasClass("jsplumb-drag-selected")) {
                                SGI.plumb_inst.inst_mbs.removeFromDragSelection($(this));
                            } else {
                                SGI.plumb_inst.inst_mbs.addToDragSelection($(this));
                            }
                        }
                    });
                }
            }
        });

        $(document).keyup(function () {
            if (SGI.key == 17) {
                $("body").css({cursor: "default"});
            }
            SGI.key = "";
        });

    },

    save_setup: function () {
        console.log("setup save");
        fs.writeFile(nwDir + '/setup.json', JSON.stringify(scope.setup), function (err) {
            if (!err) {
                console.log("save")
            } else {
                console.log(err)
            }
        });
    },

    mbs_inst: function () {

        SGI.plumb_inst.inst_mbs = jsPlumb.getInstance({
            PaintStyle: {lineWidth: 4, strokeStyle: "blue"},
            HoverPaintStyle: {strokeStyle: "red", lineWidth: 2},
//            ConnectionOverlays: [
//                [ "Arrow", {
//                    location: 1,
//                    id: "arrow",
//                    length: 12,
//                    foldback: 0.8
//                } ]
//            ],
            Container: "prg_panel",
            Connector: ["Flowchart", {stub: 30, alwaysRespectStubs: true, midpoint: 0.5}],
            Scope: "singel"
        });

        var mbs_dot;
        SGI.plumb_inst.inst_mbs.bind("click", function (c) {
            mbs_dot = setTimeout(function () {

                var id = c.id;
                var connector_data;
                var dot1_x;
                var dot1_y;
                var dot2_x;
                var dot2_y;
                var dot3_x;
                var dot3_y;
                var dot1_old_posi;
                var dot3_old_posi;
                var dot2_old_posi;
                var dot2_d;
                var svg_w;
                var svg_h;
                var dot_start;
                var old_midpoint;
                var old_stub;


                function make_dot() {
                    connector_data = scope.con.mbs[id].connector;
                    var svg_posi = {
                        top: parseInt($(c.connector.svg).css("top")),
                        left: parseInt($(c.connector.svg).css("left"))
                    };

                    var prg_posi = $(c.connector.svg).parent().offset();
                    var path = c.connector.getPath();
                    var svg_trans = $(c.connector.svg).children().first()[0].getAttribute("transform").replace("translate(", "").replace(")", "").split(",");
                    dot1_x = svg_posi.left + path[0].end[0] + parseInt(svg_trans[0]) - 8;
                    dot1_y = svg_posi.top + path[0].end[1] + parseInt(svg_trans[1]) - 8;

                    if (path.length == 5) {
                        dot2_x = svg_posi.left + path[3].start[0] + parseInt(svg_trans[0]) + Math.abs((path[2].start[0] - path[2].end[0]) / 2) + 1;
                        dot2_y = svg_posi.top + path[2].start[1] - parseInt(svg_trans[1]) + Math.abs((path[3].start[1] - path[2].start[1]) / 2) + 1;
                        dot2_d = "y";
                        dot3_x = svg_posi.left + path[path.length - 1].start[0] + parseInt(svg_trans[0]) - 8;
                        dot3_y = svg_posi.top + path[path.length - 1].end[1] - parseInt(svg_trans[1]);

                        $(".dot").remove();
                        $("#prg_panel").append('<div id="dot1" class="dot" style="left:' + dot1_x + 'px;top: ' + dot1_y + 'px  "></div>');
                        $("#prg_panel").append('<div id="dot2" class="dot" style="left:' + dot2_x + 'px;top: ' + dot2_y + 'px  "></div>');
                        $("#prg_panel").append('<div id="dot3" class="dot" style="left:' + dot3_x + 'px;top: ' + dot3_y + 'px  "></div>');
                        dot1_drag();
                        dot2_drag();
                        dot3_drag();
                    }
                    if (path.length == 3 && path[2].start[0] < path[2].end[0] && path[1].start[1] < path[1].end[1]) {
                        dot2_x = svg_posi.left + path[1].start[0] - parseInt(svg_trans[0]) - Math.abs((path[2].start[0] - path[2].start[0]) / 2);
                        dot2_y = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) + Math.abs((path[2].start[1] - path[1].start[1]) / 2);
                        dot3_x = svg_posi.left + path[path.length - 1].end[0] + parseInt(svg_trans[0]) - 8;
                        dot3_y = svg_posi.top + path[path.length - 1].end[1] - parseInt(svg_trans[1]);

                        $(".dot").remove();
                        $("#prg_panel").append('<div id="dot1" class="dot" style="left:' + dot1_x + 'px;top: ' + dot1_y + 'px  "></div>');
                        $("#prg_panel").append('<div id="dot2" class="dot" style="left:' + dot2_x + 'px;top: ' + dot2_y + 'px  "></div>');
                        $("#prg_panel").append('<div id="dot3" class="dot" style="left:' + dot3_x + 'px;top: ' + dot3_y + 'px  "></div>');
                        dot1_drag();
                        dot2_drag();
                        dot3_drag();
                    }
                    if (path.length == 3 && path[2].start[0] < path[2].end[0] && path[1].start[1] > path[1].end[1]) {
                        dot2_x = svg_posi.left + path[1].start[0] - parseInt(svg_trans[0]) - Math.abs((path[2].start[0] - path[2].start[0]) / 2);
                        dot2_y = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) - Math.abs((path[2].start[1] - path[1].start[1]) / 2);
                        dot3_x = svg_posi.left + path[path.length - 1].end[0] + parseInt(svg_trans[0]) - 8;
                        dot3_y = svg_posi.top + path[path.length - 1].end[1] - parseInt(svg_trans[1]);

                        $(".dot").remove();
                        $("#prg_panel").append('<div id="dot1" class="dot" style="left:' + dot1_x + 'px;top: ' + dot1_y + 'px  "></div>');
                        $("#prg_panel").append('<div id="dot2" class="dot" style="left:' + dot2_x + 'px;top: ' + dot2_y + 'px  "></div>');
                        $("#prg_panel").append('<div id="dot3" class="dot" style="left:' + dot3_x + 'px;top: ' + dot3_y + 'px  "></div>');
                        dot1_drag();
                        dot2_drag();
                        dot3_drag();
                    }
                    if (path.length == 3 && path[2].start[0] > path[2].end[0]) {
                        $(".dot").remove();
                        $("#prg_panel").append('<div id="dot1" class="dot" style="left:' + dot1_x + 'px;top: ' + dot1_y + 'px  "></div>');
                        dot1_drag()
                    }
                    if (path.length == 4) {
                        dot2_x = svg_posi.left + path[1].start[0] + parseInt(svg_trans[0]) - Math.abs((path[1].start[0] - path[1].end[0]) / 2) - 8;
                        dot2_y = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) + Math.abs((path[1].start[1] - path[1].start[1]) / 2) + 1;
                        dot2_d = "y";
                        $(".dot").remove();
                        $("#prg_panel").append('<div id="dot2" class="dot" style="left:' + dot2_x + 'px;top: ' + dot2_y + 'px  "></div>');
                        dot2_drag()

                    }


                    function dot1_drag() {

                        $("#dot1").draggable({
                            axis: "x",
                            containment: $(c.connector.svg).parent(),
                            start: function (e, ui) {


                                dot_start = ui.position;
                                connector_data = scope.con.mbs[id].connector;
                                old_stub = connector_data.stub.slice();

                                $("#dot2, #dot3").remove()

                            },
                            drag: function (e, ui) {
                                var dif_x = ui.position.left - dot_start.left;


                                var new_stub = parseInt(old_stub[0]) + dif_x;
                                if (new_stub < 30) {
                                    new_stub = 30;
                                    ui.position = dot1_old_posi;
                                } else {
                                    dot1_old_posi = ui.position
                                }
                                connector_data.stub[0] = new_stub;


                                c.setConnector(["Flowchart", {
                                    stub: connector_data.stub,
                                    alwaysRespectStubs: true,
                                    midpoint: connector_data.midpoint
                                }]);
                                dot1_x = svg_posi.left + path[0].end[0] + parseInt(svg_trans[0]);
                            },
                            stop: function () {
                                scope.con.mbs[id].connector = connector_data;
                                scope.$apply();
                                make_dot();
                            }
                        });
                    }

                    function dot2_drag() {
                        $("#dot2").draggable({
                            axis: dot2_d,
//                        containment: $(c.connector.svg).parent(),
                            start: function (e, ui) {
                                $("#dot1, #dot3").remove();
                                connector_data = scope.con.mbs[id].connector;
                                svg_w = parseInt(c.connector.bounds.maxX - (connector_data.stub[0] + connector_data.stub[1]));
                                svg_h = parseInt(c.connector.bounds.maxY);
                                dot_start = ui.position;
                                old_midpoint = parseFloat(connector_data.midpoint);

                                if (path.length == 4) {
                                    svg_h = parseInt(c.connector.bounds.maxY - (connector_data.stub[0]));
                                }

                                if (path.length == 5) {
                                    if (path[2].start[0] == path[2].end[0]) {
                                        dot2_d = "x";
                                        $("#dot2").draggable("option", "axis", "x");
                                    } else {
                                        dot2_d = "y";
                                        $("#dot2").draggable("option", "axis", "y");
                                    }

                                }
                                if (path.length == 3) {
                                    if (path[1].start[0] == path[1].end[0]) {
                                        dot2_d = "x";
                                        $("#dot2").draggable("option", "axis", "x");
                                    } else {
                                        dot2_d = "y";
                                        $("#dot2").draggable("option", "axis", "y");
                                    }
                                }
                            },
                            drag: function (e, ui) {
                                var dif_x = ui.position.left - dot_start.left;
                                var dif_y = ui.position.top - dot_start.top;
                                var new_midpoint;
                                path = c.connector.getPath();

                                if (dot2_d == "x") {
                                    new_midpoint = Math.round((1 / svg_w * (svg_w * old_midpoint + dif_x)) * 100) / 100;

                                } else {
                                    if (path[1].start[1] < path[1].end[1] || path[0].start[1] < path[0].end[1]) {
                                        new_midpoint = Math.round((1 / svg_h * (svg_h * old_midpoint + dif_y)) * 100) / 100;
                                    } else {
                                        new_midpoint = Math.round((1 / svg_h * (svg_h * old_midpoint - dif_y)) * 100) / 100;
                                    }
                                }

                                if (new_midpoint > 0.98 || new_midpoint < 0.02) {

                                    if (new_midpoint > 0.98) {
                                        new_midpoint = 0.98;
                                        if (path.length == 5) {
                                            ui.position.left = svg_posi.left + path[2].start[0] + parseInt(svg_trans[0]) - Math.abs((path[3].start[0] - path[2].start[0]) / 2) + 1;
                                            ui.position.top = svg_posi.top + path[2].start[1] + parseInt(svg_trans[1]) + Math.abs((path[3].start[1] - path[2].start[1]) / 2) - 8;
                                        } else if (path.length == 4) {
                                            ui.position.left = dot2_x = svg_posi.left + path[1].start[0] + parseInt(svg_trans[0]) - Math.abs((path[1].start[0] - path[1].end[0]) / 2) - 8;
                                            ui.position.top = dot2_y = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) + Math.abs((path[1].start[1] - path[1].start[1]) / 2) + 1;
                                        } else {
                                            ui.position.left = svg_posi.left + path[1].start[0] - parseInt(svg_trans[0]) - Math.abs((path[2].start[0] - path[2].start[0]) / 2);
                                            ui.position.top = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) + Math.abs((path[2].start[1] - path[1].start[1]) / 2);
                                        }
                                    }

                                    if (new_midpoint < 0.02) {
                                        new_midpoint = 0.02;
                                        if (path.length == 5) {
                                            ui.position.left = svg_posi.left + path[2].start[0] + parseInt(svg_trans[0]) - Math.abs((path[3].start[0] - path[2].start[0]) / 2) + 1;
                                            ui.position.top = svg_posi.top + path[2].start[1] + parseInt(svg_trans[1]) + Math.abs((path[3].start[1] - path[2].start[1]) / 2) - 8;
                                        } else if (path.length == 4) {
                                            ui.position.left = dot2_x = svg_posi.left + path[1].start[0] + parseInt(svg_trans[0]) - Math.abs((path[1].start[0] - path[1].end[0]) / 2) - 8;
                                            ui.position.top = dot2_y = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) + Math.abs((path[1].start[1] - path[1].start[1]) / 2) + 1;
                                        } else {
                                            ui.position.left = svg_posi.left + path[1].start[0] - parseInt(svg_trans[0]) - Math.abs((path[2].start[0] - path[2].start[0]) / 2);
                                            ui.position.top = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) + Math.abs((path[2].start[1] - path[1].start[1]) / 2);
                                        }
                                    }
                                } else {
                                    dot2_old_posi = ui.position
                                }

                                connector_data.midpoint = new_midpoint;
                                c.setConnector(["Flowchart", {
                                    stub: connector_data.stub,
                                    alwaysRespectStubs: true,
                                    midpoint: connector_data.midpoint
                                }]);
                            },
                            stop: function () {
                                scope.con.mbs[id].connector = connector_data;
                                scope.$apply();
                                make_dot();
                            }

                        });
                    }

                    function dot3_drag() {
                        $("#dot3").draggable({
                            axis: "x",
                            containment: $(c.connector.svg).parent(),
                            start: function (e, ui) {

                                dot_start = ui.position;
                                connector_data = scope.con.mbs[id].connector;
                                old_stub = connector_data.stub.slice();

                                $("#dot1, #dot2").remove()
                            },
                            drag: function (e, ui) {
                                var dif_x;
                                var new_stub;

                                if (path[path.length - 1].start[0] < path[path.length - 1].end[0]) {
                                    dif_x = ui.position.left - dot_start.left;
                                    new_stub = parseInt(old_stub[1]) - dif_x;
                                    if (new_stub < 30) {
                                        new_stub = 30;
                                        ui.position = dot3_old_posi;
                                    } else {
                                        dot3_old_posi = ui.position
                                    }
                                    connector_data.stub[1] = new_stub;
                                    c.setConnector(["Flowchart", {
                                        stub: connector_data.stub,
                                        alwaysRespectStubs: true,
                                        midpoint: connector_data.midpoint
                                    }]);
                                    dot2_x = svg_posi.left + path[0].end[0] + parseInt(svg_trans[0]);
                                } else {
                                    dif_x = ui.position.left - dot_start.left;
                                    new_stub = parseInt(old_stub[1]) + dif_x;
                                    if (new_stub < 30) {
                                        new_stub = 30;
                                        ui.position = dot3_old_posi;
                                    } else {
                                        dot3_old_posi = ui.position
                                    }
                                    connector_data.stub[1] = new_stub;
                                    c.setConnector(["Flowchart", {
                                        stub: connector_data.stub,
                                        alwaysRespectStubs: true,
                                        midpoint: connector_data.midpoint
                                    }]);
                                    dot2_x = svg_posi.left + path[0].end[0] + parseInt(svg_trans[0]);
                                }
                            },
                            stop: function () {
                                scope.con.mbs[id].connector = connector_data;
                                scope.$apply();
                                make_dot();
                            }
                        });
                    }
                }

                if (scope.con.mbs[id]) {
                    make_dot();
                }

            }, 300)
        });

        SGI.plumb_inst.inst_mbs.bind("dblclick", function (c) {
            if (SGI.klick.target.tagName == "path") {
                $(".dot").remove();
                SGI.plumb_inst.inst_mbs.detach(c);
            }
        });

        SGI.plumb_inst.inst_mbs.bind("connection", function (c) {

            var mbs_in = c.targetId.split("_")[0];

            scope.con.mbs[c.connection.id] = {
                pageSourceId: c.connection.sourceId,
                pageTargetId: c.connection.targetId,
                connector: {
                    stub: [30, 30],
                    midpoint: 0.5
                }
            };


            scope.$apply();

            if (mbs_in == "brake" || mbs_in == "intervall" || mbs_in == "loop") {
                c.connection.removeAllOverlays()
            }
        });

        SGI.plumb_inst.inst_mbs.bind("contextmenu", function (c) {
            SGI.con = c;
        });

        SGI.plumb_inst.inst_mbs.bind("connectionDetached", function (c) {
            delete scope.con.mbs[c.connection.id];
            scope.$apply();
        });

    },

    select_mbs: function () {

        // Click coordinates
        var x1, x2, y1, y2;

        //Variable indicates wether a mousedown event within your selection happend or not
        var selection_mbs = false;
        var selection_start = false;

        // Selection frame (playground :D)
        $("#prg_body").mousedown(function (e) {

            if ($(e.target).attr("id") == "prg_panel") {

                var x = $("#prg_body").width() + 150;
                var y = $("#prg_body").height() + 50;

                if (e.pageX < x - 20 && e.pageY < y - 20) {
                    selection_mbs = true;
                    // store mouseX and mouseY
                    x1 = e.pageX;
                    y1 = e.pageY;
                }
            }
        });

        // If selection is true (mousedown on selection frame) the mousemove
        // event will draw the selection div
        $('#prg_body,#selection').mousemove(function (e) {
            if (selection_mbs) {
                if (!selection_start) {

                    $.each(SGI.plumb_inst, function () {
                        this.clearDragSelection();
                    });

                    selection_start = true;
                }
                // Store current mouseposition
                x2 = e.pageX;
                y2 = e.pageY;

                // Prevent the selection div to get outside of your frame
                //(x2+this.offsetleft < 0) ? selection = false : ($(this).width()+this.offsetleft < x2) ? selection = false : (y2 < 0) ? selection = false : ($(this).height() < y2) ? selection = false : selection = true;;
                // If the mouse is inside your frame resize the selection div
                if (selection_mbs) {
                    // Calculate the div selection rectancle for positive and negative values
                    var TOP = (y1 < y2) ? y1 : y2;
                    var LEFT = (x1 < x2) ? x1 : x2;
                    var WIDTH = (x1 < x2) ? x2 - x1 : x1 - x2;
                    var HEIGHT = (y1 < y2) ? y2 - y1 : y1 - y2;

                    // Use CSS to place your selection div
                    $("#selection").css({
                        position: 'absolute',
                        zIndex: 5000,
                        left: LEFT,
                        top: TOP,
                        width: WIDTH,
                        height: HEIGHT
                    });
                    $("#selection").show();

                    // Info output
                    $('#status2').html('( x1 : ' + x1 + ' )  ( x2 : ' + x2 + ' )  ( y1 : ' + y1 + '  )  ( y2 : ' + y2 + ' )  SPOS:' + TOP);
                }
            }
        });
        // UNselection
        // Selection complete, hide the selection div (or fade it out)
        $('#prg_body,#selection').mouseup(function (e) {

            selection_start = false;
            if (selection_mbs) {
                var mbs_element = $("#prg_panel").find(".jsplumb-drag-selected");
                if (mbs_element.length > 0) {
                    if ($(e.target).attr("id") == "prg_panel" || $(e.target).is(".prg_codebox")) {
                        $.each(SGI.plumb_inst, function () {
                            this.clearDragSelection();
                        });
                    }
                    $("#selection").hide();
                } else {
                    getIt();
                    $("#selection").hide();
                }
            }
            selection_mbs = false;
        });


        //Function for the select
        function getIt() {
            if (selection_mbs) {
                // Get all elements that can be selected
                $(".mbs_element").each(function () {
                    var p = $(this).offset();
                    // Calculate the center of every element, to save performance while calculating if the element is inside the selection rectangle
                    var xmiddle = p.left + $(this).width() / 2;
                    var ymiddle = (p.top - 50) + $(this).height() / 2;
                    if (matchPos(xmiddle, ymiddle)) {
                        // Colorize border, if element is inside the selection
                        if (!$(this).hasClass("mbs_element_codebox")) {
                            SGI.plumb_inst.inst_mbs.addToDragSelection($(this))
                        }
                    }
                });
            }
        }

        function matchPos(xmiddle, ymiddle) {
            // If selection is done bottom up -> switch value
            var myX1;
            var myX2;
            var myY1;
            var myY2;

            if (x1 > x2) {
                myX1 = x2;
                myX2 = x1;
            } else {
                myX1 = x1;
                myX2 = x2;
            }
            if (y1 > y2) {
                myY1 = y2;
                myY2 = y1;
            } else {
                myY1 = y1;
                myY2 = y2;
            }
            // Matching
            if ((xmiddle > myX1) && (xmiddle < myX2)) {
                if ((ymiddle > myY1) && (ymiddle < myY2)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    },

    select_fbs: function () {

        // Click coordinates
        var x, y, x1, x2, y1, y2;

        //Variable indicates wether a mousedown event within your selection happend or not
        var selection_fbs = false;
        var selection_start = false;
        var selection_codebox = "";
        var inst;

        // Selection frame (playground :D)
        $("#prg_panel").on("mousedown", ".prg_codebox", function (e) {
            if ($(e.target).is('.prg_codebox')) {
                $("body").bind("mousemove", function (_e) {

                    inst = $(e.target).parent().attr("id");

                    if (selection_fbs) {

                        if (!selection_start) {
//                            $(".fbs_element").removeClass("fbs_selected");
                            $.each(SGI.plumb_inst, function () {
                                this.clearDragSelection();
                            });
                            selection_start = true;
                        }
                        // Store current mouseposition
                        x2 = _e.pageX;
                        y2 = _e.pageY;

                        if (x2 > ($(selection_codebox).parent().offset().left + x)) {
                            x2 = $(selection_codebox).parent().offset().left + x + 2;
                        }
                        if (x2 < ($(selection_codebox).parent().offset().left)) {
                            x2 = $(selection_codebox).parent().offset().left - 2;
                        }
                        if (y2 > ($(selection_codebox).parent().offset().top + y )) {
                            y2 = $(selection_codebox).parent().offset().top + y + 2;
                        }
                        if (y2 < ($(selection_codebox).parent().offset().top)) {
                            y2 = $(selection_codebox).parent().offset().top - 2;
                        }

                        // Prevent the selection div to get outside of your frame
                        //(x2+this.offsetleft < 0) ? selection = false : ($(this).width()+this.offsetleft < x2) ? selection = false : (y2 < 0) ? selection = false : ($(this).height() < y2) ? selection = false : selection = true;;
                        // If the mouse is inside your frame resize the selection div

                        // Calculate the div selection rectancle for positive and negative values
                        var TOP = (y1 < y2) ? y1 : y2;
                        var LEFT = (x1 < x2) ? x1 : x2;
                        var WIDTH = (x1 < x2) ? x2 - x1 : x1 - x2;
                        var HEIGHT = (y1 < y2) ? y2 - y1 : y1 - y2;


                        // Use CSS to place your selection div
                        $("#selection").css({
                            position: 'absolute',
                            zIndex: 5000,
                            left: LEFT + 3,
                            top: TOP + 3,
                            width: WIDTH - 3,
                            height: HEIGHT - 3
                        });
                        $("#selection").show();

                        // Info output
                        $('#status2').html('( x1 : ' + x1 + ' )  ( x2 : ' + x2 + ' )  ( y1 : ' + y1 + '  )  ( y2 : ' + y2 + ' )  SPOS:' + TOP);
                    }
                });
                selection_codebox = this;
                x = $(this).width();
                y = $(this).height();

                selection_fbs = true;
                // store mouseX and mouseY
                x1 = e.pageX - 2;
                y1 = e.pageY - 2;
                x2 = e.pageX - 2;
                y2 = e.pageY - 2;
            }
        });

        $(document).mouseup(function (e) {
            if (selection_fbs) {
//                var $fbs_element = $("#prg_panel").find(".fbs_selected");
                var $fbs_element = $("#prg_panel").find(".jsplumb-drag-selected");

                if (e.shiftKey == true) {
                    var $target = $(e.target);
                    if ($target.hasClass("fbs_element")) {
                        $target.toggleClass("fbs_selected");
                    } else {
                        $.each($target.parents(), function () {
                            if ($(this).hasClass("fbs_element")) {
                                $(this).toggleClass("fbs_selected");
                            }
                        });
                    }
                    getIt();
                    $("#selection").hide();
                }
                else {
                    $.each(SGI.plumb_inst, function () {
                        this.clearDragSelection();
                    });
                    getIt();
                    $("#selection").hide();
                }
                selection_fbs = false;
                $("body").unbind("mousemove");
            }
        });


        //Function for the select
        function getIt() {
            if (selection_fbs) {
                // Get all elements that can be selected
                $(".fbs_element").each(function () {
                    var p = $(this).offset();
                    // Calculate the center of every element, to save performance while calculating if the element is inside the selection rectangle
                    var xmiddle = p.left + $(this).width() / 2;
                    var ymiddle = (p.top ) + $(this).height() / 2;
                    if (matchPos(xmiddle, ymiddle)) {
                        // Colorize border, if element is inside the selection
//                        $(this).addClass("fbs_selected");
//                        $(this).addClass("jsplumb-drag-selected");
//                        alert(inst)
                        SGI.plumb_inst["inst_" + inst].addToDragSelection($(this))
                    }
                });
            }
        }

        function matchPos(xmiddle, ymiddle) {
            // If selection is done bottom up -> switch value
            var myX1;
            var myX2;
            var myY1;
            var myY2;

            if (x1 > x2) {
                myX1 = x2;
                myX2 = x1;
            } else {
                myX1 = x1;
                myX2 = x2;
            }
            if (y1 > y2) {
                myY1 = y2;
                myY2 = y1;
            } else {
                myY1 = y1;
                myY2 = y2;
            }
            // Matching
            if ((xmiddle > myX1) && (xmiddle < myX2)) {
                if ((ymiddle > myY1) && (ymiddle < myY2)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }


    },

    load_prg: function (_data) {
        var data = _data;
        if (data.version == undefined) {

            $.each(data.mbs, function () {
                this["style"] = {
                    "left": this.left + "px",
                    "top": this.top + "px",
                    "width": this.width + "px",
                    "height": this.height + "px"
                };

                delete this.left;
                delete this.top;
                delete this.width;
                delete this.height;


                SGI.add_mbs_element(this);
                if (this.counter > SGI.mbs_n) {
                    SGI.mbs_n = this.counter
                }

            });
            $.each(data.fbs, function () {
                this["style"] = {
                    "left": this.left + "px",
                    "top": this.top + "px"
                };

                delete this.left;
                delete this.top;


                SGI.add_fbs_element(this);
                if (this.counter > SGI.mbs_n) {
                    SGI.fbs_n = this.counter
                }
            });
            $.each(data.connections.mbs, function () {
                var source = this.pageSourceId;
                var target = this.pageTargetId;
                var c;
                this["connector"] = {
                    "stub": [30, 30],
                    "midpoint": 0.5
                };

                if (target.split("_")[0] == "codebox") {
                    try {
                        c = SGI.plumb_inst.inst_mbs.connect({
                            uuids: [source],
                            target: target

                        });
                        c.setConnector(["Flowchart", {
                            stub: this.connector.stub,
                            alwaysRespectStubs: true,
                            midpoint: this.connector.midpoint
                        }]);
                        scope.con.mbs[c.id] = {
                            pageSourceId: c.sourceId,
                            pageTargetId: c.targetId,
                            connector: {
                                stub: this.connector.stub,
                                midpoint: this.connector.midpoint
                            }
                        };
                    } catch (err) {
                    }


                } else {
                    try {
                        c = SGI.plumb_inst.inst_mbs.connect({uuids: [source, target]});

                        c.setConnector(["Flowchart", {
                            stub: this.connector.stub,
                            alwaysRespectStubs: true,
                            midpoint: this.connector.midpoint
                        }]);
                        scope.con.mbs[c.id] = {
                            pageSourceId: c.sourceId,
                            pageTargetId: c.targetId,
                            connector: {
                                stub: this.connector.stub,
                                midpoint: this.connector.midpoint
                            }
                        }
                    } catch (err) {
                    }
                }

            });
            $.each(data.connections.fbs, function (index) {
                $.each(this, function () {
                    this["connector"] = {
                        "stub": [30, 30],
                        "midpoint": 0.5
                    };

                    try {

                        var source = this.pageSourceId;
                        var target = this.pageTargetId;

                        var c = SGI.plumb_inst["inst_" + index].connect({
                            uuids: [source, target]

                        });

                        c.setConnector(["Flowchart", {
                            stub: this.connector.stub,
                            alwaysRespectStubs: true,
                            midpoint: this.connector.midpoint
                        }]);

                        scope.con.fbs[index][c.id] = {
                            pageSourceId: c.sourceId,
                            pageTargetId: c.targetId,
                            connector: {
                                stub: this.connector.stub,
                                midpoint: this.connector.midpoint
                            }
                        };
                        scope.$apply()

                    } catch (err) {
                        console.log(err);
                        console.log(this)
                    }
                });
            });

        } else {
            $.each(data.mbs, function () {
                SGI.add_mbs_element(this);
                if (this.counter > SGI.mbs_n) {
                    SGI.mbs_n = this.counter
                }
            });
            $.each(data.fbs, function () {
                SGI.add_fbs_element(this);
                if (this.counter > SGI.fbs_n) {
                    SGI.fbs_n = this.counter
                }
            });
            $.each(data.con.mbs, function () {
                var source = this.pageSourceId;
                var target = this.pageTargetId;
                var c;
                if (target.split("_")[0] == "codebox") {
                    c = SGI.plumb_inst.inst_mbs.connect({
                        uuids: [source],
                        target: target

                    });
                    c.setConnector(["Flowchart", {
                        stub: this.connector.stub,
                        alwaysRespectStubs: true,
                        midpoint: this.connector.midpoint
                    }]);
                    scope.con.mbs[c.id] = {
                        pageSourceId: c.sourceId,
                        pageTargetId: c.targetId,
                        connector: {
                            stub: this.connector.stub,
                            midpoint: this.connector.midpoint
                        }
                    };

                } else {
                    c = SGI.plumb_inst.inst_mbs.connect({uuids: [source, target]});

                    c.setConnector(["Flowchart", {
                        stub: this.connector.stub,
                        alwaysRespectStubs: true,
                        midpoint: this.connector.midpoint
                    }]);
                    scope.con.mbs[c.id] = {
                        pageSourceId: c.sourceId,
                        pageTargetId: c.targetId,
                        connector: {
                            stub: this.connector.stub,
                            midpoint: this.connector.midpoint
                        }
                    }
                }

            });
            $.each(data.con.fbs, function (index) {
                $.each(this, function () {

                    try {

                        var source = this.pageSourceId;
                        var target = this.pageTargetId;

                        var c = SGI.plumb_inst["inst_" + index].connect({
                            uuids: [source, target]

                        });

                        c.setConnector(["Flowchart", {
                            stub: this.connector.stub,
                            alwaysRespectStubs: true,
                            midpoint: this.connector.midpoint
                        }]);

                        scope.con.fbs[index][c.id] = {
                            pageSourceId: c.sourceId,
                            pageTargetId: c.targetId,
                            connector: {
                                stub: this.connector.stub,
                                midpoint: this.connector.midpoint
                            }
                        };
                        scope.$apply()

                    } catch (err) {
                        console.log(err);
                        console.log(this)
                    }
                });
            });
        }

        SGI.fbs_n++;
        SGI.mbs_n++;

    },

    add_input: function (opt) {

        var id = $($(opt).attr("$trigger")).attr("id");
        var nr = $($(opt).attr("$trigger")).data("nr");
        var data = scope.fbs[nr];
        var nr = $($(opt).attr("$trigger")).data("nr");
        var type = id.split("_")[0];
        var index = $($("#" + id).find("[id^='left']")).children().length + 1;
        var add_id = type + '_' + nr + '_in' + index + '';

        scope.fbs[nr].input_n = parseInt(index);


        $($("#" + id).find("[id^='left']")).append('\
                <div id="' + add_id + '"  class="div_input ' + type + '_' + nr + '_in"><a class="input_font">IN ' + index + '</a></div>\
                ');

        SGI.add_fbs_endpoint(add_id, "input", data);
        SGI.plumb_inst["inst_" + $("#" + data.fbs_id).parent().parent().attr("id")].repaintEverything();
    },

    add_fbs_endpoint: function (_id, _type, data, _position) {

        var scope = data.scope;
        var parent = data.parent;
        var id = _id;
        var position = _position || "";
        var type = _type || "";
        var endpointStyle = {};
        var _stub = 30;

        var codebox = $("#" + parent).parent().attr("id");

console.log("scope"+scope);
console.log("type"+type);
console.log("position"+position);
        if (scope == "singel") {
            if (type == "input") {
                endpointStyle = {fillStyle: "green"};
                SGI.plumb_inst["inst_" + codebox].addEndpoint(id.toString(), {uuid: id.toString()}, {
                    anchor: [0, 0.5, -1, 0, 0, 0],
                    isTarget: true,
                    paintStyle: endpointStyle,
                    connector: ["Flowchart", {stub: _stub, alwaysRespectStubs: true, midpoint: 0.9}],
                    endpoint: ["Rectangle", {width: 20, height: 10}]
                });
            }
            if (type == "output") {
                endpointStyle = {fillStyle: "green"};
                SGI.plumb_inst["inst_" + codebox].addEndpoint(id.toString(), {uuid: id.toString()}, {
                    anchor: [1, 0.5, 1, 0, 0, 0],
                    isSource: true,
                    maxConnections: -1,
                    paintStyle: endpointStyle,
                    connector: ["Flowchart", {stub: _stub, alwaysRespectStubs: true, midpoint: 0.5}],
                    endpoint: ["Rectangle", {width: 20, height: 10}],
                    connectorStyle: {lineWidth: 4, strokeStyle: "#00aaff"}
                });
            }
            if (position == "onborder") {
                endpointStyle = {fillStyle: "#006600"};
                SGI.plumb_inst["inst_" + codebox].addEndpoint(id.toString(), {uuid: id.toString()}, {
                    isTarget: true,
                    paintStyle: endpointStyle,
                    cssClass: "ep_fbs_onborder",
                    connector: ["Flowchart", {stub: _stub, alwaysRespectStubs: true}],
                    endpoint: ["Rectangle", {width: 13, height: 13}]
                });
                SGI.plumb_inst["inst_" + codebox].repaintEverything();
            }
        }


        if (scope == "liste_ch" ) {

            if (type == "input") {
                endpointStyle = {fillStyle: "#660066"};
                SGI.plumb_inst["inst_" + codebox].addEndpoint(id.toString(), {uuid: id.toString()}, {
                    anchor: [0, 0.5, -1, 0, 0, 0],
                    isTarget: true,
                    paintStyle: endpointStyle,
                    connector: ["Flowchart", {stub: _stub, alwaysRespectStubs: true}],
                    endpoint: ["Rectangle", {width: 20, height: 10}],
                    scope: "liste_ch"
                });
            }else if (type == "output") {
                endpointStyle = {fillStyle: "#882288"};
                SGI.plumb_inst["inst_" + codebox].addEndpoint(id.toString(), {uuid: id.toString()}, {
                    anchor: [1, 0.5, 1, 0, 0, 0],
                    isSource: true,
                    maxConnections: -1,
                    paintStyle: endpointStyle,
                    connector: ["Flowchart", {stub: _stub, alwaysRespectStubs: true}],
                    endpoint: ["Rectangle", {width: 20, height: 10}],
                    connectorStyle: {lineWidth: 4, strokeStyle: "#0000ff"},
                    scope: "liste_ch"
                });
            }
        }
        if (scope == "liste_ch_dp") {
            if (position == "onborder") {
                endpointStyle = {fillStyle: "#ff99ff"};
                SGI.plumb_inst["inst_" + codebox].addEndpoint(id.toString(), {uuid: id.toString()}, {
                    isTarget: true,
                    paintStyle: endpointStyle,
                    cssClass: "ep_fbs_onborder",
                    connector: ["Flowchart", {stub: _stub, alwaysRespectStubs: true}],
                    endpoint: ["Rectangle", {width: 13, height: 13}],
                    scope: "liste_dp"
                });
            }else
            if (type == "input") {
                endpointStyle = {fillStyle: "#660066"};
                SGI.plumb_inst["inst_" + codebox].addEndpoint(id.toString(), {uuid: id.toString()}, {
                    anchor: [0, 0.5, -1, 0, 0, 0],
                    isTarget: true,
                    paintStyle: endpointStyle,
                    connector: ["Flowchart", {stub: _stub, alwaysRespectStubs: true}],
                    endpoint: ["Rectangle", {width: 20, height: 10}],
                    scope: "liste_ch"
                });
            }else
            if (type == "output") {
                endpointStyle = {fillStyle: "#ff99ff"};
                SGI.plumb_inst["inst_" + codebox].addEndpoint(id.toString(), {uuid: id.toString()}, {
                    anchor: [1, 0.5, 1, 0, 0, 0],
                    isSource: true,
                    maxConnections: -1,
                    paintStyle: endpointStyle,
                    connector: ["Flowchart", {stub: _stub, alwaysRespectStubs: true}],
                    endpoint: ["Rectangle", {width: 20, height: 10}],
                    connectorStyle: {lineWidth: 4, strokeStyle: "#0000ff"},
                    scope: "liste_dp"
                });
            }
        }
        if (scope == "liste_val") {

            if (type == "input") {
                endpointStyle = {fillStyle: "#ff77ff"};
                SGI.plumb_inst["inst_" + codebox].addEndpoint(id.toString(), {uuid: id.toString()}, {
                    anchor: ["Left"],
                    isTarget: true,
                    paintStyle: endpointStyle,
                    connector: ["Flowchart", {stub: _stub, alwaysRespectStubs: true}],
                    endpoint: ["Rectangle", {width: 20, height: 10}],
                    scope: "liste_dp"
                });
            }

            if (type == "output") {
                endpointStyle = {fillStyle: "green"};
                SGI.plumb_inst["inst_" + codebox].addEndpoint(id.toString(), {uuid: id.toString()}, {
                    anchor: ["Right"],
                    isSource: true,
                    maxConnections: -1,
                    paintStyle: endpointStyle,
                    connector: ["Flowchart", {stub: _stub, alwaysRespectStubs: true}],
                    endpoint: ["Rectangle", {width: 20, height: 10}],
                    connectorStyle: {lineWidth: 4, strokeStyle: "#00aaff"},
                    scope: "singel"
                });
            }
        }
        if (scope == "expert") {
            if (type == "input") {
                endpointStyle = {fillStyle: "gray"};
                SGI.plumb_inst["inst_" + codebox].addEndpoint(id.toString(), {uuid: id.toString()}, {
                    anchor: [0, 0.5, -1, 0, 0, 0],
                    isTarget: true,
                    paintStyle: endpointStyle,
                    connector: ["Flowchart", {stub: _stub, alwaysRespectStubs: true}],
                    endpoint: ["Rectangle", {width: 20, height: 11}],
                    scope: "singel liste_ch liste_dp liste_var expert"
                });
            }
            if (type == "output") {
                endpointStyle = {fillStyle: "gray"};
                SGI.plumb_inst["inst_" + codebox].addEndpoint(id.toString(), {uuid: id.toString()}, {
                    anchor: [1, 0.5, 1, 0, 0, 0],
                    isSource: true,
                    maxConnections: -1,
                    paintStyle: endpointStyle,
                    connector: ["Flowchart", {stub: _stub, alwaysRespectStubs: true}],
                    endpoint: ["Rectangle", {width: 20, height: 11}],
                    connectorStyle: {lineWidth: 4, strokeStyle: "gray"},
                    scope: "singel liste_ch liste_dp liste_var expert"
                });
            }
        }
    },

    add_mbs_endpoint: function (data) {
        var endpointStyle;

        if (data.type == "codebox") {
            endpointStyle = {fillStyle: "blue"};
            SGI.plumb_inst.inst_mbs.makeTarget(data.mbs_id, {
                //isTarget: true,
                paintStyle: endpointStyle,
                dropOptions: {hoverClass: "dragHover"},
                anchor: ["Continuous", {faces: ["top", "left", "right", "bottom"]}],
                endpoint: ["Dot", {radius: 2}],
                maxConnections: -1
            });

        } else if ($("#" + data.fbs_id).hasClass("fbs_element_onborder")) {

            endpointStyle = {fillStyle: "blue"};
            SGI.plumb_inst.inst_mbs.addEndpoint(data.fbs_id, {uuid: data.fbs_id}, {
//            filter:".ep",				// only supported by jquery
                anchor: "Center",
                isSource: true,
                paintStyle: endpointStyle,
                endpoint: ["Rectangle", {width: 13, height: 13}],
                connector: ["Flowchart", {stub: 25, alwaysRespectStubs: true}],
                cssClass: "ep_mbs_onborder",
                connectorStyle: {
                    strokeStyle: "#5c96bc",
                    lineWidth: 2,
                    outlineColor: "transparent",
                    outlineWidth: 4
                },
                maxConnections: -1
            });


        } else if (data.type == "brake" || data.type == "intervall" || data.type == "loop" || data.type.split("_")[0] == "block") {
            endpointStyle = {fillStyle: "blue"};
            SGI.plumb_inst.inst_mbs.addEndpoint(data.mbs_id + "_in1", {uuid: data.mbs_id + "_in1"}, {
                //dropOptions: { hoverClass: "dragHover" },
                anchor: ["Left"],
                isTarget: true,
                isSource: false,
                paintStyle: endpointStyle,
                endpoint: ["Rectangle", {width: 20, height: 10}]
            });

            SGI.plumb_inst.inst_mbs.addEndpoint(data.mbs_id + "_in2", {uuid: data.mbs_id + "_in2"}, {
                //dropOptions: { hoverClass: "dragHover" },
                anchor: ["Left"],
                isTarget: true,
                isSource: false,
                paintStyle: endpointStyle,
                endpoint: ["Rectangle", {width: 20, height: 10}]
            });

            SGI.plumb_inst.inst_mbs.addEndpoint(data.mbs_id + "_out", {uuid: data.mbs_id + "_out"}, {
                anchor: ["Right"],
                isSource: true,
                paintStyle: endpointStyle,
                endpoint: ["Dot", {radius: 10}],
                connector: ["Flowchart", {stub: 25, alwaysRespectStubs: true}],
                connectorStyle: {
                    strokeStyle: "#5c96bc",
                    lineWidth: 2,
                    outlineColor: "transparent",
                    outlineWidth: 4
                },
                maxConnections: -1
            });

        } else if (data.type != "komex" && data.type != "scriptobj" && data.type != "ccuobj" && data.type != "ccuobjpersi") {
            endpointStyle = {fillStyle: "blue"};
            SGI.plumb_inst.inst_mbs.addEndpoint(data.mbs_id, {uuid: data.mbs_id}, {
                anchor: ["Bottom", "Left", "Right", "Top"],
                isSource: true,
                paintStyle: endpointStyle,
                endpoint: ["Dot", {radius: 10}],
                connector: ["Flowchart", {stub: 25, alwaysRespectStubs: true}],
                connectorStyle: {
                    strokeStyle: "#5c96bc",
                    lineWidth: 2,
                    outlineColor: "transparent",
                    outlineWidth: 4
                },
                maxConnections: -1
            });

        }

        SGI.plumb_inst.inst_mbs.repaintEverything()
    },

    add_codebox_inst: function (id) {

        SGI.plumb_inst["inst_" + id] = jsPlumb.getInstance({
            Endpoint: ["Dot", {radius: 2}],
//            PaintStyle: { lineWidth: 4, strokeStyle: "blue" },
            HoverPaintStyle: {strokeStyle: "red", lineWidth: 4},
            DropOptions: {tolerance: "touch"},
            Container: id,
            RenderMode: "svg",
            Scope: "singel",
            connector: ["Flowchart", {stub: 50, alwaysRespectStubs: true, midpoint: 0.5}]


        });

        scope.con.fbs[id] = {};
        scope.$apply();

        SGI.plumb_inst["inst_" + id].bind("click", function (c, p) {

            var connector_data;
            var dot1_x;
            var dot1_y;
            var dot2_x;
            var dot2_y;
            var dot3_x;
            var dot3_y;
            var dot1_old_posi;
            var dot3_old_posi;
            var dot2_old_posi;
            var dot2_d;
            var svg_w;
            var svg_h;
            var dot_start;
            var old_midpoint;
            var old_stub;


            function make_dot() {
                var connector_data = scope.con.fbs[id][c.id].connector;
                var svg_posi = $(c.connector.svg).position();
                var prg_posi = $(c.connector.svg).parent().offset();
                var path = c.connector.getPath();
                var svg_trans = $(c.connector.svg).children().first()[0].getAttribute("transform").replace("translate(", "").replace(")", "").split(",");
                dot1_x = svg_posi.left + path[0].end[0] + parseInt(svg_trans[0]) - 8;
                dot1_y = svg_posi.top + path[0].end[1] + parseInt(svg_trans[1]) - 8;


                if (path.length == 5) {
                    dot2_x = svg_posi.left + path[3].start[0] + parseInt(svg_trans[0]) + Math.abs((path[2].start[0] - path[2].end[0]) / 2) - 8;
                    dot2_y = svg_posi.top + path[2].start[1] - parseInt(svg_trans[1]) + Math.abs((path[3].start[1] - path[2].start[1]) / 2) - 8;
                    dot2_d = "y";
                    dot3_x = svg_posi.left + path[path.length - 1].start[0] + parseInt(svg_trans[0]) - 8;
                    dot3_y = svg_posi.top + path[path.length - 1].end[1] - parseInt(svg_trans[1]);

                    $(".dot").remove();
                    $(c.connector.svg).parent().append('<div id="dot1" class="dot" style="left:' + dot1_x + 'px;top: ' + dot1_y + 'px  "></div>');
                    $(c.connector.svg).parent().append('<div id="dot2" class="dot" style="left:' + dot2_x + 'px;top: ' + dot2_y + 'px  "></div>');
                    $(c.connector.svg).parent().append('<div id="dot3" class="dot" style="left:' + dot3_x + 'px;top: ' + dot3_y + 'px  "></div>');
                    dot1_drag();
                    dot2_drag();
                    dot3_drag();
                }
                if (path.length == 3 && path[2].start[0] < path[2].end[0] && path[1].start[1] < path[1].end[1]) {
                    dot2_x = svg_posi.left + path[1].start[0] - parseInt(svg_trans[0]) - Math.abs((path[2].start[0] - path[2].start[0]) / 2) + 8;
                    dot2_y = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) + Math.abs((path[2].start[1] - path[1].start[1]) / 2) + 8;
                    dot3_x = svg_posi.left + path[path.length - 1].end[0] + parseInt(svg_trans[0]) - 8;
                    dot3_y = svg_posi.top + path[path.length - 1].end[1] - parseInt(svg_trans[1]) + 8;

                    $(".dot").remove();
                    $(c.connector.svg).parent().append('<div id="dot1" class="dot" style="left:' + dot1_x + 'px;top: ' + dot1_y + 'px  "></div>');
                    $(c.connector.svg).parent().append('<div id="dot2" class="dot" style="left:' + dot2_x + 'px;top: ' + dot2_y + 'px  "></div>');
                    $(c.connector.svg).parent().append('<div id="dot3" class="dot" style="left:' + dot3_x + 'px;top: ' + dot3_y + 'px  "></div>');
                    dot1_drag();
                    dot2_drag();
                    dot3_drag();
                }
                if (path.length == 3 && path[2].start[0] < path[2].end[0] && path[1].start[1] > path[1].end[1]) {
                    dot2_x = svg_posi.left + path[1].start[0] - parseInt(svg_trans[0]) - Math.abs((path[2].start[0] - path[2].start[0]) / 2) + 8;
                    dot2_y = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) - Math.abs((path[2].start[1] - path[1].start[1]) / 2) + 8;
                    dot3_x = svg_posi.left + path[path.length - 1].end[0] + parseInt(svg_trans[0]) - 8;
                    dot3_y = svg_posi.top + path[path.length - 1].end[1] - parseInt(svg_trans[1]) + 8;

                    $(".dot").remove();
                    $(c.connector.svg).parent().append('<div id="dot1" class="dot" style="left:' + dot1_x + 'px;top: ' + dot1_y + 'px  "></div>');
                    $(c.connector.svg).parent().append('<div id="dot2" class="dot" style="left:' + dot2_x + 'px;top: ' + dot2_y + 'px  "></div>');
                    $(c.connector.svg).parent().append('<div id="dot3" class="dot" style="left:' + dot3_x + 'px;top: ' + dot3_y + 'px  "></div>');
                    dot1_drag();
                    dot2_drag();
                    dot3_drag();
                }
                if (path.length == 3 && path[2].start[0] > path[2].end[0]) {
                    $(".dot").remove();
                    $("#prg_panel").append('<div id="dot1" class="dot" style="left:' + dot1_x + 'px;top: ' + dot1_y + 'px  "></div>');
                    dot1_drag()
                }
                if (path.length == 4) {
                    dot2_x = svg_posi.left + path[1].start[0] + parseInt(svg_trans[0]) - Math.abs((path[1].start[0] - path[1].end[0]) / 2) - 8;
                    dot2_y = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) + Math.abs((path[1].start[1] - path[1].start[1]) / 2) + 1;
                    dot2_d = "y";
                    $(".dot").remove();
                    $(c.connector.svg).parent().append('<div id="dot2" class="dot" style="left:' + dot2_x + 'px;top: ' + dot2_y + 'px  "></div>');
                    dot2_drag()

                }


                function dot1_drag() {

                    $("#dot1").draggable({
                        axis: "x",
                        containment: $(c.connector.svg).parent(),
                        start: function (e, ui) {


                            dot_start = ui.position;
//                            connector_data = scope.con.fbs[id].connector;
                            old_stub = connector_data.stub.slice();

                            $("#dot2, #dot3").remove()

                        },
                        drag: function (e, ui) {
                            var dif_x = ui.position.left - dot_start.left;


                            var new_stub = parseInt(old_stub[0]) + dif_x;
                            if (new_stub < 30) {
                                new_stub = 30;
                                ui.position = dot1_old_posi;
                            } else {
                                dot1_old_posi = ui.position
                            }
                            connector_data.stub[0] = new_stub;


                            c.setConnector(["Flowchart", {
                                stub: connector_data.stub,
                                alwaysRespectStubs: true,
                                midpoint: connector_data.midpoint
                            }]);
                            dot1_x = svg_posi.left + path[0].end[0] + parseInt(svg_trans[0]);
                        },
                        stop: function () {
                            scope.con.fbs[id].connector = connector_data;
                            scope.$apply();
                            make_dot();
                        }
                    });
                }

                function dot2_drag() {
                    $("#dot2").draggable({
                        axis: dot2_d,
//                        containment: $(c.connector.svg).parent(),
                        start: function (e, ui) {
                            $("#dot1, #dot3").remove();
//                            connector_data = scope.con.fbs[id].connector;
                            svg_w = parseInt(c.connector.bounds.maxX - (connector_data.stub[0] + connector_data.stub[1]));
                            svg_h = parseInt(c.connector.bounds.maxY);
                            dot_start = ui.position;
                            old_midpoint = parseFloat(connector_data.midpoint);

                            if (path.length == 4) {
                                svg_h = parseInt(c.connector.bounds.maxY - (connector_data.stub[0]));
                            }

                            if (path.length == 5) {
                                if (path[2].start[0] == path[2].end[0]) {
                                    dot2_d = "x";
                                    $("#dot2").draggable("option", "axis", "x");
                                } else {
                                    dot2_d = "y";
                                    $("#dot2").draggable("option", "axis", "y");
                                }

                            }
                            if (path.length == 3) {
                                if (path[1].start[0] == path[1].end[0]) {
                                    dot2_d = "x";
                                    $("#dot2").draggable("option", "axis", "x");
                                } else {
                                    dot2_d = "y";
                                    $("#dot2").draggable("option", "axis", "y");
                                }
                            }
                        },
                        drag: function (e, ui) {
                            var new_midpoint;
                            var dif_x = ui.position.left - dot_start.left;
                            var dif_y = ui.position.top - dot_start.top;
                            path = c.connector.getPath();

                            if (dot2_d == "x") {
                                new_midpoint = Math.round((1 / svg_w * (svg_w * old_midpoint + dif_x)) * 100) / 100;

                            } else {
                                if (path[1].start[1] < path[1].end[1] || path[0].start[1] < path[0].end[1]) {
                                    new_midpoint = Math.round((1 / svg_h * (svg_h * old_midpoint + dif_y)) * 100) / 100;
                                } else {
                                    new_midpoint = Math.round((1 / svg_h * (svg_h * old_midpoint - dif_y)) * 100) / 100;
                                }
                            }

                            if (new_midpoint > 0.98 || new_midpoint < 0.02) {

                                if (new_midpoint > 0.98) {
                                    new_midpoint = 0.98;
                                    if (path.length == 5) {
                                        ui.position.left = svg_posi.left + path[2].start[0] + parseInt(svg_trans[0]) - Math.abs((path[3].start[0] - path[2].start[0]) / 2) + 1;
                                        ui.position.top = svg_posi.top + path[2].start[1] + parseInt(svg_trans[1]) + Math.abs((path[3].start[1] - path[2].start[1]) / 2) - 8;
                                    } else if (path.length == 4) {
                                        ui.position.left = dot2_x = svg_posi.left + path[1].start[0] + parseInt(svg_trans[0]) - Math.abs((path[1].start[0] - path[1].end[0]) / 2) - 8;
                                        ui.position.top = dot2_y = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) + Math.abs((path[1].start[1] - path[1].start[1]) / 2) + 1;
                                    } else {
                                        ui.position.left = svg_posi.left + path[1].start[0] - parseInt(svg_trans[0]) - Math.abs((path[2].start[0] - path[2].start[0]) / 2);
                                        ui.position.top = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) + Math.abs((path[2].start[1] - path[1].start[1]) / 2);
                                    }
                                }

                                if (new_midpoint < 0.02) {
                                    new_midpoint = 0.02;
                                    if (path.length == 5) {
                                        ui.position.left = svg_posi.left + path[2].start[0] + parseInt(svg_trans[0]) - Math.abs((path[3].start[0] - path[2].start[0]) / 2) + 1;
                                        ui.position.top = svg_posi.top + path[2].start[1] + parseInt(svg_trans[1]) + Math.abs((path[3].start[1] - path[2].start[1]) / 2) - 8;
                                    } else if (path.length == 4) {
                                        ui.position.left = dot2_x = svg_posi.left + path[1].start[0] + parseInt(svg_trans[0]) - Math.abs((path[1].start[0] - path[1].end[0]) / 2) - 8;
                                        ui.position.top = dot2_y = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) + Math.abs((path[1].start[1] - path[1].start[1]) / 2) + 1;
                                    } else {
                                        ui.position.left = svg_posi.left + path[1].start[0] - parseInt(svg_trans[0]) - Math.abs((path[2].start[0] - path[2].start[0]) / 2);
                                        ui.position.top = svg_posi.top + path[1].start[1] - parseInt(svg_trans[1]) + Math.abs((path[2].start[1] - path[1].start[1]) / 2);
                                    }
                                }
                            } else {
                                dot2_old_posi = ui.position
                            }

                            connector_data.midpoint = new_midpoint;
                            c.setConnector(["Flowchart", {
                                stub: connector_data.stub,
                                alwaysRespectStubs: true,
                                midpoint: connector_data.midpoint
                            }]);
                        },
                        stop: function () {
                            scope.con.fbs[id].connector = connector_data;
                            scope.$apply();
                            make_dot();
                        }

                    });
                }

                function dot3_drag() {
                    $("#dot3").draggable({
                        axis: "x",
                        containment: $(c.connector.svg).parent(),
                        start: function (e, ui) {

                            dot_start = ui.position;
//                            connector_data = scope.con.fbs[id].connector;
                            old_stub = connector_data.stub.slice();

                            $("#dot1, #dot2").remove()
                        },
                        drag: function (e, ui) {
                            var dif_x;
                            var new_stub;
                            if (path[path.length - 1].start[0] < path[path.length - 1].end[0]) {
                                dif_x = ui.position.left - dot_start.left;
                                new_stub = parseInt(old_stub[1]) - dif_x;
                                if (new_stub < 30) {
                                    new_stub = 30;
                                    ui.position = dot3_old_posi;
                                } else {
                                    dot3_old_posi = ui.position
                                }
                                connector_data.stub[1] = new_stub;
                                c.setConnector(["Flowchart", {
                                    stub: connector_data.stub,
                                    alwaysRespectStubs: true,
                                    midpoint: connector_data.midpoint
                                }]);
                                dot2_x = svg_posi.left + path[0].end[0] + parseInt(svg_trans[0]);
                            } else {
                                dif_x = ui.position.left - dot_start.left;
                                new_stub = parseInt(old_stub[1]) + dif_x;
                                if (new_stub < 30) {
                                    new_stub = 30;
                                    ui.position = dot3_old_posi;
                                } else {
                                    dot3_old_posi = ui.position
                                }
                                connector_data.stub[1] = new_stub;
                                c.setConnector(["Flowchart", {
                                    stub: connector_data.stub,
                                    alwaysRespectStubs: true,
                                    midpoint: connector_data.midpoint
                                }]);
                                dot2_x = svg_posi.left + path[0].end[0] + parseInt(svg_trans[0]);
                            }
                        },
                        stop: function () {
                            scope.con.fbs[id].connector = connector_data;
                            scope.$apply();
                            make_dot();
                        }
                    });
                }
            }

            make_dot();
        });

        SGI.plumb_inst["inst_" + id].bind("dblclick", function (c) {
            $(".dot").remove();
            SGI.plumb_inst["inst_" + id].detach(c);

        });

        SGI.plumb_inst["inst_" + id].bind("connection", function (c) {

            var fbs_in = c.targetId.split("_in")[0];
            var fbs_out = c.sourceId.split("_out")[0];

            scope.fbs[$("#" + fbs_in).data("nr")].input[c.targetId.split("_")[2]] = c.sourceId;
            scope.fbs[$("#" + fbs_out).data("nr")].output[c.sourceId.split("_")[2]] = c.targetId;


            scope.con.fbs[id][c.connection.id] = {
                pageSourceId: c.connection.sourceId,
                pageTargetId: c.connection.targetId,
                connector: {
                    stub: [30, 30],
                    midpoint: 0.5
                }
            };

            scope.$apply()
        });

        SGI.plumb_inst["inst_" + id].bind("contextmenu", function (c) {
            SGI.con = c;
        });

        SGI.plumb_inst["inst_" + id].bind("connectionDetached", function (c) {
            var fbs_in = c.connection.targetId.split("_in")[0];
            var fbs_out = c.connection.sourceId.split("_out")[0];
            delete scope.con.fbs[id][c.connection.id];
            delete scope.fbs[$("#" + fbs_in).data("nr")].input[c.connection.targetId.split("_")[2]];
            delete scope.fbs[$("#" + fbs_out).data("nr")].output[c.connection.sourceId.split("_")[2]];
            scope.$apply();
        });

    },

    add_trigger_hmid: function (_this, type, type2) {
        var $this = _this;
        $.id_select({
            type: type,
            close: function (hmid) {
                if (hmid != null) {
                    var _name = SGI.get_name(hmid);
                    var nr = $($this).data("nr");
                    scope.mbs[nr]["hmid"].push(hmid);
                    if (scope.mbs[nr]["name"][0] == "Rechtsklick") {
                        scope.mbs[nr]["name"][0] = _name;
                    } else {
                        scope.mbs[nr]["name"].push(_name);
                    }
                    if (type2 == "val") {
                        SGI.add_trigger_name_val($this);
                    } else {
                        // singel Trigger
                        SGI.add_trigger_name($this);
                    }
                    scope.$apply();
                    SGI.plumb_inst.inst_mbs.repaintEverything()
                }
            }
        });
    },

    add_trigger_name: function ($this) {
        $($this).find(".div_hmid_font").remove();

        $.each(scope.mbs[$this.data("nr")]["name"], function () {

            var add = '<div data-info="' + $this.attr("id") + '" class="div_hmid_font">' + this + '</div>';

            $($this).find(".div_hmid_trigger").append(add)

        });
    },

    add_filter_device: function (_this) {

        var $this = _this;

        $.id_select({
            type: "device",
            close: function (hmid) {

                if (hmid != null) {

                    scope.fbs[$this.data("nr")]["hmid"].push(hmid);
                    SGI.add_filter_device_name($this)
                }
            }
        });


    },

    add_filter_channel: function (_this) {

        var $this = _this;

        $.id_select({
            type: "channel",
            close: function (hmid) {

                if (hmid != null) {

                    scope.fbs[$this.data("nr")]["hmid"].push(hmid);
                    SGI.add_filter_channel_name($this)
                }
            }
        });


    },

    add_filter_dp: function (_this) {

        var $this = _this;

        $.id_select({
            type: "dp",
            close: function (hmid) {

                if (hmid != null) {

                    scope.fbs[$this.data("nr")]["hmid"].push(hmid);
                    SGI.add_filter_dp_name($this)
                }
            }
        });


    },

    add_filter_device_name: function ($this) {
        var add = "";
        var nr = $($this).data("nr");

        $($this).find(".div_hmid_filter_font_device").remove();
        if (scope.fbs[nr]["hmid"].length > 0) {

            $.each(scope.fbs[nr]["hmid"], function () {
                var name = this;
                add += '<div data-info="' + $($this).attr("id") + '" class="div_hmid_filter_font_device">' + name + '</div>';

            });
        } else {
            add += '<div data-info="' + $($this).attr("id") + '" class="div_hmid_filter_font_device">Rechtsklick</div>';
        }

        $($this).find(".div_hmid_filter").append(add);

        SGI.plumb_inst["inst_" + $($this).parent().parent().attr("id")].repaintEverything();
    },

    add_filter_channel_name: function ($this) {
        var add = "";
        var nr = $($this).data("nr");

        $($this).find(".div_hmid_filter_font_channel").remove();
        if (scope.fbs[nr]["hmid"].length > 0) {

            $.each(scope.fbs[nr]["hmid"], function () {
                var name = this;
                add += '<div data-info="' + $($this).attr("id") + '" class="div_hmid_filter_font_channel">' + name + '</div>';
            });
        } else {
            add += '<div data-info="' + $($this).attr("id") + '" class="div_hmid_filter_font_channel">Rechtsklick</div>';
        }

        $($this).find(".div_hmid_filter").append(add);

        SGI.plumb_inst["inst_" + $($this).parent().parent().attr("id")].repaintEverything();
    },

    add_filter_dp_name: function ($this) {
        var add = "";

        $($this).find(".div_hmid_filter_font_dp").remove();
        if (scope.fbs[$($this).data("nr")]["hmid"].length > 0) {

            $.each(scope.fbs[$($this).data("nr")]["hmid"], function () {
                var name = this;
                add += '<div data-info="' + $($this).attr("id") + '" class="div_hmid_filter_font_dp">' + name + '</div>';

            });
        } else {
            add += '<div data-info="' + $($this).attr("id") + '" class="div_hmid_filter_font_dp">Rechtsklick</div>';
        }

        $($this).find(".div_hmid_filter").append(add);

        SGI.plumb_inst["inst_" + $($this).parent().parent().attr("id")].repaintEverything();
    },

    add_trigger_name_val: function ($this) {
        $($this).find(".div_hmid_val_body").remove();
        var nr = $($this).data("nr");
        var add = "";
        $.each(scope.mbs[nr].name, function (index) {

            var wert = scope.mbs[nr]["wert"][index] || 0;

            add += '<div style="min-width: 100%" class="div_hmid_val_body">';
            add += '<div data-info="' + $this.attr("id") + '"  style="display:inline-block;float: left;" class="div_hmid_val">{{mbs[' + nr + '].name[' + index + '].toString()}}</div>';
            add += '<div style="float: right; margin-left:5px; display: inline-block">';
            add += '<select  id="val_' + index + '" ng-model="mbs[' + nr + '].val[' + index + ']" class="inp_val">';
            add += '    <option value="val">Gleich</option>';
            add += '    <option value="valNe">Ungleich</option>';
            add += '    <option value="valGt">Größer</option>';
            add += '    <option value="valGe">Größer =</option>';
            add += '    <option value="valLt">Kleiner</option>';
            add += '    <option value="valLe">Kleiner =</option>';
            add += '</select>';

            add += '<input class="inp_wert"  type=int ng-model="mbs[' + nr + '].wert[' + index + ']" id="var_' + index + '">';
            add += '</div>';
            add += '</div>';
        });

        scope.append($($this).find(".div_hmid_trigger"), add);


//        $('.inp_time').numberMask({type: 'float', beforePoint: 2, afterPoint: 2, decimalMark: ':'});


    },

    add_trigger_time: function ($this) {
        $($this).find(".div_hmid_font").remove();
        var nr = $($this).data("nr");
        var add = "";

        $.each(scope.mbs[nr]["time"], function (index) {

            add += '<div id="tr_ch_body_' + index + '" class="tr_ch_body">';
            add += '<input class="inp_time" ng-model="mbs[' + nr + '].time[' + index + ']" id="var_' + index + '">';
            add += '<select id="day_' + index + '" ng-model="mbs[' + nr + '].day[' + index + ']" class="inp_day">';
            add += '    <option value="88">*</option>';
            add += '    <option value="1">Mo</option>';
            add += '    <option value="2">Di</option>';
            add += '    <option value="3">Mi</option>';
            add += '    <option value="4">Do</option>';
            add += '    <option value="5">Fr</option>';
            add += '    <option value="6">Sa</option>';
            add += '    <option value="7">So</option>';
            add += '    <option value="8">MO-FR</option>';
            add += '    <option value="9">SA-SO</option>';
            add += '</select>';
            add += '</div>';
        });
        scope.append($($this).find(".div_hmid_trigger"), add);

    },

    add_trigger_astro: function ($this) {
        $($this).find(".tr_ch_body").remove();
        var add = "";
        $.each(scope.mbs[$($this).data("nr")]["astro"], function (index) {
            add += '<div id="tr_ch_body_' + index + '" class="tr_ch_body">';
            add += '<select ng-model="mbs[' + $this.data("nr") + '].astro[' + index + ']" id="astro_' + index + '" class="inp_astro">';
            add += '    <option value="sunrise">Sonnenaufgang Start</option>';
            add += '    <option value="sunriseEnd">Sonnenaufgang Ende</option>';
            add += '    <option value="solarNoon">Höchster Sonnenstand</option>';
            add += '    <option value="sunsetStart">Sonnenuntergang Start</option>';
            add += '    <option value="sunset">Sonnenuntergang Ende</option>';
            add += '    <option value="night">Nacht Start</option>';
            add += '    <option value="nightEnd">Nacht Ende</option>';
            add += '    <option value="nadir">Dunkelster moment</option>';
            add += '</select>';
            add += '<label style="display:flex ;margin-left:10px; color: #676767; font-size: 13px">Shift:</label></label><input class="inp_min" type=int  ng-model="mbs[' + $this.data("nr") + '].minuten[' + index + ']" id="var_' + index + '"><br>';
            add += '</div>';
        });

        scope.append($($this).find(".div_hmid_trigger"), add);

//      $('.inp_time').numberMask({type: 'float', beforePoint: 2, afterPoint: 2, decimalMark: ':'});

    },

    get_eps_by_elem: function (elem) {
        var eps = [];
        $.each($(elem).find("[id*=in]"), function () {
            eps.push($(this).attr("id"));
        });
        $.each($(elem).find("[id*=out]"), function () {
            eps.push($(this).attr("id"));
        });
        eps.push($(elem).attr("id"));
        return eps
    },

    get_inout_by_element: function (elem) {
        var eps = {
            in: [],
            out: []
        };
        $.each($(elem).find("[id*=in]"), function () {
            eps.in.push($(this).attr("id"));
        });
        $.each($(elem).find("[id*=out]"), function () {
            eps.out.push($(this).attr("id"));
        });

        return eps
    },

    make_fbs_drag: function (data) {
        var $div = $("#" + data.parent);
        var ep_mbs = [];
        var ep_fbs = [];
        var codebox_w = "";
        var codebox_h = "";

        var $this_height = "";
        var $this_width = "";
        var $this = "";

        SGI.plumb_inst["inst_" + $($div).parent().attr("id")].draggable($("#" + data.fbs_id), {
                containment: "parent",
                start: function (params) {
                    codebox_h = $(params.el).parent().parent().height();
                    codebox_w = $(params.el).parent().parent().width();
                    ep_mbs = SGI.plumb_inst.inst_mbs.getEndpoint($(params.el).attr("id"));
                    ep_fbs = SGI.plumb_inst["inst_" + $("#" + data.parent).parent().attr("id")].getEndpoint(data.fbs_id);
                    $this_height = $(params.el).height();
                    $this_width = $(params.el).width();
                },
                drag: function (params) {
                    console.log($(params.el).hasClass("fbs_element_onborder"))
                    if ($(params.el).hasClass("fbs_element_onborder")) {
                        var $this_left = params.pos[0];
                        var $this_right = codebox_w - params.pos[0] - $this_width;
                        var $this_top = params.pos[1];
                        var $this_bottom = codebox_h - params.pos[1] - $this_height;

                        if ($this_left < $this_top && $this_left < $this_bottom && $this_left < $this_right) {
                            $(params.el).css({left: "-28px", right: "auto", bottom: "auto"});
                            ep_mbs.setAnchor("Left");
                            if (ep_fbs) {
                                ep_fbs.setAnchor("Right");
                                ep_fbs.repaint();
                            }
                        } else if ($this_right < $this_left && $this_right < $this_top && $this_right < $this_bottom) {
                            $(params.el).css({left: "auto", right: "-28px", bottom: "auto"});
                            ep_mbs.setAnchor("Right");
                            if (ep_fbs) {
                                ep_fbs.setAnchor("Left");
                                ep_fbs.repaint();
                            }
                        } else if ($this_top < (codebox_h / 2)) {
                            $(params.el).css({top: "-13px", bottom: "auto", right: "auto"});
                            ep_mbs.setAnchor("Top");
                            if (ep_fbs) {
                                ep_fbs.setAnchor("Bottom");
                                ep_fbs.repaint();
                            }
                        } else if ($this_top > (codebox_h / 2)) {
                            $(params.el).css({top: "auto", bottom: "-13px", right: "auto"});
                            ep_mbs.setAnchor("Bottom");
                            if (ep_fbs) {
                                ep_fbs.setAnchor("Top");
                                ep_fbs.repaint();
                            }
                        }

                        //todo not Everything
                        SGI.plumb_inst["inst_" + $(params.el).parent().parent().attr("id")].repaintEverything();

                        SGI.plumb_inst.inst_mbs.repaintEverything();

//                            ep_mbs.repaint();
//                            ep_fbs.repaint();
                    }


                },
                stop: function (params) {

                    var nr = $(params.el).data("nr");
                    scope.fbs[nr].style.top = $(params.el).position().top / SGI.zoom + "px";
                    scope.fbs[nr].style.left = $(params.el).position().left / SGI.zoom + "px";

                    scope.$apply();

                    //todo not Everything
                    SGI.plumb_inst["inst_" + $(params.el).parent().parent().attr("id")].repaintEverything();
                    SGI.plumb_inst.inst_mbs.repaintEverything();


//                        if ($.isArray(ep_fbs) == true) {
//                            SGI.plumb_inst["inst_" + $($div).parent().attr("id")].repaint(ep_fbs);
//                        } else {
//                            SGI.plumb_inst["inst_" + $($div).parent().attr("id")].repaint($(this).attr("id"));
//                        }

//                        SGI.plumb_inst["inst_" + $(params.el).parent().parent().attr("id")].repaintEverything();
                }
            }
        );


    },

    make_mbs_drag: function (data) {

        if (data.type == "codebox") {
            SGI.plumb_inst.inst_mbs.draggable($("#" + data.mbs_id).find(".titel_body"), {
                containment: "parent",
                start: function () {
                    $(".dot").remove();
                },
                drag: function (params) {
                    if ($(params.el).hasClass("titel_body")) {
                        var pos = $(params.el).parent().position();
                        $(params.el).parent().css({
                            left: pos.left + params.e.movementX + "px",
                            top: pos.top + params.e.movementY + "px"
                        });
                        SGI.plumb_inst.inst_mbs.repaintEverything();
                    }
                },
                stop: function (params) {
                    var nr = $(params.el).data("nr");
                    scope.mbs[nr].style.top = $(params.el).parent().css("top");
                    scope.mbs[nr].style.left = $(params.el).parent().css("left");
                    SGI.plumb_inst.inst_mbs.repaintEverything();
                    scope.$apply();
                }
            });
        } else {
            SGI.plumb_inst.inst_mbs.draggable($("#" + data.mbs_id), {
                containment: "parent",

                start: function () {
                    $(".dot").remove();
                    console.log(SGI.plumb_inst.inst_mbs)
                    SGI.plumb_inst.inst_mbs.draggable({grid: [10, 10]});
                },
                drag: function (params) {

                },
                stop: function (params) {
                    var nr = $(params.el).data("nr");
                    scope.mbs[nr].style.top = $(params.el).css("top");
                    scope.mbs[nr].style.left = $(params.el).css("left");
                    scope.$apply();
                }
            });
        }
    },

    make_mbs_drop: function () {

        $(".prg_codebox").droppable({
            accept: ".fbs",
            tolerance: "pointer",
            drop: function (ev, ui) {
                var data;
                var top;
                var left;
                SGI.drop_block = true;
                setTimeout(function () {
                    SGI.drop_block = false;
                }, 500);
                if (ui["draggable"].hasClass("fbs_exp_custom")) {
                    if (scope.setup.snap_grid) {

                        data = {
                            parent: $(ev.target).attr("id"),
                            type: $(ui["draggable"][0]).attr("id")

                        };
                        top = Math.round(((ui["offset"]["top"] - $(ev.target).offset().top + 30) / SGI.zoom) / SGI.grid) * SGI.grid;
                        left = Math.round(((ui["offset"]["left"] - $(ev.target).offset().left + 0) / SGI.zoom) / SGI.grid) * SGI.grid;
                    } else {
                        data = {
                            parent: $(ev.target).attr("id"),
                            type: $(ui["draggable"][0]).attr("id")

                        };
                        top = parseInt(((ui["offset"]["top"] - $(ev.target).offset().top) + 30) / SGI.zoom);
                        left = parseInt(((ui["offset"]["left"] - $(ev.target).offset().left) + 0) / SGI.zoom);
                    }

                    SGI.add_fbs_element(data, left, top);
                } else {

                    if (scope.setup.snap_grid) {

                        data = {
                            parent: $(ev.target).attr("id"),
                            type: $(ui["draggable"][0]).attr("id")
                        };
                        top = Math.round(((ui["offset"]["top"] - $(ev.target).offset().top + 30) / SGI.zoom) / SGI.grid) * SGI.grid;
                        left = Math.round(((ui["offset"]["left"] - $(ev.target).offset().left + 40) / SGI.zoom) / SGI.grid) * SGI.grid;
                    } else {
                        data = {
                            parent: $(ev.target).attr("id"),
                            type: $(ui["draggable"][0]).attr("id")
                        };
                        top = parseInt(((ui["offset"]["top"] - $(ev.target).offset().top) + 30) / SGI.zoom);
                        left = parseInt(((ui["offset"]["left"] - $(ev.target).offset().left) + 40) / SGI.zoom);
                    }

                    SGI.add_fbs_element(data, left, top);
                }
            }
        });
    },

    make_savedata: function () {
        return {
            version: SGI.version,
            mbs: scope.mbs,
            fbs: scope.fbs,
            con: scope.con
        };
    },

    make_struc: function () {

        PRG.struck.codebox = {};
        PRG.struck.trigger = [];
        PRG.struck.control = [];

        PRG._scope = SGI.make_savedata();


        $("#prg_panel .mbs_element_codebox ").each(function (idx, elem) {
            var $this = $(elem);
            var fbs = $($this).find(".fbs_element");
            var data = {};
            var ebene = 99999;
            var onborder = [];
            Compiler.last_fbs = $(fbs).attr("id");
            $.each(fbs, function (idx, elem) {
                var $this = $(elem);
                var nr = $this.data("nr");
                var fbs_id = $this.attr('id');
                var input = scope.fbs[nr]["input"];
                var output = scope.fbs[nr]["output"];

                data[fbs_id.split("_")[1]] = {
                    ebene: 99999,
                    fbs_id: fbs_id,
                    type: scope.fbs[nr]["type"],
                    hmid: scope.fbs[nr]["hmid"],
                    positionX: parseInt($this.css("left"), 10),
                    positionY: parseInt($this.css("top"), 10),
                    nr: nr,
                    input: input,
                    output: output,
                    force: scope.fbs[nr]["force"]
                }
            });


            for (var i = 0; i < 2; i++) {

                $.each(data, function () {
                    if (ebene == this.ebene) {

                        $.each(this["input"], function () {
                            var fbs_befor = this.split("_")[1];
                            data[fbs_befor].ebene = ebene - 1
                        });

                        i = 0
                    }
                });
                ebene--;
            }

            $.each(data, function () {
                if (jQuery.isEmptyObject(this.input)) {
                    this.ebene = 1;
                }
            });

            $.each(data, function () {
                if ($("#" + this.fbs_id).hasClass("fbs_element_onborder")) {
                    onborder.push({"id": this.fbs_id, left: this.positionX})
                }
            });


            function SortByLeft(a, b) {
                var aName = a.left;
                var bName = b.left;
                return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
            }

            function SortByEbene(a, b) {
                var aName = a.ebene;
                var bName = b.ebene;
                return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
            }

            onborder.sort(SortByLeft);

            ebene = 100001;
            $.each(onborder, function () {
                var id = this.id.split("_")[1];
                data[id].ebene = ebene;
                ebene++
            });

            var sortable = [];
            for (var x in data) {
                sortable.push({
                    ebene: data[x].ebene,
                    fbs_id: data[x].fbs_id,
                    type: data[x].type,
                    hmid: data[x].hmid,
                    positionX: data[x].positionX,
                    positionY: data[x].positionY,
                    in: data[x].input,
                    out: data[x].output,
                    force: data[x].force
                });
            }

            sortable.sort(SortByEbene);
            PRG.struck.codebox[$($this).attr("id")] = [sortable];
        });
        console.info("struck1");
        $("#prg_panel .mbs_element_trigger ").each(function (idx, elem) {
            var $this = $(elem);
            PRG.struck.trigger[idx] = {
                mbs_id: $this.attr('id')
            };
        });
        console.info("struck2");
        $("#prg_panel .mbs_element_control ").each(function (idx, elem) {
            var $this = $(elem);
            PRG.struck.control[idx] = {
                mbs_id: $this.attr('id')
            };
        });
        console.info("struck3");
        $.each(PRG.struck.codebox, function (idx) {
            var $codebox = idx;

            $.each(this[0], function () {
                var id = this["fbs_id"];
                var input = [];
                var output = [];
                var target = [];

                if ($("#" + id).hasClass("fbs_element_onborder")) {
                    $.each(PRG._scope.con.mbs, function () {

                        if (this.pageSourceId == id) {
                            target.push([this.pageTargetId]);
                        }

                    });
                    $.each(PRG._scope.con.fbs[$codebox], function () {
                        var _input = this["pageTargetId"].split("_");
                        var input_name = (_input[0] + "_" + _input[1]);

                        if (input_name == id) {
                            var add = {
                                "eingang": this["pageTargetId"],
                                "herkunft": this.pageSourceId
                            };

                            input.push(add);
                        }
                    });
                } else {

                    $.each(PRG._scope.con.fbs[$codebox], function () {

                        var _input = this["pageTargetId"].split("_");
                        var input_name = (_input[0] + "_" + _input[1]);
                        var _output = this["pageSourceId"].split("_");
                        var output_name = (_output[0] + "_" + _output[1]);

                        if (input_name == id) {
                            var add = {
                                "eingang": _input[2],
                                "herkunft": this.pageSourceId
                            };
                            input.push(add);
                        }

                        if (output_name == id) {
                            add = {
                                ausgang: this.pageSourceId
                            };
                            output.push(add)
                        }
                    });
                }
                this["target"] = target;
                this["input"] = input;
                this["output"] = output;
            });
        });
        console.info("struck4");
        $.each(PRG.struck.trigger, function () {

            var $this = this;
            $this.target = [];
            var $trigger = this.mbs_id;
            $.each(PRG._scope.con.mbs, function () {
                if (this.pageSourceId == $trigger) {
                    $this.target.push(this.pageTargetId);
                }
            });
        });
        console.info("struck5");
        $.each(PRG.struck.control, function () {

            var $this = this;
            $this.target = [];
            var $trigger = this.mbs_id;
            $.each(PRG._scope.con.mbs, function () {

                if (this.pageSourceId == $trigger + "_out") {
                    $this.target.push(this.pageTargetId);
                }
            });
        });
        console.info("struck6");

    },

    make_conpanel: function () {

        SGI.con_files = [];
        try {
            $.each(fs.readdirSync(path.resolve(scope.setup.datastore + '/ScriptGUI_Data/connections/')), function () {
                var con_name = this.split(".json")[0];
                con_name = con_name.replace("port", ":");
                SGI.con_files.push(con_name)
            });
        }
        catch (e) {
        }


        $("#inp_con_ip").xs_combo({
            addcssButton: "xs_button_con frame_color ",
            addcssMenu: "xs_menu_con",
            addcssFocus: "xs_focus_con",
            cssText: "xs_text_con item_font",
            time: 750,
            combo: true,
            val: SGI.con_files[0],
            data: SGI.con_files
        });

        if (SGI.con_files.length == 0) {
            $("#btn_con_offline").parent().hide()
        }


        $("#inp_con_ip").bind("change", function () {
            SGI.disconnect();

            if (SGI.con_files.indexOf($(this).val()) == -1) {
                $("#btn_con_offline").parent().hide()
            } else {
                $("#btn_con_offline").parent().show()
            }

        });

        $("#inp_con_ip").bind("keyup", function (e) {

            if (SGI.con_data) {
                SGI.disconnect();
            }
            if (SGI.con_files.indexOf($(this).children().first().val()) == -1) {
                $("#btn_con_offline").parent().hide()
            } else {
                $("#btn_con_offline").parent().show()
            }

        });


        var movementTimer = null;
        var panel_open = false;
        $("#inp_con_ip").mousemove(function (e, x) {
            clearTimeout(movementTimer);
            movementTimer = setTimeout(function () {
                if (!panel_open) {
                    panel_open = true;
                    $("#con_panel").stop(true, false).slideDown(300)
                }

            }, 150);
        });

        $("#inp_con_ip").mouseout(function (e) {
            clearTimeout(movementTimer);
        });

        $("#con_panel_wrap").hover(function () {

        }, function (e) {

            if ($(e.toElement).attr("id") != "inp_con_ip") {
                if ($(e.target).attr("id") == "con_panel_wrap") {
                    panel_open = false;
                    $("#con_panel").stop(true, false).slideUp(700)
                }
            }
        });
    },

    copy_selected: function () {
        SGI.copy_data = [];

//        $.each($('.fbs_selected'), function () {
        $.each($('.jsplumb-drag-selected '), function () {
            if ($(this).hasClass("fbs_element")) {
                var posi = $(this).position();
                var data = {
                    type: $(this).attr("id").split("_")[0],
                    style: {
                        top: posi.top,
                        left: posi.left
                    },
                    parent: "",
                    fbs: true
                };
                SGI.copy_data.push(data)
            } else if ($(this).hasClass("mbs_element")) {
                var posi = $(this).position();

                var data = {
                    type: $(this).attr("id").split(/_[0-9]+/)[0],
                    style: {
                        top: posi.top,
                        left: posi.left
                    },
                    parent: "",
                    mbs: true
                };
                SGI.copy_data.push(data)
            }

        });


    },

    paste_selected: function (e) {

        var codebox = $(".codebox_active").find(".prg_codebox");

//        $(".fbs_selected").removeClass("fbs_selected");
        $.each(SGI.plumb_inst, function () {
            this.clearDragSelection();
        });

        $.each(SGI.copy_data, function () {

            if (this.fbs) {
                var data = this;
                data.parent = $(codebox).attr('id');
                SGI.add_fbs_element(data, data.style.left, data.style.top, true)
            } else {
                var data = this;
                data.parent = "prg_panel";
                SGI.add_mbs_element(data, data.style.left, data.style.top, true)
            }

        });
    },

    edit_exp: function (data, name, callback) {


        var h = $(window).height() - 200;
        var v = $(window).width() - 400;

        $("body").append('\
                   <div id="dialog_code" style="text-align: left; min-width: 520px" title="Expert Editor">\
                   <button id="btn_exp_id">ID</button>\
                   <button id="btn_exp_group">Gruppe</button>\
                   <button id="btn_exp_device">Gerät</button>\
                   <div style="float: right; margin-top:6px"> \
                   <span>' + SGI.translate("Name:") + '</span>\
                   <input id="exp_name" type="text" value="' + name + '"/>\
                   </div>\
                   <textarea id="codemirror" name="codemirror" class="code frame_color ui-corner-all"></textarea>\
                   </div>');
        $("#dialog_code").dialog({
            height: h,
            width: v,
            resizable: true,
            minWidth: 550,
            close: function () {
                var data = {
                    value: editor.getValue(),
                    name: $('#exp_name').val()
                };
                $.contextMenu('destroy', '.CodeMirror');
                $("#dialog_code").remove();
                return callback(data)
            }
        });

        var editor = CodeMirror.fromTextArea(document.getElementById("codemirror"), {
            mode: {name: "javascript", json: true},
//            value:data.toString(),
            lineNumbers: true,
            readOnly: false,
            theme: "monokai",
            extraKeys: {"Ctrl-Space": "autocomplete"}
        });

        editor.setOption("value", data.toString());

        $.contextMenu({
            selector: '.CodeMirror',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "format": {
                    name: SGI.translate("Autoformat"),
                    className: "item_font ",
                    callback: function () {
                        var _data = editor.getSelection();
                        editor.replaceSelection(js_beautify(_data));
                    }
                }
            }
        });


        $("#btn_exp_id").button().click(function () {

            $.id_select({
                type: "singel",
                close: function (hmid) {
                    var range = {from: editor.getCursor(true), to: editor.getCursor(false)};
                    editor.replaceRange(hmid, range.from, range.to)
                }
            });
        });
        $("#btn_exp_group").button().click(function () {

            $.id_select({
                type: "groups",
                close: function (hmid) {
                    var range = {from: editor.getCursor(true), to: editor.getCursor(false)};
                    editor.replaceRange(hmid, range.from, range.to)
                }
            });
        });
        $("#btn_exp_device").button().click(function () {

            $.id_select({
                type: "device",
                close: function (hmid) {
                    var data = '"' + hmid + '"';
                    var range = {from: editor.getCursor(true), to: editor.getCursor(false)};
                    editor.replaceRange(data, range.from, range.to)
                }
            });
        });
    },

    clear: function () {
        SGI.plumb_inst.inst_mbs.cleanupListeners();
//    SGI.plumb_inst.inst_mbs.reset();
//        SGI.plumb_inst.inst_fbs.reset();
        $("#prg_panel").children().remove();
        SGI.mbs_n = 0;
        SGI.fbs_n = 0;
        $("#m_file").text("neu");
        SGI.file_name = "";

        PRG = {
            struck: {
                codebox: {},
                trigger: [],
                control: []
            }
        };
        scope.mbs = {};
        scope.fbs = {};
        scope.con = {
            mbs: {},
            fbs: {}
        };

        scope.reset_scope_watchers();
        scope.$apply();
        SGI.mbs_inst();
    },

    get_name: function (hmid) {
        var _name;
        if (hmid == undefined) {
            return ["Rechtsklick"];
        } else {
            if (homematic.regaObjects[hmid] == undefined) {
                return "UNGÜLTIGE ID !!!";
            } else {

                try {
                    if (homematic.regaObjects[hmid]["TypeName"] == "VARDP" || homematic.regaObjects[hmid]["TypeName"] == "PROGRAM") {
                        _name = homematic.regaObjects[hmid]["Name"].split(".").pop();

                    } else if (homematic.regaObjects[hmid]["TypeName"].match(/ENUM/)) {
                        _name = SGI.translate(homematic.regaObjects[hmid]["TypeName"].split("ENUM_")[1]) + " > " + homematic.regaObjects[hmid]["Name"];
                    } else if (homematic.regaObjects[hmid]["TypeName"] == "FAVORITE") {
                        _name = SGI.translate("FAVORITE") + " > " + homematic.regaObjects[hmid]["Name"];
                    } else {
                        var parent = homematic.regaObjects[hmid]["Parent"];
                        var parent_data = homematic.regaObjects[parent];
                        _name = parent_data.Name + " > " + homematic.regaObjects[hmid]["Name"].split(".").pop();
                    }
                    return [_name];
                } catch (err) {
                    return "UNGÜLTIGE ID !!!";
                }

            }
        }
    },

    get_id_by_name: function (name) {
        var id = 0;
        console.log(name)
        $.each(homematic.regaObjects, function (key) {

            if (key > 99999) {
                console.log(key);
                console.log(this);
                if (this.Name == name) {
                    id = key
                    return false
                }
            }
        });

        return id
    },

    get_lowest_obj_id: function (name, cb) {

        if (SGI.con_data) {
            var last_id = 100000;
            var id_by_name = SGI.get_id_by_name(name);
            console.log("by_name " + id_by_name)
            if (id_by_name == 0) {
                $.each(Object.keys(homematic.regaObjects).sort(), function () {

                    var id = parseInt(this);
                    if (id > 99999) {
                        if (id == last_id) {
                            last_id++;
                        } else {
                            return false
                        }
                    }
                });

                return cb(last_id)

            } else {
                return cb(id_by_name)
            }

        } else {
            return cb("undefined")
        }


    },

    find_border_position: function (data) {
        var box_h = parseInt($("#" + data.parent).css("height").split("px")[0]);
        var box_w = parseInt($("#" + data.parent).css("width").split("px")[0]);
        var top = parseInt($("#" + data.fbs_id).css("top").split("px")[0]);
        var left = parseInt($("#" + data.fbs_id).css("left").split("px")[0]);

        var p = [
            {ist: parseInt(left) || 9999, t: "left"},
            {ist: parseInt(box_w - left) || 9999, t: "right"},
            {ist: parseInt(top) || 9999, t: "top"},
            {ist: parseInt(box_h - top) || 9999, t: "bottom"}
        ];

        function SortByName(a, b) {
            var aName = a.ist;
            var bName = b.ist;
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        }

        p.sort(SortByName);

        return p[0].t

    },

    find_prg_codebox: function (child) {
        var prg_codebox = undefined;

        if ($(child).hasClass('ui-resizable-handle')) {
            prg_codebox = undefined;
        } else if ($(child).hasClass('prg_codebox')) {
            prg_codebox = $(child);
        } else if ($(child).hasClass('mbs_element_codebox')) {
            prg_codebox = $(child).find(".prg_codebox");
        } else {
            var all = $(child).parents();
            $.each(all, function () {
                if ($(this).hasClass('prg_codebox')) {
                    prg_codebox = this;
                }
            });
        }
        return prg_codebox
    },

    read_experts: function () {
        function SortFile(a, b) {
            var aName = a.toString();
            var bName = b.toString();
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        };

        fs.readdir(scope.setup.datastore + '/ScriptGUI_Data/experts/', function (err, _files) {
            if (err) {
                console.log(err);
                throw err;
            } else {

                var files = _files;
                SGI.experts = {};
                $(".fbs_exp_custom").remove();
                $(".expert_br").remove();

                files.sort(SortFile);

                $.each(files, function () {
                    var file = this.toString();
                    try {
                        fs.readFile(scope.setup.datastore + '/ScriptGUI_Data/experts/' + file, function (err, data) {
                            if (err) {
                                throw err;
                            } else {
                                var data = JSON.parse(data);
                                SGI.experts[data.name] = data;
                                $("#toolbox_expert").append('\
                                <div id="expert_' + data.name + '" style="width: 60px;height: auto;margin: auto;text-align: center;background-color: #ffffff;border: 1px solid #00ffff;border-radius: 7px;z-index: 50;display: inline-table;margin-top:30px; overflow-x: visible;overflow-y: hidden ;min-height:72px" class="fbs_exp_custom fbs">\
                                <div style="position: relative; height: 100%; width: 100%; display: inline-block;"> \
                                <div  class="div_head" style="background-color: gray;">\
                                    <a style="background-color:transparent; border:none; width: 56px; text-align: center;" class="head_font">' + data.name + '</a>\
                                </div>\
                                <div id="left_' + data.name + '" class="div_left_exp">\
                                </div>\
                                <div id="right_' + data.name + '" class="div_right_exp">\
                                </div>\
                                <label class="lab_exp_in">Inputs</label>\
                                <label class="lab_exp_out">Outputs</label>\
                                <a style="color: #000000" id="var_in_' + data.name + '" class="inp_exp_val_in" >' + data.in + '</a>\
                                <a style="color: #000000" id="var_out_' + data.name + '" class="inp_exp_val_out" >' + data.out + '</a>\
                                <button type="button" style="z-index: 2" id="btn_' + data.name + '" class="btn_exp">Edit</button> \
                                </div> \
                             </div><br class="expert_br">');

                                for (var i = 1; i <= parseInt(data.in); i++) {
                                    $("#left_" + data.name).append('' +
                                    '<div id="' + data.name + '_in' + i + '"  class="div_input ' + data.name + '_in">' +
                                    '<div style="background-color:gray;height: 10px;width: 10px;position: relative;left: -11px; top:5px"></div>' +
                                    '</div>')
                                }
                                for (var i = 1; i <= parseInt(data.out); i++) {
                                    $("#right_" + data.name).append('<div id="' + data.name + '_out' + i + '" class="div_output1 ' + data.name + '_out">' +
                                    '<div style="background-color:gray;height: 10px;width: 10px;position: relative;left: 21px; top:5px"></div>' +
                                    '</div>');

                                }

                                var active_toolbox;
                                $("#expert_" + data.name).draggable({
                                    helper: "clone",
                                    appendTo: "body",
                                    zIndex: 101,
                                    containment: "body",
                                    iframeFix: true,
                                    start: function (e, ui) {
                                    },
                                    drag: function (e, ui) {
                                    },
                                    stop: function () {
                                        $("#helper").remove()
                                    }
                                });

                            }
                        });
                    }
                    catch (err) {
                        throw err
                    }
                })
            }
        })
    },

    check_fs: function (cb) {

        function check_dir() {

            try {
                if (!fs.existsSync(path.resolve(scope.setup.datastore + '/ScriptGUI_Data'))) {
                    fs.mkdirSync(path.resolve(scope.setup.datastore + '/ScriptGUI_Data'));
                }
                if (!fs.existsSync(path.resolve(scope.setup.datastore + '/ScriptGUI_Data/programms'))) {
                    fs.mkdirSync(path.resolve(scope.setup.datastore + '/ScriptGUI_Data/programms'));
                }
                if (!fs.existsSync(path.resolve(scope.setup.datastore + '/ScriptGUI_Data/connections'))) {
                    fs.mkdirSync(path.resolve(scope.setup.datastore + '/ScriptGUI_Data/connections'));
                }
                if (!fs.existsSync(path.resolve(scope.setup.datastore + '/ScriptGUI_Data/experts'))) {
                    fs.mkdirSync(path.resolve(scope.setup.datastore + '/ScriptGUI_Data/experts'));
                }
                cb()
            }
            catch (e) {


            }

        }

        if (scope.setup.datastore == "" || !fs.existsSync(path.resolve(scope.setup.datastore))) {
            $("body").append('\
                <div id="dialog_datastore" style="text-align: center" title="Datastore">\
                <img src="./img/logo.png" style="width: 300px"/><br><br><br>\
                <div style="font-size: 16px; font-weight: 900;">' + SGI.translate("select_datastore") + '</div><br><br>\
                <input style="display:none" id="datastore_patch" type="file"  nwdirectory />\
                <div style="display: inline">' + SGI.translate("path") + '</div><input type="text" style="width: 450px" id="inp_datastore" value="' + nwDir + '"/><button style="height: 27px;margin-top: -3px;" id="btn_datastore_chose">...</button><br><br><br>\
                <button id="btn_datastore_ok">' + SGI.translate("ok") + '</button>\
                </div>');

            $("#dialog_datastore").dialog({
                width: "600px",
                height: 400,
                dialogClass: "update",
                modal: true,
                close: function () {
                    $("#dialog_datastore").remove();
                    check_dir()
                }
            });

            $("#btn_datastore_ok").button().click(function () {
                if (fs.existsSync(path.resolve($("#inp_datastore").val()))) {

                    scope.setup.datastore = path.resolve($("#inp_datastore").val());
                    scope.$apply();
                    SGI.save_setup();
                    $("#dialog_datastore").dialog("close")

                } else {
                    alert("Path not exist")
                }
            });

            $("#btn_datastore_chose").button().click(function () {
                var chooser = $("#datastore_patch");
                chooser.change(function (evt) {
                    if ($(this).val() != "") {
                        $("#inp_datastore").val($(this).val());
                    }
                });

                chooser.attr("nwworkingdir", $("#inp_datastore").val());
                chooser.trigger('click');
            });
        } else {
            check_dir()
        }


    }
};

window.timeoutList = [];
window.intervalList = [];

window.oldSetTimeout = window.setTimeout;
window.oldSetInterval = window.setInterval;
window.oldClearTimeout = window.clearTimeout;
window.oldClearInterval = window.clearInterval;

window.setTimeout = function (code, delay) {
    var retval = window.oldSetTimeout(code, delay);
    window.timeoutList.push(retval);
    return retval;
};
window.clearTimeout = function (id) {
    var ind = window.timeoutList.indexOf(id);
    if (ind >= 0) {
        window.timeoutList.splice(ind, 1);
    }
    var retval = window.oldClearTimeout(id);
    return retval;
};
window.setInterval = function (code, delay) {
    var retval = window.oldSetInterval(code, delay);
    window.intervalList.push(retval);
    return retval;
};
window.clearInterval = function (id) {
    var ind = window.intervalList.indexOf(id);
    if (ind >= 0) {
        window.intervalList.splice(ind, 1);
    }
    var retval = window.oldClearInterval(id);
    return retval;
};
window.clearAllTimeouts = function () {
    for (var i in window.timeoutList) {
        window.oldClearTimeout(window.timeoutList[i]);
    }
    window.timeoutList = [];
};
window.clearAllIntervals = function () {
    for (var i in window.intervalList) {
        window.oldClearInterval(window.intervalList[i]);
    }
    window.intervalList = [];
};


var deleteFolderRecursive = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};


