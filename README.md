Instructions

1. Clone the repo into a folder
   git clone [repository link] .

2. Install node_modules
   npm i

3. Setup Java
   Install java with version 17.0.16 from https://adoptium.net/temurin/releases/?version=17
   Add envidomental variable to your windows system
   Variable name: JAVA_HOME
   Variable value: [your path to Eclipse Adoptium\jdk-17.0.16.8-hotspot]
   Open "Path" and add Java path with \bin

4. Create android build
   npx expo build:android

5. Setup local.properties for android
   Create local.properties file inside android/ folder
   Add you android sdk path (example: sdk.dir=C:\\Users\\Win11\\AppData\\Local\\Android\\Sdk)

6. Setup deeplink for android
   Open android/app/src/main/AndroidManifest.xml file
   Add the following code inside <activity> tag
   <intent-filter>
   <action android:name="android.intent.action.VIEW"/>
   <category android:name="android.intent.category.DEFAULT"/>
   <category android:name="android.intent.category.BROWSABLE"/>
   <data android:scheme="bfflai"/>
   </intent-filter>
