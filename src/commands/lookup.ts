import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction, EmbedBuilder,
} from 'discord.js';
import embedUtils from '../utils/embed.js';
import minecraftUtils from '../utils/minecraftProfile';
import Names from '../types/names';

const options = [
  {
    name: 'name',
    description: 'The name of the user to lookup',
    type: 1,
    options: [
      {
        name: 'username',
        description: 'The username of the user to lookup',
        type: 3,
      },
    ],
  },
];

export default {
  name: 'lookup',
  description: 'Lookup minecraft users',
  options,

  run: async (interaction: CommandInteraction) => {
    interaction.options.data.forEach(async (index) => {
      if (!interaction.isChatInputCommand()) return;
      switch (index.name) {
        case 'name': {
          const username = interaction.options.getString('username');
          if (!username) { interaction.reply({ embeds: [embedUtils.error('Please provide a username.')] }); return; }
          const user = await minecraftUtils.profile(username);
          if (!user) { interaction.reply({ embeds: [embedUtils.error(`No user found named ${username}`)] }); return; }
          const namesRes = await minecraftUtils.nameHistory(user.id);
          if (!namesRes) { interaction.reply({ embeds: [embedUtils.error('Unknown error')] }); return; }
          const texturesRes = await minecraftUtils.textures(user.id);
          if (!texturesRes) { interaction.reply({ embeds: [embedUtils.error('Unknown error')] }); return; }

          const embed = new EmbedBuilder()
            .setTitle(`${username}'s Profile`)
            .addFields([{ name: 'UUID:', value: user.id }])
            .setImage(`https://crafatar.com/renders/body/${user.id}?overlay`)
            .setColor('Blue');
          try {
            namesRes.forEach((name: Names[0]) => {
              const time = name.changedToAt !== undefined ? new Date(name.changedToAt).toLocaleString('en-US') : 'First Appeared Name';
              embed.addFields([{ name: name.name, value: time }]);
            });
          } catch (e: any) {
            interaction.reply({ embeds: [embedUtils.error(e.toString())] });
            return;
          }
          const row = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setURL(texturesRes.textures.SKIN.url)
              .setLabel('Player skin'),
          ]).addComponents([
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setURL(`https://namemc.com/search?q=${username}`)
              .setLabel('NameMC'),
          ]);
          interaction.reply({ embeds: [embed], components: [row as any] }); // need fix
          return;
        }
        default:
          interaction.reply({ embeds: [embedUtils.error('Please choose something.')] });
      }
    });
  },
};
