Things = new Meteor.Collection("things");
Boards = new Meteor.Collection("boards");

if (Meteor.is_client) {
  Template.board.current_board = function() {
    return Boards.findOne() || {title: 'Loading...', message: 'Please wait'};
  }

  Template.board.things = function () {
    return Things.find({});
  };

  Template.thing.selected = function () {
    return Session.equals("selected_thing", this._id) ? 'selected' : '';
  };

  Template.board_editor.val = function() {
    return Template.board.current_board()[Session.get("selected_board_attribute")];
  }

  Template.board.selected_thing = function () {
    return Things.findOne(Session.get("selected_thing"));
  };

  Template.board.selected_board_attribute = function () {
    return Session.get("selected_board_attribute");
  };

  Template.thing.events = {
    'click': function (e) {
      e.stopPropagation();
      Session.set("selected_thing", this._id);
      Session.set("selected_board_attribute", null);
    }
  };

  Template.board.events = {
    'click #board': function(e) {
      Session.set("selected_thing", null);
    },
    'click .editable': function(e) {
      Session.set("selected_thing", null);
      Session.set("selected_board_attribute", e.currentTarget.id);
    },
    'click #update_thing': function(e) {
      Things.update(Session.get("selected_thing"), {name: $('#name').val(), status: $('#status').val() });
      Session.set("selected_thing", null);
    },
    'click #update_board': function(e) {
      updated = {}
      updated[Session.get("selected_board_attribute")] = $('#txt').val();
      Boards.update(Template.board.current_board()._id, {$set: updated});
      Session.set("selected_board_attribute", null);
    }
  }
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Things.find().count() === 0) {
      var names = ["Dr. Bobbins",
                   "Mr. Cutthroat",
                   "Nurse Naughty"];
      for (var i = 0; i < names.length; i++) {
        Things.insert({name: names[i], status: Math.floor(Math.random()*10).toString() + " minutes late"});
      }
      Boards.remove({});
      Boards.insert({ title: 'Cardiology Clinic', message: 'The lift is broken at the moment.'});
    }
  });
}