//
//  WebUIController.swift
//  QuickScanSwift
//
//  Created by Eric Li on 2022-03-08.
//  Copyright © 2022 iOS App Templates. All rights reserved.
//

import UIKit
import WebKit
class WebViewController: UIViewController, WKUIDelegate {
    
    var webView: WKWebView!
    
    override func loadView() {
        let webConfiguration = WKWebViewConfiguration()
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.uiDelegate = self
        view = webView
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let myURL = URL(string:"https://relaxed-snyder-a1ac71.netlify.app/dashboard/")
        let myRequest = URLRequest(url: myURL!)
        webView.load(myRequest)
    }
}
