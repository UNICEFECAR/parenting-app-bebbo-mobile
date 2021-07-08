import ImagePicker from "react-native-image-crop-picker";
import { RESULTS, check, request, openSettings } from "react-native-permissions";
import { Alert, Linking } from "react-native";
import { PICKER_TYPE, IMAGE_PICKER_OPTIONS, CAMERA_PERMISSION, GALLERY_PERMISSION } from "../types/types";

class MediaPicker {
  /**
   *
   * Show Picker
   *
   * @param {*} callback callback handle response
   * @param {*} pickerTypeCamera
   * @param {*} cameraOptions
   * @param {*} pickerTypeGallery
   * @param {*} galleryOptions
   */
  
  showCameraImagePicker(
    callback:any,
    pickerTypeGallery = PICKER_TYPE.GALLERY_WITH_CROPPING,
    pickerTypeCamera = PICKER_TYPE.CAMERA_WITH_CROPPING,
    galleryOptions = {},
    cameraOptions = {}
  ) {
    this.checkPermission(() => {
      this.showCameraPickerOptions(
        callback,
        pickerTypeCamera,
        cameraOptions,
        pickerTypeGallery,
        galleryOptions
      );
    });
  }
  showGalleryImagePicker(
    callback:any,
    pickerTypeGallery = PICKER_TYPE.GALLERY_WITH_CROPPING,
    pickerTypeCamera = PICKER_TYPE.CAMERA_WITH_CROPPING,
    galleryOptions = {},
    cameraOptions = {}
  ) {
    this.checkPermission(() => {
      this.showGalleryPickerOptions(
        callback,
        pickerTypeCamera,
        cameraOptions,
        pickerTypeGallery,
        galleryOptions
      );
    });
  }
  showCameraPickerOptions(...args:any) {
    this.pickCameraOptions(...args);
  }
  showGalleryPickerOptions(...args:any) {
    this.pickGalleryOptions(...args);
  }
  pickCameraOptionsWithPermission(
    callback:any,
    pickerTypeGallery = PICKER_TYPE.GALLERY,
    pickerTypeCamera = PICKER_TYPE.CAMERA,
    galleryOptions = {},
    cameraOptions = {}
  ) {
    this.checkPermission(() => {
      this.pickCameraOptions(
        callback,
        pickerTypeCamera,
        cameraOptions,
        pickerTypeGallery,
        galleryOptions
      );
    });
  }

  pickCameraOptions(...args:any) {
    let [
      callback,
      pickerTypeCamera,
      cameraOptions,
      pickerTypeGallery,
      galleryOptions,
    ] = args;
    //this.pickImageFromCameraWithCropping(callback, cameraOptions);

    switch (pickerTypeCamera) {
      case PICKER_TYPE.CAMERA:
      case PICKER_TYPE.CAMERA_BINARY_DATA:
        this.pickImageFromCamera(callback, cameraOptions);
        break;
      case PICKER_TYPE.CAMERA_WITH_CROPPING:
      case PICKER_TYPE.CAMERA_WITH_CROPPING_BINARY_DATA:
        this.pickImageFromCameraWithCropping(callback, cameraOptions);
        break;
    }
  }

  pickGalleryOptionsWithPermission(
    callback:any,
    pickerTypeGallery = PICKER_TYPE.GALLERY,
    pickerTypeCamera = PICKER_TYPE.CAMERA,
    galleryOptions = {},
    cameraOptions = {}
  ) {
    this.checkPermission(() => {
      this.pickGalleryOptions(
        callback,
        pickerTypeCamera,
        cameraOptions,
        pickerTypeGallery,
        galleryOptions
      );
    });
  }

