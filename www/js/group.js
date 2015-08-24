
$(document).ready(function() {  

	var db = window.openDatabase("LPO", "1.0", "My WebSQL LPO database", 5*1024*1024);
	db.transaction(
		function(tx){
			console.log("in create");
			//INTEGER PRIMARY KEY AUTOINCREMENT
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS groupT (id INTEGER PRIMARY KEY AUTOINCREMENT, name, description)",
				[],
				onSuccessExecuteSql,
				onError
			) // end tx exe
		},//end tx fn
		onError,
		onReadyTransaction,
		displayGroup()
	)//end db trans
	
	db.transaction(
		function(tx){
			console.log("in create note");
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS LNote (id INTEGER PRIMARY KEY AUTOINCREMENT, noteCat, noteTitle, noteDesc)",
				[],
				onSuccessExecuteSql,
				onError
			) // end tx exe
		},//end tx fn
		onError,
		onReadyTransaction
	)//end db trans

	db.transaction(
		function(tx){
			console.log("in create");
			//INTEGER PRIMARY KEY AUTOINCREMENT
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS appointT (id INTEGER PRIMARY KEY AUTOINCREMENT, sCat, apmName, location, date, time, appDes)",
				[],
				onSuccessExecuteSql,
				onError
			) // end tx exe
		},//end tx fn
		onError,
		onReadyTransaction
	)//end db trans

//Dialog Box add button - insert the completed fields into DB THEN close dialog box THEN refresh listview
 $("#addGroupPanel").find("#addGroup_btn").click(function () {
	 	var rowItem;
		var checkName;
		var checkDescription;
	 //Condition used to check whether input had been enter or not for each input type parameter
	    if ($("#addGroupPanel").find("#name").val() =="" || $("#addGroupPanel").find("#name").val()==null){
      		alert("Please enter group name");
      		return false;
      	}
      	
        if ($("#addGroupPanel").find("#description").val() =="" || $("#addGroupPanel").find("#description").val()==null){
      		alert("Please enter group description");
      		return false;
      	}
					db.transaction(
					function(tx){
						tx.executeSql( "SELECT name, description FROM groupT Where id > ? ",
						['0'], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}
									
									for (var i = 0; i < results.rows.length; i++) {
													rowItem = results.rows.item(i);
													checkName = rowItem.name;
													checkDescription = rowItem.description;
													};	//end of FOR
	
													} ) // end of Select
						
													}); //end of db transaction	  
        if ($("#addGroupPanel").find("#name").val() == checkName){
      		alert("There's already same group created with identical name");
      		return false;
      	                       }
	 //collect class data from input fields
 		get_name 	= $("#addGroupPanel").find("#name").val();
		get_description	= $("#addGroupPanel").find("#description").val();
		
		//INSERT Class DATA INTO DATABASE

		db.transaction(
			function(tx){
				tx.executeSql( "INSERT INTO groupT(name, description) VALUES(?,?)",
				[get_name, get_description],
				onSuccessExecuteSql(),
				onError() )
			},
			onError,
			onReadyTransaction
		)
		//close dialog after click add btn	
        $("#addGroupPanel").panel("close");
		//call function and displays class
		displayGroup();
 });
 

function displayGroup(){
// Clear List
    $("#List").text("");
	//Render Each item in list
			db.transaction(
					function(tx){
						tx.executeSql( "SELECT id,name,description FROM groupT Where id > ? ",
						['0'], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}
									
									for (var i = 0; i < results.rows.length; i++) {
													var rowItem = results.rows.item(i);
													var ID = rowItem.id;
													var name = rowItem.name;
													var description = rowItem.description;
													var ListElement = $("#List");
													var ListItem = $('<li>\
																		<a data-name="View" data-role="panel" data-display="overlay" href="#detailGroup">\
																		<img src="images/group.png">\
																		<h5></h5>\
																		<p>'+ description +'</p>\
																		<a data-name="Delete" href="#" data-icon=delete >Delete</a>\
																	 </a>\
																	 </li>')
													// Add Data to Item Element
													ListItem.attr("id", ID);
													ListItem.find("h5").text(name);
													
													
													ListItem.find('[data-name="View"]').attr("data-ID", ID);
													ListItem.find('[data-name="Delete"]').attr("data-ID", ID);
													// Add Item Element to List Element
													ListElement.append(ListItem);
									};	//end of FOR
									// Refresh ListView Element
									$("#List").listview("refresh");
									
									// Add Click Events for List Item 
									$("#List").find('[data-name="View"]').click(function () {
										var ID = Number($(this).attr("data-ID"));
										detail(ID);
									});
									
									// Add Click Event for List Delete Button
									$("#List").find('[data-name="Delete"]').click(function () {
										var ID = Number($(this).attr("data-ID"));
										Delete(ID);
									}); 
									
							} ) // end of Select
					}); //end of db transaction	  	
}

