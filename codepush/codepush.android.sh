#prod:  eP-AeP1uJtwuy_QVdGZrpj3F2mA04yG-vGnJ-
#stag:  ZplJqL1U5atxj36CLDKSEzzVmCGq4yG-vGnJ-

#code-push app ls
###code-push app add Share
###code-push app rm Share

###code-push deployment list Share --format json
#code-push deployment ls Share -k

react-native bundle --platform android --entry-file index.android.js --bundle-output ./release/index.android.bundle --dev true    //--assets-dest ./release 

code-push release Share ./release 1.0.0  
##--description "release v1.0.0" --mandatory true    
##last parameter: same as android/app/build.gradle: versionName
