/*
 
 this is where we put all the JS scripts specific to this EForm (index.html)
 
 */


function getData() {
    alert('inside getData');
    doSQL("SELECT * FROM psr", function(json) { alert(json); });
}

// required function called by iDoXs to populate the form with contextual data
// or data that will uniquely identify the contents of this form
/****
 
 CallView will pass itinerary data:
 "clinic_address" = "kapitan pepe";
 "itinerary_date" = "2015-10-29 00:00:00";
 "md_id" = "CM_068";
 "md_name" = "CARDINO, MARBERT JOHN";
 "psr_id" = RR123;
 "psr_name" = "Crist Cruz";
 "specialty_code" = SG;
 "specialty_description" = "GENERAL SURGEON";
 "territory_id" = 84;
 "visit_date" = "";
 "visit_number" = 2;
 */


// required function called by iDoXs to populate location data
function setLocation(currloc)
{
    //alert(currloc);
}


function createForm(obj)
{
    
}


function saveLead()
{
}

function getPsr(){
	var psr = [];
	var sql = "select * from psr";
	doSQL(sql, function(obj) {
		psr = obj;
	});

	return psr[0];
}