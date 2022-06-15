import { CommandInteraction } from 'discord.js';
import capeUtils from '../utils/capes.js';
import discordUtils from '../utils/checkuser.js';
import embedUtils from '../utils/embed.js';
import uuidUtils from '../utils/uuid.js';

export default {
  name: 'capes',
  description: 'Edit capes',
  options: [
    {
      name: 'pull',
      description: 'Pull capes',
      type: 1,
      options: [
        {
          name: 'force',
          description: 'Force overwrite',
          type: 5,
        },
      ],
    },
    {
      name: 'push',
      description: 'Push capes',
      type: 1,
    },
    {
      name: 'add',
      description: 'Add capes',
      type: 1,
      options: [
        {
          name: 'user_id',
          description: 'User ID',
          type: 3,
          required: true,
        },
        {
          name: 'minecraft_username',
          description: 'Minecraft username',
          type: 3,
          required: true,
        },
        /* {
                    name: "cape",
                    description: "Cape",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "Contributor",
                            name: "Contributor cape",
                            value: ""
                        },
                    ]
                } */
      ],
    },
  ],

  run: async (interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;
    interaction.options.data.forEach(async (index) => {
      switch (index.name) {
        case 'pull': {
          const forced: boolean = interaction.options.getBoolean('force') ?? false;
          if(forced === undefined) return await interaction.reply({ embeds: [embedUtils.error("error")]});
          try {
            await capeUtils.pull(forced);
          } catch (e: any) {
            return interaction.reply({ embeds: [embedUtils.error(e?.toString())] });
          }
          return interaction.reply({ embeds: [embedUtils.success("Pulled successfully")] });
        }
        case 'push': {
            await capeUtils.push();
            return interaction.reply({ embeds: [embedUtils.success('Pushed to remote.')] });
        }
        case 'add': {
          const minecraftUsername = interaction.options.getString('minecraft_username');
          if (!minecraftUsername) return interaction.reply({ embeds: [embedUtils.error('Please provide a minecraft name.')] });
          const user = await discordUtils.checkuser(interaction.options.getString('user_id')!);
          if(user === undefined) return interaction.reply({ embeds: [embedUtils.error('Please provide a valid user ID')]});
          const minecraftUUID = await uuidUtils.usernameToUUID(minecraftUsername);
          if (!minecraftUUID) return interaction.reply({ embeds: [embedUtils.error('Invalid username or nonexistent player')] });
          await capeUtils.add(user.id, minecraftUUID);
          return interaction.reply({ embeds: [embedUtils.success(`Added <@${user.id}>, Info: \`\`\`Username: ${minecraftUsername}\nUUID: ${minecraftUUID}\`\`\``)], allowedMentions: { "users": [] } });
        }
        default: return interaction.reply({ embeds: [embedUtils.error('Please choose something.')] });
      }
    });
  },
};
