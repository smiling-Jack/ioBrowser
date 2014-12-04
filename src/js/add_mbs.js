/**
 * Copyright (c) 2013 Steffen Schorling http://github.com/smiling-Jack
 * Lizenz: [CC BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/de/)
 */

SGI = $.extend(true, SGI, {

    add_mbs_element: function (_data, left, top ,copy) {
        var nr = _data.counter || SGI.mbs_n;
        SGI.mbs_n++;

        var data = {
            mbs_id: _data.type + "_" + nr,
            type: _data.type,
            hmid: _data.hmid || [],
            name: _data.name || ["Rechtsklick"],
            time: _data.time || ["00:00"],
            minuten: _data.minuten || [0],
            astro: _data.astro || ["sunrise"],
            day: _data.day || ["88"],
            val: _data.val || [],
            wert: _data.wert || [],
            kommentar: _data.kommentar || "Kommentar",
            titel: _data.titel || "Programm_" + nr,
            counter: nr,

            style: _data.style || {
                "left": left + "px",
                "top": top + "px"
            },
            opt1:_data.opt1 || "",
            opt2:_data.opt1 || "",
            opt3:_data.opt1 || "",
        };

        if (copy) {
            data.style = {
                "left": left + 18 + "px",
                "top": top + 18 + "px"
            }
        }

//        PRG.mbs[data.mbs_id] = data; //todo Remove after ng
        scope.mbs[nr] = data;


        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        if (data.type == "codebox") {

            if (data.style.width == undefined) {
                scope.mbs[nr].style = {
                    "width": "300px",
                    "height": "200px",
                    "left": scope.mbs[nr].style.left,
                    "top": scope.mbs[nr].style.top
                }
            }

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_codebox">\
                <div mbs_id="' + data.mbs_id + '" data-nr="' + nr + '" class="titel_body">\
                    <input style="position: relative; margin-top: -12px" ng-model="mbs[' + nr + '].titel" type="text" id="titel_' + data.mbs_id + '" class="titel_codebox item_font">\
                </div>\
                <div data-nr="' + nr + '" class="titel_body titel_body_2"></div>\
                <div id="prg_' + data.mbs_id + '" class="prg_codebox"></div>\
            </div>');


            SGI.add_codebox_inst(data.mbs_id);

            var min_h;
            var min_w;
            $('#prg_' + data.type + '_' + nr).resizable({
//                ghost: true,
                start: function () {
                    min_h = [];
                    min_w = [];

                    $(this).css({border: "2px dotted #00ffff"});
                    $(this).parent().css({border: "2px dotted transparent"});

                    $.each($(this).children(".fbs_element:not(.fbs_element_onborder)"), function () {

                        var pos = $(this).position();
                        min_w.push(pos.left + $(this).width());
                        min_h.push(pos.top + $(this).height());
                    });
                    min_w = min_w.sort(function (a, b) {
                        return b - a
                    });
                    min_h = min_h.sort(function (a, b) {
                        return b - a
                    });
                },
                resize: function (event, ui) {
                    var new_h = ui.size.height;
                    var new_w = ui.size.width;

                    if (new_h < min_h[0]) {
                        $(this).css({height: min_h[0]});
                    }
                    if (new_w < min_w[0]) {
                        $(this).css({width: min_w[0]});
                    }
                    SGI.plumb_inst["inst_" + data.mbs_id].repaintEverything();
                    SGI.plumb_inst.inst_mbs.repaintEverything();
                },
                stop: function (event, ui) {
                    $(this).css({border: "2px dotted transparent"});
                    $(this).parent().css({border: "2px dotted #00ffff"});
                    scope.mbs[nr].style["width"] = $(this).css("width");
                    scope.mbs[nr].style["height"] = $(this).css("height");
                    scope.$apply()
                }
            });

            $('#' + data.mbs_id).click(function (event) {
                if ($(event.target).hasClass("prg_codebox")) {
                    $(".codebox_active").removeClass("codebox_active");
                    $(this).addClass("codebox_active")
                }
            });
        }

        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "komex") {

            if (data.style.color == undefined) {
                scope.mbs[nr].style = {
                    "background-color": "yellow",
                    "color": "black",
                    "left": scope.mbs[nr].style.left,
                    "top": scope.mbs[nr].style.top
                }
            }

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_kommentar">\
                <textarea id="text_' + nr + '" class="komex" ng-model="mbs[' + nr + '].kommentar"></textarea>\
            </div>');

            $("#text_" + nr).autosize();
            console.log($("#" + data.mbs_id).data("nr"));

        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_event") {

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_singel">\
                <div    class="div_head" style="background-color: red">\
                    <p class="head_font">Trigger -- &nbsp</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" >\
                </div>\
            </div>');

            SGI.add_trigger_name($("#" + data.mbs_id));
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_EQ") {

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_singel">\
                <div    class="div_head" style="background-color: red">\
                    <p class="head_font">Trigger ' + data.type.split("_")[1] + ' &nbsp</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" >\
                </div>\
            </div>');

            SGI.add_trigger_name($("#" + data.mbs_id));
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_NE") {

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_singel">\
                <div    class="div_head" style="background-color: red">\
                    <p class="head_font">Trigger ' + data.type.split("_")[1] + ' &nbsp</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" >\
                </div>\
            </div>');

            SGI.add_trigger_name($("#" + data.mbs_id));
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_GT") {

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_singel">\
                <div    class="div_head" style="background-color: red">\
                    <p class="head_font">Trigger ' + data.type.split("_")[1] + ' &nbsp</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" >\
                </div>\
            </div>');

            SGI.add_trigger_name($("#" + data.mbs_id));
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_GE") {

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_singel">\
                <div    class="div_head" style="background-color: red">\
                    <p class="head_font">Trigger ' + data.type.split("_")[1] + ' &nbsp</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" >\
                </div>\
            </div>');

            SGI.add_trigger_name($("#" + data.mbs_id));
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_LT") {

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_singel">\
                <div    class="div_head" style="background-color: red">\
                    <p class="head_font">Trigger ' + data.type.split("_")[1] + ' &nbsp</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" >\
                </div>\
            </div>');

            SGI.add_trigger_name($("#" + data.mbs_id));
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_LE") {

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_singel">\
                <div    class="div_head" style="background-color: red">\
                    <p class="head_font">Trigger ' + data.type.split("_")[1] + ' &nbsp</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" >\
                </div>\
            </div>');

            SGI.add_trigger_name($("#" + data.mbs_id));
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_start") {

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_simpel">\
                <div    class="div_head" style="background-color: red">\
                    <p class="head_font">Trigger Start</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" style="color: black; font-size: 12px; text-align: center" >Scriptengine start\
                </div>\
            </div>');


        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_yearly") {

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_simpel">\
                <div    class="div_head" style="background-color: red">\
                    <p class="head_font">Trigger</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" style="color: black; font-size: 12px; text-align: center" >Yearly\
                </div>\
            </div>');

        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_monthly") {

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_simpel">\
                <div    class="div_head" style="background-color: red">\
                    <p class="head_font">Trigger</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" style="color: black; font-size: 12px; text-align: center" >Monthly\
                </div>\
            </div>');

        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_time") {
            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_time">\
                <div    class="div_head" style="background-color: red">\
                  <p class="head_font">Trigger Time</p>\
                  <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" >\
                </div>\
            </div>');

            SGI.add_trigger_time($("#" + data.mbs_id));
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_vartime") {

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_vartime">\
                <div    class="div_head" style="background-color: red">\
                                    <p class="head_font">Trigger var Time &nbsp  &nbsp</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" >\
                </div>\
            </div>');

            SGI.add_trigger_name($("#" + data.mbs_id));
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_astro") {
            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_astro">\
                <div    class="div_head" style="background-color: red">\
                  <p class="head_font">Trigger Astro</p>\
                  <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger">\
                </div>\
            </div>');

            SGI.add_trigger_astro($("#" + data.mbs_id));
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "trigger_zykm") {
            if (data.time[0] == "00:00") {
                scope.mbs[nr].time = "0"
            }
            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_simpel">\
                <div    class="div_head" style="background-color: red">\
                    <p class="head_font">Trigger Zyklus M &nbsp&nbsp&nbsp</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" >\
                    <div id="tr_ch_body_' + nr + '" class="tr_ch_body">\
                        <input class="inp_peri" ng-model="mbs[' + nr + '].time" id="zykm_var_' + nr + '">\
                        <a style="position: relative;z-index: 1; background-color: transparent;margin-left: 4px; font-size: 13px;color: #676767">Minutes</a> \
                    </div>\
                </div>\
            </div>');

            $('#zykm_var_' + nr).numberMask({type: 'float', beforePoint: 3, afterPoint: 2, decimalMark: '.'});

        }
//    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//    if (data.type == "trigger_valNe") {
//
//      scope.append($("#prg_panel"), '\
//            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_singel">\
//              <div    class="div_head" style="background-color: red">\
//                  <p class="head_font">Trigger ' + data.type.split("_")[1] + '</p>\
//                  <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
//              </div>\
//              <div class="div_hmid_trigger" >\
//              </div>\
//            </div>');
//
//      SGI.add_trigger_name($("#" + data.mbs_id));
//    }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        if (data.type == "trigger_val") {
            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_trigger tr_val">\
                <div    class="div_head" style="background-color: red">\
                    <p class="head_font">Trigger Value</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                </div>\
                <div class="div_hmid_trigger" >\
                </div>\
            </div>');


            SGI.add_trigger_name_val($("#" + data.mbs_id));
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "brake") {

            if (data.val.length == 0) {
                data.val = 0;
            }

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_simpel mbs_element_control ">\
                <div id="head_' + data.mbs_id + '" class="div_head" style="background-color: #0060FF">\
                    <a class="head_font">Delay</a>\
                </div>\
                <div style="border-bottom: 1px solid rgb(166, 166, 166); display: flex;">\
                    <input type="text" class="brake_delay " ng-model="mbs[' + nr + '].val" id="' + data.mbs_id + '_delay" title="' + SGI.translate("Pause in Sekunden") + '" />\
                    <input type="checkbox" class="brake_delay_check" ng-model="mbs[' + nr + '].wert" id="' + data.mbs_id + '_delay_opt" title="' + SGI.translate("delay_check") + '"/>\
                </div>\
                <div id="left_' + nr + '" class="div_left">\
                                  <div id="' + data.mbs_id + '_in1"  class="div_input ' + data.mbs_id + '_in"><a class="input_font">' + SGI.translate("Start") + '</a></div>\
                                  <div id="' + data.mbs_id + '_in2"  class="div_input ' + data.mbs_id + '_in"><a class="input_font">' + SGI.translate("Abbruch") + '</a></div>\
                </div>\
                <div id="right_' + nr + '" class="div_right_brake">\
                    <div id="' + data.mbs_id + '_out" class="div_output1 ' + data.mbs_id + '_out"><a class="output_font"></a></div>\
                </div>\
            </div>');

            $("#" + data.mbs_id + "_delay").numberMask({type: 'float', beforePoint: 5, afterPoint: 1, decimalMark: '.'})

        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "intervall") {

            if (data.val.length == 0) {
                data.val = 1;
            }

            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_simpel mbs_element_control ">\
                <div id="head_' + data.mbs_id + '" class="div_head" style="background-color: #0060FF">\
                    <a class="head_font">Intervall</a>\
                 </div>\
                <div style="border-bottom: 1px solid rgb(166, 166, 166)">\
                    <input type="text" class="brake_delay" ng-model="mbs[' + nr + '].val" id="' + data.mbs_id + '_delay" title="' + SGI.translate("Pause in Sekunden") + '" />\
                </div>\
                <div id="left_' + nr + '" class="div_left">\
                                  <div id="' + data.mbs_id + '_in1"  class="div_input ' + data.mbs_id + '_in"><a class="input_font">' + SGI.translate("Start") + '</a></div>\
                                  <div id="' + data.mbs_id + '_in2"  class="div_input ' + data.mbs_id + '_in"><a class="input_font">' + SGI.translate("Abbruch") + '</a></div>\
                </div>\
                <div id="right_' + nr + '" class="div_right_brake">\
                    <div id="' + data.mbs_id + '_out" class="div_output1 ' + data.mbs_id + '_out"><a class="output_font"></a></div>\
                </div>\
            </div>');

            $("#" + data.mbs_id + "_delay").numberMask({type: 'float', beforePoint: 5, afterPoint: 1, decimalMark: '.'})

        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "loop") {

            if (data.val.length == 0) {
                data.val = 1;
            }

            if (typeof data.wert === "object") {
                data.wert = 1;
            }
            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_simpel mbs_element_control ">\
                <div id="head_' + data.mbs_id + '" class="div_head" style="background-color: #0060FF">\
                    <a class="head_font">Loop</a>\
                </div>\
                <div style="border-bottom: 1px solid rgb(166, 166, 166)">\
                    <div style="color: #000000; display: inline; font-size: 9px;">Loop:</div><input ng-model="mbs[' + nr + '].wert" type="text" class="brake_delay" id="' + data.mbs_id + '_n" title="' + SGI.translate("loop_n") + '" />\
                    <div style="color: #000000; display: inline; font-size: 9px;">Time:</div><input ng-model="mbs[' + nr + '].val" type="text" class="brake_delay" id="' + data.mbs_id + '_delay" title="' + SGI.translate("loop_delay") + '" />\
                </div>\
                <div id="left_' + nr + '" class="div_left">\
                    <div id="' + data.mbs_id + '_in1" class="div_input ' + data.mbs_id + '_in"><a class="input_font">Start</a></div>\
                    <div id="' + data.mbs_id + '_in2" class="div_input ' + data.mbs_id + '_in"><a class="input_font">Cancel</a></div>\
                </div>\
                <div id="right_' + nr + '" class="div_right_loop">\
                    <div id="' + data.mbs_id + '_out" class="div_output1 ' + data.mbs_id + '_out"><a class="output_font"></a></div>\
                </div>\
            </div>');

            $("#" + data.mbs_id + "_delay").numberMask({
                type: 'float',
                beforePoint: 5,
                afterPoint: 1,
                decimalMark: '.'
            });

            $("#" + data.mbs_id + "_n").numberMask({type: 'int', beforePoint: 5})

        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "block_t") {

            if (data.opt1 == "") {
                data.opt1 = "1";
            }


            if (typeof data.wert === "object") {
                data.wert = 1;
            }
            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_simpel mbs_element_control ">\
                <div id="head_' + data.mbs_id + '" class="div_head" style="background-color: #0060FF">\
                    <a class="head_font">Block t</a>\
                </div>\
                <div style="border-bottom: 1px solid rgb(166, 166, 166)">\
                    <div style="color: #000000; display: inline; font-size: 9px;">Ms:</div><input ng-model="mbs[' + nr + '].opt1" type="text" class="brake_delay" id="' + data.mbs_id + '_opt1" />\
                </div>\
                <div id="left_' + nr + '" class="div_left">\
                    <div id="' + data.mbs_id + '_in1" class="div_input ' + data.mbs_id + '_in"><a class="input_font">In</a></div>\
                    <div id="' + data.mbs_id + '_in2" class="div_input ' + data.mbs_id + '_in"><a class="input_font">Reset</a></div>\
                </div>\
                <div id="right_' + nr + '" class="div_right_brake">\
                    <div id="' + data.mbs_id + '_out" class="div_output1 ' + data.mbs_id + '_out"><a class="output_font"></a></div>\
                </div>\
            </div>');




        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "block_n") {

            if (data.opt1 == "") {
                data.opt1 = "1";
            }


            if (typeof data.wert === "object") {
                data.wert = 1;
            }
            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_simpel mbs_element_control ">\
                <div id="head_' + data.mbs_id + '" class="div_head" style="background-color: #0060FF">\
                    <a class="head_font">Block n</a>\
                </div>\
                <div style="border-bottom: 1px solid rgb(166, 166, 166)">\
                    <div style="color: #000000; display: inline; font-size: 9px;">Count:</div><input ng-model="mbs[' + nr + '].opt1" type="text" class="brake_delay" id="' + data.mbs_id + '_opt1" />\
                </div>\
                <div id="left_' + nr + '" class="div_left">\
                    <div id="' + data.mbs_id + '_in1" class="div_input ' + data.mbs_id + '_in"><a class="input_font">In</a></div>\
                    <div id="' + data.mbs_id + '_in2" class="div_input ' + data.mbs_id + '_in"><a class="input_font">Reset</a></div>\
                </div>\
                <div id="right_' + nr + '" class="div_right_brake">\
                    <div id="' + data.mbs_id + '_out" class="div_output1 ' + data.mbs_id + '_out"><a class="output_font"></a></div>\
                </div>\
            </div>');


            $("#" + data.mbs_id + "_opt1").numberMask({type: 'int', beforePoint: 5})
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "block_tt") {

            if (data.opt1 == "") {
                data.opt1 = "00:00";
            }
            if (data.opt2 == "") {
                data.opt2 = "00:00";
            }


            if (typeof data.wert === "object") {
                data.wert = 1;
            }
            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_simpel mbs_element_control ">\
                <div id="head_' + data.mbs_id + '" class="div_head" style="background-color: #0060FF">\
                    <a class="head_font">Block tt</a>\
                </div>\
                <div style="border-bottom: 1px solid rgb(166, 166, 166)">\
                    <div style="color: #000000; display: inline; font-size: 9px;">Time1</div><input ng-model="mbs[' + nr + '].opt1" type="text" class="brake_delay" id="' + data.mbs_id + '_opt1" />\
                    <div style="color: #000000; display: inline; font-size: 9px;">Time2</div><input ng-model="mbs[' + nr + '].opt2" type="text" class="brake_delay" id="' + data.mbs_id + '_opt2" />\
                </div>\
                <div id="left_' + nr + '" class="div_left">\
                    <div id="' + data.mbs_id + '_in1" class="div_input ' + data.mbs_id + '_in"><a class="input_font">In</a></div>\
                    <div id="' + data.mbs_id + '_in2" class="div_input ' + data.mbs_id + '_in"><a class="input_font">Reset</a></div>\
                </div>\
                <div id="right_' + nr + '" class="div_right_loop">\
                    <div id="' + data.mbs_id + '_out" class="div_output1 ' + data.mbs_id + '_out"><a class="output_font"></a></div>\
                </div>\
            </div>');



        }

        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "block_tn") {

            if (data.opt1 == "") {
                data.opt1 = "1";
            }
            if (data.opt2 == "") {
                data.opt2 = "1";
            }


            if (typeof data.wert === "object") {
                data.wert = 1;
            }
            scope.append($("#prg_panel"), '\
            <div id="' + data.mbs_id + '" ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" class="mbs_element mbs_element_simpel mbs_element_control ">\
                <div id="head_' + data.mbs_id + '" class="div_head" style="background-color: #0060FF">\
                    <a class="head_font">Block tn</a>\
                </div>\
                <div style="border-bottom: 1px solid rgb(166, 166, 166)">\
                    <div style="color: #000000; display: inline; font-size: 9px;">Ms:  </div><input ng-model="mbs[' + nr + '].opt1" type="text" class="brake_delay" id="' + data.mbs_id + '_opt1" />\
                    <div style="color: #000000; display: inline; font-size: 9px;">Count:</div><input ng-model="mbs[' + nr + '].opt2" type="text" class="brake_delay" id="' + data.mbs_id + '_opt2" />\
                </div>\
                <div id="left_' + nr + '" class="div_left">\
                    <div id="' + data.mbs_id + '_in1" class="div_input ' + data.mbs_id + '_in"><a class="input_font">In</a></div>\
                    <div id="' + data.mbs_id + '_in2" class="div_input ' + data.mbs_id + '_in"><a class="input_font">Reset</a></div>\
                </div>\
                <div id="right_' + nr + '" class="div_right_loop">\
                    <div id="' + data.mbs_id + '_out" class="div_output1 ' + data.mbs_id + '_out"><a class="output_font"></a></div>\
                </div>\
            </div>');


            $("#" + data.mbs_id + "_opt1").numberMask({type: 'int', beforePoint: 5})
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "scriptobj") {

            if (scope.mbs[nr]["name"] == "Rechtsklick") {
                scope.mbs[nr]["name"] = "";
            }

            scope.append($("#prg_panel"), '\
            <div style="min-width:195px " ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" id="' + data.mbs_id + '" class="mbs_element mbs_element_trigger tr_simpel">\
                <div    class="div_head" style="background-color: yellow">\
                    <p style="color: red!important;" class="head_font">Script Objekt</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_obj"/>\
                </div>\
                <div class="div_hmid_trigger" >\
                    <label style="position: relative;z-index: 1; background-color: transparent;display:inline-block; font-size: 13px;color: #000000;width: 45px ">Name: </label><input class="inp_obj_name" ng-model="mbs[' + nr + '].name" id="name_' + data.mbs_id + '">\
                </div>\
            </div>');

        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "ccuobj") {
            var id;
            if (scope.mbs[nr]["hmid"].length == 0) {

                SGI.get_lowest_obj_id("", function (id) {
                    scope.mbs[nr]["hmid"] = id;
                    if (id != "undefined") {
                        homematic.regaObjects[id] = {"Name": "", "TypeName": "VARDP"}
                    }
                });


            } else {
                id = scope.mbs[nr]["hmid"];
                homematic.regaObjects[id] = {"Name": data.name, "TypeName": "VARDP"}
            }

            if (scope.mbs[nr]["name"] == "Rechtsklick") {
                scope.mbs[nr]["name"] = "";
            }

            scope.append($("#prg_panel"), '\
            <div style="min-width:195px"  ng-style="mbs[' + nr + '].style" data-nr="' + nr + '"  id="' + data.mbs_id + '" class="mbs_element mbs_element_trigger tr_simpel">\
                <div    class="div_head" style="background-color: yellow">\
                    <p class="head_font">CCU.IO Objekt</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_obj"/>\
                </div>\
                <div class="div_hmid_trigger" style="text-align:left" >\
                    <label style="position: relative;z-index: 1; background-color: transparent;display:inline-block; font-size: 13px;color: #000000;width: 45px; margin-left: 4px; "> Name: </label><input class="inp_obj_name" ng-model="mbs[' + nr + '].name" id="name_' + data.mbs_id + '" data-id="' + id + '"><br>\
                    <label style="position: relative;z-index: 1; background-color: transparent;display:inline-block; font-size: 13px;color: #000000;width: 45px; margin-left: 4px; "> ID: </label><span style="min-width: 136px;color: black;display: inline-block;" id="hmid_' + data.mbs_id + '" class="ccuobj_id" ng-bind="mbs[' + nr + '].hmid" ></span><img data-id="' + id + '" id="hmid_ack_' + data.mbs_id + '" class="btn_ccuobj_update" src="img/icon/update.png"/>\
                </div>\
            </div>');

            $("#name_" + data.mbs_id).change(function () {
                var ack_id = $(this).data("id");

                if (ack_id != "undefined") {
                    homematic.regaObjects[ack_id].Name = $(this).val();
                }
                scope.mbs[nr]["name"] = $(this).val();
                scope.$apply();
            });

            $("#hmid_ack_" + data.mbs_id).click(function () {
                var ack_id = $(this).data("id");
                SGI.get_lowest_obj_id(scope.mbs[nr].name, function (id) {

                    if (id != "undefined" && id != ack_id) {
                        var del = true;
                        $.each($(".ccuobj_id"), function () {
                            if ($(this).text() == ack_id) {
                                del = false;
                            }
                        });

                        if (del) {
                            delete homematic.regaObjects[ack_id];
                        }

                        homematic.regaObjects[id] = {"Name": scope.mbs[nr]["name"], "TypeName": "VARDP"};
                    } else {
                        homematic.regaObjects[id] = {"Name": scope.mbs[nr]["name"], "TypeName": "VARDP"};
                    }
                    $("#name_" + data.mbs_id).data("id", id);
                    $("#hmid_ack_" + data.mbs_id).data("id", id);
                    scope.mbs[nr]["hmid"] = id;
                    scope.$apply();
                });
            });


        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (data.type == "ccuobjpersi") {
            var id;
            if (scope.mbs[nr]["hmid"].length == 0) {

                SGI.get_lowest_obj_id("", function (id) {
                    scope.mbs[nr]["hmid"] = id;
                    if (id != "undefined") {
                        homematic.regaObjects[id] = {"Name": "", "TypeName": "VARDP"}
                    }
                });


            } else {
                id = scope.mbs[nr]["hmid"];
                homematic.regaObjects[id] = {"Name": data.name, "TypeName": "VARDP"}
            }

            if (scope.mbs[nr]["name"] == "Rechtsklick") {
                scope.mbs[nr]["name"] = "";
            }

            scope.append($("#prg_panel"), '\
            <div style="min-width:195px " ng-style="mbs[' + nr + '].style" data-nr="' + nr + '" id="' + data.mbs_id + '" class="mbs_element mbs_element_trigger tr_simpel">\
                <div    class="div_head" style="background-color: yellow">\
                    <p style="color: #008000!important;"class="head_font">CCU.IO Objekt persistent</p>\
                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_obj"/>\
                </div>\
                 <div class="div_hmid_trigger" style="text-align:left" >\
                    <label style="position: relative;z-index: 1; background-color: transparent;display:inline-block; font-size: 13px;color: #000000;width: 45px; margin-left: 4px;  "> Name: </label><input class="inp_obj_name" ng-model="mbs[' + nr + '].name" id="name_' + data.mbs_id + '" data-id="' + id + '"><br>\
                    <label style="position: relative;z-index: 1; background-color: transparent;display:inline-block; font-size: 13px;color: #000000;width: 45px; margin-left: 4px;  "> ID: </label><span style="min-width: 136px;color: black;display: inline-block;" id="hmid_' + data.mbs_id + '" class="ccuobj_id" ng-bind="mbs[' + nr + '].hmid" ></span><img data-id="' + id + '" id="hmid_ack_' + data.mbs_id + '" class="btn_ccuobj_update" src="img/icon/update.png"/>\
                </div>\
            </div>');


            $("#name_" + data.mbs_id).change(function () {
                var ack_id = $(this).data("id");

                if (ack_id != "undefined") {
                    homematic.regaObjects[ack_id].Name = $(this).val();
                }
                scope.mbs[nr]["name"] = $(this).val();
                scope.$apply();
            });

            $("#hmid_ack_" + data.mbs_id).click(function () {
                var ack_id = $(this).data("id");
                SGI.get_lowest_obj_id(scope.mbs[nr].name, function (id) {

                    if (id != "undefined" && id != ack_id) {
                        var del = true;
                        $.each($(".ccuobj_id"), function () {
                            if ($(this).text() == ack_id) {
                                del = false;
                            }
                        });

                        if (del) {
                            delete homematic.regaObjects[ack_id];
                        }

                        homematic.regaObjects[id] = {"Name": scope.mbs[nr]["name"], "TypeName": "VARDP"};
                    } else {
                        homematic.regaObjects[id] = {"Name": scope.mbs[nr]["name"], "TypeName": "VARDP"};
                    }
                    $("#name_" + data.mbs_id).data("id", id);
                    $("#hmid_ack_" + data.mbs_id).data("id", id);
                    scope.mbs[nr]["hmid"] = id;
                    scope.$apply();
                });
            });

        }

        scope.$apply();
        console.log(data)

        SGI.add_mbs_endpoint(data);
        SGI.make_mbs_drag(data);
        SGI.make_mbs_drop();


        if (data.type != "codebox") {
            $("#prg_panel").find($("#" + data.mbs_id)).append('<div class="mbs_shadow"></div>')
        }

        if (copy) {
            SGI.plumb_inst["inst_mbs"].addToDragSelection($("#"+data.mbs_id));
        }

    }

});
