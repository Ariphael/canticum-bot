import { commandData } from './helpCommandsInfo';
import { EmbedBuilder } from 'discord.js';


export const mainHelpEmbed = new EmbedBuilder()
  .setTitle('Help')
  .setAuthor({ name: 'Canticum' })
  .setDescription('List of commands. Usage: /help [command]')
  .addFields(
    { name: 'help (command)', value: 'Displays this page/information about specific command', inline: true },
    { name: 'ping', value: 'Displays bot and API latency in ms', inline: true} ,
    { name: 'connect [target]', value: 'Connects to target voice channel', inline: true },
    { name: 'disconnect', value: 'Disconnects from voice channel', inline: true}, 
    { name: 'queue', value: 'Displays the queue', inline: true }, 
    { name: 'play (link/query)', value: 'Commences playback or appends music to queue', inline: true },
    { name: 'clear', value: 'Clears queue', inline: true },
    { name: 'loop', value: 'Toggles looping for currently playing song/queue', inline: true },
    { name: 'nowplaying', value: 'Display song currently playing', inline: true },
    { name: 'pause', value: 'Pause audio', inline: true },
    { name: 'unpause', value: 'Unpause audio', inline: true },
    { name: 'playlist', value: 'Manage/enqueue personal playlists', inline: true },
    { name: 'remove', value: 'Remove item(s) from queue', inline: true },
    { name: 'shuffle', value: 'Shuffle items in queue', inline: true },
    { name: 'skip', value: 'Skip currently playing song', inline: true },
    { name: 'swap', value: 'Swap 2 items in queue', inline: true },
    { name: 'volume', value: 'Adjust volume of player', inline: true },
    { name: 'history', value: 'Displays history of songs played', inline: true },
  )
  .setTimestamp();

export const getCommandEmbed = (command: String): EmbedBuilder => {
  const commandInfo = commandData.find((data) => data.commandName === command);
  if (commandInfo === undefined) {
    return new EmbedBuilder() 
      .setTitle('Help')
      .setAuthor({ name: 'Canticum' })
      .setDescription('Unknown command. Please use /help to see list of valid commands.')
      .setTimestamp()
      .setFooter({ text: `page 1/1`})  
  }
  return new EmbedBuilder() 
    .setTitle(`${commandInfo.commandOptions}`)
    .setAuthor({ name: 'Canticum' })
    .setDescription(`${commandInfo.commandDescription}`)
    .setTimestamp()
    .setFooter({ text: `page 1/1`})    
};