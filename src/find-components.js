var fs = require('fs');
var path = require('path');
var walk = require('fs-walker');

require('marko/node-require').install();

module.exports = function find(searchDirectory) {
	var componentDirectories = getComponentDirectories(searchDirectory);
	var components = [];

	componentDirectories.forEach(directory => {
		fs.readdirSync(directory).forEach(name => {
			var fullpath = path.join(directory, name);
			if(fs.statSync(fullpath).isDirectory()) {
				var renderer = getComponentRenderer(fullpath);
				var fixtures = getComponentFixtures(fullpath);
				if(renderer) {
					components.push({
						name,
						directory:root(searchDirectory, directory),
						path:root(searchDirectory, fullpath),
						renderer:require(renderer),
						fixtures:fixtures
					});
				}
			}
		});
	});
	
	console.log(components);
	
	return components;
};

function root(root, file) {
	if(file) {
		return file.replace(root, '').replace(/^(\/|\\)/, '');
	}
}

function getComponent(name, fullpath) {
	return {
		name:name,
		fullpath:fullpath,
		renderer:getComponentRenderer(fullpath)
	}
}

function getComponentRenderer(directory) {
	try {
		return require.resolve(directory);
	} catch(e) {
		try {
			return require.resolve(path.join(directory, 'renderer.js'));
		} catch(e) {
			try {
				return require.resolve(path.join(directory, 'template.marko'));
			} catch(e) {
				return;
			}
		}
	}
}

function getComponentFixtures(directory) {
	var fixturesDir = path.join(directory, 'test', 'fixtures');
	var fixtures = {};
	if(fs.existsSync(fixturesDir)) {
		fs.readdirSync(fixturesDir).forEach(file => {
			if(/\.json$/.test(file)) {
				fixtures[file.replace(/\.json$/, '')] = require(path.join(fixturesDir, file));
			}
		});
	}
	return fixtures;
}

function getComponentDirectories(directory) {
	var componentDirectories = [];
	
	walk.all.sync(directory).forEach((stats) => {
		if(stats.fullname.replace(directory, '').includes('node_modules')) return;
		if(stats.fullname.replace(directory, '').includes('static')) return;
		
		if(stats.name === 'components' && stats.isDirectory()) {
			if(!fs.existsSync(path.join(path.dirname(stats.fullname), 'marko.json'))) {
				componentDirectories.push(stats.fullname);
			}
		}
		if(stats.name === 'marko.json' && stats.isFile()) {
			var config = require(stats.fullname);
			var directory = path.dirname(stats.fullname);
			var tagsDirs = [].concat(config['tags-dir'] || []);
			
			tagsDirs.forEach(tagsDir => componentDirectories.push(path.resolve(directory, tagsDir)));
		}
	});
		
	return dedupe(componentDirectories);
}

function dedupe(array) {
	var found = {};
	return array.filter(item => {
		var existed = found[item];
		found[item] = true;
		return !existed;
	});
}