  pickGalleryOptions(...args:any) {
    let [
      callback,
      pickerTypeCamera,
      cameraOptions,
      pickerTypeGallery,
      galleryOptions,
    ] = args;

    switch (pickerTypeGallery) {
      case PICKER_TYPE.GALLERY:
      case PICKER_TYPE.GALLERY_BINARY_DATA:
        this.pickImageFromGallery(callback, galleryOptions);
        break;
      case PICKER_TYPE.GALLERY_WITH_CROPPING:
      case PICKER_TYPE.GALLERY_WITH_CROPPING_BINARY_DATA:
        this.pickImageFromGalleryWithCropping(callback, galleryOptions);
        break;
      case PICKER_TYPE.MULTI_PICK:
      case PICKER_TYPE.MULTI_PICK_BINARY_DATA:
        this.pickMultiple(callback, galleryOptions);
        break;
    }
  }

  /**
   * Pick image from camera
   *
   * @param {*} callback function which handle the response
   * @param {*} options  customize attributes
   *
   */
  pickImageFromCamera(callback:any, options:any) {
    options = { ...IMAGE_PICKER_OPTIONS, ...options };

    // clean all images
    //this.cleanupImages();

    ImagePicker.openCamera({
      compressImageMaxWidth: options.compressImageMaxWidth,
      compressImageMaxHeight: options.compressImageMaxHeight,
      compressImageQuality: options.compressImageQuality,
      mediaType: options.mediaType,
      includeExif: options.includeExif,
      includeBase64: options.includeBase64,
    })
      .then((image) => {
        let path = this.getImageUriFromData(options.includeBase64, image);
        const imageData = { ...image, path };
        //console.log("image Data", imageData);
        callback && callback(imageData);
      })
      .catch((e) => this.handleError(e));
  }

  /**
   * Pick image from camera with cropping functionality
   *
   * @param {*} callback function which handle the response
   * @param {*} options  customize attributes
   *
   */
  pickImageFromCameraWithCropping(callback:any, options:any) {
    options = { ...IMAGE_PICKER_OPTIONS, ...options };

    // clean all images
    //this.cleanupImages();

    ImagePicker.openCamera({
      width: options.width,
      height: options.height,
      cropping: true,
      cropperCircleOverlay: options.cropperCircleOverlay,
      enableRotationGesture: options.enableRotationGesture,
      mediaType: options.mediaType,
      includeExif: options.includeExif,
      includeBase64: options.includeBase64,
    })
      .then((image) => {
        let path = this.getImageUriFromData(options.includeBase64, image);
        const imageData = { ...image, path };
        //console.log("image Data", imageData);
        callback && callback(imageData);
      })
      .catch((e) => this.handleError(e));
  }

  /**
   * Pick image from gallery
   *
   * @param {*} callback function which handle the response
   * @param {*} options  customize attributes
   *
   */
  pickImageFromGallery(callback:any, options:any) {
    options = { ...IMAGE_PICKER_OPTIONS, ...options };

    // clean all images
    //this.cleanupImages();

    ImagePicker.openPicker({
      compressImageMaxWidth: options.compressImageMaxWidth,
      compressImageMaxHeight: options.compressImageMaxHeight,
      compressImageQuality: options.compressImageQuality,
      mediaType: options.mediaType,
      includeExif: options.includeExif,
      includeBase64: options.includeBase64,
    })
      .then((image) => {
        let path = this.getImageUriFromData(options.includeBase64, image);
        const imageData = { ...image, path };
        //console.log("image Data", imageData);
        callback && callback(imageData);
      })
      .catch((e) => this.handleError(e));
  }

  /**
   * Pick image from gallery with cropping functionality
   *
   * @param {*} callback function which handle the response
   * @param {*} options  customize attributes
   *
   */
  pickImageFromGalleryWithCropping(callback:any, options:any) {
    options = { ...IMAGE_PICKER_OPTIONS, ...options };

    // clean all images
    //this.cleanupImages();

    ImagePicker.openPicker({
      // width: options.width,
      // height: options.height,
      width: options.width,
      height: options.height,
      cropping: true,
      cropperCircleOverlay: options.cropperCircleOverlay,
      enableRotationGesture: options.enableRotationGesture,
      mediaType: options.mediaType,
      includeExif: options.includeExif,
      includeBase64: options.includeBase64,
    })
      .then((image) => {
        let path = this.getImageUriFromData(options.includeBase64, image);
        const imageData = { ...image, path };
        //console.log("image Data", imageData);
        callback && callback(imageData);
      })
      .catch((e) => this.handleError(e));
  }