function detail(ID){
	console.log("ID passed " + ID);
	$("#detail").text("");
			db.transaction(
				function(tx){
				tx.executeSql("SELECT *  FROM groupT Where id=?", [ID], function(tx,results){
						$("detailc").text('');
						var rowItem = results.rows.item(0);
						var ID = rowItem.id;
						var name = rowItem.name;
						var description = rowItem.description;
						

						var ListElement = $("#detail");
						var ListItem = $('<li>\
										<h2></h2>\
										<p>'+ description +'</p>\
										<p><a href="#">Group Member</a></p>\
										<p><a data-name="View" href="#pageHome3">Appointment</a></p>\
										<p><a data-name="View2" href="#pageHome2">Group Note</a></p>\
										</li>')

										// Add Data to Item Element
										ListItem.attr("id", ID);
										ListItem.attr("name", name);
										ListItem.find("h2").text(name);


										ListItem.find('[data-name="View2"]').attr("data-ID", name);
										ListItem.find('[data-name="View"]').attr("data-ID", name);

										// Add Item Element to List Element
										ListElement.append(ListItem);
						$("#detail").listview("refresh");

						$("#detail").find('[data-name="View2"]').click(function () {
					    var IDs = $(this).attr("data-ID");
						viewNote(IDs);
						});

					

						$("#detail").find('[data-name="View"]').click(function () {
					    var IDk = $(this).attr("data-ID");	
					    	   
						viewApm(IDk);
						});



				   })//end tx.exeSql
				 } //end fn
				); //end of db transaction	
}//end Update fn

function Delete(ID) {
    // What to do when Delete
			db.transaction(
				function(tx){
				tx.executeSql("DELETE FROM groupT where id=?", [ID], function(tx,results){
					 	var ItemElement = $("#List").find("li#" + ID);
						ItemElement.remove();
						$("#List").listview("refresh");
				})//end exe
			  } //end fn
			); //end of db transaction	
}


function viewApm(IDk)
{	  console.log("ID passed " + IDk);
 $("#viewApm").text("");
window.globalvar2 = IDk;
			db.transaction(
					function(tx){
						tx.executeSql("SELECT *  FROM appointT Where sCat=?", [IDk], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}

									for (var i = 0; i < results.rows.length; i++) {
													var rowItem2 = results.rows.item(i);
													var ID = rowItem2.id;
													var sCat = IDk;
													var name = rowItem2.apmName;
													var location = rowItem2.location;
													var date = rowItem2.date;
													var time = rowItem2.time;
													var appDes = rowItem2.appDes;

													var ListElement = $("#viewApm");
													var ListItem = $('<li>\
																		<a data-name="Detail" data-rel="dialog" href="#detailApmPanel" data-theme="b">\
																		<img src="images/appointment.png">\
																		<h5></h5>\
																		<h3></h3>\
																		<p>'+ time +'</p>\
																		<a data-name="Delete" href="#" data-icon=delete >Delete</a>\
																	 </a>\
																	 </li>')

													// Add Data to Item Element
													ListItem.attr("id", ID);
													ListItem.find("h5").text(name);
													ListItem.find("h3").text(date);
																	 
												    ListItem.find('[data-name="Detail"]').attr("data-ID", ID);
													ListItem.find('[data-name="Delete"]').attr("data-ID", ID);
													ListElement.append(ListItem);
									};	//end of FOR
							     	$("#viewApm").listview("refresh");
									// Add Click Events for List Item 
									$("#viewApm").find('[data-name="Detail"]').click(function () {
										var ID = Number($(this).attr("data-ID"));
										DetailApm(ID);//pass ID to DetailNote function
									});
									
									// Add Click Event for List Delete Button
									$("#viewApm").find('[data-name="Delete"]').click(function () {
										var ID = Number($(this).attr("data-ID"));
										DeleteApm(ID);//pass specific note ID in database to DeleteNote function
									}); 	
							} ) // end of Select
					}); //end of db transaction	  
}
//delete Note function
function DeleteApm(ID) {
    // What to do when Deleted
			db.transaction(
				function(tx){
				tx.executeSql("DELETE FROM appointT where id=?", [ID], function(tx,results){
					 	var ItemElement = $("#viewApm").find("li#" + ID);
						ItemElement.remove();
						$("#viewApm").listview("refresh");
						viewApm(window.globalvar2);
				})//end exe
			  } //end fn
			); //end of db transaction	
}
//DetailNote function
function DetailApm(ID){
	console.log("ID passed " + ID);
			db.transaction(
				function(tx){
				tx.executeSql("SELECT *  FROM appointT Where id=?", [ID], function(tx,results){
						rowItem2 = results.rows.item(0);
						apmID = rowItem2.id;
						//Put the clicked List Data into TextFields on Edit Update Page
						$("#detailApmPanel").find("#sCat").val(rowItem2.sCat);
						$("#detailApmPanel").find("#apmTitle").val(rowItem2.apmName);
						$("#detailApmPanel").find("#apmDesc").val(rowItem2.appDes);
						$("#detailApmPanel").find("#apmLocation").val(rowItem2.location);
						$("#detailApmPanel").find("#apmTime").val(rowItem2.time);
						$("#detailApmPanel").find("#apmDate").val(rowItem2.date);
				   })//end tx.exeSql
				 } //end fn
				); //end of db transaction	
}//end Update fn

