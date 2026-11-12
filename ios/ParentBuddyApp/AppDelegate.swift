import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import Lottie
import class SplashScreen.SplashScreen

@main
class AppDelegate: RCTAppDelegate {
  override init() {
    super.init()
    self.moduleName = "ParentBuddyApp"
    self.initialProps = [:]
    self.dependencyProvider = RCTAppDependencyProvider()
  }
  // var splashContainer: UIView?
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    FirebaseApp.configure()
    // self.moduleName = "ParentBuddyApp"
    // self.dependencyProvider = RCTAppDependencyProvider()

    // // You can add your custom initial props in the dictionary below.
    // // They will be passed down to the ViewController used by React Native.
    // self.initialProps = [:]

    // return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

    // ✅ Set rootView background color (like old AppDelegate.m)
    if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
      let window = windowScene.windows.first,
      let rootView = window.rootViewController?.view {
        rootView.backgroundColor = UIColor(red: 1, green: 1, blue: 1, alpha: 1) // white
    }

    if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
      let window = windowScene.windows.first {

        // 🔴 Build your animation view
        let splashContainer = UIView(frame: window.bounds)
        splashContainer.backgroundColor = .black // fallback background
        splashContainer.autoresizingMask = [.flexibleWidth, .flexibleHeight]

        let dynamic = Dynamic()
        let animationUIView = dynamic.createAnimationView(rootView: splashContainer, lottieName: "splash")
        animationUIView.frame = splashContainer.bounds

        // Add background image if needed
        let backgroundImageView = UIImageView(frame: animationUIView.bounds)
        backgroundImageView.image = UIImage(named: "splashimg")
        backgroundImageView.contentMode = .scaleAspectFill
        animationUIView.insertSubview(backgroundImageView, at: 0)

        splashContainer.addSubview(animationUIView)

        // 🔹 Add to window directly
        window.addSubview(splashContainer)
        window.bringSubviewToFront(splashContainer)

        // Keep the branded animation visible until the existing two-second handover.
        SplashScreen.showLottieSplash(animationUIView, inRootView: splashContainer, forceToCloseByHideMethod: true)

        // SplashScreen 3 starts the Lottie view itself.

        // Remove splash after delay or when app is ready
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            SplashScreen.hide()
            splashContainer.removeFromSuperview()
        }
        // self.splashContainer = splashContainer
    }


    return result
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
  
  override func application(
    _ application: UIApplication,
    supportedInterfaceOrientationsFor window: UIWindow?
  ) -> UIInterfaceOrientationMask {
    return Orientation.getOrientation()
  }
}
