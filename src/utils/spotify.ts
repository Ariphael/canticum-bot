import * as cron from 'node-cron';
import * as path from 'path';
import axios from "axios";
import fs from 'fs';
import puppeteer from 'puppeteer';
import { input } from '@inquirer/prompts';
import { createHash } from 'node:crypto';

export const refreshSpotifyAccessToken = async () => {
  const bodyParams = {
    grant_type: 'refresh_token',
    refresh_token: process.env['SPOTIFY_REFRESH_TOKEN'],
    client_id: process.env['SPOTIFY_API_ID']
  }

  const configParams = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }

  await axios
    .post('https://accounts.spotify.com/api/token', bodyParams, configParams)
    .then(
      response => storeSpotifyAccessToken(response.data.access_token)
    )
    .catch(async (error) => {
      if (error.response !== undefined && error.response.data.error === 'invalid_grant') {
        await refreshTokenRevocationExceptionHandler();
      } else if (error.request) {
        console.log('Network error. Attempting to refresh spotify access token again...');
        refreshSpotifyAccessToken();
      } else {
        console.log(error);
      }
    });
}

export const scheduleHourlySpotifyAccessTokenRenewal = () => {
  const currentMinutes = new Date().getMinutes();
  cron.schedule(`${currentMinutes} * * * *`, async () => {
    console.log("refreshing spotify access token...");
    const bodyParams = {
      grant_type: 'refresh_token',
      refresh_token: process.env['SPOTIFY_REFRESH_TOKEN'],
      client_id: process.env['SPOTIFY_API_ID']
    };

    const configParams = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    await axios
      .post('https://accounts.spotify.com/api/token', bodyParams, configParams)
      .then(response => storeSpotifyAccessToken(response.data.access_token))
      .catch(async (error) => {
        if (error.response && error.response.data.error === 'invalid_grant') {
          await refreshTokenRevocationExceptionHandler();
        }
      });
    
  });
}
 
export const refreshTokenRevocationExceptionHandler = async () => {
  console.log('refreshTokenRevocationExceptionHandler called...');

  const codeChallenge = generateCodeChallenge(process.env['SPOTIFY_CODE_VERIFIER']);
  const userAuthorizationRequestQueryParameters = new URLSearchParams({
    client_id: process.env['SPOTIFY_API_ID'],
    response_type: 'code',
    redirect_uri: process.env['SPOTIFY_REDIRECT_URI'],
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });
  const requestURL = 
    `https://accounts.spotify.com/authorize?${userAuthorizationRequestQueryParameters.toString()}`;

  console.log('Instructions: ');
  console.log(`Please open a browser and go to the URL: ${requestURL}`);
  console.log(
    'Press the accept button, then copy the code parameter in the redirect URI to clipboard'
  );

  const responseAuthCode = await input({
    message: 'Enter authorization code',
  });
  requestAccessToken(responseAuthCode);
}

const requestAccessToken = (authCode: string) => {
  doRequestAccessToken(authCode, 0);
}

const doRequestAccessToken = (authCode: String, attempt: number) => {
  const bodyParams = {
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: process.env['SPOTIFY_REDIRECT_URI'],
    client_id: process.env['SPOTIFY_API_ID'],
    code_verifier: process.env['SPOTIFY_CODE_VERIFIER']
  };

  const configParams = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  axios
    .post('https://accounts.spotify.com/api/token', bodyParams, configParams)
    .then((response) => {
      process.env['SPOTIFY_REFRESH_TOKEN'] = response.data.refresh_token;
      storeSpotifyAccessToken(response.data.access_token);
      console.log('Spotify API refresh and access token updated :)');
    })
    .catch((error) => {
      if (error.response && error.response.data.error === 'invalid_grant') {
        console.log(
          `Please input an unused authorization code. Error ${error.code}: ${error.response.data.error}`
        );
      } else if (error.request) {
        if (attempt === 11) {
          console.log("Attempted 11 times. Requesting access token terminated.");
          return;
        }
        console.log(`Network error occurred. Retrying... (attempt ${attempt + 1}/11)`);
        doRequestAccessToken(authCode, attempt + 1);
      } else {
        console.log('An unexpected error occurred while attempting to request an access token');
        console.log(error);
      }
    });
}

const generateCodeChallenge = (codeVerifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = createHash('sha256')
    .update(data)
    .digest('base64url')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return digest;
}

const storeSpotifyAccessToken = (access_token: string) => {
  const accessTokenJsonString = JSON.stringify({
    spotifyAccessToken: access_token
  });

  fs.writeFile(
    path.join(__dirname, '../../config/spotify.json'), 
    accessTokenJsonString, 
    'utf8', 
    (err) => {
      if (err) throw err;
    }
  );
}