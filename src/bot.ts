import { Client, GatewayIntentBits } from 'discord.js';
// import { token } from './config.json';
const token = '0123456789'; // fake token
import { ready } from './listeners/ready';
import { interactionCreate } from './listeners/interactionCreate';

export const startCanticum = async (client: Client<boolean>) => {
  console.log('Bot is starting...');

  ready(client);
  interactionCreate(client);

  await client.login(token);
};

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

startCanticum(client);
