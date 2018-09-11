//Currently selected quiz
var selected = 0;

//curent sorting method
var sortedBy = "";

//current showed
var currentCat;

var itemCount = 0;

var dataSend = [];

//Set sorting method
function sortScore(type){
  if(sortedBy != type){
    sortedBy = type;
    getQuizData(selected);
  }
}

function editCat(){
  dataHTML = `
                <div class="mb-3 hidden-md-up"></div>
                <div class="row align-items-center">
                <div class="col-12">
                  <div class="row">
                    <input maxlength="25" type="text" id="editJudul" class="col-12 form-control" value="`+$("#cat-"+selected).html()+`"></input>
                  </div>
                  <div class="row mt-3">
                    <textarea id="editDesc" maxlength="100" class="col-12 form-control">`+$("#cat-"+selected).attr("data-desc")+`</textarea>
                  </div>
                </div>
              </div>
              <hr/>
              <div class="table-responsive-sm">
              <table class="table">
                <thead>
                  <th>Nama</th>
                  <th>Tooltip</th>
                  <th>Hapus</th>
                </thead>
                <tbody id="itemList">
  `;

  $.each(currentCat,function(index,value){
    itemCount = itemCount +1;
    dataHTML+=`
                  <tr id="item-`+itemCount+`">
                    <td><textarea class="form-control catItemName" data-desc-id="`+itemCount+`" data-id="`+value.id+`" maxlength=40  rows="1">`+value.name+`</textarea></td>
                    <td><textarea class="form-control catItemDesc" id ="desc-`+itemCount+`" data-id="`+value.id+`" maxlength=100 rows="2">`+value.description+`</textarea></td>
                    <td><button onclick="deleteCat(`+itemCount+`)" class="btn btn-danger">X</button></td>
                  </tr>
    `;

  });

  //close table
  dataHTML += `
                </tbody>
              </table>
              </div>
              <div class="row">
                  <button onclick="addCat()" class="col-3 btn btn-success">Tambah</button>
                  <button onclick="submitCat()" class="col-3 offset-6 btn btn-primary">Submit</button>
              </div>
  `;

  $("#catDataLoc").empty();
  $("#catDataLoc").append(dataHTML);
}

function deleteCat(itemId){
  dataSend.push({id:$("#item-"+itemId+" textarea").attr("data-id"),value:"delete"})
  $("#item-"+itemId).remove();
}

function addCat(){
  itemCount = itemCount +1;

  dataHTML = `
    <tr id="item-`+itemCount+`">
      <td><textarea class="form-control catItemName" data-desc-id="`+itemCount+`" data-id="-99" maxlength=40 rows="1"></textarea></td>
      <td><textarea class="form-control catItemDesc" id="desc-`+itemCount+`" data-id="-99" maxlength=100 rows="2"></textarea></td>
      <td><button onclick="deleteCat(`+itemCount+`)" class="btn btn-danger">X</button></td>
    </tr>

  `;
  $("#itemList").append(dataHTML);
}

function submitCat(){

  $(".catItemName").each(function( index ) {
    dataSend.push({id:$(this).attr("data-id"),
                  value:$(this).val(),
                  desc:$("#desc-"+$(this).attr("data-desc-id")).val()});
  });

  $.ajax({
    method: "POST",
    url: BASE_URL+"/index.php/category/edit",
    data: {"catId": selected,
          "token": Cookies.get("token"),
          "uid":Cookies.get("uid"),
          "item":dataSend,
          "judul":$("#editJudul").val(),
          "desc":$("#editDesc").val()},
    dataType: 'json'
  }).done(function( msg ) {
    if(typeof msg.status != "undefined"){
      if(msg.status == "success"){
          alert("Sukses");
          location.reload();
      }
    }

    dataSend = [];

  }).fail(function( jqXHR, textStatus ) {
    alert("Connection or server error : "+textStatus+"/"+jqXHR.statusText);
  });
}

// Get single quiz data and display them
function getCat(catID){

  //Hapus centering
  $("#catDataLoc").removeClass("my-auto");

  //Add loader
  $("#catDataLoc").empty();
  $("#catDataLoc").append(`<div class="loader loader-big" id="catLoader"></div>`);

  //Cek apakah ada quiz yang dipilih sebelumya
  if(selected!=0){
    //Deselect last selected user
    $("#cat-"+selected).removeClass("active");
  }

  //Efek aktif pada tombol
  $("#cat-"+catID).addClass("active");
  selected = catID;

  //Load quiz

  $.ajax({
    method: "GET",
    url: BASE_URL+"/index.php/getCat/"+catID,
    headers: {"Authorization": "Bearer " + Cookies.get("token")}
  }).done(function(msg){
    if(msg.status=="success"){
      currentCat = msg.data;

      //fill data
      dataHTML = `
                    <div class="mb-3 hidden-md-up"></div>
                    <div class="row align-items-center">
                    <div class="col-md-8">
                      <div class="row">
                        <h3 class="col-12 text-md-left text-center">`+$("#cat-"+catID).html()+`</h3>
                      </div>
                      <div class="row">
                        <p class="col-12 text-md-left text-center">`+$("#cat-"+catID).attr("data-desc")+`</p>
                      </div>
                    </div>
                    <div class="dropdown text-center col-md-4">
                      <button onclick="editCat(`+catID+`)" class="btn btn-primary" type="button">
                        Edit
                      </button>
                    </div>
                  </div>
                  <hr/>
                  <div class="row">
                    <p class="col-12"><b>Kelompok</b></p>
                  </div>
                  <div class="row">
                    <p id="groupLoc" class="col-12">Loading...</p>
                  </div>
                  <div class="table-responsive-sm">
                  <table class="table">
                    <thead>
                      <th>Id</th>
                      <th>Nama</th>
                      <th>Tooltip</th>
                    </thead>
                    <tbody>
      `;

      loadGroupInfo($("#cat-"+catID).attr("data-kel"));

      $.each(msg.data,function(index,value){
        dataHTML+=`
                      <tr>
                        <th>`+value.id+`</th>
                        <td>`+value.name+`</td>
                        <td>`+value.description+`</td>
                      </tr>
        `;

      });

      //close table
      dataHTML += `
                    </tbody>
                  </table>
                  </div>

      `;

      $("#catDataLoc").empty();
      $("#catDataLoc").append(dataHTML);
    }else{
      dataHTML = `
      <div class="mb-3 hidden-md-up"></div>
      <h2 class="align-middle text-center">Error : `+ msg.error +`</h2>
      `;
      $("#catDataLoc").empty();
      $("#catDataLoc").append(dataHTML);
    }

  }).fail(function(jqXHR,textStatus){
    //connection or server fail
    alert("Failed to get category : "+textStatus+"/"+jqXHR.statusText);
  });

}

function loadGroupInfo(value){
  $.ajax({
      method: "GET",
      url: SERVER_URL+"/api/group/"+value,
      headers: {"Authorization": "Bearer " + Cookies.get("token")}
    }).done(function( msg ) {
      $("#groupLoc").html(msg.name);

    }).fail(function( jqXHR, textStatus ) {
      alert("Connection or server error : "+textStatus+"/"+jqXHR.statusText);
    });
}
