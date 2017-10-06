// Here we are requiring express and then starting the server
const express = require('express');
const app = express();

// Here we are requiring bodyParser which we npm installed earlier
// In order to parse the body of our HTML request.
const bodyParser = require('body-parser');

// Here we are setting up our environment, in this case, our 'development' environment.
const environment = process.env.NODE_ENV || 'development';

// From our environment, we fetch the database configuration from the knexfile.js.
// As a result, our express app is able to connect to it.
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

// Here we are requiring the path in order to use it later to tell Express
// what directory our static files are in.
const path = require('path');

// App.use means this function is used on every endpoint.  bodyParser parses
// the body of the HTML request.  urlencoded also supports HTML forms.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// This is used to serve static files like our index.html and styling.
// We are telling it to look into the public directory and chains it
// to the root path.  It is common practice to call the foler that contains
// the HTML, CSS, and JS in a public folder.
app.use(express.static(path.join(__dirname, "public")));

// We are setting it to either the port that the environment is on
// or on port 3000 if the developer is using localhost:3000.
// If this app is deployed on something like Heroku, then
// the port most likely will be something different.  In this case,
// process.env.PORT will store the port number because it is a variable
app.set('port', process.env.PORT || 3000);

// Here we are creating an endpoint to get information from the database.
// The end point is projects. It is common practice to have v1 in here
// in case there are future versions.  Because we are not specifying
// which particular project we want, we will get all of the projects from
// the database.
app.get('/api/v1/projects', (request, response) => {

  // This returns a promise, which then returns an array of all the projects
  // we've added to the database. Upon successful request, we will receive a
  // status code of 200 along with the array of projects.  If something goes
  // wrong with the server, then we receive a status code of 500 and an object
  // explaining what the error is.
  database('projects').select()
    .then(project => response.status(200).json(project))
    .catch(error => response.status(500).json({error}));
});

// Here we are creating an endpoint to get information from the database.
// This time the end point is palettes.  As said previously, it is common
// practice to have v1 in here in case there are future versions.  Because
// we are not specifying which particular project we want, we will get all
// of the palettes from the database.
app.get('/api/v1/palettes', (request, response) => {

  // This will return a promise which then returns an array of all the palettes
  // we've added to the database.  Like before, upon successful request, we
  // will receive a status code of 200 along with the array of palettes.  If
  // the server is down or something isn't working, then we will receive a 500
  // status code with an object including the error.
  database('palettes').select()
    .then(palette => response.status(200).json(palette))
    .catch(error => response.status(500).json({error}));
});

// This time we are doing a POST request in order to add something to the
// projects database.  In this situation, we are trying to add a project
// to the projects database.  This is the endpoint for that.
app.post('/api/v1/projects', (request, response) => {
  // Here we are creating a variable for the body of the request to send
  // to the database later.
  const name = request.body;

  // We are implementing error handling here in case the developer did not
  // pass through the correct paramters.  Its checking to see if the request's
  // body has a name property.  If not, a status code of 422 will be sent backgroundColor
  // along with a message explaining exactly what needs to be sent in order to have a
  // successful request.
  if(!name.name) {
    return response.status(422)
      .send({ error: `Expected format: { name: <String> }. You're missing a name property.` });
  }

  // If all goes well, the request's body is sent to the projects database, and
  // will send back a status code of 201 that also returns the project we sent.
  // The status code 201 means that we successfully posted the new project.
  //  If the server is down, then a status code of 500 along with an error object
  // expalining what the error is.
  database('projects').insert(name, '*')
    .then(project => response.status(201).json(project))
    .catch(error => response.status(500).json({error}));
});


// Here we are doing another POST request in order to add a pallette to the
// database.  This is the endoint for that.
app.post('/api/v1/palettes', (request, response) => {
  // Palette is the variable that is storing the body of the request.
  const palette = request.body;
  // Here we have an array of the required parameters needed in order to send
  // a request successfully.  We will loop through these down below and checking
  // to make sure the request's body includes all of these parameters.
  const keys = ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'projectId']

  // Here we are looping through the keys and checking to see if the request body
  // has all of the parameters. If one of them is missing, a status code of 422
  // would be returned along with a message showing exactly how the format should be,
  // and specifically which property is missing from the response.
  for(let requiredParameter of keys) {
  if (!palette[requiredParameter]) {
    return response.status(422)
      .send({ error: `Expected format: { name: <String>, color1: <String>, 'color2': <String>, 'color3': <String>, 'color4': <String>, 'color5', 'projectId': <Integer> }. You're missing a ${requiredParameter} property.` });
    }
  }

  // If all goes well, the body of the request is sent to the palettes database,
  // returning a 201 status code along with body returned back(object) returned
  // back.  If the server is down, a 500 status code is sent along with an object
  // containing the error.
  database('palettes').insert(palette, '*')
    .then(palette => response.status(201).json(palette))
    .catch(error => response.status(500).json({error}));
});


// Finally, our last method is to DELETE specific palette.  We create a dynamic
// route using :id so that any id can be passed through.
app.delete('/api/v1/palettes/:id', (request, response) => {
  // Here a variable is created for the parameters of the request.
  const id = request.params;

  // This checks the database and finds where id is and then remove it.  If it
  // cannot be found, a status code of 422 is sent along with an error saying
  // that it could be not found.  If it is found, a status of 204 is sent back.
  // If the server is down, then a status code of 500 is sent.
  database('palettes').where(id).del()
    .then(deleted => !deleted ? response.status(422).json({error: "Could not be found."}) : response.sendStatus(204))
    .catch(error => response.status(500).json({error}));
});

// Here the app is listening to whatever port it is on for connections.
// Ports can include 3000 from localhost of if it is published on something
// like Heroku, then it is most likely something else.
app.listen(app.get('port'), () => {
  console.log(`Palette Picker is running on ${app.get('port')}.`);
});

// Here we are exporting the app, mainly for testing reasons.
// If not done, you would get an error saying app.address is not
// a function.
module.exports = app;
