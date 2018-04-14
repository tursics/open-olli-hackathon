/*jslint browser: true*/
/*global require*/

//-----------------------------------------------------------------------

function formatDate(d) {
	'use strict';

	return d.getFullYear() + '-' +
		('0' + (d.getMonth() + 1)).slice(-2) + '-' +
		('0' + d.getDate()).slice(-2);
}

function exportHeader(obj) {
	'use strict';

	var str = '',
		p;
	for (p in obj) {
		if (obj.hasOwnProperty(p)) {
			str += p + ';';
		}
	}

	str = str.slice(0, str.length - 1);
	str += '\n';

	return str;
}

function exportData(obj) {
	'use strict';

	var str = '',
		p;
	for (p in obj) {
		if (obj.hasOwnProperty(p)) {
			str += obj[p] + ';';
		}
	}

	str = str.slice(0, str.length - 1);
	str += '\n';

	return str;
}

function splitVehicleStatesFiles(path) {
	'use strict';

	var fs = require('fs'),
		csv = require('fast-csv'),
		stream = fs.createReadStream(path + 'vehicle_states.csv');

	csv.fromStream(stream, {headers: true, delimiter: ';'})
//		.validate(function (data) {
//			return data.last_seen === '2018-02-13 15:25:08+01';
//		})
//		.on("data-invalid", function (data) {
//			//do something with invalid row
//		})
		.on("data", function (data) {
			var date = formatDate(new Date(data.last_seen)),
				datePath = path + date + '-vehicle-states.csv';

			if (!fs.existsSync(datePath)) {
				fs.appendFileSync(datePath, exportHeader(data));
			}

			fs.appendFileSync(datePath, exportData(data));
		});
//		.on("end", function () {
//			console.log("done");
//		});
}

splitVehicleStatesFiles('../data/');
