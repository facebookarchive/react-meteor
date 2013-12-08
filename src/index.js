/** @jsx React.DOM */
var React = require('react');

React.renderComponentToString(<span />, function(s) {
  console.log(s);
});