$("#detailApmPanel").find("#editApm_btn").click(function () {
				get_sCat        = window.globalvar2;
				get_apmName 	= $("#detailApmPanel").find("#apmTitle").val();
				get_appDes 	    = $("#detailApmPanel").find("#apmDesc").val();
				get_apmLocation = $("#detailApmPanel").find("#apmLocation").val();
				get_apmTime		= $("#detailApmPanel").find("#apmTime").val();
				get_apmDate		= $("#detailApmPanel").find("#apmDate").val();				
				
				addApmToDB(apmID,get_sCat,get_apmName,get_appDes,get_apmLocation,get_apmTime,get_apmDate); 
				//close dialog after click add btn	
				
				viewApm(window.globalvar2);
})//end btn select

function addApmToDB(apmID,get_sCat,get_apmName,get_appDes,get_apmLocation,get_apmTime,get_apmDate){
						//UPDATE DATA INTO DATABASE
						db.transaction(
							function (tx) {
								 tx.executeSql("UPDATE appointT SET sCat=?, apmName=?, location=?, date=?, time=?,appDes=? WHERE id=?;",[get_sCat,get_apmName,get_apmLocation,get_apmDate,
								 	get_apmTime,get_appDes,apmID], onSuccessUpdate,onErrorUpdate )
							} //end fn (tx)
							
						)//end db trans	
						alert("Update note succesfully!");						
}	

$("#addApm").find("#addApm_btn").click(function () {
	 //collect data from input fields
	 	get_sCat        = window.globalvar2;
 		get_apmName 	= $("#addApm").find("#apmTitle").val();
		get_appDes 	    = $("#addApm").find("#apmDesc").val();
		get_apmLocation = $("#addApm").find("#apmLocation").val();
		get_apmTime		= $("#addApm").find("#apmTime").val();
		get_apmDate		= $("#addApm").find("#apmDate").val();


		
		
		//INSERT DATA INTO DATABASE
		db.transaction(
			function(tx){
				tx.executeSql( "INSERT INTO appointT(sCat, apmName, location, date, time, appDes) VALUES(?,?,?,?,?,?)",
				[get_sCat, get_apmName, get_apmLocation, get_apmDate, get_apmTime,  get_appDes],
				onSuccessExecuteSql(),
				onError() )
			},
			onError,
			onReadyTransaction
			
		)
		//close dialog after click add btn	for Notes
		$("#addApm").dialog("close");
		//call function and displays class
		viewApm(window.globalvar2);
 });


