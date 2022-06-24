import { Client, CommandInteraction, EmbedBuilder } from 'discord.js';
import ms from 'ms';

const options = [
  {
    name: 'ask',
    description: 'Creates a thread for your question', // the duplication annoys me
    type: 1,
    options: [
      {
        name: 'question',
        description: 'Question',
        type: 3,
        required: true,
      },
    ],
  },
];

export default {
  name: 'ask',
  description: 'Creates a thread for your question',
  options,
  timeout: ms('5m'),
  run: async (interaction: CommandInteraction, _client: Client) => {
    if (!interaction.isChatInputCommand()) return;
    const embed = new EmbedBuilder()
      .setTitle(`${interaction.member?.user.username} asked:`)
      .setDescription(interaction.options.getString('question') ?? 'No question provided')
      .setColor('Aqua');
    const sent = await interaction.channel?.send({ embeds: [embed] });
    sent?.startThread({
      name: `${interaction.member?.user.username}'s question`,
    });
  },
};
