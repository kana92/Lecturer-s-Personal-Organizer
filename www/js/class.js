// open database
$(document).ready(function() {  

	var db = window.openDatabase("LPO", "1.0", "My WebSQL LPO database", 5*1024*1024);
	
	db.transaction(
		function(tx){
			console.log("in create");
			//INTEGER PRIMARY KEY AUTOINCREMENT
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS studentClass (id INTEGER PRIMARY KEY AUTOINCREMENT, name, location, day, timefrom, timeto, classRep, telno, studentEmel)",
				[],
				onSuccessExecuteSql,
				onError
			) // end tx exe
		},//end tx fn
		onError,
		onReadyTransaction,
		displayClass()
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
	

//Dialog Box add button - insert the completed fields into DB THEN close dialog box THEN refresh listview
 $("#addClassPanel").find("#addClass_btn").click(function () {
	 	var rowItem;
		var checkName;
		var checkDay;
		var checkTimefrom;
		var checkTimeto; 
	 //Condition used to check whether input had been enter or not for each input type parameter
	    if ($("#addClassPanel").find("#name").val() =="" || $("#addClassPanel").find("#name").val()==null){
      		alert("Please enter class name");
      		return false;
      	}
      	
        if ($("#addClassPanel").find("#location").val() =="" || $("#addClassPanel").find("#location").val()==null){
      		alert("Please enter class location");
      		return false;
      	}
					
					db.transaction(
					function(tx){
						tx.executeSql( "SELECT name,day,timefrom,timeto FROM studentClass Where id > ? ",
						['0'], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}
									
									for (var i = 0; i < results.rows.length; i++) {
													rowItem = results.rows.item(i);
													checkName = rowItem.name;
													checkDay = rowItem.day;
													checkTimefrom = rowItem.timefrom;
													checkTimeto = rowItem.timeto;
													};	//end of FOR
	
													} ) // end of Select
						
													}); //end of db transaction	  
        if ($("#addClassPanel").find("#name").val() == checkName || $("#addClassPanel").find("#day").val()== checkDay || $("#addClassPanel").find("#timefrom").val()== checkTimefrom){
      		alert("There's already same class created with identical name,day, & time!");
      		return false;
      	                       }
	 //collect class data from input fields
 		get_name 	= $("#addClassPanel").find("#name").val();
 		get_location 	= $("#addClassPanel").find("#location").val();
		get_day 	= $("#addClassPanel").find("#day").val();
		get_timefrom 	= $("#addClassPanel").find("#timefrom").val();
		get_timeto 	= $("#addClassPanel").find("#timeto").val();

		def_classRep = "Class Representative";
		//INSERT Class DATA INTO DATABASE

		db.transaction(
			function(tx){
				tx.executeSql( "INSERT INTO studentClass(name, location, day, timefrom, timeto, classRep) VALUES(?,?,?,?,?,?)",
				[get_name, get_location, get_day, get_timefrom, get_timeto, def_classRep],
				onSuccessExecuteSql(),
				onError() )
			},
			onError,
			onReadyTransaction
		)
		//close dialog after click add btn	
        $("#addClassPanel").panel("close");
		//call function and displays class
		displayClass();
 });
 
