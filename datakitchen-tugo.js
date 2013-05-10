var startpos = -100;

function character(country, model){
	country = country.toLowerCase();
	if(!model) model = "mod1";
	var flag = "flags/"+country+".png";
	var id = "char-"+country;
	var html = '<div class="char"><div class="mod '+model+'"></div><div class="count">0</div><img class="flag" src="'+flag+'" /></div>';
	$(html).attr('id',id).css("transform","translateX("+startpos+"px)").appendTo(window.characters);
}

function move(country, pos){
	var id = "#char-"+country;
	$(id).css("transform","translateX("+pos+"px)");
}

var step = 0;
var oldstep = 0;
function spriteLoop(){
	oldstep = step;
	step = (step + 1) % 7;
	window.characters.removeClass('step'+oldstep).addClass('step'+step);
	window.ground.removeClass('step'+oldstep).addClass('step'+step);
	setTimeout(function() { spriteLoop(); }, 100);
}

$(function(){
	window.characters = $('#characters');
	window.ground = $('#ground');
	preparedata();
	character('fr', 'mod1');
	character('es', 'mod2');
	character('gb', 'mod3');
	character('us', 'mod4');
	character('th', 'mod5');	
	setTimeout(function() { spriteLoop(); }, 100);
});

function preparedata(){
	var data = {};
	$.get('three.csv',function(csvdata){
		var arr = CSVToArray(csvdata);	
		for(var i=0;i<arr.length;++i){
			var row = arr[i];
			var date = row[0];
			var country = row[1];
			var count = row[2];
			if(!data[date]) data[date] = {};
			if(!data[date][country]) data[date][country] = count;
		}	
		begin(data);
	});
}

var datepos = 300;
function begin(data){
	nicedata = [];
	for(date in data){
		var d = date.substring(6,9)+" "+toDate(date.substring(4,6))+" "+date.substring(0,4);
		$('<div></div>').text(d).css('left',datepos+'px').appendTo('#dates');
		datepos += 250;	
		var srt = [];
		for(country in data[date]){
			srt.push({
				date: date,
				country: country.toLowerCase(),
				count: data[date][country]
			});
		}
		srt.sort(function(a,b){
			return a.count-b.count;
		});
		srt.date = date;
		nicedata.push(srt);
	}
	setTimeout(function(){
		picknext(nicedata,0);
	},2000);
}

function picknext(data,i){
	show(data[i]);
	setTimeout(function(){
		picknext(nicedata,i+1);
	},2000);	
}

var shift = 0;
function show(data){
	$('#dates').css("transform","translateX("+shift+"px)");
	shift-=250;
	for(var i=0;i<data.length;++i){
		var selector = "#char-"+data[i].country+" > .count"; 
		$(selector).text(data[i].count); 
		move(data[i].country,i*200);	
	}
}

function toDate(mo){
	if(mo==1) return "January";
	else if(mo==2) return "February";
	else if(mo==3) return "March";
	else if(mo==4) return "April";
	else if(mo==5) return "May";
	else if(mo==6) return "June";
	else if(mo==7) return "July";
	else if(mo==8) return "August";
	else if(mo==9) return "September";
	else if(mo==10) return "October";
	else if(mo==11) return "November";
	else if(mo==12) return "December";
}

// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
	strDelimiter = (strDelimiter || ",");

	// Create a regular expression to parse the CSV values.
	var objPattern = new RegExp(
		(
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
		);


	// Create an array to hold our data. Give the array
	// a default empty first row.
	var arrData = [[]];

	// Create an array to hold our individual pattern
	// matching groups.
	var arrMatches = null;


	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while (arrMatches = objPattern.exec( strData )){

		// Get the delimiter that was found.
		var strMatchedDelimiter = arrMatches[ 1 ];

		// Check to see if the given delimiter has a length
		// (is not the start of string) and if it matches
		// field delimiter. If id does not, then we know
		// that this delimiter is a row delimiter.
		if (
			strMatchedDelimiter.length &&
			(strMatchedDelimiter != strDelimiter)
			){

			// Since we have reached a new row of data,
			// add an empty row to our data array.
			arrData.push( [] );

		}


		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (arrMatches[ 2 ]){

			// We found a quoted value. When we capture
			// this value, unescape any double quotes.
			var strMatchedValue = arrMatches[ 2 ].replace(
				new RegExp( "\"\"", "g" ),
				"\""
				);

		} else {

			// We found a non-quoted value.
			var strMatchedValue = arrMatches[ 3 ];

		}


		// Now that we have our value string, let's add
		// it to the data array.
		arrData[ arrData.length - 1 ].push( strMatchedValue );
	}

	// Return the parsed data.
	return( arrData );
}