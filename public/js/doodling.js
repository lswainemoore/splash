const BASE_URL = 'https://lincoln-doodling.herokuapp.com/';
function toggleDoodle(name) {
  var iframe = $('#doodle');
  var src = iframe.attr('src');
  if (src != '' && src.endsWith(name)) {
    // toggle off
    iframe.attr('src', '');
    return;
  }

  iframe.attr('src', BASE_URL + name);
}


window.onload = function() {
  $.each(
    [
      'squarish',
      'jadeite'
    ],
    function (i, v) {
      var p = $('<p>');
      var a = $('<a>', {
        text: v,
        href: 'javascript:void(0)',
        click: function() { toggleDoodle(v + '/'); }
      });
      a.appendTo(p);
      p.appendTo('#links');
    }
  );
}
