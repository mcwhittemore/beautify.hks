var beautify = require("js-beautify");
var colors = require("colors");
var exec = require("child_process").exec;
var fs = require("fs");

var hook = process.argv[2];

if (hook != "pre-commit") {
    console.error("This is only going to work with commit-msg");
} else {
    //TODO: it would be sweet if hooks had an api that gave me these... 
    exec("git diff --cached --name-status --diff-filter=AMR", function(err, stdout, stderr) {
        if (err) {
            console.log("GIT ERROR".red);
            console.log(err);
            process.exit(1);
        } else if (stderr) {
            console.log(stderr);
            process.exit(1);
        } else {
            var lines = stdout.split("\n");
            var iLines = lines.length;
            var files_to_add = [];
            while (iLines--) {
                var line = lines[iLines];
                if (line != "") {
                    var filename = line.split("\t")[1];
                    var found = filename.match(/\.js$/g);
                    //console.log(filename, found);
                    if (found) {
                        var ugly;
                        try {
                            ugly = fs.readFileSync(filename, {
                                encoding: "utf8"
                            });
                        } catch (err) {
                            console.log(filename + ": ERROR".red);
                            console.log(err.message);
                            process.exit(1);
                        }

                        var beautiful = beautify(ugly);
                        if (ugly != beautiful) {
                            fs.writeFileSync(filename, beautiful);
                            console.log(filename + ": BEAUTIFIED".blue);
                            files_to_add.push(filename);
                        } else {
                            console.log(filename + ": ALREADY BEAUTIFUL".green);
                        }
                    } else {
                        console.log(filename + ": SKIPPED".yellow);
                    }
                }
            }

            if (files_to_add.length > 0) {
                //TODO: it would be sweet if hooks had an API that just added this in.
                var adder = function(iFiles) {
                    exec("git add " + files_to_add[iFiles], function(err, stdout, stderr) {
                        if (err) {
                            console.log("GIT ADD ERROR".red);
                            console.log(err.message);
                            process.exit(1);
                        } else if (stderr) {
                            console.log("GIT ADD ERROR".red);
                            console.log(err.message);
                            process.exit(1);
                        } else {
                            if (iFiles > 0) {
                                adder(iFiles - 1);
                            } else {
                                console.log("ALL CHANGES ADDED!");
                            }
                        }
                    });
                }

                adder(files_to_add.length - 1);
            } else {
                console.log("YOU WRITE BEAUTIFUL CODE!");
            }
        }
    });
}