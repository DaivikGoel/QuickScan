import SwiftUI

struct WelcomeView: View {
    @State private var index = 1
    @State private var pushActive = false
    @ObservedObject var state: AppState
    
    var body: some View {
        NavigationView {
            VStack {
                NavigationLink(destination: destinationView(),
                               isActive: self.$pushActive) {
                    EmptyView()
                }
                               .navigationBarHidden(true)
                
                VStack(spacing: 25) {
                    Image("logo6")
                        .resizable()
                        .frame(width: 240, height: 240, alignment: .center)
                        .colorMultiply(Color(UIConfiguration.tintColor))
                        .padding(.top, 120)
                    
                    Text("QuickScan")
                        .modifier(TextModifier(font: UIConfiguration.titleFont,
                                               color: UIConfiguration.tintColor))
                    
                    Text("Create 3D objects easily and quickly")
                        .modifier(TextModifier(font: UIConfiguration.subtitleFont))
                        .padding(.horizontal, 60)
                    VStack(spacing: 10) {
                        Button(action: {
                            self.index = 1
                            self.pushActive = true
                        }) {
                            Text("Log In")
                                .modifier(ButtonModifier(font: UIConfiguration.buttonFont,
                                                         color: UIConfiguration.tintColor,
                                                         textColor: .white,
                                                         width: 275,
                                                         height: 55))
                        }
                        Button(action: {
                            self.index = 2
                            self.pushActive = true
                        }) {
                            Text("Sign Up")
                                .modifier(TextModifier(font: UIConfiguration.buttonFont,
                                                       color: .black))
                                .frame(width: 275, height: 55)
                                .overlay(RoundedRectangle(cornerRadius: 25)
                                            .stroke(Color.gray, lineWidth: 1)
                                )
                        }
                    }
                }
                Spacer()
            }
        }.navigationViewStyle(.stack).navigationBarBackButtonHidden(true).navigationBarHidden(true).onAppear {
            UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation") // Forcing the rotation to portrait
            AppDelegate.orientationLock = .portrait // And making sure it stays that way
        }.onDisappear {
            AppDelegate.orientationLock = .all // Unlocking the rotation when leaving the view
        }
    }
    
    private func destinationView() -> AnyView {
        switch index {
        case 1:
            return AnyView(SignInView(state: state))
        case 2:
            return AnyView(SignUpView(state: state))
        default:
            return AnyView(SignUpView(state: state))
        }
    }
}
