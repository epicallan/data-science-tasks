/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createRowObj = exports.matchNamesToIds = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // import xfs from '../lib/fs-rx.js';


	var _fastCsv = __webpack_require__(1);

	var _fastCsv2 = _interopRequireDefault(_fastCsv);

	var _fs = __webpack_require__(3);

	var _fs2 = _interopRequireDefault(_fs);

	var _ramda = __webpack_require__(26);

	var _ramda2 = _interopRequireDefault(_ramda);

	var _path = __webpack_require__(27);

	var _path2 = _interopRequireDefault(_path);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var nameIDObjs = [];

	var filePathes = function filePathes(name) {
	  return _path2.default.resolve(process.cwd(), './src/house-holds/samples/' + name);
	};

	var sheetStream = _fs2.default.createReadStream(filePathes('sheet1.csv'));

	var cleanerStream = _fs2.default.createReadStream(filePathes('cleaner.csv'));

	var csvWriteStream = _fastCsv2.default.createWriteStream({ headers: true });

	var writableStream = _fs2.default.createWriteStream(filePathes('result.csv'));

	writableStream.on('finish', function () {
	  console.log('DONE! wrtiting new file');
	});

	var matchNamesToIds = exports.matchNamesToIds = function matchNamesToIds(row) {
	  return row.info.split(';').map(function (list) {
	    return list.split(',')[0];
	  }).map(function (name) {
	    return { name: name.trim(), id: row.id };
	  }).filter(function (obj) {
	    return obj.name.length > 2 && parseInt(obj.id, 10);
	  });
	};

	var createRowObj = exports.createRowObj = function createRowObj(data) {
	  var person = nameIDObjs.find(function (obj) {
	    return obj.name.includes(data.Name);
	  });
	  var id = person ? person.id : null;
	  return _extends({ id: id }, data);
	};

	var cleanerStreamReader = function cleanerStreamReader() {
	  _fastCsv2.default.fromStream(cleanerStream, {
	    headers: ['Name', 'Relationship', 'Age', 'Orphan?', 'Education Level', 'Institution', 'Employed?', 'NSSF']
	  }).on('data', function (data) {
	    var line = createRowObj(data);
	    if (parseInt(line.id, 10)) csvWriteStream.write(line);
	  }).on('end', function () {
	    console.log('done reading cleaner sheet data');
	    csvWriteStream.end();
	  });
	};

	_fastCsv2.default.fromStream(sheetStream, {
	  headers: ['id', 'info', 'id']
	}).on('data', function (data) {
	  var persons = matchNamesToIds(data);
	  nameIDObjs.push.apply(nameIDObjs, _toConsumableArray(persons));
	}).on('end', function () {
	  console.log('done parsing sheet data');
	  csvWriteStream.pipe(writableStream);
	  cleanerStreamReader();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @projectName fast-csv
	 * @github https://github.com/C2FO/fast-csv
	 * @includeDoc [Change Log] ../History.md
	 * @header [../README.md]
	 */

	var fs = __webpack_require__(3),
	    parser = __webpack_require__(4),
	    formatter = __webpack_require__(23);

	function csv() {
	    return parser.apply(void 0, arguments);
	}

	csv.parse = csv;
	csv.fromString = parser.fromString;
	csv.fromPath = parser.fromPath;
	csv.fromStream = parser.fromStream;
	csv.format = formatter;
	csv.write = formatter.write;
	csv.writeToStream = formatter.writeToStream;
	csv.writeToString = formatter.writeToString;
	csv.writeToBuffer = formatter.writeToBuffer;
	csv.writeToPath = formatter.writeToPath;
	csv.createWriteStream = formatter.createWriteStream;
	csv.createReadStream = formatter.createWriteStream;

	module.exports = csv;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var extended = __webpack_require__(5),
	    out = process.stdout,
	    stream = __webpack_require__(18),
	    fs = __webpack_require__(3),
	    ParserStream = __webpack_require__(19);


	function parse(options) {
	    return new ParserStream(options);
	}

	function fromStream(stream, options) {
	    return stream.pipe(new ParserStream(options));
	}

	function fromPath(location, options) {
	    return fs.createReadStream(location).pipe(new ParserStream(options));
	}

	function fromString(string, options) {
	    var rs = new stream.Readable();
	    rs.push(string);
	    rs.push(null);
	    return rs.pipe(new ParserStream(options));
	}

	parse.fromStream = fromStream;
	parse.fromPath = fromPath;
	parse.fromString = fromString;
	module.exports = parse;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var is = __webpack_require__(6);
	module.exports = __webpack_require__(7)()
	    .register(is)
	    .register(__webpack_require__(12))
	    .register(__webpack_require__(15))
	    .register("LINE_BREAK", __webpack_require__(17).EOL)
	    .register("asyncEach", function (arr, iter, cb) {


	        (function asyncIterator(i, l, rows, cb) {
	            if (++i < l) {
	                iter(rows[i], function (err) {
	                    if (err) {
	                        cb(err);
	                    } else {
	                        if ((i % 100) === 0) {
	                            //dont overflow the stack
	                            setImmediate(function () {
	                                asyncIterator(i, l, rows, cb);
	                            });
	                        } else {
	                            asyncIterator(i, l, rows, cb);
	                        }
	                    }
	                });
	            } else {
	                //get out of stack
	                cb(null, arr);
	            }
	        }(-1, arr.length, arr, cb));
	    })
	    .register("spreadArgs", function spreadArgs(f, args, scope) {
	        var ret;
	        switch ((args || []).length) {
	            case 0:
	                ret = f.call(scope);
	                break;
	            case 1:
	                ret = f.call(scope, args[0]);
	                break;
	            case 2:
	                ret = f.call(scope, args[0], args[1]);
	                break;
	            case 3:
	                ret = f.call(scope, args[0], args[1], args[2]);
	                break;
	            default:
	                ret = f.apply(scope, args);
	        }
	        return ret;
	    })
	    .register("keys", function (obj) {
	        var ret = [];
	        if (is.isObject(obj)) {
	            for (var i in obj) {
	                ret.push(i);
	            }
	        }
	        return ret;
	    });

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";

	    function defineIsa(extended) {

	        var pSlice = Array.prototype.slice;

	        var hasOwn = Object.prototype.hasOwnProperty;
	        var toStr = Object.prototype.toString;

	        function argsToArray(args, slice) {
	            var i = -1, j = 0, l = args.length, ret = [];
	            slice = slice || 0;
	            i += slice;
	            while (++i < l) {
	                ret[j++] = args[i];
	            }
	            return ret;
	        }

	        function keys(obj) {
	            var ret = [];
	            for (var i in obj) {
	                if (hasOwn.call(obj, i)) {
	                    ret.push(i);
	                }
	            }
	            return ret;
	        }

	        //taken from node js assert.js
	        //https://github.com/joyent/node/blob/master/lib/assert.js
	        function deepEqual(actual, expected) {
	            // 7.1. All identical values are equivalent, as determined by ===.
	            if (actual === expected) {
	                return true;

	            } else if (typeof Buffer !== "undefined" && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
	                if (actual.length !== expected.length) {
	                    return false;
	                }
	                for (var i = 0; i < actual.length; i++) {
	                    if (actual[i] !== expected[i]) {
	                        return false;
	                    }
	                }
	                return true;

	                // 7.2. If the expected value is a Date object, the actual value is
	                // equivalent if it is also a Date object that refers to the same time.
	            } else if (isDate(actual) && isDate(expected)) {
	                return actual.getTime() === expected.getTime();

	                // 7.3 If the expected value is a RegExp object, the actual value is
	                // equivalent if it is also a RegExp object with the same source and
	                // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	            } else if (isRegExp(actual) && isRegExp(expected)) {
	                return actual.source === expected.source &&
	                    actual.global === expected.global &&
	                    actual.multiline === expected.multiline &&
	                    actual.lastIndex === expected.lastIndex &&
	                    actual.ignoreCase === expected.ignoreCase;

	                // 7.4. Other pairs that do not both pass typeof value == 'object',
	                // equivalence is determined by ==.
	            } else if (isString(actual) && isString(expected) && actual !== expected) {
	                return false;
	            } else if (typeof actual !== 'object' && typeof expected !== 'object') {
	                return actual === expected;

	                // 7.5 For all other Object pairs, including Array objects, equivalence is
	                // determined by having the same number of owned properties (as verified
	                // with Object.prototype.hasOwnProperty.call), the same set of keys
	                // (although not necessarily the same order), equivalent values for every
	                // corresponding key, and an identical 'prototype' property. Note: this
	                // accounts for both named and indexed properties on Arrays.
	            } else {
	                return objEquiv(actual, expected);
	            }
	        }


	        function objEquiv(a, b) {
	            var key;
	            if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) {
	                return false;
	            }
	            // an identical 'prototype' property.
	            if (a.prototype !== b.prototype) {
	                return false;
	            }
	            //~~~I've managed to break Object.keys through screwy arguments passing.
	            //   Converting to array solves the problem.
	            if (isArguments(a)) {
	                if (!isArguments(b)) {
	                    return false;
	                }
	                a = pSlice.call(a);
	                b = pSlice.call(b);
	                return deepEqual(a, b);
	            }
	            try {
	                var ka = keys(a),
	                    kb = keys(b),
	                    i;
	                // having the same number of owned properties (keys incorporates
	                // hasOwnProperty)
	                if (ka.length !== kb.length) {
	                    return false;
	                }
	                //the same set of keys (although not necessarily the same order),
	                ka.sort();
	                kb.sort();
	                //~~~cheap key test
	                for (i = ka.length - 1; i >= 0; i--) {
	                    if (ka[i] !== kb[i]) {
	                        return false;
	                    }
	                }
	                //equivalent values for every corresponding key, and
	                //~~~possibly expensive deep test
	                for (i = ka.length - 1; i >= 0; i--) {
	                    key = ka[i];
	                    if (!deepEqual(a[key], b[key])) {
	                        return false;
	                    }
	                }
	            } catch (e) {//happens when one is a string literal and the other isn't
	                return false;
	            }
	            return true;
	        }


	        var isFunction = function (obj) {
	            return toStr.call(obj) === '[object Function]';
	        };

	        //ie hack
	        if ("undefined" !== typeof window && !isFunction(window.alert)) {
	            (function (alert) {
	                isFunction = function (obj) {
	                    return toStr.call(obj) === '[object Function]' || obj === alert;
	                };
	            }(window.alert));
	        }

	        function isObject(obj) {
	            var undef;
	            return obj !== null && typeof obj === "object";
	        }

	        function isHash(obj) {
	            var ret = isObject(obj);
	            return ret && obj.constructor === Object && !obj.nodeType && !obj.setInterval;
	        }

	        function isEmpty(object) {
	            if (isArguments(object)) {
	                return object.length === 0;
	            } else if (isObject(object)) {
	                return keys(object).length === 0;
	            } else if (isString(object) || isArray(object)) {
	                return object.length === 0;
	            }
	            return true;
	        }

	        function isBoolean(obj) {
	            return obj === true || obj === false || toStr.call(obj) === "[object Boolean]";
	        }

	        function isUndefined(obj) {
	            return typeof obj === 'undefined';
	        }

	        function isDefined(obj) {
	            return !isUndefined(obj);
	        }

	        function isUndefinedOrNull(obj) {
	            return isUndefined(obj) || isNull(obj);
	        }

	        function isNull(obj) {
	            return obj === null;
	        }


	        var isArguments = function _isArguments(object) {
	            return toStr.call(object) === '[object Arguments]';
	        };

	        if (!isArguments(arguments)) {
	            isArguments = function _isArguments(obj) {
	                return !!(obj && hasOwn.call(obj, "callee"));
	            };
	        }


	        function isInstanceOf(obj, clazz) {
	            if (isFunction(clazz)) {
	                return obj instanceof clazz;
	            } else {
	                return false;
	            }
	        }

	        function isRegExp(obj) {
	            return toStr.call(obj) === '[object RegExp]';
	        }

	        var isArray = Array.isArray || function isArray(obj) {
	            return toStr.call(obj) === "[object Array]";
	        };

	        function isDate(obj) {
	            return toStr.call(obj) === '[object Date]';
	        }

	        function isString(obj) {
	            return toStr.call(obj) === '[object String]';
	        }

	        function isNumber(obj) {
	            return toStr.call(obj) === '[object Number]';
	        }

	        function isTrue(obj) {
	            return obj === true;
	        }

	        function isFalse(obj) {
	            return obj === false;
	        }

	        function isNotNull(obj) {
	            return !isNull(obj);
	        }

	        function isEq(obj, obj2) {
	            /*jshint eqeqeq:false*/
	            return obj == obj2;
	        }

	        function isNeq(obj, obj2) {
	            /*jshint eqeqeq:false*/
	            return obj != obj2;
	        }

	        function isSeq(obj, obj2) {
	            return obj === obj2;
	        }

	        function isSneq(obj, obj2) {
	            return obj !== obj2;
	        }

	        function isIn(obj, arr) {
	            if ((isArray(arr) && Array.prototype.indexOf) || isString(arr)) {
	                return arr.indexOf(obj) > -1;
	            } else if (isArray(arr)) {
	                for (var i = 0, l = arr.length; i < l; i++) {
	                    if (isEq(obj, arr[i])) {
	                        return true;
	                    }
	                }
	            }
	            return false;
	        }

	        function isNotIn(obj, arr) {
	            return !isIn(obj, arr);
	        }

	        function isLt(obj, obj2) {
	            return obj < obj2;
	        }

	        function isLte(obj, obj2) {
	            return obj <= obj2;
	        }

	        function isGt(obj, obj2) {
	            return obj > obj2;
	        }

	        function isGte(obj, obj2) {
	            return obj >= obj2;
	        }

	        function isLike(obj, reg) {
	            if (isString(reg)) {
	                return ("" + obj).match(reg) !== null;
	            } else if (isRegExp(reg)) {
	                return reg.test(obj);
	            }
	            return false;
	        }

	        function isNotLike(obj, reg) {
	            return !isLike(obj, reg);
	        }

	        function contains(arr, obj) {
	            return isIn(obj, arr);
	        }

	        function notContains(arr, obj) {
	            return !isIn(obj, arr);
	        }

	        function containsAt(arr, obj, index) {
	            if (isArray(arr) && arr.length > index) {
	                return isEq(arr[index], obj);
	            }
	            return false;
	        }

	        function notContainsAt(arr, obj, index) {
	            if (isArray(arr)) {
	                return !isEq(arr[index], obj);
	            }
	            return false;
	        }

	        function has(obj, prop) {
	            return hasOwn.call(obj, prop);
	        }

	        function notHas(obj, prop) {
	            return !has(obj, prop);
	        }

	        function length(obj, l) {
	            if (has(obj, "length")) {
	                return obj.length === l;
	            }
	            return false;
	        }

	        function notLength(obj, l) {
	            if (has(obj, "length")) {
	                return obj.length !== l;
	            }
	            return false;
	        }

	        var isa = {
	            isFunction: isFunction,
	            isObject: isObject,
	            isEmpty: isEmpty,
	            isHash: isHash,
	            isNumber: isNumber,
	            isString: isString,
	            isDate: isDate,
	            isArray: isArray,
	            isBoolean: isBoolean,
	            isUndefined: isUndefined,
	            isDefined: isDefined,
	            isUndefinedOrNull: isUndefinedOrNull,
	            isNull: isNull,
	            isArguments: isArguments,
	            instanceOf: isInstanceOf,
	            isRegExp: isRegExp,
	            deepEqual: deepEqual,
	            isTrue: isTrue,
	            isFalse: isFalse,
	            isNotNull: isNotNull,
	            isEq: isEq,
	            isNeq: isNeq,
	            isSeq: isSeq,
	            isSneq: isSneq,
	            isIn: isIn,
	            isNotIn: isNotIn,
	            isLt: isLt,
	            isLte: isLte,
	            isGt: isGt,
	            isGte: isGte,
	            isLike: isLike,
	            isNotLike: isNotLike,
	            contains: contains,
	            notContains: notContains,
	            has: has,
	            notHas: notHas,
	            isLength: length,
	            isNotLength: notLength,
	            containsAt: containsAt,
	            notContainsAt: notContainsAt
	        };

	        var tester = {
	            constructor: function () {
	                this._testers = [];
	            },

	            noWrap: {
	                tester: function () {
	                    var testers = this._testers;
	                    return function tester(value) {
	                        var isa = false;
	                        for (var i = 0, l = testers.length; i < l && !isa; i++) {
	                            isa = testers[i](value);
	                        }
	                        return isa;
	                    };
	                }
	            }
	        };

	        var switcher = {
	            constructor: function () {
	                this._cases = [];
	                this.__default = null;
	            },

	            def: function (val, fn) {
	                this.__default = fn;
	            },

	            noWrap: {
	                switcher: function () {
	                    var testers = this._cases, __default = this.__default;
	                    return function tester() {
	                        var handled = false, args = argsToArray(arguments), caseRet;
	                        for (var i = 0, l = testers.length; i < l && !handled; i++) {
	                            caseRet = testers[i](args);
	                            if (caseRet.length > 1) {
	                                if (caseRet[1] || caseRet[0]) {
	                                    return caseRet[1];
	                                }
	                            }
	                        }
	                        if (!handled && __default) {
	                            return  __default.apply(this, args);
	                        }
	                    };
	                }
	            }
	        };

	        function addToTester(func) {
	            tester[func] = function isaTester() {
	                this._testers.push(isa[func]);
	            };
	        }

	        function addToSwitcher(func) {
	            switcher[func] = function isaTester() {
	                var args = argsToArray(arguments, 1), isFunc = isa[func], handler, doBreak = true;
	                if (args.length <= isFunc.length - 1) {
	                    throw new TypeError("A handler must be defined when calling using switch");
	                } else {
	                    handler = args.pop();
	                    if (isBoolean(handler)) {
	                        doBreak = handler;
	                        handler = args.pop();
	                    }
	                }
	                if (!isFunction(handler)) {
	                    throw new TypeError("handler must be defined");
	                }
	                this._cases.push(function (testArgs) {
	                    if (isFunc.apply(isa, testArgs.concat(args))) {
	                        return [doBreak, handler.apply(this, testArgs)];
	                    }
	                    return [false];
	                });
	            };
	        }

	        for (var i in isa) {
	            if (hasOwn.call(isa, i)) {
	                addToSwitcher(i);
	                addToTester(i);
	            }
	        }

	        var is = extended.define(isa).expose(isa);
	        is.tester = extended.define(tester);
	        is.switcher = extended.define(switcher);
	        return is;

	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineIsa(__webpack_require__(7));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extended"], function (extended) {
	            return defineIsa(extended);
	        });
	    } else {
	        this.isExtended = defineIsa(this.extended);
	    }

	}).call(this);



/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";
	    /*global extender is, dateExtended*/

	    function defineExtended(extender) {


	        var merge = (function merger() {
	            function _merge(target, source) {
	                var name, s;
	                for (name in source) {
	                    if (source.hasOwnProperty(name)) {
	                        s = source[name];
	                        if (!(name in target) || (target[name] !== s)) {
	                            target[name] = s;
	                        }
	                    }
	                }
	                return target;
	            }

	            return function merge(obj) {
	                if (!obj) {
	                    obj = {};
	                }
	                for (var i = 1, l = arguments.length; i < l; i++) {
	                    _merge(obj, arguments[i]);
	                }
	                return obj; // Object
	            };
	        }());

	        function getExtended() {

	            var loaded = {};


	            //getInitial instance;
	            var extended = extender.define();
	            extended.expose({
	                register: function register(alias, extendWith) {
	                    if (!extendWith) {
	                        extendWith = alias;
	                        alias = null;
	                    }
	                    var type = typeof extendWith;
	                    if (alias) {
	                        extended[alias] = extendWith;
	                    } else if (extendWith && type === "function") {
	                        extended.extend(extendWith);
	                    } else if (type === "object") {
	                        extended.expose(extendWith);
	                    } else {
	                        throw new TypeError("extended.register must be called with an extender function");
	                    }
	                    return extended;
	                },

	                define: function () {
	                    return extender.define.apply(extender, arguments);
	                }
	            });

	            return extended;
	        }

	        function extended() {
	            return getExtended();
	        }

	        extended.define = function define() {
	            return extender.define.apply(extender, arguments);
	        };

	        return extended;
	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineExtended(__webpack_require__(8));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extender"], function (extender) {
	            return defineExtended(extender);
	        });
	    } else {
	        this.extended = defineExtended(this.extender);
	    }

	}).call(this);








/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    /*jshint strict:false*/


	    /**
	     *
	     * @projectName extender
	     * @github http://github.com/doug-martin/extender
	     * @header
	     * [![build status](https://secure.travis-ci.org/doug-martin/extender.png)](http://travis-ci.org/doug-martin/extender)
	     * # Extender
	     *
	     * `extender` is a library that helps in making chainable APIs, by creating a function that accepts different values and returns an object decorated with functions based on the type.
	     *
	     * ## Why Is Extender Different?
	     *
	     * Extender is different than normal chaining because is does more than return `this`. It decorates your values in a type safe manner.
	     *
	     * For example if you return an array from a string based method then the returned value will be decorated with array methods and not the string methods. This allow you as the developer to focus on your API and not worrying about how to properly build and connect your API.
	     *
	     *
	     * ## Installation
	     *
	     * ```
	     * npm install extender
	     * ```
	     *
	     * Or [download the source](https://raw.github.com/doug-martin/extender/master/extender.js) ([minified](https://raw.github.com/doug-martin/extender/master/extender-min.js))
	     *
	     * **Note** `extender` depends on [`declare.js`](http://doug-martin.github.com/declare.js/).
	     *
	     * ### Requirejs
	     *
	     * To use with requirejs place the `extend` source in the root scripts directory
	     *
	     * ```javascript
	     *
	     * define(["extender"], function(extender){
	     * });
	     *
	     * ```
	     *
	     *
	     * ## Usage
	     *
	     * **`extender.define(tester, decorations)`**
	     *
	     * To create your own extender call the `extender.define` function.
	     *
	     * This function accepts an optional tester which is used to determine a value should be decorated with the specified `decorations`
	     *
	     * ```javascript
	     * function isString(obj) {
	     *     return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
	     * }
	     *
	     *
	     * var myExtender = extender.define(isString, {
	     *		multiply: function (str, times) {
	     *			var ret = str;
	     *			for (var i = 1; i < times; i++) {
	     *				ret += str;
	     *			}
	     *			return ret;
	     *		},
	     *		toArray: function (str, delim) {
	     *			delim = delim || "";
	     *			return str.split(delim);
	     *		}
	     *	});
	     *
	     * myExtender("hello").multiply(2).value(); //hellohello
	     *
	     * ```
	     *
	     * If you do not specify a tester function and just pass in an object of `functions` then all values passed in will be decorated with methods.
	     *
	     * ```javascript
	     *
	     * function isUndefined(obj) {
	     *     var undef;
	     *     return obj === undef;
	     * }
	     *
	     * function isUndefinedOrNull(obj) {
	     *	var undef;
	     *     return obj === undef || obj === null;
	     * }
	     *
	     * function isArray(obj) {
	     *     return Object.prototype.toString.call(obj) === "[object Array]";
	     * }
	     *
	     * function isBoolean(obj) {
	     *     var undef, type = typeof obj;
	     *     return !isUndefinedOrNull(obj) && type === "boolean" || type === "Boolean";
	     * }
	     *
	     * function isString(obj) {
	     *     return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
	     * }
	     *
	     * var myExtender = extender.define({
	     *	isUndefined : isUndefined,
	     *	isUndefinedOrNull : isUndefinedOrNull,
	     *	isArray : isArray,
	     *	isBoolean : isBoolean,
	     *	isString : isString
	     * });
	     *
	     * ```
	     *
	     * To use
	     *
	     * ```
	     * var undef;
	     * myExtender("hello").isUndefined().value(); //false
	     * myExtender(undef).isUndefined().value(); //true
	     * ```
	     *
	     * You can also chain extenders so that they accept multiple types and decorates accordingly.
	     *
	     * ```javascript
	     * myExtender
	     *     .define(isArray, {
	     *		pluck: function (arr, m) {
	     *			var ret = [];
	     *			for (var i = 0, l = arr.length; i < l; i++) {
	     *				ret.push(arr[i][m]);
	     *			}
	     *			return ret;
	     *		}
	     *	})
	     *     .define(isBoolean, {
	     *		invert: function (val) {
	     *			return !val;
	     *		}
	     *	});
	     *
	     * myExtender([{a: "a"},{a: "b"},{a: "c"}]).pluck("a").value(); //["a", "b", "c"]
	     * myExtender("I love javascript!").toArray(/\s+/).pluck("0"); //["I", "l", "j"]
	     *
	     * ```
	     *
	     * Notice that we reuse the same extender as defined above.
	     *
	     * **Return Values**
	     *
	     * When creating an extender if you return a value from one of the decoration functions then that value will also be decorated. If you do not return any values then the extender will be returned.
	     *
	     * **Default decoration methods**
	     *
	     * By default every value passed into an extender is decorated with the following methods.
	     *
	     * * `value` : The value this extender represents.
	     * * `eq(otherValue)` : Tests strict equality of the currently represented value to the `otherValue`
	     * * `neq(oterValue)` : Tests strict inequality of the currently represented value.
	     * * `print` : logs the current value to the console.
	     *
	     * **Extender initialization**
	     *
	     * When creating an extender you can also specify a constructor which will be invoked with the current value.
	     *
	     * ```javascript
	     * myExtender.define(isString, {
	     *	constructor : function(val){
	     *     //set our value to the string trimmed
	     *		this._value = val.trimRight().trimLeft();
	     *	}
	     * });
	     * ```
	     *
	     * **`noWrap`**
	     *
	     * `extender` also allows you to specify methods that should not have the value wrapped providing a cleaner exit function other than `value()`.
	     *
	     * For example suppose you have an API that allows you to build a validator, rather than forcing the user to invoke the `value` method you could add a method called `validator` which makes more syntactic sense.
	     *
	     * ```
	     *
	     * var myValidator = extender.define({
	     *     //chainable validation methods
	     *     //...
	     *     //end chainable validation methods
	     *
	     *     noWrap : {
	     *         validator : function(){
	     *             //return your validator
	     *         }
	     *     }
	     * });
	     *
	     * myValidator().isNotNull().isEmailAddress().validator(); //now you dont need to call .value()
	     *
	     *
	     * ```
	     * **`extender.extend(extendr)`**
	     *
	     * You may also compose extenders through the use of `extender.extend(extender)`, which will return an entirely new extender that is the composition of extenders.
	     *
	     * Suppose you have the following two extenders.
	     *
	     * ```javascript
	     * var myExtender = extender
	     *        .define({
	     *            isFunction: is.function,
	     *            isNumber: is.number,
	     *            isString: is.string,
	     *            isDate: is.date,
	     *            isArray: is.array,
	     *            isBoolean: is.boolean,
	     *            isUndefined: is.undefined,
	     *            isDefined: is.defined,
	     *            isUndefinedOrNull: is.undefinedOrNull,
	     *            isNull: is.null,
	     *            isArguments: is.arguments,
	     *            isInstanceOf: is.instanceOf,
	     *            isRegExp: is.regExp
	     *        });
	     * var myExtender2 = extender.define(is.array, {
	     *     pluck: function (arr, m) {
	     *         var ret = [];
	     *         for (var i = 0, l = arr.length; i < l; i++) {
	     *             ret.push(arr[i][m]);
	     *         }
	     *         return ret;
	     *     },
	     *
	     *     noWrap: {
	     *         pluckPlain: function (arr, m) {
	     *             var ret = [];
	     *             for (var i = 0, l = arr.length; i < l; i++) {
	     *                 ret.push(arr[i][m]);
	     *             }
	     *             return ret;
	     *         }
	     *     }
	     * });
	     *
	     *
	     * ```
	     *
	     * And you do not want to alter either of them but instead what to create a third that is the union of the two.
	     *
	     *
	     * ```javascript
	     * var composed = extender.extend(myExtender).extend(myExtender2);
	     * ```
	     * So now you can use the new extender with the joined functionality if `myExtender` and `myExtender2`.
	     *
	     * ```javascript
	     * var extended = composed([
	     *      {a: "a"},
	     *      {a: "b"},
	     *      {a: "c"}
	     * ]);
	     * extended.isArray().value(); //true
	     * extended.pluck("a").value(); // ["a", "b", "c"]);
	     *
	     * ```
	     *
	     * **Note** `myExtender` and `myExtender2` will **NOT** be altered.
	     *
	     * **`extender.expose(methods)`**
	     *
	     * The `expose` method allows you to add methods to your extender that are not wrapped or automatically chained by exposing them on the extender directly.
	     *
	     * ```
	     * var isMethods = {
	     *      isFunction: is.function,
	     *      isNumber: is.number,
	     *      isString: is.string,
	     *      isDate: is.date,
	     *      isArray: is.array,
	     *      isBoolean: is.boolean,
	     *      isUndefined: is.undefined,
	     *      isDefined: is.defined,
	     *      isUndefinedOrNull: is.undefinedOrNull,
	     *      isNull: is.null,
	     *      isArguments: is.arguments,
	     *      isInstanceOf: is.instanceOf,
	     *      isRegExp: is.regExp
	     * };
	     *
	     * var myExtender = extender.define(isMethods).expose(isMethods);
	     *
	     * myExtender.isArray([]); //true
	     * myExtender([]).isArray([]).value(); //true
	     *
	     * ```
	     *
	     *
	     * **Using `instanceof`**
	     *
	     * When using extenders you can test if a value is an `instanceof` of an extender by using the instanceof operator.
	     *
	     * ```javascript
	     * var str = myExtender("hello");
	     *
	     * str instanceof myExtender; //true
	     * ```
	     *
	     * ## Examples
	     *
	     * To see more examples click [here](https://github.com/doug-martin/extender/tree/master/examples)
	     */
	    function defineExtender(declare) {


	        var slice = Array.prototype.slice, undef;

	        function indexOf(arr, item) {
	            if (arr && arr.length) {
	                for (var i = 0, l = arr.length; i < l; i++) {
	                    if (arr[i] === item) {
	                        return i;
	                    }
	                }
	            }
	            return -1;
	        }

	        function isArray(obj) {
	            return Object.prototype.toString.call(obj) === "[object Array]";
	        }

	        var merge = (function merger() {
	            function _merge(target, source, exclude) {
	                var name, s;
	                for (name in source) {
	                    if (source.hasOwnProperty(name) && indexOf(exclude, name) === -1) {
	                        s = source[name];
	                        if (!(name in target) || (target[name] !== s)) {
	                            target[name] = s;
	                        }
	                    }
	                }
	                return target;
	            }

	            return function merge(obj) {
	                if (!obj) {
	                    obj = {};
	                }
	                var l = arguments.length;
	                var exclude = arguments[arguments.length - 1];
	                if (isArray(exclude)) {
	                    l--;
	                } else {
	                    exclude = [];
	                }
	                for (var i = 1; i < l; i++) {
	                    _merge(obj, arguments[i], exclude);
	                }
	                return obj; // Object
	            };
	        }());


	        function extender(supers) {
	            supers = supers || [];
	            var Base = declare({
	                instance: {
	                    constructor: function (value) {
	                        this._value = value;
	                    },

	                    value: function () {
	                        return this._value;
	                    },

	                    eq: function eq(val) {
	                        return this["__extender__"](this._value === val);
	                    },

	                    neq: function neq(other) {
	                        return this["__extender__"](this._value !== other);
	                    },
	                    print: function () {
	                        console.log(this._value);
	                        return this;
	                    }
	                }
	            }), defined = [];

	            function addMethod(proto, name, func) {
	                if ("function" !== typeof func) {
	                    throw new TypeError("when extending type you must provide a function");
	                }
	                var extendedMethod;
	                if (name === "constructor") {
	                    extendedMethod = function () {
	                        this._super(arguments);
	                        func.apply(this, arguments);
	                    };
	                } else {
	                    extendedMethod = function extendedMethod() {
	                        var args = slice.call(arguments);
	                        args.unshift(this._value);
	                        var ret = func.apply(this, args);
	                        return ret !== undef ? this["__extender__"](ret) : this;
	                    };
	                }
	                proto[name] = extendedMethod;
	            }

	            function addNoWrapMethod(proto, name, func) {
	                if ("function" !== typeof func) {
	                    throw new TypeError("when extending type you must provide a function");
	                }
	                var extendedMethod;
	                if (name === "constructor") {
	                    extendedMethod = function () {
	                        this._super(arguments);
	                        func.apply(this, arguments);
	                    };
	                } else {
	                    extendedMethod = function extendedMethod() {
	                        var args = slice.call(arguments);
	                        args.unshift(this._value);
	                        return func.apply(this, args);
	                    };
	                }
	                proto[name] = extendedMethod;
	            }

	            function decorateProto(proto, decoration, nowrap) {
	                for (var i in decoration) {
	                    if (decoration.hasOwnProperty(i)) {
	                        if (i !== "getters" && i !== "setters") {
	                            if (i === "noWrap") {
	                                decorateProto(proto, decoration[i], true);
	                            } else if (nowrap) {
	                                addNoWrapMethod(proto, i, decoration[i]);
	                            } else {
	                                addMethod(proto, i, decoration[i]);
	                            }
	                        } else {
	                            proto[i] = decoration[i];
	                        }
	                    }
	                }
	            }

	            function _extender(obj) {
	                var ret = obj, i, l;
	                if (!(obj instanceof Base)) {
	                    var OurBase = Base;
	                    for (i = 0, l = defined.length; i < l; i++) {
	                        var definer = defined[i];
	                        if (definer[0](obj)) {
	                            OurBase = OurBase.extend({instance: definer[1]});
	                        }
	                    }
	                    ret = new OurBase(obj);
	                    ret["__extender__"] = _extender;
	                }
	                return ret;
	            }

	            function always() {
	                return true;
	            }

	            function define(tester, decorate) {
	                if (arguments.length) {
	                    if (typeof tester === "object") {
	                        decorate = tester;
	                        tester = always;
	                    }
	                    decorate = decorate || {};
	                    var proto = {};
	                    decorateProto(proto, decorate);
	                    //handle browsers like which skip over the constructor while looping
	                    if (!proto.hasOwnProperty("constructor")) {
	                        if (decorate.hasOwnProperty("constructor")) {
	                            addMethod(proto, "constructor", decorate.constructor);
	                        } else {
	                            proto.constructor = function () {
	                                this._super(arguments);
	                            };
	                        }
	                    }
	                    defined.push([tester, proto]);
	                }
	                return _extender;
	            }

	            function extend(supr) {
	                if (supr && supr.hasOwnProperty("__defined__")) {
	                    _extender["__defined__"] = defined = defined.concat(supr["__defined__"]);
	                }
	                merge(_extender, supr, ["define", "extend", "expose", "__defined__"]);
	                return _extender;
	            }

	            _extender.define = define;
	            _extender.extend = extend;
	            _extender.expose = function expose() {
	                var methods;
	                for (var i = 0, l = arguments.length; i < l; i++) {
	                    methods = arguments[i];
	                    if (typeof methods === "object") {
	                        merge(_extender, methods, ["define", "extend", "expose", "__defined__"]);
	                    }
	                }
	                return _extender;
	            };
	            _extender["__defined__"] = defined;


	            return _extender;
	        }

	        return {
	            define: function () {
	                return extender().define.apply(extender, arguments);
	            },

	            extend: function (supr) {
	                return extender().define().extend(supr);
	            }
	        };

	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineExtender(__webpack_require__(10));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["declare"], function (declare) {
	            return defineExtender(declare);
	        });
	    } else {
	        this.extender = defineExtender(this.declare);
	    }

	}).call(this);

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	(function () {

	    /**
	     * @projectName declare
	     * @github http://github.com/doug-martin/declare.js
	     * @header
	     *
	     * Declare is a library designed to allow writing object oriented code the same way in both the browser and node.js.
	     *
	     * ##Installation
	     *
	     * `npm install declare.js`
	     *
	     * Or [download the source](https://raw.github.com/doug-martin/declare.js/master/declare.js) ([minified](https://raw.github.com/doug-martin/declare.js/master/declare-min.js))
	     *
	     * ###Requirejs
	     *
	     * To use with requirejs place the `declare` source in the root scripts directory
	     *
	     * ```
	     *
	     * define(["declare"], function(declare){
	     *      return declare({
	     *          instance : {
	     *              hello : function(){
	     *                  return "world";
	     *              }
	     *          }
	     *      });
	     * });
	     *
	     * ```
	     *
	     *
	     * ##Usage
	     *
	     * declare.js provides
	     *
	     * Class methods
	     *
	     * * `as(module | object, name)` : exports the object to module or the object with the name
	     * * `mixin(mixin)` : mixes in an object but does not inherit directly from the object. **Note** this does not return a new class but changes the original class.
	     * * `extend(proto)` : extend a class with the given properties. A shortcut to `declare(Super, {})`;
	     *
	     * Instance methods
	     *
	     * * `_super(arguments)`: calls the super of the current method, you can pass in either the argments object or an array with arguments you want passed to super
	     * * `_getSuper()`: returns a this methods direct super.
	     * * `_static` : use to reference class properties and methods.
	     * * `get(prop)` : gets a property invoking the getter if it exists otherwise it just returns the named property on the object.
	     * * `set(prop, val)` : sets a property invoking the setter if it exists otherwise it just sets the named property on the object.
	     *
	     *
	     * ###Declaring a new Class
	     *
	     * Creating a new class with declare is easy!
	     *
	     * ```
	     *
	     * var Mammal = declare({
	     *      //define your instance methods and properties
	     *      instance : {
	     *
	     *          //will be called whenever a new instance is created
	     *          constructor: function(options) {
	     *              options = options || {};
	     *              this._super(arguments);
	     *              this._type = options.type || "mammal";
	     *          },
	     *
	     *          speak : function() {
	     *              return  "A mammal of type " + this._type + " sounds like";
	     *          },
	     *
	     *          //Define your getters
	     *          getters : {
	     *
	     *              //can be accessed by using the get method. (mammal.get("type"))
	     *              type : function() {
	     *                  return this._type;
	     *              }
	     *          },
	     *
	     *           //Define your setters
	     *          setters : {
	     *
	     *                //can be accessed by using the set method. (mammal.set("type", "mammalType"))
	     *              type : function(t) {
	     *                  this._type = t;
	     *              }
	     *          }
	     *      },
	     *
	     *      //Define your static methods
	     *      static : {
	     *
	     *          //Mammal.soundOff(); //"Im a mammal!!"
	     *          soundOff : function() {
	     *              return "Im a mammal!!";
	     *          }
	     *      }
	     * });
	     *
	     *
	     * ```
	     *
	     * You can use Mammal just like you would any other class.
	     *
	     * ```
	     * Mammal.soundOff("Im a mammal!!");
	     *
	     * var myMammal = new Mammal({type : "mymammal"});
	     * myMammal.speak(); // "A mammal of type mymammal sounds like"
	     * myMammal.get("type"); //"mymammal"
	     * myMammal.set("type", "mammal");
	     * myMammal.get("type"); //"mammal"
	     *
	     *
	     * ```
	     *
	     * ###Extending a class
	     *
	     * If you want to just extend a single class use the .extend method.
	     *
	     * ```
	     *
	     * var Wolf = Mammal.extend({
	     *
	     *   //define your instance method
	     *   instance: {
	     *
	     *        //You can override super constructors just be sure to call `_super`
	     *       constructor: function(options) {
	     *          options = options || {};
	     *          this._super(arguments); //call our super constructor.
	     *          this._sound = "growl";
	     *          this._color = options.color || "grey";
	     *      },
	     *
	     *      //override Mammals `speak` method by appending our own data to it.
	     *      speak : function() {
	     *          return this._super(arguments) + " a " + this._sound;
	     *      },
	     *
	     *      //add new getters for sound and color
	     *      getters : {
	     *
	     *           //new Wolf().get("type")
	     *           //notice color is read only as we did not define a setter
	     *          color : function() {
	     *              return this._color;
	     *          },
	     *
	     *          //new Wolf().get("sound")
	     *          sound : function() {
	     *              return this._sound;
	     *          }
	     *      },
	     *
	     *      setters : {
	     *
	     *          //new Wolf().set("sound", "howl")
	     *          sound : function(s) {
	     *              this._sound = s;
	     *          }
	     *      }
	     *
	     *  },
	     *
	     *  static : {
	     *
	     *      //You can override super static methods also! And you can still use _super
	     *      soundOff : function() {
	     *          //You can even call super in your statics!!!
	     *          //should return "I'm a mammal!! that growls"
	     *          return this._super(arguments) + " that growls";
	     *      }
	     *  }
	     * });
	     *
	     * Wolf.soundOff(); //Im a mammal!! that growls
	     *
	     * var myWolf = new Wolf();
	     * myWolf instanceof Mammal //true
	     * myWolf instanceof Wolf //true
	     *
	     * ```
	     *
	     * You can also extend a class by using the declare method and just pass in the super class.
	     *
	     * ```
	     * //Typical hierarchical inheritance
	     * // Mammal->Wolf->Dog
	     * var Dog = declare(Wolf, {
	     *    instance: {
	     *        constructor: function(options) {
	     *            options = options || {};
	     *            this._super(arguments);
	     *            //override Wolfs initialization of sound to woof.
	     *            this._sound = "woof";
	     *
	     *        },
	     *
	     *        speak : function() {
	     *            //Should return "A mammal of type mammal sounds like a growl thats domesticated"
	     *            return this._super(arguments) + " thats domesticated";
	     *        }
	     *    },
	     *
	     *    static : {
	     *        soundOff : function() {
	     *            //should return "I'm a mammal!! that growls but now barks"
	     *            return this._super(arguments) + " but now barks";
	     *        }
	     *    }
	     * });
	     *
	     * Dog.soundOff(); //Im a mammal!! that growls but now barks
	     *
	     * var myDog = new Dog();
	     * myDog instanceof Mammal //true
	     * myDog instanceof Wolf //true
	     * myDog instanceof Dog //true
	     *
	     *
	     * //Notice you still get the extend method.
	     *
	     * // Mammal->Wolf->Dog->Breed
	     * var Breed = Dog.extend({
	     *    instance: {
	     *
	     *        //initialize outside of constructor
	     *        _pitch : "high",
	     *
	     *        constructor: function(options) {
	     *            options = options || {};
	     *            this._super(arguments);
	     *            this.breed = options.breed || "lab";
	     *        },
	     *
	     *        speak : function() {
	     *            //Should return "A mammal of type mammal sounds like a
	     *            //growl thats domesticated with a high pitch!"
	     *            return this._super(arguments) + " with a " + this._pitch + " pitch!";
	     *        },
	     *
	     *        getters : {
	     *            pitch : function() {
	     *                return this._pitch;
	     *            }
	     *        }
	     *    },
	     *
	     *    static : {
	     *        soundOff : function() {
	     *            //should return "I'M A MAMMAL!! THAT GROWLS BUT NOW BARKS!"
	     *            return this._super(arguments).toUpperCase() + "!";
	     *        }
	     *    }
	     * });
	     *
	     *
	     * Breed.soundOff()//"IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!"
	     *
	     * var myBreed = new Breed({color : "gold", type : "lab"}),
	     * myBreed instanceof Dog //true
	     * myBreed instanceof Wolf //true
	     * myBreed instanceof Mammal //true
	     * myBreed.speak() //"A mammal of type lab sounds like a woof thats domesticated with a high pitch!"
	     * myBreed.get("type") //"lab"
	     * myBreed.get("color") //"gold"
	     * myBreed.get("sound")" //"woof"
	     * ```
	     *
	     * ###Multiple Inheritance / Mixins
	     *
	     * declare also allows the use of multiple super classes.
	     * This is useful if you have generic classes that provide functionality but shouldnt be used on their own.
	     *
	     * Lets declare a mixin that allows us to watch for property changes.
	     *
	     * ```
	     * //Notice that we set up the functions outside of declare because we can reuse them
	     *
	     * function _set(prop, val) {
	     *     //get the old value
	     *     var oldVal = this.get(prop);
	     *     //call super to actually set the property
	     *     var ret = this._super(arguments);
	     *     //call our handlers
	     *     this.__callHandlers(prop, oldVal, val);
	     *     return ret;
	     * }
	     *
	     * function _callHandlers(prop, oldVal, newVal) {
	     *    //get our handlers for the property
	     *     var handlers = this.__watchers[prop], l;
	     *     //if the handlers exist and their length does not equal 0 then we call loop through them
	     *     if (handlers && (l = handlers.length) !== 0) {
	     *         for (var i = 0; i < l; i++) {
	     *             //call the handler
	     *             handlers[i].call(null, prop, oldVal, newVal);
	     *         }
	     *     }
	     * }
	     *
	     *
	     * //the watch function
	     * function _watch(prop, handler) {
	     *     if ("function" !== typeof handler) {
	     *         //if its not a function then its an invalid handler
	     *         throw new TypeError("Invalid handler.");
	     *     }
	     *     if (!this.__watchers[prop]) {
	     *         //create the watchers if it doesnt exist
	     *         this.__watchers[prop] = [handler];
	     *     } else {
	     *         //otherwise just add it to the handlers array
	     *         this.__watchers[prop].push(handler);
	     *     }
	     * }
	     *
	     * function _unwatch(prop, handler) {
	     *     if ("function" !== typeof handler) {
	     *         throw new TypeError("Invalid handler.");
	     *     }
	     *     var handlers = this.__watchers[prop], index;
	     *     if (handlers && (index = handlers.indexOf(handler)) !== -1) {
	     *        //remove the handler if it is found
	     *         handlers.splice(index, 1);
	     *     }
	     * }
	     *
	     * declare({
	     *     instance:{
	     *         constructor:function () {
	     *             this._super(arguments);
	     *             //set up our watchers
	     *             this.__watchers = {};
	     *         },
	     *
	     *         //override the default set function so we can watch values
	     *         "set":_set,
	     *         //set up our callhandlers function
	     *         __callHandlers:_callHandlers,
	     *         //add the watch function
	     *         watch:_watch,
	     *         //add the unwatch function
	     *         unwatch:_unwatch
	     *     },
	     *
	     *     "static":{
	     *
	     *         init:function () {
	     *             this._super(arguments);
	     *             this.__watchers = {};
	     *         },
	     *         //override the default set function so we can watch values
	     *         "set":_set,
	     *         //set our callHandlers function
	     *         __callHandlers:_callHandlers,
	     *         //add the watch
	     *         watch:_watch,
	     *         //add the unwatch function
	     *         unwatch:_unwatch
	     *     }
	     * })
	     *
	     * ```
	     *
	     * Now lets use the mixin
	     *
	     * ```
	     * var WatchDog = declare([Dog, WatchMixin]);
	     *
	     * var watchDog = new WatchDog();
	     * //create our handler
	     * function watch(id, oldVal, newVal) {
	     *     console.log("watchdog's %s was %s, now %s", id, oldVal, newVal);
	     * }
	     *
	     * //watch for property changes
	     * watchDog.watch("type", watch);
	     * watchDog.watch("color", watch);
	     * watchDog.watch("sound", watch);
	     *
	     * //now set the properties each handler will be called
	     * watchDog.set("type", "newDog");
	     * watchDog.set("color", "newColor");
	     * watchDog.set("sound", "newSound");
	     *
	     *
	     * //unwatch the property changes
	     * watchDog.unwatch("type", watch);
	     * watchDog.unwatch("color", watch);
	     * watchDog.unwatch("sound", watch);
	     *
	     * //no handlers will be called this time
	     * watchDog.set("type", "newDog");
	     * watchDog.set("color", "newColor");
	     * watchDog.set("sound", "newSound");
	     *
	     *
	     * ```
	     *
	     * ###Accessing static methods and properties witin an instance.
	     *
	     * To access static properties on an instance use the `_static` property which is a reference to your constructor.
	     *
	     * For example if your in your constructor and you want to have configurable default values.
	     *
	     * ```
	     * consturctor : function constructor(opts){
	     *     this.opts = opts || {};
	     *     this._type = opts.type || this._static.DEFAULT_TYPE;
	     * }
	     * ```
	     *
	     *
	     *
	     * ###Creating a new instance of within an instance.
	     *
	     * Often times you want to create a new instance of an object within an instance. If your subclassed however you cannot return a new instance of the parent class as it will not be the right sub class. `declare` provides a way around this by setting the `_static` property on each isntance of the class.
	     *
	     * Lets add a reproduce method `Mammal`
	     *
	     * ```
	     * reproduce : function(options){
	     *     return new this._static(options);
	     * }
	     * ```
	     *
	     * Now in each subclass you can call reproduce and get the proper type.
	     *
	     * ```
	     * var myDog = new Dog();
	     * var myDogsChild = myDog.reproduce();
	     *
	     * myDogsChild instanceof Dog; //true
	     * ```
	     *
	     * ###Using the `as`
	     *
	     * `declare` also provides an `as` method which allows you to add your class to an object or if your using node.js you can pass in `module` and the class will be exported as the module.
	     *
	     * ```
	     * var animals = {};
	     *
	     * Mammal.as(animals, "Dog");
	     * Wolf.as(animals, "Wolf");
	     * Dog.as(animals, "Dog");
	     * Breed.as(animals, "Breed");
	     *
	     * var myDog = new animals.Dog();
	     *
	     * ```
	     *
	     * Or in node
	     *
	     * ```
	     * Mammal.as(exports, "Dog");
	     * Wolf.as(exports, "Wolf");
	     * Dog.as(exports, "Dog");
	     * Breed.as(exports, "Breed");
	     *
	     * ```
	     *
	     * To export a class as the `module` in node
	     *
	     * ```
	     * Mammal.as(module);
	     * ```
	     *
	     *
	     */
	    function createDeclared() {
	        var arraySlice = Array.prototype.slice, classCounter = 0, Base, forceNew = new Function();

	        var SUPER_REGEXP = /(super)/g;

	        function argsToArray(args, slice) {
	            slice = slice || 0;
	            return arraySlice.call(args, slice);
	        }

	        function isArray(obj) {
	            return Object.prototype.toString.call(obj) === "[object Array]";
	        }

	        function isObject(obj) {
	            var undef;
	            return obj !== null && obj !== undef && typeof obj === "object";
	        }

	        function isHash(obj) {
	            var ret = isObject(obj);
	            return ret && obj.constructor === Object;
	        }

	        var isArguments = function _isArguments(object) {
	            return Object.prototype.toString.call(object) === '[object Arguments]';
	        };

	        if (!isArguments(arguments)) {
	            isArguments = function _isArguments(obj) {
	                return !!(obj && obj.hasOwnProperty("callee"));
	            };
	        }

	        function indexOf(arr, item) {
	            if (arr && arr.length) {
	                for (var i = 0, l = arr.length; i < l; i++) {
	                    if (arr[i] === item) {
	                        return i;
	                    }
	                }
	            }
	            return -1;
	        }

	        function merge(target, source, exclude) {
	            var name, s;
	            for (name in source) {
	                if (source.hasOwnProperty(name) && indexOf(exclude, name) === -1) {
	                    s = source[name];
	                    if (!(name in target) || (target[name] !== s)) {
	                        target[name] = s;
	                    }
	                }
	            }
	            return target;
	        }

	        function callSuper(args, a) {
	            var meta = this.__meta,
	                supers = meta.supers,
	                l = supers.length, superMeta = meta.superMeta, pos = superMeta.pos;
	            if (l > pos) {
	                args = !args ? [] : (!isArguments(args) && !isArray(args)) ? [args] : args;
	                var name = superMeta.name, f = superMeta.f, m;
	                do {
	                    m = supers[pos][name];
	                    if ("function" === typeof m && (m = m._f || m) !== f) {
	                        superMeta.pos = 1 + pos;
	                        return m.apply(this, args);
	                    }
	                } while (l > ++pos);
	            }

	            return null;
	        }

	        function getSuper() {
	            var meta = this.__meta,
	                supers = meta.supers,
	                l = supers.length, superMeta = meta.superMeta, pos = superMeta.pos;
	            if (l > pos) {
	                var name = superMeta.name, f = superMeta.f, m;
	                do {
	                    m = supers[pos][name];
	                    if ("function" === typeof m && (m = m._f || m) !== f) {
	                        superMeta.pos = 1 + pos;
	                        return m.bind(this);
	                    }
	                } while (l > ++pos);
	            }
	            return null;
	        }

	        function getter(name) {
	            var getters = this.__getters__;
	            if (getters.hasOwnProperty(name)) {
	                return getters[name].apply(this);
	            } else {
	                return this[name];
	            }
	        }

	        function setter(name, val) {
	            var setters = this.__setters__;
	            if (isHash(name)) {
	                for (var i in name) {
	                    var prop = name[i];
	                    if (setters.hasOwnProperty(i)) {
	                        setters[name].call(this, prop);
	                    } else {
	                        this[i] = prop;
	                    }
	                }
	            } else {
	                if (setters.hasOwnProperty(name)) {
	                    return setters[name].apply(this, argsToArray(arguments, 1));
	                } else {
	                    return this[name] = val;
	                }
	            }
	        }


	        function defaultFunction() {
	            var meta = this.__meta || {},
	                supers = meta.supers,
	                l = supers.length, superMeta = meta.superMeta, pos = superMeta.pos;
	            if (l > pos) {
	                var name = superMeta.name, f = superMeta.f, m;
	                do {
	                    m = supers[pos][name];
	                    if ("function" === typeof m && (m = m._f || m) !== f) {
	                        superMeta.pos = 1 + pos;
	                        return m.apply(this, arguments);
	                    }
	                } while (l > ++pos);
	            }
	            return null;
	        }


	        function functionWrapper(f, name) {
	            if (f.toString().match(SUPER_REGEXP)) {
	                var wrapper = function wrapper() {
	                    var ret, meta = this.__meta || {};
	                    var orig = meta.superMeta;
	                    meta.superMeta = {f: f, pos: 0, name: name};
	                    switch (arguments.length) {
	                    case 0:
	                        ret = f.call(this);
	                        break;
	                    case 1:
	                        ret = f.call(this, arguments[0]);
	                        break;
	                    case 2:
	                        ret = f.call(this, arguments[0], arguments[1]);
	                        break;

	                    case 3:
	                        ret = f.call(this, arguments[0], arguments[1], arguments[2]);
	                        break;
	                    default:
	                        ret = f.apply(this, arguments);
	                    }
	                    meta.superMeta = orig;
	                    return ret;
	                };
	                wrapper._f = f;
	                return wrapper;
	            } else {
	                f._f = f;
	                return f;
	            }
	        }

	        function defineMixinProps(child, proto) {

	            var operations = proto.setters || {}, __setters = child.__setters__, __getters = child.__getters__;
	            for (var i in operations) {
	                if (!__setters.hasOwnProperty(i)) {  //make sure that the setter isnt already there
	                    __setters[i] = operations[i];
	                }
	            }
	            operations = proto.getters || {};
	            for (i in operations) {
	                if (!__getters.hasOwnProperty(i)) {  //make sure that the setter isnt already there
	                    __getters[i] = operations[i];
	                }
	            }
	            for (var j in proto) {
	                if (j !== "getters" && j !== "setters") {
	                    var p = proto[j];
	                    if ("function" === typeof p) {
	                        if (!child.hasOwnProperty(j)) {
	                            child[j] = functionWrapper(defaultFunction, j);
	                        }
	                    } else {
	                        child[j] = p;
	                    }
	                }
	            }
	        }

	        function mixin() {
	            var args = argsToArray(arguments), l = args.length;
	            var child = this.prototype;
	            var childMeta = child.__meta, thisMeta = this.__meta, bases = child.__meta.bases, staticBases = bases.slice(),
	                staticSupers = thisMeta.supers || [], supers = childMeta.supers || [];
	            for (var i = 0; i < l; i++) {
	                var m = args[i], mProto = m.prototype;
	                var protoMeta = mProto.__meta, meta = m.__meta;
	                !protoMeta && (protoMeta = (mProto.__meta = {proto: mProto || {}}));
	                !meta && (meta = (m.__meta = {proto: m.__proto__ || {}}));
	                defineMixinProps(child, protoMeta.proto || {});
	                defineMixinProps(this, meta.proto || {});
	                //copy the bases for static,

	                mixinSupers(m.prototype, supers, bases);
	                mixinSupers(m, staticSupers, staticBases);
	            }
	            return this;
	        }

	        function mixinSupers(sup, arr, bases) {
	            var meta = sup.__meta;
	            !meta && (meta = (sup.__meta = {}));
	            var unique = sup.__meta.unique;
	            !unique && (meta.unique = "declare" + ++classCounter);
	            //check it we already have this super mixed into our prototype chain
	            //if true then we have already looped their supers!
	            if (indexOf(bases, unique) === -1) {
	                //add their id to our bases
	                bases.push(unique);
	                var supers = sup.__meta.supers || [], i = supers.length - 1 || 0;
	                while (i >= 0) {
	                    mixinSupers(supers[i--], arr, bases);
	                }
	                arr.unshift(sup);
	            }
	        }

	        function defineProps(child, proto) {
	            var operations = proto.setters,
	                __setters = child.__setters__,
	                __getters = child.__getters__;
	            if (operations) {
	                for (var i in operations) {
	                    __setters[i] = operations[i];
	                }
	            }
	            operations = proto.getters || {};
	            if (operations) {
	                for (i in operations) {
	                    __getters[i] = operations[i];
	                }
	            }
	            for (i in proto) {
	                if (i != "getters" && i != "setters") {
	                    var f = proto[i];
	                    if ("function" === typeof f) {
	                        var meta = f.__meta || {};
	                        if (!meta.isConstructor) {
	                            child[i] = functionWrapper(f, i);
	                        } else {
	                            child[i] = f;
	                        }
	                    } else {
	                        child[i] = f;
	                    }
	                }
	            }

	        }

	        function _export(obj, name) {
	            if (obj && name) {
	                obj[name] = this;
	            } else {
	                obj.exports = obj = this;
	            }
	            return this;
	        }

	        function extend(proto) {
	            return declare(this, proto);
	        }

	        function getNew(ctor) {
	            // create object with correct prototype using a do-nothing
	            // constructor
	            forceNew.prototype = ctor.prototype;
	            var t = new forceNew();
	            forceNew.prototype = null;	// clean up
	            return t;
	        }


	        function __declare(child, sup, proto) {
	            var childProto = {}, supers = [];
	            var unique = "declare" + ++classCounter, bases = [], staticBases = [];
	            var instanceSupers = [], staticSupers = [];
	            var meta = {
	                supers: instanceSupers,
	                unique: unique,
	                bases: bases,
	                superMeta: {
	                    f: null,
	                    pos: 0,
	                    name: null
	                }
	            };
	            var childMeta = {
	                supers: staticSupers,
	                unique: unique,
	                bases: staticBases,
	                isConstructor: true,
	                superMeta: {
	                    f: null,
	                    pos: 0,
	                    name: null
	                }
	            };

	            if (isHash(sup) && !proto) {
	                proto = sup;
	                sup = Base;
	            }

	            if ("function" === typeof sup || isArray(sup)) {
	                supers = isArray(sup) ? sup : [sup];
	                sup = supers.shift();
	                child.__meta = childMeta;
	                childProto = getNew(sup);
	                childProto.__meta = meta;
	                childProto.__getters__ = merge({}, childProto.__getters__ || {});
	                childProto.__setters__ = merge({}, childProto.__setters__ || {});
	                child.__getters__ = merge({}, child.__getters__ || {});
	                child.__setters__ = merge({}, child.__setters__ || {});
	                mixinSupers(sup.prototype, instanceSupers, bases);
	                mixinSupers(sup, staticSupers, staticBases);
	            } else {
	                child.__meta = childMeta;
	                childProto.__meta = meta;
	                childProto.__getters__ = childProto.__getters__ || {};
	                childProto.__setters__ = childProto.__setters__ || {};
	                child.__getters__ = child.__getters__ || {};
	                child.__setters__ = child.__setters__ || {};
	            }
	            child.prototype = childProto;
	            if (proto) {
	                var instance = meta.proto = proto.instance || {};
	                var stat = childMeta.proto = proto.static || {};
	                stat.init = stat.init || defaultFunction;
	                defineProps(childProto, instance);
	                defineProps(child, stat);
	                if (!instance.hasOwnProperty("constructor")) {
	                    childProto.constructor = instance.constructor = functionWrapper(defaultFunction, "constructor");
	                } else {
	                    childProto.constructor = functionWrapper(instance.constructor, "constructor");
	                }
	            } else {
	                meta.proto = {};
	                childMeta.proto = {};
	                child.init = functionWrapper(defaultFunction, "init");
	                childProto.constructor = functionWrapper(defaultFunction, "constructor");
	            }
	            if (supers.length) {
	                mixin.apply(child, supers);
	            }
	            if (sup) {
	                //do this so we mixin our super methods directly but do not ov
	                merge(child, merge(merge({}, sup), child));
	            }
	            childProto._super = child._super = callSuper;
	            childProto._getSuper = child._getSuper = getSuper;
	            childProto._static = child;
	        }

	        function declare(sup, proto) {
	            function declared() {
	                switch (arguments.length) {
	                case 0:
	                    this.constructor.call(this);
	                    break;
	                case 1:
	                    this.constructor.call(this, arguments[0]);
	                    break;
	                case 2:
	                    this.constructor.call(this, arguments[0], arguments[1]);
	                    break;
	                case 3:
	                    this.constructor.call(this, arguments[0], arguments[1], arguments[2]);
	                    break;
	                default:
	                    this.constructor.apply(this, arguments);
	                }
	            }

	            __declare(declared, sup, proto);
	            return declared.init() || declared;
	        }

	        function singleton(sup, proto) {
	            var retInstance;

	            function declaredSingleton() {
	                if (!retInstance) {
	                    this.constructor.apply(this, arguments);
	                    retInstance = this;
	                }
	                return retInstance;
	            }

	            __declare(declaredSingleton, sup, proto);
	            return  declaredSingleton.init() || declaredSingleton;
	        }

	        Base = declare({
	            instance: {
	                "get": getter,
	                "set": setter
	            },

	            "static": {
	                "get": getter,
	                "set": setter,
	                mixin: mixin,
	                extend: extend,
	                as: _export
	            }
	        });

	        declare.singleton = singleton;
	        return declare;
	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = createDeclared();
	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(createDeclared);
	    } else {
	        this.declare = createDeclared();
	    }
	}());





/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";
	    /*global extended isExtended*/

	    function defineObject(extended, is, arr) {

	        var deepEqual = is.deepEqual,
	            isString = is.isString,
	            isHash = is.isHash,
	            difference = arr.difference,
	            hasOwn = Object.prototype.hasOwnProperty,
	            isFunction = is.isFunction;

	        function _merge(target, source) {
	            var name, s;
	            for (name in source) {
	                if (hasOwn.call(source, name)) {
	                    s = source[name];
	                    if (!(name in target) || (target[name] !== s)) {
	                        target[name] = s;
	                    }
	                }
	            }
	            return target;
	        }

	        function _deepMerge(target, source) {
	            var name, s, t;
	            for (name in source) {
	                if (hasOwn.call(source, name)) {
	                    s = source[name];
	                    t = target[name];
	                    if (!deepEqual(t, s)) {
	                        if (isHash(t) && isHash(s)) {
	                            target[name] = _deepMerge(t, s);
	                        } else if (isHash(s)) {
	                            target[name] = _deepMerge({}, s);
	                        } else {
	                            target[name] = s;
	                        }
	                    }
	                }
	            }
	            return target;
	        }


	        function merge(obj) {
	            if (!obj) {
	                obj = {};
	            }
	            for (var i = 1, l = arguments.length; i < l; i++) {
	                _merge(obj, arguments[i]);
	            }
	            return obj; // Object
	        }

	        function deepMerge(obj) {
	            if (!obj) {
	                obj = {};
	            }
	            for (var i = 1, l = arguments.length; i < l; i++) {
	                _deepMerge(obj, arguments[i]);
	            }
	            return obj; // Object
	        }


	        function extend(parent, child) {
	            var proto = parent.prototype || parent;
	            merge(proto, child);
	            return parent;
	        }

	        function forEach(hash, iterator, scope) {
	            if (!isHash(hash) || !isFunction(iterator)) {
	                throw new TypeError();
	            }
	            var objKeys = keys(hash), key;
	            for (var i = 0, len = objKeys.length; i < len; ++i) {
	                key = objKeys[i];
	                iterator.call(scope || hash, hash[key], key, hash);
	            }
	            return hash;
	        }

	        function filter(hash, iterator, scope) {
	            if (!isHash(hash) || !isFunction(iterator)) {
	                throw new TypeError();
	            }
	            var objKeys = keys(hash), key, value, ret = {};
	            for (var i = 0, len = objKeys.length; i < len; ++i) {
	                key = objKeys[i];
	                value = hash[key];
	                if (iterator.call(scope || hash, value, key, hash)) {
	                    ret[key] = value;
	                }
	            }
	            return ret;
	        }

	        function values(hash) {
	            if (!isHash(hash)) {
	                throw new TypeError();
	            }
	            var objKeys = keys(hash), ret = [];
	            for (var i = 0, len = objKeys.length; i < len; ++i) {
	                ret.push(hash[objKeys[i]]);
	            }
	            return ret;
	        }


	        function keys(hash) {
	            if (!isHash(hash)) {
	                throw new TypeError();
	            }
	            var ret = [];
	            for (var i in hash) {
	                if (hasOwn.call(hash, i)) {
	                    ret.push(i);
	                }
	            }
	            return ret;
	        }

	        function invert(hash) {
	            if (!isHash(hash)) {
	                throw new TypeError();
	            }
	            var objKeys = keys(hash), key, ret = {};
	            for (var i = 0, len = objKeys.length; i < len; ++i) {
	                key = objKeys[i];
	                ret[hash[key]] = key;
	            }
	            return ret;
	        }

	        function toArray(hash) {
	            if (!isHash(hash)) {
	                throw new TypeError();
	            }
	            var objKeys = keys(hash), key, ret = [];
	            for (var i = 0, len = objKeys.length; i < len; ++i) {
	                key = objKeys[i];
	                ret.push([key, hash[key]]);
	            }
	            return ret;
	        }

	        function omit(hash, omitted) {
	            if (!isHash(hash)) {
	                throw new TypeError();
	            }
	            if (isString(omitted)) {
	                omitted = [omitted];
	            }
	            var objKeys = difference(keys(hash), omitted), key, ret = {};
	            for (var i = 0, len = objKeys.length; i < len; ++i) {
	                key = objKeys[i];
	                ret[key] = hash[key];
	            }
	            return ret;
	        }

	        var hash = {
	            forEach: forEach,
	            filter: filter,
	            invert: invert,
	            values: values,
	            toArray: toArray,
	            keys: keys,
	            omit: omit
	        };


	        var obj = {
	            extend: extend,
	            merge: merge,
	            deepMerge: deepMerge,
	            omit: omit
	        };

	        var ret = extended.define(is.isObject, obj).define(isHash, hash).define(is.isFunction, {extend: extend}).expose({hash: hash}).expose(obj);
	        var orig = ret.extend;
	        ret.extend = function __extend() {
	            if (arguments.length === 1) {
	                return orig.extend.apply(ret, arguments);
	            } else {
	                extend.apply(null, arguments);
	            }
	        };
	        return ret;

	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineObject(__webpack_require__(7), __webpack_require__(6), __webpack_require__(13));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extended", "is-extended", "array-extended"], function (extended, is, array) {
	            return defineObject(extended, is, array);
	        });
	    } else {
	        this.objectExtended = defineObject(this.extended, this.isExtended, this.arrayExtended);
	    }

	}).call(this);








/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";
	    /*global define*/

	    function defineArray(extended, is, args) {

	        var isString = is.isString,
	            isArray = Array.isArray || is.isArray,
	            isDate = is.isDate,
	            floor = Math.floor,
	            abs = Math.abs,
	            mathMax = Math.max,
	            mathMin = Math.min,
	            arrayProto = Array.prototype,
	            arrayIndexOf = arrayProto.indexOf,
	            arrayForEach = arrayProto.forEach,
	            arrayMap = arrayProto.map,
	            arrayReduce = arrayProto.reduce,
	            arrayReduceRight = arrayProto.reduceRight,
	            arrayFilter = arrayProto.filter,
	            arrayEvery = arrayProto.every,
	            arraySome = arrayProto.some,
	            argsToArray = args.argsToArray;


	        function cross(num, cros) {
	            return reduceRight(cros, function (a, b) {
	                if (!isArray(b)) {
	                    b = [b];
	                }
	                b.unshift(num);
	                a.unshift(b);
	                return a;
	            }, []);
	        }

	        function permute(num, cross, length) {
	            var ret = [];
	            for (var i = 0; i < cross.length; i++) {
	                ret.push([num].concat(rotate(cross, i)).slice(0, length));
	            }
	            return ret;
	        }


	        function intersection(a, b) {
	            var ret = [], aOne, i = -1, l;
	            l = a.length;
	            while (++i < l) {
	                aOne = a[i];
	                if (indexOf(b, aOne) !== -1) {
	                    ret.push(aOne);
	                }
	            }
	            return ret;
	        }


	        var _sort = (function () {

	            var isAll = function (arr, test) {
	                return every(arr, test);
	            };

	            var defaultCmp = function (a, b) {
	                return a - b;
	            };

	            var dateSort = function (a, b) {
	                return a.getTime() - b.getTime();
	            };

	            return function _sort(arr, property) {
	                var ret = [];
	                if (isArray(arr)) {
	                    ret = arr.slice();
	                    if (property) {
	                        if (typeof property === "function") {
	                            ret.sort(property);
	                        } else {
	                            ret.sort(function (a, b) {
	                                var aProp = a[property], bProp = b[property];
	                                if (isString(aProp) && isString(bProp)) {
	                                    return aProp > bProp ? 1 : aProp < bProp ? -1 : 0;
	                                } else if (isDate(aProp) && isDate(bProp)) {
	                                    return aProp.getTime() - bProp.getTime();
	                                } else {
	                                    return aProp - bProp;
	                                }
	                            });
	                        }
	                    } else {
	                        if (isAll(ret, isString)) {
	                            ret.sort();
	                        } else if (isAll(ret, isDate)) {
	                            ret.sort(dateSort);
	                        } else {
	                            ret.sort(defaultCmp);
	                        }
	                    }
	                }
	                return ret;
	            };

	        })();

	        function indexOf(arr, searchElement, from) {
	            var index = (from || 0) - 1,
	                length = arr.length;
	            while (++index < length) {
	                if (arr[index] === searchElement) {
	                    return index;
	                }
	            }
	            return -1;
	        }

	        function lastIndexOf(arr, searchElement, from) {
	            if (!isArray(arr)) {
	                throw new TypeError();
	            }

	            var t = Object(arr);
	            var len = t.length >>> 0;
	            if (len === 0) {
	                return -1;
	            }

	            var n = len;
	            if (arguments.length > 2) {
	                n = Number(arguments[2]);
	                if (n !== n) {
	                    n = 0;
	                } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
	                    n = (n > 0 || -1) * floor(abs(n));
	                }
	            }

	            var k = n >= 0 ? mathMin(n, len - 1) : len - abs(n);

	            for (; k >= 0; k--) {
	                if (k in t && t[k] === searchElement) {
	                    return k;
	                }
	            }
	            return -1;
	        }

	        function filter(arr, iterator, scope) {
	            if (arr && arrayFilter && arrayFilter === arr.filter) {
	                return arr.filter(iterator, scope);
	            }
	            if (!isArray(arr) || typeof iterator !== "function") {
	                throw new TypeError();
	            }

	            var t = Object(arr);
	            var len = t.length >>> 0;
	            var res = [];
	            for (var i = 0; i < len; i++) {
	                if (i in t) {
	                    var val = t[i]; // in case fun mutates this
	                    if (iterator.call(scope, val, i, t)) {
	                        res.push(val);
	                    }
	                }
	            }
	            return res;
	        }

	        function forEach(arr, iterator, scope) {
	            if (!isArray(arr) || typeof iterator !== "function") {
	                throw new TypeError();
	            }
	            if (arr && arrayForEach && arrayForEach === arr.forEach) {
	                arr.forEach(iterator, scope);
	                return arr;
	            }
	            for (var i = 0, len = arr.length; i < len; ++i) {
	                iterator.call(scope || arr, arr[i], i, arr);
	            }

	            return arr;
	        }

	        function every(arr, iterator, scope) {
	            if (arr && arrayEvery && arrayEvery === arr.every) {
	                return arr.every(iterator, scope);
	            }
	            if (!isArray(arr) || typeof iterator !== "function") {
	                throw new TypeError();
	            }
	            var t = Object(arr);
	            var len = t.length >>> 0;
	            for (var i = 0; i < len; i++) {
	                if (i in t && !iterator.call(scope, t[i], i, t)) {
	                    return false;
	                }
	            }
	            return true;
	        }

	        function some(arr, iterator, scope) {
	            if (arr && arraySome && arraySome === arr.some) {
	                return arr.some(iterator, scope);
	            }
	            if (!isArray(arr) || typeof iterator !== "function") {
	                throw new TypeError();
	            }
	            var t = Object(arr);
	            var len = t.length >>> 0;
	            for (var i = 0; i < len; i++) {
	                if (i in t && iterator.call(scope, t[i], i, t)) {
	                    return true;
	                }
	            }
	            return false;
	        }

	        function map(arr, iterator, scope) {
	            if (arr && arrayMap && arrayMap === arr.map) {
	                return arr.map(iterator, scope);
	            }
	            if (!isArray(arr) || typeof iterator !== "function") {
	                throw new TypeError();
	            }

	            var t = Object(arr);
	            var len = t.length >>> 0;
	            var res = [];
	            for (var i = 0; i < len; i++) {
	                if (i in t) {
	                    res.push(iterator.call(scope, t[i], i, t));
	                }
	            }
	            return res;
	        }

	        function reduce(arr, accumulator, curr) {
	            var initial = arguments.length > 2;
	            if (arr && arrayReduce && arrayReduce === arr.reduce) {
	                return initial ? arr.reduce(accumulator, curr) : arr.reduce(accumulator);
	            }
	            if (!isArray(arr) || typeof accumulator !== "function") {
	                throw new TypeError();
	            }
	            var i = 0, l = arr.length >> 0;
	            if (arguments.length < 3) {
	                if (l === 0) {
	                    throw new TypeError("Array length is 0 and no second argument");
	                }
	                curr = arr[0];
	                i = 1; // start accumulating at the second element
	            } else {
	                curr = arguments[2];
	            }
	            while (i < l) {
	                if (i in arr) {
	                    curr = accumulator.call(undefined, curr, arr[i], i, arr);
	                }
	                ++i;
	            }
	            return curr;
	        }

	        function reduceRight(arr, accumulator, curr) {
	            var initial = arguments.length > 2;
	            if (arr && arrayReduceRight && arrayReduceRight === arr.reduceRight) {
	                return initial ? arr.reduceRight(accumulator, curr) : arr.reduceRight(accumulator);
	            }
	            if (!isArray(arr) || typeof accumulator !== "function") {
	                throw new TypeError();
	            }

	            var t = Object(arr);
	            var len = t.length >>> 0;

	            // no value to return if no initial value, empty array
	            if (len === 0 && arguments.length === 2) {
	                throw new TypeError();
	            }

	            var k = len - 1;
	            if (arguments.length >= 3) {
	                curr = arguments[2];
	            } else {
	                do {
	                    if (k in arr) {
	                        curr = arr[k--];
	                        break;
	                    }
	                }
	                while (true);
	            }
	            while (k >= 0) {
	                if (k in t) {
	                    curr = accumulator.call(undefined, curr, t[k], k, t);
	                }
	                k--;
	            }
	            return curr;
	        }


	        function toArray(o) {
	            var ret = [];
	            if (o !== null) {
	                var args = argsToArray(arguments);
	                if (args.length === 1) {
	                    if (isArray(o)) {
	                        ret = o;
	                    } else if (is.isHash(o)) {
	                        for (var i in o) {
	                            if (o.hasOwnProperty(i)) {
	                                ret.push([i, o[i]]);
	                            }
	                        }
	                    } else {
	                        ret.push(o);
	                    }
	                } else {
	                    forEach(args, function (a) {
	                        ret = ret.concat(toArray(a));
	                    });
	                }
	            }
	            return ret;
	        }

	        function sum(array) {
	            array = array || [];
	            if (array.length) {
	                return reduce(array, function (a, b) {
	                    return a + b;
	                });
	            } else {
	                return 0;
	            }
	        }

	        function avg(arr) {
	            arr = arr || [];
	            if (arr.length) {
	                var total = sum(arr);
	                if (is.isNumber(total)) {
	                    return  total / arr.length;
	                } else {
	                    throw new Error("Cannot average an array of non numbers.");
	                }
	            } else {
	                return 0;
	            }
	        }

	        function sort(arr, cmp) {
	            return _sort(arr, cmp);
	        }

	        function min(arr, cmp) {
	            return _sort(arr, cmp)[0];
	        }

	        function max(arr, cmp) {
	            return _sort(arr, cmp)[arr.length - 1];
	        }

	        function difference(arr1) {
	            var ret = arr1, args = flatten(argsToArray(arguments, 1));
	            if (isArray(arr1)) {
	                ret = filter(arr1, function (a) {
	                    return indexOf(args, a) === -1;
	                });
	            }
	            return ret;
	        }

	        function removeDuplicates(arr) {
	            var ret = [], i = -1, l, retLength = 0;
	            if (arr) {
	                l = arr.length;
	                while (++i < l) {
	                    var item = arr[i];
	                    if (indexOf(ret, item) === -1) {
	                        ret[retLength++] = item;
	                    }
	                }
	            }
	            return ret;
	        }


	        function unique(arr) {
	            return removeDuplicates(arr);
	        }


	        function rotate(arr, numberOfTimes) {
	            var ret = arr.slice();
	            if (typeof numberOfTimes !== "number") {
	                numberOfTimes = 1;
	            }
	            if (numberOfTimes && isArray(arr)) {
	                if (numberOfTimes > 0) {
	                    ret.push(ret.shift());
	                    numberOfTimes--;
	                } else {
	                    ret.unshift(ret.pop());
	                    numberOfTimes++;
	                }
	                return rotate(ret, numberOfTimes);
	            } else {
	                return ret;
	            }
	        }

	        function permutations(arr, length) {
	            var ret = [];
	            if (isArray(arr)) {
	                var copy = arr.slice(0);
	                if (typeof length !== "number") {
	                    length = arr.length;
	                }
	                if (!length) {
	                    ret = [
	                        []
	                    ];
	                } else if (length <= arr.length) {
	                    ret = reduce(arr, function (a, b, i) {
	                        var ret;
	                        if (length > 1) {
	                            ret = permute(b, rotate(copy, i).slice(1), length);
	                        } else {
	                            ret = [
	                                [b]
	                            ];
	                        }
	                        return a.concat(ret);
	                    }, []);
	                }
	            }
	            return ret;
	        }

	        function zip() {
	            var ret = [];
	            var arrs = argsToArray(arguments);
	            if (arrs.length > 1) {
	                var arr1 = arrs.shift();
	                if (isArray(arr1)) {
	                    ret = reduce(arr1, function (a, b, i) {
	                        var curr = [b];
	                        for (var j = 0; j < arrs.length; j++) {
	                            var currArr = arrs[j];
	                            if (isArray(currArr) && !is.isUndefined(currArr[i])) {
	                                curr.push(currArr[i]);
	                            } else {
	                                curr.push(null);
	                            }
	                        }
	                        a.push(curr);
	                        return a;
	                    }, []);
	                }
	            }
	            return ret;
	        }

	        function transpose(arr) {
	            var ret = [];
	            if (isArray(arr) && arr.length) {
	                var last;
	                forEach(arr, function (a) {
	                    if (isArray(a) && (!last || a.length === last.length)) {
	                        forEach(a, function (b, i) {
	                            if (!ret[i]) {
	                                ret[i] = [];
	                            }
	                            ret[i].push(b);
	                        });
	                        last = a;
	                    }
	                });
	            }
	            return ret;
	        }

	        function valuesAt(arr, indexes) {
	            var ret = [];
	            indexes = argsToArray(arguments);
	            arr = indexes.shift();
	            if (isArray(arr) && indexes.length) {
	                for (var i = 0, l = indexes.length; i < l; i++) {
	                    ret.push(arr[indexes[i]] || null);
	                }
	            }
	            return ret;
	        }

	        function union() {
	            var ret = [];
	            var arrs = argsToArray(arguments);
	            if (arrs.length > 1) {
	                for (var i = 0, l = arrs.length; i < l; i++) {
	                    ret = ret.concat(arrs[i]);
	                }
	                ret = removeDuplicates(ret);
	            }
	            return ret;
	        }

	        function intersect() {
	            var collect = [], sets, i = -1 , l;
	            if (arguments.length > 1) {
	                //assume we are intersections all the lists in the array
	                sets = argsToArray(arguments);
	            } else {
	                sets = arguments[0];
	            }
	            if (isArray(sets)) {
	                collect = sets[0];
	                i = 0;
	                l = sets.length;
	                while (++i < l) {
	                    collect = intersection(collect, sets[i]);
	                }
	            }
	            return removeDuplicates(collect);
	        }

	        function powerSet(arr) {
	            var ret = [];
	            if (isArray(arr) && arr.length) {
	                ret = reduce(arr, function (a, b) {
	                    var ret = map(a, function (c) {
	                        return c.concat(b);
	                    });
	                    return a.concat(ret);
	                }, [
	                    []
	                ]);
	            }
	            return ret;
	        }

	        function cartesian(a, b) {
	            var ret = [];
	            if (isArray(a) && isArray(b) && a.length && b.length) {
	                ret = cross(a[0], b).concat(cartesian(a.slice(1), b));
	            }
	            return ret;
	        }

	        function compact(arr) {
	            var ret = [];
	            if (isArray(arr) && arr.length) {
	                ret = filter(arr, function (item) {
	                    return !is.isUndefinedOrNull(item);
	                });
	            }
	            return ret;
	        }

	        function multiply(arr, times) {
	            times = is.isNumber(times) ? times : 1;
	            if (!times) {
	                //make sure times is greater than zero if it is zero then dont multiply it
	                times = 1;
	            }
	            arr = toArray(arr || []);
	            var ret = [], i = 0;
	            while (++i <= times) {
	                ret = ret.concat(arr);
	            }
	            return ret;
	        }

	        function flatten(arr) {
	            var set;
	            var args = argsToArray(arguments);
	            if (args.length > 1) {
	                //assume we are intersections all the lists in the array
	                set = args;
	            } else {
	                set = toArray(arr);
	            }
	            return reduce(set, function (a, b) {
	                return a.concat(b);
	            }, []);
	        }

	        function pluck(arr, prop) {
	            prop = prop.split(".");
	            var result = arr.slice(0);
	            forEach(prop, function (prop) {
	                var exec = prop.match(/(\w+)\(\)$/);
	                result = map(result, function (item) {
	                    return exec ? item[exec[1]]() : item[prop];
	                });
	            });
	            return result;
	        }

	        function invoke(arr, func, args) {
	            args = argsToArray(arguments, 2);
	            return map(arr, function (item) {
	                var exec = isString(func) ? item[func] : func;
	                return exec.apply(item, args);
	            });
	        }


	        var array = {
	            toArray: toArray,
	            sum: sum,
	            avg: avg,
	            sort: sort,
	            min: min,
	            max: max,
	            difference: difference,
	            removeDuplicates: removeDuplicates,
	            unique: unique,
	            rotate: rotate,
	            permutations: permutations,
	            zip: zip,
	            transpose: transpose,
	            valuesAt: valuesAt,
	            union: union,
	            intersect: intersect,
	            powerSet: powerSet,
	            cartesian: cartesian,
	            compact: compact,
	            multiply: multiply,
	            flatten: flatten,
	            pluck: pluck,
	            invoke: invoke,
	            forEach: forEach,
	            map: map,
	            filter: filter,
	            reduce: reduce,
	            reduceRight: reduceRight,
	            some: some,
	            every: every,
	            indexOf: indexOf,
	            lastIndexOf: lastIndexOf
	        };

	        return extended.define(isArray, array).expose(array);
	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineArray(__webpack_require__(7), __webpack_require__(6), __webpack_require__(14));
	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extended", "is-extended", "arguments-extended"], function (extended, is, args) {
	            return defineArray(extended, is, args);
	        });
	    } else {
	        this.arrayExtended = defineArray(this.extended, this.isExtended, this.argumentsExtended);
	    }

	}).call(this);








/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";

	    function defineArgumentsExtended(extended, is) {

	        var pSlice = Array.prototype.slice,
	            isArguments = is.isArguments;

	        function argsToArray(args, slice) {
	            var i = -1, j = 0, l = args.length, ret = [];
	            slice = slice || 0;
	            i += slice;
	            while (++i < l) {
	                ret[j++] = args[i];
	            }
	            return ret;
	        }


	        return extended
	            .define(isArguments, {
	                toArray: argsToArray
	            })
	            .expose({
	                argsToArray: argsToArray
	            });
	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineArgumentsExtended(__webpack_require__(7), __webpack_require__(6));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extended", "is-extended"], function (extended, is) {
	            return defineArgumentsExtended(extended, is);
	        });
	    } else {
	        this.argumentsExtended = defineArgumentsExtended(this.extended, this.isExtended);
	    }

	}).call(this);



/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";

	    function defineString(extended, is, date, arr) {

	        var stringify;
	        if (typeof JSON === "undefined") {
	            /*
	             json2.js
	             2012-10-08

	             Public Domain.

	             NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	             */

	            (function () {
	                function f(n) {
	                    // Format integers to have at least two digits.
	                    return n < 10 ? '0' + n : n;
	                }

	                var isPrimitive = is.tester().isString().isNumber().isBoolean().tester();

	                function toJSON(obj) {
	                    if (is.isDate(obj)) {
	                        return isFinite(obj.valueOf()) ? obj.getUTCFullYear() + '-' +
	                            f(obj.getUTCMonth() + 1) + '-' +
	                            f(obj.getUTCDate()) + 'T' +
	                            f(obj.getUTCHours()) + ':' +
	                            f(obj.getUTCMinutes()) + ':' +
	                            f(obj.getUTCSeconds()) + 'Z'
	                            : null;
	                    } else if (isPrimitive(obj)) {
	                        return obj.valueOf();
	                    }
	                    return obj;
	                }

	                var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	                    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	                    gap,
	                    indent,
	                    meta = {    // table of character substitutions
	                        '\b': '\\b',
	                        '\t': '\\t',
	                        '\n': '\\n',
	                        '\f': '\\f',
	                        '\r': '\\r',
	                        '"': '\\"',
	                        '\\': '\\\\'
	                    },
	                    rep;


	                function quote(string) {
	                    escapable.lastIndex = 0;
	                    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	                        var c = meta[a];
	                        return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	                    }) + '"' : '"' + string + '"';
	                }


	                function str(key, holder) {

	                    var i, k, v, length, mind = gap, partial, value = holder[key];
	                    if (value) {
	                        value = toJSON(value);
	                    }
	                    if (typeof rep === 'function') {
	                        value = rep.call(holder, key, value);
	                    }
	                    switch (typeof value) {
	                    case 'string':
	                        return quote(value);
	                    case 'number':
	                        return isFinite(value) ? String(value) : 'null';
	                    case 'boolean':
	                    case 'null':
	                        return String(value);
	                    case 'object':
	                        if (!value) {
	                            return 'null';
	                        }
	                        gap += indent;
	                        partial = [];
	                        if (Object.prototype.toString.apply(value) === '[object Array]') {
	                            length = value.length;
	                            for (i = 0; i < length; i += 1) {
	                                partial[i] = str(i, value) || 'null';
	                            }
	                            v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
	                            gap = mind;
	                            return v;
	                        }
	                        if (rep && typeof rep === 'object') {
	                            length = rep.length;
	                            for (i = 0; i < length; i += 1) {
	                                if (typeof rep[i] === 'string') {
	                                    k = rep[i];
	                                    v = str(k, value);
	                                    if (v) {
	                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                                    }
	                                }
	                            }
	                        } else {
	                            for (k in value) {
	                                if (Object.prototype.hasOwnProperty.call(value, k)) {
	                                    v = str(k, value);
	                                    if (v) {
	                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                                    }
	                                }
	                            }
	                        }
	                        v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
	                        gap = mind;
	                        return v;
	                    }
	                }

	                stringify = function (value, replacer, space) {
	                    var i;
	                    gap = '';
	                    indent = '';
	                    if (typeof space === 'number') {
	                        for (i = 0; i < space; i += 1) {
	                            indent += ' ';
	                        }
	                    } else if (typeof space === 'string') {
	                        indent = space;
	                    }
	                    rep = replacer;
	                    if (replacer && typeof replacer !== 'function' &&
	                        (typeof replacer !== 'object' ||
	                            typeof replacer.length !== 'number')) {
	                        throw new Error('JSON.stringify');
	                    }
	                    return str('', {'': value});
	                };
	            }());
	        } else {
	            stringify = JSON.stringify;
	        }


	        var isHash = is.isHash, aSlice = Array.prototype.slice;

	        var FORMAT_REGEX = /%((?:-?\+?.?\d*)?|(?:\[[^\[|\]]*\]))?([sjdDZ])/g;
	        var INTERP_REGEX = /\{(?:\[([^\[|\]]*)\])?(\w+)\}/g;
	        var STR_FORMAT = /(-?)(\+?)([A-Z|a-z|\W]?)([1-9][0-9]*)?$/;
	        var OBJECT_FORMAT = /([1-9][0-9]*)$/g;

	        function formatString(string, format) {
	            var ret = string;
	            if (STR_FORMAT.test(format)) {
	                var match = format.match(STR_FORMAT);
	                var isLeftJustified = match[1], padChar = match[3], width = match[4];
	                if (width) {
	                    width = parseInt(width, 10);
	                    if (ret.length < width) {
	                        ret = pad(ret, width, padChar, isLeftJustified);
	                    } else {
	                        ret = truncate(ret, width);
	                    }
	                }
	            }
	            return ret;
	        }

	        function formatNumber(number, format) {
	            var ret;
	            if (is.isNumber(number)) {
	                ret = "" + number;
	                if (STR_FORMAT.test(format)) {
	                    var match = format.match(STR_FORMAT);
	                    var isLeftJustified = match[1], signed = match[2], padChar = match[3], width = match[4];
	                    if (signed) {
	                        ret = (number > 0 ? "+" : "") + ret;
	                    }
	                    if (width) {
	                        width = parseInt(width, 10);
	                        if (ret.length < width) {
	                            ret = pad(ret, width, padChar || "0", isLeftJustified);
	                        } else {
	                            ret = truncate(ret, width);
	                        }
	                    }

	                }
	            } else {
	                throw new Error("stringExtended.format : when using %d the parameter must be a number!");
	            }
	            return ret;
	        }

	        function formatObject(object, format) {
	            var ret, match = format.match(OBJECT_FORMAT), spacing = 0;
	            if (match) {
	                spacing = parseInt(match[0], 10);
	                if (isNaN(spacing)) {
	                    spacing = 0;
	                }
	            }
	            try {
	                ret = stringify(object, null, spacing);
	            } catch (e) {
	                throw new Error("stringExtended.format : Unable to parse json from ", object);
	            }
	            return ret;
	        }


	        var styles = {
	            //styles
	            bold: 1,
	            bright: 1,
	            italic: 3,
	            underline: 4,
	            blink: 5,
	            inverse: 7,
	            crossedOut: 9,

	            red: 31,
	            green: 32,
	            yellow: 33,
	            blue: 34,
	            magenta: 35,
	            cyan: 36,
	            white: 37,

	            redBackground: 41,
	            greenBackground: 42,
	            yellowBackground: 43,
	            blueBackground: 44,
	            magentaBackground: 45,
	            cyanBackground: 46,
	            whiteBackground: 47,

	            encircled: 52,
	            overlined: 53,
	            grey: 90,
	            black: 90
	        };

	        var characters = {
	            SMILEY: "☺",
	            SOLID_SMILEY: "☻",
	            HEART: "♥",
	            DIAMOND: "♦",
	            CLOVE: "♣",
	            SPADE: "♠",
	            DOT: "•",
	            SQUARE_CIRCLE: "◘",
	            CIRCLE: "○",
	            FILLED_SQUARE_CIRCLE: "◙",
	            MALE: "♂",
	            FEMALE: "♀",
	            EIGHT_NOTE: "♪",
	            DOUBLE_EIGHTH_NOTE: "♫",
	            SUN: "☼",
	            PLAY: "►",
	            REWIND: "◄",
	            UP_DOWN: "↕",
	            PILCROW: "¶",
	            SECTION: "§",
	            THICK_MINUS: "▬",
	            SMALL_UP_DOWN: "↨",
	            UP_ARROW: "↑",
	            DOWN_ARROW: "↓",
	            RIGHT_ARROW: "→",
	            LEFT_ARROW: "←",
	            RIGHT_ANGLE: "∟",
	            LEFT_RIGHT_ARROW: "↔",
	            TRIANGLE: "▲",
	            DOWN_TRIANGLE: "▼",
	            HOUSE: "⌂",
	            C_CEDILLA: "Ç",
	            U_UMLAUT: "ü",
	            E_ACCENT: "é",
	            A_LOWER_CIRCUMFLEX: "â",
	            A_LOWER_UMLAUT: "ä",
	            A_LOWER_GRAVE_ACCENT: "à",
	            A_LOWER_CIRCLE_OVER: "å",
	            C_LOWER_CIRCUMFLEX: "ç",
	            E_LOWER_CIRCUMFLEX: "ê",
	            E_LOWER_UMLAUT: "ë",
	            E_LOWER_GRAVE_ACCENT: "è",
	            I_LOWER_UMLAUT: "ï",
	            I_LOWER_CIRCUMFLEX: "î",
	            I_LOWER_GRAVE_ACCENT: "ì",
	            A_UPPER_UMLAUT: "Ä",
	            A_UPPER_CIRCLE: "Å",
	            E_UPPER_ACCENT: "É",
	            A_E_LOWER: "æ",
	            A_E_UPPER: "Æ",
	            O_LOWER_CIRCUMFLEX: "ô",
	            O_LOWER_UMLAUT: "ö",
	            O_LOWER_GRAVE_ACCENT: "ò",
	            U_LOWER_CIRCUMFLEX: "û",
	            U_LOWER_GRAVE_ACCENT: "ù",
	            Y_LOWER_UMLAUT: "ÿ",
	            O_UPPER_UMLAUT: "Ö",
	            U_UPPER_UMLAUT: "Ü",
	            CENTS: "¢",
	            POUND: "£",
	            YEN: "¥",
	            CURRENCY: "¤",
	            PTS: "₧",
	            FUNCTION: "ƒ",
	            A_LOWER_ACCENT: "á",
	            I_LOWER_ACCENT: "í",
	            O_LOWER_ACCENT: "ó",
	            U_LOWER_ACCENT: "ú",
	            N_LOWER_TILDE: "ñ",
	            N_UPPER_TILDE: "Ñ",
	            A_SUPER: "ª",
	            O_SUPER: "º",
	            UPSIDEDOWN_QUESTION: "¿",
	            SIDEWAYS_L: "⌐",
	            NEGATION: "¬",
	            ONE_HALF: "½",
	            ONE_FOURTH: "¼",
	            UPSIDEDOWN_EXCLAMATION: "¡",
	            DOUBLE_LEFT: "«",
	            DOUBLE_RIGHT: "»",
	            LIGHT_SHADED_BOX: "░",
	            MEDIUM_SHADED_BOX: "▒",
	            DARK_SHADED_BOX: "▓",
	            VERTICAL_LINE: "│",
	            MAZE__SINGLE_RIGHT_T: "┤",
	            MAZE_SINGLE_RIGHT_TOP: "┐",
	            MAZE_SINGLE_RIGHT_BOTTOM_SMALL: "┘",
	            MAZE_SINGLE_LEFT_TOP_SMALL: "┌",
	            MAZE_SINGLE_LEFT_BOTTOM_SMALL: "└",
	            MAZE_SINGLE_LEFT_T: "├",
	            MAZE_SINGLE_BOTTOM_T: "┴",
	            MAZE_SINGLE_TOP_T: "┬",
	            MAZE_SINGLE_CENTER: "┼",
	            MAZE_SINGLE_HORIZONTAL_LINE: "─",
	            MAZE_SINGLE_RIGHT_DOUBLECENTER_T: "╡",
	            MAZE_SINGLE_RIGHT_DOUBLE_BL: "╛",
	            MAZE_SINGLE_RIGHT_DOUBLE_T: "╢",
	            MAZE_SINGLE_RIGHT_DOUBLEBOTTOM_TOP: "╖",
	            MAZE_SINGLE_RIGHT_DOUBLELEFT_TOP: "╕",
	            MAZE_SINGLE_LEFT_DOUBLE_T: "╞",
	            MAZE_SINGLE_BOTTOM_DOUBLE_T: "╧",
	            MAZE_SINGLE_TOP_DOUBLE_T: "╤",
	            MAZE_SINGLE_TOP_DOUBLECENTER_T: "╥",
	            MAZE_SINGLE_BOTTOM_DOUBLECENTER_T: "╨",
	            MAZE_SINGLE_LEFT_DOUBLERIGHT_BOTTOM: "╘",
	            MAZE_SINGLE_LEFT_DOUBLERIGHT_TOP: "╒",
	            MAZE_SINGLE_LEFT_DOUBLEBOTTOM_TOP: "╓",
	            MAZE_SINGLE_LEFT_DOUBLETOP_BOTTOM: "╙",
	            MAZE_SINGLE_LEFT_TOP: "Γ",
	            MAZE_SINGLE_RIGHT_BOTTOM: "╜",
	            MAZE_SINGLE_LEFT_CENTER: "╟",
	            MAZE_SINGLE_DOUBLECENTER_CENTER: "╫",
	            MAZE_SINGLE_DOUBLECROSS_CENTER: "╪",
	            MAZE_DOUBLE_LEFT_CENTER: "╣",
	            MAZE_DOUBLE_VERTICAL: "║",
	            MAZE_DOUBLE_RIGHT_TOP: "╗",
	            MAZE_DOUBLE_RIGHT_BOTTOM: "╝",
	            MAZE_DOUBLE_LEFT_BOTTOM: "╚",
	            MAZE_DOUBLE_LEFT_TOP: "╔",
	            MAZE_DOUBLE_BOTTOM_T: "╩",
	            MAZE_DOUBLE_TOP_T: "╦",
	            MAZE_DOUBLE_LEFT_T: "╠",
	            MAZE_DOUBLE_HORIZONTAL: "═",
	            MAZE_DOUBLE_CROSS: "╬",
	            SOLID_RECTANGLE: "█",
	            THICK_LEFT_VERTICAL: "▌",
	            THICK_RIGHT_VERTICAL: "▐",
	            SOLID_SMALL_RECTANGLE_BOTTOM: "▄",
	            SOLID_SMALL_RECTANGLE_TOP: "▀",
	            PHI_UPPER: "Φ",
	            INFINITY: "∞",
	            INTERSECTION: "∩",
	            DEFINITION: "≡",
	            PLUS_MINUS: "±",
	            GT_EQ: "≥",
	            LT_EQ: "≤",
	            THEREFORE: "⌠",
	            SINCE: "∵",
	            DOESNOT_EXIST: "∄",
	            EXISTS: "∃",
	            FOR_ALL: "∀",
	            EXCLUSIVE_OR: "⊕",
	            BECAUSE: "⌡",
	            DIVIDE: "÷",
	            APPROX: "≈",
	            DEGREE: "°",
	            BOLD_DOT: "∙",
	            DOT_SMALL: "·",
	            CHECK: "√",
	            ITALIC_X: "✗",
	            SUPER_N: "ⁿ",
	            SQUARED: "²",
	            CUBED: "³",
	            SOLID_BOX: "■",
	            PERMILE: "‰",
	            REGISTERED_TM: "®",
	            COPYRIGHT: "©",
	            TRADEMARK: "™",
	            BETA: "β",
	            GAMMA: "γ",
	            ZETA: "ζ",
	            ETA: "η",
	            IOTA: "ι",
	            KAPPA: "κ",
	            LAMBDA: "λ",
	            NU: "ν",
	            XI: "ξ",
	            OMICRON: "ο",
	            RHO: "ρ",
	            UPSILON: "υ",
	            CHI_LOWER: "φ",
	            CHI_UPPER: "χ",
	            PSI: "ψ",
	            ALPHA: "α",
	            ESZETT: "ß",
	            PI: "π",
	            SIGMA_UPPER: "Σ",
	            SIGMA_LOWER: "σ",
	            MU: "µ",
	            TAU: "τ",
	            THETA: "Θ",
	            OMEGA: "Ω",
	            DELTA: "δ",
	            PHI_LOWER: "φ",
	            EPSILON: "ε"
	        };

	        function pad(string, length, ch, end) {
	            string = "" + string; //check for numbers
	            ch = ch || " ";
	            var strLen = string.length;
	            while (strLen < length) {
	                if (end) {
	                    string += ch;
	                } else {
	                    string = ch + string;
	                }
	                strLen++;
	            }
	            return string;
	        }

	        function truncate(string, length, end) {
	            var ret = string;
	            if (is.isString(ret)) {
	                if (string.length > length) {
	                    if (end) {
	                        var l = string.length;
	                        ret = string.substring(l - length, l);
	                    } else {
	                        ret = string.substring(0, length);
	                    }
	                }
	            } else {
	                ret = truncate("" + ret, length);
	            }
	            return ret;
	        }

	        function format(str, obj) {
	            if (obj instanceof Array) {
	                var i = 0, len = obj.length;
	                //find the matches
	                return str.replace(FORMAT_REGEX, function (m, format, type) {
	                    var replacer, ret;
	                    if (i < len) {
	                        replacer = obj[i++];
	                    } else {
	                        //we are out of things to replace with so
	                        //just return the match?
	                        return m;
	                    }
	                    if (m === "%s" || m === "%d" || m === "%D") {
	                        //fast path!
	                        ret = replacer + "";
	                    } else if (m === "%Z") {
	                        ret = replacer.toUTCString();
	                    } else if (m === "%j") {
	                        try {
	                            ret = stringify(replacer);
	                        } catch (e) {
	                            throw new Error("stringExtended.format : Unable to parse json from ", replacer);
	                        }
	                    } else {
	                        format = format.replace(/^\[|\]$/g, "");
	                        switch (type) {
	                        case "s":
	                            ret = formatString(replacer, format);
	                            break;
	                        case "d":
	                            ret = formatNumber(replacer, format);
	                            break;
	                        case "j":
	                            ret = formatObject(replacer, format);
	                            break;
	                        case "D":
	                            ret = date.format(replacer, format);
	                            break;
	                        case "Z":
	                            ret = date.format(replacer, format, true);
	                            break;
	                        }
	                    }
	                    return ret;
	                });
	            } else if (isHash(obj)) {
	                return str.replace(INTERP_REGEX, function (m, format, value) {
	                    value = obj[value];
	                    if (!is.isUndefined(value)) {
	                        if (format) {
	                            if (is.isString(value)) {
	                                return formatString(value, format);
	                            } else if (is.isNumber(value)) {
	                                return formatNumber(value, format);
	                            } else if (is.isDate(value)) {
	                                return date.format(value, format);
	                            } else if (is.isObject(value)) {
	                                return formatObject(value, format);
	                            }
	                        } else {
	                            return "" + value;
	                        }
	                    }
	                    return m;
	                });
	            } else {
	                var args = aSlice.call(arguments).slice(1);
	                return format(str, args);
	            }
	        }

	        function toArray(testStr, delim) {
	            var ret = [];
	            if (testStr) {
	                if (testStr.indexOf(delim) > 0) {
	                    ret = testStr.replace(/\s+/g, "").split(delim);
	                }
	                else {
	                    ret.push(testStr);
	                }
	            }
	            return ret;
	        }

	        function multiply(str, times) {
	            var ret = [];
	            if (times) {
	                for (var i = 0; i < times; i++) {
	                    ret.push(str);
	                }
	            }
	            return ret.join("");
	        }


	        function style(str, options) {
	            var ret, i, l;
	            if (options) {
	                if (is.isArray(str)) {
	                    ret = [];
	                    for (i = 0, l = str.length; i < l; i++) {
	                        ret.push(style(str[i], options));
	                    }
	                } else if (options instanceof Array) {
	                    ret = str;
	                    for (i = 0, l = options.length; i < l; i++) {
	                        ret = style(ret, options[i]);
	                    }
	                } else if (options in styles) {
	                    ret = '\x1B[' + styles[options] + 'm' + str + '\x1B[0m';
	                }
	            }
	            return ret;
	        }

	        function escape(str, except) {
	            return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function (ch) {
	                if (except && arr.indexOf(except, ch) !== -1) {
	                    return ch;
	                }
	                return "\\" + ch;
	            });
	        }

	        function trim(str) {
	            return str.replace(/^\s*|\s*$/g, "");
	        }

	        function trimLeft(str) {
	            return str.replace(/^\s*/, "");
	        }

	        function trimRight(str) {
	            return str.replace(/\s*$/, "");
	        }

	        function isEmpty(str) {
	            return str.length === 0;
	        }


	        var string = {
	            toArray: toArray,
	            pad: pad,
	            truncate: truncate,
	            multiply: multiply,
	            format: format,
	            style: style,
	            escape: escape,
	            trim: trim,
	            trimLeft: trimLeft,
	            trimRight: trimRight,
	            isEmpty: isEmpty
	        };
	        return extended.define(is.isString, string).define(is.isArray, {style: style}).expose(string).expose({characters: characters});
	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineString(__webpack_require__(7), __webpack_require__(6), __webpack_require__(16), __webpack_require__(13));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extended", "is-extended", "date-extended", "array-extended"], function (extended, is, date, arr) {
	            return defineString(extended, is, date, arr);
	        });
	    } else {
	        this.stringExtended = defineString(this.extended, this.isExtended, this.dateExtended, this.arrayExtended);
	    }

	}).call(this);








/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";

	    function defineDate(extended, is, array) {

	        function _pad(string, length, ch, end) {
	            string = "" + string; //check for numbers
	            ch = ch || " ";
	            var strLen = string.length;
	            while (strLen < length) {
	                if (end) {
	                    string += ch;
	                } else {
	                    string = ch + string;
	                }
	                strLen++;
	            }
	            return string;
	        }

	        function _truncate(string, length, end) {
	            var ret = string;
	            if (is.isString(ret)) {
	                if (string.length > length) {
	                    if (end) {
	                        var l = string.length;
	                        ret = string.substring(l - length, l);
	                    } else {
	                        ret = string.substring(0, length);
	                    }
	                }
	            } else {
	                ret = _truncate("" + ret, length);
	            }
	            return ret;
	        }

	        function every(arr, iterator, scope) {
	            if (!is.isArray(arr) || typeof iterator !== "function") {
	                throw new TypeError();
	            }
	            var t = Object(arr);
	            var len = t.length >>> 0;
	            for (var i = 0; i < len; i++) {
	                if (i in t && !iterator.call(scope, t[i], i, t)) {
	                    return false;
	                }
	            }
	            return true;
	        }


	        var transforms = (function () {
	                var floor = Math.floor, round = Math.round;

	                var addMap = {
	                    day: function addDay(date, amount) {
	                        return [amount, "Date", false];
	                    },
	                    weekday: function addWeekday(date, amount) {
	                        // Divide the increment time span into weekspans plus leftover days
	                        // e.g., 8 days is one 5-day weekspan / and two leftover days
	                        // Can't have zero leftover days, so numbers divisible by 5 get
	                        // a days value of 5, and the remaining days make up the number of weeks
	                        var days, weeks, mod = amount % 5, strt = date.getDay(), adj = 0;
	                        if (!mod) {
	                            days = (amount > 0) ? 5 : -5;
	                            weeks = (amount > 0) ? ((amount - 5) / 5) : ((amount + 5) / 5);
	                        } else {
	                            days = mod;
	                            weeks = parseInt(amount / 5, 10);
	                        }
	                        if (strt === 6 && amount > 0) {
	                            adj = 1;
	                        } else if (strt === 0 && amount < 0) {
	                            // Orig date is Sun / negative increment
	                            // Jump back over Sat
	                            adj = -1;
	                        }
	                        // Get weekday val for the new date
	                        var trgt = strt + days;
	                        // New date is on Sat or Sun
	                        if (trgt === 0 || trgt === 6) {
	                            adj = (amount > 0) ? 2 : -2;
	                        }
	                        // Increment by number of weeks plus leftover days plus
	                        // weekend adjustments
	                        return [(7 * weeks) + days + adj, "Date", false];
	                    },
	                    year: function addYear(date, amount) {
	                        return [amount, "FullYear", true];
	                    },
	                    week: function addWeek(date, amount) {
	                        return [amount * 7, "Date", false];
	                    },
	                    quarter: function addYear(date, amount) {
	                        return [amount * 3, "Month", true];
	                    },
	                    month: function addYear(date, amount) {
	                        return [amount, "Month", true];
	                    }
	                };

	                function addTransform(interval, date, amount) {
	                    interval = interval.replace(/s$/, "");
	                    if (addMap.hasOwnProperty(interval)) {
	                        return addMap[interval](date, amount);
	                    }
	                    return [amount, "UTC" + interval.charAt(0).toUpperCase() + interval.substring(1) + "s", false];
	                }


	                var differenceMap = {
	                    "quarter": function quarterDifference(date1, date2, utc) {
	                        var yearDiff = date2.getFullYear() - date1.getFullYear();
	                        var m1 = date1[utc ? "getUTCMonth" : "getMonth"]();
	                        var m2 = date2[utc ? "getUTCMonth" : "getMonth"]();
	                        // Figure out which quarter the months are in
	                        var q1 = floor(m1 / 3) + 1;
	                        var q2 = floor(m2 / 3) + 1;
	                        // Add quarters for any year difference between the dates
	                        q2 += (yearDiff * 4);
	                        return q2 - q1;
	                    },

	                    "weekday": function weekdayDifference(date1, date2, utc) {
	                        var days = differenceTransform("day", date1, date2, utc), weeks;
	                        var mod = days % 7;
	                        // Even number of weeks
	                        if (mod === 0) {
	                            days = differenceTransform("week", date1, date2, utc) * 5;
	                        } else {
	                            // Weeks plus spare change (< 7 days)
	                            var adj = 0, aDay = date1[utc ? "getUTCDay" : "getDay"](), bDay = date2[utc ? "getUTCDay" : "getDay"]();
	                            weeks = parseInt(days / 7, 10);
	                            // Mark the date advanced by the number of
	                            // round weeks (may be zero)
	                            var dtMark = new Date(+date1);
	                            dtMark.setDate(dtMark[utc ? "getUTCDate" : "getDate"]() + (weeks * 7));
	                            var dayMark = dtMark[utc ? "getUTCDay" : "getDay"]();

	                            // Spare change days -- 6 or less
	                            if (days > 0) {
	                                if (aDay === 6 || bDay === 6) {
	                                    adj = -1;
	                                } else if (aDay === 0) {
	                                    adj = 0;
	                                } else if (bDay === 0 || (dayMark + mod) > 5) {
	                                    adj = -2;
	                                }
	                            } else if (days < 0) {
	                                if (aDay === 6) {
	                                    adj = 0;
	                                } else if (aDay === 0 || bDay === 0) {
	                                    adj = 1;
	                                } else if (bDay === 6 || (dayMark + mod) < 0) {
	                                    adj = 2;
	                                }
	                            }
	                            days += adj;
	                            days -= (weeks * 2);
	                        }
	                        return days;
	                    },
	                    year: function (date1, date2) {
	                        return date2.getFullYear() - date1.getFullYear();
	                    },
	                    month: function (date1, date2, utc) {
	                        var m1 = date1[utc ? "getUTCMonth" : "getMonth"]();
	                        var m2 = date2[utc ? "getUTCMonth" : "getMonth"]();
	                        return (m2 - m1) + ((date2.getFullYear() - date1.getFullYear()) * 12);
	                    },
	                    week: function (date1, date2, utc) {
	                        return round(differenceTransform("day", date1, date2, utc) / 7);
	                    },
	                    day: function (date1, date2) {
	                        return 1.1574074074074074e-8 * (date2.getTime() - date1.getTime());
	                    },
	                    hour: function (date1, date2) {
	                        return 2.7777777777777776e-7 * (date2.getTime() - date1.getTime());
	                    },
	                    minute: function (date1, date2) {
	                        return 0.000016666666666666667 * (date2.getTime() - date1.getTime());
	                    },
	                    second: function (date1, date2) {
	                        return 0.001 * (date2.getTime() - date1.getTime());
	                    },
	                    millisecond: function (date1, date2) {
	                        return date2.getTime() - date1.getTime();
	                    }
	                };


	                function differenceTransform(interval, date1, date2, utc) {
	                    interval = interval.replace(/s$/, "");
	                    return round(differenceMap[interval](date1, date2, utc));
	                }


	                return {
	                    addTransform: addTransform,
	                    differenceTransform: differenceTransform
	                };
	            }()),
	            addTransform = transforms.addTransform,
	            differenceTransform = transforms.differenceTransform;


	        /**
	         * @ignore
	         * Based on DOJO Date Implementation
	         *
	         * Dojo is available under *either* the terms of the modified BSD license *or* the
	         * Academic Free License version 2.1. As a recipient of Dojo, you may choose which
	         * license to receive this code under (except as noted in per-module LICENSE
	         * files). Some modules may not be the copyright of the Dojo Foundation. These
	         * modules contain explicit declarations of copyright in both the LICENSE files in
	         * the directories in which they reside and in the code itself. No external
	         * contributions are allowed under licenses which are fundamentally incompatible
	         * with the AFL or BSD licenses that Dojo is distributed under.
	         *
	         */

	        var floor = Math.floor, round = Math.round, min = Math.min, pow = Math.pow, ceil = Math.ceil, abs = Math.abs;
	        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	        var monthAbbr = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
	        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	        var dayAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	        var eraNames = ["Before Christ", "Anno Domini"];
	        var eraAbbr = ["BC", "AD"];


	        function getDayOfYear(/*Date*/dateObject, utc) {
	            // summary: gets the day of the year as represented by dateObject
	            return date.difference(new Date(dateObject.getFullYear(), 0, 1, dateObject.getHours()), dateObject, null, utc) + 1; // Number
	        }

	        function getWeekOfYear(/*Date*/dateObject, /*Number*/firstDayOfWeek, utc) {
	            firstDayOfWeek = firstDayOfWeek || 0;
	            var fullYear = dateObject[utc ? "getUTCFullYear" : "getFullYear"]();
	            var firstDayOfYear = new Date(fullYear, 0, 1).getDay(),
	                adj = (firstDayOfYear - firstDayOfWeek + 7) % 7,
	                week = floor((getDayOfYear(dateObject) + adj - 1) / 7);

	            // if year starts on the specified day, start counting weeks at 1
	            if (firstDayOfYear === firstDayOfWeek) {
	                week++;
	            }

	            return week; // Number
	        }

	        function getTimezoneName(/*Date*/dateObject) {
	            var str = dateObject.toString();
	            var tz = '';
	            var pos = str.indexOf('(');
	            if (pos > -1) {
	                tz = str.substring(++pos, str.indexOf(')'));
	            }
	            return tz; // String
	        }


	        function buildDateEXP(pattern, tokens) {
	            return pattern.replace(/([a-z])\1*/ig,function (match) {
	                // Build a simple regexp.  Avoid captures, which would ruin the tokens list
	                var s,
	                    c = match.charAt(0),
	                    l = match.length,
	                    p2 = '0?',
	                    p3 = '0{0,2}';
	                if (c === 'y') {
	                    s = '\\d{2,4}';
	                } else if (c === "M") {
	                    s = (l > 2) ? '\\S+?' : '1[0-2]|' + p2 + '[1-9]';
	                } else if (c === "D") {
	                    s = '[12][0-9][0-9]|3[0-5][0-9]|36[0-6]|' + p3 + '[1-9][0-9]|' + p2 + '[1-9]';
	                } else if (c === "d") {
	                    s = '3[01]|[12]\\d|' + p2 + '[1-9]';
	                } else if (c === "w") {
	                    s = '[1-4][0-9]|5[0-3]|' + p2 + '[1-9]';
	                } else if (c === "E") {
	                    s = '\\S+';
	                } else if (c === "h") {
	                    s = '1[0-2]|' + p2 + '[1-9]';
	                } else if (c === "K") {
	                    s = '1[01]|' + p2 + '\\d';
	                } else if (c === "H") {
	                    s = '1\\d|2[0-3]|' + p2 + '\\d';
	                } else if (c === "k") {
	                    s = '1\\d|2[0-4]|' + p2 + '[1-9]';
	                } else if (c === "m" || c === "s") {
	                    s = '[0-5]\\d';
	                } else if (c === "S") {
	                    s = '\\d{' + l + '}';
	                } else if (c === "a") {
	                    var am = 'AM', pm = 'PM';
	                    s = am + '|' + pm;
	                    if (am !== am.toLowerCase()) {
	                        s += '|' + am.toLowerCase();
	                    }
	                    if (pm !== pm.toLowerCase()) {
	                        s += '|' + pm.toLowerCase();
	                    }
	                    s = s.replace(/\./g, "\\.");
	                } else if (c === 'v' || c === 'z' || c === 'Z' || c === 'G' || c === 'q' || c === 'Q') {
	                    s = ".*";
	                } else {
	                    s = c === " " ? "\\s*" : c + "*";
	                }
	                if (tokens) {
	                    tokens.push(match);
	                }

	                return "(" + s + ")"; // add capture
	            }).replace(/[\xa0 ]/g, "[\\s\\xa0]"); // normalize whitespace.  Need explicit handling of \xa0 for IE.
	        }


	        /**
	         * @namespace Utilities for Dates
	         */
	        var date = {

	            /**@lends date*/

	            /**
	             * Returns the number of days in the month of a date
	             *
	             * @example
	             *
	             *  dateExtender.getDaysInMonth(new Date(2006, 1, 1)); //28
	             *  dateExtender.getDaysInMonth(new Date(2004, 1, 1)); //29
	             *  dateExtender.getDaysInMonth(new Date(2006, 2, 1)); //31
	             *  dateExtender.getDaysInMonth(new Date(2006, 3, 1)); //30
	             *  dateExtender.getDaysInMonth(new Date(2006, 4, 1)); //31
	             *  dateExtender.getDaysInMonth(new Date(2006, 5, 1)); //30
	             *  dateExtender.getDaysInMonth(new Date(2006, 6, 1)); //31
	             * @param {Date} dateObject the date containing the month
	             * @return {Number} the number of days in the month
	             */
	            getDaysInMonth: function (/*Date*/dateObject) {
	                //	summary:
	                //		Returns the number of days in the month used by dateObject
	                var month = dateObject.getMonth();
	                var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	                if (month === 1 && date.isLeapYear(dateObject)) {
	                    return 29;
	                } // Number
	                return days[month]; // Number
	            },

	            /**
	             * Determines if a date is a leap year
	             *
	             * @example
	             *
	             *  dateExtender.isLeapYear(new Date(1600, 0, 1)); //true
	             *  dateExtender.isLeapYear(new Date(2004, 0, 1)); //true
	             *  dateExtender.isLeapYear(new Date(2000, 0, 1)); //true
	             *  dateExtender.isLeapYear(new Date(2006, 0, 1)); //false
	             *  dateExtender.isLeapYear(new Date(1900, 0, 1)); //false
	             *  dateExtender.isLeapYear(new Date(1800, 0, 1)); //false
	             *  dateExtender.isLeapYear(new Date(1700, 0, 1)); //false
	             *
	             * @param {Date} dateObject
	             * @returns {Boolean} true if it is a leap year false otherwise
	             */
	            isLeapYear: function (/*Date*/dateObject, utc) {
	                var year = dateObject[utc ? "getUTCFullYear" : "getFullYear"]();
	                return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);

	            },

	            /**
	             * Determines if a date is on a weekend
	             *
	             * @example
	             *
	             * var thursday = new Date(2006, 8, 21);
	             * var saturday = new Date(2006, 8, 23);
	             * var sunday = new Date(2006, 8, 24);
	             * var monday = new Date(2006, 8, 25);
	             * dateExtender.isWeekend(thursday)); //false
	             * dateExtender.isWeekend(saturday); //true
	             * dateExtender.isWeekend(sunday); //true
	             * dateExtender.isWeekend(monday)); //false
	             *
	             * @param {Date} dateObject the date to test
	             *
	             * @returns {Boolean} true if the date is a weekend
	             */
	            isWeekend: function (/*Date?*/dateObject, utc) {
	                // summary:
	                //	Determines if the date falls on a weekend, according to local custom.
	                var day = (dateObject || new Date())[utc ? "getUTCDay" : "getDay"]();
	                return day === 0 || day === 6;
	            },

	            /**
	             * Get the timezone of a date
	             *
	             * @example
	             *  //just setting the strLocal to simulate the toString() of a date
	             *  dt.str = 'Sun Sep 17 2006 22:25:51 GMT-0500 (CDT)';
	             *  //just setting the strLocal to simulate the locale
	             *  dt.strLocale = 'Sun 17 Sep 2006 10:25:51 PM CDT';
	             *  dateExtender.getTimezoneName(dt); //'CDT'
	             *  dt.str = 'Sun Sep 17 2006 22:57:18 GMT-0500 (CDT)';
	             *  dt.strLocale = 'Sun Sep 17 22:57:18 2006';
	             *  dateExtender.getTimezoneName(dt); //'CDT'
	             * @param dateObject the date to get the timezone from
	             *
	             * @returns {String} the timezone of the date
	             */
	            getTimezoneName: getTimezoneName,

	            /**
	             * Compares two dates
	             *
	             * @example
	             *
	             * var d1 = new Date();
	             * d1.setHours(0);
	             * dateExtender.compare(d1, d1); // 0
	             *
	             *  var d1 = new Date();
	             *  d1.setHours(0);
	             *  var d2 = new Date();
	             *  d2.setFullYear(2005);
	             *  d2.setHours(12);
	             *  dateExtender.compare(d1, d2, "date"); // 1
	             *  dateExtender.compare(d1, d2, "datetime"); // 1
	             *
	             *  var d1 = new Date();
	             *  d1.setHours(0);
	             *  var d2 = new Date();
	             *  d2.setFullYear(2005);
	             *  d2.setHours(12);
	             *  dateExtender.compare(d2, d1, "date"); // -1
	             *  dateExtender.compare(d1, d2, "time"); //-1
	             *
	             * @param {Date|String} date1 the date to comapare
	             * @param {Date|String} [date2=new Date()] the date to compare date1 againse
	             * @param {"date"|"time"|"datetime"} portion compares the portion specified
	             *
	             * @returns -1 if date1 is < date2 0 if date1 === date2  1 if date1 > date2
	             */
	            compare: function (/*Date*/date1, /*Date*/date2, /*String*/portion) {
	                date1 = new Date(+date1);
	                date2 = new Date(+(date2 || new Date()));

	                if (portion === "date") {
	                    // Ignore times and compare dates.
	                    date1.setHours(0, 0, 0, 0);
	                    date2.setHours(0, 0, 0, 0);
	                } else if (portion === "time") {
	                    // Ignore dates and compare times.
	                    date1.setFullYear(0, 0, 0);
	                    date2.setFullYear(0, 0, 0);
	                }
	                return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
	            },


	            /**
	             * Adds a specified interval and amount to a date
	             *
	             * @example
	             *  var dtA = new Date(2005, 11, 27);
	             *  dateExtender.add(dtA, "year", 1); //new Date(2006, 11, 27);
	             *  dateExtender.add(dtA, "years", 1); //new Date(2006, 11, 27);
	             *
	             *  dtA = new Date(2000, 0, 1);
	             *  dateExtender.add(dtA, "quarter", 1); //new Date(2000, 3, 1);
	             *  dateExtender.add(dtA, "quarters", 1); //new Date(2000, 3, 1);
	             *
	             *  dtA = new Date(2000, 0, 1);
	             *  dateExtender.add(dtA, "month", 1); //new Date(2000, 1, 1);
	             *  dateExtender.add(dtA, "months", 1); //new Date(2000, 1, 1);
	             *
	             *  dtA = new Date(2000, 0, 31);
	             *  dateExtender.add(dtA, "month", 1); //new Date(2000, 1, 29);
	             *  dateExtender.add(dtA, "months", 1); //new Date(2000, 1, 29);
	             *
	             *  dtA = new Date(2000, 0, 1);
	             *  dateExtender.add(dtA, "week", 1); //new Date(2000, 0, 8);
	             *  dateExtender.add(dtA, "weeks", 1); //new Date(2000, 0, 8);
	             *
	             *  dtA = new Date(2000, 0, 1);
	             *  dateExtender.add(dtA, "day", 1); //new Date(2000, 0, 2);
	             *
	             *  dtA = new Date(2000, 0, 1);
	             *  dateExtender.add(dtA, "weekday", 1); //new Date(2000, 0, 3);
	             *
	             *  dtA = new Date(2000, 0, 1, 11);
	             *  dateExtender.add(dtA, "hour", 1); //new Date(2000, 0, 1, 12);
	             *
	             *  dtA = new Date(2000, 11, 31, 23, 59);
	             *  dateExtender.add(dtA, "minute", 1); //new Date(2001, 0, 1, 0, 0);
	             *
	             *  dtA = new Date(2000, 11, 31, 23, 59, 59);
	             *  dateExtender.add(dtA, "second", 1); //new Date(2001, 0, 1, 0, 0, 0);
	             *
	             *  dtA = new Date(2000, 11, 31, 23, 59, 59, 999);
	             *  dateExtender.add(dtA, "millisecond", 1); //new Date(2001, 0, 1, 0, 0, 0, 0);
	             *
	             * @param {Date} date
	             * @param {String} interval the interval to add
	             *  <ul>
	             *      <li>day | days</li>
	             *      <li>weekday | weekdays</li>
	             *      <li>year | years</li>
	             *      <li>week | weeks</li>
	             *      <li>quarter | quarters</li>
	             *      <li>months | months</li>
	             *      <li>hour | hours</li>
	             *      <li>minute | minutes</li>
	             *      <li>second | seconds</li>
	             *      <li>millisecond | milliseconds</li>
	             *  </ul>
	             * @param {Number} [amount=0] the amount to add
	             */
	            add: function (/*Date*/date, /*String*/interval, /*int*/amount) {
	                var res = addTransform(interval, date, amount || 0);
	                amount = res[0];
	                var property = res[1];
	                var sum = new Date(+date);
	                var fixOvershoot = res[2];
	                if (property) {
	                    sum["set" + property](sum["get" + property]() + amount);
	                }

	                if (fixOvershoot && (sum.getDate() < date.getDate())) {
	                    sum.setDate(0);
	                }

	                return sum; // Date
	            },

	            /**
	             * Finds the difference between two dates based on the specified interval
	             *
	             * @example
	             *
	             * var dtA, dtB;
	             *
	             * dtA = new Date(2005, 11, 27);
	             * dtB = new Date(2006, 11, 27);
	             * dateExtender.difference(dtA, dtB, "year"); //1
	             *
	             * dtA = new Date(2000, 1, 29);
	             * dtB = new Date(2001, 2, 1);
	             * dateExtender.difference(dtA, dtB, "quarter"); //4
	             * dateExtender.difference(dtA, dtB, "month"); //13
	             *
	             * dtA = new Date(2000, 1, 1);
	             * dtB = new Date(2000, 1, 8);
	             * dateExtender.difference(dtA, dtB, "week"); //1
	             *
	             * dtA = new Date(2000, 1, 29);
	             * dtB = new Date(2000, 2, 1);
	             * dateExtender.difference(dtA, dtB, "day"); //1
	             *
	             * dtA = new Date(2006, 7, 3);
	             * dtB = new Date(2006, 7, 11);
	             * dateExtender.difference(dtA, dtB, "weekday"); //6
	             *
	             * dtA = new Date(2000, 11, 31, 23);
	             * dtB = new Date(2001, 0, 1, 0);
	             * dateExtender.difference(dtA, dtB, "hour"); //1
	             *
	             * dtA = new Date(2000, 11, 31, 23, 59);
	             * dtB = new Date(2001, 0, 1, 0, 0);
	             * dateExtender.difference(dtA, dtB, "minute"); //1
	             *
	             * dtA = new Date(2000, 11, 31, 23, 59, 59);
	             * dtB = new Date(2001, 0, 1, 0, 0, 0);
	             * dateExtender.difference(dtA, dtB, "second"); //1
	             *
	             * dtA = new Date(2000, 11, 31, 23, 59, 59, 999);
	             * dtB = new Date(2001, 0, 1, 0, 0, 0, 0);
	             * dateExtender.difference(dtA, dtB, "millisecond"); //1
	             *
	             *
	             * @param {Date} date1
	             * @param {Date} [date2 = new Date()]
	             * @param {String} [interval = "day"] the intercal to find the difference of.
	             *   <ul>
	             *      <li>day | days</li>
	             *      <li>weekday | weekdays</li>
	             *      <li>year | years</li>
	             *      <li>week | weeks</li>
	             *      <li>quarter | quarters</li>
	             *      <li>months | months</li>
	             *      <li>hour | hours</li>
	             *      <li>minute | minutes</li>
	             *      <li>second | seconds</li>
	             *      <li>millisecond | milliseconds</li>
	             *  </ul>
	             */
	            difference: function (/*Date*/date1, /*Date?*/date2, /*String*/interval, utc) {
	                date2 = date2 || new Date();
	                interval = interval || "day";
	                return differenceTransform(interval, date1, date2, utc);
	            },

	            /**
	             * Formats a date to the specidifed format string
	             *
	             * @example
	             *
	             * var date = new Date(2006, 7, 11, 0, 55, 12, 345);
	             * dateExtender.format(date, "EEEE, MMMM dd, yyyy"); //"Friday, August 11, 2006"
	             * dateExtender.format(date, "M/dd/yy"); //"8/11/06"
	             * dateExtender.format(date, "E"); //"6"
	             * dateExtender.format(date, "h:m a"); //"12:55 AM"
	             * dateExtender.format(date, 'h:m:s'); //"12:55:12"
	             * dateExtender.format(date, 'h:m:s.SS'); //"12:55:12.35"
	             * dateExtender.format(date, 'k:m:s.SS'); //"24:55:12.35"
	             * dateExtender.format(date, 'H:m:s.SS'); //"0:55:12.35"
	             * dateExtender.format(date, "ddMMyyyy"); //"11082006"
	             *
	             * @param date the date to format
	             * @param {String} format the format of the date composed of the following options
	             * <ul>
	             *                  <li> G    Era designator    Text    AD</li>
	             *                  <li> y    Year    Year    1996; 96</li>
	             *                  <li> M    Month in year    Month    July; Jul; 07</li>
	             *                  <li> w    Week in year    Number    27</li>
	             *                  <li> W    Week in month    Number    2</li>
	             *                  <li> D    Day in year    Number    189</li>
	             *                  <li> d    Day in month    Number    10</li>
	             *                  <li> E    Day in week    Text    Tuesday; Tue</li>
	             *                  <li> a    Am/pm marker    Text    PM</li>
	             *                  <li> H    Hour in day (0-23)    Number    0</li>
	             *                  <li> k    Hour in day (1-24)    Number    24</li>
	             *                  <li> K    Hour in am/pm (0-11)    Number    0</li>
	             *                  <li> h    Hour in am/pm (1-12)    Number    12</li>
	             *                  <li> m    Minute in hour    Number    30</li>
	             *                  <li> s    Second in minute    Number    55</li>
	             *                  <li> S    Millisecond    Number    978</li>
	             *                  <li> z    Time zone    General time zone    Pacific Standard Time; PST; GMT-08:00</li>
	             *                  <li> Z    Time zone    RFC 822 time zone    -0800 </li>
	             * </ul>
	             */
	            format: function (date, format, utc) {
	                utc = utc || false;
	                var fullYear, month, day, d, hour, minute, second, millisecond;
	                if (utc) {
	                    fullYear = date.getUTCFullYear();
	                    month = date.getUTCMonth();
	                    day = date.getUTCDay();
	                    d = date.getUTCDate();
	                    hour = date.getUTCHours();
	                    minute = date.getUTCMinutes();
	                    second = date.getUTCSeconds();
	                    millisecond = date.getUTCMilliseconds();
	                } else {
	                    fullYear = date.getFullYear();
	                    month = date.getMonth();
	                    d = date.getDate();
	                    day = date.getDay();
	                    hour = date.getHours();
	                    minute = date.getMinutes();
	                    second = date.getSeconds();
	                    millisecond = date.getMilliseconds();
	                }
	                return format.replace(/([A-Za-z])\1*/g, function (match) {
	                    var s, pad,
	                        c = match.charAt(0),
	                        l = match.length;
	                    if (c === 'd') {
	                        s = "" + d;
	                        pad = true;
	                    } else if (c === "H" && !s) {
	                        s = "" + hour;
	                        pad = true;
	                    } else if (c === 'm' && !s) {
	                        s = "" + minute;
	                        pad = true;
	                    } else if (c === 's') {
	                        if (!s) {
	                            s = "" + second;
	                        }
	                        pad = true;
	                    } else if (c === "G") {
	                        s = ((l < 4) ? eraAbbr : eraNames)[fullYear < 0 ? 0 : 1];
	                    } else if (c === "y") {
	                        s = fullYear;
	                        if (l > 1) {
	                            if (l === 2) {
	                                s = _truncate("" + s, 2, true);
	                            } else {
	                                pad = true;
	                            }
	                        }
	                    } else if (c.toUpperCase() === "Q") {
	                        s = ceil((month + 1) / 3);
	                        pad = true;
	                    } else if (c === "M") {
	                        if (l < 3) {
	                            s = month + 1;
	                            pad = true;
	                        } else {
	                            s = (l === 3 ? monthAbbr : monthNames)[month];
	                        }
	                    } else if (c === "w") {
	                        s = getWeekOfYear(date, 0, utc);
	                        pad = true;
	                    } else if (c === "D") {
	                        s = getDayOfYear(date, utc);
	                        pad = true;
	                    } else if (c === "E") {
	                        if (l < 3) {
	                            s = day + 1;
	                            pad = true;
	                        } else {
	                            s = (l === -3 ? dayAbbr : dayNames)[day];
	                        }
	                    } else if (c === 'a') {
	                        s = (hour < 12) ? 'AM' : 'PM';
	                    } else if (c === "h") {
	                        s = (hour % 12) || 12;
	                        pad = true;
	                    } else if (c === "K") {
	                        s = (hour % 12);
	                        pad = true;
	                    } else if (c === "k") {
	                        s = hour || 24;
	                        pad = true;
	                    } else if (c === "S") {
	                        s = round(millisecond * pow(10, l - 3));
	                        pad = true;
	                    } else if (c === "z" || c === "v" || c === "Z") {
	                        s = getTimezoneName(date);
	                        if ((c === "z" || c === "v") && !s) {
	                            l = 4;
	                        }
	                        if (!s || c === "Z") {
	                            var offset = date.getTimezoneOffset();
	                            var tz = [
	                                (offset >= 0 ? "-" : "+"),
	                                _pad(floor(abs(offset) / 60), 2, "0"),
	                                _pad(abs(offset) % 60, 2, "0")
	                            ];
	                            if (l === 4) {
	                                tz.splice(0, 0, "GMT");
	                                tz.splice(3, 0, ":");
	                            }
	                            s = tz.join("");
	                        }
	                    } else {
	                        s = match;
	                    }
	                    if (pad) {
	                        s = _pad(s, l, '0');
	                    }
	                    return s;
	                });
	            }

	        };

	        var numberDate = {};

	        function addInterval(interval) {
	            numberDate[interval + "sFromNow"] = function (val) {
	                return date.add(new Date(), interval, val);
	            };
	            numberDate[interval + "sAgo"] = function (val) {
	                return date.add(new Date(), interval, -val);
	            };
	        }

	        var intervals = ["year", "month", "day", "hour", "minute", "second"];
	        for (var i = 0, l = intervals.length; i < l; i++) {
	            addInterval(intervals[i]);
	        }

	        var stringDate = {

	            parseDate: function (dateStr, format) {
	                if (!format) {
	                    throw new Error('format required when calling dateExtender.parse');
	                }
	                var tokens = [], regexp = buildDateEXP(format, tokens),
	                    re = new RegExp("^" + regexp + "$", "i"),
	                    match = re.exec(dateStr);
	                if (!match) {
	                    return null;
	                } // null
	                var result = [1970, 0, 1, 0, 0, 0, 0], // will get converted to a Date at the end
	                    amPm = "",
	                    valid = every(match, function (v, i) {
	                        if (i) {
	                            var token = tokens[i - 1];
	                            var l = token.length, type = token.charAt(0);
	                            if (type === 'y') {
	                                if (v < 100) {
	                                    v = parseInt(v, 10);
	                                    //choose century to apply, according to a sliding window
	                                    //of 80 years before and 20 years after present year
	                                    var year = '' + new Date().getFullYear(),
	                                        century = year.substring(0, 2) * 100,
	                                        cutoff = min(year.substring(2, 4) + 20, 99);
	                                    result[0] = (v < cutoff) ? century + v : century - 100 + v;
	                                } else {
	                                    result[0] = v;
	                                }
	                            } else if (type === "M") {
	                                if (l > 2) {
	                                    var months = monthNames, j, k;
	                                    if (l === 3) {
	                                        months = monthAbbr;
	                                    }
	                                    //Tolerate abbreviating period in month part
	                                    //Case-insensitive comparison
	                                    v = v.replace(".", "").toLowerCase();
	                                    var contains = false;
	                                    for (j = 0, k = months.length; j < k && !contains; j++) {
	                                        var s = months[j].replace(".", "").toLocaleLowerCase();
	                                        if (s === v) {
	                                            v = j;
	                                            contains = true;
	                                        }
	                                    }
	                                    if (!contains) {
	                                        return false;
	                                    }
	                                } else {
	                                    v--;
	                                }
	                                result[1] = v;
	                            } else if (type === "E" || type === "e") {
	                                var days = dayNames;
	                                if (l === 3) {
	                                    days = dayAbbr;
	                                }
	                                //Case-insensitive comparison
	                                v = v.toLowerCase();
	                                days = array.map(days, function (d) {
	                                    return d.toLowerCase();
	                                });
	                                var d = array.indexOf(days, v);
	                                if (d === -1) {
	                                    v = parseInt(v, 10);
	                                    if (isNaN(v) || v > days.length) {
	                                        return false;
	                                    }
	                                } else {
	                                    v = d;
	                                }
	                            } else if (type === 'D' || type === "d") {
	                                if (type === "D") {
	                                    result[1] = 0;
	                                }
	                                result[2] = v;
	                            } else if (type === "a") {
	                                var am = "am";
	                                var pm = "pm";
	                                var period = /\./g;
	                                v = v.replace(period, '').toLowerCase();
	                                // we might not have seen the hours field yet, so store the state and apply hour change later
	                                amPm = (v === pm) ? 'p' : (v === am) ? 'a' : '';
	                            } else if (type === "k" || type === "h" || type === "H" || type === "K") {
	                                if (type === "k" && (+v) === 24) {
	                                    v = 0;
	                                }
	                                result[3] = v;
	                            } else if (type === "m") {
	                                result[4] = v;
	                            } else if (type === "s") {
	                                result[5] = v;
	                            } else if (type === "S") {
	                                result[6] = v;
	                            }
	                        }
	                        return true;
	                    });
	                if (valid) {
	                    var hours = +result[3];
	                    //account for am/pm
	                    if (amPm === 'p' && hours < 12) {
	                        result[3] = hours + 12; //e.g., 3pm -> 15
	                    } else if (amPm === 'a' && hours === 12) {
	                        result[3] = 0; //12am -> 0
	                    }
	                    var dateObject = new Date(result[0], result[1], result[2], result[3], result[4], result[5], result[6]); // Date
	                    var dateToken = (array.indexOf(tokens, 'd') !== -1),
	                        monthToken = (array.indexOf(tokens, 'M') !== -1),
	                        month = result[1],
	                        day = result[2],
	                        dateMonth = dateObject.getMonth(),
	                        dateDay = dateObject.getDate();
	                    if ((monthToken && dateMonth > month) || (dateToken && dateDay > day)) {
	                        return null;
	                    }
	                    return dateObject; // Date
	                } else {
	                    return null;
	                }
	            }
	        };


	        var ret = extended.define(is.isDate, date).define(is.isString, stringDate).define(is.isNumber, numberDate);
	        for (i in date) {
	            if (date.hasOwnProperty(i)) {
	                ret[i] = date[i];
	            }
	        }

	        for (i in stringDate) {
	            if (stringDate.hasOwnProperty(i)) {
	                ret[i] = stringDate[i];
	            }
	        }
	        for (i in numberDate) {
	            if (numberDate.hasOwnProperty(i)) {
	                ret[i] = numberDate[i];
	            }
	        }
	        return ret;
	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineDate(__webpack_require__(7), __webpack_require__(6), __webpack_require__(13));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extended", "is-extended", "array-extended"], function (extended, is, arr) {
	            return defineDate(extended, is, arr);
	        });
	    } else {
	        this.dateExtended = defineDate(this.extended, this.isExtended, this.arrayExtended);
	    }

	}).call(this);








/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("os");

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("stream");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var extended = __webpack_require__(5),
	    isUndefined = extended.isUndefined,
	    spreadArgs = extended.spreadArgs,
	    util = __webpack_require__(20),
	    out = process.stdout,
	    stream = __webpack_require__(18),
	    EMPTY = /^\s*(?:''|"")?\s*(?:,\s*(?:''|"")?\s*)*$/,
	    DEFAULT_DELIMITER = ",",
	    createParser = __webpack_require__(21),
	    fs = __webpack_require__(3),
	    StringDecoder = __webpack_require__(22).StringDecoder,
	    hasIsPaused = !!stream.Transform.prototype.isPaused;

	function ParserStream(options) {
	    options = options || {};
	    options.objectMode = extended.has(options, "objectMode") ? options.objectMode : true;
	    stream.Transform.call(this, options);
	    this.lines = "";
	    this.decoder = new StringDecoder();
	    this._parsedHeaders = false;
	    this._rowCount = -1;
	    this._emitData = false;
	    var delimiter;
	    if (extended.has(options, "delimiter")) {
	        delimiter = options.delimiter;
	        if (delimiter.length > 1) {
	            throw new Error("delimiter option must be one character long");
	        }
	        delimiter = extended.escape(delimiter);
	    } else {
	        delimiter = DEFAULT_DELIMITER;
	    }
	    options.delimiter = delimiter;
	    this.parser = createParser(options);
	    this._headers = options.headers;
	    this._ignoreEmpty = options.ignoreEmpty;
	    this._discardUnmappedColumns = options.discardUnmappedColumns;
	    this._strictColumnHandling = options.strictColumnHandling;
	    this.__objectMode = options.objectMode;
	    this.__buffered = [];
	    return this;
	}

	util.inherits(ParserStream, stream.Transform);

	var origOn = ParserStream.prototype.on,
	    origEmit = ParserStream.prototype.emit;


	extended(ParserStream).extend({

	    __pausedDone: null,

	    __endEmitted: false,

	    __emittedData: false,

	    __handleLine: function __parseLineData(line, index, ignore, next) {
	        var ignoreEmpty = this._ignoreEmpty, self = this;
	        if (extended.isBoolean(ignoreEmpty) && ignoreEmpty && (!line || EMPTY.test(line.join("")))) {
	            return next(null, null);
	        }
	        if (!ignore) {
	            this.__transform(line, function (err, line) {
	                if (err) {
	                    next(err);
	                } else {
	                    self.__validate(line, function (err, isValid, reason) {
	                        if (err) {
	                            next(err);
	                        } else if (isValid) {
	                            next(null, line);
	                        } else {
	                            self.emit("data-invalid", line, index, reason);
	                            next(null, null);
	                        }
	                    });
	                }
	            });
	        } else {
	            return next(null, line);
	        }
	    },

	    __processRows: function (rows, data, cb) {
	        var self = this, count;
	        extended.asyncEach(rows, function (row, cb) {
	            if (row) {
	                self.__handleLine(row, (count = ++self._rowCount), false, function (err, dataRow) {
	                    if (err) {
	                        cb(err);
	                    } else {
	                        if (dataRow) {
	                            if (!self.isStreamPaused()) {
	                                self.__emitRecord(dataRow, count);
	                            } else {
	                                self.__buffered.push([dataRow, count]);
	                            }
	                        } else {
	                            count = --self._rowCount;
	                        }
	                        cb();
	                    }
	                });
	            }
	        }, function (err) {
	            if (err) {
	                cb(err);
	            } else {
	                cb(null, data.line);
	            }
	        });
	    },

	    __processHeaders: function (rows, cb) {
	        var headers = this._headers,
	            discardUnmappedColumns = this._discardUnmappedColumns,
	            strictColumnHandling = this._strictColumnHandling,
	            self = this;

	        function headerHandler(err, headers) {
	            if (err) {
	                cb(err);
	            } else if (extended.isArray(headers)) {
	                var headersLength = headers.length,
	                    orig = self.__transform;
	                self.__transform = function (data, cb) {
	                    var ret = {}, i = -1, val;
	                    if (data.length > headersLength) {
	                        if (discardUnmappedColumns) {
	                            data.splice(headersLength);
	                        } else if (strictColumnHandling) {
	                            self.emit("data-invalid", data);
	                            return orig(null, cb);
	                        } else {
	                            self.emit("error", new Error("Unexpected Error: column header mismatch expected: " + headersLength + " columns got: " + data.length));
	                            return orig(null, cb);
	                        }
	                    } else if (strictColumnHandling && (data.length < headersLength)) {
	                        self.emit("data-invalid", data);
	                        return orig(null, cb);
	                    }
	                    while (++i < headersLength) {
	                        if (isUndefined(headers[i])) {
	                          continue;
	                        }
	                        val = data[i];
	                        ret[headers[i]] = isUndefined(val) ? '' : val;
	                    }

	                    return orig(ret, cb);
	                };
	            }
	            self._parsedHeaders = true;
	            cb(null);
	        }

	        if (extended.isBoolean(headers) && headers) {
	            this.__handleLine(rows.shift(), 0, true, headerHandler);
	        } else {
	            headerHandler(null, headers);
	        }

	    },

	    _parse: function _parseLine(data, hasMoreData, cb) {
	        var rows, self = this;
	        try {
	            data = this.parser(data, hasMoreData);
	            rows = data.rows;
	            if (rows.length) {
	                if (!this._parsedHeaders) {
	                    this.__processHeaders(rows, function (err) {
	                        if (err) {
	                            cb(err);
	                        } else {
	                            self.__processRows(rows, data, cb);
	                        }
	                    });
	                } else {
	                    this.__processRows(rows, data, cb);
	                }
	            } else {
	                cb(null, data.line);
	            }
	        } catch (e) {
	            cb(e);
	        }
	    },

	    __emitRecord: function (dataRow, count) {
	        if (this._emitData) {
	            this.push(this.__objectMode ? dataRow : JSON.stringify(dataRow));
	        }
	    },

	    _transform: function (data, encoding, done) {
	        var lines = this.lines,
	            lineData = (lines + this.decoder.write(data)),
	            self = this;
	        if (lineData.length > 1) {
	            this._parse(lineData, true, function (err, lineData) {
	                if (err) {
	                    done(err);
	                } else {
	                    self.lines = lineData;
	                    if (!self.isStreamPaused()) {
	                        done();
	                    } else {
	                        self.__pausedDone = done;
	                    }
	                }
	            });
	        } else {
	            this.lines = lineData;
	            if (!this.isStreamPaused()) {
	                done();
	            } else {
	                this.__pausedDone = done;
	            }
	        }

	    },

	    __doFlush: function (callback) {
	        try {
	            callback();
	        } catch (e) {
	            callback(e);
	        }
	    },

	    _flush: function (callback) {
	        var self = this;
	        if (this.lines) {
	            this._parse(this.lines, false, function (err) {
	                if (err) {
	                    callback(err);
	                } else if (!self.isStreamPaused()) {
	                    self.__doFlush(callback);
	                } else {
	                    self.__pausedDone = function () {
	                        self.__doFlush(callback);
	                    };
	                }
	            });
	        } else {
	            if (!this.isStreamPaused()) {
	                this.__doFlush(callback);
	            } else {
	                this.__pausedDone = function () {
	                    self.__doFlush(callback);
	                };
	            }
	        }
	    },

	    __validate: function (data, next) {
	        return next(null, true);
	    },

	    __transform: function (data, next) {
	        return next(null, data);
	    },

	    __flushPausedBuffer: function () {
	        var buffered = this.__buffered, l = buffered.length;
	        if (l) {
	            var entry;
	            while (buffered.length) {
	                entry = buffered.shift();
	                this.__emitRecord(entry[0], entry[1]);
	                //handle case where paused is called while emitting data
	                if (this.isStreamPaused()) {
	                    return;
	                }
	            }
	            buffered.length = 0;
	        }
	        if (this.__pausedDone) {
	            var done = this.__pausedDone;
	            this.__pausedDone = null;
	            done();
	        }
	    },

	    isStreamPaused: function () {
	        return this.__paused;
	    },

	    emit: function (event) {
	        if (event === "end") {
	            if (!this.__endEmitted) {
	                this.__endEmitted = true;
	                spreadArgs(origEmit, ["end", ++this._rowCount], this);
	            }
	        } else {
	            if (!hasIsPaused) {
	                if (event === "pause") {
	                    this.__paused = true;
	                } else if (event === "resume") {
	                    this.__paused = false;
	                    this.__flushPausedBuffer();
	                }
	            }
	            spreadArgs(origEmit, arguments, this);
	        }
	    },

	    on: function (evt) {
	        if (evt === "data" || evt === "readable") {
	            this._emitData = true;
	        }
	        spreadArgs(origOn, arguments, this);
	        return this;
	    },

	    validate: function (cb) {
	        if (!extended.isFunction(cb)) {
	            this.emit("error", new TypeError("fast-csv.Parser#validate requires a function"));
	        }
	        if (cb.length === 2) {
	            this.__validate = cb;
	        } else {
	            this.__validate = function (data, next) {
	                return next(null, cb(data));
	            };
	        }
	        return this;
	    },
	    transform: function (cb) {
	        if (!extended.isFunction(cb)) {
	            this.emit("error", new TypeError("fast-csv.Parser#transform requires a function"));
	        }
	        if (cb.length === 2) {
	            this.__transform = cb;
	        } else {
	            this.__transform = function (data, next) {
	                return next(null, cb(data));
	            };
	        }
	        return this;
	    }

	});

	module.exports = ParserStream;


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var extended = __webpack_require__(5),
	    has = extended.has,
	    isUndefinedOrNull = extended.isUndefinedOrNull,
	    trim = extended.trim,
	    trimLeft = extended.trimLeft,
	    trimRight = extended.trimRight;

	function createParser(options) {
	    options = options || {};
	    var delimiter = options.delimiter || ",",
	        doLtrim = options.ltrim || false,
	        doRtrim = options.rtrim || false,
	        doTrim = options.trim || false,
	        ESCAPE = has(options, "quote") ? options.quote : '"',
	        VALUE_REGEXP = new RegExp("([^" + delimiter + "'\"\\s\\\\]*(?:\\s+[^" + delimiter + "'\"\\s\\\\]+)*)"),
	        SEARCH_REGEXP = new RegExp("(?:\\n|\\r|" + delimiter + ")"),
	        ESCAPE_CHAR = options.escape || '"',
	        NEXT_TOKEN_REGEXP = new RegExp("([^\\s]|\\r\\n|\\n|\\r|" + delimiter + ")"),
	        ROW_DELIMITER = /(\r\n|\n|\r)/,
	        SPACE_CHAR_REGEX = new RegExp("(?!" + delimiter + ") "),
	        COMMENT, hasComments;
	    if (has(options, "comment")) {
	        COMMENT = options.comment;
	        hasComments = true;
	    }

	    function formatItem(item) {
	        if (doTrim) {
	            item = trim(item);
	        } else if (doLtrim) {
	            item = trimLeft(item);
	        } else if (doRtrim) {
	            item = trimRight(item);
	        }
	        return item;
	    }

	    function parseEscapedItem(str, items, cursor, hasMoreData) {
	        var depth = 0, ret = [];
	        var startPushing = false, token, i = 0, l = str.length, escapeIsEscape = ESCAPE_CHAR === ESCAPE;
	        if (l) {
	            while (cursor < l && (token = str.charAt(cursor))) {
	                if (token === ESCAPE) {
	                    if (!startPushing) {
	                        depth++;
	                        startPushing = true;
	                    } else if (escapeIsEscape && str.charAt(cursor + 1) === ESCAPE) {
	                        cursor++;
	                        ret[i++] = token;
	                    } else if (!escapeIsEscape && ret[i - 1] === ESCAPE_CHAR) {
	                        ret[i - 1] = token;
	                    } else {
	                        if (!(--depth)) {
	                            ++cursor;
	                            break;
	                        }
	                    }
	                } else {
	                    ret[i++] = token;
	                }
	                ++cursor;
	            }
	        }
	        ret = ret.join("");
	        var next = getNextToken(str, cursor),
	            nextToken = next.token;
	        if (nextToken && nextToken.search(delimiter) === 0) {
	            if (hasMoreData && (next.cursor + 1) >= l) {
	                cursor = null;
	            } else {
	                cursor++;
	            }
	        } else if (depth && !nextToken) {
	            if (hasMoreData) {
	                cursor = null;
	            } else {
	                throw new Error("Parse Error: expected: '" + ESCAPE + "' got: '" + nextToken + "'. at '" + str.substr(cursor).replace(/[r\n]/g, "\\n" + "'"));
	            }
	        } else if ((!depth && nextToken && nextToken.search(SEARCH_REGEXP) === -1)) {
	            throw new Error("Parse Error: expected: '" + ESCAPE + "' got: '" + nextToken + "'. at '" + str.substr(cursor, 10).replace(/[\r\n]/g, "\\n" + "'"));
	        } else if (hasMoreData && (!nextToken || !ROW_DELIMITER.test(nextToken))) {
	            cursor = null;
	        }
	        if (cursor !== null) {
	            items.push(formatItem(ret));
	        }
	        return cursor;
	    }

	    function parseCommentLine(line, cursor, hasMoreData) {
	        var nextIndex = line.substr(cursor).search(ROW_DELIMITER);
	        if (nextIndex === -1) {
	            if (hasMoreData) {
	                nextIndex = null;
	            } else {
	                nextIndex = line.length + 1;
	            }
	        } else {
	            nextIndex = (cursor + nextIndex) + 1; //go past the next line break
	        }
	        return nextIndex;
	    }

	    function parseItem(line, items, cursor, hasMoreData) {
	        var searchStr = line.substr(cursor),
	            nextIndex = searchStr.search(SEARCH_REGEXP);
	        if (nextIndex === -1) {
	            if (!VALUE_REGEXP.test(searchStr)) {
	                throw new Error("Parse Error: delimiter '" + delimiter + "' not found at '" + searchStr.replace(/\n/g, "\\n" + "'"));
	            } else {
	                nextIndex = searchStr.length;
	            }
	        }
	        var nextChar = searchStr.charAt(nextIndex);
	        if (nextChar.search(delimiter) !== -1) {
	            if (hasMoreData && (cursor + (nextIndex + 1) >= line.length)) {
	                cursor = null;
	            } else {
	                items.push(formatItem(searchStr.substr(0, nextIndex)));
	                cursor += nextIndex + 1;

	                var cursorChar = line.charAt(cursor);
	                // if ends with a delimiter, append an empty element, unless strict column handling
	                if (!options.strictColumnHandling && (ROW_DELIMITER.test(cursorChar) || cursor >= line.length)) {
	                    items.push('');
	                }
	                // if ends with empty space that is not a delimiter, append an empty space, unless strict column handling
	                if (!options.strictColumnHandling && SPACE_CHAR_REGEX.test(cursorChar) && !hasMoreData) {
	                    items.push(cursorChar);
	                }
	            }
	        } else if (ROW_DELIMITER.test(nextChar)) {
	            items.push(formatItem(searchStr.substr(0, nextIndex)));
	            cursor += nextIndex;
	        } else if (!hasMoreData) {
	            items.push(formatItem(searchStr.substr(0, nextIndex)));
	            cursor += nextIndex + 1;
	        } else {
	            cursor = null;
	        }

	        return cursor;
	    }

	    function getNextToken(line, cursor) {
	        var token, nextIndex, subStr = line.substr(cursor);
	        if ((nextIndex = subStr.search(NEXT_TOKEN_REGEXP)) !== -1) {
	            token = line[cursor += nextIndex];
	            cursor += subStr.match(NEXT_TOKEN_REGEXP)[1].length - 1;
	        }
	        return {token: token, cursor: cursor};
	    }

	    return function parseLine(line, hasMoreData) {
	        var i = 0, l = line.length, rows = [], items = [], token, nextToken, cursor, lastLineI = 0;
	        while (i < l) {
	            nextToken = getNextToken(line, i);
	            token = nextToken.token;
	            if (isUndefinedOrNull(token)) {
	                i = lastLineI;
	                cursor = null;
	                break;
	            } else if (ROW_DELIMITER.test(token)) {
	                i = nextToken.cursor + 1;
	                if (i < l) {
	                    rows.push(items);
	                    items = [];
	                    lastLineI = i;
	                } else {
	                    break;
	                }
	            } else if (hasComments && token === COMMENT) {
	                cursor = parseCommentLine(line, i, hasMoreData);
	                if (cursor === null) {
	                    i = lastLineI;
	                    break;
	                } else if (cursor < l) {
	                    lastLineI = i = cursor;
	                } else {
	                    i = cursor;
	                    cursor = null;
	                    break;
	                }
	            } else {
	                if (token === ESCAPE) {
	                    cursor = parseEscapedItem(line, items, nextToken.cursor, hasMoreData);
	                } else {
	                    cursor = parseItem(line, items, i, hasMoreData);
	                }
	                if (cursor === null) {
	                    i = lastLineI;
	                    break;
	                } else {
	                    i = cursor;
	                }
	            }

	        }
	        cursor !== null && rows.push(items);
	        return {line: line.substr(i), rows: rows};
	    };

	}
	module.exports = createParser;


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("string_decoder");

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(3),
	    extended = __webpack_require__(5),
	    escape = extended.escape,
	    stream = __webpack_require__(18),
	    LINE_BREAK = extended.LINE_BREAK,
	    CsvTransformStream = __webpack_require__(24);


	function createWriteStream(options) {
	    return new CsvTransformStream(options);
	}

	function write(arr, options, ws) {
	    var csvStream = createWriteStream(options), i = -1, l = arr.length;
	    extended.asyncEach(arr, function (item, cb) {
	        csvStream.write(item, null, cb);
	    }, function (err) {
	        if (err) {
	            csvStream.emit("error", err);
	        } else {
	            csvStream.end();
	        }
	    });
	    return csvStream;
	}

	function writeToStream(ws, arr, options) {
	    return write(arr, options).pipe(ws);
	}

	function writeToString(arr, options, cb) {
	    if (extended.isFunction(options)) {
	        cb = options;
	        options = {};
	    }
	    var ws = new stream.Writable(), written = [];
	    ws._write = function (data, enc, cb) {
	        written.push(data + "");
	        cb();
	    };
	    ws
	        .on("error", cb)
	        .on("finish", function () {
	            cb(null, written.join(""));
	        });
	    write(arr, options).pipe(ws);
	}


	function writeToBuffer(arr, options, cb) {
	    if (extended.isFunction(options)) {
	        cb = options;
	        options = {};
	    }
	    var ws = new stream.Writable(), buffers = [], l = 0;
	    ws._write = function (data, enc, cb) {
	        buffers.push(data);
	        l++;
	        cb();
	    };
	    ws
	        .on("error", cb)
	        .on("finish", function () {
	            cb(null, Buffer.concat(buffers));
	        });
	    write(arr, options).pipe(ws);
	}

	function writeToPath(path, arr, options) {
	    var stream = fs.createWriteStream(path, {encoding: "utf8"});
	    return write(arr, options).pipe(stream);
	}

	createWriteStream.writeToBuffer = writeToBuffer;
	createWriteStream.write = write;
	createWriteStream.createWriteStream = createWriteStream;
	createWriteStream.writeToString = writeToString;
	createWriteStream.writeToPath = writeToPath;
	createWriteStream.writeToStream = writeToStream;
	module.exports = createWriteStream;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(3),
	    util = __webpack_require__(20),
	    extended = __webpack_require__(5),
	    escape = extended.escape,
	    isArray = extended.isArray,
	    has = extended.has,
	    stream = __webpack_require__(18),
	    Transform = stream.Transform,
	    LINE_BREAK = extended.LINE_BREAK,
	    formatter = __webpack_require__(25),
	    createFormatter = formatter.createFormatter,
	    checkHeaders = formatter.checkHeaders,
	    transformItem = formatter.transformItem,
	    defaultTransform = formatter.defaultTransform;

	function CsvTransformStream(options) {
	    options = options || {};
	    options.objectMode = true;

	    if (has(options, "transform")) {
	        // remove so its not set to _transform in Transform constructor
	        options.consumerTransform = options.transform;
	        delete options.transform;
	    }

	    Transform.call(this, options);
	    this.formatter = createFormatter(options, this);
	    this.rowDelimiter = options.rowDelimiter || "\n";
	    var hasHeaders = has(options, "headers") ? !!options.headers : null,
	        headers = (hasHeaders && isArray(options.headers)) ? options.headers : null;
	    this.hasHeaders = hasHeaders;
	    this.headers = headers;
	    if (hasHeaders) {
	        if (headers) {
	            this.parsedHeaders = true;
	            this.headersLength = headers.length;
	        } else {
	            this.parsedHeaders = false;
	        }
	    }
	    this.hasWrittenHeaders = hasHeaders ? false : true;
	    this.includeEndRowDelimiter = !!options.includeEndRowDelimiter,
	    has(options, "consumerTransform") && this.transform(options.consumerTransform);
	}
	util.inherits(CsvTransformStream, Transform);

	extended(CsvTransformStream).extend({

	    headers: null,

	    headersLength: 0,

	    totalCount: 0,

	    _transform: function (item, encoding, cb) {
	        var self = this;
	        this.__transform(item, function (err, item) {
	            if (err) {
	                cb(err);
	            } else {
	                if (checkHeaders(self, item)) {
	                    self.push(new Buffer(transformItem(self, item), "utf8"));
	                }
	                cb();
	            }
	        });
	    },

	    __transform: defaultTransform,

	    transform: function (cb) {
	        if (!extended.isFunction(cb)) {
	            this.emit("error", new TypeError("fast-csv.FormatterStream#transform requires a function"));
	        }
	        if (cb.length === 2) {
	            this.__transform = cb;
	        } else {
	            this.__transform = function (data, next) {
	                next(null, cb(data));
	            };
	        }
	        return this;
	    },

	    _flush: function (cb) {
	        if (this.includeEndRowDelimiter) {
	            this.push(this.rowDelimiter);
	        }
	        cb();
	    }
	});

	module.exports = CsvTransformStream;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(3),
	    extended = __webpack_require__(5),
	    has = extended.has,
	    isBoolean = extended.isBoolean,
	    isUndefinedOrNull = extended.isUndefinedOrNull,
	    escape = extended.escape,
	    isArray = extended.isArray,
	    keys = extended.keys,
	    stream = __webpack_require__(18),
	    LINE_BREAK = extended.LINE_BREAK;

	function createQuoteChecker(stream, quoteColumns, quoteHeaders) {
	    var shouldQuote;
	    if (isBoolean(quoteColumns)) {
	        if (isBoolean(quoteHeaders)) {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return (isHeader ? quoteHeaders : quoteColumns);
	            };
	        } else if (isArray(quoteHeaders)) {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return isHeader ? quoteHeaders[index] : quoteColumns;
	            };
	        } else {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return isHeader ? quoteHeaders[stream.headers[index]] : quoteColumns;
	            };
	        }
	    } else if (isArray(quoteColumns)) {
	        if (isBoolean(quoteHeaders)) {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return isHeader ? quoteHeaders : quoteColumns[index];
	            };
	        } else {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return isHeader ? quoteHeaders[index] : quoteColumns[index];
	            };
	        }
	    } else {
	        if (isBoolean(quoteHeaders)) {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return isHeader ? quoteHeaders : quoteColumns[stream.headers[index]];
	            };
	        } else {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return isHeader ? quoteHeaders[stream.headers[index]] : quoteColumns[stream.headers[index]];
	            };
	        }
	    }
	    return shouldQuote;
	}

	function createFormatter(options, stream) {
	    options = options || {};
	    var delimiter = options.delimiter || ",",
	        ESCAPE_REGEXP = new RegExp("[" + delimiter + escape(options.rowDelimiter || LINE_BREAK) + "']"),
	        QUOTE = options.quote || '"',
	        ESCAPE = options.escape || '"',
	        REPLACE_REGEXP = new RegExp(QUOTE, "g"),
	        quoteColumns = has(options, "quoteColumns") ? options.quoteColumns : false,
	        quoteHeaders = has(options, "quoteHeaders") ? options.quoteHeaders : quoteColumns,
	        shouldQuote = createQuoteChecker(stream, quoteColumns, quoteHeaders);


	    function escapeField(field, index, isHeader) {
	        var escape;
	        field = field.replace(/\0/g, '');
	        if ((escape = field.indexOf(QUOTE) !== -1)) {
	            field = field.replace(REPLACE_REGEXP, ESCAPE + QUOTE);
	            escape = true;
	        } else {
	            escape = field.search(ESCAPE_REGEXP) !== -1;
	        }
	        escape = escape || shouldQuote(index, isHeader);
	        if (escape) {
	            field = [QUOTE + field + QUOTE];
	        } else {
	            field = [field];
	        }
	        return field.join("");
	    }

	    return function escapeFields(fields, isHeader) {
	        var i = -1, l = fields.length, ret = [], field;
	        while (++i < l) {
	            field = fields[i];
	            field = (isUndefinedOrNull(field) ? "" : field) + "";
	            ret.push(escapeField(field, i, isHeader));
	        }
	        return ret.join(delimiter);
	    };
	}

	function defaultTransform(row, cb) {
	    return cb(null, row);
	}


	function isHashArray(arr) {
	    return isArray(arr) && isArray(arr[0]) && arr[0].length === 2;
	}

	//get headers from a row item
	function gatherHeaders(item) {
	    var ret, i, l;
	    if (isHashArray(item)) {
	        //lets assume a multidimesional array with item 0 bing the title
	        i = -1;
	        l = item.length;
	        ret = [];
	        while (++i < l) {
	            ret[i] = item[i][0];
	        }
	    } else if (isArray(item)) {
	        ret = item;
	    } else {
	        ret = keys(item);
	    }
	    return ret;
	}

	//check if we need to write header return true if we should also write a row
	//could be false if headers is true and the header row(first item) is passed in
	function checkHeaders(stream, item) {
	    var headers, ret = true;
	    if (!stream.parsedHeaders) {
	        stream.parsedHeaders = true;
	        headers = stream.headers = gatherHeaders(item);
	        stream.headersLength = headers.length;
	    }
	    if (!stream.hasWrittenHeaders) {
	        stream.totalCount++;
	        stream.push(new Buffer(stream.formatter(stream.headers, true), "utf8"));
	        stream.hasWrittenHeaders = true;
	        ret = isHashArray(item) || !isArray(item);
	    }
	    return ret;
	}

	//transform an object into a CSV row
	function transformHashData(stream, item) {
	    var vals = [], row = [], headers = stream.headers, i = -1, headersLength = stream.headersLength;
	    if (stream.totalCount++) {
	        row.push(stream.rowDelimiter);
	    }
	    while (++i < headersLength) {
	        vals[i] = item[headers[i]];
	    }
	    row.push(stream.formatter(vals));
	    return row.join("");
	}

	//transform an array into a CSV row
	function transformArrayData(stream, item, cb) {
	    var row = [];
	    if (stream.totalCount++) {
	        row.push(stream.rowDelimiter);
	    }
	    row.push(stream.formatter(item));
	    return row.join("");
	}

	//transform an array of two item arrays into a CSV row
	function transformHashArrayData(stream, item) {
	    var vals = [], row = [], i = -1, headersLength = stream.headersLength;
	    if (stream.totalCount++) {
	        row.push(stream.rowDelimiter);
	    }
	    while (++i < headersLength) {
	        vals[i] = item[i][1];
	    }
	    row.push(stream.formatter(vals));
	    return row.join("");
	}

	//wrapper to determin what transform to run
	function transformItem(stream, item) {
	    var ret;
	    if (isArray(item)) {
	        if (isHashArray(item)) {
	            ret = transformHashArrayData(stream, item);
	        } else {
	            ret = transformArrayData(stream, item);
	        }
	    } else {
	        ret = transformHashData(stream, item);
	    }
	    return ret;
	}

	exports.createFormatter = createFormatter;
	exports.transformItem = transformItem;
	exports.checkHeaders = checkHeaders;
	exports.defaultTransform = defaultTransform;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	//  Ramda v0.22.1
	//  https://github.com/ramda/ramda
	//  (c) 2013-2016 Scott Sauyet, Michael Hurley, and David Chambers
	//  Ramda may be freely distributed under the MIT license.

	;(function() {

	  'use strict';

	  /**
	     * A special placeholder value used to specify "gaps" within curried functions,
	     * allowing partial application of any combination of arguments, regardless of
	     * their positions.
	     *
	     * If `g` is a curried ternary function and `_` is `R.__`, the following are
	     * equivalent:
	     *
	     *   - `g(1, 2, 3)`
	     *   - `g(_, 2, 3)(1)`
	     *   - `g(_, _, 3)(1)(2)`
	     *   - `g(_, _, 3)(1, 2)`
	     *   - `g(_, 2, _)(1, 3)`
	     *   - `g(_, 2)(1)(3)`
	     *   - `g(_, 2)(1, 3)`
	     *   - `g(_, 2)(_, 3)(1)`
	     *
	     * @constant
	     * @memberOf R
	     * @since v0.6.0
	     * @category Function
	     * @example
	     *
	     *      var greet = R.replace('{name}', R.__, 'Hello, {name}!');
	     *      greet('Alice'); //=> 'Hello, Alice!'
	     */
	    var __ = { '@@functional/placeholder': true };

	    /* eslint-disable no-unused-vars */
	    var _arity = function _arity(n, fn) {
	        /* eslint-disable no-unused-vars */
	        switch (n) {
	        case 0:
	            return function () {
	                return fn.apply(this, arguments);
	            };
	        case 1:
	            return function (a0) {
	                return fn.apply(this, arguments);
	            };
	        case 2:
	            return function (a0, a1) {
	                return fn.apply(this, arguments);
	            };
	        case 3:
	            return function (a0, a1, a2) {
	                return fn.apply(this, arguments);
	            };
	        case 4:
	            return function (a0, a1, a2, a3) {
	                return fn.apply(this, arguments);
	            };
	        case 5:
	            return function (a0, a1, a2, a3, a4) {
	                return fn.apply(this, arguments);
	            };
	        case 6:
	            return function (a0, a1, a2, a3, a4, a5) {
	                return fn.apply(this, arguments);
	            };
	        case 7:
	            return function (a0, a1, a2, a3, a4, a5, a6) {
	                return fn.apply(this, arguments);
	            };
	        case 8:
	            return function (a0, a1, a2, a3, a4, a5, a6, a7) {
	                return fn.apply(this, arguments);
	            };
	        case 9:
	            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
	                return fn.apply(this, arguments);
	            };
	        case 10:
	            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
	                return fn.apply(this, arguments);
	            };
	        default:
	            throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
	        }
	    };

	    var _arrayFromIterator = function _arrayFromIterator(iter) {
	        var list = [];
	        var next;
	        while (!(next = iter.next()).done) {
	            list.push(next.value);
	        }
	        return list;
	    };

	    var _arrayOf = function _arrayOf() {
	        return Array.prototype.slice.call(arguments);
	    };

	    var _cloneRegExp = function _cloneRegExp(pattern) {
	        return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
	    };

	    var _complement = function _complement(f) {
	        return function () {
	            return !f.apply(this, arguments);
	        };
	    };

	    /**
	     * Private `concat` function to merge two array-like objects.
	     *
	     * @private
	     * @param {Array|Arguments} [set1=[]] An array-like object.
	     * @param {Array|Arguments} [set2=[]] An array-like object.
	     * @return {Array} A new, merged array.
	     * @example
	     *
	     *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
	     */
	    var _concat = function _concat(set1, set2) {
	        set1 = set1 || [];
	        set2 = set2 || [];
	        var idx;
	        var len1 = set1.length;
	        var len2 = set2.length;
	        var result = [];
	        idx = 0;
	        while (idx < len1) {
	            result[result.length] = set1[idx];
	            idx += 1;
	        }
	        idx = 0;
	        while (idx < len2) {
	            result[result.length] = set2[idx];
	            idx += 1;
	        }
	        return result;
	    };

	    var _containsWith = function _containsWith(pred, x, list) {
	        var idx = 0;
	        var len = list.length;
	        while (idx < len) {
	            if (pred(x, list[idx])) {
	                return true;
	            }
	            idx += 1;
	        }
	        return false;
	    };

	    var _filter = function _filter(fn, list) {
	        var idx = 0;
	        var len = list.length;
	        var result = [];
	        while (idx < len) {
	            if (fn(list[idx])) {
	                result[result.length] = list[idx];
	            }
	            idx += 1;
	        }
	        return result;
	    };

	    var _forceReduced = function _forceReduced(x) {
	        return {
	            '@@transducer/value': x,
	            '@@transducer/reduced': true
	        };
	    };

	    // String(x => x) evaluates to "x => x", so the pattern may not match.
	    var _functionName = function _functionName(f) {
	        // String(x => x) evaluates to "x => x", so the pattern may not match.
	        var match = String(f).match(/^function (\w*)/);
	        return match == null ? '' : match[1];
	    };

	    var _has = function _has(prop, obj) {
	        return Object.prototype.hasOwnProperty.call(obj, prop);
	    };

	    var _identity = function _identity(x) {
	        return x;
	    };

	    var _isArguments = function () {
	        var toString = Object.prototype.toString;
	        return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
	            return toString.call(x) === '[object Arguments]';
	        } : function _isArguments(x) {
	            return _has('callee', x);
	        };
	    }();

	    /**
	     * Tests whether or not an object is an array.
	     *
	     * @private
	     * @param {*} val The object to test.
	     * @return {Boolean} `true` if `val` is an array, `false` otherwise.
	     * @example
	     *
	     *      _isArray([]); //=> true
	     *      _isArray(null); //=> false
	     *      _isArray({}); //=> false
	     */
	    var _isArray = Array.isArray || function _isArray(val) {
	        return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
	    };

	    var _isFunction = function _isFunction(x) {
	        return Object.prototype.toString.call(x) === '[object Function]';
	    };

	    /**
	     * Determine if the passed argument is an integer.
	     *
	     * @private
	     * @param {*} n
	     * @category Type
	     * @return {Boolean}
	     */
	    var _isInteger = Number.isInteger || function _isInteger(n) {
	        return n << 0 === n;
	    };

	    var _isNumber = function _isNumber(x) {
	        return Object.prototype.toString.call(x) === '[object Number]';
	    };

	    var _isObject = function _isObject(x) {
	        return Object.prototype.toString.call(x) === '[object Object]';
	    };

	    var _isPlaceholder = function _isPlaceholder(a) {
	        return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
	    };

	    var _isRegExp = function _isRegExp(x) {
	        return Object.prototype.toString.call(x) === '[object RegExp]';
	    };

	    var _isString = function _isString(x) {
	        return Object.prototype.toString.call(x) === '[object String]';
	    };

	    var _isTransformer = function _isTransformer(obj) {
	        return typeof obj['@@transducer/step'] === 'function';
	    };

	    var _map = function _map(fn, functor) {
	        var idx = 0;
	        var len = functor.length;
	        var result = Array(len);
	        while (idx < len) {
	            result[idx] = fn(functor[idx]);
	            idx += 1;
	        }
	        return result;
	    };

	    // Based on https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	    var _objectAssign = function _objectAssign(target) {
	        if (target == null) {
	            throw new TypeError('Cannot convert undefined or null to object');
	        }
	        var output = Object(target);
	        var idx = 1;
	        var length = arguments.length;
	        while (idx < length) {
	            var source = arguments[idx];
	            if (source != null) {
	                for (var nextKey in source) {
	                    if (_has(nextKey, source)) {
	                        output[nextKey] = source[nextKey];
	                    }
	                }
	            }
	            idx += 1;
	        }
	        return output;
	    };

	    var _of = function _of(x) {
	        return [x];
	    };

	    var _pipe = function _pipe(f, g) {
	        return function () {
	            return g.call(this, f.apply(this, arguments));
	        };
	    };

	    var _pipeP = function _pipeP(f, g) {
	        return function () {
	            var ctx = this;
	            return f.apply(ctx, arguments).then(function (x) {
	                return g.call(ctx, x);
	            });
	        };
	    };

	    // \b matches word boundary; [\b] matches backspace
	    var _quote = function _quote(s) {
	        var escaped = s.replace(/\\/g, '\\\\').replace(/[\b]/g, '\\b')    // \b matches word boundary; [\b] matches backspace
	    .replace(/\f/g, '\\f').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
	        return '"' + escaped.replace(/"/g, '\\"') + '"';
	    };

	    var _reduced = function _reduced(x) {
	        return x && x['@@transducer/reduced'] ? x : {
	            '@@transducer/value': x,
	            '@@transducer/reduced': true
	        };
	    };

	    /**
	     * An optimized, private array `slice` implementation.
	     *
	     * @private
	     * @param {Arguments|Array} args The array or arguments object to consider.
	     * @param {Number} [from=0] The array index to slice from, inclusive.
	     * @param {Number} [to=args.length] The array index to slice to, exclusive.
	     * @return {Array} A new, sliced array.
	     * @example
	     *
	     *      _slice([1, 2, 3, 4, 5], 1, 3); //=> [2, 3]
	     *
	     *      var firstThreeArgs = function(a, b, c, d) {
	     *        return _slice(arguments, 0, 3);
	     *      };
	     *      firstThreeArgs(1, 2, 3, 4); //=> [1, 2, 3]
	     */
	    var _slice = function _slice(args, from, to) {
	        switch (arguments.length) {
	        case 1:
	            return _slice(args, 0, args.length);
	        case 2:
	            return _slice(args, from, args.length);
	        default:
	            var list = [];
	            var idx = 0;
	            var len = Math.max(0, Math.min(args.length, to) - from);
	            while (idx < len) {
	                list[idx] = args[from + idx];
	                idx += 1;
	            }
	            return list;
	        }
	    };

	    /**
	     * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
	     */
	    var _toISOString = function () {
	        var pad = function pad(n) {
	            return (n < 10 ? '0' : '') + n;
	        };
	        return typeof Date.prototype.toISOString === 'function' ? function _toISOString(d) {
	            return d.toISOString();
	        } : function _toISOString(d) {
	            return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + '.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
	        };
	    }();

	    var _xfBase = {
	        init: function () {
	            return this.xf['@@transducer/init']();
	        },
	        result: function (result) {
	            return this.xf['@@transducer/result'](result);
	        }
	    };

	    var _xwrap = function () {
	        function XWrap(fn) {
	            this.f = fn;
	        }
	        XWrap.prototype['@@transducer/init'] = function () {
	            throw new Error('init not implemented on XWrap');
	        };
	        XWrap.prototype['@@transducer/result'] = function (acc) {
	            return acc;
	        };
	        XWrap.prototype['@@transducer/step'] = function (acc, x) {
	            return this.f(acc, x);
	        };
	        return function _xwrap(fn) {
	            return new XWrap(fn);
	        };
	    }();

	    var _aperture = function _aperture(n, list) {
	        var idx = 0;
	        var limit = list.length - (n - 1);
	        var acc = new Array(limit >= 0 ? limit : 0);
	        while (idx < limit) {
	            acc[idx] = _slice(list, idx, idx + n);
	            idx += 1;
	        }
	        return acc;
	    };

	    var _assign = typeof Object.assign === 'function' ? Object.assign : _objectAssign;

	    /**
	     * Similar to hasMethod, this checks whether a function has a [methodname]
	     * function. If it isn't an array it will execute that function otherwise it
	     * will default to the ramda implementation.
	     *
	     * @private
	     * @param {Function} fn ramda implemtation
	     * @param {String} methodname property to check for a custom implementation
	     * @return {Object} Whatever the return value of the method is.
	     */
	    var _checkForMethod = function _checkForMethod(methodname, fn) {
	        return function () {
	            var length = arguments.length;
	            if (length === 0) {
	                return fn();
	            }
	            var obj = arguments[length - 1];
	            return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, _slice(arguments, 0, length - 1));
	        };
	    };

	    /**
	     * Optimized internal one-arity curry function.
	     *
	     * @private
	     * @category Function
	     * @param {Function} fn The function to curry.
	     * @return {Function} The curried function.
	     */
	    var _curry1 = function _curry1(fn) {
	        return function f1(a) {
	            if (arguments.length === 0 || _isPlaceholder(a)) {
	                return f1;
	            } else {
	                return fn.apply(this, arguments);
	            }
	        };
	    };

	    /**
	     * Optimized internal two-arity curry function.
	     *
	     * @private
	     * @category Function
	     * @param {Function} fn The function to curry.
	     * @return {Function} The curried function.
	     */
	    var _curry2 = function _curry2(fn) {
	        return function f2(a, b) {
	            switch (arguments.length) {
	            case 0:
	                return f2;
	            case 1:
	                return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
	                    return fn(a, _b);
	                });
	            default:
	                return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
	                    return fn(_a, b);
	                }) : _isPlaceholder(b) ? _curry1(function (_b) {
	                    return fn(a, _b);
	                }) : fn(a, b);
	            }
	        };
	    };

	    /**
	     * Optimized internal three-arity curry function.
	     *
	     * @private
	     * @category Function
	     * @param {Function} fn The function to curry.
	     * @return {Function} The curried function.
	     */
	    var _curry3 = function _curry3(fn) {
	        return function f3(a, b, c) {
	            switch (arguments.length) {
	            case 0:
	                return f3;
	            case 1:
	                return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
	                    return fn(a, _b, _c);
	                });
	            case 2:
	                return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
	                    return fn(_a, b, _c);
	                }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
	                    return fn(a, _b, _c);
	                }) : _curry1(function (_c) {
	                    return fn(a, b, _c);
	                });
	            default:
	                return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
	                    return fn(_a, _b, c);
	                }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
	                    return fn(_a, b, _c);
	                }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
	                    return fn(a, _b, _c);
	                }) : _isPlaceholder(a) ? _curry1(function (_a) {
	                    return fn(_a, b, c);
	                }) : _isPlaceholder(b) ? _curry1(function (_b) {
	                    return fn(a, _b, c);
	                }) : _isPlaceholder(c) ? _curry1(function (_c) {
	                    return fn(a, b, _c);
	                }) : fn(a, b, c);
	            }
	        };
	    };

	    /**
	     * Internal curryN function.
	     *
	     * @private
	     * @category Function
	     * @param {Number} length The arity of the curried function.
	     * @param {Array} received An array of arguments received thus far.
	     * @param {Function} fn The function to curry.
	     * @return {Function} The curried function.
	     */
	    var _curryN = function _curryN(length, received, fn) {
	        return function () {
	            var combined = [];
	            var argsIdx = 0;
	            var left = length;
	            var combinedIdx = 0;
	            while (combinedIdx < received.length || argsIdx < arguments.length) {
	                var result;
	                if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
	                    result = received[combinedIdx];
	                } else {
	                    result = arguments[argsIdx];
	                    argsIdx += 1;
	                }
	                combined[combinedIdx] = result;
	                if (!_isPlaceholder(result)) {
	                    left -= 1;
	                }
	                combinedIdx += 1;
	            }
	            return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
	        };
	    };

	    /**
	     * Returns a function that dispatches with different strategies based on the
	     * object in list position (last argument). If it is an array, executes [fn].
	     * Otherwise, if it has a function with [methodname], it will execute that
	     * function (functor case). Otherwise, if it is a transformer, uses transducer
	     * [xf] to return a new transformer (transducer case). Otherwise, it will
	     * default to executing [fn].
	     *
	     * @private
	     * @param {String} methodname property to check for a custom implementation
	     * @param {Function} xf transducer to initialize if object is transformer
	     * @param {Function} fn default ramda implementation
	     * @return {Function} A function that dispatches on object in list position
	     */
	    var _dispatchable = function _dispatchable(methodname, xf, fn) {
	        return function () {
	            var length = arguments.length;
	            if (length === 0) {
	                return fn();
	            }
	            var obj = arguments[length - 1];
	            if (!_isArray(obj)) {
	                var args = _slice(arguments, 0, length - 1);
	                if (typeof obj[methodname] === 'function') {
	                    return obj[methodname].apply(obj, args);
	                }
	                if (_isTransformer(obj)) {
	                    var transducer = xf.apply(null, args);
	                    return transducer(obj);
	                }
	            }
	            return fn.apply(this, arguments);
	        };
	    };

	    var _dropLastWhile = function dropLastWhile(pred, list) {
	        var idx = list.length - 1;
	        while (idx >= 0 && pred(list[idx])) {
	            idx -= 1;
	        }
	        return _slice(list, 0, idx + 1);
	    };

	    var _xall = function () {
	        function XAll(f, xf) {
	            this.xf = xf;
	            this.f = f;
	            this.all = true;
	        }
	        XAll.prototype['@@transducer/init'] = _xfBase.init;
	        XAll.prototype['@@transducer/result'] = function (result) {
	            if (this.all) {
	                result = this.xf['@@transducer/step'](result, true);
	            }
	            return this.xf['@@transducer/result'](result);
	        };
	        XAll.prototype['@@transducer/step'] = function (result, input) {
	            if (!this.f(input)) {
	                this.all = false;
	                result = _reduced(this.xf['@@transducer/step'](result, false));
	            }
	            return result;
	        };
	        return _curry2(function _xall(f, xf) {
	            return new XAll(f, xf);
	        });
	    }();

	    var _xany = function () {
	        function XAny(f, xf) {
	            this.xf = xf;
	            this.f = f;
	            this.any = false;
	        }
	        XAny.prototype['@@transducer/init'] = _xfBase.init;
	        XAny.prototype['@@transducer/result'] = function (result) {
	            if (!this.any) {
	                result = this.xf['@@transducer/step'](result, false);
	            }
	            return this.xf['@@transducer/result'](result);
	        };
	        XAny.prototype['@@transducer/step'] = function (result, input) {
	            if (this.f(input)) {
	                this.any = true;
	                result = _reduced(this.xf['@@transducer/step'](result, true));
	            }
	            return result;
	        };
	        return _curry2(function _xany(f, xf) {
	            return new XAny(f, xf);
	        });
	    }();

	    var _xaperture = function () {
	        function XAperture(n, xf) {
	            this.xf = xf;
	            this.pos = 0;
	            this.full = false;
	            this.acc = new Array(n);
	        }
	        XAperture.prototype['@@transducer/init'] = _xfBase.init;
	        XAperture.prototype['@@transducer/result'] = function (result) {
	            this.acc = null;
	            return this.xf['@@transducer/result'](result);
	        };
	        XAperture.prototype['@@transducer/step'] = function (result, input) {
	            this.store(input);
	            return this.full ? this.xf['@@transducer/step'](result, this.getCopy()) : result;
	        };
	        XAperture.prototype.store = function (input) {
	            this.acc[this.pos] = input;
	            this.pos += 1;
	            if (this.pos === this.acc.length) {
	                this.pos = 0;
	                this.full = true;
	            }
	        };
	        XAperture.prototype.getCopy = function () {
	            return _concat(_slice(this.acc, this.pos), _slice(this.acc, 0, this.pos));
	        };
	        return _curry2(function _xaperture(n, xf) {
	            return new XAperture(n, xf);
	        });
	    }();

	    var _xdrop = function () {
	        function XDrop(n, xf) {
	            this.xf = xf;
	            this.n = n;
	        }
	        XDrop.prototype['@@transducer/init'] = _xfBase.init;
	        XDrop.prototype['@@transducer/result'] = _xfBase.result;
	        XDrop.prototype['@@transducer/step'] = function (result, input) {
	            if (this.n > 0) {
	                this.n -= 1;
	                return result;
	            }
	            return this.xf['@@transducer/step'](result, input);
	        };
	        return _curry2(function _xdrop(n, xf) {
	            return new XDrop(n, xf);
	        });
	    }();

	    var _xdropLast = function () {
	        function XDropLast(n, xf) {
	            this.xf = xf;
	            this.pos = 0;
	            this.full = false;
	            this.acc = new Array(n);
	        }
	        XDropLast.prototype['@@transducer/init'] = _xfBase.init;
	        XDropLast.prototype['@@transducer/result'] = function (result) {
	            this.acc = null;
	            return this.xf['@@transducer/result'](result);
	        };
	        XDropLast.prototype['@@transducer/step'] = function (result, input) {
	            if (this.full) {
	                result = this.xf['@@transducer/step'](result, this.acc[this.pos]);
	            }
	            this.store(input);
	            return result;
	        };
	        XDropLast.prototype.store = function (input) {
	            this.acc[this.pos] = input;
	            this.pos += 1;
	            if (this.pos === this.acc.length) {
	                this.pos = 0;
	                this.full = true;
	            }
	        };
	        return _curry2(function _xdropLast(n, xf) {
	            return new XDropLast(n, xf);
	        });
	    }();

	    var _xdropRepeatsWith = function () {
	        function XDropRepeatsWith(pred, xf) {
	            this.xf = xf;
	            this.pred = pred;
	            this.lastValue = undefined;
	            this.seenFirstValue = false;
	        }
	        XDropRepeatsWith.prototype['@@transducer/init'] = function () {
	            return this.xf['@@transducer/init']();
	        };
	        XDropRepeatsWith.prototype['@@transducer/result'] = function (result) {
	            return this.xf['@@transducer/result'](result);
	        };
	        XDropRepeatsWith.prototype['@@transducer/step'] = function (result, input) {
	            var sameAsLast = false;
	            if (!this.seenFirstValue) {
	                this.seenFirstValue = true;
	            } else if (this.pred(this.lastValue, input)) {
	                sameAsLast = true;
	            }
	            this.lastValue = input;
	            return sameAsLast ? result : this.xf['@@transducer/step'](result, input);
	        };
	        return _curry2(function _xdropRepeatsWith(pred, xf) {
	            return new XDropRepeatsWith(pred, xf);
	        });
	    }();

	    var _xdropWhile = function () {
	        function XDropWhile(f, xf) {
	            this.xf = xf;
	            this.f = f;
	        }
	        XDropWhile.prototype['@@transducer/init'] = _xfBase.init;
	        XDropWhile.prototype['@@transducer/result'] = _xfBase.result;
	        XDropWhile.prototype['@@transducer/step'] = function (result, input) {
	            if (this.f) {
	                if (this.f(input)) {
	                    return result;
	                }
	                this.f = null;
	            }
	            return this.xf['@@transducer/step'](result, input);
	        };
	        return _curry2(function _xdropWhile(f, xf) {
	            return new XDropWhile(f, xf);
	        });
	    }();

	    var _xfilter = function () {
	        function XFilter(f, xf) {
	            this.xf = xf;
	            this.f = f;
	        }
	        XFilter.prototype['@@transducer/init'] = _xfBase.init;
	        XFilter.prototype['@@transducer/result'] = _xfBase.result;
	        XFilter.prototype['@@transducer/step'] = function (result, input) {
	            return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
	        };
	        return _curry2(function _xfilter(f, xf) {
	            return new XFilter(f, xf);
	        });
	    }();

	    var _xfind = function () {
	        function XFind(f, xf) {
	            this.xf = xf;
	            this.f = f;
	            this.found = false;
	        }
	        XFind.prototype['@@transducer/init'] = _xfBase.init;
	        XFind.prototype['@@transducer/result'] = function (result) {
	            if (!this.found) {
	                result = this.xf['@@transducer/step'](result, void 0);
	            }
	            return this.xf['@@transducer/result'](result);
	        };
	        XFind.prototype['@@transducer/step'] = function (result, input) {
	            if (this.f(input)) {
	                this.found = true;
	                result = _reduced(this.xf['@@transducer/step'](result, input));
	            }
	            return result;
	        };
	        return _curry2(function _xfind(f, xf) {
	            return new XFind(f, xf);
	        });
	    }();

	    var _xfindIndex = function () {
	        function XFindIndex(f, xf) {
	            this.xf = xf;
	            this.f = f;
	            this.idx = -1;
	            this.found = false;
	        }
	        XFindIndex.prototype['@@transducer/init'] = _xfBase.init;
	        XFindIndex.prototype['@@transducer/result'] = function (result) {
	            if (!this.found) {
	                result = this.xf['@@transducer/step'](result, -1);
	            }
	            return this.xf['@@transducer/result'](result);
	        };
	        XFindIndex.prototype['@@transducer/step'] = function (result, input) {
	            this.idx += 1;
	            if (this.f(input)) {
	                this.found = true;
	                result = _reduced(this.xf['@@transducer/step'](result, this.idx));
	            }
	            return result;
	        };
	        return _curry2(function _xfindIndex(f, xf) {
	            return new XFindIndex(f, xf);
	        });
	    }();

	    var _xfindLast = function () {
	        function XFindLast(f, xf) {
	            this.xf = xf;
	            this.f = f;
	        }
	        XFindLast.prototype['@@transducer/init'] = _xfBase.init;
	        XFindLast.prototype['@@transducer/result'] = function (result) {
	            return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.last));
	        };
	        XFindLast.prototype['@@transducer/step'] = function (result, input) {
	            if (this.f(input)) {
	                this.last = input;
	            }
	            return result;
	        };
	        return _curry2(function _xfindLast(f, xf) {
	            return new XFindLast(f, xf);
	        });
	    }();

	    var _xfindLastIndex = function () {
	        function XFindLastIndex(f, xf) {
	            this.xf = xf;
	            this.f = f;
	            this.idx = -1;
	            this.lastIdx = -1;
	        }
	        XFindLastIndex.prototype['@@transducer/init'] = _xfBase.init;
	        XFindLastIndex.prototype['@@transducer/result'] = function (result) {
	            return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.lastIdx));
	        };
	        XFindLastIndex.prototype['@@transducer/step'] = function (result, input) {
	            this.idx += 1;
	            if (this.f(input)) {
	                this.lastIdx = this.idx;
	            }
	            return result;
	        };
	        return _curry2(function _xfindLastIndex(f, xf) {
	            return new XFindLastIndex(f, xf);
	        });
	    }();

	    var _xmap = function () {
	        function XMap(f, xf) {
	            this.xf = xf;
	            this.f = f;
	        }
	        XMap.prototype['@@transducer/init'] = _xfBase.init;
	        XMap.prototype['@@transducer/result'] = _xfBase.result;
	        XMap.prototype['@@transducer/step'] = function (result, input) {
	            return this.xf['@@transducer/step'](result, this.f(input));
	        };
	        return _curry2(function _xmap(f, xf) {
	            return new XMap(f, xf);
	        });
	    }();

	    var _xreduceBy = function () {
	        function XReduceBy(valueFn, valueAcc, keyFn, xf) {
	            this.valueFn = valueFn;
	            this.valueAcc = valueAcc;
	            this.keyFn = keyFn;
	            this.xf = xf;
	            this.inputs = {};
	        }
	        XReduceBy.prototype['@@transducer/init'] = _xfBase.init;
	        XReduceBy.prototype['@@transducer/result'] = function (result) {
	            var key;
	            for (key in this.inputs) {
	                if (_has(key, this.inputs)) {
	                    result = this.xf['@@transducer/step'](result, this.inputs[key]);
	                    if (result['@@transducer/reduced']) {
	                        result = result['@@transducer/value'];
	                        break;
	                    }
	                }
	            }
	            this.inputs = null;
	            return this.xf['@@transducer/result'](result);
	        };
	        XReduceBy.prototype['@@transducer/step'] = function (result, input) {
	            var key = this.keyFn(input);
	            this.inputs[key] = this.inputs[key] || [
	                key,
	                this.valueAcc
	            ];
	            this.inputs[key][1] = this.valueFn(this.inputs[key][1], input);
	            return result;
	        };
	        return _curryN(4, [], function _xreduceBy(valueFn, valueAcc, keyFn, xf) {
	            return new XReduceBy(valueFn, valueAcc, keyFn, xf);
	        });
	    }();

	    var _xtake = function () {
	        function XTake(n, xf) {
	            this.xf = xf;
	            this.n = n;
	            this.i = 0;
	        }
	        XTake.prototype['@@transducer/init'] = _xfBase.init;
	        XTake.prototype['@@transducer/result'] = _xfBase.result;
	        XTake.prototype['@@transducer/step'] = function (result, input) {
	            this.i += 1;
	            var ret = this.n === 0 ? result : this.xf['@@transducer/step'](result, input);
	            return this.i >= this.n ? _reduced(ret) : ret;
	        };
	        return _curry2(function _xtake(n, xf) {
	            return new XTake(n, xf);
	        });
	    }();

	    var _xtakeWhile = function () {
	        function XTakeWhile(f, xf) {
	            this.xf = xf;
	            this.f = f;
	        }
	        XTakeWhile.prototype['@@transducer/init'] = _xfBase.init;
	        XTakeWhile.prototype['@@transducer/result'] = _xfBase.result;
	        XTakeWhile.prototype['@@transducer/step'] = function (result, input) {
	            return this.f(input) ? this.xf['@@transducer/step'](result, input) : _reduced(result);
	        };
	        return _curry2(function _xtakeWhile(f, xf) {
	            return new XTakeWhile(f, xf);
	        });
	    }();

	    /**
	     * Adds two values.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Math
	     * @sig Number -> Number -> Number
	     * @param {Number} a
	     * @param {Number} b
	     * @return {Number}
	     * @see R.subtract
	     * @example
	     *
	     *      R.add(2, 3);       //=>  5
	     *      R.add(7)(10);      //=> 17
	     */
	    var add = _curry2(function add(a, b) {
	        return Number(a) + Number(b);
	    });

	    /**
	     * Applies a function to the value at the given index of an array, returning a
	     * new copy of the array with the element at the given index replaced with the
	     * result of the function application.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.14.0
	     * @category List
	     * @sig (a -> a) -> Number -> [a] -> [a]
	     * @param {Function} fn The function to apply.
	     * @param {Number} idx The index.
	     * @param {Array|Arguments} list An array-like object whose value
	     *        at the supplied index will be replaced.
	     * @return {Array} A copy of the supplied array-like object with
	     *         the element at index `idx` replaced with the value
	     *         returned by applying `fn` to the existing element.
	     * @see R.update
	     * @example
	     *
	     *      R.adjust(R.add(10), 1, [0, 1, 2]);     //=> [0, 11, 2]
	     *      R.adjust(R.add(10))(1)([0, 1, 2]);     //=> [0, 11, 2]
	     */
	    var adjust = _curry3(function adjust(fn, idx, list) {
	        if (idx >= list.length || idx < -list.length) {
	            return list;
	        }
	        var start = idx < 0 ? list.length : 0;
	        var _idx = start + idx;
	        var _list = _concat(list);
	        _list[_idx] = fn(list[_idx]);
	        return _list;
	    });

	    /**
	     * Returns `true` if all elements of the list match the predicate, `false` if
	     * there are any that don't.
	     *
	     * Dispatches to the `all` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> Boolean
	     * @param {Function} fn The predicate function.
	     * @param {Array} list The array to consider.
	     * @return {Boolean} `true` if the predicate is satisfied by every element, `false`
	     *         otherwise.
	     * @see R.any, R.none, R.transduce
	     * @example
	     *
	     *      var lessThan2 = R.flip(R.lt)(2);
	     *      var lessThan3 = R.flip(R.lt)(3);
	     *      R.all(lessThan2)([1, 2]); //=> false
	     *      R.all(lessThan3)([1, 2]); //=> true
	     */
	    var all = _curry2(_dispatchable('all', _xall, function all(fn, list) {
	        var idx = 0;
	        while (idx < list.length) {
	            if (!fn(list[idx])) {
	                return false;
	            }
	            idx += 1;
	        }
	        return true;
	    }));

	    /**
	     * Returns a function that always returns the given value. Note that for
	     * non-primitives the value returned is a reference to the original value.
	     *
	     * This function is known as `const`, `constant`, or `K` (for K combinator) in
	     * other languages and libraries.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig a -> (* -> a)
	     * @param {*} val The value to wrap in a function
	     * @return {Function} A Function :: * -> val.
	     * @example
	     *
	     *      var t = R.always('Tee');
	     *      t(); //=> 'Tee'
	     */
	    var always = _curry1(function always(val) {
	        return function () {
	            return val;
	        };
	    });

	    /**
	     * Returns `true` if both arguments are `true`; `false` otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Logic
	     * @sig * -> * -> *
	     * @param {Boolean} a A boolean value
	     * @param {Boolean} b A boolean value
	     * @return {Boolean} `true` if both arguments are `true`, `false` otherwise
	     * @see R.both
	     * @example
	     *
	     *      R.and(true, true); //=> true
	     *      R.and(true, false); //=> false
	     *      R.and(false, true); //=> false
	     *      R.and(false, false); //=> false
	     */
	    var and = _curry2(function and(a, b) {
	        return a && b;
	    });

	    /**
	     * Returns `true` if at least one of elements of the list match the predicate,
	     * `false` otherwise.
	     *
	     * Dispatches to the `any` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> Boolean
	     * @param {Function} fn The predicate function.
	     * @param {Array} list The array to consider.
	     * @return {Boolean} `true` if the predicate is satisfied by at least one element, `false`
	     *         otherwise.
	     * @see R.all, R.none, R.transduce
	     * @example
	     *
	     *      var lessThan0 = R.flip(R.lt)(0);
	     *      var lessThan2 = R.flip(R.lt)(2);
	     *      R.any(lessThan0)([1, 2]); //=> false
	     *      R.any(lessThan2)([1, 2]); //=> true
	     */
	    var any = _curry2(_dispatchable('any', _xany, function any(fn, list) {
	        var idx = 0;
	        while (idx < list.length) {
	            if (fn(list[idx])) {
	                return true;
	            }
	            idx += 1;
	        }
	        return false;
	    }));

	    /**
	     * Returns a new list, composed of n-tuples of consecutive elements If `n` is
	     * greater than the length of the list, an empty list is returned.
	     *
	     * Dispatches to the `aperture` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.12.0
	     * @category List
	     * @sig Number -> [a] -> [[a]]
	     * @param {Number} n The size of the tuples to create
	     * @param {Array} list The list to split into `n`-tuples
	     * @return {Array} The new list.
	     * @see R.transduce
	     * @example
	     *
	     *      R.aperture(2, [1, 2, 3, 4, 5]); //=> [[1, 2], [2, 3], [3, 4], [4, 5]]
	     *      R.aperture(3, [1, 2, 3, 4, 5]); //=> [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
	     *      R.aperture(7, [1, 2, 3, 4, 5]); //=> []
	     */
	    var aperture = _curry2(_dispatchable('aperture', _xaperture, _aperture));

	    /**
	     * Returns a new list containing the contents of the given list, followed by
	     * the given element.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig a -> [a] -> [a]
	     * @param {*} el The element to add to the end of the new list.
	     * @param {Array} list The list whose contents will be added to the beginning of the output
	     *        list.
	     * @return {Array} A new list containing the contents of the old list followed by `el`.
	     * @see R.prepend
	     * @example
	     *
	     *      R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
	     *      R.append('tests', []); //=> ['tests']
	     *      R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
	     */
	    var append = _curry2(function append(el, list) {
	        return _concat(list, [el]);
	    });

	    /**
	     * Applies function `fn` to the argument list `args`. This is useful for
	     * creating a fixed-arity function from a variadic function. `fn` should be a
	     * bound function if context is significant.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.7.0
	     * @category Function
	     * @sig (*... -> a) -> [*] -> a
	     * @param {Function} fn
	     * @param {Array} args
	     * @return {*}
	     * @see R.call, R.unapply
	     * @example
	     *
	     *      var nums = [1, 2, 3, -99, 42, 6, 7];
	     *      R.apply(Math.max, nums); //=> 42
	     */
	    var apply = _curry2(function apply(fn, args) {
	        return fn.apply(this, args);
	    });

	    /**
	     * Makes a shallow clone of an object, setting or overriding the specified
	     * property with the given value. Note that this copies and flattens prototype
	     * properties onto the new object as well. All non-primitive properties are
	     * copied by reference.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.8.0
	     * @category Object
	     * @sig String -> a -> {k: v} -> {k: v}
	     * @param {String} prop the property name to set
	     * @param {*} val the new value
	     * @param {Object} obj the object to clone
	     * @return {Object} a new object similar to the original except for the specified property.
	     * @see R.dissoc
	     * @example
	     *
	     *      R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
	     */
	    var assoc = _curry3(function assoc(prop, val, obj) {
	        var result = {};
	        for (var p in obj) {
	            result[p] = obj[p];
	        }
	        result[prop] = val;
	        return result;
	    });

	    /**
	     * Makes a shallow clone of an object, setting or overriding the nodes required
	     * to create the given path, and placing the specific value at the tail end of
	     * that path. Note that this copies and flattens prototype properties onto the
	     * new object as well. All non-primitive properties are copied by reference.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.8.0
	     * @category Object
	     * @sig [String] -> a -> {k: v} -> {k: v}
	     * @param {Array} path the path to set
	     * @param {*} val the new value
	     * @param {Object} obj the object to clone
	     * @return {Object} a new object similar to the original except along the specified path.
	     * @see R.dissocPath
	     * @example
	     *
	     *      R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
	     */
	    var assocPath = _curry3(function assocPath(path, val, obj) {
	        switch (path.length) {
	        case 0:
	            return val;
	        case 1:
	            return assoc(path[0], val, obj);
	        default:
	            return assoc(path[0], assocPath(_slice(path, 1), val, Object(obj[path[0]])), obj);
	        }
	    });

	    /**
	     * Creates a function that is bound to a context.
	     * Note: `R.bind` does not provide the additional argument-binding capabilities of
	     * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
	     *
	     * @func
	     * @memberOf R
	     * @since v0.6.0
	     * @category Function
	     * @category Object
	     * @sig (* -> *) -> {*} -> (* -> *)
	     * @param {Function} fn The function to bind to context
	     * @param {Object} thisObj The context to bind `fn` to
	     * @return {Function} A function that will execute in the context of `thisObj`.
	     * @see R.partial
	     * @example
	     *
	     *      var log = R.bind(console.log, console);
	     *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
	     *      // logs {a: 2}
	     */
	    var bind = _curry2(function bind(fn, thisObj) {
	        return _arity(fn.length, function () {
	            return fn.apply(thisObj, arguments);
	        });
	    });

	    /**
	     * Restricts a number to be within a range.
	     *
	     * Also works for other ordered types such as Strings and Dates.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.20.0
	     * @category Relation
	     * @sig Ord a => a -> a -> a -> a
	     * @param {Number} minimum number
	     * @param {Number} maximum number
	     * @param {Number} value to be clamped
	     * @return {Number} Returns the clamped value
	     * @example
	     *
	     *      R.clamp(1, 10, -1) // => 1
	     *      R.clamp(1, 10, 11) // => 10
	     *      R.clamp(1, 10, 4)  // => 4
	     */
	    var clamp = _curry3(function clamp(min, max, value) {
	        if (min > max) {
	            throw new Error('min must not be greater than max in clamp(min, max, value)');
	        }
	        return value < min ? min : value > max ? max : value;
	    });

	    /**
	     * Makes a comparator function out of a function that reports whether the first
	     * element is less than the second.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig (a, b -> Boolean) -> (a, b -> Number)
	     * @param {Function} pred A predicate function of arity two.
	     * @return {Function} A Function :: a -> b -> Int that returns `-1` if a < b, `1` if b < a, otherwise `0`.
	     * @example
	     *
	     *      var cmp = R.comparator((a, b) => a.age < b.age);
	     *      var people = [
	     *        // ...
	     *      ];
	     *      R.sort(cmp, people);
	     */
	    var comparator = _curry1(function comparator(pred) {
	        return function (a, b) {
	            return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
	        };
	    });

	    /**
	     * Returns a curried equivalent of the provided function, with the specified
	     * arity. The curried function has two unusual capabilities. First, its
	     * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
	     * following are equivalent:
	     *
	     *   - `g(1)(2)(3)`
	     *   - `g(1)(2, 3)`
	     *   - `g(1, 2)(3)`
	     *   - `g(1, 2, 3)`
	     *
	     * Secondly, the special placeholder value `R.__` may be used to specify
	     * "gaps", allowing partial application of any combination of arguments,
	     * regardless of their positions. If `g` is as above and `_` is `R.__`, the
	     * following are equivalent:
	     *
	     *   - `g(1, 2, 3)`
	     *   - `g(_, 2, 3)(1)`
	     *   - `g(_, _, 3)(1)(2)`
	     *   - `g(_, _, 3)(1, 2)`
	     *   - `g(_, 2)(1)(3)`
	     *   - `g(_, 2)(1, 3)`
	     *   - `g(_, 2)(_, 3)(1)`
	     *
	     * @func
	     * @memberOf R
	     * @since v0.5.0
	     * @category Function
	     * @sig Number -> (* -> a) -> (* -> a)
	     * @param {Number} length The arity for the returned function.
	     * @param {Function} fn The function to curry.
	     * @return {Function} A new, curried function.
	     * @see R.curry
	     * @example
	     *
	     *      var sumArgs = (...args) => R.sum(args);
	     *
	     *      var curriedAddFourNumbers = R.curryN(4, sumArgs);
	     *      var f = curriedAddFourNumbers(1, 2);
	     *      var g = f(3);
	     *      g(4); //=> 10
	     */
	    var curryN = _curry2(function curryN(length, fn) {
	        if (length === 1) {
	            return _curry1(fn);
	        }
	        return _arity(length, _curryN(length, [], fn));
	    });

	    /**
	     * Decrements its argument.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Math
	     * @sig Number -> Number
	     * @param {Number} n
	     * @return {Number}
	     * @see R.inc
	     * @example
	     *
	     *      R.dec(42); //=> 41
	     */
	    var dec = add(-1);

	    /**
	     * Returns the second argument if it is not `null`, `undefined` or `NaN`
	     * otherwise the first argument is returned.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.10.0
	     * @category Logic
	     * @sig a -> b -> a | b
	     * @param {a} val The default value.
	     * @param {b} val The value to return if it is not null or undefined
	     * @return {*} The the second value or the default value
	     * @example
	     *
	     *      var defaultTo42 = R.defaultTo(42);
	     *
	     *      defaultTo42(null);  //=> 42
	     *      defaultTo42(undefined);  //=> 42
	     *      defaultTo42('Ramda');  //=> 'Ramda'
	     *      defaultTo42(parseInt('string')); //=> 42
	     */
	    var defaultTo = _curry2(function defaultTo(d, v) {
	        return v == null || v !== v ? d : v;
	    });

	    /**
	     * Finds the set (i.e. no duplicates) of all elements in the first list not
	     * contained in the second list. Duplication is determined according to the
	     * value returned by applying the supplied predicate to two list elements.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig (a -> a -> Boolean) -> [*] -> [*] -> [*]
	     * @param {Function} pred A predicate used to test whether two items are equal.
	     * @param {Array} list1 The first list.
	     * @param {Array} list2 The second list.
	     * @return {Array} The elements in `list1` that are not in `list2`.
	     * @see R.difference, R.symmetricDifference, R.symmetricDifferenceWith
	     * @example
	     *
	     *      var cmp = (x, y) => x.a === y.a;
	     *      var l1 = [{a: 1}, {a: 2}, {a: 3}];
	     *      var l2 = [{a: 3}, {a: 4}];
	     *      R.differenceWith(cmp, l1, l2); //=> [{a: 1}, {a: 2}]
	     */
	    var differenceWith = _curry3(function differenceWith(pred, first, second) {
	        var out = [];
	        var idx = 0;
	        var firstLen = first.length;
	        while (idx < firstLen) {
	            if (!_containsWith(pred, first[idx], second) && !_containsWith(pred, first[idx], out)) {
	                out.push(first[idx]);
	            }
	            idx += 1;
	        }
	        return out;
	    });

	    /**
	     * Returns a new object that does not contain a `prop` property.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.10.0
	     * @category Object
	     * @sig String -> {k: v} -> {k: v}
	     * @param {String} prop the name of the property to dissociate
	     * @param {Object} obj the object to clone
	     * @return {Object} a new object similar to the original but without the specified property
	     * @see R.assoc
	     * @example
	     *
	     *      R.dissoc('b', {a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
	     */
	    var dissoc = _curry2(function dissoc(prop, obj) {
	        var result = {};
	        for (var p in obj) {
	            if (p !== prop) {
	                result[p] = obj[p];
	            }
	        }
	        return result;
	    });

	    /**
	     * Makes a shallow clone of an object, omitting the property at the given path.
	     * Note that this copies and flattens prototype properties onto the new object
	     * as well. All non-primitive properties are copied by reference.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.11.0
	     * @category Object
	     * @sig [String] -> {k: v} -> {k: v}
	     * @param {Array} path the path to set
	     * @param {Object} obj the object to clone
	     * @return {Object} a new object without the property at path
	     * @see R.assocPath
	     * @example
	     *
	     *      R.dissocPath(['a', 'b', 'c'], {a: {b: {c: 42}}}); //=> {a: {b: {}}}
	     */
	    var dissocPath = _curry2(function dissocPath(path, obj) {
	        switch (path.length) {
	        case 0:
	            return obj;
	        case 1:
	            return dissoc(path[0], obj);
	        default:
	            var head = path[0];
	            var tail = _slice(path, 1);
	            return obj[head] == null ? obj : assoc(head, dissocPath(tail, obj[head]), obj);
	        }
	    });

	    /**
	     * Divides two numbers. Equivalent to `a / b`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Math
	     * @sig Number -> Number -> Number
	     * @param {Number} a The first value.
	     * @param {Number} b The second value.
	     * @return {Number} The result of `a / b`.
	     * @see R.multiply
	     * @example
	     *
	     *      R.divide(71, 100); //=> 0.71
	     *
	     *      var half = R.divide(R.__, 2);
	     *      half(42); //=> 21
	     *
	     *      var reciprocal = R.divide(1);
	     *      reciprocal(4);   //=> 0.25
	     */
	    var divide = _curry2(function divide(a, b) {
	        return a / b;
	    });

	    /**
	     * Returns a new list excluding the leading elements of a given list which
	     * satisfy the supplied predicate function. It passes each value to the supplied
	     * predicate function, skipping elements while the predicate function returns
	     * `true`. The predicate function is applied to one argument: *(value)*.
	     *
	     * Dispatches to the `dropWhile` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> [a]
	     * @param {Function} fn The function called per iteration.
	     * @param {Array} list The collection to iterate over.
	     * @return {Array} A new array.
	     * @see R.takeWhile, R.transduce, R.addIndex
	     * @example
	     *
	     *      var lteTwo = x => x <= 2;
	     *
	     *      R.dropWhile(lteTwo, [1, 2, 3, 4, 3, 2, 1]); //=> [3, 4, 3, 2, 1]
	     */
	    var dropWhile = _curry2(_dispatchable('dropWhile', _xdropWhile, function dropWhile(pred, list) {
	        var idx = 0;
	        var len = list.length;
	        while (idx < len && pred(list[idx])) {
	            idx += 1;
	        }
	        return _slice(list, idx);
	    }));

	    /**
	     * Returns the empty value of its argument's type. Ramda defines the empty
	     * value of Array (`[]`), Object (`{}`), String (`''`), and Arguments. Other
	     * types are supported if they define `<Type>.empty` and/or
	     * `<Type>.prototype.empty`.
	     *
	     * Dispatches to the `empty` method of the first argument, if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.3.0
	     * @category Function
	     * @sig a -> a
	     * @param {*} x
	     * @return {*}
	     * @example
	     *
	     *      R.empty(Just(42));      //=> Nothing()
	     *      R.empty([1, 2, 3]);     //=> []
	     *      R.empty('unicorns');    //=> ''
	     *      R.empty({x: 1, y: 2});  //=> {}
	     */
	    // else
	    var empty = _curry1(function empty(x) {
	        return x != null && typeof x.empty === 'function' ? x.empty() : x != null && x.constructor != null && typeof x.constructor.empty === 'function' ? x.constructor.empty() : _isArray(x) ? [] : _isString(x) ? '' : _isObject(x) ? {} : _isArguments(x) ? function () {
	            return arguments;
	        }() : // else
	        void 0;
	    });

	    /**
	     * Creates a new object by recursively evolving a shallow copy of `object`,
	     * according to the `transformation` functions. All non-primitive properties
	     * are copied by reference.
	     *
	     * A `transformation` function will not be invoked if its corresponding key
	     * does not exist in the evolved object.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Object
	     * @sig {k: (v -> v)} -> {k: v} -> {k: v}
	     * @param {Object} transformations The object specifying transformation functions to apply
	     *        to the object.
	     * @param {Object} object The object to be transformed.
	     * @return {Object} The transformed object.
	     * @example
	     *
	     *      var tomato  = {firstName: '  Tomato ', data: {elapsed: 100, remaining: 1400}, id:123};
	     *      var transformations = {
	     *        firstName: R.trim,
	     *        lastName: R.trim, // Will not get invoked.
	     *        data: {elapsed: R.add(1), remaining: R.add(-1)}
	     *      };
	     *      R.evolve(transformations, tomato); //=> {firstName: 'Tomato', data: {elapsed: 101, remaining: 1399}, id:123}
	     */
	    var evolve = _curry2(function evolve(transformations, object) {
	        var result = {};
	        var transformation, key, type;
	        for (key in object) {
	            transformation = transformations[key];
	            type = typeof transformation;
	            result[key] = type === 'function' ? transformation(object[key]) : type === 'object' ? evolve(transformations[key], object[key]) : object[key];
	        }
	        return result;
	    });

	    /**
	     * Returns the first element of the list which matches the predicate, or
	     * `undefined` if no element matches.
	     *
	     * Dispatches to the `find` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> a | undefined
	     * @param {Function} fn The predicate function used to determine if the element is the
	     *        desired one.
	     * @param {Array} list The array to consider.
	     * @return {Object} The element found, or `undefined`.
	     * @see R.transduce
	     * @example
	     *
	     *      var xs = [{a: 1}, {a: 2}, {a: 3}];
	     *      R.find(R.propEq('a', 2))(xs); //=> {a: 2}
	     *      R.find(R.propEq('a', 4))(xs); //=> undefined
	     */
	    var find = _curry2(_dispatchable('find', _xfind, function find(fn, list) {
	        var idx = 0;
	        var len = list.length;
	        while (idx < len) {
	            if (fn(list[idx])) {
	                return list[idx];
	            }
	            idx += 1;
	        }
	    }));

	    /**
	     * Returns the index of the first element of the list which matches the
	     * predicate, or `-1` if no element matches.
	     *
	     * Dispatches to the `findIndex` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.1
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> Number
	     * @param {Function} fn The predicate function used to determine if the element is the
	     * desired one.
	     * @param {Array} list The array to consider.
	     * @return {Number} The index of the element found, or `-1`.
	     * @see R.transduce
	     * @example
	     *
	     *      var xs = [{a: 1}, {a: 2}, {a: 3}];
	     *      R.findIndex(R.propEq('a', 2))(xs); //=> 1
	     *      R.findIndex(R.propEq('a', 4))(xs); //=> -1
	     */
	    var findIndex = _curry2(_dispatchable('findIndex', _xfindIndex, function findIndex(fn, list) {
	        var idx = 0;
	        var len = list.length;
	        while (idx < len) {
	            if (fn(list[idx])) {
	                return idx;
	            }
	            idx += 1;
	        }
	        return -1;
	    }));

	    /**
	     * Returns the last element of the list which matches the predicate, or
	     * `undefined` if no element matches.
	     *
	     * Dispatches to the `findLast` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.1
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> a | undefined
	     * @param {Function} fn The predicate function used to determine if the element is the
	     * desired one.
	     * @param {Array} list The array to consider.
	     * @return {Object} The element found, or `undefined`.
	     * @see R.transduce
	     * @example
	     *
	     *      var xs = [{a: 1, b: 0}, {a:1, b: 1}];
	     *      R.findLast(R.propEq('a', 1))(xs); //=> {a: 1, b: 1}
	     *      R.findLast(R.propEq('a', 4))(xs); //=> undefined
	     */
	    var findLast = _curry2(_dispatchable('findLast', _xfindLast, function findLast(fn, list) {
	        var idx = list.length - 1;
	        while (idx >= 0) {
	            if (fn(list[idx])) {
	                return list[idx];
	            }
	            idx -= 1;
	        }
	    }));

	    /**
	     * Returns the index of the last element of the list which matches the
	     * predicate, or `-1` if no element matches.
	     *
	     * Dispatches to the `findLastIndex` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.1
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> Number
	     * @param {Function} fn The predicate function used to determine if the element is the
	     * desired one.
	     * @param {Array} list The array to consider.
	     * @return {Number} The index of the element found, or `-1`.
	     * @see R.transduce
	     * @example
	     *
	     *      var xs = [{a: 1, b: 0}, {a:1, b: 1}];
	     *      R.findLastIndex(R.propEq('a', 1))(xs); //=> 1
	     *      R.findLastIndex(R.propEq('a', 4))(xs); //=> -1
	     */
	    var findLastIndex = _curry2(_dispatchable('findLastIndex', _xfindLastIndex, function findLastIndex(fn, list) {
	        var idx = list.length - 1;
	        while (idx >= 0) {
	            if (fn(list[idx])) {
	                return idx;
	            }
	            idx -= 1;
	        }
	        return -1;
	    }));

	    /**
	     * Iterate over an input `list`, calling a provided function `fn` for each
	     * element in the list.
	     *
	     * `fn` receives one argument: *(value)*.
	     *
	     * Note: `R.forEach` does not skip deleted or unassigned indices (sparse
	     * arrays), unlike the native `Array.prototype.forEach` method. For more
	     * details on this behavior, see:
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
	     *
	     * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns
	     * the original array. In some libraries this function is named `each`.
	     *
	     * Dispatches to the `forEach` method of the second argument, if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.1
	     * @category List
	     * @sig (a -> *) -> [a] -> [a]
	     * @param {Function} fn The function to invoke. Receives one argument, `value`.
	     * @param {Array} list The list to iterate over.
	     * @return {Array} The original list.
	     * @see R.addIndex
	     * @example
	     *
	     *      var printXPlusFive = x => console.log(x + 5);
	     *      R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
	     *      // logs 6
	     *      // logs 7
	     *      // logs 8
	     */
	    var forEach = _curry2(_checkForMethod('forEach', function forEach(fn, list) {
	        var len = list.length;
	        var idx = 0;
	        while (idx < len) {
	            fn(list[idx]);
	            idx += 1;
	        }
	        return list;
	    }));

	    /**
	     * Creates a new object from a list key-value pairs. If a key appears in
	     * multiple pairs, the rightmost pair is included in the object.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.3.0
	     * @category List
	     * @sig [[k,v]] -> {k: v}
	     * @param {Array} pairs An array of two-element arrays that will be the keys and values of the output object.
	     * @return {Object} The object made by pairing up `keys` and `values`.
	     * @see R.toPairs, R.pair
	     * @example
	     *
	     *      R.fromPairs([['a', 1], ['b', 2], ['c', 3]]); //=> {a: 1, b: 2, c: 3}
	     */
	    var fromPairs = _curry1(function fromPairs(pairs) {
	        var result = {};
	        var idx = 0;
	        while (idx < pairs.length) {
	            result[pairs[idx][0]] = pairs[idx][1];
	            idx += 1;
	        }
	        return result;
	    });

	    /**
	     * Takes a list and returns a list of lists where each sublist's elements are
	     * all "equal" according to the provided equality function.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.21.0
	     * @category List
	     * @sig ((a, a) → Boolean) → [a] → [[a]]
	     * @param {Function} fn Function for determining whether two given (adjacent)
	     *        elements should be in the same group
	     * @param {Array} list The array to group. Also accepts a string, which will be
	     *        treated as a list of characters.
	     * @return {List} A list that contains sublists of equal elements,
	     *         whose concatenations are equal to the original list.
	     * @example
	     *
	     * R.groupWith(R.equals, [0, 1, 1, 2, 3, 5, 8, 13, 21])
	     * //=> [[0], [1, 1], [2], [3], [5], [8], [13], [21]]
	     *
	     * R.groupWith((a, b) => a % 2 === b % 2, [0, 1, 1, 2, 3, 5, 8, 13, 21])
	     * //=> [[0], [1, 1], [2], [3, 5], [8], [13, 21]]
	     *
	     * R.groupWith(R.eqBy(isVowel), 'aestiou')
	     * //=> ['ae', 'st', 'iou']
	     */
	    var groupWith = _curry2(function (fn, list) {
	        var res = [];
	        var idx = 0;
	        var len = list.length;
	        while (idx < len) {
	            var nextidx = idx + 1;
	            while (nextidx < len && fn(list[idx], list[nextidx])) {
	                nextidx += 1;
	            }
	            res.push(list.slice(idx, nextidx));
	            idx = nextidx;
	        }
	        return res;
	    });

	    /**
	     * Returns `true` if the first argument is greater than the second; `false`
	     * otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig Ord a => a -> a -> Boolean
	     * @param {*} a
	     * @param {*} b
	     * @return {Boolean}
	     * @see R.lt
	     * @example
	     *
	     *      R.gt(2, 1); //=> true
	     *      R.gt(2, 2); //=> false
	     *      R.gt(2, 3); //=> false
	     *      R.gt('a', 'z'); //=> false
	     *      R.gt('z', 'a'); //=> true
	     */
	    var gt = _curry2(function gt(a, b) {
	        return a > b;
	    });

	    /**
	     * Returns `true` if the first argument is greater than or equal to the second;
	     * `false` otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig Ord a => a -> a -> Boolean
	     * @param {Number} a
	     * @param {Number} b
	     * @return {Boolean}
	     * @see R.lte
	     * @example
	     *
	     *      R.gte(2, 1); //=> true
	     *      R.gte(2, 2); //=> true
	     *      R.gte(2, 3); //=> false
	     *      R.gte('a', 'z'); //=> false
	     *      R.gte('z', 'a'); //=> true
	     */
	    var gte = _curry2(function gte(a, b) {
	        return a >= b;
	    });

	    /**
	     * Returns whether or not an object has an own property with the specified name
	     *
	     * @func
	     * @memberOf R
	     * @since v0.7.0
	     * @category Object
	     * @sig s -> {s: x} -> Boolean
	     * @param {String} prop The name of the property to check for.
	     * @param {Object} obj The object to query.
	     * @return {Boolean} Whether the property exists.
	     * @example
	     *
	     *      var hasName = R.has('name');
	     *      hasName({name: 'alice'});   //=> true
	     *      hasName({name: 'bob'});     //=> true
	     *      hasName({});                //=> false
	     *
	     *      var point = {x: 0, y: 0};
	     *      var pointHas = R.has(R.__, point);
	     *      pointHas('x');  //=> true
	     *      pointHas('y');  //=> true
	     *      pointHas('z');  //=> false
	     */
	    var has = _curry2(_has);

	    /**
	     * Returns whether or not an object or its prototype chain has a property with
	     * the specified name
	     *
	     * @func
	     * @memberOf R
	     * @since v0.7.0
	     * @category Object
	     * @sig s -> {s: x} -> Boolean
	     * @param {String} prop The name of the property to check for.
	     * @param {Object} obj The object to query.
	     * @return {Boolean} Whether the property exists.
	     * @example
	     *
	     *      function Rectangle(width, height) {
	     *        this.width = width;
	     *        this.height = height;
	     *      }
	     *      Rectangle.prototype.area = function() {
	     *        return this.width * this.height;
	     *      };
	     *
	     *      var square = new Rectangle(2, 2);
	     *      R.hasIn('width', square);  //=> true
	     *      R.hasIn('area', square);  //=> true
	     */
	    var hasIn = _curry2(function hasIn(prop, obj) {
	        return prop in obj;
	    });

	    /**
	     * Returns true if its arguments are identical, false otherwise. Values are
	     * identical if they reference the same memory. `NaN` is identical to `NaN`;
	     * `0` and `-0` are not identical.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.15.0
	     * @category Relation
	     * @sig a -> a -> Boolean
	     * @param {*} a
	     * @param {*} b
	     * @return {Boolean}
	     * @example
	     *
	     *      var o = {};
	     *      R.identical(o, o); //=> true
	     *      R.identical(1, 1); //=> true
	     *      R.identical(1, '1'); //=> false
	     *      R.identical([], []); //=> false
	     *      R.identical(0, -0); //=> false
	     *      R.identical(NaN, NaN); //=> true
	     */
	    // SameValue algorithm
	    // Steps 1-5, 7-10
	    // Steps 6.b-6.e: +0 != -0
	    // Step 6.a: NaN == NaN
	    var identical = _curry2(function identical(a, b) {
	        // SameValue algorithm
	        if (a === b) {
	            // Steps 1-5, 7-10
	            // Steps 6.b-6.e: +0 != -0
	            return a !== 0 || 1 / a === 1 / b;
	        } else {
	            // Step 6.a: NaN == NaN
	            return a !== a && b !== b;
	        }
	    });

	    /**
	     * A function that does nothing but return the parameter supplied to it. Good
	     * as a default or placeholder function.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig a -> a
	     * @param {*} x The value to return.
	     * @return {*} The input value, `x`.
	     * @example
	     *
	     *      R.identity(1); //=> 1
	     *
	     *      var obj = {};
	     *      R.identity(obj) === obj; //=> true
	     */
	    var identity = _curry1(_identity);

	    /**
	     * Creates a function that will process either the `onTrue` or the `onFalse`
	     * function depending upon the result of the `condition` predicate.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.8.0
	     * @category Logic
	     * @sig (*... -> Boolean) -> (*... -> *) -> (*... -> *) -> (*... -> *)
	     * @param {Function} condition A predicate function
	     * @param {Function} onTrue A function to invoke when the `condition` evaluates to a truthy value.
	     * @param {Function} onFalse A function to invoke when the `condition` evaluates to a falsy value.
	     * @return {Function} A new unary function that will process either the `onTrue` or the `onFalse`
	     *                    function depending upon the result of the `condition` predicate.
	     * @see R.unless, R.when
	     * @example
	     *
	     *      var incCount = R.ifElse(
	     *        R.has('count'),
	     *        R.over(R.lensProp('count'), R.inc),
	     *        R.assoc('count', 1)
	     *      );
	     *      incCount({});           //=> { count: 1 }
	     *      incCount({ count: 1 }); //=> { count: 2 }
	     */
	    var ifElse = _curry3(function ifElse(condition, onTrue, onFalse) {
	        return curryN(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
	            return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
	        });
	    });

	    /**
	     * Increments its argument.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Math
	     * @sig Number -> Number
	     * @param {Number} n
	     * @return {Number}
	     * @see R.dec
	     * @example
	     *
	     *      R.inc(42); //=> 43
	     */
	    var inc = add(1);

	    /**
	     * Inserts the supplied element into the list, at index `index`. _Note that
	     * this is not destructive_: it returns a copy of the list with the changes.
	     * <small>No lists have been harmed in the application of this function.</small>
	     *
	     * @func
	     * @memberOf R
	     * @since v0.2.2
	     * @category List
	     * @sig Number -> a -> [a] -> [a]
	     * @param {Number} index The position to insert the element
	     * @param {*} elt The element to insert into the Array
	     * @param {Array} list The list to insert into
	     * @return {Array} A new Array with `elt` inserted at `index`.
	     * @example
	     *
	     *      R.insert(2, 'x', [1,2,3,4]); //=> [1,2,'x',3,4]
	     */
	    var insert = _curry3(function insert(idx, elt, list) {
	        idx = idx < list.length && idx >= 0 ? idx : list.length;
	        var result = _slice(list);
	        result.splice(idx, 0, elt);
	        return result;
	    });

	    /**
	     * Inserts the sub-list into the list, at index `index`. _Note that this is not
	     * destructive_: it returns a copy of the list with the changes.
	     * <small>No lists have been harmed in the application of this function.</small>
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category List
	     * @sig Number -> [a] -> [a] -> [a]
	     * @param {Number} index The position to insert the sub-list
	     * @param {Array} elts The sub-list to insert into the Array
	     * @param {Array} list The list to insert the sub-list into
	     * @return {Array} A new Array with `elts` inserted starting at `index`.
	     * @example
	     *
	     *      R.insertAll(2, ['x','y','z'], [1,2,3,4]); //=> [1,2,'x','y','z',3,4]
	     */
	    var insertAll = _curry3(function insertAll(idx, elts, list) {
	        idx = idx < list.length && idx >= 0 ? idx : list.length;
	        return _concat(_concat(_slice(list, 0, idx), elts), _slice(list, idx));
	    });

	    /**
	     * Creates a new list with the separator interposed between elements.
	     *
	     * Dispatches to the `intersperse` method of the second argument, if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.14.0
	     * @category List
	     * @sig a -> [a] -> [a]
	     * @param {*} separator The element to add to the list.
	     * @param {Array} list The list to be interposed.
	     * @return {Array} The new list.
	     * @example
	     *
	     *      R.intersperse('n', ['ba', 'a', 'a']); //=> ['ba', 'n', 'a', 'n', 'a']
	     */
	    var intersperse = _curry2(_checkForMethod('intersperse', function intersperse(separator, list) {
	        var out = [];
	        var idx = 0;
	        var length = list.length;
	        while (idx < length) {
	            if (idx === length - 1) {
	                out.push(list[idx]);
	            } else {
	                out.push(list[idx], separator);
	            }
	            idx += 1;
	        }
	        return out;
	    }));

	    /**
	     * See if an object (`val`) is an instance of the supplied constructor. This
	     * function will check up the inheritance chain, if any.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.3.0
	     * @category Type
	     * @sig (* -> {*}) -> a -> Boolean
	     * @param {Object} ctor A constructor
	     * @param {*} val The value to test
	     * @return {Boolean}
	     * @example
	     *
	     *      R.is(Object, {}); //=> true
	     *      R.is(Number, 1); //=> true
	     *      R.is(Object, 1); //=> false
	     *      R.is(String, 's'); //=> true
	     *      R.is(String, new String('')); //=> true
	     *      R.is(Object, new String('')); //=> true
	     *      R.is(Object, 's'); //=> false
	     *      R.is(Number, {}); //=> false
	     */
	    var is = _curry2(function is(Ctor, val) {
	        return val != null && val.constructor === Ctor || val instanceof Ctor;
	    });

	    /**
	     * Tests whether or not an object is similar to an array.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.5.0
	     * @category Type
	     * @category List
	     * @sig * -> Boolean
	     * @param {*} x The object to test.
	     * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
	     * @example
	     *
	     *      R.isArrayLike([]); //=> true
	     *      R.isArrayLike(true); //=> false
	     *      R.isArrayLike({}); //=> false
	     *      R.isArrayLike({length: 10}); //=> false
	     *      R.isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
	     */
	    var isArrayLike = _curry1(function isArrayLike(x) {
	        if (_isArray(x)) {
	            return true;
	        }
	        if (!x) {
	            return false;
	        }
	        if (typeof x !== 'object') {
	            return false;
	        }
	        if (_isString(x)) {
	            return false;
	        }
	        if (x.nodeType === 1) {
	            return !!x.length;
	        }
	        if (x.length === 0) {
	            return true;
	        }
	        if (x.length > 0) {
	            return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
	        }
	        return false;
	    });

	    /**
	     * Checks if the input value is `null` or `undefined`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Type
	     * @sig * -> Boolean
	     * @param {*} x The value to test.
	     * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
	     * @example
	     *
	     *      R.isNil(null); //=> true
	     *      R.isNil(undefined); //=> true
	     *      R.isNil(0); //=> false
	     *      R.isNil([]); //=> false
	     */
	    var isNil = _curry1(function isNil(x) {
	        return x == null;
	    });

	    /**
	     * Returns a list containing the names of all the enumerable own properties of
	     * the supplied object.
	     * Note that the order of the output array is not guaranteed to be consistent
	     * across different JS platforms.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Object
	     * @sig {k: v} -> [k]
	     * @param {Object} obj The object to extract properties from
	     * @return {Array} An array of the object's own properties.
	     * @example
	     *
	     *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
	     */
	    // cover IE < 9 keys issues
	    // Safari bug
	    var keys = function () {
	        // cover IE < 9 keys issues
	        var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
	        var nonEnumerableProps = [
	            'constructor',
	            'valueOf',
	            'isPrototypeOf',
	            'toString',
	            'propertyIsEnumerable',
	            'hasOwnProperty',
	            'toLocaleString'
	        ];
	        // Safari bug
	        var hasArgsEnumBug = function () {
	            'use strict';
	            return arguments.propertyIsEnumerable('length');
	        }();
	        var contains = function contains(list, item) {
	            var idx = 0;
	            while (idx < list.length) {
	                if (list[idx] === item) {
	                    return true;
	                }
	                idx += 1;
	            }
	            return false;
	        };
	        return typeof Object.keys === 'function' && !hasArgsEnumBug ? _curry1(function keys(obj) {
	            return Object(obj) !== obj ? [] : Object.keys(obj);
	        }) : _curry1(function keys(obj) {
	            if (Object(obj) !== obj) {
	                return [];
	            }
	            var prop, nIdx;
	            var ks = [];
	            var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
	            for (prop in obj) {
	                if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
	                    ks[ks.length] = prop;
	                }
	            }
	            if (hasEnumBug) {
	                nIdx = nonEnumerableProps.length - 1;
	                while (nIdx >= 0) {
	                    prop = nonEnumerableProps[nIdx];
	                    if (_has(prop, obj) && !contains(ks, prop)) {
	                        ks[ks.length] = prop;
	                    }
	                    nIdx -= 1;
	                }
	            }
	            return ks;
	        });
	    }();

	    /**
	     * Returns a list containing the names of all the properties of the supplied
	     * object, including prototype properties.
	     * Note that the order of the output array is not guaranteed to be consistent
	     * across different JS platforms.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.2.0
	     * @category Object
	     * @sig {k: v} -> [k]
	     * @param {Object} obj The object to extract properties from
	     * @return {Array} An array of the object's own and prototype properties.
	     * @example
	     *
	     *      var F = function() { this.x = 'X'; };
	     *      F.prototype.y = 'Y';
	     *      var f = new F();
	     *      R.keysIn(f); //=> ['x', 'y']
	     */
	    var keysIn = _curry1(function keysIn(obj) {
	        var prop;
	        var ks = [];
	        for (prop in obj) {
	            ks[ks.length] = prop;
	        }
	        return ks;
	    });

	    /**
	     * Returns the number of elements in the array by returning `list.length`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.3.0
	     * @category List
	     * @sig [a] -> Number
	     * @param {Array} list The array to inspect.
	     * @return {Number} The length of the array.
	     * @example
	     *
	     *      R.length([]); //=> 0
	     *      R.length([1, 2, 3]); //=> 3
	     */
	    var length = _curry1(function length(list) {
	        return list != null && _isNumber(list.length) ? list.length : NaN;
	    });

	    /**
	     * Returns `true` if the first argument is less than the second; `false`
	     * otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig Ord a => a -> a -> Boolean
	     * @param {*} a
	     * @param {*} b
	     * @return {Boolean}
	     * @see R.gt
	     * @example
	     *
	     *      R.lt(2, 1); //=> false
	     *      R.lt(2, 2); //=> false
	     *      R.lt(2, 3); //=> true
	     *      R.lt('a', 'z'); //=> true
	     *      R.lt('z', 'a'); //=> false
	     */
	    var lt = _curry2(function lt(a, b) {
	        return a < b;
	    });

	    /**
	     * Returns `true` if the first argument is less than or equal to the second;
	     * `false` otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig Ord a => a -> a -> Boolean
	     * @param {Number} a
	     * @param {Number} b
	     * @return {Boolean}
	     * @see R.gte
	     * @example
	     *
	     *      R.lte(2, 1); //=> false
	     *      R.lte(2, 2); //=> true
	     *      R.lte(2, 3); //=> true
	     *      R.lte('a', 'z'); //=> true
	     *      R.lte('z', 'a'); //=> false
	     */
	    var lte = _curry2(function lte(a, b) {
	        return a <= b;
	    });

	    /**
	     * The mapAccum function behaves like a combination of map and reduce; it
	     * applies a function to each element of a list, passing an accumulating
	     * parameter from left to right, and returning a final value of this
	     * accumulator together with the new list.
	     *
	     * The iterator function receives two arguments, *acc* and *value*, and should
	     * return a tuple *[acc, value]*.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.10.0
	     * @category List
	     * @sig (acc -> x -> (acc, y)) -> acc -> [x] -> (acc, [y])
	     * @param {Function} fn The function to be called on every element of the input `list`.
	     * @param {*} acc The accumulator value.
	     * @param {Array} list The list to iterate over.
	     * @return {*} The final, accumulated value.
	     * @see R.addIndex
	     * @example
	     *
	     *      var digits = ['1', '2', '3', '4'];
	     *      var appender = (a, b) => [a + b, a + b];
	     *
	     *      R.mapAccum(appender, 0, digits); //=> ['01234', ['01', '012', '0123', '01234']]
	     */
	    var mapAccum = _curry3(function mapAccum(fn, acc, list) {
	        var idx = 0;
	        var len = list.length;
	        var result = [];
	        var tuple = [acc];
	        while (idx < len) {
	            tuple = fn(tuple[0], list[idx]);
	            result[idx] = tuple[1];
	            idx += 1;
	        }
	        return [
	            tuple[0],
	            result
	        ];
	    });

	    /**
	     * The mapAccumRight function behaves like a combination of map and reduce; it
	     * applies a function to each element of a list, passing an accumulating
	     * parameter from right to left, and returning a final value of this
	     * accumulator together with the new list.
	     *
	     * Similar to `mapAccum`, except moves through the input list from the right to
	     * the left.
	     *
	     * The iterator function receives two arguments, *acc* and *value*, and should
	     * return a tuple *[acc, value]*.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.10.0
	     * @category List
	     * @sig (acc -> x -> (acc, y)) -> acc -> [x] -> (acc, [y])
	     * @param {Function} fn The function to be called on every element of the input `list`.
	     * @param {*} acc The accumulator value.
	     * @param {Array} list The list to iterate over.
	     * @return {*} The final, accumulated value.
	     * @see R.addIndex
	     * @example
	     *
	     *      var digits = ['1', '2', '3', '4'];
	     *      var append = (a, b) => [a + b, a + b];
	     *
	     *      R.mapAccumRight(append, 0, digits); //=> ['04321', ['04321', '0432', '043', '04']]
	     */
	    var mapAccumRight = _curry3(function mapAccumRight(fn, acc, list) {
	        var idx = list.length - 1;
	        var result = [];
	        var tuple = [acc];
	        while (idx >= 0) {
	            tuple = fn(tuple[0], list[idx]);
	            result[idx] = tuple[1];
	            idx -= 1;
	        }
	        return [
	            tuple[0],
	            result
	        ];
	    });

	    /**
	     * Tests a regular expression against a String. Note that this function will
	     * return an empty array when there are no matches. This differs from
	     * [`String.prototype.match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
	     * which returns `null` when there are no matches.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category String
	     * @sig RegExp -> String -> [String | Undefined]
	     * @param {RegExp} rx A regular expression.
	     * @param {String} str The string to match against
	     * @return {Array} The list of matches or empty array.
	     * @see R.test
	     * @example
	     *
	     *      R.match(/([a-z]a)/g, 'bananas'); //=> ['ba', 'na', 'na']
	     *      R.match(/a/, 'b'); //=> []
	     *      R.match(/a/, null); //=> TypeError: null does not have a method named "match"
	     */
	    var match = _curry2(function match(rx, str) {
	        return str.match(rx) || [];
	    });

	    /**
	     * mathMod behaves like the modulo operator should mathematically, unlike the
	     * `%` operator (and by extension, R.modulo). So while "-17 % 5" is -2,
	     * mathMod(-17, 5) is 3. mathMod requires Integer arguments, and returns NaN
	     * when the modulus is zero or negative.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.3.0
	     * @category Math
	     * @sig Number -> Number -> Number
	     * @param {Number} m The dividend.
	     * @param {Number} p the modulus.
	     * @return {Number} The result of `b mod a`.
	     * @example
	     *
	     *      R.mathMod(-17, 5);  //=> 3
	     *      R.mathMod(17, 5);   //=> 2
	     *      R.mathMod(17, -5);  //=> NaN
	     *      R.mathMod(17, 0);   //=> NaN
	     *      R.mathMod(17.2, 5); //=> NaN
	     *      R.mathMod(17, 5.3); //=> NaN
	     *
	     *      var clock = R.mathMod(R.__, 12);
	     *      clock(15); //=> 3
	     *      clock(24); //=> 0
	     *
	     *      var seventeenMod = R.mathMod(17);
	     *      seventeenMod(3);  //=> 2
	     *      seventeenMod(4);  //=> 1
	     *      seventeenMod(10); //=> 7
	     */
	    var mathMod = _curry2(function mathMod(m, p) {
	        if (!_isInteger(m)) {
	            return NaN;
	        }
	        if (!_isInteger(p) || p < 1) {
	            return NaN;
	        }
	        return (m % p + p) % p;
	    });

	    /**
	     * Returns the larger of its two arguments.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig Ord a => a -> a -> a
	     * @param {*} a
	     * @param {*} b
	     * @return {*}
	     * @see R.maxBy, R.min
	     * @example
	     *
	     *      R.max(789, 123); //=> 789
	     *      R.max('a', 'b'); //=> 'b'
	     */
	    var max = _curry2(function max(a, b) {
	        return b > a ? b : a;
	    });

	    /**
	     * Takes a function and two values, and returns whichever value produces the
	     * larger result when passed to the provided function.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.8.0
	     * @category Relation
	     * @sig Ord b => (a -> b) -> a -> a -> a
	     * @param {Function} f
	     * @param {*} a
	     * @param {*} b
	     * @return {*}
	     * @see R.max, R.minBy
	     * @example
	     *
	     *      //  square :: Number -> Number
	     *      var square = n => n * n;
	     *
	     *      R.maxBy(square, -3, 2); //=> -3
	     *
	     *      R.reduce(R.maxBy(square), 0, [3, -5, 4, 1, -2]); //=> -5
	     *      R.reduce(R.maxBy(square), 0, []); //=> 0
	     */
	    var maxBy = _curry3(function maxBy(f, a, b) {
	        return f(b) > f(a) ? b : a;
	    });

	    /**
	     * Create a new object with the own properties of the first object merged with
	     * the own properties of the second object. If a key exists in both objects,
	     * the value from the second object will be used.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Object
	     * @sig {k: v} -> {k: v} -> {k: v}
	     * @param {Object} l
	     * @param {Object} r
	     * @return {Object}
	     * @see R.mergeWith, R.mergeWithKey
	     * @example
	     *
	     *      R.merge({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
	     *      //=> { 'name': 'fred', 'age': 40 }
	     *
	     *      var resetToDefault = R.merge(R.__, {x: 0});
	     *      resetToDefault({x: 5, y: 2}); //=> {x: 0, y: 2}
	     */
	    var merge = _curry2(function merge(l, r) {
	        return _assign({}, l, r);
	    });

	    /**
	     * Merges a list of objects together into one object.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.10.0
	     * @category List
	     * @sig [{k: v}] -> {k: v}
	     * @param {Array} list An array of objects
	     * @return {Object} A merged object.
	     * @see R.reduce
	     * @example
	     *
	     *      R.mergeAll([{foo:1},{bar:2},{baz:3}]); //=> {foo:1,bar:2,baz:3}
	     *      R.mergeAll([{foo:1},{foo:2},{bar:2}]); //=> {foo:2,bar:2}
	     */
	    var mergeAll = _curry1(function mergeAll(list) {
	        return _assign.apply(null, [{}].concat(list));
	    });

	    /**
	     * Creates a new object with the own properties of the two provided objects. If
	     * a key exists in both objects, the provided function is applied to the key
	     * and the values associated with the key in each object, with the result being
	     * used as the value associated with the key in the returned object. The key
	     * will be excluded from the returned object if the resulting value is
	     * `undefined`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category Object
	     * @sig (String -> a -> a -> a) -> {a} -> {a} -> {a}
	     * @param {Function} fn
	     * @param {Object} l
	     * @param {Object} r
	     * @return {Object}
	     * @see R.merge, R.mergeWith
	     * @example
	     *
	     *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
	     *      R.mergeWithKey(concatValues,
	     *                     { a: true, thing: 'foo', values: [10, 20] },
	     *                     { b: true, thing: 'bar', values: [15, 35] });
	     *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
	     */
	    var mergeWithKey = _curry3(function mergeWithKey(fn, l, r) {
	        var result = {};
	        var k;
	        for (k in l) {
	            if (_has(k, l)) {
	                result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
	            }
	        }
	        for (k in r) {
	            if (_has(k, r) && !_has(k, result)) {
	                result[k] = r[k];
	            }
	        }
	        return result;
	    });

	    /**
	     * Returns the smaller of its two arguments.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig Ord a => a -> a -> a
	     * @param {*} a
	     * @param {*} b
	     * @return {*}
	     * @see R.minBy, R.max
	     * @example
	     *
	     *      R.min(789, 123); //=> 123
	     *      R.min('a', 'b'); //=> 'a'
	     */
	    var min = _curry2(function min(a, b) {
	        return b < a ? b : a;
	    });

	    /**
	     * Takes a function and two values, and returns whichever value produces the
	     * smaller result when passed to the provided function.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.8.0
	     * @category Relation
	     * @sig Ord b => (a -> b) -> a -> a -> a
	     * @param {Function} f
	     * @param {*} a
	     * @param {*} b
	     * @return {*}
	     * @see R.min, R.maxBy
	     * @example
	     *
	     *      //  square :: Number -> Number
	     *      var square = n => n * n;
	     *
	     *      R.minBy(square, -3, 2); //=> 2
	     *
	     *      R.reduce(R.minBy(square), Infinity, [3, -5, 4, 1, -2]); //=> 1
	     *      R.reduce(R.minBy(square), Infinity, []); //=> Infinity
	     */
	    var minBy = _curry3(function minBy(f, a, b) {
	        return f(b) < f(a) ? b : a;
	    });

	    /**
	     * Divides the first parameter by the second and returns the remainder. Note
	     * that this function preserves the JavaScript-style behavior for modulo. For
	     * mathematical modulo see `mathMod`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.1
	     * @category Math
	     * @sig Number -> Number -> Number
	     * @param {Number} a The value to the divide.
	     * @param {Number} b The pseudo-modulus
	     * @return {Number} The result of `b % a`.
	     * @see R.mathMod
	     * @example
	     *
	     *      R.modulo(17, 3); //=> 2
	     *      // JS behavior:
	     *      R.modulo(-17, 3); //=> -2
	     *      R.modulo(17, -3); //=> 2
	     *
	     *      var isOdd = R.modulo(R.__, 2);
	     *      isOdd(42); //=> 0
	     *      isOdd(21); //=> 1
	     */
	    var modulo = _curry2(function modulo(a, b) {
	        return a % b;
	    });

	    /**
	     * Multiplies two numbers. Equivalent to `a * b` but curried.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Math
	     * @sig Number -> Number -> Number
	     * @param {Number} a The first value.
	     * @param {Number} b The second value.
	     * @return {Number} The result of `a * b`.
	     * @see R.divide
	     * @example
	     *
	     *      var double = R.multiply(2);
	     *      var triple = R.multiply(3);
	     *      double(3);       //=>  6
	     *      triple(4);       //=> 12
	     *      R.multiply(2, 5);  //=> 10
	     */
	    var multiply = _curry2(function multiply(a, b) {
	        return a * b;
	    });

	    /**
	     * Wraps a function of any arity (including nullary) in a function that accepts
	     * exactly `n` parameters. Any extraneous parameters will not be passed to the
	     * supplied function.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig Number -> (* -> a) -> (* -> a)
	     * @param {Number} n The desired arity of the new function.
	     * @param {Function} fn The function to wrap.
	     * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
	     *         arity `n`.
	     * @example
	     *
	     *      var takesTwoArgs = (a, b) => [a, b];
	     *
	     *      takesTwoArgs.length; //=> 2
	     *      takesTwoArgs(1, 2); //=> [1, 2]
	     *
	     *      var takesOneArg = R.nAry(1, takesTwoArgs);
	     *      takesOneArg.length; //=> 1
	     *      // Only `n` arguments are passed to the wrapped function
	     *      takesOneArg(1, 2); //=> [1, undefined]
	     */
	    var nAry = _curry2(function nAry(n, fn) {
	        switch (n) {
	        case 0:
	            return function () {
	                return fn.call(this);
	            };
	        case 1:
	            return function (a0) {
	                return fn.call(this, a0);
	            };
	        case 2:
	            return function (a0, a1) {
	                return fn.call(this, a0, a1);
	            };
	        case 3:
	            return function (a0, a1, a2) {
	                return fn.call(this, a0, a1, a2);
	            };
	        case 4:
	            return function (a0, a1, a2, a3) {
	                return fn.call(this, a0, a1, a2, a3);
	            };
	        case 5:
	            return function (a0, a1, a2, a3, a4) {
	                return fn.call(this, a0, a1, a2, a3, a4);
	            };
	        case 6:
	            return function (a0, a1, a2, a3, a4, a5) {
	                return fn.call(this, a0, a1, a2, a3, a4, a5);
	            };
	        case 7:
	            return function (a0, a1, a2, a3, a4, a5, a6) {
	                return fn.call(this, a0, a1, a2, a3, a4, a5, a6);
	            };
	        case 8:
	            return function (a0, a1, a2, a3, a4, a5, a6, a7) {
	                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7);
	            };
	        case 9:
	            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
	                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8);
	            };
	        case 10:
	            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
	                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
	            };
	        default:
	            throw new Error('First argument to nAry must be a non-negative integer no greater than ten');
	        }
	    });

	    /**
	     * Negates its argument.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Math
	     * @sig Number -> Number
	     * @param {Number} n
	     * @return {Number}
	     * @example
	     *
	     *      R.negate(42); //=> -42
	     */
	    var negate = _curry1(function negate(n) {
	        return -n;
	    });

	    /**
	     * Returns `true` if no elements of the list match the predicate, `false`
	     * otherwise.
	     *
	     * Dispatches to the `any` method of the second argument, if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.12.0
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> Boolean
	     * @param {Function} fn The predicate function.
	     * @param {Array} list The array to consider.
	     * @return {Boolean} `true` if the predicate is not satisfied by every element, `false` otherwise.
	     * @see R.all, R.any
	     * @example
	     *
	     *      var isEven = n => n % 2 === 0;
	     *
	     *      R.none(isEven, [1, 3, 5, 7, 9, 11]); //=> true
	     *      R.none(isEven, [1, 3, 5, 7, 8, 11]); //=> false
	     */
	    var none = _curry2(_complement(_dispatchable('any', _xany, any)));

	    /**
	     * A function that returns the `!` of its argument. It will return `true` when
	     * passed false-y value, and `false` when passed a truth-y one.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Logic
	     * @sig * -> Boolean
	     * @param {*} a any value
	     * @return {Boolean} the logical inverse of passed argument.
	     * @see R.complement
	     * @example
	     *
	     *      R.not(true); //=> false
	     *      R.not(false); //=> true
	     *      R.not(0); //=> true
	     *      R.not(1); //=> false
	     */
	    var not = _curry1(function not(a) {
	        return !a;
	    });

	    /**
	     * Returns the nth element of the given list or string. If n is negative the
	     * element at index length + n is returned.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig Number -> [a] -> a | Undefined
	     * @sig Number -> String -> String
	     * @param {Number} offset
	     * @param {*} list
	     * @return {*}
	     * @example
	     *
	     *      var list = ['foo', 'bar', 'baz', 'quux'];
	     *      R.nth(1, list); //=> 'bar'
	     *      R.nth(-1, list); //=> 'quux'
	     *      R.nth(-99, list); //=> undefined
	     *
	     *      R.nth(2, 'abc'); //=> 'c'
	     *      R.nth(3, 'abc'); //=> ''
	     */
	    var nth = _curry2(function nth(offset, list) {
	        var idx = offset < 0 ? list.length + offset : offset;
	        return _isString(list) ? list.charAt(idx) : list[idx];
	    });

	    /**
	     * Returns a function which returns its nth argument.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Function
	     * @sig Number -> *... -> *
	     * @param {Number} n
	     * @return {Function}
	     * @example
	     *
	     *      R.nthArg(1)('a', 'b', 'c'); //=> 'b'
	     *      R.nthArg(-1)('a', 'b', 'c'); //=> 'c'
	     */
	    var nthArg = _curry1(function nthArg(n) {
	        var arity = n < 0 ? 1 : n + 1;
	        return curryN(arity, function () {
	            return nth(n, arguments);
	        });
	    });

	    /**
	     * Creates an object containing a single key:value pair.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.18.0
	     * @category Object
	     * @sig String -> a -> {String:a}
	     * @param {String} key
	     * @param {*} val
	     * @return {Object}
	     * @see R.pair
	     * @example
	     *
	     *      var matchPhrases = R.compose(
	     *        R.objOf('must'),
	     *        R.map(R.objOf('match_phrase'))
	     *      );
	     *      matchPhrases(['foo', 'bar', 'baz']); //=> {must: [{match_phrase: 'foo'}, {match_phrase: 'bar'}, {match_phrase: 'baz'}]}
	     */
	    var objOf = _curry2(function objOf(key, val) {
	        var obj = {};
	        obj[key] = val;
	        return obj;
	    });

	    /**
	     * Returns a singleton array containing the value provided.
	     *
	     * Note this `of` is different from the ES6 `of`; See
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
	     *
	     * @func
	     * @memberOf R
	     * @since v0.3.0
	     * @category Function
	     * @sig a -> [a]
	     * @param {*} x any value
	     * @return {Array} An array wrapping `x`.
	     * @example
	     *
	     *      R.of(null); //=> [null]
	     *      R.of([42]); //=> [[42]]
	     */
	    var of = _curry1(_of);

	    /**
	     * Accepts a function `fn` and returns a function that guards invocation of
	     * `fn` such that `fn` can only ever be called once, no matter how many times
	     * the returned function is invoked. The first value calculated is returned in
	     * subsequent invocations.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig (a... -> b) -> (a... -> b)
	     * @param {Function} fn The function to wrap in a call-only-once wrapper.
	     * @return {Function} The wrapped function.
	     * @example
	     *
	     *      var addOneOnce = R.once(x => x + 1);
	     *      addOneOnce(10); //=> 11
	     *      addOneOnce(addOneOnce(50)); //=> 11
	     */
	    var once = _curry1(function once(fn) {
	        var called = false;
	        var result;
	        return _arity(fn.length, function () {
	            if (called) {
	                return result;
	            }
	            called = true;
	            result = fn.apply(this, arguments);
	            return result;
	        });
	    });

	    /**
	     * Returns `true` if one or both of its arguments are `true`. Returns `false`
	     * if both arguments are `false`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Logic
	     * @sig * -> * -> *
	     * @param {Boolean} a A boolean value
	     * @param {Boolean} b A boolean value
	     * @return {Boolean} `true` if one or both arguments are `true`, `false` otherwise
	     * @see R.either
	     * @example
	     *
	     *      R.or(true, true); //=> true
	     *      R.or(true, false); //=> true
	     *      R.or(false, true); //=> true
	     *      R.or(false, false); //=> false
	     */
	    var or = _curry2(function or(a, b) {
	        return a || b;
	    });

	    /**
	     * Returns the result of "setting" the portion of the given data structure
	     * focused by the given lens to the result of applying the given function to
	     * the focused value.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category Object
	     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	     * @sig Lens s a -> (a -> a) -> s -> s
	     * @param {Lens} lens
	     * @param {*} v
	     * @param {*} x
	     * @return {*}
	     * @see R.prop, R.lensIndex, R.lensProp
	     * @example
	     *
	     *      var headLens = R.lensIndex(0);
	     *
	     *      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
	     */
	    // `Identity` is a functor that holds a single value, where `map` simply
	    // transforms the held value with the provided function.
	    // The value returned by the getter function is first transformed with `f`,
	    // then set as the value of an `Identity`. This is then mapped over with the
	    // setter function of the lens.
	    var over = function () {
	        // `Identity` is a functor that holds a single value, where `map` simply
	        // transforms the held value with the provided function.
	        var Identity = function (x) {
	            return {
	                value: x,
	                map: function (f) {
	                    return Identity(f(x));
	                }
	            };
	        };
	        return _curry3(function over(lens, f, x) {
	            // The value returned by the getter function is first transformed with `f`,
	            // then set as the value of an `Identity`. This is then mapped over with the
	            // setter function of the lens.
	            return lens(function (y) {
	                return Identity(f(y));
	            })(x).value;
	        });
	    }();

	    /**
	     * Takes two arguments, `fst` and `snd`, and returns `[fst, snd]`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.18.0
	     * @category List
	     * @sig a -> b -> (a,b)
	     * @param {*} fst
	     * @param {*} snd
	     * @return {Array}
	     * @see R.objOf, R.of
	     * @example
	     *
	     *      R.pair('foo', 'bar'); //=> ['foo', 'bar']
	     */
	    var pair = _curry2(function pair(fst, snd) {
	        return [
	            fst,
	            snd
	        ];
	    });

	    /**
	     * Retrieve the value at a given path.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.2.0
	     * @category Object
	     * @sig [String] -> {k: v} -> v | Undefined
	     * @param {Array} path The path to use.
	     * @param {Object} obj The object to retrieve the nested property from.
	     * @return {*} The data at `path`.
	     * @see R.prop
	     * @example
	     *
	     *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
	     *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
	     */
	    var path = _curry2(function path(paths, obj) {
	        var val = obj;
	        var idx = 0;
	        while (idx < paths.length) {
	            if (val == null) {
	                return;
	            }
	            val = val[paths[idx]];
	            idx += 1;
	        }
	        return val;
	    });

	    /**
	     * If the given, non-null object has a value at the given path, returns the
	     * value at that path. Otherwise returns the provided default value.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.18.0
	     * @category Object
	     * @sig a -> [String] -> Object -> a
	     * @param {*} d The default value.
	     * @param {Array} p The path to use.
	     * @param {Object} obj The object to retrieve the nested property from.
	     * @return {*} The data at `path` of the supplied object or the default value.
	     * @example
	     *
	     *      R.pathOr('N/A', ['a', 'b'], {a: {b: 2}}); //=> 2
	     *      R.pathOr('N/A', ['a', 'b'], {c: {b: 2}}); //=> "N/A"
	     */
	    var pathOr = _curry3(function pathOr(d, p, obj) {
	        return defaultTo(d, path(p, obj));
	    });

	    /**
	     * Returns `true` if the specified object property at given path satisfies the
	     * given predicate; `false` otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category Logic
	     * @sig (a -> Boolean) -> [String] -> Object -> Boolean
	     * @param {Function} pred
	     * @param {Array} propPath
	     * @param {*} obj
	     * @return {Boolean}
	     * @see R.propSatisfies, R.path
	     * @example
	     *
	     *      R.pathSatisfies(y => y > 0, ['x', 'y'], {x: {y: 2}}); //=> true
	     */
	    var pathSatisfies = _curry3(function pathSatisfies(pred, propPath, obj) {
	        return propPath.length > 0 && pred(path(propPath, obj));
	    });

	    /**
	     * Returns a partial copy of an object containing only the keys specified. If
	     * the key does not exist, the property is ignored.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Object
	     * @sig [k] -> {k: v} -> {k: v}
	     * @param {Array} names an array of String property names to copy onto a new object
	     * @param {Object} obj The object to copy from
	     * @return {Object} A new object with only properties from `names` on it.
	     * @see R.omit, R.props
	     * @example
	     *
	     *      R.pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
	     *      R.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
	     */
	    var pick = _curry2(function pick(names, obj) {
	        var result = {};
	        var idx = 0;
	        while (idx < names.length) {
	            if (names[idx] in obj) {
	                result[names[idx]] = obj[names[idx]];
	            }
	            idx += 1;
	        }
	        return result;
	    });

	    /**
	     * Similar to `pick` except that this one includes a `key: undefined` pair for
	     * properties that don't exist.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Object
	     * @sig [k] -> {k: v} -> {k: v}
	     * @param {Array} names an array of String property names to copy onto a new object
	     * @param {Object} obj The object to copy from
	     * @return {Object} A new object with only properties from `names` on it.
	     * @see R.pick
	     * @example
	     *
	     *      R.pickAll(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
	     *      R.pickAll(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, e: undefined, f: undefined}
	     */
	    var pickAll = _curry2(function pickAll(names, obj) {
	        var result = {};
	        var idx = 0;
	        var len = names.length;
	        while (idx < len) {
	            var name = names[idx];
	            result[name] = obj[name];
	            idx += 1;
	        }
	        return result;
	    });

	    /**
	     * Returns a partial copy of an object containing only the keys that satisfy
	     * the supplied predicate.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.8.0
	     * @category Object
	     * @sig (v, k -> Boolean) -> {k: v} -> {k: v}
	     * @param {Function} pred A predicate to determine whether or not a key
	     *        should be included on the output object.
	     * @param {Object} obj The object to copy from
	     * @return {Object} A new object with only properties that satisfy `pred`
	     *         on it.
	     * @see R.pick, R.filter
	     * @example
	     *
	     *      var isUpperCase = (val, key) => key.toUpperCase() === key;
	     *      R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
	     */
	    var pickBy = _curry2(function pickBy(test, obj) {
	        var result = {};
	        for (var prop in obj) {
	            if (test(obj[prop], prop, obj)) {
	                result[prop] = obj[prop];
	            }
	        }
	        return result;
	    });

	    /**
	     * Returns a new list with the given element at the front, followed by the
	     * contents of the list.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig a -> [a] -> [a]
	     * @param {*} el The item to add to the head of the output list.
	     * @param {Array} list The array to add to the tail of the output list.
	     * @return {Array} A new array.
	     * @see R.append
	     * @example
	     *
	     *      R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
	     */
	    var prepend = _curry2(function prepend(el, list) {
	        return _concat([el], list);
	    });

	    /**
	     * Returns a function that when supplied an object returns the indicated
	     * property of that object, if it exists.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Object
	     * @sig s -> {s: a} -> a | Undefined
	     * @param {String} p The property name
	     * @param {Object} obj The object to query
	     * @return {*} The value at `obj.p`.
	     * @see R.path
	     * @example
	     *
	     *      R.prop('x', {x: 100}); //=> 100
	     *      R.prop('x', {}); //=> undefined
	     */
	    var prop = _curry2(function prop(p, obj) {
	        return obj[p];
	    });

	    /**
	     * Returns `true` if the specified object property is of the given type;
	     * `false` otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category Type
	     * @sig Type -> String -> Object -> Boolean
	     * @param {Function} type
	     * @param {String} name
	     * @param {*} obj
	     * @return {Boolean}
	     * @see R.is, R.propSatisfies
	     * @example
	     *
	     *      R.propIs(Number, 'x', {x: 1, y: 2});  //=> true
	     *      R.propIs(Number, 'x', {x: 'foo'});    //=> false
	     *      R.propIs(Number, 'x', {});            //=> false
	     */
	    var propIs = _curry3(function propIs(type, name, obj) {
	        return is(type, obj[name]);
	    });

	    /**
	     * If the given, non-null object has an own property with the specified name,
	     * returns the value of that property. Otherwise returns the provided default
	     * value.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.6.0
	     * @category Object
	     * @sig a -> String -> Object -> a
	     * @param {*} val The default value.
	     * @param {String} p The name of the property to return.
	     * @param {Object} obj The object to query.
	     * @return {*} The value of given property of the supplied object or the default value.
	     * @example
	     *
	     *      var alice = {
	     *        name: 'ALICE',
	     *        age: 101
	     *      };
	     *      var favorite = R.prop('favoriteLibrary');
	     *      var favoriteWithDefault = R.propOr('Ramda', 'favoriteLibrary');
	     *
	     *      favorite(alice);  //=> undefined
	     *      favoriteWithDefault(alice);  //=> 'Ramda'
	     */
	    var propOr = _curry3(function propOr(val, p, obj) {
	        return obj != null && _has(p, obj) ? obj[p] : val;
	    });

	    /**
	     * Returns `true` if the specified object property satisfies the given
	     * predicate; `false` otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category Logic
	     * @sig (a -> Boolean) -> String -> {String: a} -> Boolean
	     * @param {Function} pred
	     * @param {String} name
	     * @param {*} obj
	     * @return {Boolean}
	     * @see R.propEq, R.propIs
	     * @example
	     *
	     *      R.propSatisfies(x => x > 0, 'x', {x: 1, y: 2}); //=> true
	     */
	    var propSatisfies = _curry3(function propSatisfies(pred, name, obj) {
	        return pred(obj[name]);
	    });

	    /**
	     * Acts as multiple `prop`: array of keys in, array of values out. Preserves
	     * order.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Object
	     * @sig [k] -> {k: v} -> [v]
	     * @param {Array} ps The property names to fetch
	     * @param {Object} obj The object to query
	     * @return {Array} The corresponding values or partially applied function.
	     * @example
	     *
	     *      R.props(['x', 'y'], {x: 1, y: 2}); //=> [1, 2]
	     *      R.props(['c', 'a', 'b'], {b: 2, a: 1}); //=> [undefined, 1, 2]
	     *
	     *      var fullName = R.compose(R.join(' '), R.props(['first', 'last']));
	     *      fullName({last: 'Bullet-Tooth', age: 33, first: 'Tony'}); //=> 'Tony Bullet-Tooth'
	     */
	    var props = _curry2(function props(ps, obj) {
	        var len = ps.length;
	        var out = [];
	        var idx = 0;
	        while (idx < len) {
	            out[idx] = obj[ps[idx]];
	            idx += 1;
	        }
	        return out;
	    });

	    /**
	     * Returns a list of numbers from `from` (inclusive) to `to` (exclusive).
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig Number -> Number -> [Number]
	     * @param {Number} from The first number in the list.
	     * @param {Number} to One more than the last number in the list.
	     * @return {Array} The list of numbers in tthe set `[a, b)`.
	     * @example
	     *
	     *      R.range(1, 5);    //=> [1, 2, 3, 4]
	     *      R.range(50, 53);  //=> [50, 51, 52]
	     */
	    var range = _curry2(function range(from, to) {
	        if (!(_isNumber(from) && _isNumber(to))) {
	            throw new TypeError('Both arguments to range must be numbers');
	        }
	        var result = [];
	        var n = from;
	        while (n < to) {
	            result.push(n);
	            n += 1;
	        }
	        return result;
	    });

	    /**
	     * Returns a single item by iterating through the list, successively calling
	     * the iterator function and passing it an accumulator value and the current
	     * value from the array, and then passing the result to the next call.
	     *
	     * Similar to `reduce`, except moves through the input list from the right to
	     * the left.
	     *
	     * The iterator function receives two values: *(acc, value)*
	     *
	     * Note: `R.reduceRight` does not skip deleted or unassigned indices (sparse
	     * arrays), unlike the native `Array.prototype.reduce` method. For more details
	     * on this behavior, see:
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight#Description
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig (a,b -> a) -> a -> [b] -> a
	     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
	     *        current element from the array.
	     * @param {*} acc The accumulator value.
	     * @param {Array} list The list to iterate over.
	     * @return {*} The final, accumulated value.
	     * @see R.addIndex
	     * @example
	     *
	     *      var pairs = [ ['a', 1], ['b', 2], ['c', 3] ];
	     *      var flattenPairs = (acc, pair) => acc.concat(pair);
	     *
	     *      R.reduceRight(flattenPairs, [], pairs); //=> [ 'c', 3, 'b', 2, 'a', 1 ]
	     */
	    var reduceRight = _curry3(function reduceRight(fn, acc, list) {
	        var idx = list.length - 1;
	        while (idx >= 0) {
	            acc = fn(acc, list[idx]);
	            idx -= 1;
	        }
	        return acc;
	    });

	    /**
	     * Returns a value wrapped to indicate that it is the final value of the reduce
	     * and transduce functions. The returned value should be considered a black
	     * box: the internal structure is not guaranteed to be stable.
	     *
	     * Note: this optimization is unavailable to functions not explicitly listed
	     * above. For instance, it is not currently supported by reduceRight.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.15.0
	     * @category List
	     * @sig a -> *
	     * @param {*} x The final value of the reduce.
	     * @return {*} The wrapped value.
	     * @see R.reduce, R.transduce
	     * @example
	     *
	     *      R.reduce(
	     *        R.pipe(R.add, R.when(R.gte(R.__, 10), R.reduced)),
	     *        0,
	     *        [1, 2, 3, 4, 5]) // 10
	     */
	    var reduced = _curry1(_reduced);

	    /**
	     * Removes the sub-list of `list` starting at index `start` and containing
	     * `count` elements. _Note that this is not destructive_: it returns a copy of
	     * the list with the changes.
	     * <small>No lists have been harmed in the application of this function.</small>
	     *
	     * @func
	     * @memberOf R
	     * @since v0.2.2
	     * @category List
	     * @sig Number -> Number -> [a] -> [a]
	     * @param {Number} start The position to start removing elements
	     * @param {Number} count The number of elements to remove
	     * @param {Array} list The list to remove from
	     * @return {Array} A new Array with `count` elements from `start` removed.
	     * @example
	     *
	     *      R.remove(2, 3, [1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]
	     */
	    var remove = _curry3(function remove(start, count, list) {
	        return _concat(_slice(list, 0, Math.min(start, list.length)), _slice(list, Math.min(list.length, start + count)));
	    });

	    /**
	     * Replace a substring or regex match in a string with a replacement.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.7.0
	     * @category String
	     * @sig RegExp|String -> String -> String -> String
	     * @param {RegExp|String} pattern A regular expression or a substring to match.
	     * @param {String} replacement The string to replace the matches with.
	     * @param {String} str The String to do the search and replacement in.
	     * @return {String} The result.
	     * @example
	     *
	     *      R.replace('foo', 'bar', 'foo foo foo'); //=> 'bar foo foo'
	     *      R.replace(/foo/, 'bar', 'foo foo foo'); //=> 'bar foo foo'
	     *
	     *      // Use the "g" (global) flag to replace all occurrences:
	     *      R.replace(/foo/g, 'bar', 'foo foo foo'); //=> 'bar bar bar'
	     */
	    var replace = _curry3(function replace(regex, replacement, str) {
	        return str.replace(regex, replacement);
	    });

	    /**
	     * Returns a new list or string with the elements or characters in reverse
	     * order.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig [a] -> [a]
	     * @sig String -> String
	     * @param {Array|String} list
	     * @return {Array|String}
	     * @example
	     *
	     *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
	     *      R.reverse([1, 2]);     //=> [2, 1]
	     *      R.reverse([1]);        //=> [1]
	     *      R.reverse([]);         //=> []
	     *
	     *      R.reverse('abc');      //=> 'cba'
	     *      R.reverse('ab');       //=> 'ba'
	     *      R.reverse('a');        //=> 'a'
	     *      R.reverse('');         //=> ''
	     */
	    var reverse = _curry1(function reverse(list) {
	        return _isString(list) ? list.split('').reverse().join('') : _slice(list).reverse();
	    });

	    /**
	     * Scan is similar to reduce, but returns a list of successively reduced values
	     * from the left
	     *
	     * @func
	     * @memberOf R
	     * @since v0.10.0
	     * @category List
	     * @sig (a,b -> a) -> a -> [b] -> [a]
	     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
	     *        current element from the array
	     * @param {*} acc The accumulator value.
	     * @param {Array} list The list to iterate over.
	     * @return {Array} A list of all intermediately reduced values.
	     * @example
	     *
	     *      var numbers = [1, 2, 3, 4];
	     *      var factorials = R.scan(R.multiply, 1, numbers); //=> [1, 1, 2, 6, 24]
	     */
	    var scan = _curry3(function scan(fn, acc, list) {
	        var idx = 0;
	        var len = list.length;
	        var result = [acc];
	        while (idx < len) {
	            acc = fn(acc, list[idx]);
	            result[idx + 1] = acc;
	            idx += 1;
	        }
	        return result;
	    });

	    /**
	     * Returns the result of "setting" the portion of the given data structure
	     * focused by the given lens to the given value.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category Object
	     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	     * @sig Lens s a -> a -> s -> s
	     * @param {Lens} lens
	     * @param {*} v
	     * @param {*} x
	     * @return {*}
	     * @see R.prop, R.lensIndex, R.lensProp
	     * @example
	     *
	     *      var xLens = R.lensProp('x');
	     *
	     *      R.set(xLens, 4, {x: 1, y: 2});  //=> {x: 4, y: 2}
	     *      R.set(xLens, 8, {x: 1, y: 2});  //=> {x: 8, y: 2}
	     */
	    var set = _curry3(function set(lens, v, x) {
	        return over(lens, always(v), x);
	    });

	    /**
	     * Returns the elements of the given list or string (or object with a `slice`
	     * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
	     *
	     * Dispatches to the `slice` method of the third argument, if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.4
	     * @category List
	     * @sig Number -> Number -> [a] -> [a]
	     * @sig Number -> Number -> String -> String
	     * @param {Number} fromIndex The start index (inclusive).
	     * @param {Number} toIndex The end index (exclusive).
	     * @param {*} list
	     * @return {*}
	     * @example
	     *
	     *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
	     *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
	     *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
	     *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
	     *      R.slice(0, 3, 'ramda');                     //=> 'ram'
	     */
	    var slice = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
	        return Array.prototype.slice.call(list, fromIndex, toIndex);
	    }));

	    /**
	     * Returns a copy of the list, sorted according to the comparator function,
	     * which should accept two values at a time and return a negative number if the
	     * first value is smaller, a positive number if it's larger, and zero if they
	     * are equal. Please note that this is a **copy** of the list. It does not
	     * modify the original.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig (a,a -> Number) -> [a] -> [a]
	     * @param {Function} comparator A sorting function :: a -> b -> Int
	     * @param {Array} list The list to sort
	     * @return {Array} a new array with its elements sorted by the comparator function.
	     * @example
	     *
	     *      var diff = function(a, b) { return a - b; };
	     *      R.sort(diff, [4,2,7,5]); //=> [2, 4, 5, 7]
	     */
	    var sort = _curry2(function sort(comparator, list) {
	        return _slice(list).sort(comparator);
	    });

	    /**
	     * Sorts the list according to the supplied function.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig Ord b => (a -> b) -> [a] -> [a]
	     * @param {Function} fn
	     * @param {Array} list The list to sort.
	     * @return {Array} A new list sorted by the keys generated by `fn`.
	     * @example
	     *
	     *      var sortByFirstItem = R.sortBy(R.prop(0));
	     *      var sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));
	     *      var pairs = [[-1, 1], [-2, 2], [-3, 3]];
	     *      sortByFirstItem(pairs); //=> [[-3, 3], [-2, 2], [-1, 1]]
	     *      var alice = {
	     *        name: 'ALICE',
	     *        age: 101
	     *      };
	     *      var bob = {
	     *        name: 'Bob',
	     *        age: -10
	     *      };
	     *      var clara = {
	     *        name: 'clara',
	     *        age: 314.159
	     *      };
	     *      var people = [clara, bob, alice];
	     *      sortByNameCaseInsensitive(people); //=> [alice, bob, clara]
	     */
	    var sortBy = _curry2(function sortBy(fn, list) {
	        return _slice(list).sort(function (a, b) {
	            var aa = fn(a);
	            var bb = fn(b);
	            return aa < bb ? -1 : aa > bb ? 1 : 0;
	        });
	    });

	    /**
	     * Splits a given list or string at a given index.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category List
	     * @sig Number -> [a] -> [[a], [a]]
	     * @sig Number -> String -> [String, String]
	     * @param {Number} index The index where the array/string is split.
	     * @param {Array|String} array The array/string to be split.
	     * @return {Array}
	     * @example
	     *
	     *      R.splitAt(1, [1, 2, 3]);          //=> [[1], [2, 3]]
	     *      R.splitAt(5, 'hello world');      //=> ['hello', ' world']
	     *      R.splitAt(-1, 'foobar');          //=> ['fooba', 'r']
	     */
	    var splitAt = _curry2(function splitAt(index, array) {
	        return [
	            slice(0, index, array),
	            slice(index, length(array), array)
	        ];
	    });

	    /**
	     * Splits a collection into slices of the specified length.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category List
	     * @sig Number -> [a] -> [[a]]
	     * @sig Number -> String -> [String]
	     * @param {Number} n
	     * @param {Array} list
	     * @return {Array}
	     * @example
	     *
	     *      R.splitEvery(3, [1, 2, 3, 4, 5, 6, 7]); //=> [[1, 2, 3], [4, 5, 6], [7]]
	     *      R.splitEvery(3, 'foobarbaz'); //=> ['foo', 'bar', 'baz']
	     */
	    var splitEvery = _curry2(function splitEvery(n, list) {
	        if (n <= 0) {
	            throw new Error('First argument to splitEvery must be a positive integer');
	        }
	        var result = [];
	        var idx = 0;
	        while (idx < list.length) {
	            result.push(slice(idx, idx += n, list));
	        }
	        return result;
	    });

	    /**
	     * Takes a list and a predicate and returns a pair of lists with the following properties:
	     *
	     *  - the result of concatenating the two output lists is equivalent to the input list;
	     *  - none of the elements of the first output list satisfies the predicate; and
	     *  - if the second output list is non-empty, its first element satisfies the predicate.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> [[a], [a]]
	     * @param {Function} pred The predicate that determines where the array is split.
	     * @param {Array} list The array to be split.
	     * @return {Array}
	     * @example
	     *
	     *      R.splitWhen(R.equals(2), [1, 2, 3, 1, 2, 3]);   //=> [[1], [2, 3, 1, 2, 3]]
	     */
	    var splitWhen = _curry2(function splitWhen(pred, list) {
	        var idx = 0;
	        var len = list.length;
	        var prefix = [];
	        while (idx < len && !pred(list[idx])) {
	            prefix.push(list[idx]);
	            idx += 1;
	        }
	        return [
	            prefix,
	            _slice(list, idx)
	        ];
	    });

	    /**
	     * Subtracts its second argument from its first argument.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Math
	     * @sig Number -> Number -> Number
	     * @param {Number} a The first value.
	     * @param {Number} b The second value.
	     * @return {Number} The result of `a - b`.
	     * @see R.add
	     * @example
	     *
	     *      R.subtract(10, 8); //=> 2
	     *
	     *      var minus5 = R.subtract(R.__, 5);
	     *      minus5(17); //=> 12
	     *
	     *      var complementaryAngle = R.subtract(90);
	     *      complementaryAngle(30); //=> 60
	     *      complementaryAngle(72); //=> 18
	     */
	    var subtract = _curry2(function subtract(a, b) {
	        return Number(a) - Number(b);
	    });

	    /**
	     * Returns all but the first element of the given list or string (or object
	     * with a `tail` method).
	     *
	     * Dispatches to the `slice` method of the first argument, if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig [a] -> [a]
	     * @sig String -> String
	     * @param {*} list
	     * @return {*}
	     * @see R.head, R.init, R.last
	     * @example
	     *
	     *      R.tail([1, 2, 3]);  //=> [2, 3]
	     *      R.tail([1, 2]);     //=> [2]
	     *      R.tail([1]);        //=> []
	     *      R.tail([]);         //=> []
	     *
	     *      R.tail('abc');  //=> 'bc'
	     *      R.tail('ab');   //=> 'b'
	     *      R.tail('a');    //=> ''
	     *      R.tail('');     //=> ''
	     */
	    var tail = _checkForMethod('tail', slice(1, Infinity));

	    /**
	     * Returns the first `n` elements of the given list, string, or
	     * transducer/transformer (or object with a `take` method).
	     *
	     * Dispatches to the `take` method of the second argument, if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig Number -> [a] -> [a]
	     * @sig Number -> String -> String
	     * @param {Number} n
	     * @param {*} list
	     * @return {*}
	     * @see R.drop
	     * @example
	     *
	     *      R.take(1, ['foo', 'bar', 'baz']); //=> ['foo']
	     *      R.take(2, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
	     *      R.take(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
	     *      R.take(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
	     *      R.take(3, 'ramda');               //=> 'ram'
	     *
	     *      var personnel = [
	     *        'Dave Brubeck',
	     *        'Paul Desmond',
	     *        'Eugene Wright',
	     *        'Joe Morello',
	     *        'Gerry Mulligan',
	     *        'Bob Bates',
	     *        'Joe Dodge',
	     *        'Ron Crotty'
	     *      ];
	     *
	     *      var takeFive = R.take(5);
	     *      takeFive(personnel);
	     *      //=> ['Dave Brubeck', 'Paul Desmond', 'Eugene Wright', 'Joe Morello', 'Gerry Mulligan']
	     */
	    var take = _curry2(_dispatchable('take', _xtake, function take(n, xs) {
	        return slice(0, n < 0 ? Infinity : n, xs);
	    }));

	    /**
	     * Returns a new list containing the last `n` elements of a given list, passing
	     * each value to the supplied predicate function, and terminating when the
	     * predicate function returns `false`. Excludes the element that caused the
	     * predicate function to fail. The predicate function is passed one argument:
	     * *(value)*.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> [a]
	     * @param {Function} fn The function called per iteration.
	     * @param {Array} list The collection to iterate over.
	     * @return {Array} A new array.
	     * @see R.dropLastWhile, R.addIndex
	     * @example
	     *
	     *      var isNotOne = x => x !== 1;
	     *
	     *      R.takeLastWhile(isNotOne, [1, 2, 3, 4]); //=> [2, 3, 4]
	     */
	    var takeLastWhile = _curry2(function takeLastWhile(fn, list) {
	        var idx = list.length - 1;
	        while (idx >= 0 && fn(list[idx])) {
	            idx -= 1;
	        }
	        return _slice(list, idx + 1, Infinity);
	    });

	    /**
	     * Returns a new list containing the first `n` elements of a given list,
	     * passing each value to the supplied predicate function, and terminating when
	     * the predicate function returns `false`. Excludes the element that caused the
	     * predicate function to fail. The predicate function is passed one argument:
	     * *(value)*.
	     *
	     * Dispatches to the `takeWhile` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> [a]
	     * @param {Function} fn The function called per iteration.
	     * @param {Array} list The collection to iterate over.
	     * @return {Array} A new array.
	     * @see R.dropWhile, R.transduce, R.addIndex
	     * @example
	     *
	     *      var isNotFour = x => x !== 4;
	     *
	     *      R.takeWhile(isNotFour, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3]
	     */
	    var takeWhile = _curry2(_dispatchable('takeWhile', _xtakeWhile, function takeWhile(fn, list) {
	        var idx = 0;
	        var len = list.length;
	        while (idx < len && fn(list[idx])) {
	            idx += 1;
	        }
	        return _slice(list, 0, idx);
	    }));

	    /**
	     * Runs the given function with the supplied object, then returns the object.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig (a -> *) -> a -> a
	     * @param {Function} fn The function to call with `x`. The return value of `fn` will be thrown away.
	     * @param {*} x
	     * @return {*} `x`.
	     * @example
	     *
	     *      var sayX = x => console.log('x is ' + x);
	     *      R.tap(sayX, 100); //=> 100
	     *      // logs 'x is 100'
	     */
	    var tap = _curry2(function tap(fn, x) {
	        fn(x);
	        return x;
	    });

	    /**
	     * Calls an input function `n` times, returning an array containing the results
	     * of those function calls.
	     *
	     * `fn` is passed one argument: The current value of `n`, which begins at `0`
	     * and is gradually incremented to `n - 1`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.2.3
	     * @category List
	     * @sig (Number -> a) -> Number -> [a]
	     * @param {Function} fn The function to invoke. Passed one argument, the current value of `n`.
	     * @param {Number} n A value between `0` and `n - 1`. Increments after each function call.
	     * @return {Array} An array containing the return values of all calls to `fn`.
	     * @example
	     *
	     *      R.times(R.identity, 5); //=> [0, 1, 2, 3, 4]
	     */
	    var times = _curry2(function times(fn, n) {
	        var len = Number(n);
	        var idx = 0;
	        var list;
	        if (len < 0 || isNaN(len)) {
	            throw new RangeError('n must be a non-negative number');
	        }
	        list = new Array(len);
	        while (idx < len) {
	            list[idx] = fn(idx);
	            idx += 1;
	        }
	        return list;
	    });

	    /**
	     * Converts an object into an array of key, value arrays. Only the object's
	     * own properties are used.
	     * Note that the order of the output array is not guaranteed to be consistent
	     * across different JS platforms.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.4.0
	     * @category Object
	     * @sig {String: *} -> [[String,*]]
	     * @param {Object} obj The object to extract from
	     * @return {Array} An array of key, value arrays from the object's own properties.
	     * @see R.fromPairs
	     * @example
	     *
	     *      R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]
	     */
	    var toPairs = _curry1(function toPairs(obj) {
	        var pairs = [];
	        for (var prop in obj) {
	            if (_has(prop, obj)) {
	                pairs[pairs.length] = [
	                    prop,
	                    obj[prop]
	                ];
	            }
	        }
	        return pairs;
	    });

	    /**
	     * Converts an object into an array of key, value arrays. The object's own
	     * properties and prototype properties are used. Note that the order of the
	     * output array is not guaranteed to be consistent across different JS
	     * platforms.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.4.0
	     * @category Object
	     * @sig {String: *} -> [[String,*]]
	     * @param {Object} obj The object to extract from
	     * @return {Array} An array of key, value arrays from the object's own
	     *         and prototype properties.
	     * @example
	     *
	     *      var F = function() { this.x = 'X'; };
	     *      F.prototype.y = 'Y';
	     *      var f = new F();
	     *      R.toPairsIn(f); //=> [['x','X'], ['y','Y']]
	     */
	    var toPairsIn = _curry1(function toPairsIn(obj) {
	        var pairs = [];
	        for (var prop in obj) {
	            pairs[pairs.length] = [
	                prop,
	                obj[prop]
	            ];
	        }
	        return pairs;
	    });

	    /**
	     * Transposes the rows and columns of a 2D list.
	     * When passed a list of `n` lists of length `x`,
	     * returns a list of `x` lists of length `n`.
	     *
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category List
	     * @sig [[a]] -> [[a]]
	     * @param {Array} list A 2D list
	     * @return {Array} A 2D list
	     * @example
	     *
	     *      R.transpose([[1, 'a'], [2, 'b'], [3, 'c']]) //=> [[1, 2, 3], ['a', 'b', 'c']]
	     *      R.transpose([[1, 2, 3], ['a', 'b', 'c']]) //=> [[1, 'a'], [2, 'b'], [3, 'c']]
	     *
	     * If some of the rows are shorter than the following rows, their elements are skipped:
	     *
	     *      R.transpose([[10, 11], [20], [], [30, 31, 32]]) //=> [[10, 20, 30], [11, 31], [32]]
	     */
	    var transpose = _curry1(function transpose(outerlist) {
	        var i = 0;
	        var result = [];
	        while (i < outerlist.length) {
	            var innerlist = outerlist[i];
	            var j = 0;
	            while (j < innerlist.length) {
	                if (typeof result[j] === 'undefined') {
	                    result[j] = [];
	                }
	                result[j].push(innerlist[j]);
	                j += 1;
	            }
	            i += 1;
	        }
	        return result;
	    });

	    /**
	     * Removes (strips) whitespace from both ends of the string.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.6.0
	     * @category String
	     * @sig String -> String
	     * @param {String} str The string to trim.
	     * @return {String} Trimmed version of `str`.
	     * @example
	     *
	     *      R.trim('   xyz  '); //=> 'xyz'
	     *      R.map(R.trim, R.split(',', 'x, y, z')); //=> ['x', 'y', 'z']
	     */
	    var trim = function () {
	        var ws = '\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
	        var zeroWidth = '\u200B';
	        var hasProtoTrim = typeof String.prototype.trim === 'function';
	        if (!hasProtoTrim || (ws.trim() || !zeroWidth.trim())) {
	            return _curry1(function trim(str) {
	                var beginRx = new RegExp('^[' + ws + '][' + ws + ']*');
	                var endRx = new RegExp('[' + ws + '][' + ws + ']*$');
	                return str.replace(beginRx, '').replace(endRx, '');
	            });
	        } else {
	            return _curry1(function trim(str) {
	                return str.trim();
	            });
	        }
	    }();

	    /**
	     * `tryCatch` takes two functions, a `tryer` and a `catcher`. The returned
	     * function evaluates the `tryer`; if it does not throw, it simply returns the
	     * result. If the `tryer` *does* throw, the returned function evaluates the
	     * `catcher` function and returns its result. Note that for effective
	     * composition with this function, both the `tryer` and `catcher` functions
	     * must return the same type of results.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.20.0
	     * @category Function
	     * @sig (...x -> a) -> ((e, ...x) -> a) -> (...x -> a)
	     * @param {Function} tryer The function that may throw.
	     * @param {Function} catcher The function that will be evaluated if `tryer` throws.
	     * @return {Function} A new function that will catch exceptions and send then to the catcher.
	     * @example
	     *
	     *      R.tryCatch(R.prop('x'), R.F)({x: true}); //=> true
	     *      R.tryCatch(R.prop('x'), R.F)(null);      //=> false
	     */
	    var tryCatch = _curry2(function _tryCatch(tryer, catcher) {
	        return _arity(tryer.length, function () {
	            try {
	                return tryer.apply(this, arguments);
	            } catch (e) {
	                return catcher.apply(this, _concat([e], arguments));
	            }
	        });
	    });

	    /**
	     * Gives a single-word string description of the (native) type of a value,
	     * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
	     * attempt to distinguish user Object types any further, reporting them all as
	     * 'Object'.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.8.0
	     * @category Type
	     * @sig (* -> {*}) -> String
	     * @param {*} val The value to test
	     * @return {String}
	     * @example
	     *
	     *      R.type({}); //=> "Object"
	     *      R.type(1); //=> "Number"
	     *      R.type(false); //=> "Boolean"
	     *      R.type('s'); //=> "String"
	     *      R.type(null); //=> "Null"
	     *      R.type([]); //=> "Array"
	     *      R.type(/[A-z]/); //=> "RegExp"
	     */
	    var type = _curry1(function type(val) {
	        return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
	    });

	    /**
	     * Takes a function `fn`, which takes a single array argument, and returns a
	     * function which:
	     *
	     *   - takes any number of positional arguments;
	     *   - passes these arguments to `fn` as an array; and
	     *   - returns the result.
	     *
	     * In other words, R.unapply derives a variadic function from a function which
	     * takes an array. R.unapply is the inverse of R.apply.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.8.0
	     * @category Function
	     * @sig ([*...] -> a) -> (*... -> a)
	     * @param {Function} fn
	     * @return {Function}
	     * @see R.apply
	     * @example
	     *
	     *      R.unapply(JSON.stringify)(1, 2, 3); //=> '[1,2,3]'
	     */
	    var unapply = _curry1(function unapply(fn) {
	        return function () {
	            return fn(_slice(arguments));
	        };
	    });

	    /**
	     * Wraps a function of any arity (including nullary) in a function that accepts
	     * exactly 1 parameter. Any extraneous parameters will not be passed to the
	     * supplied function.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.2.0
	     * @category Function
	     * @sig (* -> b) -> (a -> b)
	     * @param {Function} fn The function to wrap.
	     * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
	     *         arity 1.
	     * @example
	     *
	     *      var takesTwoArgs = function(a, b) {
	     *        return [a, b];
	     *      };
	     *      takesTwoArgs.length; //=> 2
	     *      takesTwoArgs(1, 2); //=> [1, 2]
	     *
	     *      var takesOneArg = R.unary(takesTwoArgs);
	     *      takesOneArg.length; //=> 1
	     *      // Only 1 argument is passed to the wrapped function
	     *      takesOneArg(1, 2); //=> [1, undefined]
	     */
	    var unary = _curry1(function unary(fn) {
	        return nAry(1, fn);
	    });

	    /**
	     * Returns a function of arity `n` from a (manually) curried function.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.14.0
	     * @category Function
	     * @sig Number -> (a -> b) -> (a -> c)
	     * @param {Number} length The arity for the returned function.
	     * @param {Function} fn The function to uncurry.
	     * @return {Function} A new function.
	     * @see R.curry
	     * @example
	     *
	     *      var addFour = a => b => c => d => a + b + c + d;
	     *
	     *      var uncurriedAddFour = R.uncurryN(4, addFour);
	     *      uncurriedAddFour(1, 2, 3, 4); //=> 10
	     */
	    var uncurryN = _curry2(function uncurryN(depth, fn) {
	        return curryN(depth, function () {
	            var currentDepth = 1;
	            var value = fn;
	            var idx = 0;
	            var endIdx;
	            while (currentDepth <= depth && typeof value === 'function') {
	                endIdx = currentDepth === depth ? arguments.length : idx + value.length;
	                value = value.apply(this, _slice(arguments, idx, endIdx));
	                currentDepth += 1;
	                idx = endIdx;
	            }
	            return value;
	        });
	    });

	    /**
	     * Builds a list from a seed value. Accepts an iterator function, which returns
	     * either false to stop iteration or an array of length 2 containing the value
	     * to add to the resulting list and the seed to be used in the next call to the
	     * iterator function.
	     *
	     * The iterator function receives one argument: *(seed)*.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.10.0
	     * @category List
	     * @sig (a -> [b]) -> * -> [b]
	     * @param {Function} fn The iterator function. receives one argument, `seed`, and returns
	     *        either false to quit iteration or an array of length two to proceed. The element
	     *        at index 0 of this array will be added to the resulting array, and the element
	     *        at index 1 will be passed to the next call to `fn`.
	     * @param {*} seed The seed value.
	     * @return {Array} The final list.
	     * @example
	     *
	     *      var f = n => n > 50 ? false : [-n, n + 10];
	     *      R.unfold(f, 10); //=> [-10, -20, -30, -40, -50]
	     */
	    var unfold = _curry2(function unfold(fn, seed) {
	        var pair = fn(seed);
	        var result = [];
	        while (pair && pair.length) {
	            result[result.length] = pair[0];
	            pair = fn(pair[1]);
	        }
	        return result;
	    });

	    /**
	     * Returns a new list containing only one copy of each element in the original
	     * list, based upon the value returned by applying the supplied predicate to
	     * two list elements. Prefers the first item if two items compare equal based
	     * on the predicate.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.2.0
	     * @category List
	     * @sig (a, a -> Boolean) -> [a] -> [a]
	     * @param {Function} pred A predicate used to test whether two items are equal.
	     * @param {Array} list The array to consider.
	     * @return {Array} The list of unique items.
	     * @example
	     *
	     *      var strEq = R.eqBy(String);
	     *      R.uniqWith(strEq)([1, '1', 2, 1]); //=> [1, 2]
	     *      R.uniqWith(strEq)([{}, {}]);       //=> [{}]
	     *      R.uniqWith(strEq)([1, '1', 1]);    //=> [1]
	     *      R.uniqWith(strEq)(['1', 1, 1]);    //=> ['1']
	     */
	    var uniqWith = _curry2(function uniqWith(pred, list) {
	        var idx = 0;
	        var len = list.length;
	        var result = [];
	        var item;
	        while (idx < len) {
	            item = list[idx];
	            if (!_containsWith(pred, item, result)) {
	                result[result.length] = item;
	            }
	            idx += 1;
	        }
	        return result;
	    });

	    /**
	     * Tests the final argument by passing it to the given predicate function. If
	     * the predicate is not satisfied, the function will return the result of
	     * calling the `whenFalseFn` function with the same argument. If the predicate
	     * is satisfied, the argument is returned as is.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.18.0
	     * @category Logic
	     * @sig (a -> Boolean) -> (a -> a) -> a -> a
	     * @param {Function} pred        A predicate function
	     * @param {Function} whenFalseFn A function to invoke when the `pred` evaluates
	     *                               to a falsy value.
	     * @param {*}        x           An object to test with the `pred` function and
	     *                               pass to `whenFalseFn` if necessary.
	     * @return {*} Either `x` or the result of applying `x` to `whenFalseFn`.
	     * @see R.ifElse, R.when
	     * @example
	     *
	     *      // coerceArray :: (a|[a]) -> [a]
	     *      var coerceArray = R.unless(R.isArrayLike, R.of);
	     *      coerceArray([1, 2, 3]); //=> [1, 2, 3]
	     *      coerceArray(1);         //=> [1]
	     */
	    var unless = _curry3(function unless(pred, whenFalseFn, x) {
	        return pred(x) ? x : whenFalseFn(x);
	    });

	    /**
	     * Takes a predicate, a transformation function, and an initial value,
	     * and returns a value of the same type as the initial value.
	     * It does so by applying the transformation until the predicate is satisfied,
	     * at which point it returns the satisfactory value.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.20.0
	     * @category Logic
	     * @sig (a -> Boolean) -> (a -> a) -> a -> a
	     * @param {Function} pred A predicate function
	     * @param {Function} fn The iterator function
	     * @param {*} init Initial value
	     * @return {*} Final value that satisfies predicate
	     * @example
	     *
	     *      R.until(R.gt(R.__, 100), R.multiply(2))(1) // => 128
	     */
	    var until = _curry3(function until(pred, fn, init) {
	        var val = init;
	        while (!pred(val)) {
	            val = fn(val);
	        }
	        return val;
	    });

	    /**
	     * Returns a new copy of the array with the element at the provided index
	     * replaced with the given value.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.14.0
	     * @category List
	     * @sig Number -> a -> [a] -> [a]
	     * @param {Number} idx The index to update.
	     * @param {*} x The value to exist at the given index of the returned array.
	     * @param {Array|Arguments} list The source array-like object to be updated.
	     * @return {Array} A copy of `list` with the value at index `idx` replaced with `x`.
	     * @see R.adjust
	     * @example
	     *
	     *      R.update(1, 11, [0, 1, 2]);     //=> [0, 11, 2]
	     *      R.update(1)(11)([0, 1, 2]);     //=> [0, 11, 2]
	     */
	    var update = _curry3(function update(idx, x, list) {
	        return adjust(always(x), idx, list);
	    });

	    /**
	     * Accepts a function `fn` and a list of transformer functions and returns a
	     * new curried function. When the new function is invoked, it calls the
	     * function `fn` with parameters consisting of the result of calling each
	     * supplied handler on successive arguments to the new function.
	     *
	     * If more arguments are passed to the returned function than transformer
	     * functions, those arguments are passed directly to `fn` as additional
	     * parameters. If you expect additional arguments that don't need to be
	     * transformed, although you can ignore them, it's best to pass an identity
	     * function so that the new function reports the correct arity.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig (x1 -> x2 -> ... -> z) -> [(a -> x1), (b -> x2), ...] -> (a -> b -> ... -> z)
	     * @param {Function} fn The function to wrap.
	     * @param {Array} transformers A list of transformer functions
	     * @return {Function} The wrapped function.
	     * @example
	     *
	     *      R.useWith(Math.pow, [R.identity, R.identity])(3, 4); //=> 81
	     *      R.useWith(Math.pow, [R.identity, R.identity])(3)(4); //=> 81
	     *      R.useWith(Math.pow, [R.dec, R.inc])(3, 4); //=> 32
	     *      R.useWith(Math.pow, [R.dec, R.inc])(3)(4); //=> 32
	     */
	    var useWith = _curry2(function useWith(fn, transformers) {
	        return curryN(transformers.length, function () {
	            var args = [];
	            var idx = 0;
	            while (idx < transformers.length) {
	                args.push(transformers[idx].call(this, arguments[idx]));
	                idx += 1;
	            }
	            return fn.apply(this, args.concat(_slice(arguments, transformers.length)));
	        });
	    });

	    /**
	     * Returns a list of all the enumerable own properties of the supplied object.
	     * Note that the order of the output array is not guaranteed across different
	     * JS platforms.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Object
	     * @sig {k: v} -> [v]
	     * @param {Object} obj The object to extract values from
	     * @return {Array} An array of the values of the object's own properties.
	     * @example
	     *
	     *      R.values({a: 1, b: 2, c: 3}); //=> [1, 2, 3]
	     */
	    var values = _curry1(function values(obj) {
	        var props = keys(obj);
	        var len = props.length;
	        var vals = [];
	        var idx = 0;
	        while (idx < len) {
	            vals[idx] = obj[props[idx]];
	            idx += 1;
	        }
	        return vals;
	    });

	    /**
	     * Returns a list of all the properties, including prototype properties, of the
	     * supplied object.
	     * Note that the order of the output array is not guaranteed to be consistent
	     * across different JS platforms.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.2.0
	     * @category Object
	     * @sig {k: v} -> [v]
	     * @param {Object} obj The object to extract values from
	     * @return {Array} An array of the values of the object's own and prototype properties.
	     * @example
	     *
	     *      var F = function() { this.x = 'X'; };
	     *      F.prototype.y = 'Y';
	     *      var f = new F();
	     *      R.valuesIn(f); //=> ['X', 'Y']
	     */
	    var valuesIn = _curry1(function valuesIn(obj) {
	        var prop;
	        var vs = [];
	        for (prop in obj) {
	            vs[vs.length] = obj[prop];
	        }
	        return vs;
	    });

	    /**
	     * Returns a "view" of the given data structure, determined by the given lens.
	     * The lens's focus determines which portion of the data structure is visible.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category Object
	     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	     * @sig Lens s a -> s -> a
	     * @param {Lens} lens
	     * @param {*} x
	     * @return {*}
	     * @see R.prop, R.lensIndex, R.lensProp
	     * @example
	     *
	     *      var xLens = R.lensProp('x');
	     *
	     *      R.view(xLens, {x: 1, y: 2});  //=> 1
	     *      R.view(xLens, {x: 4, y: 2});  //=> 4
	     */
	    // `Const` is a functor that effectively ignores the function given to `map`.
	    // Using `Const` effectively ignores the setter function of the `lens`,
	    // leaving the value returned by the getter function unmodified.
	    var view = function () {
	        // `Const` is a functor that effectively ignores the function given to `map`.
	        var Const = function (x) {
	            return {
	                value: x,
	                map: function () {
	                    return this;
	                }
	            };
	        };
	        return _curry2(function view(lens, x) {
	            // Using `Const` effectively ignores the setter function of the `lens`,
	            // leaving the value returned by the getter function unmodified.
	            return lens(Const)(x).value;
	        });
	    }();

	    /**
	     * Tests the final argument by passing it to the given predicate function. If
	     * the predicate is satisfied, the function will return the result of calling
	     * the `whenTrueFn` function with the same argument. If the predicate is not
	     * satisfied, the argument is returned as is.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.18.0
	     * @category Logic
	     * @sig (a -> Boolean) -> (a -> a) -> a -> a
	     * @param {Function} pred       A predicate function
	     * @param {Function} whenTrueFn A function to invoke when the `condition`
	     *                              evaluates to a truthy value.
	     * @param {*}        x          An object to test with the `pred` function and
	     *                              pass to `whenTrueFn` if necessary.
	     * @return {*} Either `x` or the result of applying `x` to `whenTrueFn`.
	     * @see R.ifElse, R.unless
	     * @example
	     *
	     *      // truncate :: String -> String
	     *      var truncate = R.when(
	     *        R.propSatisfies(R.gt(R.__, 10), 'length'),
	     *        R.pipe(R.take(10), R.append('…'), R.join(''))
	     *      );
	     *      truncate('12345');         //=> '12345'
	     *      truncate('0123456789ABC'); //=> '0123456789…'
	     */
	    var when = _curry3(function when(pred, whenTrueFn, x) {
	        return pred(x) ? whenTrueFn(x) : x;
	    });

	    /**
	     * Takes a spec object and a test object; returns true if the test satisfies
	     * the spec. Each of the spec's own properties must be a predicate function.
	     * Each predicate is applied to the value of the corresponding property of the
	     * test object. `where` returns true if all the predicates return true, false
	     * otherwise.
	     *
	     * `where` is well suited to declaratively expressing constraints for other
	     * functions such as `filter` and `find`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.1
	     * @category Object
	     * @sig {String: (* -> Boolean)} -> {String: *} -> Boolean
	     * @param {Object} spec
	     * @param {Object} testObj
	     * @return {Boolean}
	     * @example
	     *
	     *      // pred :: Object -> Boolean
	     *      var pred = where({
	     *        a: equals('foo'),
	     *        b: complement(equals('bar')),
	     *        x: gt(__, 10),
	     *        y: lt(__, 20)
	     *      });
	     *
	     *      pred({a: 'foo', b: 'xxx', x: 11, y: 19}); //=> true
	     *      pred({a: 'xxx', b: 'xxx', x: 11, y: 19}); //=> false
	     *      pred({a: 'foo', b: 'bar', x: 11, y: 19}); //=> false
	     *      pred({a: 'foo', b: 'xxx', x: 10, y: 19}); //=> false
	     *      pred({a: 'foo', b: 'xxx', x: 11, y: 20}); //=> false
	     */
	    var where = _curry2(function where(spec, testObj) {
	        for (var prop in spec) {
	            if (_has(prop, spec) && !spec[prop](testObj[prop])) {
	                return false;
	            }
	        }
	        return true;
	    });

	    /**
	     * Wrap a function inside another to allow you to make adjustments to the
	     * parameters, or do other processing either before the internal function is
	     * called or with its results.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig (a... -> b) -> ((a... -> b) -> a... -> c) -> (a... -> c)
	     * @param {Function} fn The function to wrap.
	     * @param {Function} wrapper The wrapper function.
	     * @return {Function} The wrapped function.
	     * @deprecated since v0.22.0
	     * @example
	     *
	     *      var greet = name => 'Hello ' + name;
	     *
	     *      var shoutedGreet = R.wrap(greet, (gr, name) => gr(name).toUpperCase());
	     *
	     *      shoutedGreet("Kathy"); //=> "HELLO KATHY"
	     *
	     *      var shortenedGreet = R.wrap(greet, function(gr, name) {
	     *        return gr(name.substring(0, 3));
	     *      });
	     *      shortenedGreet("Robert"); //=> "Hello Rob"
	     */
	    var wrap = _curry2(function wrap(fn, wrapper) {
	        return curryN(fn.length, function () {
	            return wrapper.apply(this, _concat([fn], arguments));
	        });
	    });

	    /**
	     * Creates a new list out of the two supplied by creating each possible pair
	     * from the lists.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig [a] -> [b] -> [[a,b]]
	     * @param {Array} as The first list.
	     * @param {Array} bs The second list.
	     * @return {Array} The list made by combining each possible pair from
	     *         `as` and `bs` into pairs (`[a, b]`).
	     * @example
	     *
	     *      R.xprod([1, 2], ['a', 'b']); //=> [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
	     */
	    // = xprodWith(prepend); (takes about 3 times as long...)
	    var xprod = _curry2(function xprod(a, b) {
	        // = xprodWith(prepend); (takes about 3 times as long...)
	        var idx = 0;
	        var ilen = a.length;
	        var j;
	        var jlen = b.length;
	        var result = [];
	        while (idx < ilen) {
	            j = 0;
	            while (j < jlen) {
	                result[result.length] = [
	                    a[idx],
	                    b[j]
	                ];
	                j += 1;
	            }
	            idx += 1;
	        }
	        return result;
	    });

	    /**
	     * Creates a new list out of the two supplied by pairing up equally-positioned
	     * items from both lists. The returned list is truncated to the length of the
	     * shorter of the two input lists.
	     * Note: `zip` is equivalent to `zipWith(function(a, b) { return [a, b] })`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig [a] -> [b] -> [[a,b]]
	     * @param {Array} list1 The first array to consider.
	     * @param {Array} list2 The second array to consider.
	     * @return {Array} The list made by pairing up same-indexed elements of `list1` and `list2`.
	     * @example
	     *
	     *      R.zip([1, 2, 3], ['a', 'b', 'c']); //=> [[1, 'a'], [2, 'b'], [3, 'c']]
	     */
	    var zip = _curry2(function zip(a, b) {
	        var rv = [];
	        var idx = 0;
	        var len = Math.min(a.length, b.length);
	        while (idx < len) {
	            rv[idx] = [
	                a[idx],
	                b[idx]
	            ];
	            idx += 1;
	        }
	        return rv;
	    });

	    /**
	     * Creates a new object out of a list of keys and a list of values.
	     * Key/value pairing is truncated to the length of the shorter of the two lists.
	     * Note: `zipObj` is equivalent to `pipe(zipWith(pair), fromPairs)`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.3.0
	     * @category List
	     * @sig [String] -> [*] -> {String: *}
	     * @param {Array} keys The array that will be properties on the output object.
	     * @param {Array} values The list of values on the output object.
	     * @return {Object} The object made by pairing up same-indexed elements of `keys` and `values`.
	     * @example
	     *
	     *      R.zipObj(['a', 'b', 'c'], [1, 2, 3]); //=> {a: 1, b: 2, c: 3}
	     */
	    var zipObj = _curry2(function zipObj(keys, values) {
	        var idx = 0;
	        var len = Math.min(keys.length, values.length);
	        var out = {};
	        while (idx < len) {
	            out[keys[idx]] = values[idx];
	            idx += 1;
	        }
	        return out;
	    });

	    /**
	     * Creates a new list out of the two supplied by applying the function to each
	     * equally-positioned pair in the lists. The returned list is truncated to the
	     * length of the shorter of the two input lists.
	     *
	     * @function
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig (a,b -> c) -> [a] -> [b] -> [c]
	     * @param {Function} fn The function used to combine the two elements into one value.
	     * @param {Array} list1 The first array to consider.
	     * @param {Array} list2 The second array to consider.
	     * @return {Array} The list made by combining same-indexed elements of `list1` and `list2`
	     *         using `fn`.
	     * @example
	     *
	     *      var f = (x, y) => {
	     *        // ...
	     *      };
	     *      R.zipWith(f, [1, 2, 3], ['a', 'b', 'c']);
	     *      //=> [f(1, 'a'), f(2, 'b'), f(3, 'c')]
	     */
	    var zipWith = _curry3(function zipWith(fn, a, b) {
	        var rv = [];
	        var idx = 0;
	        var len = Math.min(a.length, b.length);
	        while (idx < len) {
	            rv[idx] = fn(a[idx], b[idx]);
	            idx += 1;
	        }
	        return rv;
	    });

	    /**
	     * A function that always returns `false`. Any passed in parameters are ignored.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Function
	     * @sig * -> Boolean
	     * @param {*}
	     * @return {Boolean}
	     * @see R.always, R.T
	     * @example
	     *
	     *      R.F(); //=> false
	     */
	    var F = always(false);

	    /**
	     * A function that always returns `true`. Any passed in parameters are ignored.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Function
	     * @sig * -> Boolean
	     * @param {*}
	     * @return {Boolean}
	     * @see R.always, R.F
	     * @example
	     *
	     *      R.T(); //=> true
	     */
	    var T = always(true);

	    /**
	     * Copies an object.
	     *
	     * @private
	     * @param {*} value The value to be copied
	     * @param {Array} refFrom Array containing the source references
	     * @param {Array} refTo Array containing the copied source references
	     * @param {Boolean} deep Whether or not to perform deep cloning.
	     * @return {*} The copied value.
	     */
	    var _clone = function _clone(value, refFrom, refTo, deep) {
	        var copy = function copy(copiedValue) {
	            var len = refFrom.length;
	            var idx = 0;
	            while (idx < len) {
	                if (value === refFrom[idx]) {
	                    return refTo[idx];
	                }
	                idx += 1;
	            }
	            refFrom[idx + 1] = value;
	            refTo[idx + 1] = copiedValue;
	            for (var key in value) {
	                copiedValue[key] = deep ? _clone(value[key], refFrom, refTo, true) : value[key];
	            }
	            return copiedValue;
	        };
	        switch (type(value)) {
	        case 'Object':
	            return copy({});
	        case 'Array':
	            return copy([]);
	        case 'Date':
	            return new Date(value.valueOf());
	        case 'RegExp':
	            return _cloneRegExp(value);
	        default:
	            return value;
	        }
	    };

	    var _createPartialApplicator = function _createPartialApplicator(concat) {
	        return _curry2(function (fn, args) {
	            return _arity(Math.max(0, fn.length - args.length), function () {
	                return fn.apply(this, concat(args, arguments));
	            });
	        });
	    };

	    var _dropLast = function dropLast(n, xs) {
	        return take(n < xs.length ? xs.length - n : 0, xs);
	    };

	    // Values of other types are only equal if identical.
	    var _equals = function _equals(a, b, stackA, stackB) {
	        if (identical(a, b)) {
	            return true;
	        }
	        if (type(a) !== type(b)) {
	            return false;
	        }
	        if (a == null || b == null) {
	            return false;
	        }
	        if (typeof a.equals === 'function' || typeof b.equals === 'function') {
	            return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
	        }
	        switch (type(a)) {
	        case 'Arguments':
	        case 'Array':
	        case 'Object':
	            if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
	                return a === b;
	            }
	            break;
	        case 'Boolean':
	        case 'Number':
	        case 'String':
	            if (!(typeof a === typeof b && identical(a.valueOf(), b.valueOf()))) {
	                return false;
	            }
	            break;
	        case 'Date':
	            if (!identical(a.valueOf(), b.valueOf())) {
	                return false;
	            }
	            break;
	        case 'Error':
	            return a.name === b.name && a.message === b.message;
	        case 'RegExp':
	            if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
	                return false;
	            }
	            break;
	        case 'Map':
	        case 'Set':
	            if (!_equals(_arrayFromIterator(a.entries()), _arrayFromIterator(b.entries()), stackA, stackB)) {
	                return false;
	            }
	            break;
	        case 'Int8Array':
	        case 'Uint8Array':
	        case 'Uint8ClampedArray':
	        case 'Int16Array':
	        case 'Uint16Array':
	        case 'Int32Array':
	        case 'Uint32Array':
	        case 'Float32Array':
	        case 'Float64Array':
	            break;
	        case 'ArrayBuffer':
	            break;
	        default:
	            // Values of other types are only equal if identical.
	            return false;
	        }
	        var keysA = keys(a);
	        if (keysA.length !== keys(b).length) {
	            return false;
	        }
	        var idx = stackA.length - 1;
	        while (idx >= 0) {
	            if (stackA[idx] === a) {
	                return stackB[idx] === b;
	            }
	            idx -= 1;
	        }
	        stackA.push(a);
	        stackB.push(b);
	        idx = keysA.length - 1;
	        while (idx >= 0) {
	            var key = keysA[idx];
	            if (!(_has(key, b) && _equals(b[key], a[key], stackA, stackB))) {
	                return false;
	            }
	            idx -= 1;
	        }
	        stackA.pop();
	        stackB.pop();
	        return true;
	    };

	    /**
	     * `_makeFlat` is a helper function that returns a one-level or fully recursive
	     * function based on the flag passed in.
	     *
	     * @private
	     */
	    var _makeFlat = function _makeFlat(recursive) {
	        return function flatt(list) {
	            var value, jlen, j;
	            var result = [];
	            var idx = 0;
	            var ilen = list.length;
	            while (idx < ilen) {
	                if (isArrayLike(list[idx])) {
	                    value = recursive ? flatt(list[idx]) : list[idx];
	                    j = 0;
	                    jlen = value.length;
	                    while (j < jlen) {
	                        result[result.length] = value[j];
	                        j += 1;
	                    }
	                } else {
	                    result[result.length] = list[idx];
	                }
	                idx += 1;
	            }
	            return result;
	        };
	    };

	    var _reduce = function () {
	        function _arrayReduce(xf, acc, list) {
	            var idx = 0;
	            var len = list.length;
	            while (idx < len) {
	                acc = xf['@@transducer/step'](acc, list[idx]);
	                if (acc && acc['@@transducer/reduced']) {
	                    acc = acc['@@transducer/value'];
	                    break;
	                }
	                idx += 1;
	            }
	            return xf['@@transducer/result'](acc);
	        }
	        function _iterableReduce(xf, acc, iter) {
	            var step = iter.next();
	            while (!step.done) {
	                acc = xf['@@transducer/step'](acc, step.value);
	                if (acc && acc['@@transducer/reduced']) {
	                    acc = acc['@@transducer/value'];
	                    break;
	                }
	                step = iter.next();
	            }
	            return xf['@@transducer/result'](acc);
	        }
	        function _methodReduce(xf, acc, obj) {
	            return xf['@@transducer/result'](obj.reduce(bind(xf['@@transducer/step'], xf), acc));
	        }
	        var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
	        return function _reduce(fn, acc, list) {
	            if (typeof fn === 'function') {
	                fn = _xwrap(fn);
	            }
	            if (isArrayLike(list)) {
	                return _arrayReduce(fn, acc, list);
	            }
	            if (typeof list.reduce === 'function') {
	                return _methodReduce(fn, acc, list);
	            }
	            if (list[symIterator] != null) {
	                return _iterableReduce(fn, acc, list[symIterator]());
	            }
	            if (typeof list.next === 'function') {
	                return _iterableReduce(fn, acc, list);
	            }
	            throw new TypeError('reduce: list must be array or iterable');
	        };
	    }();

	    var _stepCat = function () {
	        var _stepCatArray = {
	            '@@transducer/init': Array,
	            '@@transducer/step': function (xs, x) {
	                xs.push(x);
	                return xs;
	            },
	            '@@transducer/result': _identity
	        };
	        var _stepCatString = {
	            '@@transducer/init': String,
	            '@@transducer/step': function (a, b) {
	                return a + b;
	            },
	            '@@transducer/result': _identity
	        };
	        var _stepCatObject = {
	            '@@transducer/init': Object,
	            '@@transducer/step': function (result, input) {
	                return _assign(result, isArrayLike(input) ? objOf(input[0], input[1]) : input);
	            },
	            '@@transducer/result': _identity
	        };
	        return function _stepCat(obj) {
	            if (_isTransformer(obj)) {
	                return obj;
	            }
	            if (isArrayLike(obj)) {
	                return _stepCatArray;
	            }
	            if (typeof obj === 'string') {
	                return _stepCatString;
	            }
	            if (typeof obj === 'object') {
	                return _stepCatObject;
	            }
	            throw new Error('Cannot create transformer for ' + obj);
	        };
	    }();

	    var _xdropLastWhile = function () {
	        function XDropLastWhile(fn, xf) {
	            this.f = fn;
	            this.retained = [];
	            this.xf = xf;
	        }
	        XDropLastWhile.prototype['@@transducer/init'] = _xfBase.init;
	        XDropLastWhile.prototype['@@transducer/result'] = function (result) {
	            this.retained = null;
	            return this.xf['@@transducer/result'](result);
	        };
	        XDropLastWhile.prototype['@@transducer/step'] = function (result, input) {
	            return this.f(input) ? this.retain(result, input) : this.flush(result, input);
	        };
	        XDropLastWhile.prototype.flush = function (result, input) {
	            result = _reduce(this.xf['@@transducer/step'], result, this.retained);
	            this.retained = [];
	            return this.xf['@@transducer/step'](result, input);
	        };
	        XDropLastWhile.prototype.retain = function (result, input) {
	            this.retained.push(input);
	            return result;
	        };
	        return _curry2(function _xdropLastWhile(fn, xf) {
	            return new XDropLastWhile(fn, xf);
	        });
	    }();

	    /**
	     * Creates a new list iteration function from an existing one by adding two new
	     * parameters to its callback function: the current index, and the entire list.
	     *
	     * This would turn, for instance, Ramda's simple `map` function into one that
	     * more closely resembles `Array.prototype.map`. Note that this will only work
	     * for functions in which the iteration callback function is the first
	     * parameter, and where the list is the last parameter. (This latter might be
	     * unimportant if the list parameter is not used.)
	     *
	     * @func
	     * @memberOf R
	     * @since v0.15.0
	     * @category Function
	     * @category List
	     * @sig ((a ... -> b) ... -> [a] -> *) -> (a ..., Int, [a] -> b) ... -> [a] -> *)
	     * @param {Function} fn A list iteration function that does not pass index or list to its callback
	     * @return {Function} An altered list iteration function that passes (item, index, list) to its callback
	     * @example
	     *
	     *      var mapIndexed = R.addIndex(R.map);
	     *      mapIndexed((val, idx) => idx + '-' + val, ['f', 'o', 'o', 'b', 'a', 'r']);
	     *      //=> ['0-f', '1-o', '2-o', '3-b', '4-a', '5-r']
	     */
	    var addIndex = _curry1(function addIndex(fn) {
	        return curryN(fn.length, function () {
	            var idx = 0;
	            var origFn = arguments[0];
	            var list = arguments[arguments.length - 1];
	            var args = _slice(arguments);
	            args[0] = function () {
	                var result = origFn.apply(this, _concat(arguments, [
	                    idx,
	                    list
	                ]));
	                idx += 1;
	                return result;
	            };
	            return fn.apply(this, args);
	        });
	    });

	    /**
	     * Wraps a function of any arity (including nullary) in a function that accepts
	     * exactly 2 parameters. Any extraneous parameters will not be passed to the
	     * supplied function.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.2.0
	     * @category Function
	     * @sig (* -> c) -> (a, b -> c)
	     * @param {Function} fn The function to wrap.
	     * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
	     *         arity 2.
	     * @example
	     *
	     *      var takesThreeArgs = function(a, b, c) {
	     *        return [a, b, c];
	     *      };
	     *      takesThreeArgs.length; //=> 3
	     *      takesThreeArgs(1, 2, 3); //=> [1, 2, 3]
	     *
	     *      var takesTwoArgs = R.binary(takesThreeArgs);
	     *      takesTwoArgs.length; //=> 2
	     *      // Only 2 arguments are passed to the wrapped function
	     *      takesTwoArgs(1, 2, 3); //=> [1, 2, undefined]
	     */
	    var binary = _curry1(function binary(fn) {
	        return nAry(2, fn);
	    });

	    /**
	     * Creates a deep copy of the value which may contain (nested) `Array`s and
	     * `Object`s, `Number`s, `String`s, `Boolean`s and `Date`s. `Function`s are not
	     * copied, but assigned by their reference.
	     *
	     * Dispatches to a `clone` method if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Object
	     * @sig {*} -> {*}
	     * @param {*} value The object or array to clone
	     * @return {*} A new object or array.
	     * @example
	     *
	     *      var objects = [{}, {}, {}];
	     *      var objectsClone = R.clone(objects);
	     *      objects[0] === objectsClone[0]; //=> false
	     */
	    var clone = _curry1(function clone(value) {
	        return value != null && typeof value.clone === 'function' ? value.clone() : _clone(value, [], [], true);
	    });

	    /**
	     * Returns a curried equivalent of the provided function. The curried function
	     * has two unusual capabilities. First, its arguments needn't be provided one
	     * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
	     * following are equivalent:
	     *
	     *   - `g(1)(2)(3)`
	     *   - `g(1)(2, 3)`
	     *   - `g(1, 2)(3)`
	     *   - `g(1, 2, 3)`
	     *
	     * Secondly, the special placeholder value `R.__` may be used to specify
	     * "gaps", allowing partial application of any combination of arguments,
	     * regardless of their positions. If `g` is as above and `_` is `R.__`, the
	     * following are equivalent:
	     *
	     *   - `g(1, 2, 3)`
	     *   - `g(_, 2, 3)(1)`
	     *   - `g(_, _, 3)(1)(2)`
	     *   - `g(_, _, 3)(1, 2)`
	     *   - `g(_, 2)(1)(3)`
	     *   - `g(_, 2)(1, 3)`
	     *   - `g(_, 2)(_, 3)(1)`
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig (* -> a) -> (* -> a)
	     * @param {Function} fn The function to curry.
	     * @return {Function} A new, curried function.
	     * @see R.curryN
	     * @example
	     *
	     *      var addFourNumbers = (a, b, c, d) => a + b + c + d;
	     *
	     *      var curriedAddFourNumbers = R.curry(addFourNumbers);
	     *      var f = curriedAddFourNumbers(1, 2);
	     *      var g = f(3);
	     *      g(4); //=> 10
	     */
	    var curry = _curry1(function curry(fn) {
	        return curryN(fn.length, fn);
	    });

	    /**
	     * Returns all but the first `n` elements of the given list, string, or
	     * transducer/transformer (or object with a `drop` method).
	     *
	     * Dispatches to the `drop` method of the second argument, if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig Number -> [a] -> [a]
	     * @sig Number -> String -> String
	     * @param {Number} n
	     * @param {*} list
	     * @return {*}
	     * @see R.take, R.transduce
	     * @example
	     *
	     *      R.drop(1, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
	     *      R.drop(2, ['foo', 'bar', 'baz']); //=> ['baz']
	     *      R.drop(3, ['foo', 'bar', 'baz']); //=> []
	     *      R.drop(4, ['foo', 'bar', 'baz']); //=> []
	     *      R.drop(3, 'ramda');               //=> 'da'
	     */
	    var drop = _curry2(_dispatchable('drop', _xdrop, function drop(n, xs) {
	        return slice(Math.max(0, n), Infinity, xs);
	    }));

	    /**
	     * Returns a list containing all but the last `n` elements of the given `list`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category List
	     * @sig Number -> [a] -> [a]
	     * @sig Number -> String -> String
	     * @param {Number} n The number of elements of `xs` to skip.
	     * @param {Array} xs The collection to consider.
	     * @return {Array}
	     * @see R.takeLast
	     * @example
	     *
	     *      R.dropLast(1, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
	     *      R.dropLast(2, ['foo', 'bar', 'baz']); //=> ['foo']
	     *      R.dropLast(3, ['foo', 'bar', 'baz']); //=> []
	     *      R.dropLast(4, ['foo', 'bar', 'baz']); //=> []
	     *      R.dropLast(3, 'ramda');               //=> 'ra'
	     */
	    var dropLast = _curry2(_dispatchable('dropLast', _xdropLast, _dropLast));

	    /**
	     * Returns a new list excluding all the tailing elements of a given list which
	     * satisfy the supplied predicate function. It passes each value from the right
	     * to the supplied predicate function, skipping elements while the predicate
	     * function returns `true`. The predicate function is applied to one argument:
	     * *(value)*.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> [a]
	     * @param {Function} fn The function called per iteration.
	     * @param {Array} list The collection to iterate over.
	     * @return {Array} A new array.
	     * @see R.takeLastWhile, R.addIndex
	     * @example
	     *
	     *      var lteThree = x => x <= 3;
	     *
	     *      R.dropLastWhile(lteThree, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3, 4]
	     */
	    var dropLastWhile = _curry2(_dispatchable('dropLastWhile', _xdropLastWhile, _dropLastWhile));

	    /**
	     * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
	     * cyclical data structures.
	     *
	     * Dispatches symmetrically to the `equals` methods of both arguments, if
	     * present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.15.0
	     * @category Relation
	     * @sig a -> b -> Boolean
	     * @param {*} a
	     * @param {*} b
	     * @return {Boolean}
	     * @example
	     *
	     *      R.equals(1, 1); //=> true
	     *      R.equals(1, '1'); //=> false
	     *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
	     *
	     *      var a = {}; a.v = a;
	     *      var b = {}; b.v = b;
	     *      R.equals(a, b); //=> true
	     */
	    var equals = _curry2(function equals(a, b) {
	        return _equals(a, b, [], []);
	    });

	    /**
	     * Takes a predicate and a "filterable", and returns a new filterable of the
	     * same type containing the members of the given filterable which satisfy the
	     * given predicate.
	     *
	     * Dispatches to the `filter` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig Filterable f => (a -> Boolean) -> f a -> f a
	     * @param {Function} pred
	     * @param {Array} filterable
	     * @return {Array}
	     * @see R.reject, R.transduce, R.addIndex
	     * @example
	     *
	     *      var isEven = n => n % 2 === 0;
	     *
	     *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
	     *
	     *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
	     */
	    // else
	    var filter = _curry2(_dispatchable('filter', _xfilter, function (pred, filterable) {
	        return _isObject(filterable) ? _reduce(function (acc, key) {
	            if (pred(filterable[key])) {
	                acc[key] = filterable[key];
	            }
	            return acc;
	        }, {}, keys(filterable)) : // else
	        _filter(pred, filterable);
	    }));

	    /**
	     * Returns a new list by pulling every item out of it (and all its sub-arrays)
	     * and putting them in a new array, depth-first.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig [a] -> [b]
	     * @param {Array} list The array to consider.
	     * @return {Array} The flattened list.
	     * @see R.unnest
	     * @example
	     *
	     *      R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
	     *      //=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	     */
	    var flatten = _curry1(_makeFlat(true));

	    /**
	     * Returns a new function much like the supplied one, except that the first two
	     * arguments' order is reversed.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig (a -> b -> c -> ... -> z) -> (b -> a -> c -> ... -> z)
	     * @param {Function} fn The function to invoke with its first two parameters reversed.
	     * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
	     * @example
	     *
	     *      var mergeThree = (a, b, c) => [].concat(a, b, c);
	     *
	     *      mergeThree(1, 2, 3); //=> [1, 2, 3]
	     *
	     *      R.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]
	     */
	    var flip = _curry1(function flip(fn) {
	        return curry(function (a, b) {
	            var args = _slice(arguments);
	            args[0] = b;
	            args[1] = a;
	            return fn.apply(this, args);
	        });
	    });

	    /**
	     * Returns the first element of the given list or string. In some libraries
	     * this function is named `first`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig [a] -> a | Undefined
	     * @sig String -> String
	     * @param {Array|String} list
	     * @return {*}
	     * @see R.tail, R.init, R.last
	     * @example
	     *
	     *      R.head(['fi', 'fo', 'fum']); //=> 'fi'
	     *      R.head([]); //=> undefined
	     *
	     *      R.head('abc'); //=> 'a'
	     *      R.head(''); //=> ''
	     */
	    var head = nth(0);

	    /**
	     * Returns all but the last element of the given list or string.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category List
	     * @sig [a] -> [a]
	     * @sig String -> String
	     * @param {*} list
	     * @return {*}
	     * @see R.last, R.head, R.tail
	     * @example
	     *
	     *      R.init([1, 2, 3]);  //=> [1, 2]
	     *      R.init([1, 2]);     //=> [1]
	     *      R.init([1]);        //=> []
	     *      R.init([]);         //=> []
	     *
	     *      R.init('abc');  //=> 'ab'
	     *      R.init('ab');   //=> 'a'
	     *      R.init('a');    //=> ''
	     *      R.init('');     //=> ''
	     */
	    var init = slice(0, -1);

	    /**
	     * Combines two lists into a set (i.e. no duplicates) composed of those
	     * elements common to both lists. Duplication is determined according to the
	     * value returned by applying the supplied predicate to two list elements.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig (a -> a -> Boolean) -> [*] -> [*] -> [*]
	     * @param {Function} pred A predicate function that determines whether
	     *        the two supplied elements are equal.
	     * @param {Array} list1 One list of items to compare
	     * @param {Array} list2 A second list of items to compare
	     * @return {Array} A new list containing those elements common to both lists.
	     * @see R.intersection
	     * @example
	     *
	     *      var buffaloSpringfield = [
	     *        {id: 824, name: 'Richie Furay'},
	     *        {id: 956, name: 'Dewey Martin'},
	     *        {id: 313, name: 'Bruce Palmer'},
	     *        {id: 456, name: 'Stephen Stills'},
	     *        {id: 177, name: 'Neil Young'}
	     *      ];
	     *      var csny = [
	     *        {id: 204, name: 'David Crosby'},
	     *        {id: 456, name: 'Stephen Stills'},
	     *        {id: 539, name: 'Graham Nash'},
	     *        {id: 177, name: 'Neil Young'}
	     *      ];
	     *
	     *      R.intersectionWith(R.eqBy(R.prop('id')), buffaloSpringfield, csny);
	     *      //=> [{id: 456, name: 'Stephen Stills'}, {id: 177, name: 'Neil Young'}]
	     */
	    var intersectionWith = _curry3(function intersectionWith(pred, list1, list2) {
	        var lookupList, filteredList;
	        if (list1.length > list2.length) {
	            lookupList = list1;
	            filteredList = list2;
	        } else {
	            lookupList = list2;
	            filteredList = list1;
	        }
	        var results = [];
	        var idx = 0;
	        while (idx < filteredList.length) {
	            if (_containsWith(pred, filteredList[idx], lookupList)) {
	                results[results.length] = filteredList[idx];
	            }
	            idx += 1;
	        }
	        return uniqWith(pred, results);
	    });

	    /**
	     * Transforms the items of the list with the transducer and appends the
	     * transformed items to the accumulator using an appropriate iterator function
	     * based on the accumulator type.
	     *
	     * The accumulator can be an array, string, object or a transformer. Iterated
	     * items will be appended to arrays and concatenated to strings. Objects will
	     * be merged directly or 2-item arrays will be merged as key, value pairs.
	     *
	     * The accumulator can also be a transformer object that provides a 2-arity
	     * reducing iterator function, step, 0-arity initial value function, init, and
	     * 1-arity result extraction function result. The step function is used as the
	     * iterator function in reduce. The result function is used to convert the
	     * final accumulator into the return type and in most cases is R.identity. The
	     * init function is used to provide the initial accumulator.
	     *
	     * The iteration is performed with R.reduce after initializing the transducer.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.12.0
	     * @category List
	     * @sig a -> (b -> b) -> [c] -> a
	     * @param {*} acc The initial accumulator value.
	     * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
	     * @param {Array} list The list to iterate over.
	     * @return {*} The final, accumulated value.
	     * @example
	     *
	     *      var numbers = [1, 2, 3, 4];
	     *      var transducer = R.compose(R.map(R.add(1)), R.take(2));
	     *
	     *      R.into([], transducer, numbers); //=> [2, 3]
	     *
	     *      var intoArray = R.into([]);
	     *      intoArray(transducer, numbers); //=> [2, 3]
	     */
	    var into = _curry3(function into(acc, xf, list) {
	        return _isTransformer(acc) ? _reduce(xf(acc), acc['@@transducer/init'](), list) : _reduce(xf(_stepCat(acc)), _clone(acc, [], [], false), list);
	    });

	    /**
	     * Same as R.invertObj, however this accounts for objects with duplicate values
	     * by putting the values into an array.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Object
	     * @sig {s: x} -> {x: [ s, ... ]}
	     * @param {Object} obj The object or array to invert
	     * @return {Object} out A new object with keys
	     * in an array.
	     * @example
	     *
	     *      var raceResultsByFirstName = {
	     *        first: 'alice',
	     *        second: 'jake',
	     *        third: 'alice',
	     *      };
	     *      R.invert(raceResultsByFirstName);
	     *      //=> { 'alice': ['first', 'third'], 'jake':['second'] }
	     */
	    var invert = _curry1(function invert(obj) {
	        var props = keys(obj);
	        var len = props.length;
	        var idx = 0;
	        var out = {};
	        while (idx < len) {
	            var key = props[idx];
	            var val = obj[key];
	            var list = _has(val, out) ? out[val] : out[val] = [];
	            list[list.length] = key;
	            idx += 1;
	        }
	        return out;
	    });

	    /**
	     * Returns a new object with the keys of the given object as values, and the
	     * values of the given object, which are coerced to strings, as keys. Note
	     * that the last key found is preferred when handling the same value.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Object
	     * @sig {s: x} -> {x: s}
	     * @param {Object} obj The object or array to invert
	     * @return {Object} out A new object
	     * @example
	     *
	     *      var raceResults = {
	     *        first: 'alice',
	     *        second: 'jake'
	     *      };
	     *      R.invertObj(raceResults);
	     *      //=> { 'alice': 'first', 'jake':'second' }
	     *
	     *      // Alternatively:
	     *      var raceResults = ['alice', 'jake'];
	     *      R.invertObj(raceResults);
	     *      //=> { 'alice': '0', 'jake':'1' }
	     */
	    var invertObj = _curry1(function invertObj(obj) {
	        var props = keys(obj);
	        var len = props.length;
	        var idx = 0;
	        var out = {};
	        while (idx < len) {
	            var key = props[idx];
	            out[obj[key]] = key;
	            idx += 1;
	        }
	        return out;
	    });

	    /**
	     * Returns `true` if the given value is its type's empty value; `false`
	     * otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Logic
	     * @sig a -> Boolean
	     * @param {*} x
	     * @return {Boolean}
	     * @see R.empty
	     * @example
	     *
	     *      R.isEmpty([1, 2, 3]);   //=> false
	     *      R.isEmpty([]);          //=> true
	     *      R.isEmpty('');          //=> true
	     *      R.isEmpty(null);        //=> false
	     *      R.isEmpty({});          //=> true
	     *      R.isEmpty({length: 0}); //=> false
	     */
	    var isEmpty = _curry1(function isEmpty(x) {
	        return x != null && equals(x, empty(x));
	    });

	    /**
	     * Returns the last element of the given list or string.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.4
	     * @category List
	     * @sig [a] -> a | Undefined
	     * @sig String -> String
	     * @param {*} list
	     * @return {*}
	     * @see R.init, R.head, R.tail
	     * @example
	     *
	     *      R.last(['fi', 'fo', 'fum']); //=> 'fum'
	     *      R.last([]); //=> undefined
	     *
	     *      R.last('abc'); //=> 'c'
	     *      R.last(''); //=> ''
	     */
	    var last = nth(-1);

	    /**
	     * Returns the position of the last occurrence of an item in an array, or -1 if
	     * the item is not included in the array. `R.equals` is used to determine
	     * equality.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig a -> [a] -> Number
	     * @param {*} target The item to find.
	     * @param {Array} xs The array to search in.
	     * @return {Number} the index of the target, or -1 if the target is not found.
	     * @see R.indexOf
	     * @example
	     *
	     *      R.lastIndexOf(3, [-1,3,3,0,1,2,3,4]); //=> 6
	     *      R.lastIndexOf(10, [1,2,3,4]); //=> -1
	     */
	    var lastIndexOf = _curry2(function lastIndexOf(target, xs) {
	        if (typeof xs.lastIndexOf === 'function' && !_isArray(xs)) {
	            return xs.lastIndexOf(target);
	        } else {
	            var idx = xs.length - 1;
	            while (idx >= 0) {
	                if (equals(xs[idx], target)) {
	                    return idx;
	                }
	                idx -= 1;
	            }
	            return -1;
	        }
	    });

	    /**
	     * Takes a function and
	     * a [functor](https://github.com/fantasyland/fantasy-land#functor),
	     * applies the function to each of the functor's values, and returns
	     * a functor of the same shape.
	     *
	     * Ramda provides suitable `map` implementations for `Array` and `Object`,
	     * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
	     *
	     * Dispatches to the `map` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * Also treats functions as functors and will compose them together.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig Functor f => (a -> b) -> f a -> f b
	     * @param {Function} fn The function to be called on every element of the input `list`.
	     * @param {Array} list The list to be iterated over.
	     * @return {Array} The new list.
	     * @see R.transduce, R.addIndex
	     * @example
	     *
	     *      var double = x => x * 2;
	     *
	     *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
	     *
	     *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
	     */
	    var map = _curry2(_dispatchable('map', _xmap, function map(fn, functor) {
	        switch (Object.prototype.toString.call(functor)) {
	        case '[object Function]':
	            return curryN(functor.length, function () {
	                return fn.call(this, functor.apply(this, arguments));
	            });
	        case '[object Object]':
	            return _reduce(function (acc, key) {
	                acc[key] = fn(functor[key]);
	                return acc;
	            }, {}, keys(functor));
	        default:
	            return _map(fn, functor);
	        }
	    }));

	    /**
	     * An Object-specific version of `map`. The function is applied to three
	     * arguments: *(value, key, obj)*. If only the value is significant, use
	     * `map` instead.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Object
	     * @sig ((*, String, Object) -> *) -> Object -> Object
	     * @param {Function} fn
	     * @param {Object} obj
	     * @return {Object}
	     * @see R.map
	     * @example
	     *
	     *      var values = { x: 1, y: 2, z: 3 };
	     *      var prependKeyAndDouble = (num, key, obj) => key + (num * 2);
	     *
	     *      R.mapObjIndexed(prependKeyAndDouble, values); //=> { x: 'x2', y: 'y4', z: 'z6' }
	     */
	    var mapObjIndexed = _curry2(function mapObjIndexed(fn, obj) {
	        return _reduce(function (acc, key) {
	            acc[key] = fn(obj[key], key, obj);
	            return acc;
	        }, {}, keys(obj));
	    });

	    /**
	     * Creates a new object with the own properties of the two provided objects. If
	     * a key exists in both objects, the provided function is applied to the values
	     * associated with the key in each object, with the result being used as the
	     * value associated with the key in the returned object. The key will be
	     * excluded from the returned object if the resulting value is `undefined`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category Object
	     * @sig (a -> a -> a) -> {a} -> {a} -> {a}
	     * @param {Function} fn
	     * @param {Object} l
	     * @param {Object} r
	     * @return {Object}
	     * @see R.merge, R.mergeWithKey
	     * @example
	     *
	     *      R.mergeWith(R.concat,
	     *                  { a: true, values: [10, 20] },
	     *                  { b: true, values: [15, 35] });
	     *      //=> { a: true, b: true, values: [10, 20, 15, 35] }
	     */
	    var mergeWith = _curry3(function mergeWith(fn, l, r) {
	        return mergeWithKey(function (_, _l, _r) {
	            return fn(_l, _r);
	        }, l, r);
	    });

	    /**
	     * Takes a function `f` and a list of arguments, and returns a function `g`.
	     * When applied, `g` returns the result of applying `f` to the arguments
	     * provided initially followed by the arguments provided to `g`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.10.0
	     * @category Function
	     * @sig ((a, b, c, ..., n) -> x) -> [a, b, c, ...] -> ((d, e, f, ..., n) -> x)
	     * @param {Function} f
	     * @param {Array} args
	     * @return {Function}
	     * @see R.partialRight
	     * @example
	     *
	     *      var multiply = (a, b) => a * b;
	     *      var double = R.partial(multiply, [2]);
	     *      double(2); //=> 4
	     *
	     *      var greet = (salutation, title, firstName, lastName) =>
	     *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
	     *
	     *      var sayHello = R.partial(greet, ['Hello']);
	     *      var sayHelloToMs = R.partial(sayHello, ['Ms.']);
	     *      sayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'
	     */
	    var partial = _createPartialApplicator(_concat);

	    /**
	     * Takes a function `f` and a list of arguments, and returns a function `g`.
	     * When applied, `g` returns the result of applying `f` to the arguments
	     * provided to `g` followed by the arguments provided initially.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.10.0
	     * @category Function
	     * @sig ((a, b, c, ..., n) -> x) -> [d, e, f, ..., n] -> ((a, b, c, ...) -> x)
	     * @param {Function} f
	     * @param {Array} args
	     * @return {Function}
	     * @see R.partial
	     * @example
	     *
	     *      var greet = (salutation, title, firstName, lastName) =>
	     *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
	     *
	     *      var greetMsJaneJones = R.partialRight(greet, ['Ms.', 'Jane', 'Jones']);
	     *
	     *      greetMsJaneJones('Hello'); //=> 'Hello, Ms. Jane Jones!'
	     */
	    var partialRight = _createPartialApplicator(flip(_concat));

	    /**
	     * Determines whether a nested path on an object has a specific value, in
	     * `R.equals` terms. Most likely used to filter a list.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.7.0
	     * @category Relation
	     * @sig [String] -> * -> {String: *} -> Boolean
	     * @param {Array} path The path of the nested property to use
	     * @param {*} val The value to compare the nested property with
	     * @param {Object} obj The object to check the nested property in
	     * @return {Boolean} `true` if the value equals the nested object property,
	     *         `false` otherwise.
	     * @example
	     *
	     *      var user1 = { address: { zipCode: 90210 } };
	     *      var user2 = { address: { zipCode: 55555 } };
	     *      var user3 = { name: 'Bob' };
	     *      var users = [ user1, user2, user3 ];
	     *      var isFamous = R.pathEq(['address', 'zipCode'], 90210);
	     *      R.filter(isFamous, users); //=> [ user1 ]
	     */
	    var pathEq = _curry3(function pathEq(_path, val, obj) {
	        return equals(path(_path, obj), val);
	    });

	    /**
	     * Returns a new list by plucking the same named property off all objects in
	     * the list supplied.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig k -> [{k: v}] -> [v]
	     * @param {Number|String} key The key name to pluck off of each object.
	     * @param {Array} list The array to consider.
	     * @return {Array} The list of values for the given key.
	     * @see R.props
	     * @example
	     *
	     *      R.pluck('a')([{a: 1}, {a: 2}]); //=> [1, 2]
	     *      R.pluck(0)([[1, 2], [3, 4]]);   //=> [1, 3]
	     */
	    var pluck = _curry2(function pluck(p, list) {
	        return map(prop(p), list);
	    });

	    /**
	     * Reasonable analog to SQL `select` statement.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Object
	     * @category Relation
	     * @sig [k] -> [{k: v}] -> [{k: v}]
	     * @param {Array} props The property names to project
	     * @param {Array} objs The objects to query
	     * @return {Array} An array of objects with just the `props` properties.
	     * @example
	     *
	     *      var abby = {name: 'Abby', age: 7, hair: 'blond', grade: 2};
	     *      var fred = {name: 'Fred', age: 12, hair: 'brown', grade: 7};
	     *      var kids = [abby, fred];
	     *      R.project(['name', 'grade'], kids); //=> [{name: 'Abby', grade: 2}, {name: 'Fred', grade: 7}]
	     */
	    // passing `identity` gives correct arity
	    var project = useWith(_map, [
	        pickAll,
	        identity
	    ]);

	    /**
	     * Returns `true` if the specified object property is equal, in `R.equals`
	     * terms, to the given value; `false` otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig String -> a -> Object -> Boolean
	     * @param {String} name
	     * @param {*} val
	     * @param {*} obj
	     * @return {Boolean}
	     * @see R.equals, R.propSatisfies
	     * @example
	     *
	     *      var abby = {name: 'Abby', age: 7, hair: 'blond'};
	     *      var fred = {name: 'Fred', age: 12, hair: 'brown'};
	     *      var rusty = {name: 'Rusty', age: 10, hair: 'brown'};
	     *      var alois = {name: 'Alois', age: 15, disposition: 'surly'};
	     *      var kids = [abby, fred, rusty, alois];
	     *      var hasBrownHair = R.propEq('hair', 'brown');
	     *      R.filter(hasBrownHair, kids); //=> [fred, rusty]
	     */
	    var propEq = _curry3(function propEq(name, val, obj) {
	        return equals(val, obj[name]);
	    });

	    /**
	     * Returns a single item by iterating through the list, successively calling
	     * the iterator function and passing it an accumulator value and the current
	     * value from the array, and then passing the result to the next call.
	     *
	     * The iterator function receives two values: *(acc, value)*. It may use
	     * `R.reduced` to shortcut the iteration.
	     *
	     * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
	     * arrays), unlike the native `Array.prototype.reduce` method. For more details
	     * on this behavior, see:
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
	     *
	     * Dispatches to the `reduce` method of the third argument, if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig ((a, b) -> a) -> a -> [b] -> a
	     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
	     *        current element from the array.
	     * @param {*} acc The accumulator value.
	     * @param {Array} list The list to iterate over.
	     * @return {*} The final, accumulated value.
	     * @see R.reduced, R.addIndex
	     * @example
	     *
	     *      var numbers = [1, 2, 3];
	     *      var plus = (a, b) => a + b;
	     *
	     *      R.reduce(plus, 10, numbers); //=> 16
	     */
	    var reduce = _curry3(_reduce);

	    /**
	     * Groups the elements of the list according to the result of calling
	     * the String-returning function `keyFn` on each element and reduces the elements
	     * of each group to a single value via the reducer function `valueFn`.
	     *
	     * This function is basically a more general `groupBy` function.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.20.0
	     * @category List
	     * @sig ((a, b) -> a) -> a -> (b -> String) -> [b] -> {String: a}
	     * @param {Function} valueFn The function that reduces the elements of each group to a single
	     *        value. Receives two values, accumulator for a particular group and the current element.
	     * @param {*} acc The (initial) accumulator value for each group.
	     * @param {Function} keyFn The function that maps the list's element into a key.
	     * @param {Array} list The array to group.
	     * @return {Object} An object with the output of `keyFn` for keys, mapped to the output of
	     *         `valueFn` for elements which produced that key when passed to `keyFn`.
	     * @see R.groupBy, R.reduce
	     * @example
	     *
	     *      var reduceToNamesBy = R.reduceBy((acc, student) => acc.concat(student.name), []);
	     *      var namesByGrade = reduceToNamesBy(function(student) {
	     *        var score = student.score;
	     *        return score < 65 ? 'F' :
	     *               score < 70 ? 'D' :
	     *               score < 80 ? 'C' :
	     *               score < 90 ? 'B' : 'A';
	     *      });
	     *      var students = [{name: 'Lucy', score: 92},
	     *                      {name: 'Drew', score: 85},
	     *                      // ...
	     *                      {name: 'Bart', score: 62}];
	     *      namesByGrade(students);
	     *      // {
	     *      //   'A': ['Lucy'],
	     *      //   'B': ['Drew']
	     *      //   // ...,
	     *      //   'F': ['Bart']
	     *      // }
	     */
	    var reduceBy = _curryN(4, [], _dispatchable('reduceBy', _xreduceBy, function reduceBy(valueFn, valueAcc, keyFn, list) {
	        return _reduce(function (acc, elt) {
	            var key = keyFn(elt);
	            acc[key] = valueFn(_has(key, acc) ? acc[key] : valueAcc, elt);
	            return acc;
	        }, {}, list);
	    }));

	    /**
	     * Like `reduce`, `reduceWhile` returns a single item by iterating through
	     * the list, successively calling the iterator function. `reduceWhile` also
	     * takes a predicate that is evaluated before each step. If the predicate returns
	     * `false`, it "short-circuits" the iteration and returns the current value
	     * of the accumulator.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.22.0
	     * @category List
	     * @sig ((a, b) -> Boolean) -> ((a, b) -> a) -> a -> [b] -> a
	     * @param {Function} pred The predicate. It is passed the accumulator and the
	     *        current element.
	     * @param {Function} fn The iterator function. Receives two values, the
	     *        accumulator and the current element.
	     * @param {*} a The accumulator value.
	     * @param {Array} list The list to iterate over.
	     * @return {*} The final, accumulated value.
	     * @see R.reduce, R.reduced
	     * @example
	     *
	     *      var isOdd = (acc, x) => x % 2 === 1;
	     *      var xs = [1, 3, 5, 60, 777, 800];
	     *      R.reduceWhile(isOdd, R.add, 0, xs); //=> 9
	     *
	     *      var ys = [2, 4, 6]
	     *      R.reduceWhile(isOdd, R.add, 111, ys); //=> 111
	     */
	    var reduceWhile = _curryN(4, [], function _reduceWhile(pred, fn, a, list) {
	        return _reduce(function (acc, x) {
	            return pred(acc, x) ? fn(acc, x) : _reduced(acc);
	        }, a, list);
	    });

	    /**
	     * The complement of `filter`.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig Filterable f => (a -> Boolean) -> f a -> f a
	     * @param {Function} pred
	     * @param {Array} filterable
	     * @return {Array}
	     * @see R.filter, R.transduce, R.addIndex
	     * @example
	     *
	     *      var isOdd = (n) => n % 2 === 1;
	     *
	     *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
	     *
	     *      R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
	     */
	    var reject = _curry2(function reject(pred, filterable) {
	        return filter(_complement(pred), filterable);
	    });

	    /**
	     * Returns a fixed list of size `n` containing a specified identical value.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.1
	     * @category List
	     * @sig a -> n -> [a]
	     * @param {*} value The value to repeat.
	     * @param {Number} n The desired size of the output list.
	     * @return {Array} A new array containing `n` `value`s.
	     * @example
	     *
	     *      R.repeat('hi', 5); //=> ['hi', 'hi', 'hi', 'hi', 'hi']
	     *
	     *      var obj = {};
	     *      var repeatedObjs = R.repeat(obj, 5); //=> [{}, {}, {}, {}, {}]
	     *      repeatedObjs[0] === repeatedObjs[1]; //=> true
	     */
	    var repeat = _curry2(function repeat(value, n) {
	        return times(always(value), n);
	    });

	    /**
	     * Adds together all the elements of a list.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Math
	     * @sig [Number] -> Number
	     * @param {Array} list An array of numbers
	     * @return {Number} The sum of all the numbers in the list.
	     * @see R.reduce
	     * @example
	     *
	     *      R.sum([2,4,6,8,100,1]); //=> 121
	     */
	    var sum = reduce(add, 0);

	    /**
	     * Returns a new list containing the last `n` elements of the given list.
	     * If `n > list.length`, returns a list of `list.length` elements.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category List
	     * @sig Number -> [a] -> [a]
	     * @sig Number -> String -> String
	     * @param {Number} n The number of elements to return.
	     * @param {Array} xs The collection to consider.
	     * @return {Array}
	     * @see R.dropLast
	     * @example
	     *
	     *      R.takeLast(1, ['foo', 'bar', 'baz']); //=> ['baz']
	     *      R.takeLast(2, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
	     *      R.takeLast(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
	     *      R.takeLast(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
	     *      R.takeLast(3, 'ramda');               //=> 'mda'
	     */
	    var takeLast = _curry2(function takeLast(n, xs) {
	        return drop(n >= 0 ? xs.length - n : 0, xs);
	    });

	    /**
	     * Initializes a transducer using supplied iterator function. Returns a single
	     * item by iterating through the list, successively calling the transformed
	     * iterator function and passing it an accumulator value and the current value
	     * from the array, and then passing the result to the next call.
	     *
	     * The iterator function receives two values: *(acc, value)*. It will be
	     * wrapped as a transformer to initialize the transducer. A transformer can be
	     * passed directly in place of an iterator function. In both cases, iteration
	     * may be stopped early with the `R.reduced` function.
	     *
	     * A transducer is a function that accepts a transformer and returns a
	     * transformer and can be composed directly.
	     *
	     * A transformer is an an object that provides a 2-arity reducing iterator
	     * function, step, 0-arity initial value function, init, and 1-arity result
	     * extraction function, result. The step function is used as the iterator
	     * function in reduce. The result function is used to convert the final
	     * accumulator into the return type and in most cases is R.identity. The init
	     * function can be used to provide an initial accumulator, but is ignored by
	     * transduce.
	     *
	     * The iteration is performed with R.reduce after initializing the transducer.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.12.0
	     * @category List
	     * @sig (c -> c) -> (a,b -> a) -> a -> [b] -> a
	     * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
	     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
	     *        current element from the array. Wrapped as transformer, if necessary, and used to
	     *        initialize the transducer
	     * @param {*} acc The initial accumulator value.
	     * @param {Array} list The list to iterate over.
	     * @return {*} The final, accumulated value.
	     * @see R.reduce, R.reduced, R.into
	     * @example
	     *
	     *      var numbers = [1, 2, 3, 4];
	     *      var transducer = R.compose(R.map(R.add(1)), R.take(2));
	     *
	     *      R.transduce(transducer, R.flip(R.append), [], numbers); //=> [2, 3]
	     */
	    var transduce = curryN(4, function transduce(xf, fn, acc, list) {
	        return _reduce(xf(typeof fn === 'function' ? _xwrap(fn) : fn), acc, list);
	    });

	    /**
	     * Combines two lists into a set (i.e. no duplicates) composed of the elements
	     * of each list. Duplication is determined according to the value returned by
	     * applying the supplied predicate to two list elements.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig (a -> a -> Boolean) -> [*] -> [*] -> [*]
	     * @param {Function} pred A predicate used to test whether two items are equal.
	     * @param {Array} list1 The first list.
	     * @param {Array} list2 The second list.
	     * @return {Array} The first and second lists concatenated, with
	     *         duplicates removed.
	     * @see R.union
	     * @example
	     *
	     *      var l1 = [{a: 1}, {a: 2}];
	     *      var l2 = [{a: 1}, {a: 4}];
	     *      R.unionWith(R.eqBy(R.prop('a')), l1, l2); //=> [{a: 1}, {a: 2}, {a: 4}]
	     */
	    var unionWith = _curry3(function unionWith(pred, list1, list2) {
	        return uniqWith(pred, _concat(list1, list2));
	    });

	    /**
	     * Takes a spec object and a test object; returns true if the test satisfies
	     * the spec, false otherwise. An object satisfies the spec if, for each of the
	     * spec's own properties, accessing that property of the object gives the same
	     * value (in `R.equals` terms) as accessing that property of the spec.
	     *
	     * `whereEq` is a specialization of [`where`](#where).
	     *
	     * @func
	     * @memberOf R
	     * @since v0.14.0
	     * @category Object
	     * @sig {String: *} -> {String: *} -> Boolean
	     * @param {Object} spec
	     * @param {Object} testObj
	     * @return {Boolean}
	     * @see R.where
	     * @example
	     *
	     *      // pred :: Object -> Boolean
	     *      var pred = R.whereEq({a: 1, b: 2});
	     *
	     *      pred({a: 1});              //=> false
	     *      pred({a: 1, b: 2});        //=> true
	     *      pred({a: 1, b: 2, c: 3});  //=> true
	     *      pred({a: 1, b: 1});        //=> false
	     */
	    var whereEq = _curry2(function whereEq(spec, testObj) {
	        return where(map(equals, spec), testObj);
	    });

	    var _flatCat = function () {
	        var preservingReduced = function (xf) {
	            return {
	                '@@transducer/init': _xfBase.init,
	                '@@transducer/result': function (result) {
	                    return xf['@@transducer/result'](result);
	                },
	                '@@transducer/step': function (result, input) {
	                    var ret = xf['@@transducer/step'](result, input);
	                    return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
	                }
	            };
	        };
	        return function _xcat(xf) {
	            var rxf = preservingReduced(xf);
	            return {
	                '@@transducer/init': _xfBase.init,
	                '@@transducer/result': function (result) {
	                    return rxf['@@transducer/result'](result);
	                },
	                '@@transducer/step': function (result, input) {
	                    return !isArrayLike(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
	                }
	            };
	        };
	    }();

	    // Array.prototype.indexOf doesn't exist below IE9
	    // manually crawl the list to distinguish between +0 and -0
	    // NaN
	    // non-zero numbers can utilise Set
	    // all these types can utilise Set
	    // null can utilise Set
	    // anything else not covered above, defer to R.equals
	    var _indexOf = function _indexOf(list, a, idx) {
	        var inf, item;
	        // Array.prototype.indexOf doesn't exist below IE9
	        if (typeof list.indexOf === 'function') {
	            switch (typeof a) {
	            case 'number':
	                if (a === 0) {
	                    // manually crawl the list to distinguish between +0 and -0
	                    inf = 1 / a;
	                    while (idx < list.length) {
	                        item = list[idx];
	                        if (item === 0 && 1 / item === inf) {
	                            return idx;
	                        }
	                        idx += 1;
	                    }
	                    return -1;
	                } else if (a !== a) {
	                    // NaN
	                    while (idx < list.length) {
	                        item = list[idx];
	                        if (typeof item === 'number' && item !== item) {
	                            return idx;
	                        }
	                        idx += 1;
	                    }
	                    return -1;
	                }
	                // non-zero numbers can utilise Set
	                return list.indexOf(a, idx);
	            // all these types can utilise Set
	            case 'string':
	            case 'boolean':
	            case 'function':
	            case 'undefined':
	                return list.indexOf(a, idx);
	            case 'object':
	                if (a === null) {
	                    // null can utilise Set
	                    return list.indexOf(a, idx);
	                }
	            }
	        }
	        // anything else not covered above, defer to R.equals
	        while (idx < list.length) {
	            if (equals(list[idx], a)) {
	                return idx;
	            }
	            idx += 1;
	        }
	        return -1;
	    };

	    var _xchain = _curry2(function _xchain(f, xf) {
	        return map(f, _flatCat(xf));
	    });

	    /**
	     * Takes a list of predicates and returns a predicate that returns true for a
	     * given list of arguments if every one of the provided predicates is satisfied
	     * by those arguments.
	     *
	     * The function returned is a curried function whose arity matches that of the
	     * highest-arity predicate.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Logic
	     * @sig [(*... -> Boolean)] -> (*... -> Boolean)
	     * @param {Array} preds
	     * @return {Function}
	     * @see R.anyPass
	     * @example
	     *
	     *      var isQueen = R.propEq('rank', 'Q');
	     *      var isSpade = R.propEq('suit', '♠︎');
	     *      var isQueenOfSpades = R.allPass([isQueen, isSpade]);
	     *
	     *      isQueenOfSpades({rank: 'Q', suit: '♣︎'}); //=> false
	     *      isQueenOfSpades({rank: 'Q', suit: '♠︎'}); //=> true
	     */
	    var allPass = _curry1(function allPass(preds) {
	        return curryN(reduce(max, 0, pluck('length', preds)), function () {
	            var idx = 0;
	            var len = preds.length;
	            while (idx < len) {
	                if (!preds[idx].apply(this, arguments)) {
	                    return false;
	                }
	                idx += 1;
	            }
	            return true;
	        });
	    });

	    /**
	     * Takes a list of predicates and returns a predicate that returns true for a
	     * given list of arguments if at least one of the provided predicates is
	     * satisfied by those arguments.
	     *
	     * The function returned is a curried function whose arity matches that of the
	     * highest-arity predicate.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Logic
	     * @sig [(*... -> Boolean)] -> (*... -> Boolean)
	     * @param {Array} preds
	     * @return {Function}
	     * @see R.allPass
	     * @example
	     *
	     *      var gte = R.anyPass([R.gt, R.equals]);
	     *
	     *      gte(3, 2); //=> true
	     *      gte(2, 2); //=> true
	     *      gte(2, 3); //=> false
	     */
	    var anyPass = _curry1(function anyPass(preds) {
	        return curryN(reduce(max, 0, pluck('length', preds)), function () {
	            var idx = 0;
	            var len = preds.length;
	            while (idx < len) {
	                if (preds[idx].apply(this, arguments)) {
	                    return true;
	                }
	                idx += 1;
	            }
	            return false;
	        });
	    });

	    /**
	     * ap applies a list of functions to a list of values.
	     *
	     * Dispatches to the `ap` method of the second argument, if present. Also
	     * treats curried functions as applicatives.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.3.0
	     * @category Function
	     * @sig [a -> b] -> [a] -> [b]
	     * @sig Apply f => f (a -> b) -> f a -> f b
	     * @param {Array} fns An array of functions
	     * @param {Array} vs An array of values
	     * @return {Array} An array of results of applying each of `fns` to all of `vs` in turn.
	     * @example
	     *
	     *      R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
	     */
	    // else
	    var ap = _curry2(function ap(applicative, fn) {
	        return typeof applicative.ap === 'function' ? applicative.ap(fn) : typeof applicative === 'function' ? function (x) {
	            return applicative(x)(fn(x));
	        } : // else
	        _reduce(function (acc, f) {
	            return _concat(acc, map(f, fn));
	        }, [], applicative);
	    });

	    /**
	     * Given a spec object recursively mapping properties to functions, creates a
	     * function producing an object of the same structure, by mapping each property
	     * to the result of calling its associated function with the supplied arguments.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.20.0
	     * @category Function
	     * @sig {k: ((a, b, ..., m) -> v)} -> ((a, b, ..., m) -> {k: v})
	     * @param {Object} spec an object recursively mapping properties to functions for
	     *        producing the values for these properties.
	     * @return {Function} A function that returns an object of the same structure
	     * as `spec', with each property set to the value returned by calling its
	     * associated function with the supplied arguments.
	     * @see R.converge, R.juxt
	     * @example
	     *
	     *      var getMetrics = R.applySpec({
	     *                                      sum: R.add,
	     *                                      nested: { mul: R.multiply }
	     *                                   });
	     *      getMetrics(2, 4); // => { sum: 6, nested: { mul: 8 } }
	     */
	    var applySpec = _curry1(function applySpec(spec) {
	        spec = map(function (v) {
	            return typeof v == 'function' ? v : applySpec(v);
	        }, spec);
	        return curryN(reduce(max, 0, pluck('length', values(spec))), function () {
	            var args = arguments;
	            return map(function (f) {
	                return apply(f, args);
	            }, spec);
	        });
	    });

	    /**
	     * Returns the result of calling its first argument with the remaining
	     * arguments. This is occasionally useful as a converging function for
	     * `R.converge`: the left branch can produce a function while the right branch
	     * produces a value to be passed to that function as an argument.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category Function
	     * @sig (*... -> a),*... -> a
	     * @param {Function} fn The function to apply to the remaining arguments.
	     * @param {...*} args Any number of positional arguments.
	     * @return {*}
	     * @see R.apply
	     * @example
	     *
	     *      var indentN = R.pipe(R.times(R.always(' ')),
	     *                           R.join(''),
	     *                           R.replace(/^(?!$)/gm));
	     *
	     *      var format = R.converge(R.call, [
	     *                                  R.pipe(R.prop('indent'), indentN),
	     *                                  R.prop('value')
	     *                              ]);
	     *
	     *      format({indent: 2, value: 'foo\nbar\nbaz\n'}); //=> '  foo\n  bar\n  baz\n'
	     */
	    var call = curry(function call(fn) {
	        return fn.apply(this, _slice(arguments, 1));
	    });

	    /**
	     * `chain` maps a function over a list and concatenates the results. `chain`
	     * is also known as `flatMap` in some libraries
	     *
	     * Dispatches to the `chain` method of the second argument, if present,
	     * according to the [FantasyLand Chain spec](https://github.com/fantasyland/fantasy-land#chain).
	     *
	     * @func
	     * @memberOf R
	     * @since v0.3.0
	     * @category List
	     * @sig Chain m => (a -> m b) -> m a -> m b
	     * @param {Function} fn
	     * @param {Array} list
	     * @return {Array}
	     * @example
	     *
	     *      var duplicate = n => [n, n];
	     *      R.chain(duplicate, [1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]
	     */
	    var chain = _curry2(_dispatchable('chain', _xchain, function chain(fn, monad) {
	        if (typeof monad === 'function') {
	            return function () {
	                return monad.call(this, fn.apply(this, arguments)).apply(this, arguments);
	            };
	        }
	        return _makeFlat(false)(map(fn, monad));
	    }));

	    /**
	     * Returns a function, `fn`, which encapsulates if/else-if/else logic.
	     * `R.cond` takes a list of [predicate, transform] pairs. All of the arguments
	     * to `fn` are applied to each of the predicates in turn until one returns a
	     * "truthy" value, at which point `fn` returns the result of applying its
	     * arguments to the corresponding transformer. If none of the predicates
	     * matches, `fn` returns undefined.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.6.0
	     * @category Logic
	     * @sig [[(*... -> Boolean),(*... -> *)]] -> (*... -> *)
	     * @param {Array} pairs
	     * @return {Function}
	     * @example
	     *
	     *      var fn = R.cond([
	     *        [R.equals(0),   R.always('water freezes at 0°C')],
	     *        [R.equals(100), R.always('water boils at 100°C')],
	     *        [R.T,           temp => 'nothing special happens at ' + temp + '°C']
	     *      ]);
	     *      fn(0); //=> 'water freezes at 0°C'
	     *      fn(50); //=> 'nothing special happens at 50°C'
	     *      fn(100); //=> 'water boils at 100°C'
	     */
	    var cond = _curry1(function cond(pairs) {
	        var arity = reduce(max, 0, map(function (pair) {
	            return pair[0].length;
	        }, pairs));
	        return _arity(arity, function () {
	            var idx = 0;
	            while (idx < pairs.length) {
	                if (pairs[idx][0].apply(this, arguments)) {
	                    return pairs[idx][1].apply(this, arguments);
	                }
	                idx += 1;
	            }
	        });
	    });

	    /**
	     * Wraps a constructor function inside a curried function that can be called
	     * with the same arguments and returns the same type. The arity of the function
	     * returned is specified to allow using variadic constructor functions.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.4.0
	     * @category Function
	     * @sig Number -> (* -> {*}) -> (* -> {*})
	     * @param {Number} n The arity of the constructor function.
	     * @param {Function} Fn The constructor function to wrap.
	     * @return {Function} A wrapped, curried constructor function.
	     * @example
	     *
	     *      // Variadic constructor function
	     *      var Widget = () => {
	     *        this.children = Array.prototype.slice.call(arguments);
	     *        // ...
	     *      };
	     *      Widget.prototype = {
	     *        // ...
	     *      };
	     *      var allConfigs = [
	     *        // ...
	     *      ];
	     *      R.map(R.constructN(1, Widget), allConfigs); // a list of Widgets
	     */
	    var constructN = _curry2(function constructN(n, Fn) {
	        if (n > 10) {
	            throw new Error('Constructor with greater than ten arguments');
	        }
	        if (n === 0) {
	            return function () {
	                return new Fn();
	            };
	        }
	        return curry(nAry(n, function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
	            switch (arguments.length) {
	            case 1:
	                return new Fn($0);
	            case 2:
	                return new Fn($0, $1);
	            case 3:
	                return new Fn($0, $1, $2);
	            case 4:
	                return new Fn($0, $1, $2, $3);
	            case 5:
	                return new Fn($0, $1, $2, $3, $4);
	            case 6:
	                return new Fn($0, $1, $2, $3, $4, $5);
	            case 7:
	                return new Fn($0, $1, $2, $3, $4, $5, $6);
	            case 8:
	                return new Fn($0, $1, $2, $3, $4, $5, $6, $7);
	            case 9:
	                return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8);
	            case 10:
	                return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8, $9);
	            }
	        }));
	    });

	    /**
	     * Accepts a converging function and a list of branching functions and returns
	     * a new function. When invoked, this new function is applied to some
	     * arguments, each branching function is applied to those same arguments. The
	     * results of each branching function are passed as arguments to the converging
	     * function to produce the return value.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.4.2
	     * @category Function
	     * @sig (x1 -> x2 -> ... -> z) -> [(a -> b -> ... -> x1), (a -> b -> ... -> x2), ...] -> (a -> b -> ... -> z)
	     * @param {Function} after A function. `after` will be invoked with the return values of
	     *        `fn1` and `fn2` as its arguments.
	     * @param {Array} functions A list of functions.
	     * @return {Function} A new function.
	     * @example
	     *
	     *      var add = (a, b) => a + b;
	     *      var multiply = (a, b) => a * b;
	     *      var subtract = (a, b) => a - b;
	     *
	     *      //≅ multiply( add(1, 2), subtract(1, 2) );
	     *      R.converge(multiply, [add, subtract])(1, 2); //=> -3
	     *
	     *      var add3 = (a, b, c) => a + b + c;
	     *      R.converge(add3, [multiply, add, subtract])(1, 2); //=> 4
	     */
	    var converge = _curry2(function converge(after, fns) {
	        return curryN(reduce(max, 0, pluck('length', fns)), function () {
	            var args = arguments;
	            var context = this;
	            return after.apply(context, _map(function (fn) {
	                return fn.apply(context, args);
	            }, fns));
	        });
	    });

	    /**
	     * Counts the elements of a list according to how many match each value of a
	     * key generated by the supplied function. Returns an object mapping the keys
	     * produced by `fn` to the number of occurrences in the list. Note that all
	     * keys are coerced to strings because of how JavaScript objects work.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig (a -> String) -> [a] -> {*}
	     * @param {Function} fn The function used to map values to keys.
	     * @param {Array} list The list to count elements from.
	     * @return {Object} An object mapping keys to number of occurrences in the list.
	     * @example
	     *
	     *      var numbers = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];
	     *      var letters = R.split('', 'abcABCaaaBBc');
	     *      R.countBy(Math.floor)(numbers);    //=> {'1': 3, '2': 2, '3': 1}
	     *      R.countBy(R.toLower)(letters);   //=> {'a': 5, 'b': 4, 'c': 3}
	     */
	    var countBy = reduceBy(function (acc, elem) {
	        return acc + 1;
	    }, 0);

	    /**
	     * Returns a new list without any consecutively repeating elements. Equality is
	     * determined by applying the supplied predicate two consecutive elements. The
	     * first element in a series of equal element is the one being preserved.
	     *
	     * Dispatches to the `dropRepeatsWith` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.14.0
	     * @category List
	     * @sig (a, a -> Boolean) -> [a] -> [a]
	     * @param {Function} pred A predicate used to test whether two items are equal.
	     * @param {Array} list The array to consider.
	     * @return {Array} `list` without repeating elements.
	     * @see R.transduce
	     * @example
	     *
	     *      var l = [1, -1, 1, 3, 4, -4, -4, -5, 5, 3, 3];
	     *      R.dropRepeatsWith(R.eqBy(Math.abs), l); //=> [1, 3, 4, -5, 3]
	     */
	    var dropRepeatsWith = _curry2(_dispatchable('dropRepeatsWith', _xdropRepeatsWith, function dropRepeatsWith(pred, list) {
	        var result = [];
	        var idx = 1;
	        var len = list.length;
	        if (len !== 0) {
	            result[0] = list[0];
	            while (idx < len) {
	                if (!pred(last(result), list[idx])) {
	                    result[result.length] = list[idx];
	                }
	                idx += 1;
	            }
	        }
	        return result;
	    }));

	    /**
	     * Takes a function and two values in its domain and returns `true` if the
	     * values map to the same value in the codomain; `false` otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.18.0
	     * @category Relation
	     * @sig (a -> b) -> a -> a -> Boolean
	     * @param {Function} f
	     * @param {*} x
	     * @param {*} y
	     * @return {Boolean}
	     * @example
	     *
	     *      R.eqBy(Math.abs, 5, -5); //=> true
	     */
	    var eqBy = _curry3(function eqBy(f, x, y) {
	        return equals(f(x), f(y));
	    });

	    /**
	     * Reports whether two objects have the same value, in `R.equals` terms, for
	     * the specified property. Useful as a curried predicate.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Object
	     * @sig k -> {k: v} -> {k: v} -> Boolean
	     * @param {String} prop The name of the property to compare
	     * @param {Object} obj1
	     * @param {Object} obj2
	     * @return {Boolean}
	     *
	     * @example
	     *
	     *      var o1 = { a: 1, b: 2, c: 3, d: 4 };
	     *      var o2 = { a: 10, b: 20, c: 3, d: 40 };
	     *      R.eqProps('a', o1, o2); //=> false
	     *      R.eqProps('c', o1, o2); //=> true
	     */
	    var eqProps = _curry3(function eqProps(prop, obj1, obj2) {
	        return equals(obj1[prop], obj2[prop]);
	    });

	    /**
	     * Splits a list into sub-lists stored in an object, based on the result of
	     * calling a String-returning function on each element, and grouping the
	     * results according to values returned.
	     *
	     * Dispatches to the `groupBy` method of the second argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig (a -> String) -> [a] -> {String: [a]}
	     * @param {Function} fn Function :: a -> String
	     * @param {Array} list The array to group
	     * @return {Object} An object with the output of `fn` for keys, mapped to arrays of elements
	     *         that produced that key when passed to `fn`.
	     * @see R.transduce
	     * @example
	     *
	     *      var byGrade = R.groupBy(function(student) {
	     *        var score = student.score;
	     *        return score < 65 ? 'F' :
	     *               score < 70 ? 'D' :
	     *               score < 80 ? 'C' :
	     *               score < 90 ? 'B' : 'A';
	     *      });
	     *      var students = [{name: 'Abby', score: 84},
	     *                      {name: 'Eddy', score: 58},
	     *                      // ...
	     *                      {name: 'Jack', score: 69}];
	     *      byGrade(students);
	     *      // {
	     *      //   'A': [{name: 'Dianne', score: 99}],
	     *      //   'B': [{name: 'Abby', score: 84}]
	     *      //   // ...,
	     *      //   'F': [{name: 'Eddy', score: 58}]
	     *      // }
	     */
	    var groupBy = _curry2(_checkForMethod('groupBy', reduceBy(function (acc, item) {
	        if (acc == null) {
	            acc = [];
	        }
	        acc.push(item);
	        return acc;
	    }, null)));

	    /**
	     * Given a function that generates a key, turns a list of objects into an
	     * object indexing the objects by the given key. Note that if multiple
	     * objects generate the same value for the indexing key only the last value
	     * will be included in the generated object.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category List
	     * @sig (a -> String) -> [{k: v}] -> {k: {k: v}}
	     * @param {Function} fn Function :: a -> String
	     * @param {Array} array The array of objects to index
	     * @return {Object} An object indexing each array element by the given property.
	     * @example
	     *
	     *      var list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];
	     *      R.indexBy(R.prop('id'), list);
	     *      //=> {abc: {id: 'abc', title: 'B'}, xyz: {id: 'xyz', title: 'A'}}
	     */
	    var indexBy = reduceBy(function (acc, elem) {
	        return elem;
	    }, null);

	    /**
	     * Returns the position of the first occurrence of an item in an array, or -1
	     * if the item is not included in the array. `R.equals` is used to determine
	     * equality.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig a -> [a] -> Number
	     * @param {*} target The item to find.
	     * @param {Array} xs The array to search in.
	     * @return {Number} the index of the target, or -1 if the target is not found.
	     * @see R.lastIndexOf
	     * @example
	     *
	     *      R.indexOf(3, [1,2,3,4]); //=> 2
	     *      R.indexOf(10, [1,2,3,4]); //=> -1
	     */
	    var indexOf = _curry2(function indexOf(target, xs) {
	        return typeof xs.indexOf === 'function' && !_isArray(xs) ? xs.indexOf(target) : _indexOf(xs, target, 0);
	    });

	    /**
	     * juxt applies a list of functions to a list of values.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category Function
	     * @sig [(a, b, ..., m) -> n] -> ((a, b, ..., m) -> [n])
	     * @param {Array} fns An array of functions
	     * @return {Function} A function that returns a list of values after applying each of the original `fns` to its parameters.
	     * @see R.applySpec
	     * @example
	     *
	     *      var getRange = R.juxt([Math.min, Math.max]);
	     *      getRange(3, 4, 9, -3); //=> [-3, 9]
	     */
	    var juxt = _curry1(function juxt(fns) {
	        return converge(_arrayOf, fns);
	    });

	    /**
	     * Returns a lens for the given getter and setter functions. The getter "gets"
	     * the value of the focus; the setter "sets" the value of the focus. The setter
	     * should not mutate the data structure.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.8.0
	     * @category Object
	     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	     * @sig (s -> a) -> ((a, s) -> s) -> Lens s a
	     * @param {Function} getter
	     * @param {Function} setter
	     * @return {Lens}
	     * @see R.view, R.set, R.over, R.lensIndex, R.lensProp
	     * @example
	     *
	     *      var xLens = R.lens(R.prop('x'), R.assoc('x'));
	     *
	     *      R.view(xLens, {x: 1, y: 2});            //=> 1
	     *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
	     *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
	     */
	    var lens = _curry2(function lens(getter, setter) {
	        return function (toFunctorFn) {
	            return function (target) {
	                return map(function (focus) {
	                    return setter(focus, target);
	                }, toFunctorFn(getter(target)));
	            };
	        };
	    });

	    /**
	     * Returns a lens whose focus is the specified index.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.14.0
	     * @category Object
	     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	     * @sig Number -> Lens s a
	     * @param {Number} n
	     * @return {Lens}
	     * @see R.view, R.set, R.over
	     * @example
	     *
	     *      var headLens = R.lensIndex(0);
	     *
	     *      R.view(headLens, ['a', 'b', 'c']);            //=> 'a'
	     *      R.set(headLens, 'x', ['a', 'b', 'c']);        //=> ['x', 'b', 'c']
	     *      R.over(headLens, R.toUpper, ['a', 'b', 'c']); //=> ['A', 'b', 'c']
	     */
	    var lensIndex = _curry1(function lensIndex(n) {
	        return lens(nth(n), update(n));
	    });

	    /**
	     * Returns a lens whose focus is the specified path.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category Object
	     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	     * @sig [String] -> Lens s a
	     * @param {Array} path The path to use.
	     * @return {Lens}
	     * @see R.view, R.set, R.over
	     * @example
	     *
	     *      var xyLens = R.lensPath(['x', 'y']);
	     *
	     *      R.view(xyLens, {x: {y: 2, z: 3}});            //=> 2
	     *      R.set(xyLens, 4, {x: {y: 2, z: 3}});          //=> {x: {y: 4, z: 3}}
	     *      R.over(xyLens, R.negate, {x: {y: 2, z: 3}});  //=> {x: {y: -2, z: 3}}
	     */
	    var lensPath = _curry1(function lensPath(p) {
	        return lens(path(p), assocPath(p));
	    });

	    /**
	     * Returns a lens whose focus is the specified property.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.14.0
	     * @category Object
	     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
	     * @sig String -> Lens s a
	     * @param {String} k
	     * @return {Lens}
	     * @see R.view, R.set, R.over
	     * @example
	     *
	     *      var xLens = R.lensProp('x');
	     *
	     *      R.view(xLens, {x: 1, y: 2});            //=> 1
	     *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
	     *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
	     */
	    var lensProp = _curry1(function lensProp(k) {
	        return lens(prop(k), assoc(k));
	    });

	    /**
	     * "lifts" a function to be the specified arity, so that it may "map over" that
	     * many lists, Functions or other objects that satisfy the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
	     *
	     * @func
	     * @memberOf R
	     * @since v0.7.0
	     * @category Function
	     * @sig Number -> (*... -> *) -> ([*]... -> [*])
	     * @param {Function} fn The function to lift into higher context
	     * @return {Function} The lifted function.
	     * @see R.lift, R.ap
	     * @example
	     *
	     *      var madd3 = R.liftN(3, R.curryN(3, (...args) => R.sum(args)));
	     *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
	     */
	    var liftN = _curry2(function liftN(arity, fn) {
	        var lifted = curryN(arity, fn);
	        return curryN(arity, function () {
	            return _reduce(ap, map(lifted, arguments[0]), _slice(arguments, 1));
	        });
	    });

	    /**
	     * Returns the mean of the given list of numbers.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.14.0
	     * @category Math
	     * @sig [Number] -> Number
	     * @param {Array} list
	     * @return {Number}
	     * @example
	     *
	     *      R.mean([2, 7, 9]); //=> 6
	     *      R.mean([]); //=> NaN
	     */
	    var mean = _curry1(function mean(list) {
	        return sum(list) / list.length;
	    });

	    /**
	     * Returns the median of the given list of numbers.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.14.0
	     * @category Math
	     * @sig [Number] -> Number
	     * @param {Array} list
	     * @return {Number}
	     * @example
	     *
	     *      R.median([2, 9, 7]); //=> 7
	     *      R.median([7, 2, 10, 9]); //=> 8
	     *      R.median([]); //=> NaN
	     */
	    var median = _curry1(function median(list) {
	        var len = list.length;
	        if (len === 0) {
	            return NaN;
	        }
	        var width = 2 - len % 2;
	        var idx = (len - width) / 2;
	        return mean(_slice(list).sort(function (a, b) {
	            return a < b ? -1 : a > b ? 1 : 0;
	        }).slice(idx, idx + width));
	    });

	    /**
	     * Takes a predicate and a list or other "filterable" object and returns the
	     * pair of filterable objects of the same type of elements which do and do not
	     * satisfy, the predicate, respectively.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.4
	     * @category List
	     * @sig Filterable f => (a -> Boolean) -> f a -> [f a, f a]
	     * @param {Function} pred A predicate to determine which side the element belongs to.
	     * @param {Array} filterable the list (or other filterable) to partition.
	     * @return {Array} An array, containing first the subset of elements that satisfy the
	     *         predicate, and second the subset of elements that do not satisfy.
	     * @see R.filter, R.reject
	     * @example
	     *
	     *      R.partition(R.contains('s'), ['sss', 'ttt', 'foo', 'bars']);
	     *      // => [ [ 'sss', 'bars' ],  [ 'ttt', 'foo' ] ]
	     *
	     *      R.partition(R.contains('s'), { a: 'sss', b: 'ttt', foo: 'bars' });
	     *      // => [ { a: 'sss', foo: 'bars' }, { b: 'ttt' }  ]
	     */
	    var partition = juxt([
	        filter,
	        reject
	    ]);

	    /**
	     * Performs left-to-right function composition. The leftmost function may have
	     * any arity; the remaining functions must be unary.
	     *
	     * In some libraries this function is named `sequence`.
	     *
	     * **Note:** The result of pipe is not automatically curried.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
	     * @param {...Function} functions
	     * @return {Function}
	     * @see R.compose
	     * @example
	     *
	     *      var f = R.pipe(Math.pow, R.negate, R.inc);
	     *
	     *      f(3, 4); // -(3^4) + 1
	     */
	    var pipe = function pipe() {
	        if (arguments.length === 0) {
	            throw new Error('pipe requires at least one argument');
	        }
	        return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
	    };

	    /**
	     * Performs left-to-right composition of one or more Promise-returning
	     * functions. The leftmost function may have any arity; the remaining functions
	     * must be unary.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.10.0
	     * @category Function
	     * @sig ((a -> Promise b), (b -> Promise c), ..., (y -> Promise z)) -> (a -> Promise z)
	     * @param {...Function} functions
	     * @return {Function}
	     * @see R.composeP
	     * @example
	     *
	     *      //  followersForUser :: String -> Promise [User]
	     *      var followersForUser = R.pipeP(db.getUserById, db.getFollowers);
	     */
	    var pipeP = function pipeP() {
	        if (arguments.length === 0) {
	            throw new Error('pipeP requires at least one argument');
	        }
	        return _arity(arguments[0].length, reduce(_pipeP, arguments[0], tail(arguments)));
	    };

	    /**
	     * Multiplies together all the elements of a list.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Math
	     * @sig [Number] -> Number
	     * @param {Array} list An array of numbers
	     * @return {Number} The product of all the numbers in the list.
	     * @see R.reduce
	     * @example
	     *
	     *      R.product([2,4,6,8,100,1]); //=> 38400
	     */
	    var product = reduce(multiply, 1);

	    /**
	     * Transforms a [Traversable](https://github.com/fantasyland/fantasy-land#traversable)
	     * of [Applicative](https://github.com/fantasyland/fantasy-land#applicative) into an
	     * Applicative of Traversable.
	     *
	     * Dispatches to the `sequence` method of the second argument, if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category List
	     * @sig (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
	     * @param {Function} of
	     * @param {*} traversable
	     * @return {*}
	     * @see R.traverse
	     * @example
	     *
	     *      R.sequence(Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([1, 2, 3])
	     *      R.sequence(Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()
	     *
	     *      R.sequence(R.of, Just([1, 2, 3])); //=> [Just(1), Just(2), Just(3)]
	     *      R.sequence(R.of, Nothing());       //=> [Nothing()]
	     */
	    var sequence = _curry2(function sequence(of, traversable) {
	        return typeof traversable.sequence === 'function' ? traversable.sequence(of) : reduceRight(function (acc, x) {
	            return ap(map(prepend, x), acc);
	        }, of([]), traversable);
	    });

	    /**
	     * Maps an [Applicative](https://github.com/fantasyland/fantasy-land#applicative)-returning
	     * function over a [Traversable](https://github.com/fantasyland/fantasy-land#traversable),
	     * then uses [`sequence`](#sequence) to transform the resulting Traversable of Applicative
	     * into an Applicative of Traversable.
	     *
	     * Dispatches to the `sequence` method of the third argument, if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category List
	     * @sig (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
	     * @param {Function} of
	     * @param {Function} f
	     * @param {*} traversable
	     * @return {*}
	     * @see R.sequence
	     * @example
	     *
	     *      // Returns `Nothing` if the given divisor is `0`
	     *      safeDiv = n => d => d === 0 ? Nothing() : Just(n / d)
	     *
	     *      R.traverse(Maybe.of, safeDiv(10), [2, 4, 5]); //=> Just([5, 2.5, 2])
	     *      R.traverse(Maybe.of, safeDiv(10), [2, 0, 5]); //=> Nothing
	     */
	    var traverse = _curry3(function traverse(of, f, traversable) {
	        return sequence(of, map(f, traversable));
	    });

	    /**
	     * Shorthand for `R.chain(R.identity)`, which removes one level of nesting from
	     * any [Chain](https://github.com/fantasyland/fantasy-land#chain).
	     *
	     * @func
	     * @memberOf R
	     * @since v0.3.0
	     * @category List
	     * @sig Chain c => c (c a) -> c a
	     * @param {*} list
	     * @return {*}
	     * @see R.flatten, R.chain
	     * @example
	     *
	     *      R.unnest([1, [2], [[3]]]); //=> [1, 2, [3]]
	     *      R.unnest([[1, 2], [3, 4], [5, 6]]); //=> [1, 2, 3, 4, 5, 6]
	     */
	    var unnest = chain(_identity);

	    var _contains = function _contains(a, list) {
	        return _indexOf(list, a, 0) >= 0;
	    };

	    //  mapPairs :: (Object, [String]) -> [String]
	    var _toString = function _toString(x, seen) {
	        var recur = function recur(y) {
	            var xs = seen.concat([x]);
	            return _contains(y, xs) ? '<Circular>' : _toString(y, xs);
	        };
	        //  mapPairs :: (Object, [String]) -> [String]
	        var mapPairs = function (obj, keys) {
	            return _map(function (k) {
	                return _quote(k) + ': ' + recur(obj[k]);
	            }, keys.slice().sort());
	        };
	        switch (Object.prototype.toString.call(x)) {
	        case '[object Arguments]':
	            return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
	        case '[object Array]':
	            return '[' + _map(recur, x).concat(mapPairs(x, reject(function (k) {
	                return /^\d+$/.test(k);
	            }, keys(x)))).join(', ') + ']';
	        case '[object Boolean]':
	            return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
	        case '[object Date]':
	            return 'new Date(' + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString(x))) + ')';
	        case '[object Null]':
	            return 'null';
	        case '[object Number]':
	            return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
	        case '[object String]':
	            return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
	        case '[object Undefined]':
	            return 'undefined';
	        default:
	            if (typeof x.toString === 'function') {
	                var repr = x.toString();
	                if (repr !== '[object Object]') {
	                    return repr;
	                }
	            }
	            return '{' + mapPairs(x, keys(x)).join(', ') + '}';
	        }
	    };

	    /**
	     * Performs right-to-left function composition. The rightmost function may have
	     * any arity; the remaining functions must be unary.
	     *
	     * **Note:** The result of compose is not automatically curried.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
	     * @param {...Function} functions
	     * @return {Function}
	     * @see R.pipe
	     * @example
	     *
	     *      var f = R.compose(R.inc, R.negate, Math.pow);
	     *
	     *      f(3, 4); // -(3^4) + 1
	     */
	    var compose = function compose() {
	        if (arguments.length === 0) {
	            throw new Error('compose requires at least one argument');
	        }
	        return pipe.apply(this, reverse(arguments));
	    };

	    /**
	     * Returns the right-to-left Kleisli composition of the provided functions,
	     * each of which must return a value of a type supported by [`chain`](#chain).
	     *
	     * `R.composeK(h, g, f)` is equivalent to `R.compose(R.chain(h), R.chain(g), R.chain(f))`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category Function
	     * @sig Chain m => ((y -> m z), (x -> m y), ..., (a -> m b)) -> (m a -> m z)
	     * @param {...Function}
	     * @return {Function}
	     * @see R.pipeK
	     * @example
	     *
	     *      //  parseJson :: String -> Maybe *
	     *      //  get :: String -> Object -> Maybe *
	     *
	     *      //  getStateCode :: Maybe String -> Maybe String
	     *      var getStateCode = R.composeK(
	     *        R.compose(Maybe.of, R.toUpper),
	     *        get('state'),
	     *        get('address'),
	     *        get('user'),
	     *        parseJson
	     *      );
	     *
	     *      getStateCode(Maybe.of('{"user":{"address":{"state":"ny"}}}'));
	     *      //=> Just('NY')
	     *      getStateCode(Maybe.of('[Invalid JSON]'));
	     *      //=> Nothing()
	     */
	    var composeK = function composeK() {
	        return compose.apply(this, prepend(identity, map(chain, arguments)));
	    };

	    /**
	     * Performs right-to-left composition of one or more Promise-returning
	     * functions. The rightmost function may have any arity; the remaining
	     * functions must be unary.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.10.0
	     * @category Function
	     * @sig ((y -> Promise z), (x -> Promise y), ..., (a -> Promise b)) -> (a -> Promise z)
	     * @param {...Function} functions
	     * @return {Function}
	     * @see R.pipeP
	     * @example
	     *
	     *      //  followersForUser :: String -> Promise [User]
	     *      var followersForUser = R.composeP(db.getFollowers, db.getUserById);
	     */
	    var composeP = function composeP() {
	        if (arguments.length === 0) {
	            throw new Error('composeP requires at least one argument');
	        }
	        return pipeP.apply(this, reverse(arguments));
	    };

	    /**
	     * Wraps a constructor function inside a curried function that can be called
	     * with the same arguments and returns the same type.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig (* -> {*}) -> (* -> {*})
	     * @param {Function} Fn The constructor function to wrap.
	     * @return {Function} A wrapped, curried constructor function.
	     * @example
	     *
	     *      // Constructor function
	     *      var Widget = config => {
	     *        // ...
	     *      };
	     *      Widget.prototype = {
	     *        // ...
	     *      };
	     *      var allConfigs = [
	     *        // ...
	     *      ];
	     *      R.map(R.construct(Widget), allConfigs); // a list of Widgets
	     */
	    var construct = _curry1(function construct(Fn) {
	        return constructN(Fn.length, Fn);
	    });

	    /**
	     * Returns `true` if the specified value is equal, in `R.equals` terms, to at
	     * least one element of the given list; `false` otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig a -> [a] -> Boolean
	     * @param {Object} a The item to compare against.
	     * @param {Array} list The array to consider.
	     * @return {Boolean} `true` if the item is in the list, `false` otherwise.
	     * @see R.any
	     * @example
	     *
	     *      R.contains(3, [1, 2, 3]); //=> true
	     *      R.contains(4, [1, 2, 3]); //=> false
	     *      R.contains([42], [[42]]); //=> true
	     */
	    var contains = _curry2(_contains);

	    /**
	     * Finds the set (i.e. no duplicates) of all elements in the first list not
	     * contained in the second list.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig [*] -> [*] -> [*]
	     * @param {Array} list1 The first list.
	     * @param {Array} list2 The second list.
	     * @return {Array} The elements in `list1` that are not in `list2`.
	     * @see R.differenceWith, R.symmetricDifference, R.symmetricDifferenceWith
	     * @example
	     *
	     *      R.difference([1,2,3,4], [7,6,5,4,3]); //=> [1,2]
	     *      R.difference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5]
	     */
	    var difference = _curry2(function difference(first, second) {
	        var out = [];
	        var idx = 0;
	        var firstLen = first.length;
	        while (idx < firstLen) {
	            if (!_contains(first[idx], second) && !_contains(first[idx], out)) {
	                out[out.length] = first[idx];
	            }
	            idx += 1;
	        }
	        return out;
	    });

	    /**
	     * Returns a new list without any consecutively repeating elements. `R.equals`
	     * is used to determine equality.
	     *
	     * Dispatches to the `dropRepeats` method of the first argument, if present.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.14.0
	     * @category List
	     * @sig [a] -> [a]
	     * @param {Array} list The array to consider.
	     * @return {Array} `list` without repeating elements.
	     * @see R.transduce
	     * @example
	     *
	     *     R.dropRepeats([1, 1, 1, 2, 3, 4, 4, 2, 2]); //=> [1, 2, 3, 4, 2]
	     */
	    var dropRepeats = _curry1(_dispatchable('dropRepeats', _xdropRepeatsWith(equals), dropRepeatsWith(equals)));

	    /**
	     * "lifts" a function of arity > 1 so that it may "map over" a list, Function or other
	     * object that satisfies the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
	     *
	     * @func
	     * @memberOf R
	     * @since v0.7.0
	     * @category Function
	     * @sig (*... -> *) -> ([*]... -> [*])
	     * @param {Function} fn The function to lift into higher context
	     * @return {Function} The lifted function.
	     * @see R.liftN
	     * @example
	     *
	     *      var madd3 = R.lift(R.curry((a, b, c) => a + b + c));
	     *
	     *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
	     *
	     *      var madd5 = R.lift(R.curry((a, b, c, d, e) => a + b + c + d + e));
	     *
	     *      madd5([1,2], [3], [4, 5], [6], [7, 8]); //=> [21, 22, 22, 23, 22, 23, 23, 24]
	     */
	    var lift = _curry1(function lift(fn) {
	        return liftN(fn.length, fn);
	    });

	    /**
	     * Returns a partial copy of an object omitting the keys specified.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Object
	     * @sig [String] -> {String: *} -> {String: *}
	     * @param {Array} names an array of String property names to omit from the new object
	     * @param {Object} obj The object to copy from
	     * @return {Object} A new object with properties from `names` not on it.
	     * @see R.pick
	     * @example
	     *
	     *      R.omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}
	     */
	    var omit = _curry2(function omit(names, obj) {
	        var result = {};
	        for (var prop in obj) {
	            if (!_contains(prop, names)) {
	                result[prop] = obj[prop];
	            }
	        }
	        return result;
	    });

	    /**
	     * Returns the left-to-right Kleisli composition of the provided functions,
	     * each of which must return a value of a type supported by [`chain`](#chain).
	     *
	     * `R.pipeK(f, g, h)` is equivalent to `R.pipe(R.chain(f), R.chain(g), R.chain(h))`.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category Function
	     * @sig Chain m => ((a -> m b), (b -> m c), ..., (y -> m z)) -> (m a -> m z)
	     * @param {...Function}
	     * @return {Function}
	     * @see R.composeK
	     * @example
	     *
	     *      //  parseJson :: String -> Maybe *
	     *      //  get :: String -> Object -> Maybe *
	     *
	     *      //  getStateCode :: Maybe String -> Maybe String
	     *      var getStateCode = R.pipeK(
	     *        parseJson,
	     *        get('user'),
	     *        get('address'),
	     *        get('state'),
	     *        R.compose(Maybe.of, R.toUpper)
	     *      );
	     *
	     *      getStateCode(Maybe.of('{"user":{"address":{"state":"ny"}}}'));
	     *      //=> Just('NY')
	     *      getStateCode(Maybe.of('[Invalid JSON]'));
	     *      //=> Nothing()
	     */
	    var pipeK = function pipeK() {
	        return composeK.apply(this, reverse(arguments));
	    };

	    /**
	     * Returns the string representation of the given value. `eval`'ing the output
	     * should result in a value equivalent to the input value. Many of the built-in
	     * `toString` methods do not satisfy this requirement.
	     *
	     * If the given value is an `[object Object]` with a `toString` method other
	     * than `Object.prototype.toString`, this method is invoked with no arguments
	     * to produce the return value. This means user-defined constructor functions
	     * can provide a suitable `toString` method. For example:
	     *
	     *     function Point(x, y) {
	     *       this.x = x;
	     *       this.y = y;
	     *     }
	     *
	     *     Point.prototype.toString = function() {
	     *       return 'new Point(' + this.x + ', ' + this.y + ')';
	     *     };
	     *
	     *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
	     *
	     * @func
	     * @memberOf R
	     * @since v0.14.0
	     * @category String
	     * @sig * -> String
	     * @param {*} val
	     * @return {String}
	     * @example
	     *
	     *      R.toString(42); //=> '42'
	     *      R.toString('abc'); //=> '"abc"'
	     *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
	     *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
	     *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
	     */
	    var toString = _curry1(function toString(val) {
	        return _toString(val, []);
	    });

	    /**
	     * Returns a new list without values in the first argument.
	     * `R.equals` is used to determine equality.
	     *
	     * Acts as a transducer if a transformer is given in list position.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category List
	     * @sig [a] -> [a] -> [a]
	     * @param {Array} list1 The values to be removed from `list2`.
	     * @param {Array} list2 The array to remove values from.
	     * @return {Array} The new array without values in `list1`.
	     * @see R.transduce
	     * @example
	     *
	     *      R.without([1, 2], [1, 2, 1, 3, 4]); //=> [3, 4]
	     */
	    var without = _curry2(function (xs, list) {
	        return reject(flip(_contains)(xs), list);
	    });

	    // A simple Set type that honours R.equals semantics
	    /* globals Set */
	    // until we figure out why jsdoc chokes on this
	    // @param item The item to add to the Set
	    // @returns {boolean} true if the item did not exist prior, otherwise false
	    //
	    //
	    // @param item The item to check for existence in the Set
	    // @returns {boolean} true if the item exists in the Set, otherwise false
	    //
	    //
	    // Combines the logic for checking whether an item is a member of the set and
	    // for adding a new item to the set.
	    //
	    // @param item       The item to check or add to the Set instance.
	    // @param shouldAdd  If true, the item will be added to the set if it doesn't
	    //                   already exist.
	    // @param set        The set instance to check or add to.
	    // @return {boolean} true if the item already existed, otherwise false.
	    //
	    // distinguish between +0 and -0
	    // these types can all utilise the native Set
	    // set._items['boolean'] holds a two element array
	    // representing [ falseExists, trueExists ]
	    // compare functions for reference equality
	    /* falls through */
	    // reduce the search size of heterogeneous sets by creating buckets
	    // for each type.
	    // scan through all previously applied items
	    var _Set = function () {
	        function _Set() {
	            /* globals Set */
	            this._nativeSet = typeof Set === 'function' ? new Set() : null;
	            this._items = {};
	        }
	        // until we figure out why jsdoc chokes on this
	        // @param item The item to add to the Set
	        // @returns {boolean} true if the item did not exist prior, otherwise false
	        //
	        _Set.prototype.add = function (item) {
	            return !hasOrAdd(item, true, this);
	        };
	        //
	        // @param item The item to check for existence in the Set
	        // @returns {boolean} true if the item exists in the Set, otherwise false
	        //
	        _Set.prototype.has = function (item) {
	            return hasOrAdd(item, false, this);
	        };
	        //
	        // Combines the logic for checking whether an item is a member of the set and
	        // for adding a new item to the set.
	        //
	        // @param item       The item to check or add to the Set instance.
	        // @param shouldAdd  If true, the item will be added to the set if it doesn't
	        //                   already exist.
	        // @param set        The set instance to check or add to.
	        // @return {boolean} true if the item already existed, otherwise false.
	        //
	        function hasOrAdd(item, shouldAdd, set) {
	            var type = typeof item;
	            var prevSize, newSize;
	            switch (type) {
	            case 'string':
	            case 'number':
	                // distinguish between +0 and -0
	                if (item === 0 && 1 / item === -Infinity) {
	                    if (set._items['-0']) {
	                        return true;
	                    } else {
	                        if (shouldAdd) {
	                            set._items['-0'] = true;
	                        }
	                        return false;
	                    }
	                }
	                // these types can all utilise the native Set
	                if (set._nativeSet !== null) {
	                    if (shouldAdd) {
	                        prevSize = set._nativeSet.size;
	                        set._nativeSet.add(item);
	                        newSize = set._nativeSet.size;
	                        return newSize === prevSize;
	                    } else {
	                        return set._nativeSet.has(item);
	                    }
	                } else {
	                    if (!(type in set._items)) {
	                        if (shouldAdd) {
	                            set._items[type] = {};
	                            set._items[type][item] = true;
	                        }
	                        return false;
	                    } else if (item in set._items[type]) {
	                        return true;
	                    } else {
	                        if (shouldAdd) {
	                            set._items[type][item] = true;
	                        }
	                        return false;
	                    }
	                }
	            case 'boolean':
	                // set._items['boolean'] holds a two element array
	                // representing [ falseExists, trueExists ]
	                if (type in set._items) {
	                    var bIdx = item ? 1 : 0;
	                    if (set._items[type][bIdx]) {
	                        return true;
	                    } else {
	                        if (shouldAdd) {
	                            set._items[type][bIdx] = true;
	                        }
	                        return false;
	                    }
	                } else {
	                    if (shouldAdd) {
	                        set._items[type] = item ? [
	                            false,
	                            true
	                        ] : [
	                            true,
	                            false
	                        ];
	                    }
	                    return false;
	                }
	            case 'function':
	                // compare functions for reference equality
	                if (set._nativeSet !== null) {
	                    if (shouldAdd) {
	                        prevSize = set._nativeSet.size;
	                        set._nativeSet.add(item);
	                        newSize = set._nativeSet.size;
	                        return newSize > prevSize;
	                    } else {
	                        return set._nativeSet.has(item);
	                    }
	                } else {
	                    if (!(type in set._items)) {
	                        if (shouldAdd) {
	                            set._items[type] = [item];
	                        }
	                        return false;
	                    }
	                    if (!_contains(item, set._items[type])) {
	                        if (shouldAdd) {
	                            set._items[type].push(item);
	                        }
	                        return false;
	                    }
	                    return true;
	                }
	            case 'undefined':
	                if (set._items[type]) {
	                    return true;
	                } else {
	                    if (shouldAdd) {
	                        set._items[type] = true;
	                    }
	                    return false;
	                }
	            case 'object':
	                if (item === null) {
	                    if (!set._items['null']) {
	                        if (shouldAdd) {
	                            set._items['null'] = true;
	                        }
	                        return false;
	                    }
	                    return true;
	                }
	            /* falls through */
	            default:
	                // reduce the search size of heterogeneous sets by creating buckets
	                // for each type.
	                type = Object.prototype.toString.call(item);
	                if (!(type in set._items)) {
	                    if (shouldAdd) {
	                        set._items[type] = [item];
	                    }
	                    return false;
	                }
	                // scan through all previously applied items
	                if (!_contains(item, set._items[type])) {
	                    if (shouldAdd) {
	                        set._items[type].push(item);
	                    }
	                    return false;
	                }
	                return true;
	            }
	        }
	        return _Set;
	    }();

	    /**
	     * A function wrapping calls to the two functions in an `&&` operation,
	     * returning the result of the first function if it is false-y and the result
	     * of the second function otherwise. Note that this is short-circuited,
	     * meaning that the second function will not be invoked if the first returns a
	     * false-y value.
	     *
	     * In addition to functions, `R.both` also accepts any fantasy-land compatible
	     * applicative functor.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.12.0
	     * @category Logic
	     * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
	     * @param {Function} f a predicate
	     * @param {Function} g another predicate
	     * @return {Function} a function that applies its arguments to `f` and `g` and `&&`s their outputs together.
	     * @see R.and
	     * @example
	     *
	     *      var gt10 = x => x > 10;
	     *      var even = x => x % 2 === 0;
	     *      var f = R.both(gt10, even);
	     *      f(100); //=> true
	     *      f(101); //=> false
	     */
	    var both = _curry2(function both(f, g) {
	        return _isFunction(f) ? function _both() {
	            return f.apply(this, arguments) && g.apply(this, arguments);
	        } : lift(and)(f, g);
	    });

	    /**
	     * Takes a function `f` and returns a function `g` such that:
	     *
	     *   - applying `g` to zero or more arguments will give __true__ if applying
	     *     the same arguments to `f` gives a logical __false__ value; and
	     *
	     *   - applying `g` to zero or more arguments will give __false__ if applying
	     *     the same arguments to `f` gives a logical __true__ value.
	     *
	     * `R.complement` will work on all other functors as well.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.12.0
	     * @category Logic
	     * @sig (*... -> *) -> (*... -> Boolean)
	     * @param {Function} f
	     * @return {Function}
	     * @see R.not
	     * @example
	     *
	     *      var isEven = n => n % 2 === 0;
	     *      var isOdd = R.complement(isEven);
	     *      isOdd(21); //=> true
	     *      isOdd(42); //=> false
	     */
	    var complement = lift(not);

	    /**
	     * Returns the result of concatenating the given lists or strings.
	     *
	     * Note: `R.concat` expects both arguments to be of the same type,
	     * unlike the native `Array.prototype.concat` method. It will throw
	     * an error if you `concat` an Array with a non-Array value.
	     *
	     * Dispatches to the `concat` method of the first argument, if present.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig [a] -> [a] -> [a]
	     * @sig String -> String -> String
	     * @param {Array|String} a
	     * @param {Array|String} b
	     * @return {Array|String}
	     *
	     * @example
	     *
	     *      R.concat([], []); //=> []
	     *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
	     *      R.concat('ABC', 'DEF'); // 'ABCDEF'
	     */
	    var concat = _curry2(function concat(a, b) {
	        if (a == null || !_isFunction(a.concat)) {
	            throw new TypeError(toString(a) + ' does not have a method named "concat"');
	        }
	        if (_isArray(a) && !_isArray(b)) {
	            throw new TypeError(toString(b) + ' is not an array');
	        }
	        return a.concat(b);
	    });

	    /**
	     * A function wrapping calls to the two functions in an `||` operation,
	     * returning the result of the first function if it is truth-y and the result
	     * of the second function otherwise. Note that this is short-circuited,
	     * meaning that the second function will not be invoked if the first returns a
	     * truth-y value.
	     *
	     * In addition to functions, `R.either` also accepts any fantasy-land compatible
	     * applicative functor.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.12.0
	     * @category Logic
	     * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
	     * @param {Function} f a predicate
	     * @param {Function} g another predicate
	     * @return {Function} a function that applies its arguments to `f` and `g` and `||`s their outputs together.
	     * @see R.or
	     * @example
	     *
	     *      var gt10 = x => x > 10;
	     *      var even = x => x % 2 === 0;
	     *      var f = R.either(gt10, even);
	     *      f(101); //=> true
	     *      f(8); //=> true
	     */
	    var either = _curry2(function either(f, g) {
	        return _isFunction(f) ? function _either() {
	            return f.apply(this, arguments) || g.apply(this, arguments);
	        } : lift(or)(f, g);
	    });

	    /**
	     * Turns a named method with a specified arity into a function that can be
	     * called directly supplied with arguments and a target object.
	     *
	     * The returned function is curried and accepts `arity + 1` parameters where
	     * the final parameter is the target object.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig Number -> String -> (a -> b -> ... -> n -> Object -> *)
	     * @param {Number} arity Number of arguments the returned function should take
	     *        before the target object.
	     * @param {String} method Name of the method to call.
	     * @return {Function} A new curried function.
	     * @example
	     *
	     *      var sliceFrom = R.invoker(1, 'slice');
	     *      sliceFrom(6, 'abcdefghijklm'); //=> 'ghijklm'
	     *      var sliceFrom6 = R.invoker(2, 'slice')(6);
	     *      sliceFrom6(8, 'abcdefghijklm'); //=> 'gh'
	     */
	    var invoker = _curry2(function invoker(arity, method) {
	        return curryN(arity + 1, function () {
	            var target = arguments[arity];
	            if (target != null && _isFunction(target[method])) {
	                return target[method].apply(target, _slice(arguments, 0, arity));
	            }
	            throw new TypeError(toString(target) + ' does not have a method named "' + method + '"');
	        });
	    });

	    /**
	     * Returns a string made by inserting the `separator` between each element and
	     * concatenating all the elements into a single string.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig String -> [a] -> String
	     * @param {Number|String} separator The string used to separate the elements.
	     * @param {Array} xs The elements to join into a string.
	     * @return {String} str The string made by concatenating `xs` with `separator`.
	     * @see R.split
	     * @example
	     *
	     *      var spacer = R.join(' ');
	     *      spacer(['a', 2, 3.4]);   //=> 'a 2 3.4'
	     *      R.join('|', [1, 2, 3]);    //=> '1|2|3'
	     */
	    var join = invoker(1, 'join');

	    /**
	     * Creates a new function that, when invoked, caches the result of calling `fn`
	     * for a given argument set and returns the result. Subsequent calls to the
	     * memoized `fn` with the same argument set will not result in an additional
	     * call to `fn`; instead, the cached result for that set of arguments will be
	     * returned.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Function
	     * @sig (*... -> a) -> (*... -> a)
	     * @param {Function} fn The function to memoize.
	     * @return {Function} Memoized version of `fn`.
	     * @example
	     *
	     *      var count = 0;
	     *      var factorial = R.memoize(n => {
	     *        count += 1;
	     *        return R.product(R.range(1, n + 1));
	     *      });
	     *      factorial(5); //=> 120
	     *      factorial(5); //=> 120
	     *      factorial(5); //=> 120
	     *      count; //=> 1
	     */
	    var memoize = _curry1(function memoize(fn) {
	        var cache = {};
	        return _arity(fn.length, function () {
	            var key = toString(arguments);
	            if (!_has(key, cache)) {
	                cache[key] = fn.apply(this, arguments);
	            }
	            return cache[key];
	        });
	    });

	    /**
	     * Splits a string into an array of strings based on the given
	     * separator.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category String
	     * @sig (String | RegExp) -> String -> [String]
	     * @param {String|RegExp} sep The pattern.
	     * @param {String} str The string to separate into an array.
	     * @return {Array} The array of strings from `str` separated by `str`.
	     * @see R.join
	     * @example
	     *
	     *      var pathComponents = R.split('/');
	     *      R.tail(pathComponents('/usr/local/bin/node')); //=> ['usr', 'local', 'bin', 'node']
	     *
	     *      R.split('.', 'a.b.c.xyz.d'); //=> ['a', 'b', 'c', 'xyz', 'd']
	     */
	    var split = invoker(1, 'split');

	    /**
	     * Finds the set (i.e. no duplicates) of all elements contained in the first or
	     * second list, but not both.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category Relation
	     * @sig [*] -> [*] -> [*]
	     * @param {Array} list1 The first list.
	     * @param {Array} list2 The second list.
	     * @return {Array} The elements in `list1` or `list2`, but not both.
	     * @see R.symmetricDifferenceWith, R.difference, R.differenceWith
	     * @example
	     *
	     *      R.symmetricDifference([1,2,3,4], [7,6,5,4,3]); //=> [1,2,7,6,5]
	     *      R.symmetricDifference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5,1,2]
	     */
	    var symmetricDifference = _curry2(function symmetricDifference(list1, list2) {
	        return concat(difference(list1, list2), difference(list2, list1));
	    });

	    /**
	     * Finds the set (i.e. no duplicates) of all elements contained in the first or
	     * second list, but not both. Duplication is determined according to the value
	     * returned by applying the supplied predicate to two list elements.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.19.0
	     * @category Relation
	     * @sig (a -> a -> Boolean) -> [a] -> [a] -> [a]
	     * @param {Function} pred A predicate used to test whether two items are equal.
	     * @param {Array} list1 The first list.
	     * @param {Array} list2 The second list.
	     * @return {Array} The elements in `list1` or `list2`, but not both.
	     * @see R.symmetricDifference, R.difference, R.differenceWith
	     * @example
	     *
	     *      var eqA = R.eqBy(R.prop('a'));
	     *      var l1 = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
	     *      var l2 = [{a: 3}, {a: 4}, {a: 5}, {a: 6}];
	     *      R.symmetricDifferenceWith(eqA, l1, l2); //=> [{a: 1}, {a: 2}, {a: 5}, {a: 6}]
	     */
	    var symmetricDifferenceWith = _curry3(function symmetricDifferenceWith(pred, list1, list2) {
	        return concat(differenceWith(pred, list1, list2), differenceWith(pred, list2, list1));
	    });

	    /**
	     * Determines whether a given string matches a given regular expression.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.12.0
	     * @category String
	     * @sig RegExp -> String -> Boolean
	     * @param {RegExp} pattern
	     * @param {String} str
	     * @return {Boolean}
	     * @see R.match
	     * @example
	     *
	     *      R.test(/^x/, 'xyz'); //=> true
	     *      R.test(/^y/, 'xyz'); //=> false
	     */
	    var test = _curry2(function test(pattern, str) {
	        if (!_isRegExp(pattern)) {
	            throw new TypeError('\u2018test\u2019 requires a value of type RegExp as its first argument; received ' + toString(pattern));
	        }
	        return _cloneRegExp(pattern).test(str);
	    });

	    /**
	     * The lower case version of a string.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category String
	     * @sig String -> String
	     * @param {String} str The string to lower case.
	     * @return {String} The lower case version of `str`.
	     * @see R.toUpper
	     * @example
	     *
	     *      R.toLower('XYZ'); //=> 'xyz'
	     */
	    var toLower = invoker(0, 'toLowerCase');

	    /**
	     * The upper case version of a string.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.9.0
	     * @category String
	     * @sig String -> String
	     * @param {String} str The string to upper case.
	     * @return {String} The upper case version of `str`.
	     * @see R.toLower
	     * @example
	     *
	     *      R.toUpper('abc'); //=> 'ABC'
	     */
	    var toUpper = invoker(0, 'toUpperCase');

	    /**
	     * Returns a new list containing only one copy of each element in the original
	     * list, based upon the value returned by applying the supplied function to
	     * each list element. Prefers the first item if the supplied function produces
	     * the same value on two items. `R.equals` is used for comparison.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.16.0
	     * @category List
	     * @sig (a -> b) -> [a] -> [a]
	     * @param {Function} fn A function used to produce a value to use during comparisons.
	     * @param {Array} list The array to consider.
	     * @return {Array} The list of unique items.
	     * @example
	     *
	     *      R.uniqBy(Math.abs, [-1, -5, 2, 10, 1, 2]); //=> [-1, -5, 2, 10]
	     */
	    var uniqBy = _curry2(function uniqBy(fn, list) {
	        var set = new _Set();
	        var result = [];
	        var idx = 0;
	        var appliedItem, item;
	        while (idx < list.length) {
	            item = list[idx];
	            appliedItem = fn(item);
	            if (set.add(appliedItem)) {
	                result.push(item);
	            }
	            idx += 1;
	        }
	        return result;
	    });

	    /**
	     * Returns a new list containing only one copy of each element in the original
	     * list. `R.equals` is used to determine equality.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category List
	     * @sig [a] -> [a]
	     * @param {Array} list The array to consider.
	     * @return {Array} The list of unique items.
	     * @example
	     *
	     *      R.uniq([1, 1, 2, 1]); //=> [1, 2]
	     *      R.uniq([1, '1']);     //=> [1, '1']
	     *      R.uniq([[42], [42]]); //=> [[42]]
	     */
	    var uniq = uniqBy(identity);

	    /**
	     * Combines two lists into a set (i.e. no duplicates) composed of those
	     * elements common to both lists.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig [*] -> [*] -> [*]
	     * @param {Array} list1 The first list.
	     * @param {Array} list2 The second list.
	     * @return {Array} The list of elements found in both `list1` and `list2`.
	     * @see R.intersectionWith
	     * @example
	     *
	     *      R.intersection([1,2,3,4], [7,6,5,4,3]); //=> [4, 3]
	     */
	    var intersection = _curry2(function intersection(list1, list2) {
	        var lookupList, filteredList;
	        if (list1.length > list2.length) {
	            lookupList = list1;
	            filteredList = list2;
	        } else {
	            lookupList = list2;
	            filteredList = list1;
	        }
	        return uniq(_filter(flip(_contains)(lookupList), filteredList));
	    });

	    /**
	     * Combines two lists into a set (i.e. no duplicates) composed of the elements
	     * of each list.
	     *
	     * @func
	     * @memberOf R
	     * @since v0.1.0
	     * @category Relation
	     * @sig [*] -> [*] -> [*]
	     * @param {Array} as The first list.
	     * @param {Array} bs The second list.
	     * @return {Array} The first and second lists concatenated, with
	     *         duplicates removed.
	     * @example
	     *
	     *      R.union([1, 2, 3], [2, 3, 4]); //=> [1, 2, 3, 4]
	     */
	    var union = _curry2(compose(uniq, _concat));

	    var R = {
	        F: F,
	        T: T,
	        __: __,
	        add: add,
	        addIndex: addIndex,
	        adjust: adjust,
	        all: all,
	        allPass: allPass,
	        always: always,
	        and: and,
	        any: any,
	        anyPass: anyPass,
	        ap: ap,
	        aperture: aperture,
	        append: append,
	        apply: apply,
	        applySpec: applySpec,
	        assoc: assoc,
	        assocPath: assocPath,
	        binary: binary,
	        bind: bind,
	        both: both,
	        call: call,
	        chain: chain,
	        clamp: clamp,
	        clone: clone,
	        comparator: comparator,
	        complement: complement,
	        compose: compose,
	        composeK: composeK,
	        composeP: composeP,
	        concat: concat,
	        cond: cond,
	        construct: construct,
	        constructN: constructN,
	        contains: contains,
	        converge: converge,
	        countBy: countBy,
	        curry: curry,
	        curryN: curryN,
	        dec: dec,
	        defaultTo: defaultTo,
	        difference: difference,
	        differenceWith: differenceWith,
	        dissoc: dissoc,
	        dissocPath: dissocPath,
	        divide: divide,
	        drop: drop,
	        dropLast: dropLast,
	        dropLastWhile: dropLastWhile,
	        dropRepeats: dropRepeats,
	        dropRepeatsWith: dropRepeatsWith,
	        dropWhile: dropWhile,
	        either: either,
	        empty: empty,
	        eqBy: eqBy,
	        eqProps: eqProps,
	        equals: equals,
	        evolve: evolve,
	        filter: filter,
	        find: find,
	        findIndex: findIndex,
	        findLast: findLast,
	        findLastIndex: findLastIndex,
	        flatten: flatten,
	        flip: flip,
	        forEach: forEach,
	        fromPairs: fromPairs,
	        groupBy: groupBy,
	        groupWith: groupWith,
	        gt: gt,
	        gte: gte,
	        has: has,
	        hasIn: hasIn,
	        head: head,
	        identical: identical,
	        identity: identity,
	        ifElse: ifElse,
	        inc: inc,
	        indexBy: indexBy,
	        indexOf: indexOf,
	        init: init,
	        insert: insert,
	        insertAll: insertAll,
	        intersection: intersection,
	        intersectionWith: intersectionWith,
	        intersperse: intersperse,
	        into: into,
	        invert: invert,
	        invertObj: invertObj,
	        invoker: invoker,
	        is: is,
	        isArrayLike: isArrayLike,
	        isEmpty: isEmpty,
	        isNil: isNil,
	        join: join,
	        juxt: juxt,
	        keys: keys,
	        keysIn: keysIn,
	        last: last,
	        lastIndexOf: lastIndexOf,
	        length: length,
	        lens: lens,
	        lensIndex: lensIndex,
	        lensPath: lensPath,
	        lensProp: lensProp,
	        lift: lift,
	        liftN: liftN,
	        lt: lt,
	        lte: lte,
	        map: map,
	        mapAccum: mapAccum,
	        mapAccumRight: mapAccumRight,
	        mapObjIndexed: mapObjIndexed,
	        match: match,
	        mathMod: mathMod,
	        max: max,
	        maxBy: maxBy,
	        mean: mean,
	        median: median,
	        memoize: memoize,
	        merge: merge,
	        mergeAll: mergeAll,
	        mergeWith: mergeWith,
	        mergeWithKey: mergeWithKey,
	        min: min,
	        minBy: minBy,
	        modulo: modulo,
	        multiply: multiply,
	        nAry: nAry,
	        negate: negate,
	        none: none,
	        not: not,
	        nth: nth,
	        nthArg: nthArg,
	        objOf: objOf,
	        of: of,
	        omit: omit,
	        once: once,
	        or: or,
	        over: over,
	        pair: pair,
	        partial: partial,
	        partialRight: partialRight,
	        partition: partition,
	        path: path,
	        pathEq: pathEq,
	        pathOr: pathOr,
	        pathSatisfies: pathSatisfies,
	        pick: pick,
	        pickAll: pickAll,
	        pickBy: pickBy,
	        pipe: pipe,
	        pipeK: pipeK,
	        pipeP: pipeP,
	        pluck: pluck,
	        prepend: prepend,
	        product: product,
	        project: project,
	        prop: prop,
	        propEq: propEq,
	        propIs: propIs,
	        propOr: propOr,
	        propSatisfies: propSatisfies,
	        props: props,
	        range: range,
	        reduce: reduce,
	        reduceBy: reduceBy,
	        reduceRight: reduceRight,
	        reduceWhile: reduceWhile,
	        reduced: reduced,
	        reject: reject,
	        remove: remove,
	        repeat: repeat,
	        replace: replace,
	        reverse: reverse,
	        scan: scan,
	        sequence: sequence,
	        set: set,
	        slice: slice,
	        sort: sort,
	        sortBy: sortBy,
	        split: split,
	        splitAt: splitAt,
	        splitEvery: splitEvery,
	        splitWhen: splitWhen,
	        subtract: subtract,
	        sum: sum,
	        symmetricDifference: symmetricDifference,
	        symmetricDifferenceWith: symmetricDifferenceWith,
	        tail: tail,
	        take: take,
	        takeLast: takeLast,
	        takeLastWhile: takeLastWhile,
	        takeWhile: takeWhile,
	        tap: tap,
	        test: test,
	        times: times,
	        toLower: toLower,
	        toPairs: toPairs,
	        toPairsIn: toPairsIn,
	        toString: toString,
	        toUpper: toUpper,
	        transduce: transduce,
	        transpose: transpose,
	        traverse: traverse,
	        trim: trim,
	        tryCatch: tryCatch,
	        type: type,
	        unapply: unapply,
	        unary: unary,
	        uncurryN: uncurryN,
	        unfold: unfold,
	        union: union,
	        unionWith: unionWith,
	        uniq: uniq,
	        uniqBy: uniqBy,
	        uniqWith: uniqWith,
	        unless: unless,
	        unnest: unnest,
	        until: until,
	        update: update,
	        useWith: useWith,
	        values: values,
	        valuesIn: valuesIn,
	        view: view,
	        when: when,
	        where: where,
	        whereEq: whereEq,
	        without: without,
	        wrap: wrap,
	        xprod: xprod,
	        zip: zip,
	        zipObj: zipObj,
	        zipWith: zipWith
	    };
	  /* eslint-env amd */

	  /* TEST_ENTRY_POINT */

	  if (true) {
	    module.exports = R;
	  } else if (typeof define === 'function' && define.amd) {
	    define(function() { return R; });
	  } else {
	    this.R = R;
	  }

	}.call(this));


/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ }
/******/ ]);