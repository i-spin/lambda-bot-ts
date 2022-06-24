import ms from 'ms';
import { Client, CommandInteraction, EmbedBuilder } from 'discord.js';
import size from '../utils/bytes';
import listPlugins from '../utils/plugins';

export default {
  name: 'plugins',
  description: 'Check plugin list',
  timeout: ms('30s'),

  run: async (interaction: CommandInteraction, _client: Client) => {
    const pluginList = (await listPlugins.listPlugins()).data;
    const pluginEmbed = new EmbedBuilder().setTitle('Plugins Informations');
    pluginList.forEach((plugin) => {
      pluginEmbed.addFields([{
        name: plugin.name,
        value:
          `Stargazers: ${plugin.stargazers_count}\n
                Watchers: ${plugin.watchers_count}\n
                Issues: ${plugin.open_issues_count}\n
                Size: ${size(plugin.size as number)}\n
                [Repository](${plugin.html_url})`,
        inline: true,
      }]);
    });
    return interaction.reply({ embeds: [pluginEmbed] });
  },
};
