import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes/schemas/schema'

export default defineConfig({
  name: 'default',
  title: 'Billettlyst',

  projectId: 'ds0qm7um',
  dataset: 'backend',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
