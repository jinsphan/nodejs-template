$(document).ready(function() {
    (function ($) {
        $("tbody.records").on("click","td.btn-act button.del-record", function () {
            var isDel = confirm("Are you sure to delete this record?!");
            if (isDel) {
                username = $(this).attr("alt");
                var _url = $(this).attr("href");
                // var urlDel = "/admin/user/delete/"+username;
                $.ajax({
                    url: _url,
                    type: "POST",
                    success: function (res) {
                        if(res.success){
                            $("tr."+username).remove();
                        }
                        // alert("success");
                    }
                });
            }
        })
    })(jQuery)
})