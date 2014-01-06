var ReactMeteorMixin = {
  _handleMeteorChange: function() {
    this.setState(this.getMeteorState());
  },

  _cancelComputation: function() {
    if (this._meteorComputation) {
      this._meteorComputation.stop();
      this._meteorComputation = null;
    }
  },

  componentWillMount: function() {
    var handler = this._handleMeteorChange.bind(this);
    this._meteorComputation = Deps.autorun(handler);
  },

  componentWillReceiveProps: function(nextProps) {
    var oldProps = this.props;
    this.props = nextProps;
    this._handleMeteorChange();
    this.props = oldProps;
  },

  componentWillUnmount: function() {
    this._cancelComputation();
  }
};

// TODO Remove this.
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

if (typeof exports === "object") {
  ReactMeteor = exports;
} else {
  ReactMeteor = {};
}

ReactMeteor.Mixin = ReactMeteorMixin;
ReactMeteor.createMeteorClass = createMeteorClass;