function viewNote(IDs)
{	  console.log("ID passed " + IDs);
 $("#viewNote").text("");
 window.globalvar = IDs;
			db.transaction(
					function(tx){
						tx.executeSql("SELECT *  FROM LNote Where noteCat=?", [IDs], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}
									
									for (var i = 0; i < results.rows.length; i++) {
													var rowItem3 = results.rows.item(i);
													var ID = rowItem3.id;
													var noteTitle = rowItem3.noteTitle;
													var noteDesc = rowItem3.noteDesc;
													var ListElement = $("#viewNote");
													var ListItem = $('<li>\
																		<a data-name="Detail" data-rel="dialog" href="#detailNotePanel" data-theme="b">\
																		<h2><i>' + noteTitle + '</i></h2>\
																		<a data-name="Delete" href="#" data-icon=delete >Delete</a>\
																	 </a>\
																	 </li>')
																	 
												    ListItem.find('[data-name="Detail"]').attr("data-ID", ID);
													ListItem.find('[data-name="Delete"]').attr("data-ID", ID);
													ListElement.append(ListItem);
									};	//end of FOR
							     	$("#viewNote").listview("refresh");
									// Add Click Events for List Item 
									$("#viewNote").find('[data-name="Detail"]').click(function () {
										var ID = Number($(this).attr("data-ID"));
										DetailNote(ID);//pass ID to DetailNote function
									});
									
									// Add Click Event for List Delete Button
									$("#viewNote").find('[data-name="Delete"]').click(function () {
										var ID = Number($(this).attr("data-ID"));
										DeleteNote(ID);//pass specific note ID in database to DeleteNote function
									}); 	
							} ) // end of Select
					}); //end of db transaction	  
}
//delete Note function
function DeleteNote(ID) {
    // What to do when Deleted
			db.transaction(
				function(tx){
				tx.executeSql("DELETE FROM LNote where id=?", [ID], function(tx,results){
					 	var ItemElement = $("#viewNote").find("li#" + ID);
						ItemElement.remove();
						$("#viewNote").listview("refresh");
						viewNote(window.globalvar);
				})//end exe
			  } //end fn
			); //end of db transaction	
}
//DetailNote function
function DetailNote(ID){
	console.log("ID passed " + ID);
			db.transaction(
				function(tx){
				tx.executeSql("SELECT *  FROM LNote Where id=?", [ID], function(tx,results){
						rowItem3 = results.rows.item(0);
						noteID = rowItem3.id;
						//Put the clicked List Data into TextFields on Edit Update Page
						$("#detailNotePanel").find("#noteCat").val(rowItem3.noteCat);
						$("#detailNotePanel").find("#noteTitle").val(rowItem3.noteTitle);
						$("#detailNotePanel").find("#noteDesc").val(rowItem3.noteDesc);

				   })//end tx.exeSql
				 } //end fn
				); //end of db transaction	
}//end Update fn

$("#detailNotePanel").find("#editNote_btn").click(function () {
				get_Cat     = window.globalvar;
				get_Title 	= $("#detailNotePanel").find("#noteTitle").val();
				get_Desc 	= $("#detailNotePanel").find("#noteDesc").val();
								
				addNoteToDB(noteID,get_Cat,get_Title,get_Desc); 
				//close dialog after click add btn	
				
				viewNote(window.globalvar);
})//end btn select

function addNoteToDB(noteID,get_Cat,get_Title,get_Desc){
						//UPDATE DATA INTO DATABASE
						db.transaction(
							function (tx) {
								 tx.executeSql("UPDATE LNote SET noteCat=?, noteTitle=?, noteDesc=? WHERE id=?;",[get_Cat,get_Title,get_Desc,noteID], onSuccessUpdate,onErrorUpdate )
							} //end fn (tx)
							
						)//end db trans	
						alert("Update note succesfully!");						
}	

$("#addNote").find("#addNote_btn").click(function () {
	 //collect data from input fields

	 	get_Cats        = window.globalvar;
 		get_noteTitle 	= $("#addNote").find("#noteTitle").val();
		get_noteDesc 	= $("#addNote").find("#noteDesc").val();
		
		//INSERT DATA INTO DATABASE
		db.transaction(
			function(tx){
				tx.executeSql( "INSERT INTO LNote(noteCat,noteTitle, noteDesc) VALUES(?,?,?)",
				[get_Cats, get_noteTitle , get_noteDesc],
				onSuccessExecuteSql(),
				onError() )
			},
			onError,
			onReadyTransaction
			
		)
		//close dialog after click add btn	for Notes
		$("#addNote").dialog("close");
		//call function and displays class
		viewNote(window.globalvar);
 });

function onReadyTransaction( ){
		console.log( 'Transaction completed' )
}
	 
function onSuccessExecuteSql( tx, results ){
	console.log( 'Execute SQL completed' )
}
	 
function onError( err ){
	console.log( err )
}

function onSuccessUpdate( tx, results ){
	console.log( 'Execute SQL completed' )
}
	 
function onErrorUpdate( err ){
	console.log( err )
}
});


