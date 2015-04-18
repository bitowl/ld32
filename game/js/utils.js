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
