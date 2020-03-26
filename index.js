'use strict';
const Path = require("path");
const Package = require('./package.json');
const Hoek = require('@hapi/hoek');

exports.register = function (plugin, options, next) {

    const assetDirPath = Path.join(__dirname,  Path.sep + 'assets');
    const templateDirPath = Path.join(__dirname,  Path.sep + 'templates');
    const shortName =  'form';

    let theme = {
        'name': Package.name,
        'version': Package.version,
        'shortName': shortName,
        'templatesPath': templateDirPath,
        'partialsPath': templateDirPath + Path.sep + 'withPartials',
        'helpersPath': templateDirPath + Path.sep + 'helpers',
        'indexPage': true,
        'groupPages': false,
        'itemPages': false,
        'assetPath': assetDirPath,
        'cssLinks': [
            '/waypointer/assets/' + shortName + '/css/form.css',
            '/waypointer/assets/' + shortName + '/css/pure-min.css',
            '/waypointer/assets/' + shortName + '/css/tomorrow.min.css',
            '/waypointer/assets/' + shortName + '/css/codemirror.css'
        ],
        'jsLinks': [
            '/waypointer/assets/' + shortName + '/js/form.js',
            '/waypointer/assets/' + shortName + '/js/highlight.min.js',
            '/waypointer/assets/' + shortName + '/js/es6-promise.js',
            '/waypointer/assets/' + shortName + '/js/fetch.js',
            '/waypointer/assets/' + shortName + '/js/beautify.js',
            '/waypointer/assets/' + shortName + '/js/codemirror.js',
            '/waypointer/assets/' + shortName + '/js/javascript.js'
        ]
    }


    if(Hoek.reach(Package, 'repository.url')){
        theme.url = Hoek.reach(Package, 'repository.url');
    }
    if(Hoek.reach(Package, 'license')){
        theme.license = Hoek.reach(Package, 'license');
    }

    next( theme );
}
