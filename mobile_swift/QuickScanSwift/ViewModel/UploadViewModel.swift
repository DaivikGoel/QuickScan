import Foundation
import Combine

class UploadViewModel: ObservableObject {
    @Published var statusViewModel: StatusViewModel?
    @Published var state: AppState
    
    private var cancellableBag = Set<AnyCancellable>()
    private let authAPI: AuthAPI
    
    init(authAPI: AuthAPI, state: AppState) {
        self.authAPI = authAPI
        self.state = state
    }
    
    func upload() {
        print("uplaoded some random shit")
    }
}

// MARK: - Private helper function
extension SignUpViewModel {
    private func resultMapper(with user: User?) -> StatusViewModel {
        if user != nil {
            state.currentUser = user
            return StatusViewModel.signUpSuccessStatus
        } else {
            return StatusViewModel.errorStatus
        }
    }
}
