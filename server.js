
    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    mongoose.connect('mongodb://mariannemelhoos:db123@ds151917.mlab.com:51917/kokebok');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    app.set('port', (process.env.PORT || 8080));


    // define model =================
    var Recipe = mongoose.model('Recipe', {
        title : String,
        ingredients: String,
        description: String,
        meal: String,
        url: String, 
    });

    // routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all recipes
    app.get('/api/recipes', function(req, res) {

        // use mongoose to get all recipes in the database
        Recipe.find(function(err, recipes) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(recipes); // return all recipes in JSON format
        });
    });

    // create recipe and send back all recipes after creation
    app.post('/api/recipes', function(req, res) {

        // create a recipes, information comes from AJAX request from Angular
        Recipe.create({
            title : req.body.title,
            ingredients: req.body.ingredients,
            description : req.body.description,
            meal: req.body.meal,
            url: req.body.url,
            done : false
        }, function(err, recipe) {
            if (err)
                res.send(err);

            // get and return all the recipes after you create another
            Recipe.find(function(err, recipes) {
                if (err)
                    res.send(err)
                res.json(recipes);
            });
        });

    });

    // delete a recipe
    app.delete('/api/recipes/:recipe_id', function(req, res) {
        Recipe.remove({
            _id : req.params.recipe_id
        }, function(err, recipe) {
            if (err)
                res.send(err);

            // get and return all the recipes after you create another
            Recipe.find(function(err, recipes) {
                if (err)
                    res.send(err)
                res.json(recipes);
            });
        });
    });

    // get all recipes with filter
    app.get('/api/recipes/:recipe_meal', function(req, res) {

        // use mongoose to get all recipes in the database
        Recipe.find({
            meal: req.params.recipe_meal
        }, function(err, recipes) {
            if (err)
                res.send(err)

            res.json(recipes); // return all recipes in JSON format
        });
    });


    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });


    // listen (start app with node server.js) ======================================
    app.listen(app.get('port'), function() {
      console.log('Node app is running on port', app.get('port'));
    });