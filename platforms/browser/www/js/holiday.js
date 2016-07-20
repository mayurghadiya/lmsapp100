db = window.openDatabase('lms', '1.0', 'Learning Management System', '200000000');

function getAllHoliday() {
	db.transaction(getHolidays);
}

function getHolidays(tx) {
	var sql = "SELECT * FROM holiday";

	tx.executeSql(sql, [], renderHolidayIntoTable);
}

function renderHolidayIntoTable(tx, results) {
	var len = results.rows.length;
	
	for(var i=0; i<len; i++) {
		var holiday = results.rows.item(i);
		$('#holiday-details').append("<tr>" +
				"<td>" + holiday.holiday_id + "</td>" +
				"<td>" + holiday.holiday_name + "</td>" +
				"<td>" + holiday.holiday_startdate + "</td>" +
			"</tr>");
	}
}

function syncHoliday() {
	db.transaction(createHolidayDataTable);
	$("#holiday-details").find("tr:gt(0)").remove();
	setTimeout(function() {
		getAllHoliday();
		alert('sync is done');
	}, 1000);
}