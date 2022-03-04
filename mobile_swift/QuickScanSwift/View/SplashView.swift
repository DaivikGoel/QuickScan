import SwiftUI

struct SplashView: View {
    @State var isActive:Bool = false
    @ObservedObject var state: AppState
    
    var body: some View {
        VStack {
            if self.isActive {
                WelcomeView(state: self.state)
            } else {
                ZStack {
                    Color(UIConfiguration.tintColor)
                        .edgesIgnoringSafeArea(.all)
                    Image("logo6")
                        .resizable()
                        .frame(width: 240, height: 240, alignment: .center)
                }
            }
        }
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                withAnimation {
                    self.isActive = true
                }
            }
        }
    }
}
