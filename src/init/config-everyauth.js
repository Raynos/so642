var everyauth = require("everyauth"),
    rest = require("../../node_modules/everyauth/lib/restler.js"),
    url = require("url"),
    users = require("../model/users.js");

var User = new users();

function createGoogle() {

    var google = everyauth.oauth2.submodule('google2')
      .configurable({
          scope: "URL identifying the Google service to be accessed. See the documentation for the API you'd like to use for what scope to specify. To specify more than one scope, list each one separated with a space."
      })

      .oauthHost('https://accounts.google.com')
      .apiHost('https://www.google.com/m8/feeds')

      .authPath('/o/oauth2/auth')
      .authQueryParam('response_type', 'code')

      .accessTokenPath('/o/oauth2/token')
      .accessTokenParam('grant_type', 'authorization_code')
      .accessTokenHttpMethod('post')
      .postAccessTokenParamsVia('data')

      .entryPath('/auth/google')
      .callbackPath('/auth/google/callback')

      .authQueryParam('scope', function () {
        return this._scope && this.scope();
      })

      .authCallbackDidErr( function (req) {
        var parsedUrl = url.parse(req.url, true);
        return parsedUrl.query && !!parsedUrl.query.error;
      })

      .handleAuthCallbackError( function (req, res) {
        var parsedUrl = url.parse(req.url, true)
          , errorDesc = parsedUrl.query.error + "; " + parsedUrl.query.error_description;
        if (res.render) {
          res.render('auth-fail.jade', {
            errorDescription: errorDesc
          });
        } else {
          // TODO Replace this with a nice fallback
          throw new Error("You must configure handleAuthCallbackError if you are not using express");
        }
      })
      .convertErr( function (data) {
        return new Error(data.data.match(/H1>(.+)<\/H1/)[1]);
      })

      .fetchOAuthUser( function (accessToken) {
        var promise = this.Promise();
        rest.get(this.apiHost() + '/contacts/default/full', {
          query: { oauth_token: accessToken, alt: 'json' }
        }).on('success', function (data, res) {
          var oauthUser = data.feed.author;
          promise.fulfill(oauthUser);
        }).on('error', function (data, res) {
          promise.fail(data);
        });
        return promise;
      });

      Object.defineProperty(everyauth, "google2", {
        get: function () {
            var mod = google
            // Make `everyauth` accessible from each auth strategy module
            if (!mod.everyauth) mod.everyauth = this;
            if (mod.shouldSetup)
              this.enabled["google2"] = mod;
            return mod;
          }
      });

}

module.exports = function(app) {
  everyauth.debug = true;

    everyauth.everymodule
        .findUserById(function(id, cb) {
            User.getR(id, function(err, user) {
                user.id = id;
                user.userLink = "/users/" + user.id + "/" + user.name
                cb(err, user);
            });
        });

  everyauth.github
    .appId(process.env.githubId)
    .appSecret(process.env.githubSecret)
    .findOrCreateUser(function(session, token, tokenExtra, github) {
            var p = this.Promise();
            User.getUserByEmail(github.email, function(err, user) {
                if (user.length === 0) {
                    User.create({
                        name: github.name,
                        email: github.email,
                        gravatar_hash: github.gravatar_id
                    }, function(err, id) {
                        User.getR(id, function(err, res) {
                            p.fulfill(res);
                        });
                    });  
                } else {
                    var obj = user[0].value;
                    obj.id = user[0].id
                    p.fulfill(obj);
                }
            });
            return p;
    })
    .redirectPath('/');

    createGoogle();

    everyauth.google2
        .appId(process.env.googleId)
        .appSecret(process.env.googleSecret)
        .scope('http://www.google.com/m8/feeds/')
        .findOrCreateUser(function(session, _, _, google) {
            var p = this.Promise();
            User.getUserByEmail(google[0].email.$t, function(err, user) {
                if (user.length === 0) {
                    User.create({
                       name: google[0].name.$t,
                       email: google[0].email.$t
                    }, function(err, id) {
                        User.getR(id, function(err, res) {
                            p.fulfill(res);
                        });
                    });  
                } else {
                    var obj = user[0].value;
                    obj.id = user[0].id
                    p.fulfill(obj);
                }
            });
            return p;
        })
        .redirectPath('/');


    everyauth.helpExpress(app);
}