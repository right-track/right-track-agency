'use strict';


const config = require('@dwaring87/config');
const path = require('path');

/**
 * ### `RightTrackAgency` Abstract Class
 * This abstract class is implemented by various Right Track Agencies which
 * provide the agency-specific configuration information and real-time status
 * information.
 *
 * The abstract class handles the agency configuration properties and the
 * reading of additional agency configuration files.  An implementation
 * of this class should override the feed-related functions to provide
 * a real-time Station Feed.
 * @class
 * @abstract
 */
class RightTrackAgency {

  /**
   * Abstract class constructor.  The implementing agency should call this
   * constructor: `super(moduleDirectory)` in order to read the default
   * agency configuration and set the initial configuration properties.
   *
   * This will set the following properties, which are accessible from the
   * implementing agency's Class:
   * - `moduleDirectory` = the root of the agency's module directory
   * - `config` = the agency's configuration (the default configuration
   * or the default merged with an additional configuration if `readConfig`
   * is used).
   * - `id` = the agency id code
   * - `name` = the agency's full name
   * @param {string} moduleDirectory The full path to the root of the agency's
   * module directory.  This is where relative paths to configuration files
   * will be relative to.
   */
  constructor(moduleDirectory) {

    // Prevent the abstract class from being instantiated
    if (new.target === RightTrackAgency) {
      throw new TypeError("Cannot instantiate an abstract RightTrackAgency class.  You must use a specific RightTrackAgency implementation.");
    }

    // Set Agency Module Directory
    this._moduleDirectory = moduleDirectory;

    // Setup Config
    this._config = new config(path.normalize(this._moduleDirectory + '/agency.json'));

  }


  // ==== CLASS MEMBERS ==== //

  /**
   * The Agency's id code
   * @returns {string|undefined}
   */
  get id() {
    if ( this.config !== undefined ) {
      return this.config.id;
    }
    return undefined;
  }

  /**
   * The Agency's full name
   * @returns {string|undefined}
   */
  get name() {
    if ( this.config !== undefined ) {
      return this.config.name;
    }
    return undefined;
  }

  /**
   * The Agency's module directory
   * @returns {string}
   */
  get moduleDirectory() {
    return path.normalize(this._moduleDirectory);
  }

  /**
   * The Agency's configuration properties
   * @returns {object}
   */
  get config() {
    return this._config.get();
  }


  // ==== CONFIGURATION ==== //

  /**
   * Reset the agency configuration to the default values
   */
  resetConfig() {
    this._config.reset();
  }

  /**
   * Read an additional agency configuration file
   * @param {string} configFile Path to agency configuration file.  Relative
   * paths will be relative to the root of the agency's module directory.
   */
  readConfig(configFile) {
    if ( !path.isAbsolute(configFile) ) {
      configFile = path.normalize(this.moduleDirectory + '/' + configFile);
    }
    this._config.read(configFile);
  }

  /**
   * Get the agency configuration
   * @returns {object} Agency configuration
   */
  getConfig() {
    return this.config;
  }


  // ==== STATION FEED ==== //

  /**
   * Check if the Agency supports real-time Station Feeds.
   *
   * This will return false by default unless the implementing agency overrides
   * the function to indicate support for Station Feeds.
   * @returns {boolean} true if the agency has implemented Station Feeds
   * @abstract
   */
  isFeedSupported() {
    return false;
  }

  /**
   * Load the Agency's Station Feed for the specified Origin Stop.
   *
   * This function will need to be overridden by the implementing agency.
   * @param {RightTrackDB} db The Right Track DB to query
   * @param {Stop} origin The origin Stop
   * @param {function} callback Callback function
   * @param {Error} callback.error Station Feed Error.  The Error's message will be
   * a pipe (`|`) separated string in the format of: `Error Code|Error Type|Error Message`
   * that will be parsed out by the **Right Track API Server** into a more specific
   * error Response.
   * @param {StationFeed} [callback.feed] The built `StationFeed` for the Stop
   * @abstract
   */
  loadFeed(db, origin, callback) {
    return callback(new Error("4051|Station Feed Not Supported|This agency (" + this.config.name + ") does not support real-time Station Feeds"));
  }

}



module.exports = RightTrackAgency;