var SCROLL_AMOUNT_PX = 1;
var SCROLL_INTERVAL_MS = 20;

var isFirst = true;

var appendGallery = function() {
  var gallery = $('<div class="gallery"/>');
  manifest.forEach(function(imageSet) {
    imageSet.forEach(function(image, i) {
      var imageUrl = 'images/' + image;
      var item = $('<div class="item"/>');
      // Try to load images over time
      if (i == 0) {
        item.append('<img src="' + imageUrl + '"/>');
      } else {
        setTimeout(function() {
          item.append('<img src="' + imageUrl + '"/>');
        }, i * 100);
      }
      gallery.append(item);
    });
  });
  gallery.css({
    left: isFirst ? 0 : $('#gallery-container').outerWidth()
  });
  isFirst = false;
  $('#gallery-container').append(gallery);
};

var doScroll = function() {
  $('.gallery').css({
    left: '-=' + SCROLL_AMOUNT_PX
  });
  var leftMost = $($('.gallery:not(.old)')[0]);
  var width = parseInt(leftMost.outerWidth());
  var left = parseInt(leftMost.offset().left);
  var right = left + width;
  if (right <= parseInt($(window).width())) {
    appendGallery();
    leftMost.addClass('old');
  }
  $('.gallery.old').each(function(el) {
    var width = parseInt($(this).outerWidth());
    var left = parseInt($(this).offset().left);
    if (left <= (-1 * width)) {
      $(this).remove();
    }
  });
};

var galleryOnLoad = function(manifest) {
  window.manifest = manifest;
  appendGallery();
  var scrollInterval = setInterval(doScroll, SCROLL_INTERVAL_MS);
  $(window).focus(function() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
    }
    scrollInterval = setInterval(doScroll, SCROLL_INTERVAL_MS);
  }).blur(function() {
    clearInterval(scrollInterval);
  });
};

var manifestScript = document.createElement('script');
manifestScript.src = 'images/manifest.js';
document.body.appendChild(manifestScript);
