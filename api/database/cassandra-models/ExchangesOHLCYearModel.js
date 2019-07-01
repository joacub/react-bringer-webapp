module.exports = {
  fields: {
    time: 'timestamp',
    low: 'float',
    hight: 'float',
    open: 'float',
    close: 'float',
    volume: 'float',
    market_id: 'text',
    exchange: 'text',
    created: {
      type: 'timestamp',
      default: { $db_function: 'toTimestamp(now())' }
    }
  },
  key: [['time'], 'exchange', 'market_id', 'low', 'hight', 'open', 'close', 'volume']
};
