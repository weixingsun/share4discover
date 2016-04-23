cp tools/google-services-release.json android/app/google-services.json
cd android && ./gradlew clean && ./gradlew assembleRelease
sleep 30
scp -P 8612 android/app/build/outputs/apk/app-release.apk root@nzmessengers.com:/root/www_apache/public_html/share/
