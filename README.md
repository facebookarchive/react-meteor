meteor-react
============

This repository defines a Meteor package that automatically integrates the
[React](http://facebook.github.io/react/) rendering framework on both the
client and the server, to complement or replace the default Handlebars
templating system. React components have access to a special `MeteorMixin`
that enables reactive data fetching.

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
git clone https://github.com/benjamn/meteor-react.git
```

Fire up one of the examples:
```
cd meteor-react/examples/leaderboard
meteor
```

Finally, visit [localhost:3000](http://localhost:3000) in your browser.

Adding the package to your app
------------------------------

Although the Meteor package API is deliberately undocumented and remains
in flux before v1.0, here is how I currently recommend adding this package
to your Meteor app:
```
cd path/to/my-app/
echo react >> .meteor/packages
git clone https://github.com/benjamn/meteor-react.git packages/react
```

If you want to share the package between multiple apps, you can clone it
to a common location and make `packages/react` a symbolic link.
