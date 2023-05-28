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
  enqueueMusicSpotify, 
  enqueueMusicYouTube, 
  enqueueMusicYouTubeNonURLQuery
} from './utils/queue';

const youtubeURLRegExp = 
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
const spotifyURLRegExp = 
  /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(playlist|track)(?::|\/)((?:[0-9a-zA-Z]){22})/;

const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();

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
  const query = interaction.options.getString('query');
  const voiceConnection = getVoiceConnection(interaction.guild.id);
  const musicQueueOldLength = musicQueue.getLength();

  if (voiceConnection === undefined) {
    const embed = new EmbedBuilder()
      .setTitle('Error')
      .setDescription('Must be connected to voice channel first!');
    await interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });
    return;
  } 

  // This is a command that might take longer than 3 seconds to respond. For instance, 
  // a substantial amount of time may be consumed by fetching items in a long playlist.
  await interaction.deferReply();

  const isQueryYouTubeURL = youtubeURLRegExp.test(query);
  const isQuerySpotifyURL = spotifyURLRegExp.test(query);

  const embed: EmbedBuilder = isQueryYouTubeURL
    ? await enqueueMusicYouTube(query)
    : (isQuerySpotifyURL
      ? await enqueueMusicSpotify(query)
      : await enqueueMusicYouTubeNonURLQuery(query));

  if (musicQueueOldLength === 0 && !musicPlayerInstance.isPlayingAudio()) {
    musicPlayerInstance.playAudio();
  }

  await interaction.editReply({ 
    content: '', 
    components: [], 
    embeds: [embed],
  });
}