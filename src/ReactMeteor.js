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
    this._meteorComputation = Deps.autorun(this._handleMeteorChange);
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

// So you don't have to mix in ReactMeteor.Mixin explicitly.
function createClass(spec) {
  spec.mixins = spec.mixins || [];
  spec.mixins.push(ReactMeteorMixin);
  return React.createClass(spec);
}

if (typeof exports === "object") {
  ReactMeteor = exports;
} else {
  ReactMeteor = {};
}

ReactMeteor.Mixin = ReactMeteorMixin;
ReactMeteor.createClass = createClass;
