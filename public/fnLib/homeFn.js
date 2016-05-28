function calendarPick(){


			// <ul class="pager">
  	// 			<li><a href="#">Previous</a></li>
			//   	<li><a href="#">Next</a></li>
			// </ul>

			var calenderPick = $('#calenderPick');
			//- calenderPick.html("");

			
			
			var ul = document.createElement('ul')
			ul.className = 'pager'	


				var MBackward = document.createElement('li');
						var a = document.createElement('a')
						a.href = "#"
						
						MBackward.appendChild(a)
							var span = document.createElement('span');
							span.className = 'glyphicon glyphicon-step-backward'
						a.appendChild(span)
						a.appendChild(document.createTextNode('Month'))
					MBackward.addEventListener('click', function(){

						var dateM7 = new Date(dateCalender.value);
						dateM7.setDate(dateM7.getDate()-30);
						dateCalender.value = dateM7.toLocaleDateString();
						$.post('/ajaxUser', {clickedData:true}).done(mainSC);

					})
				ul.appendChild(MBackward)

				var dateBackward = document.createElement('li');
						var a = document.createElement('a')
						a.href = "#"
						
						dateBackward.appendChild(a)
							var span = document.createElement('span');
							span.className = 'glyphicon glyphicon-step-backward'
						a.appendChild(span)
						a.appendChild(document.createTextNode('Week'))
					dateBackward.addEventListener('click', function(){

					var dateM7 = new Date(dateCalender.value);
					dateM7.setDate(dateM7.getDate()-14);
					dateCalender.value = dateM7.toLocaleDateString();
					$.post('/ajaxUser', {clickedData:true}).done(mainSC);

					})
				ul.appendChild(dateBackward)


				var li = document.createElement('li');
					var a = document.createElement('a')
						a.href = "#"
							var dateCalender = document.createElement('input');
							dateCalender.id = 'calendar';
							
							// dateCalender.type = 'hidden'
							dateCalender.style.textAlign = 'center'
							dateCalender.style.fontWeight = 'bold'
							dateCalender.style.width = '125px'
							dateCalender.style.fontSize = '120%'
							dateCalender.style.border = '2px transparent'
							dateCalender.value = new Date().toLocaleDateString()
						a.appendChild(dateCalender)
					li.appendChild(a)
					var span = document.createElement('span');
					span.className = 'glyphicon glyphicon-calendar'
					li.appendChild(span)
				
					li.addEventListener('click', function(){
						$("#calendar").datepicker({onSelect: function(){
							$.post('/ajaxUser').done(mainSC);
						}});

						dateCalender.focus()

					})
					
				ul.appendChild(li)

				var today = document.createElement('li');
						var a = document.createElement('a')
						a.href = "#"
						a.appendChild(document.createTextNode('Today'))
						today.appendChild(a)
					// dateBackward.id = 'dateBackward';
					// dateBackward.className = 'glyphicon glyphicon-step-backward'
					today.addEventListener('click', function(){

						
					
					// dateCalender.value = new Date().toLocaleDateString();
					location.reload();

					})
				ul.appendChild(today)


				var dateForward = document.createElement('li');
						var a = document.createElement('a')
						a.href = "#"
						a.appendChild(document.createTextNode('Week'))
						dateForward.appendChild(a)
							var span = document.createElement('span');
							span.className = 'glyphicon glyphicon-step-forward'
						a.appendChild(span)
					dateForward.addEventListener('click', function(){
					var dateP7 = new Date(dateCalender.value);
					dateP7.setDate(dateP7.getDate()+14);
					dateCalender.value = dateP7.toLocaleDateString();
					$.post('/ajaxUser', {clickedData:true}).done(mainSC);

					})
				ul.appendChild(dateForward)


				var MForward = document.createElement('li');
						var a = document.createElement('a')
						a.href = "#"
						a.appendChild(document.createTextNode('Month'))
						MForward.appendChild(a)
							var span = document.createElement('span');
							span.className = 'glyphicon glyphicon-step-forward'
						a.appendChild(span)
						
					MForward.addEventListener('click', function(){

						var dateM7 = new Date(dateCalender.value);
						dateM7.setDate(dateM7.getDate()+30);
						dateCalender.value = dateM7.toLocaleDateString();
						$.post('/ajaxUser', {clickedData:true}).done(mainSC);

					})
					ul.appendChild(MForward)



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