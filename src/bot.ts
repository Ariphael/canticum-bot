import { Client, GatewayIntentBits } from 'discord.js';
import { token } from './config.json';
// const token = '0123456789'; // fake token
import { ready } from './listeners/ready';
import { interactionCreate } from './listeners/interactionCreate';

console.log('Bot is starting...');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

ready(client);
interactionCreate(client);

client.login(token);
