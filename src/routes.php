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

$app->get('/getScoringItem/{type}', function (Request $request, Response $response, array $args) {
  $sql = "SELECT scoringCategory.id AS catId,scoringCategory.name AS catName, description, scoringItem.id AS itemId, scoringItem.name AS itemName FROM `scoringCategory` INNER JOIN `scoringItem` ON `scoringCategory`.`id` = `scoringItem`.`category` WHERE targetType=:target";

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

  $sql = "INSERT INTO `score`(`uidFrom`,`uidTo`,`score`) VALUES ";

  $valueArray = [];
  $sqlArray = [];
  foreach ($scores as $score) {
    $sqlArray[] = "(". $uid . ", ?, ?)";
    $valueArray[] = $score["target"];
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