// display all class on main class page
function displayClass(){
// Clear List
    $("#List").text("");
	//Render Each item in list
			db.transaction(
					function(tx){
						tx.executeSql( "SELECT * FROM studentClass Where id > ? ",
						['0'], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}
									
									for (var i = 0; i < results.rows.length; i++) {
													var rowItem = results.rows.item(i);
													var ID = rowItem.id;
													var name = rowItem.name;
													var day = rowItem.day;
													var timefrom = rowItem.timefrom;
													var timeto = rowItem.timeto;
													var ListElement = $("#List");
													var ListItem = $('<li>\
																		<a data-name="View" data-role="dialog" href="#detailClass">\
																		<img src="images/class.png">\
																		<h5></h5>\
																		<h3></h3>\
																		<p>'+ timefrom +'-'+ timeto +'</p>\
																		<a data-name="Delete" href="#" data-icon=delete >Delete</a>\
																	 </a>\
																	 </li>')
													// Add Data to Item Element
													ListItem.attr("id", ID);
													ListItem.find("h5").text(name);
													ListItem.find("h3").text(day);
													
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

//display class detail
function detail(ID){
	console.log("ID passed " + ID);
	$("#detailc").text("");
			db.transaction(
				function(tx){
				tx.executeSql("SELECT *  FROM studentClass Where id=?", [ID], function(tx,results){
						$("detailc").text('');
						var rowItem = results.rows.item(0);
						var ID = rowItem.id;
						var name = rowItem.name;
						var location = rowItem.location;
						var classRep = rowItem.classRep;
						var day = rowItem.day;
						var timefrom = rowItem.timefrom;
						var timeto = rowItem.timeto;

						var ListElement = $("#detailc");
						var ListItem = $('<li>\
										<h2></h2>\
										<p>'+ day +'</p>\
										<p>'+ location +'</p>\
										<p>'+ timefrom + " - " + timeto + '</p>\
										<p><a data-name="View" href="#student">Class Representative</a></p>\
										<p><a data-name="View2" href="#pageHome2">Class Module</a></p>\
										</li>')

										// Add Data to Item Element
										ListItem.attr("id", ID);
										ListItem.attr("name", name);
										ListItem.find("h2").text(name);
										ListItem.find('[data-name="View"]').attr("data-ID", ID);
										ListItem.find('[data-name="View2"]').attr("data-ID", name);
										// Add Item Element to List Element
										ListElement.append(ListItem);
						$("#detailc").listview("refresh");

						$("#detailc").find('[data-name="View"]').click(function () {
					    var ID = Number($(this).attr("data-ID"));
						studentdetail(ID);
						});

						$("#detailc").find('[data-name="View2"]').click(function () {
					    var IDs = $(this).attr("data-ID");
						viewNote(IDs);
						});

				   })//end tx.exeSql
				 } //end fn
				); //end of db transaction	
}//end detail fn


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
													var rowItem = results.rows.item(i);
													var ID = rowItem.id;
													var noteTitle = rowItem.noteTitle;
													var noteDesc = rowItem.noteDesc;
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
						rowItem = results.rows.item(0);
						noteID = rowItem.id;
						//Put the clicked List Data into TextFields on Edit Update Page
						$("#detailNotePanel").find("#noteCat").val(rowItem.noteCat);
						$("#detailNotePanel").find("#noteTitle").val(rowItem.noteTitle);
						$("#detailNotePanel").find("#noteDesc").val(rowItem.noteDesc);

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
 
// delete a class
function Delete(ID) {
    // What to do when Deleted
			db.transaction(
				function(tx){
				tx.executeSql("DELETE FROM studentClass where id=?", [ID], function(tx,results){
					 	var ItemElement = $("#List").find("li#" + ID);
						ItemElement.remove();
						$("#List").listview("refresh");
				})//end exe
			  } //end fn
			); //end of db transaction	
}

// class representative detail
function studentdetail(ID){
	console.log("ID passed " + ID);
	$("#sdetail").text("");
			db.transaction(
				function(tx){
				tx.executeSql("SELECT *  FROM studentClass Where id=?", [ID], function(tx,results){
						$("sdetail").text('');
						var rowItem = results.rows.item(0);
						var ID = rowItem.id;
						var classReps = rowItem.classRep;
						var telephone = rowItem.telno;
						var mail = rowItem.studentEmel;

						var ListElement = $("#sdetail");
						var ListItem = $('<li>\
										<img src="images/profile.png">\
										<h2></h2>\
										<p><a href="tel:'+ telno +'"> Call Representative </a></p>\
										<p><a href="mailto:'+ studentEmel +'">Email Representative</a></p>\
										<button><a data-name="Detail" href="#editClassRep">Edit</a></button>\
										</li>')
										// Add Data to Item Element
										ListItem.attr("id", ID);
										ListItem.find("h2").text(classReps);
										ListItem.find('[data-name="Detail"]').attr("data-ID", ID);

										// Add Item Element to List Element
										ListElement.append(ListItem);
						$("#sdetail").listview("refresh");

						$("#sdetail").find('[data-name="Detail"]').click(function () {
							var ID = Number($(this).attr("data-ID"));
							editRep(ID);//pass ID to DetailNote function
						});
						



				   })//end tx.exeSql
				 } //end fn
				); //end of db transaction	
}//end detail fn

//edit class rep
function editRep(ID){
	console.log("ID passed " + ID);
			db.transaction(
				function(tx){
				tx.executeSql("SELECT *  FROM studentClass Where id=?", [ID], function(tx,results){
						 rowItem = results.rows.item(0);
						 classID = rowItem.id;
						//Put the clicked List Data into TextFields on Edit Update Page
						
						$("#editClassRep").find("#classRep").val(rowItem.classRep);
						$("#editClassRep").find("#telno").val(rowItem.telno);
						$("#editClassRep").find("#studentEmel").val(rowItem.studentEmel);
				   })//end tx.exeSql
				 } //end fn
				); //end of db transaction	
}//end Update fn

$("#editClassRep").find("#editCR_btn").click(function () {
				get_classrep = $("#editClassRep").find("#classRep").val();
				get_telno    = $("#editClassRep").find("#telno").val();
				get_emel     = $("#editClassRep").find("#studentEmel").val();
								
				addRepToDB(classID,get_classrep,get_telno,get_emel); 
				//close dialog after click add btn	
				
				
})//end btn select

function addRepToDB(classID,get_classrep,get_telno,get_emel){
						//UPDATE DATA INTO DATABASE
						db.transaction(
							function (tx) {
								 tx.executeSql("UPDATE studentClass SET classRep=?, telno=?, studentEmel=? WHERE id=?;",[get_classrep,get_telno,get_emel,classID], onSuccessUpdate,onErrorUpdate )
							} //end fn (tx)
							
						)//end db trans	
						alert("Update note succesfully!");					
}	



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


