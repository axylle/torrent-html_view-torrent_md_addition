$(document).ready(function() {
	$("p#version").html("Version 1.2");
	events();	
	searchOnline();
	searchOffline();
	sidebar();
});

// global var
var itinerary_data = {};
var _expand = false;
var alert = 0;

function setInitialData(obj) {
	itinerary_data = obj;
}

function setInfo(data) {
	$.each(data, function(i, val) {
		$("[name= '"+i+"']").val(val);
	});

	var gender = data.sex;
	if(gender == 'M')
		gender = 'Male';
	else if(gender == 'F')
		gender = 'Female';

	$("[name=sex]").val(gender);

	$("#pop1").hide();   
	$(".overlay").hide(); 

}

function searchOffline(){
	$("#search_local").click(function()  {
		var last_name = $('#search_lastname').val();
		var first_name = $('#search_firstname').val();
		var middle_name = $('#search_middlename').val();
		var prc = $('#search_prc').val();

		if (last_name !='' && first_name !='')  {

			var sql = "select distinct d.md_id, dp.prc, d.first_name, d.middle_name, d.last_name, d.birth_date, d.birthplace, d.specialty_code, d.sex, d.e_mail, d.mobile_number, dc.clinic_address, dc.address_stnumber, dc.address_street, dc.address_barangay, dc.address_city, dc.address_province, dc.clinic_hours, dc.class_code, dc.average_patient_per_day, dc.position, dc.frequency, dc.visit_day1, dc.visit_day2, dc.visit_day3, dc.visit_day4, dc.visit_day5 from doctor d, doctor_clinic dc, doctor_profile dp where d.md_id=dc.md_id and d.md_id=dp.md_id and d.last_name like'%" + last_name + "%' and d.first_name like '%" + first_name+"%'";
			
			var extra_parameter = "";
			if(middle_name != "")
				extra_parameter += " and d.middle_name like '%" + middle_name + "%'";
			if(prc != "")
				extra_parameter += " and dp.prc='" + prc + "'";

			sql += extra_parameter + " limit 8";

			var result = "<div class='row header'>\
			<div class='divcell'>MD ID</div>\
			<div class='divcell'>PRC</div>\
			<div class='divcell'>Name</div>\
			<div class='divcell'>Specialty</div>\
			</div>\
			";
			var ctr = 0;

			// setDialog(sql);

			doSQL(sql, function(data) {
				data.forEach(function(val, i){
					var in_data = JSON.stringify(val);
					var name = val["last_name"] + ",  " + val["first_name"] + " " + val["middle_name"];
					result += " <script>var val"+ctr+" = "+ in_data +";</script>\
					<div class='row' onClick='setInfo(val"+ctr+")'>\
					<div class='divcell'>" + val["md_id"]+ "</div>\
					<div class='divcell'>" + val["prc"]+ "</div>\
					<div class='divcell'>" + name + "</div>\
					<div class='divcell'>" + val["specialty_code"] + "</div>\
					</div>\
					";
					ctr++;
				});
			});	

			if(ctr != 0){
				$('#inserthere').html(result);

				$(".FloatDiv").animate({"width" : "500"}, 100); 
				_expand =  true;
				$(".Inner").fadeIn();
			} else {
				showMessage("alert-danger", "Doctor does not exist!");
			}
			
		} else{
			showMessage("alert-danger", "Lastname and First Name fields on search are required!");
		}
		$('#myModal').modal('hide');		
	});
}

function searchOnline(){
	$("#search_online").click(function()  {
		$(this).button('loading');

		var last_name = $('#search_lastname').val();
		var first_name = $('#search_firstname').val();
		var middle_name = $('#search_middlename').val();
		var prc = $('#search_prc').val();

		if (last_name !='' && first_name !='')  {
			var extra_parameter = "";
			var link = "http://torrent.doccsonline.com/API/doctorSearch_ax.php?count=8&last_name=" + last_name + "&first_name=" + first_name;

			if(middle_name != "")
				extra_parameter += "&middle_name=" + middle_name;
			if(prc != "")
				extra_parameter += "&prc_number=" + prc;

			link += extra_parameter;

			console.log(link);

			var result = "<div class='row header'>\
			<div class='divcell'>MD ID</div>\
			<div class='divcell'>PRC</div>\
			<div class='divcell'>Name</div>\
			<div class='divcell'>Specialty</div>\
			</div>\
			";

			$.get( link, function( data ) {
				var obj = JSON.parse(data);

				var ctr = 0;
				$.each(obj, function(i, val) {
					var in_data = JSON.stringify(val);

					var name = val["last_name"] + ",  " + val["first_name"] + " " + val["middle_name"];
					result += " <script>var val"+ctr+" = "+ in_data +";</script>\
					<div class='row' onClick='setInfo(val"+ctr+")'>\
					<div class='divcell'>" + val["md_id"]+ "</div>\
					<div class='divcell'>" + val["prc"]+ "</div>\
					<div class='divcell'>" + name + "</div>\
					<div class='divcell'>" + val["specialty_code"] + "</div>\
					</div>\
					";
					ctr++;
				});

				if(ctr != 0){
					$('#inserthere').html(result);

					$(".FloatDiv").animate({"width" : "500"}, 100); 
					_expand =  true;
					$(".Inner").fadeIn();
				} else {
					showMessage("alert-danger", "Doctor does not exist!");
				}
			});

			setTimeout(function(){
				$('#myModal').modal('hide');
				$('#search_lastname').val("");
				$('#search_firstname').val("");
				$('#search_middlename').val("");
				$('#search_prc').val("");
			}, 3000);

		} else{
			$('#myModal').modal('hide');
			showMessage("alert-danger", "Lastname and First Name fields on search are required!");
		}
	});
}

