package org.unicef.ecar.bebbo;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * This class serves as a custom ReactPackage for registering the ExactAlarmModule.
 * It ensures that the NativeModule is available for use in the JavaScript layer of the React Native app.
 */
public class ExactAlarmPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        // No custom UI components are provided in this package
        return Collections.emptyList();
    }

    /**
     * This method is used to register native modules with React Native.
     * It adds the ExactAlarmModule to the list of available modules.
     *
     * @param reactContext The React application context
     * @return A list containing the ExactAlarmModule
     */
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        // Add the ExactAlarmModule to the list of native modules
        modules.add(new ExactAlarmModule(reactContext));

        return modules;
    }
}
