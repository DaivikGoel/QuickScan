import Foundation
import Combine
import AWSS3

class UploadViewModel: ObservableObject {
    @Published var statusViewModel: StatusViewModel?
    @Published var state: AppState
    
    private var cancellableBag = Set<AnyCancellable>()
    private let authAPI: AuthAPI
    private let url: String
    
    init(authAPI: AuthAPI, state: AppState, url: String) {
        self.authAPI = authAPI
        self.state = state
        self.url = url
    }
    
    func upload() {
        print("trying to upload")
        uploadFileOld(with: "Tragoedia", type: "png")
        //uploadVideo(with: "IMG_0646", type: "MOV")
    }
    
    let bucketName = "quickscanvideo"
    var completionHandler: AWSS3TransferUtilityUploadCompletionHandlerBlock?
    
    func uploadFileOld(with resource: String, type: String) {   //1
        let key = "\(resource).\(type)"
        let localImagePath = Bundle.main.path(forResource: resource, ofType: type)!  //2
        let localImageUrl = URL(fileURLWithPath: localImagePath)
        
        let request = AWSS3TransferManagerUploadRequest()!
        request.bucket = bucketName  //3
        request.key = key  //4
        request.body = localImageUrl
        request.acl = .publicReadWrite  //5
        
        //6
        let transferManager = AWSS3TransferManager.default()
        transferManager.upload(request).continueWith(executor: AWSExecutor.mainThread()) { (task) -> Any? in
            if let error = task.error {
                print(error)
            }
            if task.result != nil {   //7
                print("Uploaded \(key)")
                //do any task
            }
            
            return nil
        }
        
    }

    func uploadVideo(with resource: String,type: String){   //1
            
            let key = "\(resource).\(type)"
            let resource = Bundle.main.path(forResource: resource, ofType: type)!
            let Url = URL(fileURLWithPath: resource)
            
            let expression  = AWSS3TransferUtilityUploadExpression()
            expression.progressBlock = { (task: AWSS3TransferUtilityTask,progress: Progress) -> Void in
              print(progress.fractionCompleted)   //2
                if progress.isCancelled || progress.isPaused{
                    print("cancelled for some reason")
                }
              if progress.isFinished{           //3
                print("Upload Finished...")
                //do any task here.
              }
            }
            
            expression.setValue("public-read-write", forRequestHeader: "x-amz-acl")   //4
            expression.setValue("public-read-write", forRequestParameter: "x-amz-acl")

            completionHandler = { (task:AWSS3TransferUtilityUploadTask, error:NSError?) -> Void in
                if(error != nil){
                    print("Failure uploading file")
                    
                }else{
                    print("Success uploading file")
                }
            } as? AWSS3TransferUtilityUploadCompletionHandlerBlock
            
            
            //5
            AWSS3TransferUtility.default().uploadFile(Url, bucket: bucketName, key: String(key), contentType: resource, expression: expression, completionHandler: self.completionHandler).continueWith(block: { (task:AWSTask) -> AnyObject? in
                if(task.error != nil){
                    print(task.error)
                    print("Error uploading file: \(String(describing: task.error?.localizedDescription))")
                }
                if(task.result != nil){
                    print("Starting upload...")
                }
                return nil
            })
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
