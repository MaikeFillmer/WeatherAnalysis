// DEPENDENCIES
var express = require('express');
var bodyParser = require('body-parser'); //Extracts the entire body portion of an incoming request stream and exposes it on req.body.
var path = require('path');
var methodOverride = require('method-override'); //Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
var fs = require('fs');
var spawn = require('child_process').spawn //run a child process (the Rscript)



// EXPRESS CONFIGURATION
var app = express(); 
var PORT = process.env.PORT || 3000; 

// BODYPARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

//METHOD OVERRIDE
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

//START SERVER
app.listen(PORT, function() {
	console.log("App listening on PORT: " + PORT);
});

//ROUTES

// Render index page
app.get('/', function(req,res) {
        res.sendFile(path.join(__dirname + '/index.html'));
        
    });

// Save data to a csv file
app.post('/sendData', function(req, res){
	var fileContent = Object.keys(req.body)[0];
	
	fs.writeFile('weathertest.csv', fileContent, (err) => {
		if (err) throw err;
		console.log('It\'s saved!');
	});
	
})

// Run R script and return information
app.get('/fetchROutput', function(req,res) {
	
	//Run R
	var R = spawn('Rscript', ['weatherAnalysis.r'])

	R.stdout.on('data', function(data) {
		console.log('stdout: ' + data);
	});


	 R.on('exit', function(code){ //execute the following code when the R script is finished:
	 	console.log('got exit code: ' + code);

	 	//Capture incoming data
	 	var graphOutput = fs.readFileSync("rGraphOutput.json");
	 	var jsonGraphContent = JSON.parse(graphOutput);

	 	var graphStatsOutput = fs.readFileSync("rGraphStatsOutput.json");
		var jsonGraphStatsOutput = JSON.parse(graphStatsOutput);

		var meanTempOutput = fs.readFileSync("rMeanTempOutput.json");
		var jsonMeanTempOutput = JSON.parse(meanTempOutput);

		var maxTempOutput = fs.readFileSync("rMaxTempOutput.json");
		var jsonMaxTempOutput = JSON.parse(maxTempOutput);

		var jsonAllData = [jsonGraphContent, jsonGraphStatsOutput, jsonMeanTempOutput, jsonMaxTempOutput];

		
		res.send(jsonAllData)
	 });
	
})



 



