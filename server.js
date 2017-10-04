const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.set('port', process.env.PORT || 3000);

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(project => response.status(200).json(project))
    .catch(error => response.status(500).json({error}));
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palette => response.status(200).json(palette))
    .catch(error => response.status(500).json({error}));
});

app.post('/api/v1/projects', (request, response) => {
  const name = request.body;

  if(!name.name) {
    return response.status(422)
      .send({ error: `Expected format: { name: <String> }. You're missing a name property.` });
  }

  database('projects').insert(name, '*')
    .then(project => response.status(201).json(project))
    .catch(error => response.status(500).json({error}));
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  const keys = ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'projectId']

  for(let requiredParameter of keys) {
  if (!palette[requiredParameter]) {
    return response.status(422)
      .send({ error: `Expected format: { name: <String>, color1: <String>, 'color2': <String>, 'color3': <String>, 'color4': <String>, 'color5', 'projectId': <Integer> }. You're missing a ${requiredParameter} property.` });
    }
  }

  database('palettes').insert(palette, '*')
    .then(palette => response.status(201).json(palette))
    .catch(error => response.status(500).json({error}));
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const id = request.params;

  database('palettes').where(id).del()
    .then(deleted => !deleted ? response.status(422).json({error: "Could not be found."}) : response.sendStatus(204))
    .catch(error => response.status(500).json({error}));
});

app.listen(app.get('port'), () => {
  console.log(`Palette Picker is running on ${app.get('port')}.`);
});
