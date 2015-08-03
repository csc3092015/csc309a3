$(document).ready(function(){
	/******************** Comment Submit Ajax*******************/
	$('.commentForm').submit(function(evt){
		evt.preventDefault();
      	var url = $(this).attr("action");
      	var commentDescription = $("input#commentDescription").val();
		var commentAuthorId = $("input#commentAuthorId").val();
		var commentPostId = $("input#commentPostId").val();
		var formData = {
			commentDescription: commentDescription,
			commentAuthorId: commentAuthorId,
			commentPostId: commentPostId
		};
		$.ajax(url, {
			data: formData,
			type: "POST",
			success: function(newCommentHtml){
				var commentSectionId = commentPostId + 'commentSection';
				$('#' + commentSectionId).appendChild(newCommentHtml);
			}
		});
	});

});