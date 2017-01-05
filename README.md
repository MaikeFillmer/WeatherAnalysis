# Weather Data Analysis

This App retrieves the last 11 years of weather data for San Francisco, CA and calculates and displays the mean and max temperature per year as well as the average of the top ten hottest days per year.

### Tech

This app uses:

* HTML
* NodeJS
* CSS
* Twitter Bootstrap
* Express
* R
* jQuery
* Javascript

### Installation

Clone the Repo to download the code!

Important Changes to Make:

* In the weatherAnalysis.R code, change the library directory (wherever you want to install R packages) and working directory (wherever the repo is) to the relevant locations on your computer. There are 5 lines that need to be changed:
![](/public/Directory1.PNG)
![](/public/Directory2.PNG)
![](/public/Directory3.PNG)
![](/public/Directory4.PNG)
* In the javascript AJAX call to the api, make sure to plug in your own API key
![](/public/APIKey.PNG)

Install the dependencies and start the server.

```sh
$ npm install
$ node server.js
```

You can then go to localhost in your browser and interact with the App.

### Use

After starting the server and going to local host in the browser, you can hit the "Get and Display Data" button to retrieve and display the data. There is a lot of data being requested from the weather underground API, so it may take quite some time for the retrieval to complete. Then, the R script is called to analyse the data, which also takes some time to run before finally displaying the data as two separate graphs. 

### Visualizations
Scatter plots and trend lines were used to visualize the data and analysis I did. I would also use a scatter plot to display the entire batch of information, if I wanted to display all of the data. I could have also used a histogram to show how often certain temperatures occured during a year/season/month. 

### Network Protocols
There are a few protocols used in order to request data from the Weather Underground API. At the highest level, the IP (internet protocol) is used to send single messages across the Internet (aka have my local computer send a request to the Weather Underground API). In order to have the connected networks be able to send messages back and forth, the Transmission Control Protocol (TCP) is used. TCP/IP ensures that requests are made between the correct two locations and establishes a connection (between the computer running this code and the one responding to the API requests). The Weather Underground API then uses HTTP(Hypertext Transfer Protocol) on top of TCP/IP to make its request for the data. HTTP is a way for web browsers and servers to communicate. 

### Analysing More Data
If you want to request data from many more locations, time will be a major constraint. Getting 11 years of information for just one location already takes a long time. The data is also not clean, meaning it would take that much longer to clean the data and make sure it is ready for analysis. Storage of the data may become a problem and the time it would take to analyse the data. 

This program was written generally, meaning that this program could also be used to analyse ocean data, mountain data, any data etc. The analysis would stay the same, the retrieval of the data would change and you would need to be sure that the data is cleaned and in the same format as expected by the R code.

### Future Improvements

- Allow for user input to change data requested - location, time range, etc.
- Avoid need to manually change directory for the R code
- Use far more Data in order to see if there is more of a discernable trend, more locations, more days.
- Incorporate an auto-reset sequence, so that the code can be run multiple times safely. 
- Include more of the results calculated in R - pressure, humidity
- Use MVC. Better separation of code into modular files (separate JS files, controller file for routes, etc)
- Reconsider the Tech Setup, the use of NodeJS with R may not be the most efficient way to analyse the data. Even if it is efficient, I may not have used the best method to communicate between the two.


![N|Solid](https://www.wunderground.com/logos/images/wundergroundLogo_4c.jpg)