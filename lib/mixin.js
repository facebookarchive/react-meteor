MeteorMixin = {
  componentWillMount: function() {
    var component = this;
    component._meteorComputation = Deps.autorun(function() {
      component.setState(component.getMeteorState());
    });
  },

  componentWillUnmount: function() {
    this._meteorComputation.stop();
    delete this._meteorComputation;
  }
};
