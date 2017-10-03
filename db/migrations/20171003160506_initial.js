
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('projects', (table) => {
      table.increments('id').primary();
      table.string('projectName').unique();
      table.timestamps(true, true);
  }),

    knex.schema.createTable('colorPalettes', (table) => {
      table.increments('id').primary();
      table.string('paletteName');
      table.array('paleteColors');
      table.integer('project_id').unsigned();
      table.foreign('project_id').references('projects.id')
      table.timestamps(true, true);
    })
  ])
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('projects'),
    knex.schema.dropTable('colorPalettes')
  ])
};
