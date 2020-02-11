$(document).ready(function(){
  var contextMenuClassName = "context-menu";
  var contextMenuItemClassName = "context-menu__item";
  var contextMenuLinkClassName = "context-menu__link";
  var contextMenuActive = "context-menu--active";

  var taskItemClassName = "text123";
  var taskItemInContext;

  var clickCoords;
  var clickCoordsX;
  var clickCoordsY;

  var menu = document.querySelector("#context-menu");
  var menuItems = menu.querySelectorAll(".context-menu__item");
  var menuState = 0;
  var menuWidth;
  var menuHeight;
  var menuPosition;
  var menuPositionX;
  var menuPositionY;

  var windowWidth;
  var windowHeight;

  function clickInsideElement( e, className ) {
    var el = e.srcElement || e.target;
    if ( el.classList.contains(className) ) {
      return el;
    } else {
      while ( el = el.parentNode ) {
        if ( el.classList && el.classList.contains(className) ) {
          return el;
        }
      }
    }
    return false;
  }

  function getPosition(e) {
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;

    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
      x: posx,
      y: posy
    }
  }

  /**
  * Turns the custom context menu on.
  */
  function toggleMenuOn() {
    if ( menuState !== 1 ) {
      menuState = 1;
      menu.classList.add( contextMenuActive );
    }
  }

  /**
  * Turns the custom context menu off.
  */
  function toggleMenuOff() {
    if ( menuState !== 0 ) {
      menuState = 0;
      menu.classList.remove( contextMenuActive );
    }
  }

  /**
  * Positions the menu properly.
  *
  * @param {Object} e The event
  */
  function positionMenu(e) {
    clickCoords = getPosition(e);
    clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;

    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if ( (windowWidth - clickCoordsX) < menuWidth ) {
      menu.style.left = windowWidth - menuWidth + "px";
    } else {
      menu.style.left = clickCoordsX + "px";
    }

    if ( (windowHeight - clickCoordsY) < menuHeight ) {
      menu.style.top = windowHeight - menuHeight + "px";
    } else {
      menu.style.top = clickCoordsY + "px";
    }
  }

  var man_str;
  function contextListener() {
    document.addEventListener( "contextmenu", function(e) {
      taskItemInContext = clickInsideElement( e, taskItemClassName );

      if ( taskItemInContext ) {
        e.preventDefault();
        s = window.getSelection();
        var range = s.getRangeAt(0);
        var node = s.anchorNode;

        while (range.toString().indexOf(' ') != 0 && range.startOffset != 0) {
          range.setStart(node, (range.startOffset - 1));
        }
        range.setStart(node, range.startOffset + 1);

        do {
          range.setEnd(node, range.endOffset);
        } while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '' && range.endOffset < range.endContainer.length);

        man_str = range.toString().trim();
        toggleMenuOn();
        positionMenu(e);
      } else {
        taskItemInContext = null;
        toggleMenuOff();
      }
    });
  }

  /**
  * Listens for click events.
  */
  function clickListener() {
    document.addEventListener( "click", function(e) {
      var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );
      if ( clickeElIsLink ) {
        e.preventDefault();
        pywebview.api.popUp("http://man7.org/linux/man-pages/man1/ls.1.html");
        toggleMenuOff();
        //  menuItemListener( clickeElIsLink );
      }
      else {
        var button = e.which || e.button;
        if ( button === 1 ) {
          toggleMenuOff();
        }
      }
    });
  }


// Display json format when button is clicked
  var textDiv = document.getElementById("textDiv");
  $("button").click(function(){
    var jsonArray = [];
    var splittedFormData = $("input").serialize().split('&');
    textDiv.innerHTML = "{"
    $.each(splittedFormData, function (key, value) {
      item = {};
      var splittedValue = value.split('=');
      item["name"] = splittedValue[0];
      item["value"] = splittedValue[1];
      jsonArray.push(item);
      textDiv.innerHTML += (" \"" + item["name"] + "\": \"" + item["value"] + "\" }");

    });
    console.log(jsonArray);

  });

  // call event listeners
  contextListener();
  clickListener();

});
