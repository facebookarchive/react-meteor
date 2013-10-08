Package.describe({
  summary: "React rendering for Meteor apps"
});

var reactToolsVersion = "0.4.1";

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
  api.add_files("lib/require-react.js", "server");
  api.export("React", "server");

  // Meteor-enabled components should include this mixin via
  // React.createClass({ mixins: [MeteorMixin], ... }).
  api.add_files("lib/mixin.js", ["server", "client"]);
  api.export("MeteorMixin", ["server", "client"]);
});
