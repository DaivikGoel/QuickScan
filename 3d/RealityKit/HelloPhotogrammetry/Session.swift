import Foundation
import RealityKit
import Combine

final class Session {
    
    let inputFolder = URL(fileURLWithPath: "/Users/boscoh/Desktop/photos/Rock36Images", isDirectory: true)
    let outputFile = URL(fileURLWithPath: "/Users/boscoh/Desktop/photos/result.usdz")
    var subscriber: AnyCancellable?

    func run() throws {

        let configuration = PhotogrammetrySession.Configuration()
        let session = try PhotogrammetrySession(
            input: inputFolder,
            configuration: configuration
        )

        let request = PhotogrammetrySession.Request.modelFile(url: outputFile)

        let semaphore = DispatchSemaphore(value: 0)

        subscriber = session.output.sink(receiveCompletion: { completion in
            print(completion)
            exit(0)
        }, receiveValue: { output in
            switch output {
            case .processingComplete:
                print("Processing is complete.")
                semaphore.signal()
            case .requestComplete(let request, let result):
                print("Request complete.")
                print(request)
                print(result)
                semaphore.signal()
            case .requestProgress(let request, let fractionComplete):
                print("Request in progress: \(fractionComplete)")
            default:
                print(output)
            }
        })

        try session.process(requests: [request])

        semaphore.wait()

    }


    Session().Run()
}
