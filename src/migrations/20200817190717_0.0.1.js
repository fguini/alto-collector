exports.up = function(knex) {
  return knex.schema
    .createTable('device', function(table) {
      table
        .string('id', 255)
        .primary()
        .notNullable();
      table.string('machineId', 255).notNullable();
      table.bigInteger('organizationId');
      table.bigInteger('configurationProfileId');
      table.unique(['id', 'machineId']);
    })
    .createTable('usage', function(table) {
      table.increments('id').primary();
      table
        .datetime('createdAt')
        .defaultTo(new Date())
        .notNullable();
      table.string('data').notNullable();
      table.unique(['id']);
      table.index('createdAt', 'usageCreatedAt');
    })
    .createTable('setting', function(table) {
      table.string('key').primary();
      table.string('value').notNullable();
      table.unique(['key']);
      table.index('key');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('device')
    .dropTable('usage')
    .dropTable('setting');
};
