
/**
 * Module dependencies.
 */

var $ = require("zepto-component"),
    _ = require("underscore"),
    inherit = require("inherit"),
    Emitter = require("emitter"),
    overlay = require("zepto-overlay");

/**
 * Export alert.
 */

exports = module.exports = alert;

/**
 * Export Alert.
 */

exports.Alert = Alert;

/**
 * Return a new `Alert` with the given
 * (optional) `title` and `message`.
 * 
 * @param {String} title
 * @param {String} message
 * @param {Function} callback
 * @return {Alert}
 * @api public
 */

function alert(title, message, callback) {
  return new Alert({ title: title, message: message, callback: callback });
}

/**
 * Template function.
 */

var template = _.template(require("./template"));

/**
 * Initialize a new `Alert`.
 * 
 * Options:
 * 
 *   - `title` dialog title
 *   - `message` message
 *   - `callback` callback on clicking ok
 * 
 * @param {Object} options
 * @api public
 */

function Alert(opts) {
  opts = opts || {};
  _.bindAll(this, "onok");
  this.title = opts.title || "";
  this.message = opts.message || "";
  this.cb = opts.callback || function() {};
  this.$el = $(template({ title: this.title, message: this.message }));
  this.overlay = overlay();
  this.$(".zepto-alert-ok").on("click", this.onok);
}

/**
 * Inherit from `Emitter`.
 */

inherit(Alert, Emitter);

/**
 * Show the alert.
 * 
 * @return {Alert}
 * @api public
 */

Alert.prototype.show = function() {
  this.emit("show");
  this.overlay.show();
  this.$el.offset(this.offset());
  this.$el.appendTo("body");
  return this;
};

/**
 * Hide the alert.
 * 
 * @return {Alert}
 * @api public
 */

Alert.prototype.hide = function() {
  this.emit("hide");
  this.$el.remove();
  return this;
};

/**
 * Handle ok click
 * 
 * @param {Event} e
 * @api private
 */

Alert.prototype.onok = function(e) {
  e.preventDefault();
  this.cb();
  this.hide();
};

/**
 * Query element from `this.$el` context.
 * 
 * @param {String} selector
 * @return {ZeptoObject}
 * @api private
 */

Alert.prototype.$ = function(selector) {
  return $(selector, this.$el);
};

/**
 * Calculate middle position offset.
 * 
 * @return {Object} top and left
 * @api private
 */

Alert.prototype.offset = function() {
  var win = $(window);
  return {
    top: win.height() / 2 - this.$el.height() / 2,
    left: win.width() / 2 - this.$el.width() / 2
  };
};
