module.exports = {
  fields: {
    name: 'text',
    created: {
      type: 'timestamp',
      default: { $db_function: 'toTimestamp(now())' }
    }
  },
  key: ['name']
};
