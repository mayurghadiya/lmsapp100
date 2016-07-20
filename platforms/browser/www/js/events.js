db = window.openDatabase('lms', '1.0', 'Learning Management System', '200000000');

function getAllEvents() {
	db.transaction(getEvents);
}

function getEvents(tx) {
	var sql = "SELECT * FROM event";

	tx.executeSql(sql, [], renderEventIntoTable);
}

function renderEventIntoTable(tx, results) {
	var len = results.rows.length;

	for(var i=0; i<len; i++) {
		var event = results.rows.item(i);
		$('#event-details').append('<tr>'+
				'<td>' + event.event_id + '</td>' +
				'<td>' + event.event_name + '</td>' +
				'<td>' + event.event_location + '</td>' +
				'<td>' + event.event_date + '</td>' +
			'</tr>');
	}
}

function syncEvents() {	
	db.transaction(createEventDataTable);
	$("#event-details").find("tr:gt(0)").remove();
	setTimeout(function() {
		getAllEvents();
		alert('sync is done');
	}, 500);
}