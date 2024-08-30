import ky from "ky";
const url = "https://notify-api.line.me/api/notify";

export async function lineNotify(
    params: {
      message: string;
      token: string;
      // 画像送信のため、なくてもおけ(URL)
      imageThumbnailURL?: string;
      imageFullsizeURL?: string;
    },
  ) {
    const { message, token, imageThumbnailURL, imageFullsizeURL } = params;
    // 内容とトークンcheck
    if (!message || !token) {
      throw new Error("Missing message or token");
    }
  
    const body = new URLSearchParams();
    body.set("message", message);
    // もし画像があれば
    if (imageThumbnailURL) {
      // URLを検証する
      new URL(imageThumbnailURL);
      body.set("imageThumbnail", imageThumbnailURL);
    }
    // もしフルサイズ画像があれば
    if (imageFullsizeURL) {
      // URLを検証する
      new URL(imageFullsizeURL);
      body.set("imageFullsize", imageFullsizeURL);
    }
  
    try {
      const headers = { Authorization: `Bearer ${token}` };
      return await ky.post(url, { headers, body }).json();
    } catch (error) {
      console.error(`${error}`);
      return error;
      // return await error.response.json();
    }
  }