function calendarPick(){


			// <ul class="pager">
  	// 			<li><a href="#">Previous</a></li>
			//   	<li><a href="#">Next</a></li>
			// </ul>

			var calenderPick = $('#calenderPick');
			//- calenderPick.html("");

			
			
			var ul = document.createElement('ul')
			ul.className = 'pager'	

				var dateBackward = document.createElement('li');
						var a = document.createElement('a')
						a.href = "#"
						a.appendChild(document.createTextNode('Previous'))
						dateBackward.appendChild(a)
					// dateBackward.id = 'dateBackward';
					// dateBackward.className = 'glyphicon glyphicon-step-backward'
					dateBackward.addEventListener('click', function(){

					var dateM7 = new Date(dateCalender.value);
					dateM7.setDate(dateM7.getDate()-7);
					dateCalender.value = dateM7.toLocaleDateString();
					$.post('/ajaxUser', {clickedData:true}).done(mainSC);

					})
				ul.appendChild(dateBackward)


				var li = document.createElement('li');
					var dateCalender = document.createElement('input');
					// dateCalender.type = 'date'
					dateCalender.id = 'calendar';

					dateCalender.style.textAlign = 'center'
					dateCalender.style.fontWeight = 'bold'
					dateCalender.style.width = '100px'
					dateCalender.style.fontSize = '120%'
					dateCalender.style.border = '2px solid #3C96DC'
					
					dateCalender.value = new Date().toLocaleDateString()
					//- dateCalender.datepicker({onSelect: function(){
					//- 	}});
					dateCalender.addEventListener('mouseenter', function(){
						$("#calendar").datepicker({onSelect: function(){
							$.post('/ajaxUser').done(mainSC);
						}});
					})
					li.appendChild(dateCalender)
				ul.appendChild(li)


				var dateForward = document.createElement('li');
						var a = document.createElement('a')
						a.href = "#"
						a.appendChild(document.createTextNode('Next'))
						dateForward.appendChild(a)
					// dateBackward.id = 'dateBackward';
					// dateBackward.className = 'glyphicon glyphicon-step-backward'
					dateForward.addEventListener('click', function(){

						
					var dateP7 = new Date(dateCalender.value);
					dateP7.setDate(dateP7.getDate()+7);
					dateCalender.value = dateP7.toLocaleDateString();
					$.post('/ajaxUser', {clickedData:true}).done(mainSC);

					})
				ul.appendChild(dateForward)



				// var dateForward = document.createElement('span');
				// 	dateForward.id = 'dateForward';
				// 	dateForward.className = 'glyphicon glyphicon-step-forward'
				// 	dateForward.addEventListener('click', function(){

					
				// 	var dateP7 = new Date(dateCalender.value);
				// 	dateP7.setDate(dateP7.getDate()+7);
				// 	dateCalender.value = dateP7.toLocaleDateString();
				// 	$.post('/ajaxUser', {clickedData:true}).done(mainSC);

				// 	})

			calenderPick.append(ul)
			// calenderPick.append(dateCalender)
			// calenderPick.append(dateForward)

			
		}