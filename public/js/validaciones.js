
window.onload = function() {	
	document.getElementById('TreatmentDate').valueAsDate = new Date();
	document.getElementById('Date').valueAsDate = new Date();
};

$(document).ready(function(){
	$("#Status").change(function(){
		if($("#Status").val() == "Pendiente"){
			$("#pingDayHidden").show();
		} else {
			$("#pingDayHidden").hide();
		}
	});
});
