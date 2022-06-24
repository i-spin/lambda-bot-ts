import { EmbedBuilder } from 'discord.js';

const error = (msg: string) => new EmbedBuilder()
  .setTitle('Error')
  .addFields([{ name: 'Info', value: `${msg}` }])
  .setColor('Red');

const success = (msg: string) => new EmbedBuilder()
  .setTitle('Success')
  .addFields([{ name: 'Info', value: `${msg}` }])
  .setColor('Green');

const embedUtils = {
  error,
  success,
};

export default embedUtils;
