$.fn.serializeObject = function()
{
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

function wish(){
    form = $("#form").serializeObject()
    // convert to local epoch
    date = $("#date").val().split("-")
    created_time = new Date(date[1]+"/"+date[2]+"/"+date[0]).getTime()/1000;
    query = "SELECT post_id, actor_id, message FROM stream WHERE filter_key = 'others' AND source_id = me() AND created_time > "+created_time+" LIMIT 200"
    console.log(query)
    $(".alert").html("Obtaining all posts....")
    payload = {'q': query, 'access_token': form.access_token}
    // first get all posts
    r = $.getJSON('https://graph.facebook.com/fql', payload, function(wallposts){
    		$(".alert").html("Obtaining user data")
    		console.log(wallposts.data.length)
    		$.each(wallposts.data, function(index,wallpost){
			// get user detail
			$.getJSON('https://graph.facebook.com/'+wallpost.actor_id, function(user){
				url = "https://graph.facebook.com/"+wallpost.post_id+"/comments"
				message = form.message.replace("RePlAcE", user.first_name).replace("rEpLaCe", user.last_name)
        			payload = {'access_token': form.access_token, 'message': message}
				$.post(url, payload, function(data){
    					$(".alert").html(message)
				})
				console.log(message)
			});
		});
    	});
}
