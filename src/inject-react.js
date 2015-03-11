var file = process.env.NODE_ENV === "production"
  ? "react-with-addons-0.12.2.min.js"
  : "react-with-addons-0.12.2.js";

Inject.rawHead(
  'react',
  '<script src="/packages/reactjs_react/vendor/' + file + '"></script>'
);
