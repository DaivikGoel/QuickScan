//
//  ARUIView.swift
//  QuickScanSwift
//
//  Created by Eric Li on 2022-03-02.
//  Copyright © 2022 iOS App Templates. All rights reserved.
//
import SwiftUI
import Foundation
struct ARUIView: View {
   @State var isRecording = false
   @State var pushActive = false
    
   @ObservedObject var state: AppState
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
                                isRecording = false
                                ar.stopRecording()
                                print(ar.getUrl())
                                self.pushActive = true
                            } else {
                                isRecording = ar.startRecording()
                            }
                        }) {
                            Text("")
                                .padding()
                                .frame(width: 40, height: 40)
                                .background(RoundedRectangle(cornerRadius: .infinity)
                                .foregroundColor(isRecording ? Color.red : Color.white))
                        }
                    }
                 }
              }
          }
       }
    }
}
