module.exports = {
  fields: {
    market_id: 'text',
    symbol: 'text',
    limits: {
      type: 'frozen',
      typeDef: '<marketlimits>'
    },
    precision: {
      type: 'frozen',
      typeDef: '<marketprecision>'
    },
    tierBased: 'boolean',
    percentage: 'boolean',
    taker: 'float',
    maker: 'float',
    base: 'text',
    quote: 'text',
    active: 'boolean',
    info: 'text',
    exchange: 'text',
    created: {
      type: 'timestamp',
      default: { $db_function: 'toTimestamp(now())' }
    }
  },
  key: [['market_id'], 'exchange', 'symbol']
};
