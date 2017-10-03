const ranColors = (e) => {
  $('.colors').each((i, color) => {
    const randomColor = "#000000".replace(/0/g,() => {
      return (~~(Math.random()*16)).toString(16)
    });
    $(color).css('backgroundColor', randomColor)
    $(color).text(randomColor.toUpperCase())
  })
}

const createProj = e => {
  const colorValues = []
  $('.colors').each((i, value) => colorValues.push($(value).text()))
  $('.projects').prepend(`
    <article class='palette'>
      <p>${$('#save-palette').val()}</p>
      <section class="palette-colors">
        <div class="box-color"></div>
        <div class="box-color"></div>
        <div class="box-color"></div>
        <div class="box-color"></div>
        <div class="box-color"></div>
      </section>
    </article>
  `)
  $('.box-color').each((i, div) => $(div).css('backgroundColor', colorValues[i]))
  $('#save-palette').val('')
}

$(document).ready(ranColors);
$('body').keydown(e => e.keyCode === 32 && !$('input').is(':focus') ? ranColors() : null)
$('#save-palette').keydown(e => e.keyCode === 13 ? createProj() : null)
