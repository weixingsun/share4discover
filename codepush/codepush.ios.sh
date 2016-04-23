#code-push release Share ./release 1.0.0 --description "release v1.0.0" --mandatory true
react-native bundle --platform ios --entry-file index.ios.js --bundle-output ./release/main.jsbundle  --assets-dest ./release --dev false
