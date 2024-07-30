package org.unicef.ecar.bebbo;

import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.security.ProviderInstaller;
// import org.devio.rn.splashscreen.SplashScreen;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity implements ProviderInstaller.ProviderInstallListener {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  private static final int ERROR_DIALOG_REQUEST_CODE = 1;

  private boolean retryProviderInstall;

  // Update the security provider when the activity is created.
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    Log.d("Mainactivity", "Mainactivity java oncreate helloo");
    SplashScreen.show(this, R.style.SplashScreenTheme, R.id.lottie); // here
    SplashScreen.setAnimationFinished(true);
    super.onCreate(savedInstanceState);
    Intent intent = getIntent();
    String action = intent.getAction();
    Uri data = intent.getData();
    ProviderInstaller.installIfNeededAsync(this, this);
  }

  @Override
  protected void onSaveInstanceState(Bundle outState) {
    super.onSaveInstanceState(outState);
    if (outState != null) {
      outState.clear();
    }
  }

  @Override
  protected String getMainComponentName() {
    return "ParentBuddyApp";
  }

  /**
   * This method is only called if the provider is successfully updated
   * (or is already up-to-date).
   */
  @Override
  public void onProviderInstalled() {
    // Provider is up-to-date, app can make secure network calls.
  }

  /**
   * This method is called if updating fails; the error code indicates
   * whether the error is recoverable.
   */
  @Override
  public void onProviderInstallFailed(int errorCode, Intent recoveryIntent) {
  }

  private void onProviderInstallerNotAvailable() {
    // This is reached if the provider cannot be updated for some reason.
    // App should consider all HTTP communication to be vulnerable, and take
    // appropriate action.
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util
   * class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and
   * Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}
