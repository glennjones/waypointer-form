# waypointer-plain

## IN DEVELOPMENT - API NOT STABLE

A plain html theme for the waypointer API auto documentation tool.

![Image of the hub ui](https://raw.githubusercontent.com/glennjones/waypointer-plain/master/ui/plain-ui01.png)

````bash
$ npm install waypointer-plain
```

``` javascript
const Waypointer = require('waypointer');

let options = {
    'swagger': {... a swagger json onject}
    'themes': [{
        theme: require('waypointer-plain')
    }]
}

waypointer.json( options, (err, waypointer) => {
     // do something with json
});

options.dist = 'a path for dist folder';

waypointer.buildDist( options, (err, waypointer) => {
     // do something when dist is built
});
```

## TODO
* Add images of interface
* Add description of parent project
* Add grunt to to concat the js and css files
* Add media queries - the orginal layout is designed for desktop
* Add documentation of the key features in templates
* Add documentation of forking the project and reuse of templates


## Issues
If you find any issue please file here on github and I will try and fix them.