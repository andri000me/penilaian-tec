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
                  <h3 class="text-md-left text-center">`+$("#cat-"+selected).html()+`</h3>
                </div>
              </div>
              <hr/>
              <div class="table-responsive-sm">
              <table class="table">
                <thead>
                  <th>Nama</th>
                  <th>Hapus</th>
                </thead>
                <tbody id="itemList">
  `;

  $.each(currentCat,function(index,value){
    itemCount = itemCount +1;
    dataHTML+=`
                  <tr id="item-`+itemCount+`">
                    <td><textarea class="form-control catItemName" data-id="`+value.id+`" rows="1">`+value.name+`</textarea></td>
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
      <td><textarea class="form-control catItemName" data-id="-99" rows="1"></textarea></td>
      <td><button onclick="deleteCat(`+itemCount+`)" class="btn btn-danger">X</button></td>
    </tr>

  `;
  $("#itemList").append(dataHTML);
}

function submitCat(){

  $(".catItemName").each(function( index ) {
    dataSend.push({id:$(this).attr("data-id"),value:$(this).val()});
  });

  $.ajax({
    method: "POST",
    url: BASE_URL+"/category/edit",
    data: {"catId": selected,
          "token": Cookies.get("token"),
          "uid":Cookies.get("uid"),
          "item":dataSend},
    dataType: 'json'
  }).done(function( msg ) {
    if(typeof msg.status != "undefined"){
      if(msg.status == "success"){
          alert("Sukses");
          location.reload;
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
    url: BASE_URL+"/getCat/"+catID,
    headers: {"Authorization": "Bearer " + Cookies.get("token")}
  }).done(function(msg){
    if(msg.status=="success"){
      currentCat = msg.data;

      //fill data
      dataHTML = `
                    <div class="mb-3 hidden-md-up"></div>
                    <div class="row align-items-center">
                    <div class="col-md-8">
                      <h3 class="text-md-left text-center">`+$("#cat-"+catID).html()+`</h3>
                    </div>
                    <div class="dropdown text-center col-md-4">
                      <button onclick="editCat(`+catID+`)" class="btn btn-primary" type="button">
                        Edit
                      </button>
                    </div>
                  </div>
                  <hr/>
                  <div class="table-responsive-sm">
                  <table class="table">
                    <thead>
                      <th>Id</th>
                      <th>Nama</th>
                    </thead>
                    <tbody>
      `;

      $.each(msg.data,function(index,value){
        dataHTML+=`
                      <tr>
                        <th>`+value.id+`</th>
                        <td>`+value.name+`</td>
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
