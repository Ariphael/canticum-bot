import * as db from '../utils/database';
import { Client, ChatInputCommandInteraction, CacheType, Application, ApplicationCommandOptionType, EmbedBuilder, userMention } from "discord.js";
import { Command } from "../interfaces/command-interface";

const resultsPerPage = 5;

export const history: Command = {
  name: "history",
  description: "display history of songs played or enqueued",
  options: [{
    type: ApplicationCommandOptionType.Subcommand,
    name: "play",
    description: "history of songs played",
    options: [{
      type: ApplicationCommandOptionType.Integer,
      name: "page",
      description: "page number",
      required: false,
    }, {
      type: ApplicationCommandOptionType.Boolean,
      name: "personal",
      description: "only show songs issuer of command enqueued",
      required: false,
    }]
  }, {
    type: ApplicationCommandOptionType.Subcommand,
    name: "queue",
    description: "history of songs enqueued",
    options: [{
      type: ApplicationCommandOptionType.Integer,
      name: "page",
      description: "page number",
      required: false,
    }, {
      type: ApplicationCommandOptionType.Boolean,
      name: "personal",
      description: "only show songs issuer of command enqueued",
      required: false,
    }]
  }],
  run: async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeHistory(client, interaction);
  }
}

const executeHistory = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>) => {
  const embed = new EmbedBuilder();
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'play')
    await executeHistoryPlay(client, interaction, embed);
  else if (subcommand === 'queue')
    await executeHistoryQueue(client, interaction, embed);
}

const executeHistoryPlay = async (_client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const personalOption = interaction.options.get('personal') 
    ? interaction.options.get('personal').value as boolean
    : false;
  const pageOption = interaction.options.get('page')
    ? Math.max(0, (interaction.options.get('page').value as number) - 1)
    : 0;

  const dequeueHistoryQueryResult = personalOption
    ? await db.query(
      'SELECT eh.title AS title, eh.uploader AS uploader, eh.originalURL AS url, eh.userId AS memberId, dh.playTimestamp AS timestamp FROM dequeue_history AS dh INNER JOIN enqueue_history AS eh ON dh.enqueueHistoryId = eh.id ORDER BY dh.playTimestamp DESC'
    )
    : await db.query(
      `SELECT eh.title AS title, eh.uploader AS uploader, eh.originalURL AS url, eh.userId AS memberId, dh.playTimestamp AS timestamp FROM dequeue_history AS dh INNER JOIN enqueue_history AS eh ON dh.enqueueHistoryId = eh.id AND eh.userId = ? ORDER BY playTimestamp DESC`,
      [memberId]
    );
  
  if (dequeueHistoryQueryResult.length === 0) {
    embed.setTitle('Error')
      .setDescription(personalOption
        ? 'You have not enqueued any song that has played.'
        : 'No history to show. Enqueue a song with /play')
      .setTimestamp();
    return interaction.reply({ content: '', components: [], embeds: [embed] });
  }
  const historyMaxPage = Math.ceil(dequeueHistoryQueryResult.length / resultsPerPage);
  const pageNumber = pageOption <= 0 ? 1 : Math.min(pageOption + 1, historyMaxPage);
  const startResultIndex = Math.min(historyMaxPage - 1, pageOption) * resultsPerPage;

  embed.setTitle('History')
    .setDescription(
      `History of music played ${personalOption ? `(Only songs enqueued by ${userMention(memberId)}) ` : ''}(${resultsPerPage} items per page)`
    );

  Array.from(dequeueHistoryQueryResult.slice(startResultIndex, startResultIndex + resultsPerPage))
    .forEach((result, index) => {
      embed.addFields({
        name: `${index + startResultIndex + 1}.`,
        value: `Title: ${result.title}\nEnqueued by: ${userMention(result.memberId)}\nPlayed on: ${result.timestamp}}`
      });
    });
  
  embed.setTimestamp()
    .setFooter({
      text: `Page ${pageNumber}/${historyMaxPage}`
    });
  
  return interaction.reply({ content: '', components: [], embeds: [embed] });
}

const executeHistoryQueue = async (_client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const pageOption = interaction.options.get('page')
    ? Math.max(0, (interaction.options.get('page').value as number) - 1)
    : 0;
  const personalOption = interaction.options.get('personal')
    ? interaction.options.get('personal').value as boolean
    : false;

  const enqueueHistoryQueryResult = personalOption
    ? await db.query(
      'SELECT title, uploader, originalURL, userId, enqueueTimestamp FROM enqueue_history WHERE userId = ? ORDER BY enqueueTimestamp DESC',
      [memberId]
    )
    : await db.query(
      'SELECT title, uploader, originalURL, userId, enqueueTimestamp FROM enqueue_history ORDER BY enqueueTimestamp DESC'
    );

  if (enqueueHistoryQueryResult.length === 0) {
    embed.setTitle('Error')
      .setDescription(personalOption
        ? 'You have no enqueued any song. Enqueue a song with /play'
        : 'No queue history to show.');
    return interaction.reply({ content: '', components: [], embeds: [embed] });
  }

  const historyMaxPage = Math.ceil(enqueueHistoryQueryResult.length / resultsPerPage);
  const pageNumber = pageOption <= 0 ? 1 : Math.min(pageOption + 1, historyMaxPage);
  const startResultIndex = Math.min(historyMaxPage - 1, pageOption) * resultsPerPage;

  embed.setTitle('History')
    .setDescription(
      `History of songs enqueued ${personalOption ? `by ${userMention(memberId)} ` : ''}(${resultsPerPage} items per page)`
    );

  Array.from(enqueueHistoryQueryResult.slice(startResultIndex, startResultIndex + resultsPerPage))
    .forEach((result, index) => {
      embed.addFields({
        name: `${index + startResultIndex + 1}.`,
        value: `Title: ${result.title}\nEnqueued by: ${userMention(memberId)}\nEnqueue date: ${result.enqueueTimestamp}`
      });
    });

  embed.setTimestamp()
    .setFooter({
      text: `Page ${pageNumber}/${historyMaxPage}`
    });

  return interaction.reply({ content: '', components: [], embeds: [embed] });
}