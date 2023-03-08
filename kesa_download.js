import fetch from 'node-fetch'
import HttpsProxyAgent from 'https-proxy-agent'
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';


async function main() {
  const proxy = new HttpsProxyAgent('http://proxy.occ.co.jp:8080')
  const podcast_url = "https://omny.fm/shows/program-21/playlists/podcast.rss"
  const podcast_response = await fetch(podcast_url, { agent: proxy })
  const podcast_text = await podcast_response.text()
  const options = {
    ignoreAttributes: false,
    format: true,
  };
  const parser = new XMLParser(options);
  const podcast_object = parser.parse(podcast_text);
  //console.log(podcast_text)
  for (const index in podcast_object.rss.channel.item) {
    const item = podcast_object.rss.channel.item[index];
    const filename = date2filename(item.pubDate);
    //console.log('curl -C -o mp3/%s "%s"', filename, item["media:content"][0]["@_url"]);
    const agent = 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
    console.log('curl -L -o mp3/%s "%s"', filename, item["media:content"][0]["@_url"]);
  }
}

function date2filename(date_string) {
  const date = new Date(Date.parse(date_string));
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return 'kesa' + year + month + day + ".mp3"
}
main()
