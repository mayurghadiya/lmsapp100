//database object
var db;

var base_url = 'http://192.168.1.28/lms_mobile_app_100/';

//assign database status variable
//var isDbCreated = false;
var isDbCreated = localStorage.dbcreated;

document.addEventListener('deviceready', OnDeviceReady, false);

function OnDeviceReady() {
	//open the database
	console.log('device is ready');

	//open database (size 200Mb)
	db = window.openDatabase('lms', '1.0', 'Learning Management System', '200000000');

	if(!isDbCreated) {
		//database and datatable is available
		//create datatables
		console.log('create new datatables');

		//datatable transaction list
		db.transaction(createEventDataTable);
		db.transaction(createHolidayDataTable);

		localStorage.dbcreated = true;
		//alert('datatables created');
	}
}


function createEventDataTable(tx) {
	console.log('create event datatable');

	var sql = 'DROP TABLE IF EXISTS event';
	tx.executeSql(sql);

	sql = "CREATE TABLE IF NOT EXISTS event ( " +
				"event_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"event_name VARCHAR(255) NOT NULL, " + 
				"event_location VARCHAR(255), " +
				"event_desc TEXT, " +
				"group_id VARCHAR(10), " +
				"event_date VARCHAR(50), " +
				"event_end_date	VARCHAR(50), " +
				"created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, " + 
				"updated_date TIMESTAMP CURRENT_TIMESTAMP, " +
				"status TINYINT)";
	tx.executeSql(sql);

	console.log('event datatable is created');

	initSyncEvent();
}

function initSyncEvent() {	
	$.ajax({
		url: base_url + 'event',
		type: 'GET',
		success: function(content){
			var events = jQuery.parseJSON(content);
			$.each(events, function(key, value){
				db.transaction(function(tx){
					console.log(value.holiday_id);
					tx.executeSql("INSERT INTO event (event_name, event_location, event_desc, group_id, event_date, event_end_date, created_date, updated_date, status) VALUES ('" + 
									value.event_name + "', '" + value.event_location + "', '" + 
									value.event_desc + "', '" + value.group_id + "', '" + 
									value.event_date + "', '" + value.event_end_date + "', '" + 
									value.created_date + "', '" + value.updated_date + "', '" + 
									value.status + "')");
				});
				
			});
		}
	});
	//alert('data is inserted');
}

function createHolidayDataTable(tx) {
	console.log('create holiday datatable');

	var sql = 'DROP TABLE IF EXISTS holiday';
	tx.executeSql(sql);

	sql = "CREATE TABLE IF NOT EXISTS holiday ( " + 
				"holiday_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"holiday_name VARCHAR(255), " +
				"holiday_startdate VARCHAR(50), " +
				"holiday_enddate VARCHAR(50), " + 
				"holiday_year VARCHAR(10), " + 
				"created_date VARCHAR(50), " +
				"updated_date VARCHAR(50), " +
				"holiday_status VARCHAR(50))";

	tx.executeSql(sql);

	console.log('holiday datatable is created');

	initSyncHoliday();
}

function initSyncHoliday() {
	$.ajax({
		url: base_url + 'holiday/index',
		type: 'GET',
		success: function(content) {
			var holiday = jQuery.parseJSON(content);
			$.each(holiday, function(key, value){
				db.transaction(function(tx){
					tx.executeSql("INSERT INTO holiday VALUES ('" + value.holiday_id + "', '" + 
						value.holiday_name +"', '" + value.holiday_startdate + "', '" + 
						value.holiday_enddate + "', '" + value.holiday_year + "', '" + 
						value.created_date + "', '" + value.updated_date + "', '" + 
						value.holiday_status + "')");
				});
			});
		}
	});
}