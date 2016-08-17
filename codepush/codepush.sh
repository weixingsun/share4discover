#GitHub Access Key: peQtWYlgrEg22E8WO9KVano8L61e4yG-vGnJ-
#prod:  eP-AeP1uJtwuy_QVdGZrpj3F2mA04yG-vGnJ-
#stag:  ZplJqL1U5atxj36CLDKSEzzVmCGq4yG-vGnJ-

#code-push app ls
###code-push app add Share
###code-push app rm Share

###code-push deployment list Share --format json
#code-push deployment ls Share -k

react-native bundle --platform android --entry-file index.android.js --bundle-output ./codepush/index.android.bundle --dev true
#--assets-dest ./release 
react-native bundle --platform ios  --entry-file index.ios.js  --bundle-output ./codepush/main.jsbundle  --dev true

code-push release Share ./codepush 1.0.0  
##--description "release v1.0.0" --mandatory true    
##last parameter: same as android/app/build.gradle: versionName  =  Info.plist: bundleVersion

#android/app/src/main/java/open/share/MainActivity.java
#package open.share;
#android/app/src/main/AndroidManifest.xml
#package="open.share"
#android/app/build.gradle:
#applicationId "open.share"
