// initialize starting variables and call function
let myloc = "all";
let myorder = "all";
createVisualization();

function createVisualization() {
    //
    // MAKE THE SUMMARY TABLE
    //
    //initialize counter variables
    let numdelivs = 0;
    let numpizzas = 0;
    let alltime = 0;
    let totalsales = 0;
    let numlowfeed = 0;
    let nummedfeed = 0;
    let numhighfeed = 0;

    //grab values from dropdown menu
    selectBox = document.getElementById("location-category");
    myloc = selectBox.options[selectBox.selectedIndex].value;
    selectBox2 = document.getElementById("order-category");
    myorder = selectBox2.options[selectBox2.selectedIndex].value;

    // return filtered data based on dropdown menu
    let filteredData = dataFiltering(deliveryData, myloc, myorder);

    // filter feedback data to match
    let filteredFeedback = dataMatching(filteredData, feedbackData);

    //count baby count
    for (let i in filteredData) {
        numdelivs += 1;
        numpizzas += filteredData[i].count;
        alltime += filteredData[i].delivery_time;
        totalsales += filteredData[i].price;
    }

    //some good ol' fashioned division
    let delivtimeavg = alltime / numdelivs;

    //already spent way too much time on this hw, decided to muscle through this rather than finessing it with .filter()
    for (let j in filteredFeedback) {
        if (filteredFeedback[j].quality == "low") {
            numlowfeed += 1;
        } else if (filteredFeedback[j].quality == "medium") {
            nummedfeed += 1;
        } else {
            numhighfeed += 1;
        }
    }

    //yep, basic addition never fails.
    let numallfeed = numlowfeed + nummedfeed + numhighfeed;

    //write to table. Not fancy.
    document.getElementById("pizzdelivs").innerHTML = numpizzas;
    document.getElementById("alldelivs").innerHTML = numdelivs;
    document.getElementById("avgdelivtime").innerHTML = Math.round(delivtimeavg);
    document.getElementById("totalsales").innerHTML = Math.round(totalsales);
    document.getElementById("numfeedback").innerHTML = numallfeed;
    document.getElementById("numlowcat").innerHTML = numlowfeed;
    document.getElementById("nummedcat").innerHTML = nummedfeed;
    document.getElementById("numhighcat").innerHTML = numhighfeed;

    //
    // MAKE THE RAW DATA TABLE
    //

    // grab tbody from html table and erase it so that data doesn't pile up (it got v. long before I noticed that was happening)
    document.getElementById('tbody').innerHTML = '';
    var table = document.getElementById("tbody");

    //initialize array with desired variable keys
    let mykeys = ["delivery_id", "area", "delivery_time", "driver", "count","punctuality", "quality", "wrong_pizza"];

    //working with two disparate data sets is now v. hard
    //combining the two based on delivery_id and will now have objects with two different lengths, depending on if they had feedback data
    const map = new Map();
    filteredData.forEach(item => map.set(item.delivery_id, item));
    filteredFeedback.forEach(item => map.set(item.delivery_id, {...map.get(item.delivery_id), ...item}));
    const mergedArr = Array.from(map.values());

    console.log(mergedArr);

// I know this is janky and hard-coded as all get-outs, but I feel pretty accomplished for not having learned this. At. All. In. Class. Or. In. Lab.
    for (let num in mergedArr){

        //initialize and write delivery data cells
        var row = table.insertRow(num);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        cell0.innerHTML = mergedArr[num][mykeys[0]];
        cell1.innerHTML = mergedArr[num][mykeys[1]];
        cell2.innerHTML = mergedArr[num][mykeys[2]];
        cell3.innerHTML = mergedArr[num][mykeys[3]];
        cell4.innerHTML = mergedArr[num][mykeys[4]];

        // initialize feedback data cells as empty
        var cell5 = row.insertCell(5);
        var cell6 = row.insertCell(6);
        var cell7 = row.insertCell(7);
        cell5.innerHTML = "";
        cell6.innerHTML = "";
        cell7.innerHTML = "";

        // if the object has feedback data, then rewrite feedback data cells
        if (Object.keys(mergedArr[num]).length>10){
            cell5.innerHTML = mergedArr[num][mykeys[5]];
            cell6.innerHTML = mergedArr[num][mykeys[6]];
            cell7.innerHTML = mergedArr[num][mykeys[7]];
        }
    }

    //
    // render that barchart
    //
    renderBarChart(filteredData)

}

function dataFiltering(alldata, mylocation, myordertype){
    // since my catch-all variable of "all" doesn't actually exist, I had to get fancy. By which I mean boring pedantic
    // because there are only four cases to deal with here, i went ahead and hardcoded them.

            if (mylocation == "all" && myordertype == "all"){
                return alldata;

            } else if (mylocation != "all" && myordertype == "all"){
                return alldata.filter(a => a.area == mylocation)

            } else if (mylocation == "all" && myordertype != "all"){
                return alldata.filter(a=> a.order_type == myordertype)

            } else if (mylocation != "all" && myordertype != "all"){
                return alldata.filter(a => (a.order_type == myordertype && a.area==mylocation))
            };
}

function dataMatching(delivdata, feeddata){

    // I expected this to be more difficult, and then I googled things. Guess it didn't really need it's own fxn after all
    // and if it ain't broke, don't fix it.
    return feeddata.filter(a => delivdata.some(b => a.delivery_id === b.delivery_id));

}