import fs from 'fs';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { token } from './config.json';
// const token = '0123456789'; // fake token
import { ready } from './listeners/ready';
import { interactionCreate } from './listeners/interactionCreate';
import { Command } from './interfaces/command-interface';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

export const startCanticum = async (client: Client<boolean>) => {
  console.log('Bot is starting...');

  const commandCollection = await getCommands();
  ready(client, commandCollection);
  interactionCreate(client, commandCollection);

  await client.login(token);
};

const getCommands = async (): Promise<Collection<string, Command>> => {
  const commandCollection = new Collection<string, Command>();

  const commandFiles = fs.readdirSync("./src/commands").filter((file) => file.endsWith(".ts"));

  commandFiles.forEach((commandFile) => {
    const command: { commandData: Command } = require(`./commands/${commandFile}`);
    const commandObj: Command = command[Object.keys(command)[0]];
    commandCollection.set(commandObj.name, commandObj);
  });

  return commandCollection;
};

startCanticum(client);
