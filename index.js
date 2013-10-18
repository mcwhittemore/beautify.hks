var beautify = require("js-beautify");
var colors = require("colors");
var exec = require("child_process").exec;
var fs = require("fs");
var sgf = require("staged-git-files");

var hook = process.argv[2];

if (hook != "pre-commit") {
    console.error("This is only going to work with pre-commit");
} else {
    
    sgf("AMR", function(err, results){
        if (err) {
            console.log("GIT ERROR".red);
            console.log(err);
            process.exit(1);
        } else if (results.length == 0) {
            console.log("> No files to commit".yellow);
        } else {
            var iFiles = results.length;
            var files_to_add = [];
            while (iFiles--) {
                var filename = results[iFiles].filename;
                var found = filename.match(/\.js$/g);
                if (found) {
                    var ugly;
                    try {
                        ugly = fs.readFileSync(sgf.cwd+"/"+filename, {encoding: "utf8"});
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