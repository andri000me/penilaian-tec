memberCount = 0;

function addUserCard(data){
  memberCount++;
  cardHTML = `<div class="card mb-3">
    <h5 class="card-header">`+memberCount+" - "+data.name+`</h5>
    <div class="card-body">
      <div class="row">
        <div class="col-sm-4">
          <img class="mx-auto" id="profile" src="`+SERVER_URL+"/../uploads/profile/"+data.profile_picture+`">
        </div>
        <form class="form-inline col-sm-8 my-auto">
          <div class="form-group col-10">
            <label for="slider-`+memberCount+`">Nilai</label>
            <input id="slider-`+memberCount+`" data-uid="`+ data.id +`" type="range" class="form-control-range" min=1 max=10 value=5></input>
          </div>
          <div class="form-group col-2">
            <input type="number" class="form-control w-100 text-center" id="text-slider-`+memberCount+`" value=5>
          </div>
        </form>
      </div>
    </div>`;

  $("#cardLoc").append(cardHTML);
}

function loadUserCards(){
  $.ajax({
      method: "GET",
      url: SERVER_URL+"/api/group/"+Cookies.get("gid")+"/members",
      headers: {"Authorization": "Bearer " + Cookies.get("token")}
    }).done(function( msg ) {
      if(typeof msg.error != "undefined"){
        $("#loaderAnim").remove();
        $("#loadText").html("Error : " + msg.error.text);
      }else{
        $.each(msg, function( index, value ) {
          addUserCard(value)
        });

        $("[type=range]").change(function(){
          $("#text-"+$(this).attr("id")).val($(this).val());
        });


        $("#loaderAnim").remove();
        $("#loadText").remove();
      }

    }).fail(function( jqXHR, textStatus ) {
      alert("Connection or server error : "+textStatus+"/"+jqXHR.statusText);
    });
}

function submitScore(){
  $("#submitForm div").hide();
  $("#submitButton").hide();
  $("#submitForm").append(`<div id="submitLoader" class="loader loader-small"></div>`);

  var dataScore = [];

  for(var i = 1; i<=memberCount;i++){
    var score;

    score = $("#slider-"+i).val();

    dataScore[i-1] = {};
    dataScore[i-1].score = score;
    dataScore[i-1].target = $("#slider-"+i).attr("data-uid");
  }

  $.ajax({
    method: "POST",
    url: BASE_URL+"/index.php/submitScore",
    data: {"scores": dataScore, "token": Cookies.get("token"),"uid":Cookies.get("uid")},
    dataType: 'json'
  }).done(function( msg ) {
    if(typeof msg.status != "undefined"){
      if(msg.status == "success"){
          alert("Sukses");
          window.location.href = BASE_URL + "/";
      }
    }

  }).fail(function( jqXHR, textStatus ) {
    alert("Connection or server error : "+textStatus+"/"+jqXHR.statusText);
  });
}

$( document ).ready(function() {
  reloadNavElement();
  if(!isLoggedIn()){
    console.log("Not logged in");
    $("#loaderAnim").remove();
    $("#loadText").html("Not logged in");
  }else {
    loadUserCards();
  }
});
