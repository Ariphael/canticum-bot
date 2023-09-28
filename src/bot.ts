import fs from 'fs';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { addReadyEventToClient } from './events/ready';
import { addInteractionCreateEventToClient } from './events/interactionCreate';
import { Command } from './interfaces/command-interface';
import { refreshSpotifyAccessToken, scheduleHourlySpotifyAccessTokenRenewal } from './utils/spotify';
import { MusicPlayer } from './musicplayer/MusicPlayer';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

export const startCanticum = async (client: Client<boolean>) => {
  console.log('Bot is starting...');

  console.log('Refreshing spotify access token...');
  await refreshSpotifyAccessToken();
  scheduleHourlySpotifyAccessTokenRenewal();

  const commandCollection = await getCommands();
  setupCleanupActionOnExit();
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

const setupCleanupActionOnExit = () => {
  process.on('exit', () => MusicPlayer.getMusicPlayerInstance().stopAudioPlayer());
  process.on('SIGINT', () => MusicPlayer.getMusicPlayerInstance().stopAudioPlayer());
}

startCanticum(client);
