function loadUserCard(){
  cardHTML = `<div id="u-1" class="card mb-3">
    <h5 class="card-header">1 - Tony Sabuga</h5>
    <div class="card-body">
      <div class="row">
        <div class="col-sm-4">
          <img class="mx-auto" id="profile" src="">
        </div>
        <form class="col-sm-8 my-auto">
          <div class="form-group">
            <label for="slider-nilai">Nilai</label>
            <input type="range" class="form-control-range" min=1 max=10></input>
          </div>
        </form>
      </div>
    </div>`;

    $("#cardLoc").append(cardHTML);

    $("#loaderAnim").remove();
    $("#loadText").remove();

}


$( document ).ready(function() {
  reloadNavElement();
  if(!isLoggedIn()){
    console.log("Not logged in");
    $("#loaderAnim").remove();
    $("#loadText").html("Not logged in");
  }else {
    loadUserCard();
  }
});
