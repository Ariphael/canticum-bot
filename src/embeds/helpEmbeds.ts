import { commandData } from './helpCommandsInfo';
import { EmbedBuilder } from 'discord.js';

export const numPages = 2;
export const embeds: EmbedBuilder[] = [
  new EmbedBuilder() 
    .setColor(0x0099FF)
    .setTitle('Help')
    .setAuthor({ name: 'Canticum' })
    .setDescription('List of essential commands. Usage: /help [command]')
    .addFields(
      { name: 'help (command)', value: 'Displays this page/information about specific command', inline: true },
      { name: 'ping', value: 'Displays bot and API latency in ms', inline: true} ,
      { name: 'connect [target]', value: 'Connects to target voice channel', inline: true },
      { name: 'disconnect', value: 'Disconnects from voice channel', inline: true}, 
      { name: 'queue', value: 'Displays the queue', inline: true }, 
      { name: 'play [link/query]', value: 'Plays/adds music to queue. Searches on youtube.', inline: true },
      { name: 'clear', value: 'clears queue', inline: true },
    )
    .setTimestamp()
    .setFooter({ text: `page 1/${numPages}`}), 
  new EmbedBuilder() 
    .setColor(0x0099FF)
    .setTitle('Help')
    .setAuthor({ name: 'Canticum' })
    .setDescription('Test page. Usage: /help [command]')
    .setTimestamp()
    .setFooter({ text: `page 2/${numPages}`})    
];

export const getCommandEmbed = (command: String): EmbedBuilder => {
  const commandInfo = commandData.find((data) => data.commandName === command);
  if (commandInfo === undefined) {
    return new EmbedBuilder() 
      .setColor(0x0099FF)
      .setTitle('Help')
      .setAuthor({ name: 'Canticum' })
      .setDescription('Unknown command. Please use /help to see list of valid commands.')
      .setTimestamp()
      .setFooter({ text: `page 1/1`})  
  }
  return new EmbedBuilder() 
    .setColor(0x0099FF)
    .setTitle(`${commandInfo.commandOptions}`)
    .setAuthor({ name: 'Canticum' })
    .setDescription(`${commandInfo.commandDescription}`)
    .setTimestamp()
    .setFooter({ text: `page 1/1`})    
};