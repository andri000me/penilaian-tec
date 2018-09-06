<?php

use Slim\Http\Request;
use Slim\Http\Response;

define("BASE_URL", getenv("baseUrl"));
define("SERVER_URL", getenv("serverUrl"));

// Routes

$app->get('/', function (Request $request, Response $response, array $args) {
  $this->renderer->render($response, "/header.php", $args);
  $this->renderer->render($response, "/home.php", $args);
  return $this->renderer->render($response, "/footer.php", $args);
});

$app->get('/admin', function (Request $request, Response $response, array $args) {
  $this->renderer->render($response, "/header.php", $args);
  $this->renderer->render($response, "/admin-landing.php", $args);
  return $this->renderer->render($response, "/footer.php", $args);
});

$app->get('/admin/category', function (Request $request, Response $response, array $args) {
  $sql = "SELECT * FROM `scoringCategory`";

  try {
    $db = $this->get('db');
    $stmt = $db->prepare($sql);
    $stmt->execute();

    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $args['items']=$items;
  }
  catch (PDOException $e) {
    $error = ["status" => "error", "error" => $e->getMessage()];
    return $this->renderer->render($response, $error, $args);
  }

  $this->renderer->render($response, "/header.php", $args);
  $this->renderer->render($response, "/admin-category.php", $args);
  return $this->renderer->render($response, "/footer.php", $args);
});

$app->get('/getScoringItem/{type}', function (Request $request, Response $response, array $args) {
  $sql = "SELECT scoringCategory.id AS catId,scoringCategory.name AS catName, scoringCategory.description, scoringItem.id AS itemId, scoringItem.name AS itemName, scoringItem.description AS itemDesc  FROM `scoringCategory` INNER JOIN `scoringItem` ON `scoringCategory`.`id` = `scoringItem`.`category` WHERE targetType=:target";

  try {
    $db = $this->get('db');
    $stmt = $db->prepare($sql);
    $stmt->execute([":target" => $args["type"]]);

    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
  catch (PDOException $e) {
    $error = ["status" => "error", "error" => $e->getMessage()];
    return $response->withJson($error);
  }

  return $response->withJson(["status"=>"success","data"=>$items]);

});

$app->get('/getCat/{catId}', function (Request $request, Response $response, array $args) {
  $sql = "SELECT * FROM `scoringItem` WHERE `category`=:catId";

  try {
    $db = $this->get('db');
    $stmt = $db->prepare($sql);
    $stmt->execute([":catId" => $args["catId"]]);

    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
  catch (PDOException $e) {
    $error = ["status" => "error", "error" => $e->getMessage()];
    return $response->withJson($error);
  }

  return $response->withJson(["status"=>"success","data"=>$items]);

});

$app->post('/submitScore', function (Request $request, Response $response, array $args) {
  $scores = $request->getParam("scores");
  $token = $request->getParam("token");
  $uid = $request->getParam("uid");

  $opt = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"Authorization: bearer ".$token . "\r\n")
  );

  $context = stream_context_create($opt);

  $url = SERVER_URL . "/api/verifyToken/".$uid;

  $verify = file_get_contents($url, false, $context);

  $data = json_decode($verify);

  if ($data->status!="valid"){
    $error = ["status" => "error", "error" => "token invalid"];
    return $response->withJson($error);
  }

  $sql = "INSERT INTO `score`(`uidFrom`,`uidTo`,`itemId`,`score`) VALUES ";

  $valueArray = [];
  $sqlArray = [];
  foreach ($scores as $score) {
    $sqlArray[] = "(". $uid . ", ?, ?, ?)";
    $valueArray[] = $score["target"];
    $valueArray[] = $score["itemId"];
    $valueArray[] = $score["score"];
  }

  $sql = $sql . implode(",", $sqlArray);

  try {
    $db = $this->get('db');
    $stmt = $db->prepare($sql);
    $stmt->execute($valueArray);
  }
  catch (PDOException $e) {
    $error = ["status" => "error", "error" => $e->getMessage()];
    return $response->withJson($error);
  }

  return $this->response->withJson(["status" => "success"]);
});

$app->post('/category/edit', function (Request $request, Response $response, array $args) {
  $cid = $request->getParam("catId");
  $token = $request->getParam("token");
  $judul = $request->getParam("judul");
  $desc = $request->getParam("desc");
  $items = $request->getParam("item");
  $uid = $request->getParam("uid");

  $opt = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"Authorization: bearer ".$token . "\r\n")
  );

  $context = stream_context_create($opt);

  $url = SERVER_URL . "/api/verifyToken/".$uid;

  $verify = file_get_contents($url, false, $context);

  $data = json_decode($verify);

  if ($data->status!="valid"){
    $error = ["status" => "error", "error" => "Token invalid"];
    return $response->withJson($error);
  }

  if($data->isAdmin!=1){
    $error = ["status" => "error", "error" => "Not admin" ];
    return $response->withJson($error);
  }

  // $sql = "INSERT INTO `score`(`uidFrom`,`uidTo`,`itemId`,`score`) VALUES ";

  $sql = "UPDATE `scoringCategory` SET `name`=?, `description`=? WHERE `id`= ?;";
  $valueArray = [];
  $valueArray[] = $judul;
  $valueArray[] = $desc;
  $valueArray[] = $cid;

  foreach ($items as $item) {
    if($item["id"]==-99){
      $sql .= "INSERT INTO `scoringItem` (`category`, `name`,`description`) VALUES (?, ?, ?) ;";
      $valueArray[] = $cid;
      $valueArray[] = $item["value"];
      $valueArray[] = $item["desc"];
    }else{
      if($item["value"]=="delete"){
        $sql .= "DELETE FROM `scoringItem` WHERE `scoringItem`.`id` = ? ;";
        $valueArray[] = $item["id"];
      }else{
        $sql .= "UPDATE `scoringItem` SET `name` = ?, `description`=? WHERE `scoringItem`.`id` = ? ;";
        $valueArray[] = $item["value"];
        $valueArray[] = $item["desc"];
        $valueArray[] = $item["id"];
      }
    }
  }

  // return $this->response->withJson(["status" => $sql,"abc"=>$valueArray]);

  try {
    $db = $this->get('db');
    $stmt = $db->prepare($sql);
    $stmt->execute($valueArray);
  }
  catch (PDOException $e) {
    $error = ["status" => "error", "error" => $e->getMessage()];
    return $response->withJson($error);
  }

  return $this->response->withJson(["status" => "success"]);
});
