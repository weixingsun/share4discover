<?
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
?>
