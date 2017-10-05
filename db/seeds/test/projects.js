const projectsData = [{
  id: 1,
  name: 'First_Project'
  palettes: [{
    name: 'Pretty Colors',
    color1: '#89A286',
    color2: '#5B1328',
    color3: '#5D4987',
    color4: '#D016A0',
    color5: '#3A127B',
    projectId: projectsData[0].id
  },
  {
    name: 'Second_Project',
    color1: '#73A9C9',
    color2: '#F00809',
    color3: '#0081E2',
    color4: '#E879C3',
    color5: '#B34805',
    projectId: projectData[0].id
  }]
},
{
  id: 1,
  name: 'Second_Project'
  palettes: [{
    name: 'Secondary Colors',
    color1: '#221494',
    color2: '#F00809',
    color3: '#7F0E39',
    color4: '#004BB3',
    color5: '#A96A87',
    projectId: projectsData[1].id
  },
  {
    name: 'Second_Project',
    color1: '#068AA1',
    color2: '#772E7B',
    color3: '#D0E38F',
    color4: '#C4E11B',
    color5: '#AF0F69',
    projectId: projectData[1].id
  }]
},
]

const createProject = (knex, project) => {
  return knex('projects').insert({
    id: project.id,
    name: project.name
  })
  .then(() => {
    let palettePromises = [];

    project.palettes.forEach(palette => {
      palettePromises.push(
        createPalette(knex, palette)
      )
    });

    return Promise.all(palettePromises)
  })
};

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
};

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = [];

      projectsData.forEach(project => {
        projectPromises.push(createProject(knex, project))
      });
      return Promise.all(projectPromises)
    })
    .then(() => console.log('Seeding is complete'))
    .catch(error => console.log(`Error seeding data: ${error}`))
};
