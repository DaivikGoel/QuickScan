import SwiftUI

class AppState: ObservableObject {
    @Published var user: User?
    var currentUser: User?
}
