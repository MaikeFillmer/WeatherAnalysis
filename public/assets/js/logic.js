
	/**************************************************************/
	/* EXTRACTING AND ANALYSING THE LAST TEN YEARS OF INFORMATION */
	/**************************************************************/

	/* Hide the Loading Messages */
	$('#loading-image1').hide();
	$('#loading-image2').hide();
	$('#explanation').hide();
	console.log('in  the script')

	/* Click Listener on Button */
	$("#getData").click(function() {
		
		/* Set Starting Variables*/
		var csv = "Date,Temp,Humidity,Pressure\n"  //headers for csv string
		var startDate = moment("1/1/2006", "MM-DD-YYYY").format("YYYYMMDD");  //set start date 
		var numberOfDays = moment(startDate).diff(moment("1/1/2017", "MM-DD-YYYY"),'days')*-1  //calculate days between start date and 1/1/17. Due to ordering of dates, this will return a negative value, so it needs to be multiplied by -1. For code cleanliness, change order and remove -1.
		var counter = 0; //This counter ensures all AJAX calls are complete before continuing.
		var date, temp, pressure, humidity, slope, intercept, y1, y2;

		/* Retrieving relevant information from JSON response from Weather Underground API */
		function getAPIResponseData(parsed_json) {
			date = parsed_json['history']['date']['mon'] + "/" + parsed_json['history']['date']['mday'] + "/" + parsed_json['history']['date']['year'];
			temp = parsed_json['history']['dailysummary']['0']['meantempi'];
			pressure = parsed_json['history']['dailysummary']['0']['meanpressurei'];
			humidity = parsed_json['history']['observations']['6']['hum'];
		}

		/* Function to Extract Information from API */
		function extractDailyWeatherData(callback) {
			/* Show Loading Message */
			$('#loading-image1').show();
			$('#instructions').hide();

			for(i=0; i<numberOfDays; i++){			
				(function(i){
					jQuery(document).ready(function($) {
						$.ajax({
							url : "http://api.wunderground.com/api/***** YOUR API KEY HERE *****/history_" + startDate + "/q/CA/San_Francisco.json", 
							dataType : "jsonp",
							success : function(parsed_json) {

								getAPIResponseData(parsed_json);
								/* Add Retrieved Info to csv String */
								csv += date + "," + temp + "," + humidity + "," + pressure + "\n"

								counter++;
								console.log(counter)
								/* Once all AJAX calls are completed, the callback function is invoked. */
								if(counter == numberOfDays){ 
									$('#loading-image1').hide(); //Since all AJAX calls are complete, hide the loading image.
									callback();
								}
							}				  
						});
						startDate = moment(startDate).add(1, 'day').format("YYYYMMDD"); //incrementing the start date						
					});
				})(i); //using closure to make sure that there is one ajax call per i value
			}
		}

		/* Retrieve and Calculate Coordinates for trendline */
		function calculateTrendlineCoordinates (data) {
			slope = data[1][0];
			intercept = data[1][1];
			y1 = slope * 2006 + intercept;
			y2 = slope * 2016 + intercept;
		}

		function trace(x, y, mode, name) {
			this.x = x;
			this.y = y;
			this.mode = mode;
			this.name = name
		}
		/* Invoking extracting Weather Data Function */
		extractDailyWeatherData(function(){  //the following is the callback function. 

			/* Post the csv string to the server to save it as a csv file */
			$.post("/sendData", csv)

			/* Show the next loading image */
			$('#loading-image2').show();

	  		/* Analyse the Weather Data with a get request to the server */
			$.get('/fetchROutput', function(data) {

				/* Now that the Analysis is complete, hide the loading screen and show the explanation */
				$('#loading-image2').hide();
				$('#explanation').show();

				/********** Top Ten Hottest Days Plot **********/
				calculateTrendlineCoordinates(data);			

				/**** Plotting the Data *****/

				/* Set up the plotting Variables */
				var trace1 = new trace(data[0]["Group.1"],data[0].x,'markers', 'Mean of Top Ten Temperatures')
				var trace2 = new trace([2006,2016], [y1,y2], 'lines', 'Linear Trend Line');
				
				var plotData = [ trace1, trace2 ];

				var layout = {
					autosize: false,
					width: 680,
					height: 500,
					title:'Average of Ten Hottest Days Over 11 Years',
					legend: {"orientation": "h"}
				};

				/* Generate the Plot */
				Plotly.newPlot('myDiv', plotData, layout);

				/********** Mean and Max Temperature Per Year Plot **********/

				/**** Plotting the Data *****/

				/* Set up the plotting Variables */
				var trace3 = new trace(data[2]["Group.1"],data[2].x,'markers', 'Mean Yearly Temperature')
				var trace4 = new trace(data[3]["Group.1"], data[3].x, 'markers', 'Max Yearly Temperature');
				

				var plotData = [ trace3, trace4 ];

				var layout = {
					autosize: false,
					width: 680,
					height: 500,
					title:'Average and Max Temperature Over the Last 11 Years',
					legend: {"orientation": "h"}
				};

				/* Generate the Plot */
				Plotly.newPlot('myDiv2', plotData, layout);
			})
		}); 
	});