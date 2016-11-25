color="x_blue"
and_dir="mipmap-mdpi,mipmap-hdpi,mipmap-xhdpi,mipmap-xxhdpi"
cp ~/icons/$color/android/mipmap-mdpi/ic_launcher.png android/app/src/main/res/mipmap-mdpi/
cp ~/icons/$color/android/mipmap-hdpi/ic_launcher.png android/app/src/main/res/mipmap-hdpi/
cp ~/icons/$color/android/mipmap-xhdpi/ic_launcher.png android/app/src/main/res/mipmap-xhdpi/
cp ~/icons/$color/android/mipmap-xxhdpi/ic_launcher.png android/app/src/main/res/mipmap-xxhdpi/

ios_dir="ios/Share/Images.xcassets/AppIcon.appiconset/"
ios_pics="icon-29@2x.png,icon-29@3x.png,icon-40@2x.png,icon-40@3x.png,icon-60@2x.png,icon-60@3x.png"
cp ~/icons/$color/ios/AppIcon.appiconset/icon-29\@2x.png $ios_dir
cp ~/icons/$color/ios/AppIcon.appiconset/icon-29\@3x.png $ios_dir
cp ~/icons/$color/ios/AppIcon.appiconset/icon-40\@2x.png $ios_dir
cp ~/icons/$color/ios/AppIcon.appiconset/icon-40\@3x.png $ios_dir
cp ~/icons/$color/ios/AppIcon.appiconset/icon-60\@2x.png $ios_dir
cp ~/icons/$color/ios/AppIcon.appiconset/icon-60\@3x.png $ios_dir
cp ~/icons/$color/ios/iTunesArtwork.png img/icon.png
