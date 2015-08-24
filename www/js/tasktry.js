/// <reference path="jquery.js" />
/// <reference path="jquery.mobile-1.4.0.min.js" />

//sqlIns: 'INSERT INTO mynotes(notes,date) values(?,?)',
//sqlUpd: 'UPDATE mynotes SET notes=?,date=? WHERE id=?',
//sqlDel: 'DELETE mynotes WHERE id=?',
//sqlSel: 'SELECT * FROM mynotes WHERE id=?'


$(document).ready(function() {  
var today = new Date();
	  var dd = today.getDate();
	  var mm = today.getMonth()+1;

	  var yyyy = today.getFullYear();
	  if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = yyyy+'-'+mm+'-'+dd;
	  alert(today);	
	 
	var db = window.openDatabase("ReminderTask", "1.0", "My WebSQL Student App database", 5*1024*1024);
	
	db.transaction(
		function(tx){
			console.log("in create");
			//INTEGER PRIMARY KEY AUTOINCREMENT
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY AUTOINCREMENT, date date, time text, title text, desc text)",
				[],
				onSuccessExecuteSql,
				onError
			) // end tx exe
		},//end tx fn
		onError,
		onReadyTransaction
	)//end db trans
	
	

//Dialog Box add button - insert the completed fields into DB THEN close dialog box THEN refresh listview
 $("#addTaskPanel").find("#addTask_btn").click(function () {
	 //collect class data from input fields
 		get_date 	= $("#addTaskPanel").find("#date").val();
		get_time 	= $("#addTaskPanel").find("#time").val();
		get_title   = $("#addTaskPanel").find("#title").val();
		get_desc 	= $("#addTaskPanel").find("#desc").val();
		//INSERT Class DATA INTO DATABASE
		db.transaction(
			function(tx){
				tx.executeSql( "INSERT INTO task(date, time, title, desc) VALUES(?,?,?,?)",
				[get_date , get_time, get_title, get_desc],
				onSuccessExecuteSql(),
				onError() )
			},
			onError,
			onReadyTransaction
		)
		//close dialog after click add btn	
		$("#addTaskPanel").panel("close");
		//call function and displays class
		//displayTask();
		todayTask();

 });
 

//Display list of cars after press display btn
$("#footer").find("#displayCars_btn").click(function () {
	displayTask()
});

function displayTask(){
// Clear List
    $("#List").text("");
	//Render Each item in list
			db.transaction(
					function(tx){
						tx.executeSql( "SELECT * FROM task Where id > ? ",
						['0'], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}
									
									for (var i = 0; i < results.rows.length; i++) {
													var rowItem = results.rows.item(i);
													var ID = rowItem.id;
													var date = rowItem.date;
													var time = rowItem.time;
													var title = rowItem.title;
													var desc = rowItem.desc;
													var ListElement = $("#List");
													var ListItem = $('<li>\
																		<a data-name="View" data-role="panel" data-display="" href="#detailTask">\
																		<img src="images/task.jpeg">\
																		<h2></h2>\
																		<p>Date:'+ date +'</p>\
																		<a data-name="Delete" href="#" data-icon=delete >Delete Item</a>\
																		</a>\
																	 </li>')
													// Add Data to Item Element
													ListItem.attr("id", ID);
													ListItem.find("h2").text(title);
													ListItem.find('[data-name="View"]').attr("data-id", ID);
													ListItem.find('[data-name="Delete"]').attr("data-ID", ID);
													// Add Item Element to List Element
													ListElement.append(ListItem);
									};	//end of FOR
									
									// Refresh ListView Element
									$("#List").listview("refresh");
									
									// Add Click Events for List Item 
									$("#List").find('[data-name="View"]').click(function () {
										var ID = Number($(this).attr("data-ID"));
										Update(ID);
									});
								
									// Add Click Event for List Delete Button
									$("#List").find('[data-name="Delete"]').click(function () {
										var ID = Number($(this).attr("data-ID"));
										Delete(ID);
									}); 
							} ) // end of Select
					}); //end of db transaction	  	
}
function todayTask(){
// Clear List
    $("#todayList").text("");
	//Render Each item in list
			db.transaction(
					function(tx){
						tx.executeSql( "SELECT * FROM task",
						['0'], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}
									
									for (var i = 0; i < results.rows.length; i++) {
													var rowItem = results.rows.item(i);
													var ID = rowItem.id;
													var date = rowItem.date;
													var time = rowItem.time;
													var title = rowItem.title;
													var desc = rowItem.desc;
													var todayElement = $("#todayList");
													var todayItem = $('<li>\
																		<a data-name="View" data-role="panel" data-display="" href="#detailTask">\
																		<img src="images/task.jpeg">\
																		<h2></h2>\
																		<p>Date:'+ date +'</p>\
																		<a data-name="Delete" href="#" data-icon=delete >Delete Item</a>\
																		</a>\
																	 </li>')
													// Add Data to Item Element
													todayItem.attr("id", ID);
													todayItem.find("h2").text(title);
													todayItem.find('[data-name="View"]').attr("data-id", ID);
													todayItem.find('[data-name="Delete"]').attr("data-ID", ID);
													// Add Item Element to List Element
													todayElement.append(todayItem);
									};	//end of FOR
									
									// Refresh ListView Element
									$("#todayList").listview("refresh");
									
									// Add Click Events for List Item 
									$("#todayList").find('[data-name="View"]').click(function () {
										var ID = Number($(this).attr("data-ID"));
										Update(ID);
									});
								
									// Add Click Event for List Delete Button
									$("#todayList").find('[data-name="Delete"]').click(function () {
										var ID = Number($(this).attr("data-ID"));
										Delete(ID);
									}); 
							} ) // end of Select
					}); //end of db transaction	  	
}
	
