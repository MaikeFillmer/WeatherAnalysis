install.packages("data.table", lib = "C:/Users/M/Documents/R/win-library/3.3", repos = "http://cran.us.r-project.org") ##!!Change lib to your library location
install.packages("RJSONIO", lib = "C:/Users/M/Documents/R/win-library/3.3", repos = "http://cran.us.r-project.org") ##!!Change lib to your library location

########## Load Data Set ##########

setwd("C:/Users/M/Documents/Kargo")  #set working directory to where dataset is stored

weatherData <- read.csv("weathertest.csv", header = TRUE)  #read in the data and save to dataframe
weatherData <- na.omit(weatherData)
weatherData <- weatherData[!(weatherData$Humidity == "N/A" | typeof(weatherData$Humidity) != "integer" | weatherData$Pressure == "N/A"),]

weatherData$year <- as.numeric(format(as.Date(weatherData$Date, "%m/%d/%Y"), format='%Y')) #Extract the year from the date

########## Simple Analysis ##########

## mean per year##
meanPerYearTemperature <- aggregate(weatherData$Temp, by=list(weatherData$year), FUN=mean, na.rm=TRUE)
#meanPerYearHumidity <- aggregate(weatherData$Humidity, by=list(weatherData$year), FUN=mean, na.rm=TRUE)
meanPerYearPressure <- aggregate(weatherData$Pressure, by=list(weatherData$year), FUN=mean, na.rm=TRUE)


## max per year##
maxPerYearTemperature <- aggregate(weatherData$Temp, by=list(weatherData$year), FUN=max, na.rm=TRUE)
#maxPerYearHumidity <- aggregate(weatherData$Humidity, by=list(weatherData$year), FUN=max, na.rm=TRUE)
maxPerYearPressure <- aggregate(weatherData$Pressure, by=list(weatherData$year), FUN=max, na.rm=TRUE)

##can also include a min##

########## Climate Change - Increasing Top Ten Temperature Days? ##########


library("data.table", lib.loc = "C:/Users/M/Documents/R/win-library/3.3") ##!!Change lib to your library location

topTenTemperatureDaysPerYear <- setDT(weatherData)[order(weatherData$year, -weatherData$Temp), .SD[1:10], by=year] #Extract the top ten temperatures days per year
meanTopTenPerYearTemperature <- aggregate(topTenTemperatureDaysPerYear$Temp, by=list(topTenTemperatureDaysPerYear$year), FUN=mean, na.rm=TRUE) #take the average of the top ten temperature days per year

## Fit a Linear Model ##
temperature.lm <- lm(x ~ Group.1, data = meanTopTenPerYearTemperature) ## fit a linear model
summary(temperature.lm)

slope <- coef(temperature.lm)[[2]]
intercept <- coef(temperature.lm)[[1]]
rSquare <- summary(temperature.lm)$r.squared

## Plot the data ##
plot(meanTopTenPerYearTemperature$Group.1, meanTopTenPerYearTemperature$x)
abline(temperature.lm)


########## Create a JSON File for Node to Access ##########

library(RJSONIO, lib.loc = "C:/Users/M/Documents/R/win-library/3.3") ##!!Change lib to your library location

## Graph Data JSON ##
graphOutput <- toJSON(meanTopTenPerYearTemperature)
write(graphOutput, "rGraphOutput.json")

## Graph Stats ##
graphStatsOutput <- toJSON(list(slope, intercept, rSquare))
write(graphStatsOutput, "rGraphStatsOutput.json")

## Mean Temperatures ##
meanTempOutput <- toJSON(meanPerYearTemperature)
write(meanTempOutput, "rMeanTempOutput.json")

## Max Temperatures ##
maxTempOutput <- toJSON(maxPerYearTemperature)
write(maxTempOutput, "rMaxTempOutput.json")

## All Temperatures ##
allTempOutputDates <- toJSON(weatherData$Date)
allTempOutputData <- toJSON(weatherData$Temp)
write(allTempOutputDates, "rAllTempOutputDates.json")
write(allTempOutputData, "rAllTempOutputData.json")
