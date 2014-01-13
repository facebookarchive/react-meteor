Package.describe({
  summary: "React rendering for Meteor apps"
});

var reactToolsVersion = "0.8.0";

Npm.depends({
  "react-tools": reactToolsVersion
});

Package._transitional_registerBuildPlugin({
  name: "compileJSX",
  use: [],
  sources: [
    'plugin/compile-jsx.js'
  ],
  npmDependencies: {
    "react-tools": reactToolsVersion
  }
});

Package.on_use(function(api) {
  // Standard distribution of React, same version as react-tools.
  api.add_files("vendor/react-" + reactToolsVersion + ".js", "client");

  // On the server, we use the modules that ship with react-tools.
  api.add_files("src/require-react.js", "server");
  api.export("React", "server");

  // Meteor-enabled components should include this mixin via
  // React.createClass({ mixins: [ReactMeteor.Mixin], ... }).
  api.add_files("src/ReactMeteor.js", ["server", "client"]);
  api.export("ReactMeteor", ["server", "client"]);
});
