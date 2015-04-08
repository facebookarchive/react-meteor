var path = Npm.require("path");
var url = Npm.require("url");

var src = path.join(
  url.parse(process.env.ROOT_URL).path,
  "packages",
  "reactjs_react",
  "vendor",
  process.env.NODE_ENV === "production"
    ? "react-with-addons-0.13.0.min.js"
    : "react-with-addons-0.13.0.js"
);

if (path.sep !== "/") {
  // On Windows, path.sep === "\\", so we must convert to /.
  src = src.split(path.sep).join("/");
}

Inject.rawHead('react', '<script src="' + src + '"></script>');
