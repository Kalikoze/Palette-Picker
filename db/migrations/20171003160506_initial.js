exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('projects', (table) => {
      table.increments('id').primary();
      table.string('projectName').unique();
      table.timestamps(true, true);
  }),
    knex.schema.createTable('palettes', (table) => {
      table.increments('id').primary();
      table.string('paletteName');
      table.string('paletteColor1');
      table.string('paletteColor2');
      table.string('paletteColor3')
      table.string('paletteColor4')
      table.string('paletteColor5')
      table.integer('projectId').unsigned();
      table.foreign('projectId').references('projects.id')
      table.timestamps(true, true);
    })
  ])
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('colorPalettes'),
    knex.schema.dropTable('projects')
  ])
};
