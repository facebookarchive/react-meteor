Package.describe({
  summary: "React rendering for Meteor apps"
});

var reactVersion = "0.12.2";

Npm.depends({
  "react": reactVersion,
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

Package.on_use(function(api) {
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
