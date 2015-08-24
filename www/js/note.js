
$(document).ready(function() {  

	var db = window.openDatabase("LPO", "1.0", "My WebSQL LPO database", 5*1024*1024);
	viewNote();
		db.transaction(
		function(tx){
			console.log("in create");
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
	
function viewNote()
{	  
 $("#viewNote").text("");
			db.transaction(
					function(tx){
						tx.executeSql( "SELECT * FROM LNote Where id > ? ",
						['0'], function(tx,results){
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
						viewNote();
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
				get_Cat     = $("#detailNotePanel").find("#noteCat").val();
				get_Title 	= $("#detailNotePanel").find("#noteTitle").val();
				get_Desc 	= $("#detailNotePanel").find("#noteDesc").val();
								
				addNoteToDB(noteID,get_Cat,get_Title,get_Desc); 
				//close dialog after click add btn	
				
				viewNote();
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
	 	get_Cats        = $("#addNote").find("#noteCat").val();
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
		viewNote();
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


