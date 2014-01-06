React = Npm.require("react-tools").React;

// We use RAF batching since meteor may trigger callbacks all over the
// place. This isn't strictly required but is more performant. Perhaps we
// don't want to take this dependency.
Npm.require('react-raf-batching').inject();
