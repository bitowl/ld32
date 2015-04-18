var tmp; // store anything in here. Don't expect it to be still here if something else h appense at the same time

// http://stackoverflow.com/a/946556
jQuery.fn.extend({
    insertAtCaret: function(myValue){
      return this.each(function(i) {
        if (document.selection) {
      //For browsers like Internet Explorer
      this.focus();
      var sel = document.selection.createRange();
      sel.text = myValue;
      this.focus();
  }
  else if (this.selectionStart || this.selectionStart == '0') {
      //For browsers like Firefox and Webkit based
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      var scrollTop = this.scrollTop;
      this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
      this.focus();
      this.selectionStart = startPos + myValue.length;
      this.selectionEnd = startPos + myValue.length;
      this.scrollTop = scrollTop;
  } else {
      this.value += myValue;
      this.focus();
  }
});
  }
});

// http://stackoverflow.com/a/499158
function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
}
else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
}
}

function setCaretToPos (input, pos) {
    console.log("set position:"+pos);
    setSelectionRange(input, pos, pos);
}



// http://stackoverflow.com/a/11891895
function removeBackspaces(str) {
    while (str.indexOf("\b") != -1)
    {
        str = str.replace(/.?\x08/, ""); // 0x08 is the ASCII code for \b
    }
    return str;
}

// https://gist.github.com/DrPheltRight/1007907
  // Behind the scenes method deals with browser
    // idiosyncrasies and such
    $.caretTo = function (el, index) {
        if (el.createTextRange) { 
            var range = el.createTextRange(); 
            range.move("character", index); 
            range.select(); 
        } else if (el.selectionStart != null) { 
            el.focus(); 
            el.setSelectionRange(index, index); 
        }
    };
 
    // The following methods are queued under fx for more
    // flexibility when combining with $.fn.delay() and
    // jQuery effects.
 
    // Set caret to a particular index
    $.fn.caretTo = function (index, offset) {
        return this.queue(function (next) {
            if (isNaN(index)) {
                var i = $(this).val().indexOf(index);
                
                if (offset === true) {
                    i += index.length;
                } else if (offset) {
                    i += offset;
                }
                
                $.caretTo(this, i);
            } else {
                $.caretTo(this, index);
            }
            
            next();
        });
    };

// http://stackoverflow.com/a/4364902
function insertIntoString(a, b, position) {
     return [a.slice(0, position), b, a.slice(position)].join('');
}

// http://stackoverflow.com/a/646643
String.prototype.startsWith = function (str){
  return this.indexOf(str) === 0;
};

// http://stackoverflow.com/a/2548133
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// http://stackoverflow.com/a/19303725
function getRandom(seed) {
    return {seed:seed};
}
function random(obj) {
    var x = Math.sin(obj.seed++) * 10000;
    return x - Math.floor(x);
}
function randomInt(obj, intmax) {
    return Math.floor(random(obj) * intmax);
}
function randomBool(obj) {
    return random(obj) <0.5;
}
function randomArr(obj, arr) {
    return arr[Math.floor(random(obj)*arr.length)];
}

// http://stackoverflow.com/a/1473742
function inArray(value, array) {
    return $.inArray(value, array)!=-1;
}

// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
function utf8_to_b64( str ) {
  return window.btoa(unescape(encodeURIComponent( str )));
}
function b64_to_utf8( str ) {
  return decodeURIComponent(escape(window.atob( str )));
}

// https://gist.github.com/Hoff97/9842228
//Erweiterte JSON, die auch spezielle Objekte parst und zu JSON umwandelt:
//Objekte, die sich selbst enthalten
//Objekte, die Funktionen enthalten
var JSONE = {};
JSONE.to = {};
JSONE.to.removeCycle = function(obj,already = [],lvl = 1,path="PATH#obj"){
    if(typeof obj === "object")
    {
        for(var i in already)
        {
            if(already[i].obj===obj && (already[i].lvl<lvl-1||already[i].lvl==0))
            {
                return already[i].loc;
            }
        }
        
        if(lvl===1)
        {
            already.push({obj:obj,loc:path,lvl:0});
        }
        for(var i in obj)
        {
            already.push({obj:obj[i],loc:path + "." + i,lvl:lvl});
        }
        for(var i in obj)
        {
            obj[i] = JSONE.to.removeCycle(obj[i],already,lvl+1,path + "." + i);
        }
    }
    return obj;
}
JSONE.to.changeFuncs = function(obj)
{
    if(typeof obj === "function")
    {
        return "FUNCTION#" + obj.toString();
    }
    else if(typeof obj === "object")
    {
        var cl = clone(obj);
        for(var i in cl)
        {
            cl[i] = JSONE.to.changeFuncs(cl[i]);
        }
        return cl;
    }
    return obj;
}
JSONE.stringify = function(obj)
{
    if(typeof obj === "object")
    {
        for(var i in JSONE.to)
        {
            obj = JSONE.to[i](obj);
        }
    }
    return JSON.stringify(obj);
}
JSONE.from = {};
JSONE.from.addFuncs = function(obj)
{
    if(typeof obj === "string" && obj.substr(0,9)==="FUNCTION#")
    {
        var ret;
        try
        {
            eval("ret = " + obj.substr(9));
            return ret;
        }
        catch(e)
        {
            return obj;
        }
    }
    else if(typeof obj === "object")
    {
        for(var i in obj)
        {
            obj[i] = JSONE.from.addFuncs(obj[i]);
        }
        return obj;
    }
    return obj;
}
JSONE.from.addCycle = function(obj,paths = [],already = [],path="PATH#obj")
{
    for(var i in already)
    {
        if(already[i]===obj)
        {
            return obj;
        }
    }
    for(var i in paths)
    {
        if(paths[i].path===obj)
        {
            obj = paths[i].obj;
        }
    }
    for(var i in already)
    {
        if(already[i]===obj)
        {
            return obj;
        }
    }
    paths.push({path:path,obj:obj});
    already.push(obj);
    
    for(var i in obj)
    {
        obj[i] = JSONE.from.addCycle(obj[i],paths,already,path + "." + i);
    }
    return obj;
}
JSONE.parse = function(txt)
{
    var obj = JSON.parse(txt);
    if(typeof obj === "object")
    {
        for(var i in JSONE.from)
        {
            obj = JSONE.from[i](obj);
        }
    }
    return obj;
}
 
//Funktion, die auch Objekte klont, die sich selbst enthalten
function clone(obj,already = [])
{
    if(typeof obj === "object")
    {
        for(var i in already)
        {
            if(already[i].obj === obj)
            {
                return already[i].cl;
            }
        }
    
        var cl = {};
        already.push({obj:obj,cl:cl});
        for(var i in obj)
        {
            cl[i] = clone(obj[i],already);
        }
        return cl;
    }
    return obj;
}