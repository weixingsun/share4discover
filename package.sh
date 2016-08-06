#cp android/app/google-services-debug.json android/app/google-services.json
cp android/app/google-services-release.json android/app/google-services.json

#keytool -v -list -keystore android/app/wxsun-release-key.keystore
#keytool -genkey -v -keystore share-release-key.keystore -alias share-key-alias -keyalg RSA -keysize 2048 -validity 10000
#CN=Weixing Sun, OU=Dev, O=DaBo, L=Beijing, ST=BJ, C=CN

cd android && ./gradlew clean && ./gradlew assembleRelease
sleep 5
cd ..
date=`date +%Y%m%d`
cp  android/app/build/outputs/apk/app-release.apk codepush/Share_$date.apk
scp codepush/Share_$date.apk nzmesse1@nzmessengers.co.nz:~/www/share/
#scp -P 8612 android/app/build/outputs/apk/app-release.apk root@nzmessengers.com:/root/www_apache/public_html/share/
ssh nzmesse1@nzmessengers.co.nz "cd /home1/nzmesse1/www/share && rm -f latest.apk && ln -s Share_$date.apk latest.apk"
#ios
#build Share project for simulator
#find build folder:  ios/build/Build/Products/Debug-iphonesimulator
#drag folder into iTunes
#drag app to desktop: ipa 

