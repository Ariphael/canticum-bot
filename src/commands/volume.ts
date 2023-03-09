import { Client, ChatInputCommandInteraction, CacheType, Application, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../interfaces/command-interface";
import { MusicPlayer } from "../musicplayer/MusicPlayer";

const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();

export const volume: Command = {
  name: 'volume',
  description: 'set the volume of the audio resource',
  options: [{
    type: ApplicationCommandOptionType.Number,
    name: 'vol',
    description: 'number between 0 and 1 representing the new volume of the resource',
  }],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeVolume(client, interaction);
  }
}

const executeVolume = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const volOption = interaction.options.getNumber('vol');
  const embed = new EmbedBuilder();
  if (volOption < 0 || volOption > 1) {
    embed.setTitle('Error')
      .setDescription('vol must be between 0 and 1.');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  const setVolumeSuccessFlag = musicPlayerInstance.setVolume(volOption);
  embed.setTitle(setVolumeSuccessFlag ? 'Volume' : 'Error')
    .setDescription(setVolumeSuccessFlag 
      ? `Successfully set audio resource volume to ${volOption}`
      : 'Failed to modify volume of audio resource');
  await interaction.reply({
    content: '',
    components: [],
    embeds: [embed],
    ephemeral: setVolumeSuccessFlag,
  });
};