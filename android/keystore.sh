keytool -v -list -keystore app/wxsun-release-key.keystore
keytool -list -v -keystore ~/.android/debug.keystore
keytool -exportcert -alias wxsun_alias -keystore app/wxsun-release-key.keystore | openssl sha1 -binary | openssl base64
