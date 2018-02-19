Right Track Agency (Abstract)
=============================

**node module:** [right-track-agency](https://www.npmjs.com/package/right-track-agency)  
**GitHub repo:** [right-track/right-track-agency](https://github.com/right-track/right-track-agency)

---

This is an abstract **Right Track Agency**.  This module provides the abstract 
`RightTrackAgency` class which is extended by an implementing Right Track Agency.

The abstract class provides the functionality for reading agency configuration 
files and setting the configuration properties.

This module also includes the **Station Feed** Classes: `StationFeed`, `StationFeedDeparture`, and
`StationFeedDepartureStatus`, which are all required when an Agency implements the real-time
Station Feed functionality.

### Documentation

Documentation can be found in the **/doc/** directory of this repository 
or online at [https://docs.righttrack.io/right-track-agency](https://docs.righttrack.io/right-track-agency).

### Supported Agencies

The following are Right Track Agencies that implement this abstract class:

- [Metro North Railroad & SLE (mnr)](https://github.com/right-track/right-track-agency-mnr)
- [Long Island Rail Road (lirr)](https://github.com/right-track/right-track-agency-lirr)

### Configuration

When a `RightTrackAgency` class is instantiated it will read the agency's default 
configuration file (`agency.json` located in the root of the agency's module 
directory).

#### Get Agency Configuration

To get the agency configuration use the `getConifg()` function.  The configuration 
will have a structure similar to: 

```
{
  "name": "Long Island Rail Road",
  "id": "lirr",
  "maintainer": {
    "name": "David Waring",
    "email": "dev@davidwaring.net",
    "website": "https://www.davidwaring.net/"
  },
  "db": {
    "location": "./static/db/latest/database.db",
    "archiveDir": "./static/db/archive/"
  },
  "stationFeed": {
    "stationURL": "http://traintime.lirr.org/traintime.php?startsta={{ORIGIN_ID}}&endsta={{DESTINATION_ID}}",
    "gtfsrt": {
      "url": "https://mnorth.prod.acquia-sites.com/wse/LIRR/gtfsrt/realtime/{{GTFS_RT_API_KEY}}/json",
      "apiKey": ""
    }
  },
  "static": {
    "img": {
      "icon": "./static/img/icon.png"
    }
  },
  "build": {
    "updateURL": "http://web.mta.info/developers/data/lirr/google_transit.zip"
  },
  "colors": {
    "primary": "#0f47a1",
    "primaryText": "#dddddd",
    "secondary": "#ffd54f",
    "secondaryText": "#263238"
  }
}
```

#### Additional Configuration

To provide additional configuration variables, or to override the default ones, 
create a new configuration file with the variables to add: 

```json
{
    "db": {
        "location": "/new/path/to/database.db"
    },
    "stationFeed": {
        "gtfsrt": {
            "apiKey": "your-mta-api-key"
        }
    }
}
```
Then, use the `readConfig(configFile)` to parse the configuration file and 
merge its properties with those already loaded.

The `configFile` path can be an absolute or relative path, with relative 
paths loaded relative to the root of the agency's module directory.

Any relative paths in the configuration file will be loaded relative to the 
directory the new configuration file is located in.

### Station Feed

A **Station Feed** provides a list of scheduled departures from a single Stop
combined with agency-specific real-time information, such as departure 
status and/or track numbers.

To load an agency-specific `StationFeed`, use the `loadFeed(db, origin, callback)` 
function where:
- `db` is the agency's RightTrackDB
- `origin` is the origin Stop
- `callback` is a callback function: `function(err, feed)` 
    - accepting an `Error` and `StationFeed` as arguments.

See the Documentation for more information on the structure of a `StationFeed`.


### Example

The following example uses the [right-track-agency-mnr](https://github.com/right-track/right-track-agency-mnr) 
module, which is the Metro North Railroad implementation of a `RightTrackAgency`.

```javascript
const MNR = require('right-track-agency-mnr');
const RightTrackDB = require('right-track-db-sqlite3');
const core = require('right-track-core');

// Load an additional configuration file
// This path is relative to the agency's module directory
MNR.readConfig('./path/to/config.json');

// Create a RightTrackDB for this Agency
let db = new RightTrackDB(MNR);

// Query the Database for Stop with id = '1'
core.query.stops.getStop(db, '1', function(err, stop) {
  
  // Load the agency's StationFeed for this Stop
  MNR.loadFeed(db, stop, function(err, feed) {
    
    // Do something with the station feed
    console.log(feed);
    
  });
  
});
```