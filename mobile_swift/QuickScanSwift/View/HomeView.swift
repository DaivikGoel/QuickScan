import SwiftUI

struct HomeView: View {
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
            DrawerView(isOpen: self.$isDrawerOpen)
        }.navigationBarTitle("", displayMode: .inline)
            .navigationBarHidden(true)
    }
}