function getDateNow(){
	today = new Date();
	var now = today.getFullYear() + '-' +
	('00' + (today.getMonth() + 1)).slice(-2) + '-' +
	('00' + today.getDate()).slice(-2) + ' ' +
	('00' + today.getHours()).slice(-2) + ':' +
	('00' + today.getMinutes()).slice(-2) + ':' +
	('00' + today.getSeconds()).slice(-2);     
	
	return now;
}

function sidebar(){
	$(".Inner").hide();
	
	$(".FloatDiv").click(function() {
		$("#info_tr").hide();
		if($("#inserthere").html() != ""){
			if (_expand == false){ 
				$(".FloatDiv").animate({"width" : "500"}, 100); 
				_expand =  true;
				$(".Inner").fadeIn();
			}
			else{
				$(".FloatDiv").animate({"width" : "25"}, 100); 
				_expand =  false;
				$(".Inner").fadeOut();                  
			}
		}               
	}); 
}

function setDialog(message){
	$("#modalMessage").html(message);
	$('#modalDialog').modal('show');
}


function showMessage(type, message) {
	alert++;
	var alertDiv = '<div id="alert_id"'+alert+' class="alert '+type+' fade in">\
	<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>\
	<p id="info">'+message+'</p>\
	</div>\
	';

	$("#alert").append(alertDiv);
	window.location.href = "#alert";
	// $("#info_tr").removeClass("alert-success");
	// $("#info_tr").removeClass("alert-info");
	// $("#info_tr").removeClass("alert-danger");

	// $("#info_tr").addClass(type);
	// $("#info_tr").show();
	// $("#info").html(message);

	// window.location.href = "#info_tr";
}

function showInfo(message) {
	alert++;
	var alertDiv = '<div id="alert_id'+alert+'" class="alert alert-info fade in">\
	<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>\
	<p id="info">'+message+'</p>\
	</div>\
	';

	$("#alert").append(alertDiv);
	window.location.href = "#alert";
}

// button events
function events(){
	$("#modalAlert").click(function(){
		$("#search_online").button("reset");
		$("#search_local").button("reset");
		$('#inserthere').html("");
		$(".FloatDiv").animate({"width" : "25"}, 100); 
		_expand =  false;
		$(".Inner").fadeOut();  
	});

	$('.btn-primary').click(function() {
		$("#pop_search").fadeOut();   
		$("#pop1").fadeOut();   
		$(".overlay").fadeOut();   
	});

	$("#reset").click(function() {
		$("#info_tr").hide();
		$("#alert").html("");
		alert=0;
	});

	$("#submit").click(function() {
		var _last_name = $("#last_name").val();
		var _first_name = $("#first_name").val();
		var _hospital_name = $("#clinic_address").val();

		if(_last_name != "" && _first_name != "" && _hospital_name != "") {
			setDialog("Are you sure you want to add this Doctor?<br><br><h1><strong>"+$("#last_name").val()+", "+$("#first_name").val()+"</strong></h1>");
		} else {
			showMessage("alert-danger", "Please check if required fields have been filled up. Fields with * are required.")
		}
		return false;
	});

	$("#save_ok").click(function() {
		var json = $('form').serializeObject();
		var notes = JSON.stringify(json);

		var columns = [];
		var values = [];

		var columns1 = [];
		var values1 = [];

		if($("#md_id").val() == "") {
			columns.push("md_id");
			values.push("NEW");

			columns1.push("md_id");
			values1.push("NEW");
		}

		columns.push("territory_id");
		values.push(getPsr().territory_id);

		columns.push("request_date");
		values.push(getDateNow());

		columns1.push("territory_id");
		values1.push(getPsr().territory_id);

		columns1.push("request_date");
		values1.push(getDateNow());

		$.each(json, function(i, val) {
			if(val != "") {
				if(i == "prc")
					i = "prc_number";
				columns.push(i);
				values.push(val);

				if((i != "birthplace") && (i != "birth_date") && (i != "prc_number") && (i != "mobile_number") && (i != "address_stnumber") && (i != "address_street") && (i != "address_barangay") && (i != "address_province") && (i != "clinic_hours") && (i != "average_patient_per_day") && (i != "position") && (i != "sex") && (i != "e_mail") && (i != "class_code")){
					columns1.push(i);
					values1.push(val);
				} 
			}
		});

		var sql = "insert into www_md_addition_request (" + columns.join(", ") + ") values ('" + values.join("', '") + "')";
		var sql_local = "insert into www_md_addition_request (" + columns1.join(", ") + ") values ('" + values1.join("', '") + "')";

		showMessage("alert-success", "Doctor has been added successfully!");

		postSQL("MSSQL",sql);
		execSQL(sql_local);

		$('#modalDialog').modal('hide');
		return false;					
	});

$("#search").click(function(){
	$("#pop_search").ForceCenter();
	$(".overlay").show();
	$("#pop_search").hide();
	$("#pop_search").fadeIn(); 
	return false;
});

$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};
}