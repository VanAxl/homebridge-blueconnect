class BlueToken {
  identityId;
  token;
  credentials;
  constructor(identity_id, token, credentials) {
    this.identityId = identity_id;
    this.token = token;
    this.credentials = credentials;
  }
}

class BlueCredentials {
  access_key;
  secret_key;
  session_token;
  expiration;

  constructor(access_key, secret_key, session_token, expiration) {
    this.access_key = access_key;
    this.secret_key = secret_key;
    this.session_token = session_token;
    this.expiration = expiration;
  }
}
module.exports = { BlueToken, BlueCredentials }