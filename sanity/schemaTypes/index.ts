import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {projectType} from './projectType'
import {homeContentType} from './homeContentType'
import {aboutContentType} from './aboutContentType'
import {aboutTimelineItemType} from './aboutTimelineItemType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    projectType,
    homeContentType,
    aboutTimelineItemType,
    aboutContentType,
  ],
}
