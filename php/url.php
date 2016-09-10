<?php

//Detect special conditions devices
$iPod    = stripos($_SERVER['HTTP_USER_AGENT'],"iPod");
$iPhone  = stripos($_SERVER['HTTP_USER_AGENT'],"iPhone");
$iPad    = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
$Android = stripos($_SERVER['HTTP_USER_AGENT'],"Android");
//$webOS   = stripos($_SERVER['HTTP_USER_AGENT'],"webOS");

//$currURL = $_SERVER['REQUEST_URI'];
//echo $currURL;
$key = urldecode($_GET['key']);

if( $iPod || $iPhone || $iPad ){
    $newURL = 'share://shareplus.co.nf/i/'.$key;
    header('Location: '.$newURL);
    exit;
}else if($Android){
    $newURL = 'intent://shareplus.co.nf/i/'.$key.'#Intent;scheme=share;package=com.share;end';
    header('Location: '.$newURL);
    exit;
//}else{
}

?>
