import Foundation

class StatusViewModel: Identifiable, ObservableObject {
    
    var title: String
    var message: String
    
    init(title: String = "", message: String = "") {
        self.title = title
        self.message = message
    }
    
    static var signUpSuccessStatus: StatusViewModel {
        return StatusViewModel(title: "Successful", message: "Your account has been created successfully")
    }
    
    static var uploadSuccessStatus: StatusViewModel {
        return StatusViewModel(title: "Successful", message: "Your account has been created successfully")
    }
    
    static var logInSuccessStatus: StatusViewModel {
        return StatusViewModel(title: "Successful", message: "Your account has been logged in successfully")
    }
    
    static var errorStatus: StatusViewModel {
        return StatusViewModel(title: "Error", message: "Oops! Something went wrong. Please try again.")
    }
}
