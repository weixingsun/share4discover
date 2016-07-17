<?
function deleteReq($req){
    $params = Array();
    parse_str(file_get_contents('php://input'), $params);
    //$str_arr = implode(",", $params);
    //$str_arr = json_encode($params);
    $file = $params['to_delete'];
    $folder = $params['key'];
    $filename = "info/".$folder."/".$file;
    if (file_exists($filename)) {
        unlink($filename);
        //error_log("File deleted: ". $filename);
    } else {
        //echo 'Could not delete '.$filename.', file does not exist';
        //error_log("File not found: ". $filename);
    }
}
function postReq($req){
    $contents = file_get_contents($_FILES["image"]["tmp_name"]);
    $ffilename=$_FILES["image"]["name"];
    $pos = strpos($ffilename, '-');  //car:lat,lng:ctime-0.jpg
    $files = explode("-", $ffilename);
    $dirname='info/'.$files[0];
    $filename = $files[1];
    //$dirname=$_FILES["image"]["dirname"];
    //$all = array('png','jpeg','jpg','gif','mov','txt','wmv','pdf');
    if (!file_exists($dirname)) {
      mkdir($dirname, 0777, true);
      error_log("dirname=$dirname  filename=$filename");
    }
    $fh = fopen($dirname.'/'.$filename, "w+");
    fwrite($fh, $contents);
    fclose($fh);
    echo "OK:".$ffilename;
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
    deleteReq($request);  
    break;
  case 'OPTIONS':
    //do_something_with_options($request);    
    break;
  default:
    //handle_error($request);  
    break;
}
?>
