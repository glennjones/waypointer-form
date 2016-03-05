'use strict';
const Path = require("path");
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Blipp = require('blipp');
const Good = require('good');
const Hoek = require('Hoek');
const WaypointerJSON = require('../bin/waypointer.json');
const Theme = require('../index.js');
const Handlebars = require('handlebars');
const HandlebarsHalpers = require('handlebars-helpers')({
  handlebars: Handlebars
});



const assetDirPath = Path.join(__dirname, '..' + Path.sep + 'assets');
const templateDirPath = Path.join(__dirname, '..' + Path.sep + 'templates');


const goodOptions = {
    reporters: [{
        reporter: require('good-console'),
        events: { log: '*', response: '*' }
    }]
};


let server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3016,
    routes: { cors: true }
});



server.register([
    Inert,
    Vision,
    Blipp,
    {
        register: Good,
        options: goodOptions
    }], (err) => {

        server.start((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Server running at:', server.info.uri);
            }
        });
    });


// add templates with paths
// the paths are for testing, within the theme they may be different
server.views({
    engines: {
        html: {
            module: Handlebars
        }
    },
    path: templateDirPath,
    partialsPath: templateDirPath + Path.sep + 'withPartials',
    helpersPath: templateDirPath + Path.sep + 'helpers',
    isCached: false,
    compileOptions: {preventIndent: true}
});


// function to get theme data as it would be provide if we used code as plug-in
const getThemeData = function(server, option, callback){
    Theme.register(server, {}, (theme) => {
       // delete those items which would not be pass into template context
        delete theme.templatePath;
        delete theme.partialsPath;
        delete theme.halpersPath;
        delete theme.groupPages;
        delete theme.groupItemPages;
        delete theme.assetPath;

        callback(null, theme);
    });
}



server.route([{
    method: 'GET',
    path: '/',
    config: {
        handler: (request, reply) => {
            reply.redirect('/waypointer/form');
        }
    }
},{
    method: 'GET',
    path: '/waypointer/form',
    config: {
        handler: (request, reply) => {
            getThemeData(request.server, {}, (err,theme) => {
                let out = Hoek.clone(WaypointerJSON);
                out.theme = theme;
                out.theme.pathRoot = '/waypointer/form'
                reply.view('form-index.html', out);
            });
        }
    }
},{
    method: 'GET',
    path: '/waypointer.json',
    config: {
        handler: (request, reply) => {
            getThemeData(request.server,{}, (err,theme) => {
                let out = Hoek.clone(WaypointerJSON);
                out.theme = theme;
                reply(out).type('application/json; charset=utf-8');
            });
        }
    }
},{
    method: 'GET',
    path: '/waypointer/assets/form/{path*}',
    handler: {
        directory: {
            path: assetDirPath,
            listing: false,
            index: true
        }
    }
}]);


