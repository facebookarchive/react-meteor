/**
 * Port of the leaderboard example to use React for rendering.
 *
 * This directive is necessary to enable preprocessing of JSX tags:
 * @jsx React.DOM
 */

// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

var Leaderboard = React.createClass({
  mixins: [ReactMeteor.Mixin],

  getMeteorState: function() {
    var selectedPlayer = Players.findOne(Session.get("selected_player"));
    return {
      players: Players.find({}, {sort: {score: -1, name: 1}}).fetch(),
      selectedPlayer: selectedPlayer,
      selectedName: selectedPlayer && selectedPlayer.name
    };
  },

  addFivePoints: function() {
    Players.update(Session.get("selected_player"), {$inc: {score: 5}});
  },

  renderPlayer: function(model) {
    return <Player id={model._id} name={model.name} score={model.score} />;
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

    return <div>{ children }</div>;
  }
});

var Player = React.createClass({
  mixins: [ReactMeteor.Mixin],

  getMeteorState: function() {
    return {
      isSelected: Session.equals("selected_player", this.props.id)
    };
  },

  select: function() {
    Session.set("selected_player", this.props.id);
  },

  render: function() {
    var className = "player";
    if (this.state.isSelected) {
      className += " selected";
    }

    return (
      <div className={className} onClick={this.select}>
        <span className="name">{this.props.name}</span>
        <span className="score">{this.props.score}</span>
      </div>
    );
  }
});

if (Meteor.isClient) {
  Meteor.startup(function() {
    React.renderComponent(
      <Leaderboard />,
      document.getElementById("outer")
    );
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
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
