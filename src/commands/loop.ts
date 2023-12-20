import { getVoiceConnection } from "@discordjs/voice";
import { 
  Client, 
  ChatInputCommandInteraction, 
  CacheType, 
  EmbedBuilder, 
  ApplicationCommandOptionType 
} from "discord.js";
import { Command } from "../interfaces/command-interface";
import { MusicPlayer } from "../musicplayer/MusicPlayer";

const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();

export const loop: Command = {
  name: 'loop',
  description: 'loops the current playing song/playlist',
  options: [{
      type: ApplicationCommandOptionType.Subcommand,
      name: 'currsong',
      description: 'loop the current playing song (dequeue operations apply if using /skip !!!)',
    }, {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'queue',
      description: 'loop the queue (can use /skip without dequeue operation occurring)',
      options: [{
        type: ApplicationCommandOptionType.Boolean,
        name: 'append',
        description: 'append the current playing song (if any) to the queue?',
        required: false,
      }]
    }, {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'off',
      description: 'turns off looping'
    }
  ],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeLoop(client, interaction);
  }
};

const executeLoop = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const embed = new EmbedBuilder();
  const subcommand = interaction.options.getSubcommand();

  if (getVoiceConnection(interaction.guild!.id) === undefined) {
    embed.setTitle('Error')
      .setDescription('There is no established voice connection!');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: embed.data.title === 'Error',
    });   
  }

  if (subcommand === 'currsong') {
    await executeLoopCurrSong(interaction, embed);
  } else if (subcommand === 'queue') {
    await executeLoopQueue(interaction, embed);
  } else if (subcommand === 'off') {
    await executeLoopOff(interaction, embed);
  }
};

const executeLoopCurrSong = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  if (musicPlayerInstance.getCurrentPlayingSongInfo() === undefined) {
    embed.setTitle('Error')
      .setDescription('No song to loop');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: true,      
    });
    return;
  }

  musicPlayerInstance.switchToLoopCurrSongState();
  embed.setTitle('Loop')
    .setDescription(`Looping song ${musicPlayerInstance.getCurrentPlayingSongInfo()!.musicTitle}`);
  await interaction.reply({
    content: '',
    components: [],
    embeds: [embed],
  });  
};

const executeLoopQueue = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  musicPlayerInstance.switchToLoopQueueState();
  embed.setTitle('Loop')
    .setDescription(`Looping queue`);
  await interaction.reply({
    content: '',
    components: [],
    embeds: [embed],
  });  
};

const executeLoopOff = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  musicPlayerInstance.switchToNormalState();
  embed.setTitle('Loop')
    .setDescription(`Looping turned off`);
  await interaction.reply({
    content: '',
    components: [],
    embeds: [embed],
  });  
};