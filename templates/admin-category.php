<link rel="stylesheet" type="text/css" href="<?=BASE_URL?>/css/admin-category.css" />

<div class="container mt-5">
  <div class="row">
    <div class="col-md-4">
      <div class="card">
        <h3 class="card-header">Daftar Penilaian</h3>
        <div class="card-body px-1">
          <ul id="catList" class="list-group">
            <?php
              foreach ($items as $item) {
                echo<<<HTML
                <span onclick="getCat({$item['id']});" id="cat-{$item['id']}"
                class="list-group-item list-group-item-action">{$item['name']}</span>
HTML;
              }
             ?>
          </ul>
        </div>
      </div>


    </div>
    <div id="catDataLoc" class="col-md-8 my-auto">
      <!-- Placeholder sebelum diselect quiz -->
      <div class="mb-3 hidden-md-up"></div>
      <h2 class="align-middle text-center">Silahkan pilih kategori</h2>
    </div>
  </div>
</div>

<script src="<?=BASE_URL?>/js/admin-category.js" defer="defer"></script>
<script src="<?=BASE_URL?>/js/admin.js" defer="defer"></script>
