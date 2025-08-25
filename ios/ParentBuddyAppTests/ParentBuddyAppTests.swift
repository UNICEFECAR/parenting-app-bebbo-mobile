//
//  ParentBuddyAppTests.swift
//  ParentBuddyAppTests
//
//  Created by neha ruparel on 18/07/25.
//

import XCTest
import UIKit
import React

class ParentBuddyAppTests: XCTestCase {
    let TIMEOUT_SECONDS: TimeInterval = 600
    let TEXT_TO_LOOK_FOR = "Welcome to React"

    func findSubview(in view: UIView, matching test: (UIView) -> Bool) -> Bool {
        if test(view) {
            return true
        }
        for subview in view.subviews {
            if findSubview(in: subview, matching: test) {
                return true
            }
        }
        return false
    }

    func testRendersWelcomeScreen() {
        guard let rootViewController = UIApplication.shared.delegate?.window??.rootViewController else {
            XCTFail("Could not get root view controller")
            return
        }

        let timeoutDate = Date(timeIntervalSinceNow: TIMEOUT_SECONDS)
        var foundElement = false
        var redboxError: String? = nil

#if DEBUG
        RCTSetLogFunction { level, _, _, _, message in
            if level.rawValue >= RCTLogLevel.error.rawValue {
                redboxError = message
            }
        }
#endif

        while Date() < timeoutDate && !foundElement && redboxError == nil {
            RunLoop.main.run(mode: .default, before: Date(timeIntervalSinceNow: 0.1))
            RunLoop.main.run(mode: .common, before: Date(timeIntervalSinceNow: 0.1))

            foundElement = findSubview(in: rootViewController.view) { view in
                return view.accessibilityLabel == TEXT_TO_LOOK_FOR
            }
        }

#if DEBUG
        RCTSetLogFunction(RCTDefaultLogFunction)
#endif

        XCTAssertNil(redboxError, "RedBox error: \(redboxError ?? "")")
        XCTAssertTrue(foundElement, "Couldn't find element with text '\(TEXT_TO_LOOK_FOR)' in \(Int(TIMEOUT_SECONDS)) seconds")
    }
}