const ranColors = (e) => {
  $('.colors').each((i, color) => {
    const randomColor = "#000000".replace(/0/g,() => {
      return (~~(Math.random()*16)).toString(16)
    });
    $(color).css('backgroundColor', randomColor)
    $(color).text(randomColor)
  })
}

$(document).ready(ranColors);

$('body').keydown(e => e.keyCode === 32 ? ranColors() : null)
