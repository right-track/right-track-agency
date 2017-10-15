Right Track Agency (Abstract)
=============================

#### node module: [right-track-agency](https://www.npmjs.com/package/right-track-agency)

---

This is an abstract **Right Track Agency**.  This module provides the abstract 
`RightTrackAgency` class which is extended by an implementing Right Track Agency.

The abstract class provides the functionality for reading agency configuration 
files and setting the configuration properties.

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
    name: 'Metro North Railroad & SLE',
    id: 'mnr',
    maintainer: { 
        name: 'David Waring',
        email: 'dev@davidwaring.net',
        website: 'https://www.davidwaring.net/' 
    },
    db: { 
        location: '/right-track-agency-mnr/static/db/latest/database.db',
        archiveDir: '/right-track-agency-mnr/static/db/archive/' 
    },
    stationFeed: { 
        stationURL: 'http://as0.mta.info/mnr/mstations/station_status_display.cfm?P_AVIS_ID={{STATUS_ID}}',
        gtfsrt: { 
            url: 'http://mnorth.prod.acquia-sites.com/wse/gtfsrtwebapi/v1/gtfsrt/{{GTFS_RT_API_KEY}}/getfeed',
            apiKey: '' 
        }
    },
    static: { 
        img: { 
            icon: '/right-track-agency-mnr/static/img/icon.png' 
        } 
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

A `StationFeed` provides a list of scheduled departures from a single Stop 
combined with agency-specific real-time information, such as departure 
status and/or track numbers.

To load an agency-specific `StationFeed`, use the `loadFeed(db, origin, callback)` 
function where:
- `db` is the agency's RightTrackDB
- `origin` is the origin Stop
- `callback` is a callback function: `function(err, feed)` 
    - accepting an `Error` and `StationFeed` as arguments.

See additional documentation from the [right-track-core](https://github.com/right-track/right-track-core) 
module for more information on the structure of a `StationFeed` 
([https://docs.righttrack.io/right-track-core/StationFeed.html](https://docs.righttrack.io/right-track-core/StationFeed.html)).


### Example

The following example uses the [right-track-agency-mnr](https://github.com/right-track/right-track-agency-mnr) 
module, which is the Metro North Railroad implementation of a `RightTrackAgency`.

```javascript
const MNR = require('right-track-agency-mnr');
const RightTrackDB = require('right-track-db-sqlite3');
const core = require('right-track-core');

// Create a new instance of the Right Track Agency
// The default configuration file is loaded
let mnr = new MNR();

// Load an additional configuration file
// This path is relative to the agency's module directory
mnr.readConfig('./path/to/config.json');

// Get the agency configuration
let config = mnr.getConfig();

// Create a RightTrackDB with the agency configuration
let db = new RightTrackDB(config.id, config.db.location);

// Query the Database for Stop with id = '1'
core.query.stops.getStop(db, '1', function(err, stop) {
  
  // Load the agency's StationFeed for this Stop
  mnr.loadFeed(db, stop, function(err, feed) {
    
    // Do something with the station feed
    console.log(feed);
    
  });
  
});
```