var file = process.env.NODE_ENV === "production"
  ? "react-with-addons-0.13.0.min.js"
  : "react-with-addons-0.13.0.js";

Inject.rawHead(
  'react',
  '<script src="/packages/reactjs_react/vendor/' + file + '"></script>'
);
