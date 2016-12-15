'use strict';

var glob = require('glob');
var express = require('express');
var lasso = require('lasso');
var port = process.env.PORT || 8081;
var find = require('./find-components');
var indexTemplate = require('marko').load(require.resolve('./index.marko'));
var componentTemplate = require('marko').load(require.resolve('./component.marko'));
var components = find(process.cwd());

lasso.configure({
  plugins: [
    'lasso-less', // Allow Less files to be rendered to CSS
    'lasso-marko' // Allow Marko templates to be compiled and transported to the browser
  ],
  outputDir: __dirname + '/static', // Place all generated JS/CSS/etc. files into the "static" dir
  bundlingEnabled: false, // Only enable bundling in production
  minify: false, // Only minify JS and CSS code in production
  fingerprintsEnabled: false // Only add fingerprints to URLs in production
});

var app = express();
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function rootHandler(req, res) {
	indexTemplate.render({ components }, res);
});
    
components.forEach(component => {
  var name = component.name;
  var renderer = component.renderer;
  var fixtures = component.fixtures;
  var fixtureNames = Object.keys(fixtures);
  
  renderer = typeof renderer === 'function' ? renderer : renderer.renderer || renderer.render.bind(renderer);
  
  app.get('/'+component.path, (req, res) => {
    var fixtureName = req.query.fixture || 'default';
    var fixture = fixtures[fixtureName] || fixtures[Object.keys(fixtures)[0]] || {};
    
    var data = {
      name,
      renderer,
      fixture,
      fixtureName,
      fixtureNames,
      components
    };
    
    componentTemplate.render(data, res);
  });
  
  
});


app.listen(port, function() {
  console.log("Starting component server on port " + port + "...");
});

module.exports = app;
