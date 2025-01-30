import ImagePicker from "react-native-image-crop-picker";
import { RESULTS, check, request, openSettings, openLimitedPhotoLibraryPicker } from "react-native-permissions";
import { Alert, Platform } from "react-native";
import { PICKER_TYPE, IMAGE_PICKER_OPTIONS, CAMERA_PERMISSION, GALLERY_PERMISSION,GALLERY_PERMISSION_LATEST } from "../types/types";
import i18n from 'i18next';
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
    callback: any,
    pickerTypeGallery = PICKER_TYPE.GALLERY_WITH_CROPPING,
    pickerTypeCamera = PICKER_TYPE.CAMERA_WITH_CROPPING,
    galleryOptions = {},
    cameraOptions = {}
  ):any {
    this.checkPermissionCamera(() => {
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
    callback: any,
    pickerTypeGallery = PICKER_TYPE.GALLERY_WITH_CROPPING,
    pickerTypeCamera = PICKER_TYPE.CAMERA_WITH_CROPPING,
    galleryOptions = {},
    cameraOptions = {}
  ):any {
    this.checkPermissionGallery(() => {
      this.showGalleryPickerOptions(
        callback,
        pickerTypeCamera,
        cameraOptions,
        pickerTypeGallery,
        galleryOptions
      );
    });
  }
  showCameraPickerOptions(...args: any):any {
    this.pickCameraOptions(...args);
  }
  showGalleryPickerOptions(...args: any):any {
    this.pickGalleryOptions(...args);
  }
  pickCameraOptionsWithPermission(
    callback: any,
    pickerTypeGallery = PICKER_TYPE.GALLERY,
    pickerTypeCamera = PICKER_TYPE.CAMERA,
    galleryOptions = {},
    cameraOptions = {}
  ):any {
    this.checkPermissionCamera(() => {
      this.pickCameraOptions(
        callback,
        pickerTypeCamera,
        cameraOptions,
        pickerTypeGallery,
        galleryOptions
      );
    });
  }

  pickCameraOptions(...args: any):any {
    const [
      callback,
      pickerTypeCamera,
      cameraOptions,
      pickerTypeGallery,
      galleryOptions,
    ] = args;
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
    callback: any,
    pickerTypeGallery = PICKER_TYPE.GALLERY,
    pickerTypeCamera = PICKER_TYPE.CAMERA,
    galleryOptions = {},
    cameraOptions = {}
  ):any {
    this.checkPermissionGallery(() => {
      this.pickGalleryOptions(
        callback,
        pickerTypeCamera,
        cameraOptions,
        pickerTypeGallery,
        galleryOptions
      );
    });
  }

  pickGalleryOptions(...args: any):any {
    const [
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
  pickImageFromCamera(callback: any, options: any):any {
    options = { ...IMAGE_PICKER_OPTIONS, ...options };
    setTimeout(() => {
      ImagePicker.openCamera({
        compressImageMaxWidth: options.compressImageMaxWidth,
        compressImageMaxHeight: options.compressImageMaxHeight,
        compressImageQuality: options.compressImageQuality,
        mediaType: options.mediaType,
        includeExif: options.includeExif,
        includeBase64: options.includeBase64,
      })
        .then((image) => {
          const path = this.getImageUriFromData(options.includeBase64, image);
          const imageData = { ...image, path };
          callback && callback(imageData);
        })
        .catch((e) => this.handleError(e));
    }, 350);
  }

  /**
   * Pick image from camera with cropping functionality
   *
   * @param {*} callback function which handle the response
   * @param {*} options  customize attributes
   *
   */
  pickImageFromCameraWithCropping(callback: any, options: any):any {
    options = { ...IMAGE_PICKER_OPTIONS, ...options };
    setTimeout(() => {
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
          const path = this.getImageUriFromData(options.includeBase64, image);
          const imageData = { ...image, path };
          callback && callback(imageData);
        })
        .catch((e) => this.handleError(e));
    }, 350);
  }

  /**
   * Pick image from gallery
   *
   * @param {*} callback function which handle the response
   * @param {*} options  customize attributes
   *
   */
  pickImageFromGallery(callback: any, options: any):any {
    options = { ...IMAGE_PICKER_OPTIONS, ...options };
    setTimeout(() => {
      ImagePicker.openPicker({
        compressImageMaxWidth: options.compressImageMaxWidth,
        compressImageMaxHeight: options.compressImageMaxHeight,
        compressImageQuality: options.compressImageQuality,
        mediaType: options.mediaType,
        includeExif: options.includeExif,
        includeBase64: options.includeBase64,
      })
        .then((image) => {
          const path = this.getImageUriFromData(options.includeBase64, image);
          const imageData = { ...image, path };
          callback && callback(imageData);
        })
        .catch((e) => this.handleError(e));
    }, 350);
  }

  /**
   * Pick image from gallery with cropping functionality
   *
   * @param {*} callback function which handle the response
   * @param {*} options  customize attributes
   *
   */
  pickImageFromGalleryWithCropping(callback: any, options: any):any {
    options = { ...IMAGE_PICKER_OPTIONS, ...options };
    setTimeout(() => {
      ImagePicker.openPicker({
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
          const path = this.getImageUriFromData(options.includeBase64, image);
          const imageData = { ...image, path };
          callback && callback(imageData);
        })
        .catch((e) => this.handleError(e));
    }, 350);
  }

  /**
   * Pick multiple images
   *
   * @param {*} callback function which handle the response
   * @param {*} options  customize attributes
   *
   */
  pickMultiple(callback: any, options: any):any {
    options = { ...IMAGE_PICKER_OPTIONS, ...options };
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
        const imageData = images.map((img) => {
          const uri =
            img.path || this.getImageUriFromData(options.includeBase64, img);
          return { ...img, uri };
        });
        callback && callback(imageData);
      })
      .catch((e) => this.handleError(e));
  }

  /**
   * Clean temp Images
   */
  cleanupImages():any {
    ImagePicker.clean()
      .then(() => {
        console.log("cleaned all images");
      })
      .catch((e) => this.handleError(e));
  }

  /**
   *
   * Clean single temp image
   *
   * @param {*} image path to be clean
   */
  cleanupSingleImage(image: any):any {
    ImagePicker.cleanSingle(image ? image.uri : null)
      .then(() => {
        console.log("cleaned single image")
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
  getImageUriFromData(includeBase64: any, image: any):any {
    return includeBase64
      ? `data:${image.mime};base64,` + image.data
      : image.path;
  }

  handleError(error: any):any {
    if (error.code && error.code === "E_PICKER_CANCELLED") return;
    Alert.alert(i18n.t('generalErrorTitle'), i18n.t('generalError'));
  }

  openSettingModal():any {
    Alert.alert(
      i18n.t('permissionTitleText'),
      i18n.t('permissionText'),
      [
        { text: i18n.t('retryCancelPopUpBtn'), style: "cancel" },
        { text: i18n.t('settingsTextOpen'), onPress: ():any => openSettings() },
      ],
      { cancelable: false }
    );
  }

  handlePermissionsCamera(triggerFunc: any):any {
    request(CAMERA_PERMISSION)
      .then((cameraPermission) => {
        return cameraPermission;
      })
      .then((cameraPermission) => {
        if (
          cameraPermission === RESULTS.GRANTED
        ) {
          triggerFunc();
        }
        else if (
          cameraPermission === RESULTS.DENIED || cameraPermission === RESULTS.BLOCKED || cameraPermission === RESULTS.UNAVAILABLE
        ) {
          Alert.alert(i18n.t('generalErrorTitle'), i18n.t('generalError'));
        }
      });
  }

  handlePermissionsGallery(triggerFunc: any):any {
    request(Platform.Version>'32' ?GALLERY_PERMISSION_LATEST: GALLERY_PERMISSION).then(async (photoPermission) => {
      if (
        photoPermission === RESULTS.GRANTED
      ) {
        triggerFunc();
      }
      else if (
        photoPermission === RESULTS.LIMITED
      ) {
        if (Platform.OS === 'ios') {
          setTimeout(() => {
            openLimitedPhotoLibraryPicker().then(() => {
              triggerFunc();
            }).catch(() => {
              console.log("permission catch");
            });
          }, 350);
        }
      }
      else if (
        photoPermission === RESULTS.DENIED || photoPermission === RESULTS.BLOCKED || photoPermission === RESULTS.UNAVAILABLE
      ) {
        Alert.alert(i18n.t('generalErrorTitle'), i18n.t('generalError'));
      }
    });
  }
  checkPermissionCamera(triggerFunc: any, openSettings = undefined):any {
    console.log("checkPermissionGallery-",openSettings);
    Promise.all([
      check(CAMERA_PERMISSION)
    ]).then(([cameraStatus]) => {
      if (cameraStatus === RESULTS.BLOCKED) {
        this.openSettingModal();
      } else {
        this.handlePermissionsCamera(triggerFunc);
      }
    });
  }
  checkPermissionGallery(triggerFunc: any, openSettings = undefined):any {
    console.log("checkPermissionGallery-",openSettings);
    console.log("Platform-",Platform.Version);
    Promise.all([
      check(Platform.Version>'32' ? GALLERY_PERMISSION_LATEST: GALLERY_PERMISSION),
    ]).then(([photoStatus]) => {
      if (photoStatus === RESULTS.BLOCKED) {
        this.openSettingModal();
      } else {
        this.handlePermissionsGallery(triggerFunc);
      }
    });
  }
}

export default new MediaPicker();