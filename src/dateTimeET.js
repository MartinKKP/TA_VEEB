const dateNowFormattedET = function(){
	let timeNow = new Date();
	const monthNamesET = ["jaanuar", "veebruar", "mأ¤rts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

const timeNowFormattedET = function(){
	let timeNow = new Date();
	return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
}

const weekDayNowET = function(){
	let timeNow = new Date();
	const weekdayNamesEt = ["pأ¼hapأ¤ev", "esmaspأ¤ev", "teisipأ¤ev", "kolmapأ¤ev", "neljapأ¤ev", "reede", "laupأ¤ev"];
	return weekdayNamesEt[timeNow.getDay()];
}

const partOfDay = function(){
	let dayPart = "suvaline aeg";
	let hourNow = new Date().getHours();
	if(hourNow <= 6){
		dayPart = "varahommik";
	} else if (hourNow < 12){
		dayPart = "hommik";
	} else if (hourNow == 12){
		dayPart = "keskpأ¤ev";
	}
	return dayPart;
}

//ekspordin kأµik vajaliku
module.exports = {fullDate: dateNowFormattedET, fullTime: timeNowFormattedET, weekDay: weekDayNowET, partOfDay: partOfDay};