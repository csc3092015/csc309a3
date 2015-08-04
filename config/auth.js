// credits to https://scotch.io/tutorials/easy-node-authentication-facebook

// expose our config directly to our application using module.exports

module.exports = {

    'facebookAuth' : {
        'clientID'      : '120921368250837', // App ID
        'clientSecret'  : 'ed1c152c6414233f0b5094bb0ab50364', // App Secret
        'callbackURL'   : '/auth/facebook/callback',
        'profileFields' : ['id', 'email', 'name']
    },

};