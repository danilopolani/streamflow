import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { encode as querystring } from 'node:querystring';
import { URL } from 'node:url';
import crypto from 'node:crypto';
import { Twitch } from './workers/Twitch';
import { log } from './logger';
import { HTTP_SERVER_PORT } from '~shared/global';

export class HttpServer {
  private twitchAuthState = '';
  private twitchRedirectUri: string;

  constructor() {
    this.twitchRedirectUri = `http://localhost:${HTTP_SERVER_PORT}/auth/twitch/callback`;

    this.startServer();
  }

  static init() {
    return new HttpServer();
  }

  private startServer() {
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const currentUrl = new URL(req.url!, `http://${req.headers.host}`);

      switch (currentUrl.pathname) {
        case '/':
          res.writeHead(200);
          res.end('<div style="text-align:center;margin-top:50px"><h1>Oh hey there</h1><img src="https://cdn.7tv.app/emote/60b5689c96929aeb07332f21/4x.webp" width="300"></div>');
          break;
        case '/auth/twitch/redirect': {
          this.twitchAuthState = crypto.randomBytes(16).toString('hex');

          const authorizeUrl = 'https://id.twitch.tv/oauth2/authorize?' + querystring({
            client_id: process.env.TWITCH_CLIENT_ID,
            redirect_uri: this.twitchRedirectUri,
            response_type: 'code',
            state: this.twitchAuthState,
            scope: Twitch.getScopes().join(' '),
          });

          res.writeHead(302, {
            location: authorizeUrl,
          });
          res.end();
          break;
        }
        case '/auth/twitch/callback': {
          if (currentUrl.searchParams.get('state') !== this.twitchAuthState) {
            res.writeHead(400);
            res.end('State failure');

            return;
          }

          try {
            Twitch.finalizeAuth(currentUrl.searchParams.get('code')!, this.twitchRedirectUri);
          } catch (err) {
            res.writeHead(400);
            res.end('Something went wrong: ' + (err as Error).message);

            return;
          }

          res.writeHead(200);
          res.end('<div style="text-align:center;margin-top:50px"><h1>You can close this page and go back to Streamflow</h1><img src="https://cdn.7tv.app/emote/62ec1cfdd2e11183867d8c3b/4x.webp" width="300"></div>');
          break;
        }
        default:
          res.writeHead(404);
          res.end('Not found');
      }
    });

    server.listen(HTTP_SERVER_PORT, 'localhost', function () {
      log.silly('%c[HTTP Server] %cListening on http://localhost:' + HTTP_SERVER_PORT, 'color: cyan', 'color: unset');
    });
  }
}
