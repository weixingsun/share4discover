<?
function postReq($req){
  //$pairs = explode("&", file_get_contents("php://input"));
  $json = file_get_contents('php://input');
  $obj = json_decode($json);
  $id = $obj->{'id'};   //{id,name,email,gender,type,token,expire}
  $type = $obj->{'type'};
  //error_log(print_r( $obj , true ));
  $dirname = 'user/'.$type;
  $filename = $dirname.'/'.$id.'.json';
  mkdir($dirname, 0777, true);
  $fp = fopen($filename, 'w');
  fwrite($fp, $json);
  fclose($fp);
  echo '{"user_file":"'.$filename.'"}';
}
$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

switch ($method) {
  case 'PUT':
    //do_something_with_put($request);  
    break;
  case 'POST':
    postReq($request);  
    break;
  case 'GET':
    //do_something_with_get($request);  
    break;
  case 'HEAD':
    //do_something_with_head($request);  
    break;
  case 'DELETE':
    //deleteReq($request);  
    break;
  case 'OPTIONS':
    //do_something_with_options($request);    
    break;
  default:
    //handle_error($request);  
    break;
}
?>
