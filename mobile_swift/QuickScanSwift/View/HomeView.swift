import SwiftUI

struct HomeView: View {
    @State private var pushActive = false
    @State var isDrawerOpen: Bool = false
    @ObservedObject var state: AppState
    var body: some View {
        ZStack {
            NavigationView {
                Text("Welcome \(state.currentUser?.email ?? "Not found")")
                    .navigationBarItems(leading: Button(action: {
                        self.isDrawerOpen.toggle()
                    }) {
                        Image(systemName: "sidebar.left")
                    })
            }
            VStack {
                NavigationLink(destination: ARUIView(),
                               isActive: self.$pushActive) {
                                EmptyView()
                }
                .navigationBarHidden(true)
                
                VStack(spacing: 40) {
                    VStack(spacing: 25) {
                        Button(action: {
                            self.pushActive = true
                        }) {
                            Text("Upload")
                                .modifier(ButtonModifier(font: UIConfiguration.buttonFont,
                                                         color: UIConfiguration.tintColor,
                                                         textColor: .white,
                                                         width: 275,
                                                         height: 55))
                        }
                    }
                }
                Spacer()
            }
            DrawerView(isOpen: self.$isDrawerOpen)
        }.navigationBarTitle("", displayMode: .inline)
            .navigationBarHidden(true)
    }
    
//    func upload() -> AnyView{
//        return AnyView(UploadView(state: state))
//    }
}
