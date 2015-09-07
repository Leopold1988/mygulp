$("#regbtn").click(function(){
    if ($("pass1").val() !== $("pass2").val()) {
      alert("两次密码输入不一致");
      return;
    }
    $("#subbtn").click();
  });

  $(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      $("#subbtn").click();
    }
  });

  $("#regform").submit(function(){
    if (!checkUsername()) {
      return false;
    }
    var v = ($(":input[name='commission_ratio']").val()/100).toFixed(0);
    $(":input[name='commission_ratio']").val(v);
  });

  $(":checkbox").change(function(){
    var boo = $(this).get(0).checked;

    if (boo) {
      $(this).val(1);
    } else {
      $(this).val(0);
    }
  });

  $("#testUserbtn").click(function(){
    checkUsername();
  });

  function checkUsername(){
    var _n = $("#testUsername").val(), b = false;

    if (_n === "") {
      alert("请输入用户名");
      return;
    }

    $.ajax({
      method: "post",
      url: "check_username.php",
      dataType: "json",
      async: false,
      data: {name : _n}
    }).done(function(json) {
      if (json.error_msg) {
        b = false;
        alert(json.error_msg);
        $("#testUsername").parents(".form-group").removeClass().addClass("form-group has-error");
        $("#testUsername").focus();
      } else {
        b = true;
        $("#testUsername").parents(".form-group").removeClass().addClass("form-group has-success");
        $("#pass1").focus();
      }
    });

    return b;
  }