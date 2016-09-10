<?php
//$iPod    = stripos($_SERVER['HTTP_USER_AGENT'],"iPod");
$iPhone  = stripos($_SERVER['HTTP_USER_AGENT'],"iPhone");
$iPad    = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
$Android = stripos($_SERVER['HTTP_USER_AGENT'],"Android");
//$currURL = $_SERVER['REQUEST_URI'];
//echo $currURL;
$key = urldecode($_GET['key']);
$sns = urldecode($_GET['sns']); //isset($_GET["sns"])

$iosURL = 'share://shareplus.co.nf/i/'.$key;
$andURL = 'intent://shareplus.co.nf/i/'.$key.'#Intent;scheme=share;package=com.share;end';
function writeA($url) {
    echo "<a href=\"{$url}\"><br><br><font size=\"10\">Please open in browser</font></a>";
}
if( $sns == 'fb' ){
	if( $iPhone || $iPad ){
		header('Location: '.$iosURL);
		exit;
	}else if($Android){
		header('Location: '.$andURL);
		exit;
	}else{
	}
}else if( $sns == 'wb' || !isset($_GET["sns"]) ){
	if( $iPhone || $iPad ){
		echo writeA($iosURL);
	}else if($Android){
		echo writeA($andURL);
	}else{
	}
}
?>
