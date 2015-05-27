var ReactMeteorMixin = {
  componentWillMount: function() {
    var self = this;

    self._meteorStateDep = new Tracker.Dependency();
    self._meteorFirstRun = true;

    if (Meteor.isClient) {
      Tracker.autorun(function(computation) {
        self._meteorComputation = computation;
        self._meteorStateDep.depend();

        if (self.startMeteorSubscriptions) {
          // Calling this method in a Tracker.autorun callback will ensure
          // that the subscriptions are canceled when the computation stops.
          self.startMeteorSubscriptions();
        }

        enqueueMeteorStateUpdate(self);
      });

    } else {
      enqueueMeteorStateUpdate(self);
    }
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (this._meteorCalledSetState) {
      // If this component update was triggered by the ReactMeteor.Mixin,
      // then we do not want to trigger the change event again, because
      // that would lead to an infinite update loop.
      this._meteorCalledSetState = false;
      return;
    }

    if (this._meteorStateDep) {
      this._meteorStateDep.changed();
    }
  },

  componentWillUnmount: function() {
    if (this._meteorComputation) {
      this._meteorComputation.stop();
      this._meteorComputation = null;
    }
  }
};

function enqueueMeteorStateUpdate(component) {
  var partialState =
    component.getMeteorState &&
    component.getMeteorState();

  if (! partialState) {
    // The getMeteorState method can return a falsy value to avoid
    // triggering a state update.
    return;
  }

  if (component._meteorFirstRun) {
    // If it's the first time we've called enqueueMeteorStateUpdate since
    // the component was mounted, set the state synchronously.
    component._meteorFirstRun = false;
    component._meteorCalledSetState = true;
    component.setState(partialState);
    return;
  }

  Tracker.afterFlush(function() {
    component._meteorCalledSetState = true;
    component.setState(partialState);
  });
}

// Like React.render, but it replaces targetNode, and works even if
// targetNode.parentNode has children other than targetNode.
function renderInPlaceOfNode(reactElement, targetNode) {
  var container = targetNode.parentNode;
  var prevSibs = [];
  var nextSibs = [];
  var sibs = prevSibs;
  var child = container.firstChild;

  while (child) {
    if (child === targetNode) {
      sibs = nextSibs;
    } else {
      sibs.push(child);
    }
    var next = child.nextSibling;
    container.removeChild(child);
    child = next;
  }

  var result = React.render(reactElement, container);
  var rendered = container.firstChild;

  if (prevSibs.length > 0) {
    prevSibs.forEach(function(sib) {
      container.insertBefore(sib, rendered);
    });
  }

  if (nextSibs.length > 0) {
    nextSibs.forEach(function(sib) {
      container.appendChild(sib);
    });
  }

  return result;
}

function unmountComponent(reactComponent) {
  var rootNode = React.findDOMNode(reactComponent);
  var container = rootNode && rootNode.parentNode;

  if (container) {
    var siblings = [];
    var sibling = container.firstChild;

    while (sibling) {
      var next = sibling.nextSibling;
      if (sibling !== rootNode) {
        siblings.push(sibling);
        container.removeChild(sibling);
      }
      sibling = next;
    }

    React.unmountComponentAtNode(container);

    siblings.forEach(function (sib) {
      container.appendChild(sib);
    });
  }
}

ReactMeteor = {
  Mixin: ReactMeteorMixin,

  // So you don't have to mix in ReactMeteor.Mixin explicitly.
  createClass: function createClass(spec) {
    spec.mixins = spec.mixins || [];
    spec.mixins.push(ReactMeteorMixin);
    var Cls = React.createClass(spec);

    if (Meteor.isClient &&
        typeof Template === "function" &&
        typeof spec.templateName === "string") {
      var template = new Template(
        spec.templateName,
        function() {
          // A placeholder HTML element that will serve as the mounting
          // point for the React component. May have siblings!
          return new HTML.SPAN;
        }
      );

      template.onRendered(function() {
        this._reactComponent = renderInPlaceOfNode(
          // Equivalent to <Cls {...this.data} />:
          React.createElement(Cls, this.data || {}),
          this.find("span")
        );
      });

      template.onDestroyed(function() {
        unmountComponent(this._reactComponent);
      });

      Template[spec.templateName] = template;
    }

    return Cls;
  }
};
