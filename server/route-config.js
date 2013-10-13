var routes = require('./routes');

exports.configureRoutes = function(app){
	app.get('/', routes.index);
};
