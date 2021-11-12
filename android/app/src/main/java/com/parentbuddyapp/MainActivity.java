package org.unicef.ecar.bebbo;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
// import org.devio.rn.splashscreen.SplashScreen;
import org.devio.rn.splashscreen.SplashScreen; 
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

   @Override
    protected void onCreate(Bundle savedInstanceState) {
       Log.d("Mainactivity", "Mainactivity java oncreate helloo");
        SplashScreen.show(this,R.style.SplashScreenTheme,R.id.lottie);  // here
        SplashScreen.setAnimationFinished(true);
        super.onCreate(savedInstanceState);
    }
    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (outState != null) { outState.clear(); }
    }
  @Override
  protected String getMainComponentName() {
    return "ParentBuddyApp";
  }
}
