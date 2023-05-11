import * as cron from 'node-cron';
import axios from "axios";
import fs from 'fs';
import puppeteer from 'puppeteer';
import { createHash } from 'node:crypto';

const generateCodeChallenge = (codeVerifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = createHash('sha256')
    .update(data)
    .digest('base64url')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  // const digest = await window.crypto.subtle.digest('SHA-256', data);

  return digest;
}

const acquireSpotifyAccessToken = async (auth_code: string): Promise<string> => {
  const bodyParams = {
    grant_type: 'authorization_code',
    code: auth_code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    client_id: process.env.CLIENT_ID,
    code_verifier: process.env.CODE_VERIFIER,
  };
  const spotifyAccessTokenRequestResponse = 
    await axios.post('https://accounts.spotify.com/api/token', bodyParams);

  process.env['REFRESH_TOKEN'] = spotifyAccessTokenRequestResponse.data.refresh_token;
  return spotifyAccessTokenRequestResponse.data.access_token;
}

const storeSpotifyAccessToken = (access_token: string) => {
  const accessTokenJsonString = JSON.stringify({
    spotifyAccessToken: access_token
  });

  fs.writeFile('../config/config.json', accessTokenJsonString, 'utf8', (err) => {
    if (err) throw err;
  });
}

const scheduleHourlySpotifyAccessTokenRenewal = () => {
  const currentMinutes = new Date().getMinutes();
  cron.schedule(`${currentMinutes} * * * *`, async () => {
    console.log("refreshing spotify access token...");
    const bodyParams = {
      grant_type: 'refresh_token',
      refresh_token: process.env['SPOTIFY_REFRESH_TOKEN'],
      client_id: process.env['SPOTIFY_API_ID']
    } 

    axios.post('https://accounts.spotify.com/api/token', 
        bodyParams, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
    )
      .then(
        response => storeSpotifyAccessToken(response.data.access_token),
        reason => {
          if (reason.error === 'invalid_grant') {
            //... refreshTOkenRevocationExceptionHandler
          }
        }
      );
    
  });
}

const refreshTokenRevocationExceptionHandler = async () => {
  const codeChallenge = generateCodeChallenge(process.env['SPOTIFY_CODE_VERIFIER']);
  const userAuthorizationRequestQueryParameters = new URLSearchParams({
    client_id: process.env['SPOTIFY_API_ID'],
    response_type: 'code',
    redirect_uri: process.env['SPOTIFY_REDIRECT_URI'],
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });
  const requestURL = 
    `https://api.spotify.com/authorize?${userAuthorizationRequestQueryParameters.toString()}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(requestURL);
  await page.click('body >>> [data-testid=auth-accept]');

  const redirect_uri_code_parameter = new URL(page.url()).searchParams.get('code');

  const newAccessToken: string | null = await axios.post(
      'https://accounts.spotify.com/api/token', {
        grant_type: 'authorization_code',
        code: redirect_uri_code_parameter,
        redirect_uri: process.env['SPOTIFY_REDIRECT_URI'],
        client_id: process.env['SPOTIFY_API_ID'],
        code_verifier: process.env['SPOTIFY_CODE_VERIFIER']
      })
    .then(
      response => {
        process.env['SPOTIFY_REFRESH_TOKEN'] = response.data.refresh_token;
        return response.data.access_token;
      },
      reason => {
        console.error(`${reason.error}: ${reason.error_description}`);
        return null;
      });
  
  return newAccessToken;
}