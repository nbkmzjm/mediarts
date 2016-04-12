function calendarPick(){

			var calenderPick = $('#calenderPick');
			//- calenderPick.html("");

			var dateCalender = document.createElement('input');
				dateCalender.id = 'calendar';
				
				dateCalender.value = new Date().toLocaleDateString()
				//- dateCalender.datepicker({onSelect: function(){
				//- 	}});
				dateCalender.addEventListener('mouseenter', function(){
					$("#calendar").datepicker({onSelect: function(){
						$.post('/ajaxUser').done(mainSC);
					}});
				})
				
				

			var dateBackward = document.createElement('span');
				dateBackward.id = 'dateBackward';
				dateBackward.className = 'glyphicon glyphicon-step-backward'
				dateBackward.addEventListener('click', function(){

				var dateM7 = new Date(dateCalender.value);
				dateM7.setDate(dateM7.getDate()-7);
				dateCalender.value = dateM7.toLocaleDateString();
				$.post('/ajaxUser', {clickedData:true}).done(mainSC);

				})


			var dateForward = document.createElement('span');
				dateForward.id = 'dateForward';
				dateForward.className = 'glyphicon glyphicon-step-forward'
				dateForward.addEventListener('click', function(){

				
				var dateP7 = new Date(dateCalender.value);
				dateP7.setDate(dateP7.getDate()+7);
				dateCalender.value = dateP7.toLocaleDateString();
				$.post('/ajaxUser', {clickedData:true}).done(mainSC);

				})

			calenderPick.append(dateBackward)
			calenderPick.append(dateCalender)
			calenderPick.append(dateForward)

			
		}