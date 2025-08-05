package org.unicef.ecar.bebbo

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * This class serves as a custom ReactPackage for registering the ExactAlarmModule.
 * It ensures that the NativeModule is available for use in the JavaScript layer of the React Native app.
 */
class ExactAlarmPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        // No custom UI components are provided in this package
        return emptyList()
    }

    /**
     * This method is used to register native modules with React Native.
     * It adds the ExactAlarmModule to the list of available modules.
     *
     * @param reactContext The React application context
     * @return A list containing the ExactAlarmModule
     */
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules: MutableList<NativeModule> = ArrayList()

        // Add the ExactAlarmModule to the list of native modules
        modules.add(ExactAlarmModule(reactContext))

        return modules
    }
}
