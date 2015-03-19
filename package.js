Package.describe({
  name: "reactjs:react",
  // TODO Consider using reactVersion here, since this version is a lot
  // less meaningful?
  version: "0.2.3",
  summary: "React rendering for Meteor apps",
  git: "https://github.com/reactjs/react-meteor/",
  documentation: "README.md"
});

var reactVersion = "0.13.0";

Npm.depends({
  "react": reactVersion,
});

Package.registerBuildPlugin({
  name: "compileJSX",
  use: [],
  sources: [
    "plugin/compile-jsx.js"
  ],
  npmDependencies: {
    "react-tools": reactVersion
  }
});

Package.onUse(function(api) {
  api.use("meteorhacks:inject-initial@1.0.2", "server");

  api.addFiles([
    "vendor/react-with-addons-" + reactVersion + ".js",
    "vendor/react-with-addons-" + reactVersion + ".min.js"
  ], "client", {
    isAsset: true
  });

  api.addFiles([
    // On the client, we inject a <script> tag to load the appropriate
    // version of React according to process.env.NODE_ENV.
    "src/inject-react.js",
    // On the server, we use the modules that ship with react.
    "src/require-react.js"
  ], "server");

  // This React variable is defined in src/require-react.js.
  api.export("React", "server");

  // Meteor-enabled components should include the ReactMeteor mixin via
  // React.createClass({ mixins: [ReactMeteor.Mixin], ... }) or just
  // ReactMeteor.createClass({ ... }).
  api.addFiles("src/ReactMeteor.js", ["server", "client"]);
  api.export("ReactMeteor", ["server", "client"]);
});

Package.onTest(function(api) {
  api.use("tinytest");
  api.use("reactjs:react");
  api.addFiles("react-tests.js");
});
