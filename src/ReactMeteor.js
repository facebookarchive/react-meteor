var ReactMeteorMixin = {
  componentWillMount: function() {
    var self = this;
    self._meteorStateDep = new Tracker.Dependency();

    Tracker.autorun(function(computation) {
      self._meteorComputation = computation;
      self._meteorStateDep.depend();

      if (self.startMeteorSubscriptions) {
        // Calling this method in a Tracker.autorun callback will ensure
        // that the subscriptions are canceled when the computation stops.
        self.startMeteorSubscriptions();
      }

      if (self.getMeteorState) {
        self.setState(self.getMeteorState());
      }
    });
  },

  componentWillReceiveProps: function(nextProps) {
    var oldProps = this.props;
    this.props = nextProps;
    this._meteorStateDep.changed();
    Tracker.flush();
    this.props = oldProps;
  },

  componentWillUnmount: function() {
    if (this._meteorComputation) {
      this._meteorComputation.stop();
      this._meteorComputation = null;
    }
  }
};

ReactMeteor = {
  Mixin: ReactMeteorMixin,

  // So you don't have to mix in ReactMeteor.Mixin explicitly.
  createClass: function createClass(spec) {
    spec.mixins = spec.mixins || [];
    spec.mixins.push(ReactMeteorMixin);
    return React.createClass(spec);
  }
};
