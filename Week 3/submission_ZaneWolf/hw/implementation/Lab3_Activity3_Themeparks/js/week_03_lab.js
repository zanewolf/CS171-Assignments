

var categoryfilter = "all"; //initialize variable
dataFiltering(categoryfilter); //call function initially to display All Attractions bar chart


function dataFiltering(categoryfilter) {
	let attractions = attractionData;

	//if categoryfilter is default all...
	if (categoryfilter === "all") {

		//...then call dataSorting to sort by visitors and filter top 5, and plot
		renderBarChart(dataSorting(attractions))
	} else if (categoryfilter != "all"){
		//if categoryfilter is anything but all...

		//...filter by category....
		let filtereddata = attractions.filter(function (el) {
			return (el.Category == categoryfilter)
		})
		//...then call dataSorting to sort by visitors and filter top 5, and plot
		renderBarChart(dataSorting(filtereddata));
	}

}

function dataManipulation() {
	let selectBox = document.getElementById("attraction-category");
	var selectedValue = selectBox.options[selectBox.selectedIndex].value;
	console.log(selectedValue);
	dataFiltering(selectedValue); //call to update barchart by filtered category
}

function dataSorting(attractions){
	//function to sort given data set by number of visitors and return top five


	let sortedData = attractions.sort((a, b) => {
		return b.Visitors - a.Visitors;
	});

	let topfive = sortedData.filter((value, index) => {
		return (index < 5);
	});

	return topfive;
}