const passport = require("passport");
const axios = require("axios");
const boom = require("@hapi/boom");
const { OAuth2Strategy } = require("passport-oauth");

const { config } = require("../../../config");

const GOOGLE_AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/auth"
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

const oAuth2Strategy = new OAuth2Strategy(
  {
    authorizationURL: GOOGLE_AUTHORIZATION_URL,
    tokenURL: GOOGLE_TOKEN_URL,
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: "/auth/google-oauth/callback"
  },
  async function (accessToken, refreshToken, profile, cb) {

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/v1/auth/sign-provider`,
      method: "post",
      data: {
        first_name: profile.name,
        last_name: profile.family_name,
        user_name: profile.given_name,
        email: profile.email,
        password: profile.id,
        apiKeyToken: config.apiKeyToken
      }
    });

    if (!data || status !== 200) {
      return cb(boom.unauthorized(), false);
    }

    return cb(null, data);
  }
);

oAuth2Strategy.userProfile = function (accessToken, done) {
  this._oauth2.get(GOOGLE_USERINFO_URL, accessToken, (err, body) => {
    if (err) {
      return done(err);
    }

    try {
      const { sub, first_name, last_name, user_name, email } = JSON.parse(body);

      const profile = {
        id: sub,
        first_name,
        last_name,
        user_name,
        email
      };

      done(null, profile);
    } catch (parseError) {
      return done(parseError);
    }
  });
};

passport.use("google-oauth", oAuth2Strategy);