function Update(ID){
	$("#detail").text("");
	console.log("ID passed " + ID);
			db.transaction(
				function(tx){
				tx.executeSql("SELECT *  FROM task Where id=?", [ID], function(tx,results){
							for (var i = 0; i < results.rows.length; i++) {
							var rowItem = results.rows.item(i);
							var ID = rowItem.id;
							var date = rowItem.date;
							var time = rowItem.time;
							var title = rowItem.title;
							var desc = rowItem.desc;
							var detailElement = $("#detail");
							var detailItem = $('<li>\
											\
											<h1>'+ title +'</h1>\
											<p>Description:<br>\
											- '+ desc +'</p>\
											<p>Date:'+ date +'</p>\
											<p>Time:'+ time +'\
											\
											</li>')
											// Add Item Element to List Element
											detailElement.append(detailItem);
									};	//end of FOR
						//Put the clicked List Data into TextFields on Edit Update Page 
				   })//end tx.exeSql
				 } //end fn
				); //end of db transaction	
}//end Update fn

$("#editCarPanel").find("#editCar_btn").click(function () {
	           //Panel Box add car button - insert the completed fields into DB THEN close panel THEN refresh listview
				get_Type 	= $("#editCarPanel").find("#CarType").val();
				get_Model 	= $("#editCarPanel").find("#CarModel").val();
								
				addTCarToDB(carID,get_Type,get_Model); 
				//close dialog after click add btn	
        		$("#editCarPanel").panel("close");
				//$("#List").listview("refresh");
				displayCars();
})//end btn select

function addTCarToDB(carID,get_Type,get_Model){
						//UPDATE DATA INTO DATABASE
						db.transaction(
							function (tx) {
								 tx.executeSql("UPDATE vechicles SET CarType=?, CarModel=? WHERE id=?;",[get_Type,get_Model,carID], onSuccessUpdate,onErrorUpdate )
							} //end fn (tx)
						)//end db trans	
						
}	


function Delete(ID) {
    // What to do when Deleted
			db.transaction(
				function(tx){
				tx.executeSql("DELETE FROM task where id=?", [ID], function(tx,results){
					 	var ItemElement = $("#List").find("li#" + ID);
						ItemElement.remove();
						$("#List").listview("refresh");
				})//end exe
			  } //end fn
			); //end of db transaction	
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


