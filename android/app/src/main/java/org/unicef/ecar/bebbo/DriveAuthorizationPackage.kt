package org.unicef.ecar.bebbo

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class DriveAuthorizationPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
        if (name == DriveAuthorizationModule.NAME) DriveAuthorizationModule(reactContext) else null

    override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
        mapOf(DriveAuthorizationModule.NAME to ReactModuleInfo(
            DriveAuthorizationModule.NAME,
            DriveAuthorizationModule.NAME,
            false, false, false, true
        ))
    }
}
