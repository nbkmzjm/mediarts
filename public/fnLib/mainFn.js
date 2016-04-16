function getSunday(d){

			var d = new Date(d);
			var diff = d.getDate() - d.getDay();
			
			return new Date(d.setDate(diff));

		}

Date.prototype.toFullDate = function(){
		var d = {
			month:this.getMonth(), 
			date:this.getDate(),
			year:this.getFullYear()
				}
		if (this.getMonth()<10){d.month = '0' + (this.getMonth()+1)}
		if (this.getDate() <10){d.date = '0' + this.getDate()}
		d.year
		return (d.month +'/'+d.date+'/'+d.year)
	}