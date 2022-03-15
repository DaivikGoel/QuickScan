import SwiftUI
import Combine
import FBSDKCoreKit
import FBSDKLoginKit
import FirebaseAuth

struct UploadView: View {
    @State var pushActive = false
    @ObservedObject private var viewModel: UploadViewModel
    @State private var showingPopover = false
    @State var pushActiveBack = false
    //    @State var pushActiveWebButton = false
    
    init(state: AppState, url: String) {
        self.viewModel = UploadViewModel(authAPI: AuthService(), state: state, url: url)
    }
    
    func thing() {
        self.showingPopover = true
    }
    var body: some View {
        VStack {
            
            NavigationLink(destination: ARUIView(state: viewModel.state),
                           isActive: self.$pushActiveBack) {
                EmptyView()
            }.hidden()
            
            NavigationLink(destination: WebsiteRedirectView(),
                           isActive: $viewModel.pushWebView) {
                EmptyView()
            }.hidden()
            
            VStack(alignment: .center, spacing: 10) {
                Spacer()
                Text("Upload Video")
                    .modifier(TextModifier(font: UIConfiguration.titleFont,
                                           color: UIConfiguration.tintColor))
                    .padding(.horizontal, 60)
                Spacer()
                Spacer()
                VStack(alignment: .center) {
                    CustomTextField(placeHolderText: "Title",
                                    text: $viewModel.title)
                    CustomTextField(placeHolderText: "Description",
                                    text: $viewModel.description)
                }.padding(.horizontal, 25)
                Spacer()
                Spacer()
                Button(action: {
                    self.pushActiveBack = true
                }) {
                    Text("Take a new video")
                        .modifier(TextModifier(font: UIConfiguration.buttonFont,
                                               color: .black))
                        .frame(width: 275, height: 55)
                        .overlay(RoundedRectangle(cornerRadius: 25)
                                    .stroke(Color.gray, lineWidth: 1)
                        )
                }
                customButton(title: "Upload Video",
                             backgroundColor: UIColor(hexString: "#913FE7"),
                             action: {
                    self.viewModel.upload()
                    self.pushActive = true
                    self.showingPopover = true
                })
                    .padding(.horizontal, 60)
                /*
                 Button(action: {
                 self.viewModel.pushWebView = true
                 }) {
                 Text("View Uploads and 3d Objects")
                 .modifier(TextModifier(font: UIConfiguration.buttonFont,
                 color: .black))
                 .frame(width: 275, height: 55)
                 .overlay(RoundedRectangle(cornerRadius: 25)
                 .stroke(Color.gray, lineWidth: 1)
                 )
                 }
                 */
                if #available(iOS 14.0, *) {
                    Link("View Uploads", destination: URL(string: viewModel.redirectUrl)!)                        .modifier(TextModifier(font: UIConfiguration.buttonFont,
                                                                                                                                                        color: .black))
                        .frame(width: 275, height: 55)
                        .overlay(RoundedRectangle(cornerRadius: 25)
                                    .stroke(Color.gray, lineWidth: 1))
                    Spacer()
                } else {
                    Spacer()
                    // Fallback on earlier versions
                }
            }
        }.alert(item: self.$viewModel.statusViewModel) { status in
            Alert(title: Text(status.title),
                  message: Text(status.message),
                  dismissButton: .default(Text("OK"), action: {
                if status.title == "Successful" {
                    self.pushActive = true
                }
            }))
        }.navigationBarBackButtonHidden(true).navigationBarHidden(true)
    }
    
    private func customButton2(title: String,
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
        }.popover(isPresented: $showingPopover) {
            Text("Progress")
                .font(.headline)
                .padding()
            if #available(iOS 14.0, *) {
                ProgressView(viewModel.uploadText, value: viewModel.downloadAmount, total: 100).scaleEffect(x: 0.8, y: 1, anchor: .center)
            } else {
                // Fallback on earlier versions
            }
            if (viewModel.downloadAmount == 100) {
                Button(action: {
                    self.showingPopover = false
                    viewModel.downloadAmount = 0
                    viewModel.uploadText = "Uploading..."
                    // leave this commented out so it doesnt go to dead page
                    //viewModel.pushWebView = true
                }) {
                    Text("Ok")
                        .modifier(ButtonModifier(font: UIConfiguration.buttonFont,
                                                 color: UIConfiguration.tintColor,
                                                 textColor: .white,
                                                 width: 275,
                                                 height: 55))
                }
            }
        }
    }
}
