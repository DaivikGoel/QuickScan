import SwiftUI
import Combine
import FBSDKCoreKit
import FBSDKLoginKit
import FirebaseAuth
import GoogleSignIn

struct SignInView: View {
    @State var pushActive = false
    @ObservedObject private var viewModel: SignInViewModel
    @ObservedObject var vm: UserAuthModel
    
    init(state: AppState) {
        self.viewModel = SignInViewModel(authAPI: AuthService(), state: state)
        self.vm = UserAuthModel()
    }
    
    fileprivate func SignOutButton() -> Button<Text> {
        Button(action: {
            vm.signOut()
        }) {
            Text("Sign Out")
        }
    }
    
    fileprivate func SignInButton() -> Button<Text> {
        Button(action: {
            vm.signIn()
        }) {
            Text("Google Sign-in")
        }
    }
    
    var body: some View {
        ScrollView {VStack {
            NavigationLink(destination: ARUIView(state: viewModel.state),
                           isActive: self.$pushActive) {
              EmptyView()
            }.hidden()
            .onReceive(self.vm.$isLoggedInFirebase) { newVal in // << here !!
                                self.pushActive = newVal
                            }
            VStack(alignment: .center, spacing: 35) {
                Text("Log in")
                    .modifier(TextModifier(font: UIConfiguration.titleFont,
                                           color: UIConfiguration.tintColor))
                    .padding(.leading, 25)
                    .padding(.horizontal, 60)
                VStack(alignment: .center, spacing: 30) {
                    VStack(alignment: .center, spacing: 25) {
                        CustomTextField(placeHolderText: "E-mail",
                                      text: $viewModel.email)
                        CustomTextField(placeHolderText: "Password",
                                      text: $viewModel.password,
                                      isPasswordType: true)
                    }.padding(.horizontal, 25).padding(.vertical, 50)
                    VStack(alignment: .center, spacing: 40) {
                        customButton(title: "Login",
                                     backgroundColor: UIColor(hexString: "#913FE7"),
                                     action: self.viewModel.login)
                    }
                }
            }
            Spacer()
            if #available(iOS 14.0, *) {
                VStack{
                    if(vm.isLoggedIn){
                        SignOutButton()
                    }else{
                        SignInButton()
                    }
                }.navigationTitle("")
            } else {
                // Fallback on earlier versions
            }
            
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