  /**
   * Pick multiple images
   *
   * @param {*} callback function which handle the response
   * @param {*} options  customize attributes
   *
   */
  pickMultiple(callback:any, options:any) {
    options = { ...IMAGE_PICKER_OPTIONS, ...options };

    // clean all images
    //this.cleanupImages();

    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: options.waitAnimationEnd,
      forceJpg: options.forceJpg,
      compressImageMaxWidth: options.compressImageMaxWidth,
      compressImageMaxHeight: options.compressImageMaxHeight,
      compressImageQuality: options.compressImageQuality,
      mediaType: options.mediaType,
      includeExif: options.includeExif,
      includeBase64: options.includeBase64,
      maxFiles: options.maxFiles || 10,
    })
      .then((images) => {
        let imageData = images.map((img) => {
          //console.log("img.path", img.path);
          let uri =
            img.path || this.getImageUriFromData(options.includeBase64, img);
          return { ...img, uri };
        });
        //console.log("image Data", JSON.stringify(imageData));
        callback && callback(imageData);
      })
      .catch((e) => this.handleError(e));
  }

  /**
   * Clean temp Images
   */
  cleanupImages() {
    ImagePicker.clean()
      .then(() => {
        //console.log("removed tmp images from tmp directory");
      })
      .catch((e) => this.handleError(e));
  }

  /**
   *
   * Clean single temp image
   *
   * @param {*} image path to be clean
   */
  cleanupSingleImage(image:any) {
   // console.log("will cleanup image", image);

    ImagePicker.cleanSingle(image ? image.uri : null)
      .then(() => {
        //console.log(`removed tmp image ${image.uri} from tmp directory`);
      })
      .catch((e) => this.handleError(e));
  }

  /**
   *
   * Get image path from response data
   *
   * @param {*} includeBase64
   * @param {*} image
   */
  getImageUriFromData(includeBase64:any, image:any) {
    //console.log("includeBase64", includeBase64);
    return includeBase64
      ? `data:${image.mime};base64,` + image.data
      : image.path;
  }

  handleError(error:any) {
    if (error.code && error.code === "E_PICKER_CANCELLED") return;

    let errorMsg = error.message ? error.message : error;

    Alert.alert("Error", errorMsg);
  }

  openSettingModal() {
    Alert.alert(
      "Permission required",
      "Need permissions to access gallery and camera",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => openSettings() },
      ],
      { cancelable: false }
    );
  }

  handlePermissions(triggerFunc:any) {
    request(CAMERA_PERMISSION)
      .then((cameraPermission) => {
        return cameraPermission;
      })
      .then((cameraPermission) => {
        request(GALLERY_PERMISSION).then((photoPermission) => {
          if (
            cameraPermission === RESULTS.GRANTED &&
            photoPermission === RESULTS.GRANTED
          ) {
            triggerFunc();
          }
        });
      });
  }

  checkPermission(triggerFunc:any, openSettings = undefined) {
    // let permissionAsk = Platform.OS === 'ios' ? 'denied' : 'restricted';

    Promise.all([
      check(CAMERA_PERMISSION),
      check(GALLERY_PERMISSION),
      // …
    ]).then(([cameraStatus, photoStatus]) => {
      // Alert.alert(cameraStatus,"..cameraStatus..")
      // Alert.alert(photoStatus,"..photoStatus..")
      if (cameraStatus === RESULTS.DENIED || cameraStatus === RESULTS.BLOCKED || photoStatus === RESULTS.BLOCKED || photoStatus === RESULTS.DENIED) {
        this.openSettingModal();
      } else {
        this.handlePermissions(triggerFunc);
      }
    });
  }
}

export default new MediaPicker();