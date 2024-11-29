import puppeteer, {
  Browser,
  BrowserWorker,
  launch,
} from "@cloudflare/puppeteer";
import { ExtractImageData } from "~/types";

// Common image file extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.ico', '.svg'];

// Check if URL is potentially an image based on extension
function isImageUrl(url: string): boolean {
  const urlLower = url.toLowerCase();
  return IMAGE_EXTENSIONS.some(ext => urlLower.endsWith(ext));
}

// Get mime type from URL extension
function getMimeTypeFromUrl(url: string): string | null {
  const urlLower = url.toLowerCase();
  if (urlLower.endsWith('.jpg') || urlLower.endsWith('.jpeg')) return 'image/jpeg';
  if (urlLower.endsWith('.png')) return 'image/png';
  if (urlLower.endsWith('.gif')) return 'image/gif';
  if (urlLower.endsWith('.webp')) return 'image/webp';
  if (urlLower.endsWith('.bmp')) return 'image/bmp';
  if (urlLower.endsWith('.ico')) return 'image/x-icon';
  if (urlLower.endsWith('.svg')) return 'image/svg+xml';
  return null;
}

export async function extractImagesFromURL(
  browser: Browser,
  url: string,
): Promise<ExtractImageData[]> {
  try {
    let images: ExtractImageData[] = [];
    const page = await browser.newPage();
    page.on("response", async (response) => {
      const responseUrl = response.url();
      const contentType = response.headers()["content-type"];
      const isImage = contentType?.startsWith("image") || isImageUrl(responseUrl);
      
      if (isImage) {
        const src = responseUrl;
        let size = Number(response.headers()["content-length"]);
        if (src.startsWith("data:")) {
          size = src.length;
        }
        let width = 0;
        let height = 0;
        images.push({
          src,
          size,
          mimeType: contentType || getMimeTypeFromUrl(responseUrl) || 'image/unknown',
          width,
          height,
          decoded: false,
        });
      }
    });
    await page.goto(url);
    await page.screenshot();
    images = await page.evaluate((images) => {
      return Promise.all(
        images.map(async (image) => {
          try {
            const img = new Image();
            img.src = image.src;
            await img.decode();
            image.width = img.width;
            image.height = img.height;
            image.decoded = true;
            return image;
          } catch (e) {
            return image;
          }
        }),
      );
    }, images);
    await page.close();
    // make images unique
    images = images.filter(
      (image, index, self) =>
        index ===
        self.findIndex(
          (t) => t.src === image.src && t.mimeType === image.mimeType,
        ),
    );
    return images;
  } catch (e) {
    throw e;
  }
}

export async function getBrowser(
  BROWSER: BrowserWorker,
  wsEndpoint?: string,
): Promise<Browser | undefined> {
  let browser: Browser | undefined = undefined;
  if (BROWSER) {
    const sessions = await puppeteer.sessions(BROWSER);
    const sessionIds = sessions
      .filter(({ connectionId }) => !connectionId)
      .map(({ sessionId }) => sessionId);
    for (const sessionId of sessionIds) {
      try {
        console.log("Connecting to existing session: ", sessionId);
        browser = await puppeteer.connect(BROWSER, sessionId);
        break;
      } catch (error) {
        console.error(error);
        continue;
      }
    }
    if (!browser) {
      const limitsResp = await puppeteer.limits(BROWSER);
      const activitySessionIds = limitsResp.activeSessions.map(({ id }) => id);
      for (const sessionId of activitySessionIds) {
        try {
          console.log("Connecting to active session: ", sessionId);
          browser = await puppeteer.connect(BROWSER, sessionId);
          break;
        } catch (error) {
          console.error(error);
          continue;
        }
      }
    }
    if (!browser) {
      try {
        console.log("Launching new browser");
        browser = await launch(BROWSER, {
          keep_alive: 600000,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  if (!browser && wsEndpoint) {
    console.log("Connecting to browser using wsEndpoint: ", wsEndpoint);
    try {
      browser = await puppeteer.connect({
        browserWSEndpoint: wsEndpoint,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return browser;
}
