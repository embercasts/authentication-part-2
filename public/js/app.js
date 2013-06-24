App = Ember.Application.create();


// Routes
App.Router.map(function() {
  this.route('articles');
  this.route('photos');
  this.route('login');
});

App.LoginRoute = Ember.Route.extend({
  setupController: function(controller, context) {
    controller.reset();
  }
});

App.AuthenticatedRoute = Ember.Route.extend({

  beforeModel: function(transition) {
    if (!this.controllerFor('login').get('token')) {
      this.redirectToLogin(transition);
    }
  },

  redirectToLogin: function(transition) {
    alert('You must log in!');

    var loginController = this.controllerFor('login');
    loginController.set('attemptedTransition', transition);
    this.transitionTo('login');
  },

  getJSONWithToken: function(url) {
    var token = this.controllerFor('login').get('token');
    return $.getJSON(url, { token: token });
  },

  events: {
    error: function(reason, transition) {
      if (reason.status === 401) {
        this.redirectToLogin(transition);
      } else {
        alert('Something went wrong');
      }
    }
  }
});

App.ArticlesRoute = App.AuthenticatedRoute.extend({
  model: function() {
    return this.getJSONWithToken('/articles.json');
  }
});

App.PhotosRoute = App.AuthenticatedRoute.extend({
  model: function() {
    return this.getJSONWithToken('/photos.json');
  }
});


// Controllers
App.LoginController = Ember.Controller.extend({

  reset: function() {
    this.setProperties({
      username: "",
      password: "",
      errorMessage: ""
    });
  },

  token: localStorage.token,
  tokenChanged: function() {
    localStorage.token = this.get('token');
  }.observes('token'),

  login: function() {

    var self = this, data = this.getProperties('username', 'password');

    // Clear out any error messages.
    this.set('errorMessage', null);

    $.post('/auth.json', data).then(function(response) {

      self.set('errorMessage', response.message);
      if (response.success) {
        alert('Login succeeded!');
        self.set('token', response.token);

        var attemptedTransition = self.get('attemptedTransition');
        if (attemptedTransition) {
          attemptedTransition.retry();
          self.set('attemptedTransition', null);
        } else {
          // Redirect to 'articles' by default.
          self.transitionToRoute('articles');
        }
      }
    });
  }
});