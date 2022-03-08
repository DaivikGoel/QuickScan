//
//  ARView.swift
//  QuickScanSwift
//
//  Created by Eric Li on 2022-03-02.
//  Copyright © 2022 iOS App Templates. All rights reserved.
//

import Foundation
import SwiftUI

struct WebView: UIViewControllerRepresentable {
    typealias UIViewControllerType = WebViewController
    let controller = WebViewController()
    func makeUIViewController(context: Context) -> WebViewController {
        return controller
    }
    
    func updateUIViewController(_ uiViewController:
       WebView.UIViewControllerType, context:
       UIViewControllerRepresentableContext<WebView>) { }
    
    
}
