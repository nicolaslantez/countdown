
window.onload = function() {	
	document.getElementById('reportedDate').valueAsDate = new Date();
	document.getElementById('date').valueAsDate = new Date();
};

$(document).ready(function(){
	$("#statusSelect").change(function(){
		console.log($("#statusSelect").val());
		if($("#statusSelect").val() == "Pendiente"){
			$("#pingDayHidden").show();
		} else {
			$("#pingDayHidden").hide();
		}
	});
});



