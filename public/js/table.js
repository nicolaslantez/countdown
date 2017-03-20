$(document).ready(function() {
	$('#results').DataTable();
});

$(document).ready(function() {
    $(".clickable").click(function() {
        window.location = $(this).data("href");
    });
});
