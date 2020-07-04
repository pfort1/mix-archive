//console.log(mixFrame)
document.addEventListener('DOMContentLoaded', function () {

  fetch('https://api.mixcloud.com/pedropedro6/cloudcasts/?offset=0')
    .then(response => response.json())
    .then(data => {
      let html = "";
      let htmlfilter = "";

      data = data.data
      data.forEach(function (val, index) {
        var index = index
        const name = val.name
        const key = val.key
        const duration = val.audio_length
        const tags = val.tags

        html += "<div class='mix-item ";
        tags.forEach(function (tag) {
          const tagname = tag.name
          html += convertToSlug(tagname) + ' ';
        })
        html += "' data-key='" + key + "'>" + name + "<div class='duration'>" + duration + "</div>" + "</div>";

        tags.forEach(function (tag, i) {
          const tagname = tag.name
          htmlfilter += "<a class='filter-button' data-filter='." + convertToSlug(tagname) + "'>" + tagname + "</a>";

        })

      });

      document.getElementById('mix-collection').innerHTML = html;
      $('#tag-collection').append(htmlfilter);
      convertduration()
      swiperInit()
      removeDuplicates()

    })

})

function convertToSlug(Text) {
  return Text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    ;
}

function removeDuplicates() {
  var seen = {};
  $('a[data-filter]').each(function () {
    console.log($(this))
    var txt = $(this).text();
    if (seen[txt])
      $(this).remove();
    else
      seen[txt] = true;
  });
}


$(document).on('click', '.mix-item', function () {
  var $this = $(this)
  var key = $this.attr('data-key')
  console.log(key)
  var embedUrl = 'https://api.mixcloud.com' + key + 'embed-json/'
  console.log(embedUrl)

  if ($("#mixcloud").attr('src') != '') {
    console.log('something is playing')
    var widget = Mixcloud.PlayerWidget(document.getElementById("mixcloud"));
    widget.ready.then(function () {
      widget.pause()
    })
  } else {
    console.log('nothing is playing')
  }

  $.getJSON(embedUrl, function (data) {
    console.log(data.html)
    var source = $(data.html).attr('src')
    console.log(source)
    $('#mixcloud').attr('src', source + "&mini=1&hide_artwork=1&autoplay=1")
  })

  if (!$this.hasClass('selected')) {
    $('.mix-item').removeClass('selected')
    $this.addClass('selected')
  } else {

  }

})


$(document).on('click', '.filter-button', function (e) {
  e.preventDefault()
  var $this = $(this)
  if (!$this.hasClass('selected')) {
    $('.filter-button').removeClass('selected')
    $this.addClass('selected')
  } else {

  }
})

function convertduration() {

  $('.duration').each(function () {
    const secs = $(this).text();
    //console.log(secs)
    const formatted = moment.utc(secs * 1000).format('HH:mm:ss');
    //console.log(formatted)
    $(this).text(formatted)
  })

}

function swiperInit() {

  $(document).ready(function () {
    var mixer = mixitup('#mix-collection', {
      selectors: {
        target: '.mix-item'
      },
      controls: {
        toggleLogic: 'and'
      },
      animation: {
        duration: 0
      }
    });
  });

}