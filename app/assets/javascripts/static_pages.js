(function(doc) {
  var addEvent = 'addEventListener',
      type = 'gesturestart',
      qsa = 'querySelectorAll',
      scales = [1, 1],
      meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

  function fix() {
    meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
    doc.removeEventListener(type, fix, true);
  }

  if ((meta = meta[meta.length - 1]) && addEvent in doc) {
    fix();
    scales = [.25, 1.6];
    doc[addEvent](type, fix, true);
  }
}(document));

var prepareBody = function() {
  var coming   = $('#check-reception').is(':checked');
  var adults   = $('#adults').val() || 0;
  var kids     = $('#children').val() || 0;
  var comments = $('#message').val();
  var message  = "<h1>" + $('#name').val() + ", is " +
    (coming ? '' : 'not ') + "coming!</h1>";

  if(coming) {
    message += "<h2>With " + adults + " adults and " + kids + " kids</h2>";
  }

  return message += "<p>" + comments + "</p>";
};

$(function(){
  $('#rsvp-email').on('submit', function(e) {
    e.preventDefault();
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var address = $("#email").val(),
        name = $("#name").val(),
        reception = $("#check-reception").is(':checked'),
        adults = $("#adults").val(),
        stopped = false;
    $(".error").removeClass("error");
    if (reception) {
        if (adults !== undefined && (adults === "" || adults === $("#adults").attr("placeholder"))) {
            $("#adults").addClass("error");
            stopped = true;
        }
    }

    if (name === "" || name === $("#name").attr("placeholder")) {
        $("#name").addClass("error");
        stopped = true;
    }

    if ((address === "") || (reg.test(address) === false)) {
        $("#email").addClass("error");
        stopped = true;
    }

    if (!(stopped)) {
      var message = prepareBody();
      $('.spinner').show();

      $.ajax({
        type: "POST",
        url: "https://mandrillapp.com/api/1.0/messages/send.json",
        data: {
          key: "-m_S9CdWVBCrL4_yZZhh3w",
          message: {
            "html": message,
            "subject": "Wedding confirmation",
            "from_email": $('#email').val(),
            "from_name": $('#name').val(),
            "to" : [
              {
                "email": "samanthakhutchings@gmail.com",
                "name": "Samantha Hutchings",
                "type": "to"
              },
              {
                "email": "easyco@gmail.com",
                "name": "Trevor Wistaff",
                "type": "to"
              }
            ]
          }
        },
        success: function(data) {
          $('form').hide();
          $('.successful').show();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.status);
        },
        complete: function(data) {
          $('.spinner').hide();
        }
      });
    }
  });
});
