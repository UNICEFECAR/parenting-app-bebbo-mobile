# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

-keep class com.facebook.jni.** { *; }
-keep,allowobfuscation @interface com.facebook.jni.annotations.DoNotStrip
-keep @com.facebook.jni.annotations.DoNotStrip class *
-keepclassmembers class * { @com.facebook.jni.annotations.DoNotStrip *; }

# Realm loads this class and its methods by name from native code.
-keep class io.realm.react.util.SSLHelper { *; }

# React Native registers these classes and callbacks by name through JNI.
-keep class com.facebook.react.devsupport.CxxInspectorPackagerConnection { *; }
-keep class com.facebook.react.devsupport.CxxInspectorPackagerConnection$* { *; }

# Firebase discovers registrars through manifest metadata and invokes their
# no-argument constructors reflectively. Keep those constructors under R8.
-keep class * implements com.google.firebase.components.ComponentRegistrar {
    public <init>();
}
