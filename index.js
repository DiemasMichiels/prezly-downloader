process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to download an image from a URL
function downloadImage(url, destination) {
  return new Promise((resolve, reject) => {
    // Extract filename from URL
    const filename = path.basename(url);
    const filePath = path.join(destination, filename);

    const file = fs.createWriteStream(filePath);

    // Make a GET request to the image URL
    https
      .get(url, (response) => {
        // Pipe the response stream into the file stream
        response.pipe(file);

        // Resolve the promise when download is complete
        file.on('finish', () => {
          file.close();
          resolve(filePath);
        });
      })
      .on('error', (error) => {
        // Delete the incomplete file if download fails
        fs.unlink(filePath, () => {
          reject(error);
        });
      });
  });
}

const download = function (destinationFolder, html) {
  fs.mkdir(destinationFolder, { recursive: true }, (err) => {
    if (err) {
      //note: this does NOT get triggered if the directory already existed
      console.warn(err);
    } else {
      //directory now exists
    }
  });

  const CHEERIO = cheerio.load(html);
  // Array to store data-original values
  const dataOriginalValues = [];
  let number = 0;
  // Iterate over img tags and extract data-original values
  CHEERIO('.chromatic-gallery__photo[data-original]').each((index, element) => {
    const dataOriginalValue = CHEERIO(element).attr('data-original');
    dataOriginalValues.push(dataOriginalValue);

    downloadImage(dataOriginalValue, destinationFolder)
      .then((filePath) => {
        // console.log(`Image downloaded to: CHEERIO{filePath}`);
        number = number + 1;
        console.log(destinationFolder, number);
      })
      .catch((error) => {
        console.error(`Error downloading image: CHEERIO{error.message}`);
      });
  });
  console.log(destinationFolder, dataOriginalValues.length);
};

const galleries = [
  {
    destination: 'test3',
    html: `<div class="chromatic-gallery__content chromatic-gallery"><div class="chromatic-gallery__photo image-thumbnail-rollover" id="gallery-image-4215793b-e969-4483-ae12-96fb85739bc1" data-id="4215793b-e969-4483-ae12-96fb85739bc1" data-mfp-src="https://cdn.uc.assets.prezly.com/4215793b-e969-4483-ae12-96fb85739bc1/-/preview/1200x1200/-/format/auto/" data-original="https://cdn.uc.assets.prezly.com/4215793b-e969-4483-ae12-96fb85739bc1/-/inline/no/21-LTC23_029_MVM_230727212302.jpg" style="width: 323px; height: 215px; background-color: transparent; background-image: url(&quot;https://cdn.uc.assets.prezly.com/4215793b-e969-4483-ae12-96fb85739bc1/-/preview/1108x1108/-/format/auto/&quot;) !important;"><div class="image-thumbnail-rollover__caption"><svg class="icon icon-expand image-thumbnail-rollover__caption-icon">
                <use xlink:href="#icon-expand"></use>
            </svg></div></div><div class="chromatic-gallery__photo image-thumbnail-rollover" id="gallery-image-8c1c96bb-5291-4c0c-852c-f48a6c595007" data-id="8c1c96bb-5291-4c0c-852c-f48a6c595007" data-mfp-src="https://cdn.uc.assets.prezly.com/8c1c96bb-5291-4c0c-852c-f48a6c595007/-/preview/1200x1200/-/format/auto/" data-original="https://cdn.uc.assets.prezly.com/8c1c96bb-5291-4c0c-852c-f48a6c595007/-/inline/no/23-230727-212607-LTC23_029__HL94727_HL.jpg" style="width: 323px; height: 215px; background-color: transparent; background-image: url(&quot;https://cdn.uc.assets.prezly.com/8c1c96bb-5291-4c0c-852c-f48a6c595007/-/preview/1108x1108/-/format/auto/&quot;) !important;"><div class="image-thumbnail-rollover__caption"><svg class="icon icon-expand image-thumbnail-rollover__caption-icon">
                <use xlink:href="#icon-expand"></use>
            </svg></div></div><div class="chromatic-gallery__photo image-thumbnail-rollover" id="gallery-image-0b7d063a-578b-4907-831a-c7478cf47c75" data-id="0b7d063a-578b-4907-831a-c7478cf47c75" data-mfp-src="https://cdn.uc.assets.prezly.com/0b7d063a-578b-4907-831a-c7478cf47c75/-/preview/1200x1200/-/format/auto/" data-original="https://cdn.uc.assets.prezly.com/0b7d063a-578b-4907-831a-c7478cf47c75/-/inline/no/38-LT-388.jpg" style="width: 323px; height: 215px; background-color: transparent; background-image: url(&quot;https://cdn.uc.assets.prezly.com/0b7d063a-578b-4907-831a-c7478cf47c75/-/preview/1108x1108/-/format/auto/&quot;) !important;"><div class="image-thumbnail-rollover__caption"><svg class="icon icon-expand image-thumbnail-rollover__caption-icon">
                <use xlink:href="#icon-expand"></use>
            </svg></div></div><div class="chromatic-gallery__photo image-thumbnail-rollover" id="gallery-image-a10c824c-1311-4bc9-9397-a6afff24d16d" data-id="a10c824c-1311-4bc9-9397-a6afff24d16d" data-mfp-src="https://cdn.uc.assets.prezly.com/a10c824c-1311-4bc9-9397-a6afff24d16d/-/preview/1200x1200/-/format/auto/" data-original="https://cdn.uc.assets.prezly.com/a10c824c-1311-4bc9-9397-a6afff24d16d/-/inline/no/40-LT-331.jpg" style="width: 160px; height: 106px; background-color: transparent; background-image: url(&quot;https://cdn.uc.assets.prezly.com/a10c824c-1311-4bc9-9397-a6afff24d16d/-/preview/1108x1108/-/format/auto/&quot;) !important;"><div class="image-thumbnail-rollover__caption"><svg class="icon icon-expand image-thumbnail-rollover__caption-icon">
                <use xlink:href="#icon-expand"></use>
            </svg></div></div></div>`,
  },
];

// Process starts here
for (var i = 0; i < galleries.length; i++) {
  download(galleries[i].destination, galleries[i].html);
}
