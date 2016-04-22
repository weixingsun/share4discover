cd android && ./gradlew assembleRelease
scp -P 8612 android/app/build/outputs/apk/app-release.apk root@nzmessengers.com:/root/www_apache/public_html/share/
