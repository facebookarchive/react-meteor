react-meteor
============

This repository defines a Meteor package that automatically integrates the
[React](http://facebook.github.io/react/) rendering framework on both the
client and the server, to complement or replace the default Handlebars
templating system.

The React core is officially agnostic about how you fetch and update your
data, so it is far from obvious which approach is the best. This package
provides one answer to that question (use Meteor!), and I hope you will
find it a compelling combination.

Quick start
-----------

If you have not yet installed Meteor, do that:
```
curl https://install.meteor.com | /bin/sh
```

Clone this repository:
```
git clone https://github.com/reactjs/react-meteor.git
```

Fire up one of the examples:
```
cd react-meteor/examples/leaderboard
meteor
```

Finally, visit [localhost:3000](http://localhost:3000) in your browser.
For extra fun, try using the example in multiple browser windows!

Adding the package to your app
------------------------------

The officially recommended way to add this package to your app is simply
to execute the following commands:
```
cd path/to/my-app/
meteor add reactjs:react
```

How it works
------------

The package exposes a special `ReactMeteor.Mixin` object that can be used
to enable reactive data fetching for your React components.

To add the `ReactMeteor.Mixin` to a React component, simply include it in
the `mixins` class property:
```js
var MyComponent = React.createClass({
  mixins: [ReactMeteor.Mixin],

  startMeteorSubscriptions: function() {
    Meteor.subscribe("players");
  },

  // Make sure your component implements this method.
  getMeteorState: function() {
    return {
      playerCount: Players.find().count(),
      ...
    };
  }
});
```

The `startMeteorSubscriptions` method is optional, and should be
implemented when the component needs to subscribe to specific query sets
using [`Meteor.subscribe`](http://docs.meteor.com/#/full/meteor_subscribe)
It will be called in a `Tracker.autorun` callback, so the subscriptions
will be canceled automatically when the component is unmounted.

The `getMeteorState` method should return an object of properties that
will be merged into `this.state`, for easy access in the component's
`render` method or elsewhere.  Dependencies will be tracked for any data
accessed by `getMeteorState` so that the component can be automatically
re-rendered whenever the data changes.

Alternatively, if you prefer not to declare `mixins` explicitly, you can
create the class with `ReactMeteor.createClass`:
```js
var MyComponent = ReactMeteor.createClass({
  startMeteorSubscriptions: function() {
    Meteor.subscribe("players");
  },

  // Make sure your component implements this method.
  getMeteorState: function() {
    return {
      playerCount: Players.find().count(),
      ...
    };
  }
});
```
