//
//  ARUIView.swift
//  QuickScanSwift
//
//  Created by Eric Li on 2022-03-02.
//  Copyright © 2022 iOS App Templates. All rights reserved.
//
import SwiftUI
import Foundation
import ARKit
struct ARUIView: View {
    @State var isRecording = false
    @State var hasVideo = false
    @State var isPaused = false
    @State var pushActive = false
    @State var buttonShow = true
    @State var toggledOn = false
    
    @ObservedObject var state: AppState
    
    func toggleFlashLight() {
        // Toggle flashlight
        
        guard let device = AVCaptureDevice.default(for: AVMediaType.video) else { return }
        guard device.hasTorch else { return }
        
        do {
            try device.lockForConfiguration()
            
            if (device.torchMode == AVCaptureDevice.TorchMode.on) {
                device.torchMode = AVCaptureDevice.TorchMode.off
            } else {
                do {
                    try device.setTorchModeOn(level: 1.0)
                } catch {
                    print(error)
                }
            }
            
            device.unlockForConfiguration()
        } catch {
            print(error)
        }
    }
    
    
    let ar = ARView()
    var body: some View {
        NavigationView {
            VStack(spacing: -100) {
                NavigationLink(destination: UploadView(state: state, url: ar.getUrl()),
                               isActive: self.$pushActive) {
                    EmptyView()
                }.hidden()
                ZStack {
                    ar
                    VStack {
                        Spacer()
                        Button(action: {
                            if (self.buttonShow) {
                                self.buttonShow = false
                            } else {
                                self.buttonShow = true
                            }
                        }, label: {
                            Text("Tap the screen to create a bounding box.\n Drag the corners of the box to modify size and shape. Tap and drag the box to move it wherever you desire.\n When you are ready, tap the record button and fill the box to complete the recording.\n\n Tap to dismiss")
                                .foregroundColor(Color.black).multilineTextAlignment(.center)        .font(.system(size: 500))
                                .minimumScaleFactor(0.01)
                        })
                            .frame(height: 220)
                            .frame(maxWidth: .infinity)
                            .background(
                                RoundedRectangle(cornerRadius: 90, style: .continuous).fill(Color.white)
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 90, style: .continuous)
                                    .strokeBorder(Color.blue, lineWidth: 1)
                            )
                            .opacity(self.buttonShow ? 1 : 0)
                        Spacer()
                        HStack {
                            Spacer()
                            Button {
                                toggleFlashLight()
                            } label: {
                                Image(systemName: "flashlight.on.fill").font(.system(size: 30.0)).foregroundColor(Color.white)
                            }.padding()
                            Spacer()
                            Spacer()
                            ZStack {
                                Circle()
                                    .frame(width: 60, height: 60)
                                    .opacity(0)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: .infinity)
                                            .stroke(Color.white, lineWidth: 5)
                                    )
                                Button(action: {
                                    if (isRecording) {
                                        isPaused = true
                                        isRecording = false
                                        ar.pauseRecording()
                                    } else if (isPaused) {
                                        isPaused = false
                                        isRecording = true
                                        ar.resumeRecording()
                                    } else {
                                        isRecording = ar.startRecording()
                                        hasVideo = isRecording
                                    }
                                }) {
                                    Text("")
                                        .padding()
                                        .frame(width: 40, height: 40)
                                        .background(RoundedRectangle(cornerRadius: .infinity)
                                                        .foregroundColor(isRecording ? Color.red : Color.white))
                                }
                            }
                            Spacer()
                            Spacer()
                            Button {
                                if (hasVideo) {
                                    isPaused = false
                                    isRecording = false
                                    ar.stopRecording()
                                    self.pushActive = true
                                } else {
                                    ar.showAlert(msg: "Record a video before uploading")
                                }
                            } label: {
                                Image(systemName: "square.and.arrow.up").font(.system(size: 30.0)).foregroundColor(Color.white)
                            }.padding()
                            Spacer()
                        }
                    }
                }
            }
        }.navigationViewStyle(StackNavigationViewStyle()).navigationBarBackButtonHidden(true).navigationBarHidden(true).onAppear {
            UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation") // Forcing the rotation to portrait
            AppDelegate.orientationLock = .portrait // And making sure it stays that way
        }.onDisappear {
            AppDelegate.orientationLock = .all // Unlocking the rotation when leaving the view
        }
    }
}
