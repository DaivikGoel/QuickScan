import SwiftUI

struct WebsiteRedirectView: View {
    var body: some View {
        if #available(iOS 14.0, *) {
            Link("Some label", destination: URL(string: "https://www.google.com")!)
        } else {
            // Fallback on earlier versions
        }
    }
}
