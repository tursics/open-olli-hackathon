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

function sortVehicleStatesFiles(path) {
	'use strict';

	var fs = require('fs'),
		csv = require('fast-csv'),
		file;

	fs.readdirSync(path).forEach(file => {
		if (-1 !== file.indexOf('vehicle-states.csv')) {
			var stream = fs.createReadStream(path + file),
				content = [],
				i;

			csv.fromStream(stream, {headers: true, delimiter: ';'})
				.on("data", function (data) {
					content.push(data);
				})
				.on("end", function () {
					content.sort(function(a, b) {
						return a.id - b.id;
					});

					file = file.replace('states', 'routes');
					fs.writeFileSync(path + file, exportHeader(content[0]));
					for (i = 0; i < content.length; ++i) {
						fs.appendFileSync(path + file, exportData(content[i]));
					}
				});
		}
	});
}

sortVehicleStatesFiles('../data/');
