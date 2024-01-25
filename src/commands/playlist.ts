import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";
import { Command } from "../interfaces/command-interface";
import { subcommandMapper } from "./playlist/subcommand";

export const playlist: Command = {
  name: 'playlist',
  description: 'create, remove, modify and delete playlists',
  options: [{
    type: ApplicationCommandOptionType.Subcommand,
    name: 'view',
    description: 'display playlists created by issuer of command'
  }, {
    type: ApplicationCommandOptionType.Subcommand,
    name: 'content', 
    description: 'displays content of specific playlist',
    options: [{
      type: ApplicationCommandOptionType.String,
      name: 'name',
      description: 'name of playlist',
      required: true,
    }, {
      type: ApplicationCommandOptionType.Integer, 
      name: 'page',
      description: 'page of command',
      required: false
    }]
  }, {
    type: ApplicationCommandOptionType.Subcommand, 
    name: 'create',
    description: 'create a playlist',
    options: [{
      type: ApplicationCommandOptionType.String,
      name: 'name',
      description: 'unique name of new playlist',
      required: true
    }]
  }, {
    type: ApplicationCommandOptionType.Subcommand, 
    name: 'delete',
    description: 'delete a playlist',
    options: [{
      type: ApplicationCommandOptionType.String, 
      name: 'name',
      description: 'name of existing playlist',
      required: true
    }]
  }, {
    type: ApplicationCommandOptionType.Subcommand,
    name: 'rename',
    description: 'rename an existing playlist',
    options: [{
      type: ApplicationCommandOptionType.String,
      name: 'name',
      description: 'name of existing playlist',
      required: true,
    }, {
      type: ApplicationCommandOptionType.String,
      name: 'newname',
      description: 'new name for exisitng playlist',
      required: true,
    }]
  }, {
    type: ApplicationCommandOptionType.Subcommand,
    name: 'additem',
    description: 'add item to a playlist',
    options: [{
      type: ApplicationCommandOptionType.String, 
      name: 'name',
      description: 'name of playlist',
      required: true,
    }, {
      type: ApplicationCommandOptionType.String,
      name: 'query',
      description: 'youtube url or song name',
      required: true,
    }, {
      type: ApplicationCommandOptionType.Integer, 
      name: 'position',
      description: 'position in playlist to insert',
      required: false,
    }]
  }, {
    type: ApplicationCommandOptionType.Subcommand, 
    name: 'removeitem', 
    description: 'remove item from a playlist',
    options: [{
      type: ApplicationCommandOptionType.String,
      name: 'name',
      description: 'name of playlist',
      required: true,
    }, {
      type: ApplicationCommandOptionType.Integer,
      name: 'position',
      description: 'position of item in playlist',
      required: true,
    }]
  }, {
    type: ApplicationCommandOptionType.Subcommand,
    name: 'import',
    description: 'import a playlist from youtube',
    options: [{
      type: ApplicationCommandOptionType.String,
      name: 'name',
      description: 'name of playlist',
      required: true,
    }, {
      type: ApplicationCommandOptionType.String,
      name: 'url',
      description: 'youtube url of playlist',
      required: true,
    }],
  }, {
    type: ApplicationCommandOptionType.Subcommand,
    name: 'load',
    description: 'append content of playlist to queue',
    options: [{
      type: ApplicationCommandOptionType.String,
      name: 'name',
      description: 'name of playlist',
      required: true,
    }]
  }],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>) => await executePlaylist(client, interaction)
}

const executePlaylist = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const embed = new EmbedBuilder();
  const subcommand = interaction.options.getSubcommand();  
  const subcommandFunction: (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => Promise<void>
    = subcommandMapper[subcommand]; 
  await subcommandFunction(interaction, embed);
}