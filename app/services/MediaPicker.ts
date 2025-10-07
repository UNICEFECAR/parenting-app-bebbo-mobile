import ImagePicker from "react-native-image-crop-picker";
import { RESULTS, check, request, openSettings, PERMISSIONS } from "react-native-permissions";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { PICKER_TYPE, IMAGE_PICKER_OPTIONS, CAMERA_PERMISSION } from "../types/types";
import i18n from 'i18next';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

// Android permissions
const GALLERY_PERMISSION_ANDROID_PRE33 = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
const GALLERY_PERMISSION_ANDROID_33_PLUS = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

// iOS permission
const GALLERY_PERMISSION_IOS = PERMISSIONS.IOS.PHOTO_LIBRARY;

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
      console.log("in checkPermissionGallery success")
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

  handlePermissionsGallery = async (triggerFunc: any): Promise<void> => {
    try {
      if (Platform.OS === "android") {
        const sdk = Platform.Version;
  
        if (sdk >= 33) {
          triggerFunc();
        } else if (sdk >= 24) {
          // Android 7.0 → 12 → READ_EXTERNAL_STORAGE
          const status = await PermissionsAndroid.check(GALLERY_PERMISSION_ANDROID_PRE33);
          if (status) {
            triggerFunc();
          } else {
            const result = await PermissionsAndroid.request(GALLERY_PERMISSION_ANDROID_PRE33);
            if (result === PermissionsAndroid.RESULTS.GRANTED) triggerFunc();
            else Alert.alert(i18n.t("generalErrorTitle"), i18n.t("generalError"));
          }
        } else {
          // fallback for very old Android versions
          triggerFunc();
        }
      } else if (Platform.OS === "ios") {
        const photoPermission = await request(GALLERY_PERMISSION_IOS);
  
        if (photoPermission === RESULTS.GRANTED) {
          triggerFunc();
        } else if (photoPermission === RESULTS.LIMITED) {
          try {
            // Show limited photo picker
            // @ts-ignore
            await CameraRoll.presentLimitedLibraryPicker();
            triggerFunc();
          } catch (e) {
            console.log("Limited picker not available", e);
            triggerFunc();
          }
        } else {
          Alert.alert(i18n.t("generalErrorTitle"), i18n.t("generalError"));
        }
      }
    } catch (e) {
      console.log("Gallery permission error", e);
      Alert.alert(i18n.t("generalErrorTitle"), i18n.t("generalError"));
    }
  };
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

  checkPermissionGallery(triggerFunc: any, openSettings = undefined): any {
    if (Platform.OS === "android") {
      const sdk = Platform.Version;
  
      if (sdk >= 33) {
        // Android 13+ → READ_MEDIA_IMAGES
        check(GALLERY_PERMISSION_ANDROID_33_PLUS).then((status) => {
          if (status === RESULTS.GRANTED) triggerFunc();
          else if (status === RESULTS.BLOCKED) this.openSettingModal();
          else this.handlePermissionsGallery(triggerFunc);
        });
      } else if (sdk >= 24) {
        // Android 7.0 → 12 → READ_EXTERNAL_STORAGE
        check(GALLERY_PERMISSION_ANDROID_PRE33).then((status) => {
          if (status === RESULTS.GRANTED) triggerFunc();
          else if (status === RESULTS.BLOCKED) this.openSettingModal();
          else this.handlePermissionsGallery(triggerFunc);
        });
      } else {
        // fallback for very old Android versions
        triggerFunc();
      }
      return;
    }
  
    // iOS
    check(GALLERY_PERMISSION_IOS).then((status) => {
      if (status === RESULTS.BLOCKED) this.openSettingModal();
      else this.handlePermissionsGallery(triggerFunc);
    });
  }
}

export default new MediaPicker();