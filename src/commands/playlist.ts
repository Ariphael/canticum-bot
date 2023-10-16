import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";
import { Command } from "../interfaces/command-interface";
import { subcommandMapper } from "./utils/playlist/subcommand";

export const playlist: Command = {
    name: 'playlist',
    description: 'create, remove, modify and delete playlists',
    options: [{
        type: ApplicationCommandOptionType.Subcommand,
        name: 'view',
        description: 'display playlists created by issuer of command'
    }, {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'info', 
        description: 'displays info about specific playlist',
        options: [{
            type: ApplicationCommandOptionType.String,
            name: 'name',
            description: 'name of playlist',
            required: true
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
            description: 'youtube or spotify link or query',
            required: true,
        }, {
            type: ApplicationCommandOptionType.Integer, 
            name: 'position',
            description: 'position in queue to replace',
            required: false
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
    }],
    run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>) => await executePlaylist(client, interaction)
}

const executePlaylist = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
    const embed = new EmbedBuilder();
    const subcommand = interaction.options.getSubcommand();

    const subcommandFunction: (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => void
      = subcommandMapper[subcommand];

    subcommandFunction(interaction, embed);
}