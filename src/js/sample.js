// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var results = [];
var that = this;
var que = 1;
var word;

// A generic onclick callback function.
function genericOnClick(info, tab) {
	Parse.initialize("V7nGgGHYgTVu40Zmo4PRsWzMO9bIVquYk1PlyZDt", "EWagklr88CJAu5Cr0Rxa0ugmBF2fUGzGOVw6c5Pw");

	var text="";
	results = [];
	word = info.selectionText;

	que = 1;

	$.ajax({
		type:'GET',
		url:'http://muuk.org/vocserver/toGerman.php',
		data: { word:word }
	}).done(function(e) {
		console.log(e);
		results.push(e);
		onDone();
	});

	// $.ajax({
	// 	type:'GET',
	// 	url:'http://mymemory.translated.net/api/get',
	// 	data: {q:info.selectionText, langpair:'en|de'}
	// }).done(function(e) {
	// 	// var i=0;
	// 	// for(i=0; i<e.matches.length; i++) {
	// 	// 	text+=e.matches[i].translation;
	// 	// 	if(i<e.matches.length-1) {
	// 	// 		text+=", ";
	// 	// 	}
	// 	// }
	// 	//
	// 	// results.push(e.matches[0].translation);
	// 	// that.onDone();
	// });
}

function onDone(){
	if( --que == 0 ){ // all querries done
		pushToServer(word, results);
		showNotification(word, results);
	}
}

function pushToServer(word, results) {
	var TestObject = Parse.Object.extend("vocabulary");
	var testObject = new TestObject();
	testObject.save({en: word, de:results.join(',')}, { });
}

function showNotification(word, results){
		var notification = webkitNotifications.createNotification(
			'',  // icon url - can be relative
			word,  // notification title
			results.join(", ")
		);

		results = [];

		console.log(notification);
		notification.show();
		setTimeout( function () { notification.close(); }, 8000);
}

// Create one test item for each context type.
var contexts = ["page","selection","link","editable","image","video",
                "audio"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "WTF?";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                       "onclick": genericOnClick});
}


window.addEventListener('keyup', keyboardNavigation, false);
function keyboardNavigation(e) {
  switch(e.which) {
     case 88:
	 console.log(e);
         break;
  }
}
