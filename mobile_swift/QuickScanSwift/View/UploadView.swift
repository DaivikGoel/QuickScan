import SwiftUI
import Combine
import FBSDKCoreKit
import FBSDKLoginKit
import FirebaseAuth

struct UploadView: View {
    @State var pushActive = false
    @ObservedObject private var viewModel: UploadViewModel
    
    init(state: AppState, url: String) {
        self.viewModel = UploadViewModel(authAPI: AuthService(), state: state, url: url)
    }
    
    var body: some View {
        VStack {
            NavigationLink(destination: HomeView(state: viewModel.state),
                           isActive: self.$pushActive) {
              EmptyView()
            }.hidden()
            VStack(alignment: .leading, spacing: 30) {
                Text("Upload")
                    .modifier(TextModifier(font: UIConfiguration.titleFont,
                                           color: UIConfiguration.tintColor))
                    .padding(.leading, 25)
                    .padding(.bottom, 80)
                VStack(alignment: .center, spacing: 40) {
                    customButton(title: "Do some random shit",
                                 backgroundColor: UIColor(hexString: "#334D92"),
                                 action: self.viewModel.upload)
                }
            }
            Spacer()
        }.alert(item: self.$viewModel.statusViewModel) { status in
            Alert(title: Text(status.title),
                  message: Text(status.message),
                  dismissButton: .default(Text("OK"), action: {
                    if status.title == "Successful" {
                        self.pushActive = true
                    }
                  }))
        }
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
}
