function myFunction() {
    document.getElementsByClassName("topnav")[0].classList.toggle("responsive");
}

/* COMMENTS LAST BORDER REMOVAL */
$(function() {
  var comments = $('div.article-comment-top');
  var last = comments.last();
  last.css({ borderBottom : 'none' });
});

function scheduleA(value, event){
	if(event=="1") return;
	if(event=="2") return;
	if(event=="3") return;
	if(event=="4") 
	  {
	  	var div = document.createElement('div');
	  	var btn = document.createElement("form");
	  	var i = document.createElement("input");
	  	i.setAttribute('type',"text");
        i.setAttribute('name',"username"); 
        i.setAttribute("placeholder","输入新的解决方案"); 

        btn.appendChild(i);
        div.appendChild(btn);

        document.getElementById("add-solutions").appendChild(div);
		console.log("Test");
	  }
}


function myButtonFunction() {
    console.log("Test");
    var div = document.createElement('div');
    div.className = "col-md-8 padding-20";
    var btn = document.createElement("form");
    var i = document.createElement("input");
    var div1 = document.createElement('div');
    div1.className = "col-md-8 padding-20";
    i.setAttribute('type',"text");
    i.setAttribute('name',"username"); 
    var s = document.createElement("input");
    s.setAttribute('type',"submit");
    s.setAttribute('value',"Add");
    btn.appendChild(i);
    btn.appendChild(s);
    div1.appendChild(btn);
    div.appendChild(div1);
    document.getElementById("add-solution").appendChild(div);
}