var searchclicked = 0;
var topitem = 0;
var replace = { ' ': '_', "'": "" }
var numberofvisibleitems = 0
var numberofhiddenitemsbecauseof8itemlimit = 0
var arrowcount = 1;
var oldlength = 0;
var otherlanguages = 0;
var visibleIDs = []

var languages = ["/", "/zh_tw/", "/zh_cn/"]
var languagenames = ["English", "繁體中文", "简体中文"]
var mylanguage = 0 // your language index (see var languages)
var validlanguageurls = [];
var validlanguagenames = [];
var translatevisible = false;
var origin = window.location.origin;
thisurl = window.location.toString();
var menu_opened = false;
var path = thisurl.replace(origin, "")

//botchedurl = (thisurl.substring(0, thisurl.length - 1)).replace(/[^\/]*\//g, '')

function doStuff() {
  document.getElementById("menubutton").addEventListener("click", clickMenu);

  for (a = 0; a < languages.length; a++) {
    var urlToTest = path.replace(languages[mylanguage], languages[a])
    if (a != mylanguage && checkURL(urlToTest)) {
      otherlanguages++;
      validlanguageurls.push(urlToTest);
      validlanguagenames.push(languagenames[a]);
    }
  }

  if (otherlanguages > 0) {
    document.getElementById('languageheaderbox').style.display = "block";
  }

  if (screen.width > 500) {
    document.getElementById('searchBar').focus();
    document.getElementById('searchBar').select();
  } else {
    document.getElementById("searchBar").placeholder = "\uD83D\uDD0E\uFE0E";
  }

  var link_list = "";
  for (var i = 0; i < window.searchpages.length * 2; i += 1) {
    link_list += `<div><a href="` + window.searchpages[i % searchpages.length][1] + `" id="link_` + i + `"><p class="searchitem">` + window.searchpages[i % searchpages.length][0] + `</p></a></div>`;
  }
  document.getElementById("aUL").innerHTML = `<span id="links">` + link_list + "</span>";

  document.getElementById("aUL").innerHTML += `<span id="textsearch"></span>`;

  pitDay();
  setInterval(pitDay, 1000);

  var lol = Math.floor(Math.random() * 10000)
  if (lol == 0) {
    document.getElementById('thehypixelpitwiki').innerHTML = `<b class="me">WOW!</b> 1 in <span class="ma">10,000</span> chance to see this message!`
  }


  var input = document.getElementById("searchBar");
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      console.log("click")
      event.preventDefault();
      if (numberofvisibleitems != 0) document.getElementById('link_' + topitem).click();
      else document.getElementById("textsearch-ad").click();
      ChangeHighlight()
      document.getElementById("searchBar").value = "";
      document.getElementById('aUL').style.display = "none"
    }
  });

  var input = document.getElementById("searchBar");
  input.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") {
      console.log("up arrow")
      if (arrowcount > 1) {
        arrowcount = arrowcount - 1
      }
      event.preventDefault();
    }
  });

  var input = document.getElementById("searchBar");
  input.addEventListener("keydown", function (event) {
    if (event.key === "ArrowDown") {
      console.log("down arrow")
      if (arrowcount < numberofvisibleitems && arrowcount < 8) {
        arrowcount = arrowcount + 1
      }
      event.preventDefault();
    }
  });

  Search()
  ChangeHighlight()

  var favi = localStorage.getItem('favicon-palette');
  if (favi > 0) {
    document.querySelector("link[type='image/x-icon']").href = "/favicon/special" + favi + ".ico";
    console.log("wow, nice favicon!");
  }

}

var replace = { ' ': '', "'": "", }
function MakeBasic(string_to_become_basic) { //strips all punctuation and fun from the string
  return string_to_become_basic.replace(/[^A-Za-z0-9]/g, '')
}

function mouseOver() {
  document.getElementById("search").style.color = "#a83994";
}

function mouseOut() {
  document.getElementById("search").style.color = "#FFF";
}

function TimestampIt(sec = 0) {
  if (sec > 31536000) {
    return Math.floor(sec / 31536000) + "y " + Math.floor((sec % 31536000) / 86400) + "d " + Math.floor((sec % 86400) / 3600) + "h " + Math.floor((sec % 3600) / 60) + "m " + Math.floor(sec % 60) + "s"
  } else if (sec > 86400 /*1 day*/) {
    return Math.floor(sec / 86400) + "d " + Math.floor((sec % 86400) / 3600) + "h " + Math.floor((sec % 3600) / 60) + "m " + Math.floor(sec % 60) + "s"
  } else if (sec > 3600) {
    return Math.floor((sec % 86400) / 3600) + "h " + Math.floor((sec % 3600) / 60) + "m " + Math.floor(sec % 60) + "s"
  } else if (sec > 60) {
    return Math.floor((sec % 3600) / 60) + "m " + Math.floor(sec % 60) + "s"
  } else {
    return Math.floor(sec % 60) + "s"
  }
}

var isItPitDay = false;
function pitDay() {
  var now = (Date.now() / 1000);
  var pitdaytimestamp = 1677387600;
  if (now > pitdaytimestamp && now < (pitdaytimestamp + 86400)) {
    document.getElementById('thehypixelpitwiki').innerHTML = `<span class="groovy"><b>HAPPY PIT DAY!</b></span> ` + TimestampIt(Math.round(pitdaytimestamp - now + 86400));
    isItPitDay = true;
  } else if (isItPitDay) {
    document.getElementById('thehypixelpitwiki').innerHTML = "The Hypixel Pit Wiki";
    isItPitDay = false;
  }
}

