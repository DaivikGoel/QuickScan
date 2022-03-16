//
//  TutorialView.swift
//  QuickScanSwift
//
//  Created by Eric Li on 2022-03-15.
//  Copyright © 2022 iOS App Templates. All rights reserved.
//

import SwiftUI
import AVKit

struct TutorialView: View {
    @ObservedObject var state: AppState
    @State var shouldShowTutorial: Bool = true
    @State var shouldNotShowTutorial: Bool = false
    
    var body: some View {
        NavigationLink(destination: ARUIView(state: state),
                       isActive: self.$shouldNotShowTutorial) {
            EmptyView()
        }.hidden()
        TabView {
            FirstView(shouldShowTutorial: $shouldShowTutorial, shouldNotShowTutorial: $shouldNotShowTutorial)
            SecondView()
            ThirdView()
            FourthView()
            FifthView()
            SixthView()
            SeventhView(shouldShowTutorial: $shouldShowTutorial, shouldNotShowTutorial: $shouldNotShowTutorial)
        }
        .tabViewStyle(PageTabViewStyle())
        .indexViewStyle(PageIndexViewStyle(backgroundDisplayMode: .always))
    }
}

struct FirstView: View {
    @Binding var shouldShowTutorial: Bool
    @Binding var shouldNotShowTutorial: Bool
    var body: some View {
        VStack {
            Text("Want to know the best way to use QuickScan?")
                .bold()
                .padding()
                .font(.system(size: 24))
            Text("Swipe through our short tutorial")
                .bold()
                .padding()
                .font(.system(size: 24))
            Button(action: {
                shouldShowTutorial.toggle()
                shouldNotShowTutorial.toggle()
            }, label: {
                Text("Skip Tutorial")
                    .bold()
                    .foregroundColor(Color.white)
                    .frame(width: 200, height: 50)
                    .background(Color(UIColor(hexString: "#913FE7")))
                    .cornerRadius(12)
            })
        }
    }
}

struct SecondView: View {
    var body: some View {
        VStack {
            VideoPlayerView(name: "video1")
                .padding()
            Text("Start by pointing at an object and tapping it")
                .padding(60)
                .font(.system(size: 24))
            Spacer()
        }
    }
}

struct ThirdView: View {
    var body: some View {
        VStack {
            VideoPlayerView(name: "video2")
                .padding()
            Text("You can move the bounding box with intuitive gestures such as dragging, pinching, rotating and two finger dragging")
                .padding(60)
                .font(.system(size: 24))
        }
    }
}

struct FourthView: View {
    var body: some View {
        VStack {
            VideoPlayerView(name: "video3")
                .padding()
            Text("Try to highlight all the tiles on the bounding box for the best results")
                .padding(60)
                .font(.system(size: 24))
        }
    }
}

struct FifthView: View {
    var body: some View {
        VStack {
            VideoPlayerView(name: "video4")
                .padding()
            Text("You can pause and resume the video as much as you want!")
                .padding()
                .font(.system(size: 24))
            Text("It is useful when capturing the bottom of an object")
                .padding(.bottom)
                .font(.system(size: 24))
            Text("")
                .padding(.bottom)
        }
    }
}

struct SixthView: View {
    var body: some View {
        VStack {
            Text("Make sure your in a well lit area for the best results")
                .padding()
                .font(.system(size: 24))
            Text("It never hurts to use the flashlight!")
                .padding()
                .font(.system(size: 24))
            Image(systemName: "flashlight.on.fill")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 150, height: 150)
                .padding()
        }
    }
}

struct SeventhView: View {
    @Binding var shouldShowTutorial: Bool
    @Binding var shouldNotShowTutorial: Bool
    var body: some View {
        VStack {
            Text("You're all set to begin scanning!")
                .padding()
                .font(.system(size: 24))
            Button(action: {
                shouldShowTutorial.toggle()
                shouldNotShowTutorial.toggle()
            }, label: {
                Text("End Tutorial")
                    .bold()
                    .foregroundColor(Color.white)
                    .frame(width: 200, height: 50)
                    .background(Color(UIColor(hexString: "#913FE7")))
                    .cornerRadius(12)
            })
        }
    }
}
