Package.describe({
  name: "luma:react",
  summary: "React rendering for Meteor apps",
  version: "1.0.0",
  git: "https://github.com/LumaPictures/react-meteor"
});

var reactVersion = "0.11.2";

Npm.depends({
  "react": reactVersion,
  "react-addons": "0.9.0"
});

Package._transitional_registerBuildPlugin({
  name: "compileJSX",
  use: [],
  sources: [
    'plugin/compile-jsx.js'
  ],
  npmDependencies: {
    "react": reactVersion,
    "react-tools": reactVersion
  }
});

Package.onUse(function(api) {
  if (api.versionsFrom)
    api.versionsFrom('METEOR@0.9.0');

  // Standard distribution of React, same version as react-tools.
  api.add_files("vendor/react-" + reactVersion + ".js", "client");

  // On the server, we use the modules that ship with react.
  api.add_files("src/require-react.js", "server");
  api.export("React", "server");

  // Meteor-enabled components should include this mixin via
  // React.createClass({ mixins: [ReactMeteor.Mixin], ... }).
  api.add_files("src/ReactMeteor.js", ["server", "client"]);
  api.export("ReactMeteor", ["server", "client"]);
});
