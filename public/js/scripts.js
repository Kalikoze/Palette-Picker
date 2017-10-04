const ranColors = () => {
  $('.colors').each((i, color) => {
    const randomColor = "#000000".replace(/0/g,() => {
      return (~~(Math.random()*16)).toString(16)
    });
    if (!$(color).hasClass('locked')) {
       $(color).css('backgroundColor', randomColor)
       $(color).text(randomColor.toUpperCase())
    }
  })
}

const appendProject = (name, id) => {
  $('.projects').prepend(`
    <section class='project ${id}'>
      <p>${name}</p>
    </section>
  `)
  $('select').append(`
    <option value='${id}'>${name}</option>
  `)
}

const getProjects = () => {
  fetch('/api/v1/projects').then(response => response.json())
    .then(data => data.forEach(project => appendProject(project.name, project.id)))
    .catch(error => console.log(error))
}

const postProject = (name) => {
  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({name}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
    .then(data => data[0].id ? appendProject(name, data[0].id) : null)
    .catch(error => console.log(error))
}

const createProject = () => {
  const projectValue = $('#create-project').val()
  postProject(projectValue)
  $('#create-project').val('')
}

const appendPalette = (name, colors, projectId, paletteId) => {
  $(`.${projectId}`).append(`
    <article class='palette'>
      <p>${name}</p>
      <section class="palette-colors">
        <div class="box-color ${paletteId}"></div>
        <div class="box-color ${paletteId}"></div>
        <div class="box-color ${paletteId}"></div>
        <div class="box-color ${paletteId}"></div>
        <div class="box-color ${paletteId}"></div>
      </section>
    </article>
  `);
  $(`.${paletteId}`).each((i, div) => $(div).css('backgroundColor', colors[i]));
}

const postPalette = (name, colors, projectId) => {
  fetch('/api/v1/palettes', {
    method: 'POST',
    body: JSON.stringify({
      name,
      color1: colors[0],
      color2: colors[1],
      color3: colors[2],
      color4: colors[3],
      color5: colors[4],
      projectId
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
    .then(data => data ? appendPalette(name, colors, projectId, data[0].id) : null)
    .catch(error => console.log(error))
}

const createPalette = () => {
  const paletteValue = $('#save-palette').val();
  const selectedProject = $('select').val();
  const colorValues = [];

  $('.colors').each((i, value) => colorValues.push($(value).text()));
  postPalette(paletteValue, colorValues, selectedProject);
  $('#save-palette').val('');
}

const toggleLocked = (e) => {
  $(e.target).toggleClass('locked')
}

$(document).ready(() => (ranColors(), getProjects()));
$('body').keydown(e => e.keyCode === 32 && !$('input').is(':focus') ? ranColors() : null);
$('#create-project').keydown(e => e.keyCode === 13 ? createProject() : null);
$('#save-palette').keydown(e => e.keyCode === 13 ? createPalette() : null);
$('.colors').click(e => toggleLocked(e))
