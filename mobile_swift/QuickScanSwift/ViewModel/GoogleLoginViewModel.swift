import SwiftUI
import GoogleSignIn
import FirebaseAuth

class UserAuthModel: ObservableObject {
    
    @Published var givenName: String = ""
    @Published var profilePicUrl: String = ""
    @Published var isLoggedIn: Bool = false
    @Published var errorMessage: String = ""
    @Published var userID: String = ""
    @Published var isLoggedInFirebase: Bool = false
    
    init(){
        check()
    }
    
    func checkStatus(){
        if(GIDSignIn.sharedInstance.currentUser != nil){
            let user = GIDSignIn.sharedInstance.currentUser
            guard let user = user else { return }
            let givenName = user.profile?.givenName
            let profilePicUrl = user.profile!.imageURL(withDimension: 100)!.absoluteString
            self.givenName = givenName ?? ""
            self.profilePicUrl = profilePicUrl
            self.isLoggedIn = true
            self.userID = user.userID ?? ""
        }else{
            self.isLoggedIn = false
            self.givenName = "Not Logged In"
            self.profilePicUrl =  ""
        }
    }
    
    func fireBaseConnect() {
        guard
            let authentication = GIDSignIn.sharedInstance.currentUser?.authentication,
            let idToken = authentication.idToken
          else {
            return
          }
        
        let credential = GoogleAuthProvider.credential(withIDToken: idToken,
                                                        accessToken: authentication.accessToken)
        
        Auth.auth().signIn(with: credential) { authResult, error in
            if let error = error {
                print(error)
            }
            // User is signed in
            // ...
        }
        print("CURRENT USER PLEASE BE SOMETHING")
        print(Auth.auth().currentUser)
        self.isLoggedInFirebase = true
    }
 
    func check(){
        GIDSignIn.sharedInstance.restorePreviousSignIn { user, error in
            if let error = error {
                self.errorMessage = "error: \(error.localizedDescription)"
            }
            
            self.checkStatus()
        }
    }
    
    func signIn(){
        
       guard let presentingViewController = (UIApplication.shared.connectedScenes.first as? UIWindowScene)?.windows.first?.rootViewController else {return}

        let signInConfig = GIDConfiguration.init(clientID: "361465475773-1lhmvgmi6ot1e02ggmo73h4d17b0rvl9.apps.googleusercontent.com")
        GIDSignIn.sharedInstance.signIn(
            with: signInConfig,
            presenting: presentingViewController,
            callback: { user, error in
                if let error = error {
                    self.errorMessage = "error: \(error.localizedDescription)"
                }
                print("PLEASE LOVE OF GOD")
                print(user?.userID)
                self.fireBaseConnect()
                self.checkStatus()
            }
        )
        
    }
    
    func signOut(){
        GIDSignIn.sharedInstance.signOut()
        self.checkStatus()
    }
}
