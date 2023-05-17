const {
    loginHandler
} = require('./handler');


const routes = [
    {
        method: 'POST',
        path : '/login',
        handler: loginHandler,
    },
];

module.exports = routes;