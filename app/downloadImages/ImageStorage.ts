import RNFS from 'react-native-fs';
import { ApiImageData } from './../types/types';
const downloadImagesBatchSize= 50; // Works for 15
const downloadImagesIntervalBetweenBatches= 200; // In milliseconds. Works for 3000
const showLog=true;
const downloadImage=async (args: ApiImageData): Promise<boolean>=>{
    let rval: any = false;

    try {
        // Create dest folder if it doesn't exist
        if (!(await RNFS.exists(args.destFolder))) {
            await RNFS.mkdir(args.destFolder);
        }
        if (await RNFS.exists(args.destFolder + '/' + args.destFilename)) {
            rval = true;
        }else {
            // Download image: https://bit.ly/2S5CeEu
            const { jobId,promise: downloadPromise } = RNFS.downloadFile({
                fromUrl: args.srcUrl,
                toFile: args.destFolder + `/${args.destFilename}`,
                connectionTimeout: 150 * 1000, // milliseconds
                readTimeout: 150 * 1000, // milliseconds
            });
            const downloadResult = await downloadPromise;
            if (downloadResult.statusCode === 200) {
                if (await RNFS.exists(args.destFolder + '/' + args.destFilename)) {
                    rval = true;
                    
                }
            } else {
                if (showLog) {
                       // console.log(`IMAGE DOWNLOAD ERROR: url = ${args.srcUrl}, statusCode: ${downloadResult.statusCode}`);
                }
            }
        }
    } catch (rejectError) {
     console.log("rejected error")
      
    }

    return rval;
}
const waitMilliseconds=(milliseconds: number): Promise<string>=>{
    return new Promise((resolve) => {
        setTimeout(() => { resolve('success') }, milliseconds);
    });
}
export const deleteImageFile=(filename:any):any=>{
    return new Promise(function(resolve:any, reject:any){
    const filepath = filename;
  
    RNFS.exists(filepath)
    .then( (result) => {
  
        if(result){
          return RNFS.unlink(filepath)
            .then(() => {
              resolve('Success');
            })
            .catch((err) => {
              console.log(err)
              reject('Fail');
            });
        }
        else{
            resolve('Success');
        }
      })
      .catch((err) => {
        console.log(err)
        reject('Fail');
      });
    });
  }
const downloadImages=async (args: ApiImageData[]): Promise<{ success: boolean; args: ApiImageData }[] | null> =>{
    let allResponses: any[] = [];
    const numberOfLoops: number = Math.ceil(args.length / downloadImagesBatchSize);
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

        const loopResponses = await Promise.all<boolean>(promises);

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

       

        // Wait between batches
        await waitMilliseconds(downloadImagesIntervalBetweenBatches);
    }

    return allResponses;
}

 

export default downloadImages;