<?php

use Slim\Http\Request;
use Slim\Http\Response;

define("BASE_URL", "http://localhost/Server/nilai");
define("SERVER_URL", "http://localhost/Server/kader/public/index.php");

// Routes

$app->get('/', function (Request $request, Response $response, array $args) {
  $this->renderer->render($response, "/header.php", $args);
  $this->renderer->render($response, "/home.php", $args);
  return $this->renderer->render($response, "/footer.php", $args);
});
