var hksConfig = require("hooks-config");
hksConfig.hookModule = "beautify.hks";
hksConfig.cwd = process.cwd()+"/../..";

var read = require("read");

var baseConfig = require("./beautify_defaults.json");

hksConfig.view(function(err, userConfig) {

    if (err) {
        console.log(err);
    } else if(Object.keys(userConfig).length==0){
        var keys = Object.keys(baseConfig);
        var config = {};

        var keyToPhrase = function(key) {
            return key.split("_").map(function(word) {
                word[0] = word[0].toUpperCase();
                return word;
            }).join(" ");
        }

        var ask = function(i) {
            if (i == keys.length) {
                done();
            } else {
                var opts = {
                    prompt: keyToPhrase(keys[i]) + ":",
                    default: (userConfig[keys[i]] || baseConfig[keys[i]]) + ""
                }
                read(opts, function(err, value) {
                    if (err) {
                        console.log("User forced exit");
                        process.exit(0);
                    } else {
                        if (value === "true") {
                            value = true;
                        } else if (value === "false") {
                            value = false;
                        } else if (parseInt(value) == value) {
                            value = parseInt(value);
                        }

                        config[keys[i]] = value;
                        ask(i + 1);
                    }
                });
            }
        }

        var done = function() {
            hksConfig.save(config);
        }

        ask(0);
    }

});