function checkURL(url) {
  var request;
  if (window.XMLHttpRequest)
    request = new XMLHttpRequest();
  else
    request = new ActiveXObject("Microsoft.XMLHTTP");
  request.open('GET', url, false);
  request.send();
  if (request.status === 404) {
    return false;
  } else {
    return true;
  }
}

function clickMenu() {
  if (!menu_opened) {
    menu_opened = true;
    document.getElementById("menuopened").checked = true;
  } else {
    menu_opened = false;
    document.getElementById("menuopened").checked = false;
    if (translatevisible) translateClick();
  }
}

function translateClick() {
  if (!translatevisible) {
    completelanguagelist = "";
    for (b = 0; b < validlanguageurls.length; b++) {
      completelanguagelist += `<br><b><a href="` + validlanguageurls[b] + `">` + validlanguagenames[b] + "</a></b>"
    }
    document.getElementById('languagelist').innerHTML = "<b>" + completelanguagelist + "<br>";
    document.getElementById('languagecontainer').style.display = "block";
    translatevisible = true;
  } else {
    document.getElementById('languagecontainer').style.display = "none"
    translatevisible = false;
  }
}

function escapeString(text) {
  var map = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

function Filter() {
  numberofvisibleitems = 0;
  numberofhiddenitemsbecauseof8itemlimit = 0;
  visibleIDs = [];
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('searchBar');
  filter = input.value.toUpperCase();
  document.getElementById("textsearch").innerHTML = `<br><a href="Search?param=` + encodeURIComponent(input.value) + `" style="color: #D66EDA" id="textsearch-ad">Search for pages that contain <i>"` + escapeString(input.value) + `"...</a></i>`;
  ul = document.getElementById("aUL");
  li = ul.getElementsByTagName('div');
  if (MakeBasic(filter).length > 0) {
    document.getElementById('aUL').style.display = "block";
  } else {
    document.getElementById('aUL').style.display = "none";
  }
  if (filter.length != oldlength) {
    arrowcount = 1;
    console.log(filter.length + " does not equal " + oldlength);
  }
  oldlength = filter.length
  // Loop through all list items and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    if (i < window.searchpages.length * 2) {
      li[i].style.display = "none";
    }
    document.getElementById('link_' + i).style.color = ""
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;

    if (MakeBasic(txtValue.toUpperCase()).startsWith(MakeBasic(filter)) && i < window.searchpages.length) {
      //console.log(txtValue.toUpperCase() + " is a possible word.") 
      li[i].style.display = "";
      li[i + window.searchpages.length].style.display = "none";
      //console.log("showing item " + i)
      numberofvisibleitems += 1;
      visibleIDs.push(i + window.searchpages.length)
      if (numberofvisibleitems == arrowcount) {
        topitem = i;
        document.getElementById('link_' + i).style.color = "#FFFF99"
        //console.log("Arrow is at position " + i)
      }
    } else if (i < window.searchpages.length) {
      li[i].style.display = "none";
    }

    if (MakeBasic(txtValue.toUpperCase()).indexOf(MakeBasic(filter)) > -1 && i >= window.searchpages.length && !visibleIDs.includes(i)) {
      li[i].style.display = "";
      numberofvisibleitems += 1;
      if (numberofvisibleitems == arrowcount) {
        topitem = i;
        document.getElementById('link_' + i).style.color = "#FFFF99"
        //console.log("Arrow is at position " + i)
      }
    }

    if (numberofvisibleitems > 8) {
      //console.log("Item hidden due to limit.")
      li[i].style.display = "none";
      numberofhiddenitemsbecauseof8itemlimit += 1;
    }
  }
  if (numberofvisibleitems == 0) {
    document.getElementById("textsearch-ad").style.fontWeight = "bold";
    document.getElementById("textsearch-ad").style.color = "rgb(255, 255, 153)";
    document.getElementById("links").style.display = "none";
  } else {
    document.getElementById("textsearch-ad").style.fontWeight = "regular";
    document.getElementById("textsearch-ad").style.color = "#D66EDA";
    document.getElementById("links").style.display = "";
  }
}

function Search() {
  if (searchclicked == 0) {
    document.getElementById('searchBar').style.display = "block"
    document.getElementById('partofsearch').style.display = "block"
    searchclicked = 1;
    if (screen.width > 500) {
      document.getElementById('searchBar').focus();
      document.getElementById('searchBar').select();
    }
    Filter()
  } else {
    document.getElementById('partofsearch').style.display = "none"
    document.getElementById('searchBar').style.display = "none"
    document.getElementById('aUL').style.display = "none"
    searchclicked = 0;
  }
}

function ChangeHighlight() {
  Array.from(document.querySelectorAll('.highlighted')).forEach(function (el) {
    el.classList.remove('highlighted');
  });
  var hash = location.hash.substring(1);
  console.log(hash)
  if (hash.length > 0) {
    document.getElementById(hash + "Header").classList.add('highlighted')
  }
}