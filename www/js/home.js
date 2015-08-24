
$(document).ready(function() {  

var db = window.openDatabase("LPO", "1.0", "My WebSQL LPO database", 5*1024*1024);
todayTask();
displayTask();
displayClass();

function todayTask()
{
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;

	  var yyyy = today.getFullYear();
	  if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = yyyy+'-'+mm+'-'+dd;

db.transaction(
					function(tx){
						tx.executeSql( 'SELECT * FROM task WHERE date = "'+ today +'"',
						[], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No task today!");
										return false;
									}
									else
									{
										alert("You have a task due today!");
									}
						                      }
						            ) // end of Select
						//end of db transaction
					            });
}

function displayTask(){
	//Render Each item in list
			db.transaction(
					function(tx){
						tx.executeSql( "SELECT * FROM task Where id > ? ",
						['0'], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}
									// Clear List
                                     $("#task").text("");
									for (var i = 0; i < results.rows.length; i++) {
													var rowItem = results.rows.item(i);
													var nomor = i + 1;
													var date = rowItem.date;
													var time = rowItem.time;
													var title = rowItem.title;
													var ListElement = $("#task");
													var ListItem = $('<li>\
										                                 '+ nomor +')\
																		<b>'+ title +'</b>\
																		<p><b>DueDate</b>: '+ date +' <b>DueTime</b>:' + time +'</p>\
																		\
																	 </li>')
													ListElement.append(ListItem);
									};	//end of FOR
									// Refresh ListView Element
									$("#task").listview("refresh");
							} ) // end of Select
					}); //end of db transaction	  	
}

function displayClass(){
			db.transaction(
					function(tx){
						tx.executeSql( "SELECT name,day,timefrom,timeto FROM studentClass Where id > ? ",
						['0'], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}
									// Clear List
                                    $("#class").text("");
									for (var i = 0; i < results.rows.length; i++) {
													var rowItem = results.rows.item(i);
													var name = rowItem.name;
													var day = rowItem.day;
													var timefrom = rowItem.timefrom;
													var timeto = rowItem.timeto;
													var ListElement = $("#class");
													var ListItem = $('<li>\
																		<p><b>'+ day +'</b>:'+ name +' (<b>Time</b>: '+ timefrom +' -'+ timeto +') </p>\
																	 </li>')
																	 ListElement.append(ListItem);
									};	//end of FOR
									
							} ) // end of Select
					}); //end of db transaction	  	
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


