$(document).ready(function () {
    
    $('#supportTable').on('click', '.btn-reply-support', function (e) {
        let _item = $(this).data('item');
        console.log(_item)
        if(_item) {
            $('#replyForm #replyId').val(_item._id);
            $('#replyForm #replyEmail').val(_item.email);
            $('#replyForm #replyMessage').val(_item.message);
            $('#replyForm #answerReply').val(_item.answer);
            $('#SupportReplyModal').modal('show');
        }
    })

    // add reply support
    $("#replyForm").submit(function (e) {
        var form = $(this);
        var url = form.attr('action');
        $("#replySupportMsg").html('');
        $(".btnReply").prop('disabled', true);
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function (data) {
                !data.success ?  $("#replySupportMsg").html(`<div class="alert alert-danger" role="alert">${data.message}</div>`): location.reload();
                $(".btnReply").prop('disabled', false);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                $("#replySupportMsg").html(`<div class="alert alert-danger" role="alert">Server error</div>`)
                $(".btnReply").prop('disabled', false);
            }
        });
        e.preventDefault();
    });
});
