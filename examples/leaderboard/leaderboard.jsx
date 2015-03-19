/**
 * Port of the leaderboard example to use React for rendering.
 *
 * This directive is necessary to enable preprocessing of JSX tags:
 * @jsx React.DOM
 */

var cx = React.addons.classSet;

// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".
Players = new Meteor.Collection("players");

Meteor.methods({
  addPoints: function(userId, points) {
    Players.update(userId, { $inc: { score: +points } });
  }
});

var Leaderboard = ReactMeteor.createClass({
  // Specifying a templateName property allows the component to be
  // interpolated into a Blaze template just like any other template:
  // {{> Leaderboard x=1 y=2}}. This corresponds to the JSX expression
  // <Leaderboard x={1} y={2} />.
  templateName: "Leaderboard",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("players");
  },

  getMeteorState: function() {
    var selectedPlayer = Players.findOne(Session.get("selected_player"));
    return {
      players: Players.find({}, {sort: {score: -1, name: 1}}).fetch(),
      selectedPlayer: selectedPlayer,
      selectedName: selectedPlayer && selectedPlayer.name
    };
  },

  addFivePoints: function() {
    Meteor.call("addPoints", Session.get("selected_player"), 5);
  },

  selectPlayer: function(id) {
    Session.set("selected_player", id);
  },

  renderPlayer: function(model) {
    var _id = this.state.selectedPlayer && this.state.selectedPlayer._id;

    return <Player
      key={model._id}
      name={model.name}
      score={model.score}
      className={model._id === _id ? "selected" : ""}
      onClick={this.selectPlayer.bind(this, model._id)}
    />;
  },

  render: function() {
    var children = [
      <div className="leaderboard">
        { this.state.players.map(this.renderPlayer) }
      </div>
    ];

    if (this.state.selectedName) {
      children.push(
        <div className="details">
          <div className="name">{this.state.selectedName}</div>
          <input
            type="button"
            className="inc"
            value="Give 5 points"
            onClick={this.addFivePoints}
          />
        </div>
      );

    } else {
      children.push(
        <div className="none">Click a player to select</div>
      );
    }

    return <div className="inner">{ children }</div>;
  }
});

var Player = React.createClass({
  render: function() {
    var { name, score, ...rest } = this.props;
    return <div {...rest} className={cx("player", rest.className)}>
      <span className="name">{name}</span>
      <span className="score">{score}</span>
    </div>;
  }
});

if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++) {
        Players.insert({
          name: names[i],
          score: Math.floor(Random.fraction()*10)*5
        });
      }
    }
  });

  Meteor.publish("players", function() {
    return Players.find();
  });
}
