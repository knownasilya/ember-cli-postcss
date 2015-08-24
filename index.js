var postcss = require('broccoli-postcss');
var Funnel = require('broccoli-funnel');
var checker = require('ember-cli-version-checker');

// PostCSSPlugin constructor
function PostCSSPlugin (options) {
  this.name = 'ember-cli-postcss';
  this.options = options;
}

PostCSSPlugin.prototype.toTree = function (tree, inputPath, outputPath, inputOptions) {
  return new Funnel(postcss(tree, this.options), {
    srcDir: inputPath,
    destDir: '/',
    getDestinationPath: function() {
      return inputOptions.outputPaths.app;
    }
  });
};

module.exports = {
  name: 'Ember CLI Postcss',
  shouldSetupRegistryInIncluded: function() {
    return !checker.isAbove(this, '0.2.0');
  },
  included: function included (app) {
    this.app = app;
    // Initialize options if none were passed
    var options = app.options.postcssOptions || {};

    // Set defaults if none were passed
    options.map = options.map || {};
    options.plugins = options.plugins || [];

    // Add to registry and pass options
    app.registry.add('css', new PostCSSPlugin(options));

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry);
    }
  }
};
