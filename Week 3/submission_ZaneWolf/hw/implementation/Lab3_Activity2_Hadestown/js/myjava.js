var rides = [
    {
        "id": 0,
        "name": "The Monstrous Obelisk",
        "price": 12,
        "open": ["Monday", "Friday"],
        "spawn": false
    },{
        "id": 1,
        "name": "The Forsaken Passage",
        "price": 8,
        "open": ["Monday", "Wednesday", "Friday", "Sunday"],
        "spawn": false
    },{
        "id": 2,
        "name": "The Ethereal Release",
        "price": 10,
        "open": ["Tuesday", "Thursday", "Saturday"],
        "spawn": false
    }
    ]

console.log("My debug message");
console.log("Hello! Good luck with the lab!");
console.log("Name of the first amusement ride " +rides[0].name);
console.log("All days when the second attraction is open "+ rides[1].open);
console.log("First day of the week when the second attraction is open " + rides[1].open[0]);
console.log("Here is a 50% discount for your third attraction! $" + rides[2].price/2);

let debugID = 12;
console.log("Another debug message with id: Whoops, doofus. " + debugID);

var amusementRidesDouble = doublePrices(rides);
debugAmusementRides(rides);
console.log(amusementRidesDouble);

function doublePrices(amusementRides) {
    for (let i = 0; i < amusementRides.length; i++) {
        if (i!=1) {
            amusementRides[i]["price"] *= 2;
        }
    }
    return amusementRides;
}

function debugAmusementRides(amusementRides){
    let sum = 0;
    for (let j=0; j<amusementRides.length; j++) {
        console.log("Name: " + amusementRides[j]["name"] + ", Price: $" + amusementRides[j]["price"]);
        sum += amusementRides[j]["price"];
        document.getElementById("myTable").rows[j+1].cells[0].innerHTML = amusementRides[j]["name"];
        document.getElementById("myTable").rows[j+1].cells[1].innerHTML = "$"+amusementRides[j]["price"];
    }
    document.getElementById("total").innerHTML = "$"+sum;
}

// const myNum = document.querySelector('input-group-text');
// myNum.addEventListener('input-group-text', updateValue);


// document.getElementById("myTable").rows[j].cells[0].innerHTLM = amusementRides[j]["name"]


