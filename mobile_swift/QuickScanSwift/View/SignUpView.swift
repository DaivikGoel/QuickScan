import SwiftUI

struct SignUpView: View {
    @ObservedObject private var viewModel: SignUpViewModel
    @State var pushActive = false
    @State var pushActiveWelcome = false
    
    init(state: AppState) {
        self.viewModel = SignUpViewModel(authAPI: AuthService(), state: state)
    }
    
    var body: some View {
        ScrollView{VStack {
            NavigationLink(destination: WelcomeView(state: viewModel.state),
                           isActive: self.$pushActive) {
              EmptyView()
            }.hidden()
            NavigationLink(destination: WelcomeView(state: viewModel.state),
                           isActive: self.$pushActiveWelcome) {
              EmptyView()
            }.hidden()
            VStack(alignment: .center, spacing: 30) {
                Text("Sign Up")
                    .modifier(TextModifier(font: UIConfiguration.titleFont,
                                           color: UIConfiguration.tintColor))
                    .padding(.leading, 25)
                VStack(alignment: .center, spacing: 30) {
                    VStack(alignment: .center, spacing: 25) {
                        CustomTextField(placeHolderText: "Full Name",
                                      text: $viewModel.fullName)
                        CustomTextField(placeHolderText: "Phone Number",
                                      text: $viewModel.phoneNumber)
                        CustomTextField(placeHolderText: "E-mail Address",
                                      text: $viewModel.email)
                        CustomTextField(placeHolderText: "Password",
                                      text: $viewModel.password,
                                      isPasswordType: true)
                    }.padding(.horizontal, 25)
                    
                    VStack(alignment: .center, spacing: 40) {
                        customButton(title: "Create Account",
                                     backgroundColor: UIColor(hexString: "#913FE7"),
                                     action: self.viewModel.signUp)
                    }
                    VStack(alignment: .center, spacing: 40) {
                        customButton(title: "Back",
                                     backgroundColor: UIColor(hexString: "#913FE7"),
                                     action: {self.pushActiveWelcome = true})
                    }
                }
            }}
            Spacer()
        
            
        }.alert(item: self.$viewModel.statusViewModel) { status in
            Alert(title: Text(status.title),
                  message: Text(status.message),
                  dismissButton: .default(Text("OK"), action: { self.pushActive = true }))
        }.navigationBarBackButtonHidden(true).navigationBarHidden(true)
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
                                         height: 45))
        }
    }
}
