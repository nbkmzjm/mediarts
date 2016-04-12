function getSunday(d){

			var d = new Date(d);
			var diff = d.getDate() - d.getDay();
			
			return new Date(d.setDate(diff));

		}