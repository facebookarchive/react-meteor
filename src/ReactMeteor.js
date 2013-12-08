var React = require('react');

var ReactMeteorMixin = {
  _handleMeteorChange: function() {
    this.setState({meteor: this.getMeteorState()});
  },

  _cancelComputation: function() {
    this._meteorComputation.stop();
    this._meteorComputation = null;
  },

  componentWillMount: function() {
    this._meteorComputation = Deps.autorun(this._handleMeteorChange);
  },

  componentDidUpdate: function(prevProps, prevState) {
    // When a component updates we should re-run all of our subscriptions if
    // they have changed. However, data coming back from Meteor will also trigger
    // this, so make sure that we don't get into an infinite loop by checking
    // for this state.
    if (this.state.meteor === prevState.meteor) {
      this._cancelComputation();
      // TODO: what if this runs in the same tick?
      this._meteorComputation = Deps.autorun(this._handleMeteorChange);
    }
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