import SwiftUI

struct HomeView: View {
    @State private var pushActive = false
    @ObservedObject var state: AppState
    var body: some View {
        ZStack {
            NavigationView{
                NavigationLink(destination: ARUIView(state: state),
                               isActive: self.$pushActive) {
                  EmptyView()
                }.hidden()
                VStack {
                    VStack(alignment: .center, spacing: 200) {
                        VStack(alignment: .center, spacing: 25) {
                            Text("You have successfully uploaded your video")
                            customButton(title: "Take another video",
                                         backgroundColor: UIColor(hexString: "#913FE7"),
                                         action: {
                                self.pushActive = true
                            })

                        }
                    }
                    Spacer()
                }
            }.navigationBarTitle("", displayMode: .inline)
                .navigationBarHidden(true)
        }.navigationViewStyle(.stack)
    }
    private func customButton(title: String,
                              backgroundColor: UIColor,
                              action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .modifier(ButtonModifier(font: UIConfiguration.buttonFont,
                                         color: backgroundColor,
                                         textColor: .white,
                                         width: 275,
                                         height: 55))
        }
    }
    
//    func upload() -> AnyView{
//        return AnyView(UploadView(state: state))
//    }
}
