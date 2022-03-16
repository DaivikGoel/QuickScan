//
//  VideoPlayerView.swift
//  QuickScanSwift
//
//  Created by Eric Li on 2022-03-16.
//  Copyright © 2022 iOS App Templates. All rights reserved.
//

import SwiftUI
import AVKit
import AVFoundation

struct VideoPlayerView: UIViewRepresentable {
    let name: String
    init(name: String) {
        self.name = name
    }
    func updateUIView(_ uiView: UIView, context: UIViewRepresentableContext<VideoPlayerView>) {
    }

    func makeUIView(context: Context) -> UIView {
        return LoopingPlayerUIView(frame: .zero, name: name)
    }
}


class LoopingPlayerUIView: UIView {
    private let playerLayer = AVPlayerLayer()
    private var playerLooper: AVPlayerLooper?
    let name: String

    init(frame: CGRect, name: String) {
        self.name = name
        super.init(frame: frame)

        // Load the resource
        let fileUrl = Bundle.main.url(forResource: name, withExtension: "mov")!
        let asset = AVAsset(url: fileUrl)
        let item = AVPlayerItem(asset: asset)
        
        // Setup the player
        let player = AVQueuePlayer()
        playerLayer.player = player
        playerLayer.videoGravity = .resizeAspectFill
        layer.addSublayer(playerLayer)
         
        // Create a new player looper with the queue player and template item
        playerLooper = AVPlayerLooper(player: player, templateItem: item)

        // Start the movie
        player.isMuted = true
        player.play()
    }
    
    required init?(coder: NSCoder) {
        self.name = "video1"
        super.init(coder: coder)
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        playerLayer.frame = bounds
    }
}
