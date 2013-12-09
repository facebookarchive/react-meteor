var React = require('react');

// We use RAF batching since meteor may trigger callbacks all over the place.
// This isn't strictly required but is more performant. Perhaps we don't
// want to take this dependency.
require('react-raf-batching').inject();

var ReactMeteorMixin = {
  _handleMeteorChange: function(cb) {
    this.setState({meteor: this.getMeteorState()}, cb);
  },

  _cancelComputation: function() {
    this._meteorComputation.stop();
    this._meteorComputation = null;
  },

  componentWillMount: function() {
    this._meteorComputation = Deps.autorun(this._handleMeteorChange.bind(this, null));
    this._realReplaceState = this.replaceState;
    this.replaceState = this._replaceState;
  },

  _replaceState: function(newState, cb) {
    if (this.state.meteor === newState.meteor) {
      this.state = newState;
      this._cancelComputation();
      this._meteorComputation = Deps.autorun(this._handleMeteorChange.bind(this, cb));
    } else {
      this._realReplaceState(newState, cb);
    }
  },

  componentWillReceiveProps: function(nextProps) {
    var oldProps = this.props;
    this.props = nextProps;
    this._handleMeteorChange(null);
    this.props = oldProps;
  },

  componentWillUnmount: function() {
    this._cancelComputation();
  }
};

function createMeteorClass(spec) {
  spec.mixins = spec.mixins || [];
  spec.mixins.push(ReactMeteorMixin);

  var originalGetInitialState = spec.getInitialState || function() {
    return {};
  };

  spec.getInitialState = function() {
    var state = originalGetInitialState();
    state.meteor = {};
    return state;
  };

  return React.createClass(spec);
}

var ReactMeteor = {
  Mixin: ReactMeteorMixin,
  createMeteorClass: createMeteorClass
};

module.exports = ReactMeteor;