import { Command } from '../interfaces/command-interface';
import { musicQueue } from '../queue/musicQueue';
import { 
  ApplicationCommandOptionType,
  CacheType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
} from 'discord.js';
import { MusicPlayer } from '../musicplayer/MusicPlayer';
import { getVoiceConnection } from '@discordjs/voice';
import { 
  enqueueSpotifyMusicInfoFromURL, 
  enqueueYouTubeMusicInfoFromURL, 
  getAndEnqueueYouTubeVideoInfoFromNonURLQueryAndUpdateEmbed 
} from './utils/enqueue';

const youtubeURLRegExp = 
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
const spotifyURLRegExp = 
  /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(playlist|track)(?::|\/)((?:[0-9a-zA-Z]){22})/;

const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();

const executePlaySpotifyURLErrorStr = 'Invalid Spotify track URL/id or empty/non-public/non-existent playlist. Please verify that the query is correct.';

export const play: Command = {
  name: 'play',
  description: 'plays or enqueues song',
  options: [{
    type: ApplicationCommandOptionType.String,
    name: 'query',
    description: 'youtube or spotify link or query',
    required: true,
  }],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executePlay(client, interaction);
  }
};

const executePlay = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const embed = new EmbedBuilder();
  const query = interaction.options.getString('query');
  const voiceConnection = getVoiceConnection(interaction.guild.id);

  if (voiceConnection === undefined) {
    embed.setTitle('Error')
      .setDescription('Must be connected to voice channel first!');
    await interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });
    return;
  } 

  // This is a command that might take longer than 3 seconds to respond. For instance, 
  // a substantial amount of time may be consumed by fetching items in a long playlist.
  await interaction.deferReply();

  if (youtubeURLRegExp.test(query)) {
    await executePlayYouTubeURL(_client, interaction, embed);
  } else if (spotifyURLRegExp.test(query)) {
    await executePlaySpotifyURL(_client, interaction, embed);
  } else {
    await executePlayYouTubeQuery(_client, interaction, embed);
  }
};

const executePlayYouTubeURL = async (
  _client: Client, 
  interaction: ChatInputCommandInteraction<CacheType>, 
  embed: EmbedBuilder
) => {
  const query = interaction.options.getString('query');
  const musicQueueOldLength = musicQueue.getLength();

  await enqueueYouTubeMusicInfoFromURL(query, embed);

  if (musicQueueOldLength === 0 && !musicPlayerInstance.isPlayingAudio()) {
    musicPlayerInstance.playAudio();
  }

  await interaction.editReply({ 
    content: '', 
    components: [], 
    embeds: [embed],
  });
}

const executePlaySpotifyURL = async (
  _client: Client, 
  interaction: ChatInputCommandInteraction<CacheType>, 
  embed: EmbedBuilder
) => {
  const query = interaction.options.getString('query');
  const musicQueueOldLength = musicQueue.getLength();

  const musicQueueNewLength = await enqueueSpotifyMusicInfoFromURL(query, embed);
  // if (musicQueueOldLength === musicQueueNewLength) {
  //   return sendErrorMessageToChannel(
  //     executePlaySpotifyURLErrorStr,
  //     interaction,
  //     embed
  //   );
  // }

  if (musicQueueOldLength === 0 && !musicPlayerInstance.isPlayingAudio()) {
    musicPlayerInstance.playAudio();
  }

  await interaction.editReply({ 
    content: '', 
    components: [], 
    embeds: [embed],
  });
}

const executePlayYouTubeQuery = async (  
  _client: Client, 
  interaction: ChatInputCommandInteraction<CacheType>, 
  embed: EmbedBuilder
) => {
  const query = interaction.options.getString('query');
  const musicQueueOldLength = musicQueue.getLength();

  await getAndEnqueueYouTubeVideoInfoFromNonURLQueryAndUpdateEmbed(query, embed);

  if (musicQueueOldLength === 0 && !musicPlayerInstance.isPlayingAudio()) {
    musicPlayerInstance.playAudio();
  }

  await interaction.editReply({ 
    content: '', 
    components: [], 
    embeds: [embed],
  });
}
