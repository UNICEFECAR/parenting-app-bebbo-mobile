import RNFS from 'react-native-fs';
import { ApiImageData } from './../types/types';
// import {downloadImagesBatchSize, downloadImagesIntervalBetweenBatches,showLog} from "react-native-dotenv";
const downloadImagesBatchSize= 50; // Works for 15
const downloadImagesIntervalBetweenBatches= 200; // In milliseconds. Works for 3000
const showLog=true;
 //   console.log(netInfo,"..netInfo..");
const downloadImage=async (args: ApiImageData): Promise<boolean>=>{
    let rval: boolean = false;

    try {
        // Create dest folder if it doesn't exist
        if (!(await RNFS.exists(args.destFolder))) {
            await RNFS.mkdir(args.destFolder);
        }
        console.log(RNFS.exists(args.destFolder + '/' + args.destFilename));
        if (await RNFS.exists(args.destFolder + '/' + args.destFilename)) {
            console.log("Image already exists");
        }else {
            // Download image: https://bit.ly/2S5CeEu
            let { jobId, promise: downloadPromise } = RNFS.downloadFile({
                fromUrl: args.srcUrl,
                toFile: args.destFolder + `/${args.destFilename}`,
                connectionTimeout: 150 * 1000, // milliseconds
                readTimeout: 150 * 1000, // milliseconds
            });

            let downloadResult = await downloadPromise;
            console.log(downloadResult,"..downloadResult..")
            if (downloadResult.statusCode === 200) {
                if (RNFS.exists(args.destFolder + '/' + args.destFilename)) {
                    rval = true;

                    if (showLog) {
                        console.log('IMAGE DOWNLOADED: ', args.destFilename);
                    }
                }
            } else {
            //  dataRealmStore.setVariable('lastDataSyncError', 'downloadImage failed, ' + downloadResult.statusCode);

                if (showLog) {
                        console.log(`IMAGE DOWNLOAD ERROR: url = ${args.srcUrl}, statusCode: ${downloadResult.statusCode}`);
                }
            }
        }
    } catch (rejectError) {
       // const netError = new UnknownError(rejectError);
       // dataRealmStore.setVariable('lastDataSyncError', 'downloadImage failed, ' + netError.message);

       if (showLog) {
            console.log('IMAGE DOWNLOAD ERROR', rejectError, args.srcUrl);
       }
    }

    return rval;
}

const downloadImages=async (args: ApiImageData[]): Promise<{ success: boolean, args: ApiImageData }[] | null> =>{
    console.log(args,"..args..");
    let allResponses: any[] = [];
    const numberOfLoops: number = Math.ceil(args.length / downloadImagesBatchSize);
    console.log(downloadImagesBatchSize,"--numberOfLoops--",numberOfLoops);
    for (let loop = 0; loop < numberOfLoops; loop++) {
        // Get currentLoopImages
        const indexStart = loop * downloadImagesBatchSize;
        const indexEnd = loop * downloadImagesBatchSize + downloadImagesBatchSize;
        const currentLoopImages = args.slice(indexStart, indexEnd);

        // Download current loop images
        const promises: Promise<boolean>[] = [];
        currentLoopImages.forEach((downloadImageArgs) => {
            promises.push(downloadImage(downloadImageArgs));
        });
        console.log(currentLoopImages,"..currentLoopImages..");

        let loopResponses = await Promise.all<boolean>(promises);

        // Set numberOfSuccess
        const numberOfSuccess = loopResponses.reduce((acc: number, currentValue: boolean) => {
            if (currentValue) return acc + 1; else return acc;
        }, 0);

        // Add responses to allResponses
        allResponses = allResponses.concat(
            loopResponses.map((value, index) => {
                return {
                    success: value,
                    args: currentLoopImages[index],
                };
            })
        );

        // Log
       if (showLog) {
            console.log(`apiStore.downloadImages() batch ${loop + 1}: Downloaded ${numberOfSuccess} from ${currentLoopImages.length} images`,);
       }

        // Wait between batches
        await waitMilliseconds(downloadImagesIntervalBetweenBatches);
    }

    return allResponses;
}
const waitMilliseconds=(milliseconds: number): Promise<string>=>{
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve('success') }, milliseconds);
    });
}
 

export default downloadImages;