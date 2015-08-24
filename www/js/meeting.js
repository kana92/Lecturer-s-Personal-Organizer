
$(document).ready(function() {  

	var db = window.openDatabase("LPO", "1.0", "My WebSQL LPO database", 5*1024*1024);
	db.transaction(
		function(tx){
			console.log("in create");
			//INTEGER PRIMARY KEY AUTOINCREMENT
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS meetingT (id INTEGER PRIMARY KEY AUTOINCREMENT, name, location, date, time, meetDes)",
				[],
				onSuccessExecuteSql,
				onError
			) // end tx exe
		},//end tx fn
		onError,
		onReadyTransaction,
		displayMeeting()
	)//end db trans
	
	

//Dialog Box add button - insert the completed fields into DB THEN close dialog box THEN refresh listview
 $("#addMeetingPanel").find("#addMeeting_btn").click(function () {
	 	var rowItem;
		var checkName;
		var checkLocation
		var checkDate;
		var checkTime; 
		var checkmeetDes;
	 //Condition used to check whether input had been enter or not for each input type parameter
	    if ($("#addMeetingPanel").find("#name").val() =="" || $("#addMeetingPanel").find("#name").val()==null){
      		alert("Please enter class name");
      		return false;
      	}
      	
        if ($("#addMeetingPanel").find("#location").val() =="" || $("#addMeetingPanel").find("#location").val()==null){
      		alert("Please enter location");
      		return false;
      	}
					db.transaction(
					function(tx){
						tx.executeSql( "SELECT name,location,date,time,meetDes FROM meetingT Where id > ? ",
						['0'], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}
									
									for (var i = 0; i < results.rows.length; i++) {
													rowItem = results.rows.item(i);
													checkName = rowItem.name;
													checkLocation = rowItem.location;
													checkDate = rowItem.date;
													checkTime = rowItem.time;
													checkmeetDes = rowItem.meetDes;

													};	//end of FOR
	
													} ) // end of Select
						
													}); //end of db transaction	  
        if ($("#addMeetingPanel").find("#date").val()== checkDate && $("#addMeetingPanel").find("#time").val()== checkTime){
      		alert("There's already same meeting created with identical date and time!");
      		return false;
      	                       }
	 //collect class data from input fields
 		get_name 	= $("#addMeetingPanel").find("#name").val();
		get_location 	= $("#addMeetingPanel").find("#location").val();
		get_date 	= $("#addMeetingPanel").find("#date").val();
		get_time 	= $("#addMeetingPanel").find("#time").val();
		get_meetDes 	= $("#addMeetingPanel").find("#meetDes").val();
		//INSERT Class DATA INTO DATABASE

		db.transaction(
			function(tx){
				tx.executeSql( "INSERT INTO meetingT(name, location, date, time, meetDes) VALUES(?,?,?,?,?)",
				[get_name, get_location, get_date, get_time, get_meetDes],
				onSuccessExecuteSql(),
				onError() )
			},
			onError,
			onReadyTransaction
		)
		//close dialog after click add btn	
        $("#addMeetingPanel").panel("close");
		//call function and displays class
		displayMeeting();
 });
 

function displayMeeting(){
// Clear List
    $("#List").text("");
	//Render Each item in list
			db.transaction(
					function(tx){
						tx.executeSql( "SELECT id,name,location,date,time,meetDes FROM meetingT Where id > ? ",
						['0'], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}
									
									for (var i = 0; i < results.rows.length; i++) {
													var rowItem = results.rows.item(i);
													var ID = rowItem.id;
													var name = rowItem.name;
													var location = rowItem.location;
													var date = rowItem.date;
													var time = rowItem.time;
													var ListElement = $("#List");
													var ListItem = $('<li>\
																		<a data-name="View" data-role="panel" data-display="overlay" href="#viewMeetingPanel">\
																		<img src="images/meeting.png">\
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
										View(ID);
									});
									
									// Add Click Event for List Delete Button
									$("#List").find('[data-name="Delete"]').click(function () {
										var ID = Number($(this).attr("data-ID"));
										Delete(ID);
									}); 
									
							} ) // end of Select
					}); //end of db transaction	  	
}

function View(ID){
	console.log("ID passed " + ID);
			db.transaction(
				function(tx){
				tx.executeSql("SELECT *  FROM meetingT Where id=?", [ID], function(tx,results){
						rowItem = results.rows.item(0);
						meetingID = rowItem.id;
						//Put the clicked List Data into TextFields on Edit Update Page
						
						$("#viewMeetingPanel").find("#name").val(rowItem.name);
						$("#viewMeetingPanel").find("#location").val(rowItem.location);
						$("#viewMeetingPanel").find("#date").val(rowItem.date);
						$("#viewMeetingPanel").find("#time").val(rowItem.time);
						$("#viewMeetingPanel").find("#meetDes").val(rowItem.meetDes);
				   })//end tx.exeSql
				 } //end fn
				); //end of db transaction	
}//end Update fn


function Delete(ID) {
    // What to do when Deleted
			db.transaction(
				function(tx){
				tx.executeSql("DELETE FROM meetingT where id=?", [ID], function(tx,results){
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


