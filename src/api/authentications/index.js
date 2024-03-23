const AuthenticationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "authentications",
  version: "2.0.0",
  register: async (
    server,
    { authenticationService, userService, tokenManager, validator }
  ) => {
    const authenticatHandler = new AuthenticationsHandler(
      authenticationService,
      userService,
      tokenManager,
      validator
    );
    server.route(routes(authenticatHandler));
  },
};
