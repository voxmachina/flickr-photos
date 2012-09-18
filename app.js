App = function (options) {
  this.init(options);
};

App.prototype = {
  /* init */
  init : function ()
  {
    var self = this;

    /* on fav icon click event */
    jQuery('.fav').live('click', function (e) {
      e.preventDefault();
      var elem = jQuery(this);
      if (elem.hasClass('icon-heart-empty')) {
        self.addFav(elem, function () {
          elem.removeClass('icon-heart-empty').addClass('icon-heart');
        });
      } else {
        self.removeFav(elem, function () {
          elem.removeClass('icon-heart').addClass('icon-heart-empty');
        });
      }
    });
  },
  /* creates a cookie */
  createCookie : function (name, value, days) 
  {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    } else {
      var expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
  },
  /* reads a cookie */
  readCookie : function (name) 
  {
    var nameEQ = name + "=";
    var ca     = document.cookie.split(';');

    for (var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  },
  /* erases a cookie */
  eraseCookie : function (name) 
  {
    this.createCookie(name,"",-1);
  },
  /* adds a fav */
  addFav : function (elem, callback)
  {
    var cookieName = 'my-flickr-favs';
    var favs       = this.readCookie(cookieName);
    if (favs == undefined || favs == '') {
      this.createCookie(cookieName, '', 15);
      favs = this.readCookie(cookieName);
    }

    var src = elem.parent().parent().find('img').attr('src');

    this.eraseCookie(cookieName);
    this.createCookie(cookieName, favs+'|'+src, 15);

    callback();
  },
  /* is fav ? */
  isFav : function (src)
  {
    var cookieName = 'my-flickr-favs';
    var favs       = this.readCookie(cookieName);

    if (favs == undefined || favs == '') {
      return false;
    }

    var favTokens = favs.split('|');

    for (var i=0; i<favTokens.length; i++) {      
      if (favTokens[i] == src) {
        return true;
      }
    }
    return false;
  },
  /* removes a fav */
  removeFav : function (elem, callback)
  {
    var cookieName = 'my-flickr-favs';
    var favs       = this.readCookie(cookieName);

    if (favs == undefined || favs == '') {
      callback();
      return;
    }

    var src       = elem.parent().parent().find('img').attr('src');
    var favTokens = favs.split('|');
    var newFavs   = '';

    for (var i=0; i<favTokens.length; i++) {
      if (favTokens[i] !== src) {
        newFavs += '|'+favTokens[i];
      }
    }

    this.eraseCookie(cookieName);
    this.createCookie(cookieName, newFavs, 15);

    callback();
  }
}