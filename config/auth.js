// credits to https://scotch.io/tutorials/easy-node-authentication-facebook

// expose our config directly to our application using module.exports

module.exports = {

    'facebookAuth' : {
        'clientID'      : '144650462535441', // App ID
        'clientSecret'  : 'a834ebb5cf4307cc332051557e44e60e', // App Secret
        'callbackURL'   : '/auth/facebook/callback',
        'profileFields' : ['id', 'email', 'name']
    },

};