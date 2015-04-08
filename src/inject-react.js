var file = process.env.NODE_ENV === "production"
  ? "react-with-addons-0.13.0.min.js"
  : "react-with-addons-0.13.0.js";

var src = Npm.require("path").join(
  Npm.require("url").parse(process.env.ROOT_URL).path,
  "packages/reactjs_react/vendor/" + file
);

Inject.rawHead(
  'react',
  '<script src="' + src + '"></script>'
);
