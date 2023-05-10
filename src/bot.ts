import fs from 'fs';
import * as dotenv from 'dotenv';
import * as cron from 'node-cron';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { addReadyEventToClient } from './events/ready';
import { addInteractionCreateEventToClient } from './events/interactionCreate';
import { Command } from './interfaces/command-interface';
import axios from 'axios';

dotenv.config();

var refresh_token;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

export const startCanticum = async (client: Client<boolean>) => {
  console.log('Bot is starting...');

  const spotify_access_token = await acquireSpotifyAccessToken();
  storeSpotifyAccessToken(spotify_access_token);
  scheduleHourlySpotifyAccessTokenRenewal();
  const commandCollection = await getCommands();
  addReadyEventToClient(client, commandCollection);
  addInteractionCreateEventToClient(client, commandCollection);

  await client.login(process.env.DISCORD_TOKEN);
};

const getCommands = async (): Promise<Collection<string, Command>> => {
  const commandCollection = new Collection<string, Command>();

  const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.ts'));

  commandFiles.forEach((commandFile) => {
    const command: { commandData: Command } = require(`./commands/${commandFile}`);
    const commandObj: Command = command[Object.keys(command)[0]];
    commandCollection.set(commandObj.name, commandObj);
  });

  return commandCollection;
};

const scheduleHourlySpotifyAccessTokenRenewal = () => {
  const currentMinutes = new Date().getMinutes();
  cron.schedule(`${currentMinutes} * * * *`, () => {
    console.log("refreshing spotify access token...");
    const bodyParams = {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: process.env.SPOTIFY_API_ID
    }
    const spotifyAccessTokenRenewalRequestResponse = 
      axios.post('https://accounts.spotify.com/api/token', 
        bodyParams, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
        .then(response => storeSpotifyAccessToken(response.data.access_token));
    
  });
}

const acquireSpotifyAccessToken = async (): Promise<string> => {
  const spotifyAccessTokenRequestResponse =
    await axios.post(
      `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${process.env.SPOTIFY_AUTH_CODE}&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&client_id=${process.env.SPOTIFY_API_ID}&code_verifier=${process.env.CODE_VERIFIER}`
    );

  refresh_token = spotifyAccessTokenRequestResponse.data.refresh_token;
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

startCanticum(client);
