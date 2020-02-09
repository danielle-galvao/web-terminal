$(document).ready(function(){
	var textDiv = document.getElementById("textDiv");
	$("button").click(function(){
		var jsonArray = [];
		var splittedFormData = $("input").serialize().split('&');
		textDiv.innerHTML = "{"
		$.each(splittedFormData, function (key, value) {
			item = {};
			var splittedValue = value.split('=');               
			item["name"] = splittedValue[0];
			item["value"] = splittedValue[1];
			jsonArray.push(item);
			textDiv.innerHTML += (" \"" + item["name"] + "\": \"" + item["value"] + "\" }");

		});
		console.log(jsonArray)

	});
});
