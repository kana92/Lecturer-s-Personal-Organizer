$(document).ready(function() {  

	var db = window.openDatabase("LPO", "1.0", "My WebSQL LPO database", 5*1024*1024);
	displayLecturer();
		db.transaction(
		function(tx){
			console.log("in create");
			//INTEGER PRIMARY KEY AUTOINCREMENT
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS studentClass (id INTEGER PRIMARY KEY AUTOINCREMENT, name, lecturer, location, day, timefrom, timeto)",
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
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS lecturerInfo (id INTEGER PRIMARY KEY AUTOINCREMENT, lectName, office, telno, lectEmel)",
				[],
				onSuccessExecuteSql,
				onError
			) // end tx exe
		},//end tx fn
		onError,
		onReadyTransaction
	)//end db trans
	
function displayLecturer()
{	  
 $("#displayLecturer").text("");
			db.transaction(
					function(tx){
						tx.executeSql( "SELECT * FROM lecturerInfo Where id > ? ",
						['0'], function(tx,results){
									if(results.rows.length == 0) {
										console.log("No records found");
										return false;
									}
									
									for (var i = 0; i < results.rows.length; i++) {
													var rowItem = results.rows.item(i);
													var ID = rowItem.id;
													var lectName = rowItem.lectName;
													var ListElement = $("#displayLecturer");
													var ListItem = $('<li>\
													                  <a data-name="View" data-role="dialog" href="#detailLecturer">\
																		<img src="images/profile.png">\
																		<h2></h2>\
																		<a data-name="Delete" href="#" data-icon=delete ></a>\
																	 </a>\
																	 </li>')
													ListItem.attr("id", ID);
													ListItem.find("h2").text(lectName);
													ListItem.find('[data-name="View"]').attr("data-id", ID);
													ListItem.find('[data-name="Delete"]').attr("data-ID", ID);
													// Add Item Element to List Element
													ListElement.append(ListItem);
									};	//end of FOR
									// Refresh ListView Element
									$("#displayLecturer").listview("refresh");
									
									$("#displayLecturer").find('[data-name="View"]').click(function () {
								    var ID = Number($(this).attr("data-ID"));
									detail(ID);
									});
									
									// Add Click Event for List Delete Button
									$("#displayLecturer").find('[data-name="Delete"]').click(function () {
										var ID = Number($(this).attr("data-ID"));
										Delete(ID);
									}); 
									
							} ) // end of Select
					}); //end of db transaction	  
}

function Delete(ID) {
    // What to do when Deleted
			db.transaction(
				function(tx){
				tx.executeSql("DELETE FROM lecturerInfo where id=?", [ID], function(tx,results){
					 	var ItemElement = $("#displayLecturer").find("li#" + ID);
						ItemElement.remove();
						$("#displayLecturer").listview("refresh");
				})//end exe
			  } //end fn
			); //end of db transaction	
}

function detail(ID){
	console.log("ID passed " + ID);
	$("#detail").text("");
			db.transaction(
				function(tx){
				tx.executeSql("SELECT *  FROM lecturerInfo Where id=?", [ID], function(tx,results){
						$("detail").text('');
						rowItem = results.rows.item(0);
						ID = rowItem.id;
						var lectName = rowItem.lectName;
						var office = rowItem.office;
						var telno = rowItem.telno;
						var lectEmel = rowItem.lectEmel;
						
						var ListElement = $("#detail");
						var ListItem = $('<li>\
										<img src="images/profile.png">\
										<h2></h2>\
										<p>'+ office +'</p>\
										<p><a href="tel:'+ telno +'"> Call Lecturer </a></p>\
										<p><a href="mailto:'+ lectEmel +'">Email Lecturer</a></p>\
										</li>')
										// Add Data to Item Element
										ListItem.attr("id", ID);
										ListItem.find("h2").text(lectName);
										// Add Item Element to List Element
										ListElement.append(ListItem);
						$("#detail").listview("refresh");
				   })//end tx.exeSql
				 } //end fn
				); //end of db transaction	
}//end Update fn
	
 $("#addLecturer").find("#addLecturer_btn").click(function () {
	 //collect class data from input fields
 		get_lectName 	= $("#addLecturer").find("#lectName").val();
		get_office 	= $("#addLecturer").find("#office").val();
		get_telno   = $("#addLecturer").find("#telno").val();
		get_lectEmel 	= $("#addLecturer").find("#lectEmel").val();
		//INSERT DATA INTO DATABASE
		db.transaction(
			function(tx){
				tx.executeSql( "INSERT INTO lecturerInfo(lectName, office, telno, lectEmel) VALUES(?,?,?,?)",
				[get_lectName , get_office, get_telno, get_lectEmel],
				onSuccessExecuteSql(),
				onError() )
			},
			onError,
			onReadyTransaction
			
		)
		//close dialog after click add btn	
		$("#addLecturer").dialog("close");
		//call function and displays class
		displayLecturer();
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


