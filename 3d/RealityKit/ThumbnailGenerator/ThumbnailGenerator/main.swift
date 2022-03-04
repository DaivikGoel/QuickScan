import Foundation
import SceneKit
import SceneKit.ModelIO

private let device = MTLCreateSystemDefaultDevice()!

/// Create a thumbnail image of the asset with the specified URL at the specified
/// animation time. Supports loading of .scn, .usd, .usdz, .obj, and .abc files,
/// and other formats supported by ModelIO.
/// - Parameters:
///     - url: The file URL of the asset.
///     - size: The size (in points) at which to render the asset.
///     - time: The animation time to which the asset should be advanced before snapshotting.
///
let url = URL(string: "./output_models/result.usdz")!
let Size = CGSize(width: 700, height: 700)
let time = 0

func savePNG(image: NSImage, path:String) {
         
            let imageRep = NSBitmapImageRep(data: image.tiffRepresentation!)
        let pngData = imageRep?.representation(using: .png, properties: [:])
        do {
            try pngData!.write(to: URL(fileURLWithPath: path))

        } catch {
            print(error)
        }
    }


func run(for url: URL, size: CGSize, time: TimeInterval = 0) -> NSImage? {
    let renderer = SCNRenderer(device: device, options: [:])
    renderer.autoenablesDefaultLighting = true

    if (url.pathExtension == "scn") {
        let scene = try? SCNScene(url: url, options: nil)
        renderer.scene = scene
    } else {
        let asset = MDLAsset(url: url)
        asset.loadTextures()
        let scene = SCNScene(mdlAsset: asset)
        renderer.scene = scene
    }

    let image = renderer.snapshot(atTime: time, with: size, antialiasingMode: .multisampling4X)
    
    savePNG(image: image, path: "./output_models/thumbnail.png")
    
    return image
}

ThumbnailGenerator.run(for: url, size: Size)

