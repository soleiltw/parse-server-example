#!/usr/bin/env node

var Parse = require('parse').Parse;
var main = require('./cloud/main');

main.pushToCaretaker();

process.exit();