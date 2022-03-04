//
//  ARView.swift
//  QuickScanSwift
//
//  Created by Eric Li on 2022-03-02.
//  Copyright © 2022 iOS App Templates. All rights reserved.
//

import Foundation
import SwiftUI

struct ARView: UIViewControllerRepresentable {
    typealias UIViewControllerType = ViewController
    let controller = ViewController()
    func makeUIViewController(context: Context) -> ViewController {
        return controller
    }
    
    func startRecording() -> Bool {
        if controller.scan!.state == .defineBoundingBox {
            controller.switchToNextState()
            controller.startRecording()
            return true
        }
        return false
    }
    
    func stopRecording() {
        return controller.stopRecording()
    }
    
    func getUrl() -> String {
        return controller.outputUrl
    }
    
    func updateUIViewController(_ uiViewController:
       ARView.UIViewControllerType, context:
       UIViewControllerRepresentableContext<ARView>) { }
    
    
}
