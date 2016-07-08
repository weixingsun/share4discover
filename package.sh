cp tools/google-services-release.json android/app/google-services.json
cd android && ./gradlew clean && ./gradlew assembleRelease
sleep 30
date=`date +%Y%m%d`
#scp -P 8612 android/app/build/outputs/apk/app-release.apk root@nzmessengers.com:/root/www_apache/public_html/share/
cp  android/app/build/outputs/apk/app-release.apk codepush/Share_$date.apk
scp codepush/Share_$date.apk nzmesse1@nzmessengers.co.nz:~/www/share/

#ios
#build Share project for simulator
#find build folder:  ios/build/Build/Products/Debug-iphonesimulator
#drag folder into iTunes
#drag app to desktop: ipa 

