/*
 **************************************************
 *  Bungee.js
 *
 *  (c) 2012-2013 Johannes Zellner
 *
 *  Bungee may be freely distributed under the MIT license.
 *  For all details and documentation:
 *  http://bungeejs.org
 **************************************************
 */

"use strict";

/*
 **************************************************
 * Bungee Helper
 **************************************************
 */

var ret = {};
ret.debug = false;
ret.verbose = false;

ret.jump = function (engine) {
    ret.useQueryFlags();
    ret.compileScriptTags(engine ? engine : new Bungee.RendererDOM());
    engine.start();
};

ret.useQueryFlags = function() {
    // TODO improve detection
    ret.verbose = (window.location.href.indexOf("verbose") >= 0);
    ret.debug = (window.location.href.indexOf("debug") >= 0);
};

ret.compileScriptTagElement = function(engine, script) {
    var tokens = Bungee.Tokenizer.parse(script.text);
    var moduleName = script.attributes.module && script.attributes.module.textContent;
    var o, n;

    Bungee.Compiler.compileAndRender(tokens, { module: moduleName }, function (error, result) {
        if (error) {
            console.error("Bungee compile error: " + error.line + ": " + error.message);
            console.error(" -- " + error.context);
        } else {
            if (ret.verbose || ret.debug) {
                console.log("----------------------");
                console.log(result);
                console.log("----------------------");
                console.log("eval...");
                o = new Date();
            }

            var tmp = eval(result);
            console.log(tmp);
            tmp(ret, engine);

            if (ret.verbose || ret.debug) {
                n = new Date();
                console.log("done, eval took time: ", (n - o), "ms");
            }
        }
    });
};

ret.compileScriptTags = function(engine, dom) {
    for (var i = 0; i < window.document.scripts.length; ++i) {
        var script = window.document.scripts[i];
        if (script.type === "text/jmp" || script.type === "text/jump") {
            ret.compileScriptTagElement(engine, script);
        }
    }
};

// register in global namespace
module.exports = ret;
