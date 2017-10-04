const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.get('/api/projects', (request, response) => {
  database('projects').select()
    .then(project => response.status(200).json(project))
    .catch(error => response.status(500).json({error}));
})

app.get('/api/palettes', (request, response) => {
  database('palettes').select()
    .then(palette => response.status(200).json(palette))
    .catch(error => response.status(500).json({error}));
})

app.post('/api/projects', (request, response) => {
  const { projectName } = request.body;

  database('projects').insert({projectName}, '*')
    .then(project => response.status(201).json(project))
    .catch(error => response.status(500).json({error}))
})

app.post('/api/palettes', (request, response) => {
  const { paletteName, colors, projectId } = request.body;
  const palettes = {
    paletteName,
    paletteColor1: colors[0],
    paletteColor2: colors[1],
    paletteColor3: colors[2],
    paletteColor4: colors[3],
    paletteColor5: colors[4],
    projectId
  }

  database('palettes').insert(palettes, '*')
  .then(palette => response.status(201).json(palette))
  .catch(error => response.status(500).json({error}))
})

app.delete('/colorPalettes', (request, response) => {
  response.sendStatus(200)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
