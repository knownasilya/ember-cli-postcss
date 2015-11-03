var PostcssCompiler = require('broccoli-postcss');
var mergeTrees = require('broccoli-merge-trees');
var merge = require('merge');
var path = require('path');
var checker = require('ember-cli-version-checker');

// PostcssPlugin constructor
function PostcssPlugin (optionsFn) {
  this.name = 'ember-cli-postcss';
  this.optionsFn = optionsFn;
}

PostcssPlugin.prototype.toTree = function (tree, inputPath, outputPath, inputOptions) {
  var inputTrees = [tree];
  var options = merge({}, this.optionsFn(), inputOptions);

  if (options.includePaths) {
    inputTrees = inputTrees.concat(this.options.includePaths);
  }

  var plugins = options.plugins;
  var map = options.map;

  var ext = options.extension || 'css';
  var paths = options.outputPaths;
  var trees = Object.keys(paths).map(function(file) {
    var input = path.join(inputPath, file + '.' + ext);
    var output = paths[file];
    return new PostcssCompiler(inputTrees, input, output, plugins, map);
  });

  return mergeTrees(trees);
};

module.exports = {
  name: 'Ember CLI Postcss',

  shouldSetupRegistryInIncluded: function() {
    return !checker.isAbove(this, '0.2.0');
  },

  included: function included(app) {
    this.app = app;
    // Initialize options if none were passed
    var options = app.options.postcssOptions || {};

    // Set defaults if none were passed
    options.map = options.map || {};
    options.plugins = options.plugins || [];
    options.inputFile = options.inputFile || 'app.css';
    options.outputFile = options.outputFile || this.project.name() + '.css';

    // Add to registry and pass options
    app.registry.add('css', new PostcssPlugin(options));

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry);
    }
  }
};
