<!--EMPTY PADDING -->
<div class="mb-5"></div>

<div class="container">
  <div class="row">
    <h1>Penilaian TEC</h1>
  </div>
  <div class="row">
    <hr class="w-100"/>
  </div>

  <div class="row">
    <div class = "col-md-8 offset-md-2">

      <div id="q-1" class="card mb-3">
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
        </div>

      </div>
      <form id="submitForm">
        <span id="submitButton" onclick="submitQuiz();" class="btn btn-primary">Kirim jawaban</span>
        <div class="invalid-feedback">
          Ada yang belum diisi
        </div>
      </form>
    </div>
  </div>
</div>

<script src="js/home.js" defer="defer"></script>
