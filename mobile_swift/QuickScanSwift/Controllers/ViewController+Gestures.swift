/*
See LICENSE folder for this sample’s licensing information.

Abstract:
Gesture interaction methods for the main view controller.
*/

import UIKit
import SceneKit

extension ViewController: UIGestureRecognizerDelegate {
        
    @objc func didTap(_ gesture: UITapGestureRecognizer) {
        if state == .scanning {
            scan?.didTap(gesture)
        }
        
//        instructionsVisible = false
    }
    
    @objc func didFingerPan(_ gesture: ThresholdPanGestureRecognizer) {
        if state == .scanning {
            scan?.didFingerPan(gesture)
        }
        
//        instructionsVisible = false
    }
    
    @objc func didRotate(_ gesture: ThresholdRotationGestureRecognizer) {
        if state == .scanning {
            scan?.didRotate(gesture)
        }
        
//        instructionsVisible = false
    }
    
    @objc func didLongPress(_ gesture: UILongPressGestureRecognizer) {
        if state == .scanning {
            scan?.didLongPress(gesture)
        }
        
//        instructionsVisible = false
    }
    
    @objc func didPinch(_ gesture: ThresholdPinchGestureRecognizer) {
        if state == .scanning {
            scan?.didPinch(gesture)
        }
        
//        instructionsVisible = false
    }
    
    func gestureRecognizer(_ first: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith second: UIGestureRecognizer) -> Bool {
        if first is UIRotationGestureRecognizer && second is UIPinchGestureRecognizer {
            return true
        } else if first is UIRotationGestureRecognizer && second is UIPanGestureRecognizer {
            return true
        } else if first is UIPinchGestureRecognizer && second is UIRotationGestureRecognizer {
            return true
        } else if first is UIPinchGestureRecognizer && second is UIPanGestureRecognizer {
            return true
        } else if first is UIPanGestureRecognizer && second is UIPinchGestureRecognizer {
            return true
        } else if first is UIPanGestureRecognizer && second is UIRotationGestureRecognizer {
            return true
        }
        return false
    }
    
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
            print("HELP")
            let isControllTapped = touch.view is UIControl
            return !isControllTapped
        }
}
